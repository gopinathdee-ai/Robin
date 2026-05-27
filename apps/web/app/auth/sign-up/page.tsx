import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { DevModeBanner } from '@/components/DevModeBanner'

export const dynamic = 'force-dynamic'

async function createAndSignUp() {
  'use server'

  try {
    const { prisma } = await import('@trades/db')
    const user = await prisma.user.create({
      data: {
        email: `dev-${Date.now()}@local.test`,
        displayName: 'Dev User',
        status: 'onboarding',
        onboardingStep: 0,
      },
    })

    const store = await cookies()
    store.set('dev-user-id', user.id, { httpOnly: true, path: '/', maxAge: 86400 })
    redirect('/onboarding/role')
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

function getNextOnboardingStep(step: number): string {
  const steps = ['/onboarding/role', '/onboarding/trade', '/onboarding/tutorial', '/onboarding/profile', '/onboarding/first-contribution']
  return steps[Math.min(step, steps.length - 1)] || '/onboarding/role'
}

async function continueAs(formData: FormData) {
  'use server'
  try {
    const userId = formData.get('userId') as string
    const { prisma } = await import('@trades/db')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true, onboardingStep: true },
    })

    const store = await cookies()
    store.set('dev-user-id', userId, { httpOnly: true, path: '/', maxAge: 86400 })

    if (user?.status === 'active') {
      redirect('/profile')
    } else if (user?.status === 'onboarding') {
      redirect(getNextOnboardingStep(user.onboardingStep))
    } else {
      redirect('/onboarding/role')
    }
  } catch (error) {
    console.error('Error continuing as user:', error)
    throw error
  }
}

async function getRecentUsers() {
  try {
    const { prisma } = await import('@trades/db')
    return await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, displayName: true, status: true },
    })
  } catch (error) {
    console.error('Failed to fetch recent users:', error)
    return []
  }
}

export default async function SignUpPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  const recentUsers = isDevMode ? await getRecentUsers() : []

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <DevModeBanner message="Testing auth for Sprint 1 onboarding flow" />

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-ink-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Get Started</h1>
          <p className="text-sm text-ink-600 mb-6">
            Create your account and explore the Trades Platform onboarding.
          </p>

          {/* Create Account Button */}
          <form action={createAndSignUp}>
            <button
              type="submit"
              className="w-full btn-primary py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-6"
            >
              Create my account
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          {/* Or Continue As Section */}
          {recentUsers.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Or continue with existing user
              </div>

              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <form key={user.id} action={continueAs} className="w-full">
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="w-full text-left p-3 rounded-lg border border-ink-200 hover:border-trades-300 hover:bg-trades-50 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-trades-500"
                    >
                      <div className="flex-1 min-w-0 pointer-events-none">
                        <p className="text-sm font-medium text-ink-900">{user.displayName}</p>
                        <p className="text-xs text-ink-500 capitalize">{user.status}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-ink-400 group-hover:text-trades-500 flex-shrink-0 pointer-events-none" />
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-ink-100 text-center space-y-3">
            <p className="text-xs text-ink-600">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-trades-600 hover:text-trades-700 font-semibold">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-ink-600 text-center">
              <Link href="/" className="text-trades-600 hover:text-trades-700 font-semibold">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
