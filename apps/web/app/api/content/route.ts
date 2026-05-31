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

    let orderBy: any = [{ createdAt: 'desc' }]
    if (sort === 'trending') {
      orderBy = { upvoteCount: 'desc' }
    } else if (sort === 'most_answered') {
      orderBy = [{ _count: { answers: 'desc' } }, { createdAt: 'desc' }]
    } else {
      // 'newest' (most recent activity) - sort by most recent answer or creation date
      orderBy = { createdAt: 'desc' }
    }

    // For "newest" sort, we need to fetch all items and sort by most recent activity
    const shouldSortByActivity = sort === 'newest'

    const queryOptions: any = {
      where,
      include: {
        author: true,
        trade: true,
        topic: true,
        _count: { select: { answers: true } },
      },
    }

    // For activity sort, fetch more items and include answers to determine last activity
    if (shouldSortByActivity) {
      queryOptions.include.answers = {
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' as const },
        take: 1,
      }
      queryOptions.take = limit * 3 // Fetch extra to account for sorting
    } else {
      queryOptions.orderBy = orderBy
      queryOptions.skip = (page - 1) * limit
      queryOptions.take = limit
    }

    const [allItems, total] = await Promise.all([
      prisma.content.findMany(queryOptions),
      prisma.content.count({ where }),
    ])

    let items = allItems

    // Sort by most recent activity if needed
    if (shouldSortByActivity) {
      items = allItems
        .map((item: any) => {
          const latestAnswer = (item.answers && item.answers[0])
          const lastActivityAt = latestAnswer
            ? new Date(latestAnswer.createdAt)
            : new Date(item.createdAt)

          return {
            ...item,
            lastActivityAt,
            answers: undefined, // Remove answers from response
          }
        })
        .sort((a: any, b: any) => {
          const aTime = a.lastActivityAt.getTime()
          const bTime = b.lastActivityAt.getTime()
          return bTime - aTime // Descending (most recent first)
        })
        .slice((page - 1) * limit, page * limit)
    }

    return NextResponse.json({
      items: items.map((item: any) => {
        const { answers, ...rest } = item
        // Convert lastActivityAt to ISO string if it exists
        if (rest.lastActivityAt instanceof Date) {
          rest.lastActivityAt = rest.lastActivityAt.toISOString()
        }
        return rest
      }),
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
