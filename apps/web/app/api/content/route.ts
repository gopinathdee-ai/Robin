import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma, Prisma } from '@trades/db'
import { screenContent } from '@/lib/aiScreening'
import { requireAuth } from '@/lib/auth'

const submitSchema = z.object({
  type: z.enum(['question', 'answer', 'post']),
  parentId: z.string().min(1).optional(),
  tradeId: z.string().min(1).optional(),
  topicId: z.string().min(1).optional(),
  title: z.string().min(10).max(300).optional(),
  body: z.string().min(20).max(10000),
})

export async function POST(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const body = await req.json()
    const data = submitSchema.parse(body)

    if (data.type === 'answer' && !data.parentId) {
      return NextResponse.json(
        { error: 'Answers must reference a parent question.' },
        { status: 400 },
      )
    }

    if ((data.type === 'question' || data.type === 'post') && !data.title) {
      return NextResponse.json(
        { error: 'Questions and posts require a title.' },
        { status: 400 },
      )
    }

    const content = await prisma.content.create({
      data: {
        authorId: user.id,
        type: data.type,
        parentId: data.parentId,
        tradeId: data.tradeId,
        topicId: data.topicId,
        title: data.title,
        body: data.body,
        status: 'pending_review',
      },
    })

    // Fetch trade name for context (non-blocking, best-effort)
    const trade = data.tradeId
      ? await prisma.trade.findUnique({ where: { id: data.tradeId }, select: { name: true } })
      : null

    // For answers, inherit trade from parent question
    let resolvedTradeId = data.tradeId
    let resolvedTradeName = trade?.name
    if (data.type === 'answer' && data.parentId && !resolvedTradeId) {
      const parent = await prisma.content.findUnique({
        where: { id: data.parentId },
        select: { tradeId: true },
      })
      if (parent?.tradeId) {
        const parentTrade = await prisma.trade.findUnique({
          where: { id: parent.tradeId },
          select: { name: true },
        })
        resolvedTradeId = parent.tradeId
        resolvedTradeName = parentTrade?.name
      }
    }

    screenContent({
      contentId: content.id,
      title: data.title,
      body: data.body,
      tradeId: resolvedTradeId,
      tradeName: resolvedTradeName,
    })
      .catch((err) => console.error('[AI Screening Error]', content.id, err))

    return NextResponse.json(
      {
        id: content.id,
        status: 'pending_review',
        message: 'Your contribution is being reviewed and will be published shortly.',
      },
      { status: 202 },
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 },
      )
    }
    console.error('[API Error] POST /api/content', err)
    return NextResponse.json({ error: 'Failed to submit content' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const tradeId = req.nextUrl.searchParams.get('trade_id') ?? undefined
    const topicId = req.nextUrl.searchParams.get('topic_id') ?? undefined
    const type = req.nextUrl.searchParams.get('type') ?? undefined
    const sort = req.nextUrl.searchParams.get('sort') ?? 'newest'
    const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? 1))
    const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? 20)))

    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

    const where: Prisma.ContentWhereInput = {
      status: isDev ? { in: ['published', 'pending_review', 'flagged'] as any } : 'published',
      ...(isDev ? {} : { aiQualityScore: { gte: 0.4 } }),
      ...(tradeId && { tradeId }),
      ...(topicId && { topicId }),
      // Only show questions and posts in the main feed, not answers
      type: type ? (type as any) : { in: ['question', 'post'] as any },
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'trending') {
      orderBy = { upvoteCount: 'desc' }
    } else if (sort === 'most_answered') {
      orderBy = [{ _count: { answers: 'desc' } }, { createdAt: 'desc' }]
    } else {
      // 'newest' - use both publishedAt and createdAt to handle null publishedAt for pending items
      orderBy = [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
    }

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: true,
          trade: true,
          topic: true,
          _count: { select: { answers: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.content.count({ where }),
    ])

    return NextResponse.json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[API Error] GET /api/content', error)
    return NextResponse.json({ error: 'Failed to fetch content feed' }, { status: 500 })
  }
}
