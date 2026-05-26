import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ items: trades })
  } catch (error) {
    console.error('[API Error] GET /api/trades', error)
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}
