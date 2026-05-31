'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/forms/MarkdownEditor'

interface AnswerFormProps {
  questionId: string
  onAnswerPosted: () => void
}

export function AnswerForm({ questionId, onAnswerPosted }: AnswerFormProps) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (body.trim().length < 20) {
      setError('Answer must be at least 20 characters')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'answer',
          parentId: questionId,
          body,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post answer')
      }

      setBody('')
      onAnswerPosted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink-200 rounded-lg p-4">
      <label className="block text-sm font-medium text-ink-900 mb-2">Your Answer</label>
      <MarkdownEditor
        value={body}
        onChange={setBody}
        placeholder="Share your knowledge..."
        rows={5}
        minLength={20}
        maxLength={10000}
      />
      <div className="flex items-end justify-between mt-3">
        <div />
        <Button
          type="submit"
          variant="primary"
          disabled={loading || body.trim().length < 20}
          loading={loading}
        >
          {loading ? 'Posting...' : 'Post Answer'}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  )
}
