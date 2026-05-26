import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const { id } = await params

    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id },
      select: { id: true, upvoteCount: true },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Check if user already voted
    const existingVote = await prisma.contentVote.findUnique({
      where: { contentId_voterId: { contentId: id, voterId: user.id } },
    })

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.contentVote.delete({
        where: { id: existingVote.id },
      })

      // Decrement upvote count
      const updated = await prisma.content.update({
        where: { id },
        data: { upvoteCount: { decrement: 1 } },
        select: { upvoteCount: true },
      })

      return NextResponse.json({
        upvotes: updated.upvoteCount,
        userVoted: false,
      })
    } else {
      // Add vote
      await prisma.contentVote.create({
        data: { contentId: id, voterId: user.id },
      })

      // Increment upvote count
      const updated = await prisma.content.update({
        where: { id },
        data: { upvoteCount: { increment: 1 } },
        select: { upvoteCount: true },
      })

      return NextResponse.json({
        upvotes: updated.upvoteCount,
        userVoted: true,
      })
    }
  } catch (error) {
    console.error('[API Error] POST /api/content/[id]/upvote', error)
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 })
  }
}
