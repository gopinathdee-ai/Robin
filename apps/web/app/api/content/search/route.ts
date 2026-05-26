import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q') || ''
    const tradeId = req.nextUrl.searchParams.get('trade_id') || undefined
    const sort = req.nextUrl.searchParams.get('sort') ?? 'newest'
    const limit = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get('limit') || 20)))

    if (!query || query.length < 2) {
      return NextResponse.json({ items: [] })
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'trending') {
      orderBy = { upvoteCount: 'desc' }
    } else if (sort === 'most_answered') {
      orderBy = [{ _count: { answers: 'desc' } }, { createdAt: 'desc' }]
    } else {
      // 'newest' - use both publishedAt and createdAt to handle null publishedAt
      orderBy = [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
    }

    const results = await prisma.content.findMany({
      where: {
        status: 'published',
        aiQualityScore: { gte: 0.4 },
        ...(tradeId && { tradeId }),
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { body: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        author: true,
        trade: true,
        topic: true,
        ...(sort === 'most_answered' && { _count: { select: { answers: true } } }),
      },
      orderBy,
      take: limit,
    })

    return NextResponse.json({ items: results })
  } catch (error) {
    console.error('[API Error] GET /api/content/search', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
