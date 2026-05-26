'use server'

import { NextRequest, NextResponse } from 'next/server'
import { prisma, Prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const endorsementSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID required'),
  topicId: z.string().min(1, 'Topic ID required'),
  rationale: z.string().min(80, 'Rationale must be at least 80 characters').max(500, 'Rationale cannot exceed 500 characters'),
})

// Weight calculation based on BUSINESS_REQUIREMENTS.md Section 10.2
async function calculateEndorsementWeight(endorserId: string, recipientId: string, topicId: string): Promise<number> {
  const endorser = await prisma.user.findUnique({
    where: { id: endorserId },
    include: { reputationScore: true, trades: true },
  })

  if (!endorser) throw new Error('Endorser not found')

  let weight = 1.0

  // Rule 1: Verification tier weighting
  const userTrade = endorser.trades.find((t) => t.isPrimary)
  const isVerified = userTrade?.verifiedAt !== null
  const tierMultiplier =
    endorser.role === 'master' && isVerified
      ? 3.0
      : endorser.role === 'journeyperson' && isVerified
        ? 1.5
        : endorser.role === 'apprentice'
          ? 0.5
          : 0.1

  weight *= tierMultiplier

  // Rule 3 (part of newness): Account age penalty
  const accountAgeDays = Math.floor((Date.now() - endorser.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  if (accountAgeDays < 30) {
    weight *= 0.05
  }

  // Rule 2: Cross-network weighting
  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    include: { trades: true },
  })

  if (recipient) {
    const endorserTrade = endorser.trades.find((t) => t.isPrimary)?.tradeId
    const recipientTrade = recipient.trades.find((t) => t.isPrimary)?.tradeId

    // Same employer
    if (endorser.employerName && endorser.employerName === recipient.employerName) {
      weight *= 0.8
    }

    // Same union
    if (endorser.unionLocalId && endorser.unionLocalId === recipient.unionLocalId) {
      weight *= 0.8
    }

    // Different province
    if (endorser.provinceCode && recipient.provinceCode && endorser.provinceCode !== recipient.provinceCode) {
      weight *= 1.2
    }

    // Different trade (verified in both)
    if (endorserTrade && recipientTrade && endorserTrade !== recipientTrade && isVerified) {
      weight *= 1.3
    }
  }

  // Rule 4: Temporal decay (count prior endorsements in past 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const priorEndorsementCount = await prisma.peerEndorsement.count({
    where: {
      endorserId,
      createdAt: { gte: thirtyDaysAgo },
    },
  })

  if (priorEndorsementCount >= 3) {
    weight *= 0.1
  } else if (priorEndorsementCount === 2) {
    weight *= 0.4
  } else if (priorEndorsementCount === 1) {
    weight *= 0.7
  }

  return Math.min(weight, 3.6) // Cap at 3.6x max
}

