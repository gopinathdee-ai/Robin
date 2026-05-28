'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export default function FinishPage() {
  const router = useRouter()

  async function handleFinish() {
    try {
      // Mark onboarding as complete
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingStep: 6 }),
      }).catch(console.error)

      // Redirect to post-onboarding flow (Profile)
      router.push('/profile-setup')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  return (
    <OnboardingShell
      step={6}
      totalSteps={6}
      title="You're all set."
      subtitle="Finish Setup"
    >
      {/* Icon */}
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-6">
        <CheckCircle className="h-7 w-7" />
      </div>

      {/* Body */}
      <div className="space-y-4 mb-6">
        <p className="text-base text-ink-700 leading-relaxed">
          You're ready to start. Next, we'll help you set up your profile and make your first contribution.
        </p>
      </div>

      {/* Continue */}
      <button
        onClick={handleFinish}
        className="btn-primary w-full text-base py-4"
      >
        Next: Profile Setup
        <ChevronRight className="h-5 w-5" />
      </button>
    </OnboardingShell>
  )
}
