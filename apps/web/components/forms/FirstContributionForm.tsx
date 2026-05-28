import React from 'react'
import { FormInput } from '@/components/ui/FormInput'
import { FormSelect, type SelectOption } from '@/components/ui/FormSelect'

interface FirstContributionFormData {
  title: string
  body: string
  topicId: string
}

interface FirstContributionFormProps {
  contentType: 'question' | 'post'
  onContentTypeChange: (type: 'question' | 'post') => void
  topicOptions: SelectOption[]
  formData: FirstContributionFormData
  onFormChange: (data: Partial<FirstContributionFormData>) => void
  onSubmit: () => Promise<void>
  loading?: boolean
  error?: string
}

export function FirstContributionForm({
  contentType,
  onContentTypeChange,
  topicOptions,
  formData,
  onFormChange,
  onSubmit,
  loading = false,
  error,
}: FirstContributionFormProps) {
  const [localError, setLocalError] = React.useState<string>('')

  const MIN_BODY_LENGTH = 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.title.trim()) {
      setLocalError('Please enter a title')
      return
    }

    if (!formData.body.trim()) {
      setLocalError('Please enter content')
      return
    }

    if (formData.body.trim().length < MIN_BODY_LENGTH) {
      setLocalError(`Please write at least ${MIN_BODY_LENGTH} characters`)
      return
    }

    try {
      await onSubmit()
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Failed to submit'
      )
    }
  }

  const displayError = error || localError

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <h2 className="text-lg font-medium text-ink-900 mb-4">
          Share your first contribution
        </h2>
        <p className="text-sm text-ink-600 mb-4">
          Help the community by sharing knowledge or asking a question.
        </p>

        {/* Content type selector */}
        <div className="flex gap-4 mb-6">
          {['question', 'post'].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                value={type}
                checked={contentType === type}
                onChange={(e) =>
                  onContentTypeChange(e.target.value as 'question' | 'post')
                }
                disabled={loading}
                className="w-4 h-4"
              />
              <span className="text-ink-900">
                {type === 'question' ? 'Ask a question' : 'Share knowledge'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Topic selector */}
      <FormSelect
        label="Expertise topic"
        options={topicOptions}
        value={formData.topicId}
        onChange={(value) => onFormChange({ topicId: value })}
        placeholder="Select a topic..."
        required
        disabled={loading}
      />

      {/* Title */}
      <FormInput
        label={contentType === 'question' ? 'Question' : 'Post title'}
        placeholder={
          contentType === 'question'
            ? 'What do you want to know?'
            : 'Share a technique or insight...'
        }
        value={formData.title}
        onChange={(value) => onFormChange({ title: value })}
        required
        disabled={loading}
        maxLength={200}
      />

      {/* Body */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink-900">
          Details<span className="text-trades-500 ml-1">*</span>
        </label>
        <textarea
          value={formData.body}
          onChange={(e) => onFormChange({ body: e.target.value })}
          placeholder={
            contentType === 'question'
              ? 'Describe what you need help with...'
              : 'Share details, step-by-step instructions, or insights...'
          }
          disabled={loading}
          maxLength={5000}
          rows={6}
          className={`w-full px-3 py-2 border rounded-md text-base font-sans transition-colors resize-none ${
            displayError
              ? 'border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500'
              : 'border-ink-300 bg-white focus:outline-none focus:ring-2 focus:ring-trades-500'
          } ${loading ? 'bg-ink-100 cursor-not-allowed' : ''}`}
          aria-invalid={!!displayError}
        />
        <div className="flex justify-between items-center text-xs">
          <span className={formData.body.trim().length < MIN_BODY_LENGTH ? 'text-ink-400' : 'text-green-600'}>
            {formData.body.trim().length < MIN_BODY_LENGTH
              ? `${MIN_BODY_LENGTH - formData.body.trim().length} more characters needed`
              : '✓ Ready to publish'}
          </span>
          <span className="text-ink-600">
            {formData.body.length} / 5000
          </span>
        </div>
      </div>

      {/* Error message */}
      {displayError && (
        <div className="p-3 rounded-md bg-red-50 border border-red-300">
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !formData.title.trim() || formData.body.trim().length < MIN_BODY_LENGTH}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors min-h-[44px] ${
          loading || !formData.title.trim() || formData.body.trim().length < MIN_BODY_LENGTH
            ? 'bg-ink-200 text-ink-600 cursor-not-allowed'
            : 'bg-trades-500 text-white hover:bg-trades-600'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Publishing...
          </span>
        ) : (
          'Publish'
        )}
      </button>
    </form>
  )
}
