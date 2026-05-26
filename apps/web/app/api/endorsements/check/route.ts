'use server'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'
import { getPlatformSettings } from '@/lib/platform-settings'

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth()
    if (result instanceof NextResponse) return result
  const user = result

    const recipientId = req.nextUrl.searchParams.get('recipientId')
    const topicId = req.nextUrl.searchParams.get('topicId')

    if (!recipientId || !topicId) {
      return NextResponse.json({ error: 'recipientId and topicId required' }, { status: 400 })
    }

    // Get configurable platform settings (from DB or dev overrides)
    const settings = await getPlatformSettings()

    // Fetch user from DB to get createdAt
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { createdAt: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Gate 1: Min published contributions
    const contributionCount = await prisma.content.count({
      where: {
        authorId: user.id,
        status: 'published',
      },
    })

    if (contributionCount < settings.endorsementMinContributions) {
      return NextResponse.json({
        canEndorse: false,
        reason: 'needs_contributions',
        required: settings.endorsementMinContributions,
        current: contributionCount,
      })
    }

    // Gate 2: Min account age
    const accountAgeDays = Math.floor((Date.now() - dbUser.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    if (accountAgeDays < settings.endorsementMinAccountAgeDays) {
      return NextResponse.json({
        canEndorse: false,
        reason: 'needs_account_age',
        required: settings.endorsementMinAccountAgeDays,
        current: accountAgeDays,
      })
    }

    // Gate 3: Min reputation points
    const repScore = await prisma.reputationScore.findUnique({
      where: { userId: user.id },
    })

    if ((repScore?.totalScore || 0) < settings.endorsementMinReputation) {
      return NextResponse.json({
        canEndorse: false,
        reason: 'needs_reputation',
        required: settings.endorsementMinReputation,
        current: repScore?.totalScore || 0,
      })
    }

    // Gate 4: No ACCEPTED endorsement for same topic+recipient in past cooldown period
    const cooldownMs = settings.endorsementCooldownDays * 24 * 60 * 60 * 1000
    const cooldownStart = new Date(Date.now() - cooldownMs)
    const existingAccepted = await prisma.peerEndorsement.findFirst({
      where: {
        endorserId: user.id,
        recipientId,
        topicId,
        status: 'accepted',
        createdAt: { gte: cooldownStart },
      },
    })

    if (existingAccepted) {
      return NextResponse.json({
        canEndorse: false,
        reason: 'already_accepted',
        endorsedAt: existingAccepted.createdAt,
        nextAvailableAt: new Date(existingAccepted.createdAt.getTime() + cooldownMs),
      })
    }

    // Gate 5: No PENDING endorsement for same topic+recipient
    const existingPending = await prisma.peerEndorsement.findFirst({
      where: {
        endorserId: user.id,
        recipientId,
        topicId,
        status: 'pending',
      },
    })

    if (existingPending) {
      return NextResponse.json({
        canEndorse: false,
        reason: 'cooldown_active',
        nextAvailableAt: new Date(existingPending.createdAt.getTime() + cooldownMs),
      })
    }

    // All gates passed
    return NextResponse.json({
      canEndorse: true,
    })
  } catch (error) {
    console.error('[API Error] GET /api/endorsements/check', error)
    return NextResponse.json({ error: 'Failed to check endorsement eligibility' }, { status: 500 })
  }
}
