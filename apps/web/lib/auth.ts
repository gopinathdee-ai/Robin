import { headers, cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isDevMode } from './dev-mode'

export interface AuthUser {
  id: string
  auth0Id: string
  email: string
}

export async function requireAuth(): Promise<AuthUser | NextResponse> {
  const h = await headers()
  const cookieStore = await cookies()

  // Dev mode auth: Check header first (for curl/Postman testing), then cookie (browser)
  // Only allowed if NEXT_PUBLIC_DEV_MODE is enabled
  const devMode = isDevMode()
  console.log('[AUTH DEBUG] Start', {
    devModeEnv: process.env.NEXT_PUBLIC_DEV_MODE,
    devModeFn: devMode,
    cookiesList: cookieStore.getAll().map(c => ({ name: c.name })),
  })

  if (devMode) {
    const headerDevId = h.get('x-dev-user-id')
    const headerUserId = h.get('user-id')
    const cookieDevId = cookieStore.get('dev-user-id')?.value
    const devId = headerDevId ?? headerUserId ?? cookieDevId

    console.log('[AUTH DEBUG] DevMode enabled', {
      headerDevId,
      headerUserId,
      cookieDevId,
      resolved: devId,
    })

    if (devId) {
      return { id: devId, auth0Id: 'dev|stub', email: 'dev@local' }
    }
  }

  console.log('[AUTH DEBUG] Failed - returning 401')
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function requireOnboardingCompletion(
  user: AuthUser
): Promise<{ nextStep: string | null } | NextResponse> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/users/me`, {
      headers: {
        'x-dev-user-id': user.id,
      },
    })

    if (!res.ok) {
      return { nextStep: '/onboarding/role' }
    }

    const userData = await res.json()
    const onboardingStep = userData.onboardingStep || 0

    if (onboardingStep < 5) {
      const steps = [
        '/onboarding/role',
        '/onboarding/trade',
        '/onboarding/tutorial',
        '/onboarding/profile',
        '/onboarding/first-contribution',
      ]
      return { nextStep: steps[onboardingStep] || '/onboarding/role' }
    }

    return { nextStep: null }
  } catch (error) {
    console.error('Error checking onboarding completion:', error)
    return { nextStep: '/onboarding/role' }
  }
}
