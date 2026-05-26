import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const topics = await prisma.expertiseTopic.findMany({
      where: { tradeId: id, isActive: true },
    })
    return NextResponse.json({ items: topics, tradeId: id })
  } catch (error) {
    console.error('[API Error] GET /api/trades/:id/topics', error)
    return NextResponse.json({ error: 'Failed to fetch expertise topics' }, { status: 500 })
  }
}
