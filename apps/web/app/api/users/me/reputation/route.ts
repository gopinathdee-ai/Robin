import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'
import { getTier, getPointsToNextTier } from '@/lib/reputation'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    // Fetch reputation events for user
    const events = await prisma.reputationEvent.findMany({
      where: { userId: user.id },
      select: { eventType: true, points: true },
    })

    // Calculate score by event type
    const breakdown = {
      contributions: 0,
      answers: 0,
      upvotes: 0,
      endorsements: 0,
      other: 0,
    }

    for (const event of events) {
      if (event.eventType === 'post_published') {
        breakdown.contributions += event.points
      } else if (event.eventType === 'answer_accepted') {
        breakdown.answers += event.points
      } else if (event.eventType === 'content_upvoted') {
        breakdown.upvotes += event.points
      } else if (event.eventType === 'peer_endorsement_received') {
        breakdown.endorsements += event.points
      } else {
        breakdown.other += event.points
      }
    }

    const totalPoints = Object.values(breakdown).reduce((a, b) => a + b, 0)
    const tier = getTier(totalPoints)
    const pointsToNextTier = getPointsToNextTier(totalPoints)

    // Fetch expertise topics (group content by topic)
    const expertiseTopics = await prisma.$queryRaw<Array<{ topicId: string; topicName: string; points: number }>>`
      SELECT
        t.id as "topicId",
        t.name as "topicName",
        CAST(COUNT(CASE WHEN c.type = 'post' THEN 1 END) * 10 +
        COUNT(CASE WHEN c.type = 'answer' AND c.is_accepted = true THEN 1 END) * 15 AS INTEGER) as points
      FROM content c
      JOIN expertise_topics t ON c.topic_id = t.id
      WHERE c.author_id = ${user.id}
        AND c.status = 'published'
      GROUP BY t.id, t.name
      ORDER BY points DESC
      LIMIT 5
    `

    return NextResponse.json({
      totalPoints,
      tier,
      breakdown,
      expertiseTopics: expertiseTopics || [],
      pointsToNextTier,
    })
  } catch (error) {
    console.error('[API Error] GET /api/users/me/reputation', error)
    return NextResponse.json({ error: 'Failed to fetch reputation' }, { status: 500 })
  }
}