// Check if endorser meets gate requirements
async function checkEndorsementGate(endorserId: string): Promise<{ canEndorse: boolean; reason?: string; details?: { required: number; current: number } }> {
  const endorser = await prisma.user.findUnique({
    where: { id: endorserId },
    select: { id: true, createdAt: true, reputationScore: true },
  })

  if (!endorser) return { canEndorse: false, reason: 'User not found' }

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

  // Gate 1: ≥X published contributions
  const contributionCount = await prisma.content.count({
    where: {
      authorId: endorserId,
      status: 'published',
    },
  })

  if (contributionCount < minContributions) {
    return { canEndorse: false, reason: 'needs_contributions', details: { required: minContributions, current: contributionCount } }
  }

  // Gate 2: Account >X days old
  const accountAgeDays = Math.floor((Date.now() - endorser.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  if (accountAgeDays < minAccountAgeDays) {
    return { canEndorse: false, reason: 'needs_account_age', details: { required: minAccountAgeDays, current: accountAgeDays } }
  }

  // Gate 3: ≥X reputation points
  if ((endorser.reputationScore?.totalScore || 0) < minReputation) {
    return { canEndorse: false, reason: 'needs_reputation', details: { required: minReputation, current: endorser.reputationScore?.totalScore || 0 } }
  }

  return { canEndorse: true }
}

export async function GET(req: NextRequest) {
  try {
    const recipientId = req.nextUrl.searchParams.get('recipientId')
    const status = req.nextUrl.searchParams.get('status') || 'accepted'
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0')

    if (!recipientId) {
      return NextResponse.json({ error: 'recipientId required' }, { status: 400 })
    }

    const whereClause: Prisma.PeerEndorsementWhereInput = {
      recipientId,
      ...(status !== 'all' && { status: status as any }),
    }

    const endorsements = await prisma.peerEndorsement.findMany({
      where: whereClause,
      include: {
        endorser: {
          select: { id: true, displayName: true, role: true, trades: { where: { isPrimary: true }, select: { verifiedAt: true } } },
        },
        topic: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.peerEndorsement.count({ where: whereClause })

    const items = endorsements.map((e) => ({
      id: e.id,
      endorser: {
        id: e.endorser.id,
        displayName: e.endorser.displayName,
        role: e.endorser.role,
        verified: e.endorser.trades[0]?.verifiedAt !== null,
      },
      topic: e.topic,
      rationale: e.rationale,
      weight: e.weight.toNumber(),
      createdAt: e.createdAt,
      status: e.status,
    }))

    return NextResponse.json({ items, total, limit, offset })
  } catch (error) {
    console.error('[API Error] GET /api/endorsements', error)
    return NextResponse.json({ error: 'Failed to fetch endorsements' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth()
    if (result instanceof NextResponse) return result
  const user = result

    const body = await req.json()
    const validation = endorsementSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 },
      )
    }

    const { recipientId, topicId, rationale } = validation.data

    // Check gate requirements
    const gateCheck = await checkEndorsementGate(user.id)
    if (!gateCheck.canEndorse) {
      return NextResponse.json({ error: 'Gate check failed', reason: gateCheck.reason, details: gateCheck.details }, { status: 403 })
    }

    // Check for existing ACCEPTED endorsement in past 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const existingEndorsement = await prisma.peerEndorsement.findFirst({
      where: {
        endorserId: user.id,
        recipientId,
        topicId,
        status: 'accepted',
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    if (existingEndorsement) {
      return NextResponse.json({ error: 'Already endorsed this topic for this user recently' }, { status: 409 })
    }

    // Calculate weight
    const weight = await calculateEndorsementWeight(user.id, recipientId, topicId)
    const points = Math.floor(5 * weight)

    // Create endorsement
    const endorsement = await prisma.peerEndorsement.create({
      data: {
        endorserId: user.id,
        recipientId,
        topicId,
        rationale,
        weight: new Prisma.Decimal(weight),
        status: 'pending',
      },
      include: {
        endorser: { select: { id: true, displayName: true } },
        topic: { select: { id: true, name: true } },
      },
    })

    // Create reputation event for recipient
    await prisma.reputationEvent.create({
      data: {
        userId: recipientId,
        eventType: 'peer_endorsement_received',
        points,
        referenceId: endorsement.id,
        metadata: JSON.stringify({ endorsementStatus: 'pending' }),
      },
    })

    // Update reputation score
    await prisma.reputationScore.upsert({
      where: { userId: recipientId },
      update: {
        totalScore: { increment: points },
        peerEndorsementScore: { increment: points },
      },
      create: {
        userId: recipientId,
        totalScore: points,
        peerEndorsementScore: points,
      },
    })

    return NextResponse.json(
      {
        id: endorsement.id,
        endorserId: endorsement.endorserId,
        recipientId: endorsement.recipientId,
        topicId: endorsement.topicId,
        status: endorsement.status,
        weight: endorsement.weight.toNumber(),
        createdAt: endorsement.createdAt,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API Error] POST /api/endorsements', error)
    return NextResponse.json({ error: 'Failed to create endorsement' }, { status: 500 })
  }
}
