import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Count posts/answers/questions in the last month
    const [postsThisMonth, answersThisMonth, questionsThisMonth, endorsementsThisMonth] =
      await Promise.all([
        prisma.content.count({
          where: {
            authorId: user.id,
            type: 'post',
            status: 'published',
            createdAt: { gte: monthStart },
          },
        }),
        prisma.content.count({
          where: {
            authorId: user.id,
            type: 'answer',
            status: 'published',
            createdAt: { gte: monthStart },
          },
        }),
        prisma.content.count({
          where: {
            authorId: user.id,
            type: 'question',
            status: 'published',
            createdAt: { gte: monthStart },
          },
        }),
        prisma.peerEndorsement.count({
          where: {
            recipientId: user.id,
            status: 'accepted',
            createdAt: { gte: monthStart },
          },
        }),
      ])

    // Count unique expertise topics
    const topicCount = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(DISTINCT topic_id) as count
      FROM content
      WHERE author_id = ${user.id}
        AND status = 'published'
        AND topic_id IS NOT NULL
    `

    return NextResponse.json({
      postsThisMonth,
      answersThisMonth,
      questionsThisMonth,
      endorsementsReceivedThisMonth: endorsementsThisMonth,
      topicsCount: topicCount[0]?.count || 0,
    })
  } catch (error) {
    console.error('[API Error] GET /api/users/me/summary', error)
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 })
  }
}
