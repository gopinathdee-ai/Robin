import { render, screen } from '@testing-library/react'
import { ReputationCard } from '../ReputationCard'
import { describe, it, expect } from 'vitest'

describe('ReputationCard', () => {
  const mockProps = {
    totalPoints: 500,
    tier: 'Expert',
    pointsToNextTier: 250,
    breakdown: {
      contributions: 200,
      answers: 100,
      upvotes: 50,
      endorsements: 100,
      other: 50,
    },
  }

  it('displays total reputation points', () => {
    render(<ReputationCard {...mockProps} />)
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText(/reputation points/i)).toBeInTheDocument()
  })

  it('displays tier badge', () => {
    render(<ReputationCard {...mockProps} />)
    expect(screen.getByText('Expert')).toBeInTheDocument()
  })

  it('shows progress bar when not mentor eligible', () => {
    render(<ReputationCard {...mockProps} />)
    expect(screen.getByText(/Progress to Mentor/i)).toBeInTheDocument()
    expect(screen.getByText('250 points to next tier')).toBeInTheDocument()
  })

  it('shows mentor eligible message when at 750+ points', () => {
    const mentorProps = { ...mockProps, totalPoints: 750, tier: 'Mentor Eligible', pointsToNextTier: 0 }
    render(<ReputationCard {...mentorProps} />)
    expect(screen.getByText(/Eligible for mentor tier/i)).toBeInTheDocument()
  })

  it('displays score breakdown', () => {
    render(<ReputationCard {...mockProps} />)
    expect(screen.getByText(/Posts & articles/)).toBeInTheDocument()
    expect(screen.getByText(/Answers accepted/)).toBeInTheDocument()
    // Check that we have multiple "100 pts" in the document (one for answers, one for endorsements)
    const pts100Elements = screen.getAllByText('100 pts')
    expect(pts100Elements.length).toBeGreaterThanOrEqual(2)
  })

  it('displays all breakdown categories', () => {
    render(<ReputationCard {...mockProps} />)
    expect(screen.getByText(/Upvotes received/)).toBeInTheDocument()
    expect(screen.getByText(/Endorsements/)).toBeInTheDocument()
  })

  it('handles zero other points', () => {
    const noOtherProps = { ...mockProps, breakdown: { ...mockProps.breakdown, other: 0 } }
    render(<ReputationCard {...noOtherProps} />)
    // Should not show "Other" row if it's zero
    const otherElements = screen.queryAllByText(/Other/)
    expect(otherElements.length).toBe(0)
  })

  it('calculates correct progress bar percentage', () => {
    render(<ReputationCard {...mockProps} />)
    // 500/750 = 66.67%
    const progressPercent = screen.getByText('67%')
    expect(progressPercent).toBeInTheDocument()
  })
})
