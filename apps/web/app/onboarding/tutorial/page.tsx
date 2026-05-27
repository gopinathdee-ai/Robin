'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Award, MessageSquarePlus, ChevronRight, ArrowRight } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward as faBadge } from '@fortawesome/free-solid-svg-icons'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

// Screens 1.4 / 1.5 / 1.6 — Onboarding Tutorial
// Three concepts introduced one at a time.
// Language mirrors trades hierarchy — logbook, rank, contributing to the crew.
// Screen 1.6 ends with the user completing their first real contribution.

type TutorialStep = 0 | 1 | 2

const tutorialSteps = [
  {
    icon: BookOpen,
    colour: 'bg-blue-50 text-blue-600',
    rank: 'Your Logbook',
    heading: 'Your record. Yours forever.',
    body: `Think of this as your digital logbook — but better. Every skill you verify,
every course you complete, every mentor who recognises your work goes in here.

When you leave a job, it comes with you. When you start a new one, hand your
employer a link instead of digging through a drawer for old paperwork.`,
    highlight: 'Unlike your employer\'s system, nobody can take this from you.',
  },
  {
    icon: Award,
    colour: 'bg-trades-50 text-trades-600',
    rank: 'Your Rank',
    heading: 'Earn your rank. Don\'t just claim it.',
    body: `On this platform your rank means something because it\'s earned — not
self-declared. When you share knowledge and your peers in the trade recognise
it as solid, your reputation grows.

Reach journeyperson rank on the platform and you unlock the ability to mentor.
Reach master rank and the community knows you\'ve put in the work.`,
    highlight: 'Every contribution you make is visible, verifiable, and yours.',
  },
  {
    icon: MessageSquarePlus,
    colour: 'bg-green-50 text-green-600',
    rank: 'First Contribution',
    heading: 'Time to show what you know.',
    body: `Below is a real question from someone in your trade. Answer it the way
you\'d answer a new apprentice on the job site — plain, practical, and based
on what you\'ve actually done.

This earns your first credential. Takes about two minutes.`,
    highlight: null,
    isAction: true,
  },
]

// Example contribution prompt for the tutorial
const SEED_QUESTION = {
  id: 'example',
  trade: 'Your Trade',
  body: 'What\'s the most common mistake you see apprentices make when pulling wire through conduit for the first time?',
  askedBy: 'First-year apprentice',
}

export default function TutorialPage() {
  const router = useRouter()
  const [step, setStep] = useState<TutorialStep>(0)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const current = tutorialSteps[step]
  const Icon = current.icon

  async function handleFirstContribution() {
    if (answer.trim().length < 20) return
    setSubmitting(true)

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'post',
          title: 'My first contribution',
          body: answer,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit answer')
      }

      // Update onboarding step
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingStep: 3 }),
      })

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleNext() {
    if (step < 2) {
      setStep((s) => (s + 1) as TutorialStep)
    } else {
      // Update onboarding step to 3 when leaving tutorial
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingStep: 3 }),
      }).catch(console.error)

      router.push('/onboarding/profile')
    }
  }

  return (
    <OnboardingShell
      step={3 + step}
      totalSteps={6}
      title={current.heading}
      subtitle={current.rank}
    >
      {/* Icon */}
      <div className={`inline-flex h-14 w-14 items-center justify-center 
                       rounded-2xl ${current.colour} mb-6`}>
        <Icon className="h-7 w-7" />
      </div>

      {/* Body */}
      <div className="space-y-4 mb-6">
        {current.body.split('\n\n').map((para, i) => (
          <p key={i} className="text-base text-ink-700 leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Highlight callout */}
      {current.highlight && (
        <div className="rounded-xl bg-trades-50 border border-trades-200 px-4 py-3 mb-6">
          <p className="text-sm font-medium text-trades-700">{current.highlight}</p>
        </div>
      )}

      {/* First contribution action — step 2 only */}
      {current.isAction && !submitted && (
        <div className="mb-6 space-y-4">
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-2">
              Question from a {SEED_QUESTION.askedBy}
            </p>
            <p className="text-base text-ink-800 font-medium leading-snug">
              {SEED_QUESTION.body}
            </p>
          </div>
          <textarea
            placeholder="Share what you know — like you're talking to someone new on site..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            className="input resize-none text-base"
          />
          <p className={`text-xs ${answer.length < 20 ? 'text-ink-400' : 'text-green-600'}`}>
            {answer.length < 20
              ? `${20 - answer.length} more characters to go`
              : '✓ Ready to submit'}
          </p>
          <button
            onClick={handleFirstContribution}
            disabled={answer.trim().length < 20 || submitting}
            className="btn-primary w-full py-4"
          >
            {submitting ? 'Submitting...' : 'Submit my answer'}
            {!submitting && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* Submission success */}
      {submitted && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center">
          <div className="text-2xl mb-2 text-green-600">
            <FontAwesomeIcon icon={faBadge} />
          </div>
          <p className="font-semibold text-green-800">First contribution earned!</p>
          <p className="text-sm text-green-600 mt-1">
            Your answer is in review. Your first credential is on its way.
          </p>
        </div>
      )}

      {/* Continue */}
      {(!current.isAction || submitted) && (
        <button onClick={handleNext} className="btn-primary w-full text-base py-4">
          {step < 2 ? 'Got it — keep going' : 'Finish setup'}
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </OnboardingShell>
  )
}
