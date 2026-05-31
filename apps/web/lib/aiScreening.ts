import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@trades/db'

// AI Content Screening Service
// Uses Claude Sonnet to evaluate content quality and domain relevance.
// Runs asynchronously after content submission — does not block the user.
//
// Two scores are produced:
//   quality_score  (0.0–1.0): depth, clarity, practical value
//   domain_score   (0.0–1.0): relevance to the declared trade/topic
//
// Content with quality_score < 0.35 OR domain_score < 0.40 is flagged
// for human review rather than auto-published.

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT_VERSION = '1.0.0'

interface ScreeningInput {
  contentId: string
  title?: string
  body: string
  tradeId?: string
  tradeName?: string
}

interface ScreeningResult {
  qualityScore: number
  domainScore: number
  flags: string[]
  shouldPublish: boolean
  rawResponse: string
}

export async function screenContent(input: ScreeningInput): Promise<ScreeningResult> {
  const { contentId, title, body, tradeName = 'skilled trades' } = input

  const titleSection = title ? `\nTITLE:\n"""\n${title}\n"""\n` : ''

  const prompt = `You are a quality reviewer for a professional knowledge platform
serving Canada's skilled trades workers.

Review the following contribution posted in the "${tradeName}" community.
${titleSection}
CONTRIBUTION:
"""
${body}
"""

Respond ONLY with a JSON object — no preamble, no markdown, no explanation.

{
  "quality_score": <float 0.0–1.0>,
  "domain_score": <float 0.0–1.0>,
  "flags": [<list of strings, may be empty>],
  "reasoning": "<one sentence>"
}

Scoring guidelines:
- quality_score: assess practical depth, clarity, and value to a tradesperson.
  0.0 = irrelevant filler. 0.5 = adequate but vague. 1.0 = excellent, specific, actionable.
- domain_score: assess relevance to skilled trades work.
  0.0 = completely unrelated. 0.5 = loosely related. 1.0 = directly on-topic.

Flag strings (use only these, include any that apply):
"off_topic" | "low_detail" | "duplicate_likely" | "safety_concern" |
"unverifiable_claim" | "promotional" | "inappropriate"`

  const model = process.env.CLAUDE_SCREENING_MODEL ?? 'claude-haiku-4-5-20251001'

  const response = await client.messages.create({
    model,
    max_tokens: 300,
    messages:   [{ role: 'user', content: prompt }],
  })

  const rawText = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')

  let parsed: { quality_score: number; domain_score: number; flags: string[] }

  try {
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    console.error('[AI Screening] Failed to parse response for', contentId, rawText)
    // Conservative fallback — send to human review
    return {
      qualityScore: 0,
      domainScore: 0,
      flags: ['parse_error'],
      shouldPublish: false,
      rawResponse: rawText,
    }
  }

  const qualityScore = Math.min(1, Math.max(0, parsed.quality_score ?? 0))
  const domainScore  = Math.min(1, Math.max(0, parsed.domain_score ?? 0))
  const flags        = Array.isArray(parsed.flags) ? parsed.flags : []

  const shouldPublish = qualityScore >= 0.35 && domainScore >= 0.40 && !flags.includes('safety_concern')

  try {
    // Update content with screening results
    const updatedContent = await prisma.content.update({
      where: { id: contentId },
      data: {
        aiQualityScore: qualityScore,
        aiDomainScore: domainScore,
        aiScreenedAt: new Date(),
        status: shouldPublish ? 'published' : 'flagged',
        publishedAt: shouldPublish ? new Date() : null,
      },
    })

    // Record the screening result
    await prisma.aiScreeningResult.create({
      data: {
        contentId,
        qualityScore,
        domainScore,
        flags,
        modelUsed: model,
        promptVersion: PROMPT_VERSION,
        rawResponse: rawText,
      },
    })

    // If published, create a reputation event for the author
    if (shouldPublish) {
      await prisma.reputationEvent.create({
        data: {
          userId: updatedContent.authorId,
          eventType: 'post_published',
          points: 10,
          referenceId: contentId,
        },
      })
    }
  } catch (error) {
    console.error(`[AI Screening] Failed to save results for ${contentId}:`, error)
    throw error
  }

  console.log(`[AI Screening] ${contentId} — quality: ${qualityScore}, domain: ${domainScore}, publish: ${shouldPublish}`)

  return { qualityScore, domainScore, flags, shouldPublish, rawResponse: rawText }
}
