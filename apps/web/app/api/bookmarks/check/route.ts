import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const { searchParams } = new URL(req.url)
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_contentId: {
          userId: user.id,
          contentId,
        },
      },
    })

    return NextResponse.json({ bookmarked: !!bookmark })
  } catch (error) {
    console.error('[API Error] GET /api/bookmarks/check', error)
    return NextResponse.json({ error: 'Failed to check bookmark status' }, { status: 500 })
  }
}
