import React from 'react'

interface FormInputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  type?: 'text' | 'email' | 'number' | 'password'
  maxLength?: number
  disabled?: boolean
  autoFocus?: boolean
}

export function FormInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  type = 'text',
  maxLength,
  disabled,
  autoFocus,
}: FormInputProps) {
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`w-full px-3 py-2 border rounded-md text-base font-sans transition-colors ${
          error
            ? 'border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500'
            : 'border-ink-300 bg-white focus:outline-none focus:ring-2 focus:ring-trades-500'
        } ${disabled ? 'bg-ink-100 cursor-not-allowed' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm mt-1">
          {error}
        </p>
      )}
      {maxLength && (
        <p className="text-ink-500 text-xs mt-1">
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  )
}
