'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

// Screen 1.7 — Profile Setup
// Minimal required fields. The profile builds through activity, not a form.
// Progress indicator framed as 'rank' not 'completion %'.

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'ON', name: 'Ontario' },
  { code: 'QC', name: 'Quebec' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland & Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NU', name: 'Nunavut' },
]

const EXPERIENCE_RANGES = [
  { value: '0', label: 'Just starting out (0–1 years)' },
  { value: '2', label: '2–5 years' },
  { value: '6', label: '6–10 years' },
  { value: '11', label: '11–20 years' },
  { value: '21', label: '20+ years' },
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    displayName: '',
    province: '',
    yearsExperience: '',
    employerName: '',   // optional
  })
  const [saving, setSaving] = useState(false)

  const isValid = form.displayName.trim().length >= 2 && form.province && form.yearsExperience

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleFinish() {
    if (!isValid) return
    setSaving(true)

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: form.displayName,
          provinceCode: form.province,
          yearsExperience: parseInt(form.yearsExperience),
          employerName: form.employerName || undefined,
          onboardingStep: 4,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      router.push('/onboarding/first-contribution')
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaving(false)
    }
  }

  return (
    <OnboardingShell
      step={4}
      totalSteps={6}
      title="Last step — a few basics"
      subtitle="We only need what we need. Your profile builds through what you do, not what you fill in."
    >
      <div className="space-y-5">

        {/* Display name */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            What should we call you? <span className="text-trades-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Mike T. or Mike Tremblay"
            value={form.displayName}
            onChange={(e) => update('displayName', e.target.value)}
            className="input"
            maxLength={80}
          />
          <p className="mt-1 text-xs text-ink-400">
            Shown to peers. First name and last initial is fine.
          </p>
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            Province / territory <span className="text-trades-500">*</span>
          </label>
          <select
            value={form.province}
            onChange={(e) => update('province', e.target.value)}
            className="input"
          >
            <option value="">Select your province...</option>
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Years experience */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            Years in the trade <span className="text-trades-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {EXPERIENCE_RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => update('yearsExperience', range.value)}
                className={`text-left rounded-xl border-2 px-4 py-2.5 text-sm 
                            font-medium transition-all
                  ${form.yearsExperience === range.value
                    ? 'border-trades-500 bg-trades-50 text-trades-700'
                    : 'border-ink-200 text-ink-600 hover:border-ink-300'
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Optional fields */}
        <div className="pt-2 border-t border-ink-200">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-4">
            Optional — add now or later
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Employer or contractor name
              </label>
              <input
                type="text"
                placeholder="e.g. ABC Electrical Ltd."
                value={form.employerName}
                onChange={(e) => update('employerName', e.target.value)}
                className="input"
              />
            </div>

          </div>
        </div>

      </div>

      <div className="mt-8">
        <button
          onClick={handleFinish}
          disabled={!isValid || saving}
          className="btn-primary w-full text-base py-4"
        >
          {saving ? 'Setting up your account...' : 'Go to my record'}
          {!saving && <ChevronRight className="h-5 w-5" />}
        </button>
        <p className="mt-3 text-center text-xs text-ink-400">
          Everything here can be changed from your profile at any time
        </p>
      </div>
    </OnboardingShell>
  )
}
