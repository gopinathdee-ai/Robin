import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const specialisations = await prisma.tradeSpecialisation.findMany({
      where: { tradeId: id, isActive: true },
    })
    return NextResponse.json({ items: specialisations, tradeId: id })
  } catch (error) {
    console.error('[API Error] GET /api/trades/:id/specialisations', error)
    return NextResponse.json({ error: 'Failed to fetch specialisations' }, { status: 500 })
  }
}
