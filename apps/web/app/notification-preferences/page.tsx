'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SimpleShell } from '@/components/SimpleShell'
import { NotificationPrefsForm } from '@/components/onboarding/NotificationPrefsForm'
import { useToast } from '@/components/ui/ToastContext'

export default function NotificationPreferencesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState('')

  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: 'Preferences Saved',
      description: 'Your notification preferences have been saved!',
    })
    router.push('/dashboard')
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
    <SimpleShell title="Notification Preferences" subtitle="Preferences">
      <div className="space-y-6">
        <p className="text-ink-600">
          Choose how you'd like to stay updated about platform activities and your credentials.
        </p>

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
    </SimpleShell>
  )
}
