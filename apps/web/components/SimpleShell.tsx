import React from 'react'

interface SimpleShellProps {
  children: React.ReactNode
  onBack?: () => void
  showBackButton?: boolean
  title?: string
  subtitle?: string
}

export function SimpleShell({
  children,
  onBack,
  showBackButton = false,
  title,
  subtitle,
}: SimpleShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-ink-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto w-full">
          {subtitle && (
            <p className="text-sm font-medium text-trades-600 mb-2 uppercase tracking-wide">
              {subtitle}
            </p>
          )}
          {title && (
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-8">
              {title}
            </h1>
          )}

          {children}
        </div>
      </div>

      {/* Back button */}
      {showBackButton && onBack && (
        <div className="border-t border-ink-200 bg-white px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onBack}
              type="button"
              className="text-trades-500 hover:text-trades-600 font-medium text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
