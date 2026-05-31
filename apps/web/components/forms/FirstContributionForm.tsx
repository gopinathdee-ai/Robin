import React from 'react'
import { FormInput } from '@/components/ui/FormInput'
import { FormSelect, type SelectOption } from '@/components/ui/FormSelect'
import { MarkdownEditor } from '@/components/forms/MarkdownEditor'

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

  const MIN_BODY_LENGTH = 20

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
      <div>
        <label className="block text-sm font-medium text-ink-900 mb-2">
          Details<span className="text-trades-500 ml-1">*</span>
        </label>
        <MarkdownEditor
          value={formData.body}
          onChange={(value) => onFormChange({ body: value })}
          placeholder={
            contentType === 'question'
              ? 'Describe what you need help with...'
              : 'Share details, step-by-step instructions, or insights...'
          }
          minLength={MIN_BODY_LENGTH}
          maxLength={5000}
          rows={6}
        />
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
