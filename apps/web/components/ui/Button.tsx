'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const baseStyles = 'font-medium rounded transition-colors flex items-center gap-2'

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variantStyles = {
    primary: isDisabled
      ? 'border border-ink-200 text-ink-400 bg-white cursor-not-allowed'
      : 'border border-trades-500 text-trades-700 bg-trades-100 hover:bg-trades-200 cursor-pointer',
    secondary: isDisabled
      ? 'border border-ink-200 text-ink-400 bg-white cursor-not-allowed'
      : 'border border-ink-300 text-ink-700 hover:bg-ink-50 cursor-pointer',
    danger: isDisabled
      ? 'border border-ink-200 text-ink-400 bg-white cursor-not-allowed'
      : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer',
  }

  const finalClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ''}`

  return (
    <button
      disabled={isDisabled}
      className={finalClassName}
      {...props}
    >
      {children}
    </button>
  )
}
