import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { isDevMode } from '@/lib/dev-mode'

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode
}) {
  // Dev mode: Allow access with dev-user-id cookie
  // Production: Auth0 session required (handled by middleware)
  if (isDevMode()) {
    const store = await cookies()
    if (!store.get('dev-user-id')?.value) {
      redirect('/auth/sign-in')
    }
  }

  return <>{children}</>
}
