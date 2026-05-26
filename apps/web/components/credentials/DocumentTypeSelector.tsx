'use client'

import React from 'react'
import { DOCUMENT_TYPES } from '@/lib/documents'

interface DocumentTypeSelectorProps {
  selected: string | null
  onSelect: (type: string) => void
  disabled?: boolean
}

export function DocumentTypeSelector({
  selected,
  onSelect,
  disabled = false,
}: DocumentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="documentType" className="block text-sm font-medium text-ink-900">
        Document Type <span className="text-trades-500">*</span>
      </label>
      <select
        id="documentType"
        value={selected || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className={`
          w-full rounded-lg border px-4 py-2.5 text-sm transition-colors
          ${
            disabled
              ? 'bg-ink-100 border-ink-300 text-ink-500 cursor-not-allowed'
              : 'border-ink-300 bg-white text-ink-900 focus:border-trades-500 focus:ring-1 focus:ring-trades-500'
          }
        `}
      >
        <option value="">Select a document type...</option>
        {DOCUMENT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-ink-600">
        Choose the type of credential document you're uploading
      </p>
    </div>
  )
}
