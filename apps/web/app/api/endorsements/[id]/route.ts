import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const result = await requireAuth()
    if (result instanceof NextResponse) return result
    const user = result

    const endorsementId = id
    const body = await req.json()
    const validation = updateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid status', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { status } = validation.data

    const endorsement = await prisma.peerEndorsement.findUnique({
      where: { id: endorsementId },
    })

    if (!endorsement) {
      return NextResponse.json({ error: 'Endorsement not found' }, { status: 404 })
    }

    if (endorsement.recipientId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updated = await prisma.peerEndorsement.update({
      where: { id: endorsementId },
      data: {
        status,
        reviewedAt: new Date(),
      },
    })

    // Update the reputation event metadata to reflect acceptance/rejection
    await prisma.reputationEvent.updateMany({
      where: {
        referenceId: endorsementId,
        eventType: 'peer_endorsement_received',
      },
      data: {
        metadata: JSON.stringify({ endorsementStatus: status }),
      },
    })

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      reviewedAt: updated.reviewedAt,
    })
  } catch (error) {
    console.error('[API Error] PATCH /api/endorsements/[id]', error)
    return NextResponse.json({ error: 'Failed to update endorsement' }, { status: 500 })
  }
}
