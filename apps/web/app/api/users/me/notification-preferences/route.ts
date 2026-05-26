import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'

const updatePreferencesSchema = z.object({
  weeklyDigest: z.boolean().optional(),
  endorsements: z.boolean().optional(),
  credentialUpdates: z.boolean().optional(),
  communityActivity: z.boolean().optional(),
  marketing: z.boolean().optional(),
})

export async function GET() {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    let prefs = await prisma.notificationPreferences.findUnique({
      where: { userId: user.id },
    })

    if (!prefs) {
      prefs = await prisma.notificationPreferences.create({
        data: {
          userId: user.id,
          weeklyDigest: true,
          endorsements: true,
          credentialUpdates: true,
          communityActivity: false,
          marketing: false,
        },
      })
    }

    return NextResponse.json(prefs)
  } catch (error) {
    console.error('[notification-preferences GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const body = await req.json()
    const validated = updatePreferencesSchema.parse(body)

    const prefs = await prisma.notificationPreferences.upsert({
      where: { userId: user.id },
      update: validated,
      create: {
        userId: user.id,
        weeklyDigest: validated.weeklyDigest ?? true,
        endorsements: validated.endorsements ?? true,
        credentialUpdates: validated.credentialUpdates ?? true,
        communityActivity: validated.communityActivity ?? false,
        marketing: validated.marketing ?? false,
      },
    })

    // Advance onboarding step to 6 (notifications is the 6th step)
    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingStep: 6 },
    })

    return NextResponse.json(prefs)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }

    console.error('[notification-preferences PATCH]', error)
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}
