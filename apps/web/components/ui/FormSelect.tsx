import React from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export function FormSelect({
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder,
}: FormSelectProps) {
  const id = React.useId()

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-ink-900 mb-1"
        >
          {label}
          {required && <span className="text-trades-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md text-base font-sans transition-colors ${
          error
            ? 'border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500'
            : 'border-ink-300 bg-white focus:outline-none focus:ring-2 focus:ring-trades-500'
        } ${disabled ? 'bg-ink-100 cursor-not-allowed' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
