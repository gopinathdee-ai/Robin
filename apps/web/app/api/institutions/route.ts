import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET() {
  try {
    const institutions = await prisma.institution.findMany({
      where: {
        type: 'union',
        isActive: true,
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ items: institutions })
  } catch (error) {
    console.error('[API Error] GET /api/institutions', error)
    return NextResponse.json({ error: 'Failed to fetch institutions' }, { status: 500 })
  }
}
