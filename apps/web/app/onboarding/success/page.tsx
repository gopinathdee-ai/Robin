'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export default function OnboardingSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Mark onboarding as complete
    async function completeOnboarding() {
      try {
        await fetch('/api/users/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboardingDone: true }),
        })
      } catch (error) {
        console.error('Failed to mark onboarding complete:', error)
      }
    }

    completeOnboarding()
  }, [])

  return (
    <OnboardingShell currentStep={6} totalSteps={6} showBackButton={false}>
      <div className="text-center space-y-8 py-8">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-50 p-6">
            <FontAwesomeIcon icon={faCheckCircle} className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-ink-900">
            You're ready!
          </h1>
          <p className="text-lg text-ink-600">
            Your first credential is being issued. Welcome to the community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 bg-ink-50 rounded-xl p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-trades-500">+10</div>
            <div className="text-xs text-ink-600">Reputation points</div>
            <div className="text-xs text-ink-500 mt-1">(after approval)</div>
          </div>
          <div className="text-center border-l border-r border-ink-300">
            <div className="text-2xl font-bold text-trades-500">1</div>
            <div className="text-xs text-ink-600">Credential issued</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-trades-500">1/750</div>
            <div className="text-xs text-ink-600">To mentor tier</div>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-trades-50 border border-trades-200 rounded-xl p-6 text-left space-y-3">
          <h2 className="font-semibold text-trades-900">What's next?</h2>
          <ul className="space-y-2 text-sm text-trades-700">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Browse the community feed and help others with questions</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Build your reputation by contributing your expertise</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Earn endorsements from respected peers in your trade</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Work toward mentor tier and unlock mentorship opportunities</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 px-4 bg-trades-500 text-white rounded-lg font-semibold hover:bg-trades-600 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            Go to Dashboard
            <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" />
          </button>
          <button
            onClick={() => router.push('/community')}
            className="w-full flex items-center justify-center py-3 px-4 border border-ink-300 text-ink-900 rounded-lg font-semibold hover:bg-ink-50 transition-colors min-h-[44px]"
          >
            Browse community
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-ink-500 pt-4">
          Your profile is now visible to other tradespeople and employers. Learn more about your privacy settings anytime.
        </p>
      </div>
    </OnboardingShell>
  )
}
