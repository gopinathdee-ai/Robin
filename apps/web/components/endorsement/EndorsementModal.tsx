'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCreateEndorsement } from '@/hooks/useEndorsements'

interface ExpertiseTopic {
  id: string
  name: string
}

interface EndorsementModalProps {
  recipientId: string
  recipientName: string
  recipientTradeId: string
  onSuccess: () => void
  onClose: () => void
}

export function EndorsementModal({
  recipientId,
  recipientName,
  recipientTradeId,
  onSuccess,
  onClose,
}: EndorsementModalProps) {
  const [topics, setTopics] = useState<ExpertiseTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [rationale, setRationale] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { create, loading: createLoading } = useCreateEndorsement()

  // Fetch topics for the trade
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch(`/api/trades/${recipientTradeId}/topics`)
        if (!res.ok) return
        const data = await res.json()
        setTopics(data.items || [])
        if (data.items?.length > 0) {
          setSelectedTopic(data.items[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch topics', err)
      }
    }
    fetchTopics()
  }, [recipientTradeId])

  const charCount = rationale.length
  const isValid = selectedTopic && charCount >= 80 && charCount <= 500
  const isLoading = createLoading || loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    try {
      setLoading(true)
      setError(null)
      await create(recipientId, selectedTopic, rationale)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create endorsement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink-200">
          <h2 className="text-lg font-bold text-ink-900">
            Endorse {recipientName} for...
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-ink-100 rounded disabled:opacity-50"
          >
            <X size={20} className="text-ink-600" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

          {/* Topic Selector */}
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">Expertise Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-trades-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rationale */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-ink-900">Why are they great?</label>
              <span className={`text-xs font-medium ${charCount < 80 ? 'text-red-600' : 'text-ink-500'}`}>
                {charCount} / 500
              </span>
            </div>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Share what makes them great in this area (minimum 80 characters)"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-trades-500 focus:border-transparent disabled:opacity-50 resize-none h-24"
            />
            {charCount < 80 && charCount > 0 && (
              <p className="text-xs text-red-600 mt-1">Minimum 80 characters required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || isLoading}
              loading={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Sending...' : 'Send Endorsement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
