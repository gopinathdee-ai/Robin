'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SimpleShell } from '@/components/SimpleShell'
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

export default function FirstPostPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [userTrades, setUserTrades] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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

        if (user.trades && user.trades.length > 0) {
          const tradeId = user.trades[0].tradeId
          setUserTrades([tradeId])

          const topicsRes = await fetch(`/api/trades/${tradeId}/topics`)
          if (!topicsRes.ok) throw new Error('Failed to fetch topics')
          const topicsData = await topicsRes.json()
          setTopics(topicsData.items)

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
      return
    }

    setSubmitting(true)

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
        throw new Error('Failed to submit contribution')
      }

      // Navigate to notification preferences
      router.push('/notification-preferences')
    } catch (error) {
      console.error('Error submitting contribution:', error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SimpleShell>
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading your topics..." />
        </div>
      </SimpleShell>
    )
  }

  return (
    <SimpleShell title="Share your first contribution" subtitle="First Post">
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
      />
    </SimpleShell>
  )
}
