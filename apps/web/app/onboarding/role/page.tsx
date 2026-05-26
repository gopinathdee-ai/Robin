'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HardHat, Wrench, Star, Building2, ChevronRight, CheckCircle2 } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { Spinner } from '@/components/ui/Spinner'

// Screen 1.2 — Role Selection
// First onboarding step after account creation.
// Uses trades hierarchy language — not generic "user type" framing.

type Role = 'apprentice' | 'journeyperson' | 'master' | 'employer_admin'

const roles: {
  id: Role
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  colour: string
}[] = [
  {
    id: 'apprentice',
    icon: HardHat,
    title: 'Apprentice',
    subtitle: 'Starting out or in training',
    description:
      'Build your record from day one. Track your hours, collect credentials, and connect with journeypersons who can help you progress.',
    colour: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'journeyperson',
    icon: Wrench,
    title: 'Journeyperson',
    subtitle: 'Ticketed and working in the trade',
    description:
      'Showcase your expertise, earn peer endorsements, and work toward mentor status by contributing your knowledge to the community.',
    colour: 'bg-trades-50 text-trades-600',
  },
  {
    id: 'master',
    icon: Star,
    title: 'Master / Supervisor',
    subtitle: 'Leading crews and mentoring others',
    description:
      'Share decades of experience, mentor the next generation, and build a verified record of the tradespeople you have helped advance.',
    colour: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'employer_admin',
    icon: Building2,
    title: 'Employer / Contractor',
    subtitle: 'Managing a team or workforce',
    description:
      'View your team\'s credentials, track apprenticeship progress, and connect your workforce with structured development opportunities.',
    colour: 'bg-green-50 text-green-600',
  },
]

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Role | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    if (!selected) return
    setSaving(true)

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selected,
          onboardingStep: 1,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save role')
      }

      router.push('/onboarding/trade')
    } catch (error) {
      console.error('Error saving role:', error)
      setSaving(false)
    }
  }

  return (
    <OnboardingShell
      step={1}
      totalSteps={6}
      title="Where are you in the trade?"
      subtitle="Pick the one that fits best — you can update it later."
    >
      <div className="space-y-3">
        {roles.map((role, idx) => {
          const Icon = role.icon
          const isSelected = selected === role.id

          return (
            <motion.button
              key={role.id}
              onClick={() => setSelected(role.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all
                ${isSelected
                  ? 'border-trades-500 bg-trades-50 shadow-md'
                  : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                }`}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center
                                 justify-center rounded-xl ${role.colour}`}
                  animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink-900">{role.title}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-trades-500 flex-shrink-0" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-xs text-ink-400">{role.subtitle}</span>
                  <p className="mt-1 text-sm text-ink-600 leading-snug">
                    {role.description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="btn-primary w-full text-base py-4"
        >
          {saving ? (
            <>
              <Spinner size="sm" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </motion.div>
    </OnboardingShell>
  )
}
