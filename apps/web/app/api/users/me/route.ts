import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        trades: {
          include: { trade: true, specialisation: true },
        },
        reputationScore: true,
      },
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('[API Error] GET /api/users/me', error)
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const updateSchema = z.object({
      displayName: z.string().max(120).optional(),
      provinceCode: z.string().length(2).optional(),
      yearsExperience: z.number().int().min(0).optional(),
      employerName: z.string().max(200).optional(),
      unionLocal: z.string().max(100).optional(),
      role: z.enum(['apprentice', 'journeyperson', 'master', 'employer_admin']).optional(),
      onboardingStep: z.number().int().min(0).optional(),
      onboardingDone: z.boolean().optional(),
      accountStatus: z.enum(['onboarding', 'active', 'suspended']).optional(),
      bio: z.string().optional(),
      status: z.enum(['onboarding', 'active', 'suspended']).optional(),
    })

    const body = await req.json()
    const updates = updateSchema.partial().parse(body)

    // If onboarding is marked as done, set status to 'active'
    if (updates.onboardingDone === true) {
      updates.status = 'active'
    }

    const userData = await prisma.user.update({
      where: { id: user.id },
      data: updates,
      include: { reputationScore: true },
    })

    return NextResponse.json(userData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', issues: error.issues },
        { status: 400 },
      )
    }
    console.error('[API Error] PATCH /api/users/me', error)
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
  }
}
