import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const userTrades = await prisma.userTrade.findMany({
      where: { userId: user.id },
      include: { trade: true, specialisation: true },
      orderBy: { isPrimary: 'desc' },
    })

    return NextResponse.json({
      items: userTrades.map((ut) => ({
        id: ut.tradeId,
        name: ut.trade.name,
        code: ut.trade.code,
        isPrimary: ut.isPrimary,
        specialisationId: ut.specialisationId,
        specialisationName: ut.specialisation?.name,
        verifiedAt: ut.verifiedAt,
      })),
    })
  } catch (error) {
    console.error('[API Error] GET /api/users/me/trades', error)
    return NextResponse.json({ error: 'Failed to fetch user trades' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const schema = z.object({
      tradeId: z.string().uuid(),
      specialisationId: z.string().uuid().optional(),
      isPrimary: z.boolean().default(false),
    })

    const body = await req.json()
    const { tradeId, specialisationId, isPrimary } = schema.parse(body)

    const userTrade = await prisma.userTrade.upsert({
      where: {
        userId_tradeId: { userId: user.id, tradeId },
      },
      create: {
        userId: user.id,
        tradeId,
        specialisationId,
        isPrimary,
      },
      update: {
        specialisationId,
        isPrimary,
      },
      include: { trade: true, specialisation: true },
    })

    return NextResponse.json(userTrade, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', issues: error.issues },
        { status: 400 },
      )
    }
    console.error('[API Error] POST /api/users/me/trades', error)
    return NextResponse.json({ error: 'Failed to associate trade with user' }, { status: 500 })
  }
}
