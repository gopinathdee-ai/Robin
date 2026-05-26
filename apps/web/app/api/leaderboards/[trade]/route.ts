import { NextRequest, NextResponse } from 'next/server'
import { prisma, Prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ trade: string }> }
) {
  const { trade } = await params
  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? 1))
  const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? 50)))
  const sort = (req.nextUrl.searchParams.get('sort') as 'score' | 'recent' | 'endorsed') ?? 'score'

  try {
    // Get trade info
    const tradeInfo = await prisma.trade.findUnique({
      where: { code: trade.toUpperCase() },
      select: { id: true, name: true, code: true },
    })

    if (!tradeInfo) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    // Fetch authenticated user for current rank
    const result = await requireAuth()
    if (result instanceof NextResponse) return result
    const user = result
    let currentUserRank: number | null = null

    // Build leaderboard query
    const orderByClause = sort === 'recent' ? `u.created_at DESC` : sort === 'endorsed' ? `"endorsementsCount" DESC, "totalScore" DESC` : `"totalScore" DESC`
    console.log(`[DEBUG] sort="${sort}" orderByClause="${orderByClause}"`)

    const leaderboardData = await prisma.$queryRaw<
      Array<{
        userId: string
        displayName: string
        role: string
        verified: boolean
        totalScore: number
        topicsCount: number
        endorsementsCount: number
      }>
    >`
      SELECT
        u.id as "userId",
        u.display_name as "displayName",
        u.role,
        CASE WHEN ut.verified_at IS NOT NULL THEN true ELSE false END as verified,
        COALESCE(rs.total_score, 0) as "totalScore",
        (SELECT COUNT(DISTINCT topic_id) FROM content WHERE author_id = u.id AND status = 'published') as "topicsCount",
        (SELECT COUNT(*) FROM peer_endorsements WHERE recipient_id = u.id AND status = 'accepted') as "endorsementsCount"
      FROM users u
      LEFT JOIN user_trades ut ON u.id = ut.user_id AND ut.trade_id = ${tradeInfo.id} AND ut.is_primary = true
      LEFT JOIN reputation_scores rs ON u.id = rs.user_id
      WHERE ut.trade_id IS NOT NULL
      ORDER BY ${Prisma.raw(orderByClause)}
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `
    console.log(`[DEBUG] leaderboardData:`, leaderboardData.map(u => ({ name: u.displayName, score: u.totalScore })))

    // Get total count for pagination
    const totalResult = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(DISTINCT u.id) as count
      FROM users u
      LEFT JOIN user_trades ut ON u.id = ut.user_id AND ut.trade_id = ${tradeInfo.id} AND ut.is_primary = true
      WHERE ut.trade_id IS NOT NULL
    `

    const total = Number(totalResult[0]?.count || 0)

    // Rank the items and find current user's rank
    const items = leaderboardData.map((user, idx) => ({
      rank: (page - 1) * limit + idx + 1,
      userId: user.userId,
      displayName: user.displayName,
      role: user.role,
      verified: user.verified,
      score: user.totalScore,
      topicsCount: Number(user.topicsCount),
      endorsementsCount: Number(user.endorsementsCount),
    }))

    if (user) {
      const userIndex = items.findIndex((item) => item.userId === user.id)
      if (userIndex !== -1) {
        currentUserRank = items[userIndex].rank
      } else {
        // User not in top page, find their actual rank
        const userRankResult = await prisma.$queryRaw<Array<{ rank: number }>>`
          SELECT COUNT(*) + 1 as rank
          FROM users u
          LEFT JOIN user_trades ut ON u.id = ut.user_id AND ut.trade_id = ${tradeInfo.id} AND ut.is_primary = true
          LEFT JOIN reputation_scores rs ON u.id = rs.user_id
          WHERE ut.trade_id IS NOT NULL
            AND COALESCE(rs.total_score, 0) > (
              SELECT COALESCE(rs2.total_score, 0)
              FROM users u2
              LEFT JOIN reputation_scores rs2 ON u2.id = rs2.user_id
              WHERE u2.id = ${user.id}
            )
        `
        currentUserRank = userRankResult[0]?.rank || null
      }
    }

    return NextResponse.json({
      tradeName: tradeInfo.name,
      tradeCode: tradeInfo.code,
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      currentUserRank,
    })
  } catch (error) {
    console.error('[API Error] GET /api/leaderboards/[trade]', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
