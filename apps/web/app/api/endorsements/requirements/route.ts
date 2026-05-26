import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth()
    if (result instanceof NextResponse) return result
    const userId = result.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' },
      select: {
        endorsementMinContributions: true,
        endorsementMinReputation: true,
        endorsementMinAccountAgeDays: true,
      },
    })

    const minContributions = settings?.endorsementMinContributions ?? 20
    const minAccountAgeDays = settings?.endorsementMinAccountAgeDays ?? 60
    const minReputation = settings?.endorsementMinReputation ?? 50

    // Get contribution count
    const contributionCount = await prisma.content.count({
      where: {
        authorId: userId,
        status: 'published',
      },
    })

    // Get account age
    const accountAgeDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Get reputation
    const reputation = await prisma.reputationScore.findUnique({
      where: { userId: userId },
      select: { totalScore: true },
    })
    const reputationPoints = reputation?.totalScore || 0

    return NextResponse.json({
      requirements: [
        {
          name: 'Published contributions',
          met: contributionCount >= minContributions,
          current: contributionCount,
          required: minContributions,
          unit: 'posts',
        },
        {
          name: 'Reputation points',
          met: reputationPoints >= minReputation,
          current: reputationPoints,
          required: minReputation,
          unit: 'points',
        },
        {
          name: 'Account age',
          met: accountAgeDays >= minAccountAgeDays,
          current: accountAgeDays,
          required: minAccountAgeDays,
          unit: 'days',
        },
      ],
    })
  } catch (error) {
    console.error('[API Error] GET /api/endorsements/requirements', error)
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 })
  }
}
