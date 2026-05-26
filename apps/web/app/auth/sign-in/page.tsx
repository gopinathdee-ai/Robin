import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@trades/db'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { DevModeBanner } from '@/components/DevModeBanner'

function getNextOnboardingStep(step: number): string {
  const steps = ['/onboarding/role', '/onboarding/trade', '/onboarding/tutorial', '/onboarding/profile', '/onboarding/first-contribution']
  return steps[Math.min(step, steps.length - 1)] || '/onboarding/role'
}

async function createAndSignIn() {
  'use server'

  try {
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

async function signInAs(formData: FormData) {
  'use server'
  try {
    const userId = formData.get('userId') as string

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
    console.error('Error signing in:', error)
    throw error
  }
}

async function getRecentUsers() {
  return await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, displayName: true, status: true },
  })
}

export const dynamic = 'force-dynamic'

export default async function SignInPage() {
  const recentUsers = await getRecentUsers()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <DevModeBanner message="Testing auth for Sprint 1 onboarding flow" />

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-ink-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-ink-600 mb-6">
            Sign in with a test user to explore the onboarding flow.
          </p>

          {/* Create New User Button */}
          <form action={createAndSignIn}>
            <button
              type="submit"
              className="w-full btn-primary py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-6"
            >
              Create new test user
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          {/* Recent Users */}
          {recentUsers.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Or continue as existing user
              </div>

              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <form key={user.id} action={signInAs}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="w-full text-left p-3 rounded-lg border border-ink-200 hover:border-trades-300 hover:bg-trades-50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-900">{user.displayName}</p>
                        <p className="text-xs text-ink-500 capitalize">{user.status}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-ink-400 group-hover:text-trades-500" />
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-ink-100">
            <p className="text-xs text-ink-600 text-center">
              This is a temporary dev auth flow.{' '}
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
