'use client'

import { useRouter } from 'next/navigation'

import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export default function RankPage() {
  const router = useRouter()

  return (
    <OnboardingShell
      step={4}
      totalSteps={6}
      title="Earn your rank. Don't just claim it."
      subtitle="Your Rank"
    >
      {/* Icon */}
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-trades-50 text-trades-600 mb-6">
        <FontAwesomeIcon icon={faMedal} className="h-7 w-7" />
      </div>

      {/* Body */}
      <div className="space-y-4 mb-6">
        <p className="text-base text-ink-700 leading-relaxed">
          On this platform your rank means something because it's earned — not self-declared. When you share knowledge and your peers in the trade recognise it as solid, your reputation grows.
        </p>
        <p className="text-base text-ink-700 leading-relaxed">
          Reach journeyperson rank on the platform and you unlock the ability to mentor. Reach master rank and the community knows you've put in the work.
        </p>
      </div>

      {/* Highlight callout */}
      <div className="rounded-xl bg-trades-50 border border-trades-200 px-4 py-3 mb-6">
        <p className="text-sm font-medium text-trades-700">Every contribution you make is visible, verifiable, and yours.</p>
      </div>

      {/* Continue */}
      <button
        onClick={() => router.push('/onboarding/tutorial')}
        className="btn-primary w-full text-base py-4"
      >
        Got it — keep going
        <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
      </button>
    </OnboardingShell>
  )
}
