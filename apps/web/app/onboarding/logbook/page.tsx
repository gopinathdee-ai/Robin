'use client'

import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export default function LogbookPage() {
  const router = useRouter()

  return (
    <OnboardingShell
      step={3}
      totalSteps={6}
      title="Your record. Yours forever."
      subtitle="Your Logbook"
    >
      {/* Icon */}
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6">
        <FontAwesomeIcon icon={faBook} className="h-7 w-7" />
      </div>

      {/* Body */}
      <div className="space-y-4 mb-6">
        <p className="text-base text-ink-700 leading-relaxed">
          Every skill you verify, every course you complete, every mentor who recognises your work goes in here.
        </p>
        <p className="text-base text-ink-700 leading-relaxed">
          When you leave a job, it comes with you. When you start a new one, hand your employer a link instead of digging through a drawer for old paperwork.
        </p>
      </div>

      {/* Highlight callout */}
      <div className="rounded-xl bg-trades-50 border border-trades-200 px-4 py-3 mb-6">
        <p className="text-sm font-medium text-trades-700">Unlike your employer's system, nobody can take this from you.</p>
      </div>

      {/* Continue */}
      <button
        onClick={() => router.push('/onboarding/rank')}
        className="btn-primary w-full text-base py-4"
      >
        Got it — keep going
        <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
      </button>
    </OnboardingShell>
  )
}
