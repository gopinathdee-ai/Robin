'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { NotificationPrefsForm } from '@/components/onboarding/NotificationPrefsForm'
import { useToast } from '@/components/ui/ToastContext'

export default function NotificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState('')

  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: 'Preferences Saved',
      description: 'Your notification preferences have been saved!',
    })
    router.push('/onboarding/success')
  }

  const handleError = (message: string) => {
    setError(message)
    toast({
      variant: 'error',
      title: 'Error',
      description: message,
    })
  }

  return (
    <OnboardingShell step={6} currentStep={6}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">
            Notification Preferences
          </h1>
          <p className="text-ink-600 mt-2">
            Choose how you'd like to stay updated about platform activities and
            your credentials.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        <NotificationPrefsForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </OnboardingShell>
  )
}
