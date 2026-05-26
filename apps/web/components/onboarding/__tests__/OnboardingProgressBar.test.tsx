import { render, screen } from '@testing-library/react'
import { OnboardingProgressBar } from '../OnboardingProgressBar'
import { describe, it, expect } from 'vitest'

describe('OnboardingProgressBar', () => {
  it('renders 5 step indicators', () => {
    const { container } = render(<OnboardingProgressBar currentStep={1} totalSteps={5} />)

    const dotsContainer = container.querySelector('div.flex.gap-2')
    const dots = dotsContainer ? dotsContainer.querySelectorAll('div') : []
    expect(dots.length).toBe(5)
  })

  it('highlights current step', () => {
    const { container } = render(<OnboardingProgressBar currentStep={2} totalSteps={5} />)

    const dotsContainer = container.querySelector('div.flex.gap-2')
    const dots = dotsContainer ? dotsContainer.querySelectorAll('div') : []
    expect(dots.length).toBeGreaterThan(0)
    expect(dots[0]).toHaveClass('bg-trades-500')
    expect(dots[1]).toHaveClass('bg-trades-500')
  })

  it('displays step numbers correctly for each step', () => {
    for (let step = 1; step <= 5; step++) {
      const { unmount } = render(<OnboardingProgressBar currentStep={step} totalSteps={5} />)
      expect(screen.getByText(new RegExp(`Step ${step}`, 'i'))).toBeInTheDocument()
      unmount()
    }
  })

  it('updates step text when current step changes', () => {
    const { rerender } = render(<OnboardingProgressBar currentStep={1} totalSteps={5} />)
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()

    rerender(<OnboardingProgressBar currentStep={3} totalSteps={5} />)
    expect(screen.getByText('Step 3 of 5')).toBeInTheDocument()
  })

  it('applies completed styling to past steps', () => {
    const { container } = render(<OnboardingProgressBar currentStep={3} totalSteps={5} />)

    const dotsContainer = container.querySelector('div.flex.gap-2')
    const dots = dotsContainer ? dotsContainer.querySelectorAll('div') : []
    expect(dots.length).toBeGreaterThan(0)
    expect(dots[0]).toHaveClass('bg-trades-500')
    expect(dots[1]).toHaveClass('bg-trades-500')
    expect(dots[2]).toHaveClass('bg-trades-500')
    expect(dots[3]).toHaveClass('bg-trades-300')
  })
})
