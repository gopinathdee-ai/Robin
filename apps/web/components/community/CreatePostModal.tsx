'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

interface Trade {
  id: string
  name: string
}

interface Topic {
  id: string
  name: string
}

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    type: 'question' as 'question' | 'post',
    tradeId: '',
    topicId: '',
    title: '',
    body: '',
  })

  // Fetch trades on mount
  useEffect(() => {
    if (!isOpen) return

    async function fetchTrades() {
      try {
        setLoading(true)
        const response = await fetch('/api/trades')
        if (response.ok) {
          const data = await response.json()
          setTrades(data.items || [])
          if (data.items?.length > 0) {
            setFormData((prev) => ({ ...prev, tradeId: data.items[0].id }))
          }
        }
      } catch (err) {
        console.error('Failed to fetch trades', err)
        setError('Failed to load trades')
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [isOpen])

  // Fetch topics when trade changes
  useEffect(() => {
    if (!formData.tradeId) return

    async function fetchTopics() {
      try {
        const response = await fetch(`/api/trades/${formData.tradeId}/topics`)
        if (response.ok) {
          const data = await response.json()
          setTopics(data.items || [])
          if (data.items?.length > 0 && !formData.topicId) {
            setFormData((prev) => ({ ...prev, topicId: data.items[0].id }))
          }
        }
      } catch (err) {
        console.error('Failed to fetch topics', err)
      }
    }

    fetchTopics()
  }, [formData.tradeId])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          tradeId: formData.tradeId || undefined,
          topicId: formData.topicId || undefined,
          title: formData.title,
          body: formData.body,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create post')
      }

      // Success
      setFormData({
        type: 'question',
        tradeId: trades[0]?.id || '',
        topicId: '',
        title: '',
        body: '',
      })
      onClose()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const titleLength = formData.title.length
  const bodyLength = formData.body.length
  const isTitleValid = titleLength >= 10 && titleLength <= 300
  const isBodyValid = bodyLength >= 20 && bodyLength <= 10000
  const isFormValid = isTitleValid && isBodyValid && formData.tradeId

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-ink-900">Create a Post</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-ink-400 hover:text-ink-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Type
            </label>
            <div className="flex gap-4">
              {(['question', 'post'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-ink-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trade */}
          <div>
            <label htmlFor="tradeId" className="block text-sm font-medium text-ink-900 mb-2">
              Trade
            </label>
            <select
              id="tradeId"
              name="tradeId"
              value={formData.tradeId}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500 disabled:opacity-50"
              required
            >
              {trades.map((trade) => (
                <option key={trade.id} value={trade.id}>
                  {trade.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          {topics.length > 0 && (
            <div>
              <label htmlFor="topicId" className="block text-sm font-medium text-ink-900 mb-2">
                Topic (Optional)
              </label>
              <select
                id="topicId"
                name="topicId"
                value={formData.topicId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
              >
                <option value="">Select a topic...</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink-900 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What do you want to ask or share?"
              className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
              required
            />
            <div
              className={`text-xs mt-2 ${
                isTitleValid ? 'text-ink-500' : 'text-red-600'
              }`}
            >
              {titleLength}/300 characters (10-300 required)
            </div>
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-ink-900 mb-2">
              Details
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Provide more details about your question or post..."
              rows={6}
              className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
              required
            />
            <div
              className={`text-xs mt-2 ${
                isBodyValid ? 'text-ink-500' : 'text-red-600'
              }`}
            >
              {bodyLength}/10000 characters (20-10000 required)
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-ink-200">
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || submitting}
              loading={submitting}
              className="flex-1 justify-center"
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 justify-center"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
