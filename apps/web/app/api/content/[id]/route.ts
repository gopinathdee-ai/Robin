import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: true,
        trade: true,
        topic: true,
        answers: {
          include: { author: true },
          where: isDev ? {} : { status: 'published' },
          orderBy: { isAccepted: 'desc' },
        },
      },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    if (content.status !== 'published' && !isDev) {
      return NextResponse.json({ error: 'This content is not published' }, { status: 403 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('[API Error] GET /api/content/:id', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
