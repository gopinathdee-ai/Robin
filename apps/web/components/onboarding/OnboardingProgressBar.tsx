interface OnboardingProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export function OnboardingProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: OnboardingProgressBarProps) {
  const progressPercent = (currentStep / totalSteps) * 100

  const defaultLabels = [
    'Role',
    'Trade',
    'Tutorial',
    'Profile',
    'First Post',
    'Preferences',
  ]
  const labels = stepLabels || defaultLabels

  return (
    <div className="w-full space-y-3">
      {/* Step indicator */}
      <div className="flex justify-between items-center px-2">
        <span className="text-sm font-medium text-ink-700">
          Step {currentStep} of {totalSteps}
        </span>
        {labels[currentStep - 1] && (
          <span className="text-sm text-ink-600">
            {labels[currentStep - 1]}
          </span>
        )}
      </div>

      {/* Step dots */}
      <div className="flex gap-2 justify-between px-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i + 1 <= currentStep
                ? 'bg-trades-500'
                : i + 1 === currentStep + 1
                  ? 'bg-trades-300'
                  : 'bg-ink-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
