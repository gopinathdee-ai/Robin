import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? 20)))
    const offset = Math.max(0, Number(req.nextUrl.searchParams.get('offset') ?? 0))

    const [items, total] = await Promise.all([
      prisma.reputationEvent.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          eventType: true,
          points: true,
          referenceId: true,
          createdAt: true,
          metadata: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.reputationEvent.count({ where: { userId: user.id } }),
    ])

    // Map event types to friendly descriptions
    const activities = items.map((event) => ({
      id: event.id,
      type: event.eventType,
      points: event.points,
      description: getEventDescription(event.eventType, event.points),
      referenceId: event.referenceId,
      metadata: event.metadata,
      createdAt: event.createdAt.toISOString(),
    }))

    return NextResponse.json({
      items: activities,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('[API Error] GET /api/users/me/activity', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}

function getEventDescription(eventType: string, points: number): string {
  const sign = points >= 0 ? '+' : ''
  const pointStr = `${sign}${points} pts`

  switch (eventType) {
    case 'post_published':
      return `${pointStr}: Your post was published`
    case 'answer_accepted':
      return `${pointStr}: Your answer was accepted`
    case 'content_upvoted':
      return `${pointStr}: Your content was upvoted`
    case 'peer_endorsement_received':
      return `${pointStr}: You received an endorsement`
    case 'audit_passed':
      return `${pointStr}: You passed an audit`
    case 'audit_failed':
      return `${pointStr}: Audit issue detected`
    case 'mentorship_completed':
      return `${pointStr}: Mentorship completed`
    case 'mentee_milestone_achieved':
      return `${pointStr}: Your mentee reached a milestone`
    case 'credential_issued':
      return `${pointStr}: You earned a credential`
    case 'penalty_applied':
      return `${pointStr}: Penalty applied`
    default:
      return `${pointStr}: Reputation updated`
  }
}
