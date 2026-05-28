'use client'

import { useRouter } from 'next/navigation'
import { MessageSquarePlus, ChevronRight } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

// Step 5 — Tutorial Introduction
// Introduces the concept of contributing to the community

export default function TutorialPage() {
  const router = useRouter()

  return (
    <OnboardingShell
      step={5}
      totalSteps={6}
      title="Time to show what you know."
      subtitle="Tutorial"
    >
      {/* Icon */}
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-6">
        <MessageSquarePlus className="h-7 w-7" />
      </div>

      {/* Body */}
      <div className="space-y-4 mb-6">
        <p className="text-base text-ink-700 leading-relaxed">
          Below is a real question from someone in your trade. Answer it the way you'd answer a new apprentice on the job site — plain, practical, and based on what you've actually done.
        </p>
        <p className="text-base text-ink-700 leading-relaxed">
          This earns your first credential. Takes about two minutes.
        </p>
      </div>

      {/* Continue */}
      <button
        onClick={() => router.push('/onboarding/finish')}
        className="btn-primary w-full text-base py-4"
      >
        Got it — keep going
        <ChevronRight className="h-5 w-5" />
      </button>
    </OnboardingShell>
  )
}
