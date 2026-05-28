'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { FirstContributionForm } from '@/components/forms/FirstContributionForm'
import { Spinner } from '@/components/ui/Spinner'

interface Topic {
  id: string
  code: string
  name: string
}

interface SelectOption {
  value: string
  label: string
}

export default function FirstContributionPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [userTrades, setUserTrades] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [contentType, setContentType] = useState<'question' | 'post'>('question')
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    topicId: '',
  })

  // Fetch user's trades and topics on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch('/api/users/me')
        if (!userRes.ok) throw new Error('Failed to fetch user')
        const user = await userRes.json()

        // Get user's first trade
        if (user.trades && user.trades.length > 0) {
          const tradeId = user.trades[0].tradeId
          setUserTrades([tradeId])

          // Fetch topics for first trade
          const topicsRes = await fetch(`/api/trades/${tradeId}/topics`)
          if (!topicsRes.ok) throw new Error('Failed to fetch topics')
          const topicsData = await topicsRes.json()
          setTopics(topicsData.items)

          // Set first topic as default
          if (topicsData.items.length > 0) {
            setFormData((prev) => ({ ...prev, topicId: topicsData.items[0].id }))
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const topicOptions: SelectOption[] = topics.map((topic) => ({
    value: topic.id,
    label: topic.name,
  }))

  async function handleSubmit() {
    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!userTrades[0]) {
      setError('Trade information not loaded. Please refresh the page.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          tradeId: userTrades[0],
          topicId: formData.topicId,
          title: formData.title,
          body: formData.body,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit contribution')
      }

      // Mark onboarding as complete
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboardingStep: 5,
          accountStatus: 'active',
          onboardingCompletedAt: new Date().toISOString(),
        }),
      }).catch(console.error)

      // Navigate to notifications preferences
      router.push('/onboarding/notifications')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error submitting contribution:', err)
      setError(errorMessage)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <OnboardingShell currentStep={5} totalSteps={6}>
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading your topics..." />
        </div>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell currentStep={5} totalSteps={6} title="Share your first contribution">
      <div className="mb-6">
        <p className="text-ink-600 mb-4">
          Help the community by sharing knowledge or asking a question. Your first contribution earns your opening credential.
        </p>
      </div>

      <FirstContributionForm
        contentType={contentType}
        onContentTypeChange={setContentType}
        topicOptions={topicOptions}
        formData={formData}
        onFormChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        onSubmit={handleSubmit}
        loading={submitting}
        error={error}
      />
    </OnboardingShell>
  )
}
