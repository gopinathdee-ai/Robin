import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        content: {
          include: {
            author: {
              select: {
                id: true,
                displayName: true,
                role: true,
              },
            },
            trade: {
              select: {
                id: true,
                name: true,
              },
            },
            topic: {
              select: {
                id: true,
                name: true,
              },
            },
            answers: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const items = bookmarks.map((bookmark) => {
      const answersCount = bookmark.content.answers?.length || 0
      return {
        bookmarkId: bookmark.id,
        id: bookmark.content.id,
        type: bookmark.content.type,
        title: bookmark.content.title,
        body: bookmark.content.body,
        author: bookmark.content.author,
        trade: bookmark.content.trade,
        topic: bookmark.content.topic,
        upvotes: bookmark.content.upvoteCount,
        createdAt: bookmark.content.createdAt.toISOString(),
        status: bookmark.content.status,
        answersCount: bookmark.content.type === 'question' ? answersCount : undefined,
        bookmarkedAt: bookmark.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('[API Error] GET /api/bookmarks', error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const { contentId } = await req.json()

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 })
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId },
      select: { id: true },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_contentId: {
          userId: user.id,
          contentId,
        },
      },
      create: {
        userId: user.id,
        contentId,
      },
      update: {},
    })

    return NextResponse.json({ bookmarkId: bookmark.id, bookmarked: true }, { status: 201 })
  } catch (error) {
    console.error('[API Error] POST /api/bookmarks', error)
    return NextResponse.json({ error: 'Failed to bookmark' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
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

    if (!bookmark) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    })

    return NextResponse.json({ bookmarked: false })
  } catch (error) {
    console.error('[API Error] DELETE /api/bookmarks', error)
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
  }
}
