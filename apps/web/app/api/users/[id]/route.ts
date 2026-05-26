import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        role: true,
        bio: true,
        yearsExperience: true,
        provinceCode: true,
        status: true,
        trades: {
          select: {
            tradeId: true,
            trade: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reputationScore: {
          select: {
            totalScore: true,
            tier: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get expertise topics via content
    const topicsRaw = await prisma.$queryRaw<
      Array<{
        topicId: string
        topicName: string
        points: bigint
      }>
    >`
      SELECT DISTINCT
        et.id as "topicId",
        et.name as "topicName",
        COUNT(c.id) as "points"
      FROM expertise_topics et
      LEFT JOIN content c ON c.topic_id = et.id AND c.author_id = ${id} AND c.status = 'published'
      WHERE et.is_active = true
      GROUP BY et.id, et.name
      ORDER BY COUNT(c.id) DESC
      LIMIT 5
    `
    const topics = topicsRaw.map((t) => ({
      topicId: t.topicId,
      topicName: t.topicName,
      points: Number(t.points),
    }))

    // Count accepted endorsements
    const endorsementCount = await prisma.peerEndorsement.count({
      where: {
        recipientId: id,
        status: 'accepted',
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        displayName: user.displayName,
        role: user.role,
        bio: user.bio,
        yearsExperience: user.yearsExperience,
        provinceCode: user.provinceCode,
        status: user.status,
        trades: user.trades.map((ut) => ({
          id: ut.trade.id,
          name: ut.trade.name,
        })),
      },
      reputation: {
        totalPoints: user.reputationScore?.totalScore || 0,
        tier: user.reputationScore?.tier || 'apprentice',
        expertiseTopics: topics,
      },
      endorsementsCount: endorsementCount,
    })
  } catch (error) {
    console.error('[API Error] GET /api/users/[id]', error)
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }
}
