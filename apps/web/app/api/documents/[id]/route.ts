import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'
import { deleteDocument } from '@/lib/storage'

const updateStatusSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const { id } = await params

    const document = await prisma.userDocument.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Ensure user can only see their own documents
    if (document.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('[API Error] GET /api/documents/[id]', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const { id } = await params
    const body = await req.json()

    const data = updateStatusSchema.parse(body)

    const document = await prisma.userDocument.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Only document owner or admin can update
    if (document.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updated = await prisma.userDocument.update({
      where: { id },
      data: {
        status: data.status,
        verifiedAt: data.status === 'VERIFIED' ? new Date() : null,
        rejectionReason: data.rejectionReason || null,
        notes: data.notes || null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('[API Error] PATCH /api/documents/[id]', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const { id } = await params

    const document = await prisma.userDocument.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Only document owner can delete
    if (document.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Can only delete PENDING or REJECTED documents
    if (document.status === 'VERIFIED') {
      return NextResponse.json(
        { error: 'Cannot delete verified documents' },
        { status: 400 }
      )
    }

    // Delete file from Supabase Storage if storage path exists
    if (document.storagePath) {
      try {
        await deleteDocument(document.storagePath)
      } catch (error) {
        console.error('Failed to delete from storage:', error)
        // Continue anyway - delete from DB
      }
    }

    // Delete from database
    await prisma.userDocument.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API Error] DELETE /api/documents/[id]', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
