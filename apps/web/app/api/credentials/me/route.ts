import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const credentials = await prisma.credential.findMany({
      where: {
        holderId: user.id,
        revokedAt: null,
      },
      orderBy: { issuedAt: 'desc' },
      include: { trade: true, topic: true, issuer: true },
    })

    return NextResponse.json({ items: credentials })
  } catch (error) {
    console.error('[API Error] GET /api/credentials/me', error)
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 })
  }
}
