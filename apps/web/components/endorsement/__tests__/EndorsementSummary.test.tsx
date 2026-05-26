import { render, screen } from '@testing-library/react'
import { EndorsementSummary } from '../EndorsementSummary'
import { describe, it, expect } from 'vitest'

describe('EndorsementSummary', () => {
  it('renders null when count is 0', () => {
    const { container } = render(
      <EndorsementSummary topics={[]} count={0} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('displays endorsement count badge', () => {
    const topics = [
      { id: 't1', name: 'Panel Installation' },
      { id: 't2', name: 'Troubleshooting' },
    ]
    render(<EndorsementSummary topics={topics} count={2} />)
    expect(screen.getByText(/2 endorsements/)).toBeInTheDocument()
  })

  it('shows singular "endorsement" when count is 1', () => {
    const topics = [{ id: 't1', name: 'Panel Installation' }]
    render(<EndorsementSummary topics={topics} count={1} />)
    expect(screen.getByText(/1 endorsement/)).toBeInTheDocument()
  })

  it('displays first 3 topics in comma-separated list', () => {
    const topics = [
      { id: 't1', name: 'Panel Installation' },
      { id: 't2', name: 'Troubleshooting' },
      { id: 't3', name: 'Safety Practices' },
    ]
    render(<EndorsementSummary topics={topics} count={3} />)
    expect(screen.getByText(/Panel Installation, Troubleshooting, Safety Practices/)).toBeInTheDocument()
  })

  it('shows "+X more" when topics exceed 3', () => {
    const topics = [
      { id: 't1', name: 'Panel Installation' },
      { id: 't2', name: 'Troubleshooting' },
      { id: 't3', name: 'Safety' },
      { id: 't4', name: 'Wiring' },
      { id: 't5', name: 'Grounding' },
    ]
    render(<EndorsementSummary topics={topics} count={5} />)
    expect(screen.getByText(/\+2 more/)).toBeInTheDocument()
  })

  it('renders Award icon', () => {
    const topics = [{ id: 't1', name: 'Panel Installation' }]
    const { container } = render(<EndorsementSummary topics={topics} count={1} />)
    // SVG icon should be rendered
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('displays heading text "How peers recognize you"', () => {
    const topics = [{ id: 't1', name: 'Panel Installation' }]
    render(<EndorsementSummary topics={topics} count={1} />)
    expect(screen.getByText(/How peers recognize you/)).toBeInTheDocument()
  })

  it('renders link to endorsements page', () => {
    const topics = [{ id: 't1', name: 'Panel Installation' }]
    render(<EndorsementSummary topics={topics} count={1} />)
    const link = screen.getByRole('link', { name: /View all endorsements/i })
    expect(link).toHaveAttribute('href', '/profile/endorsements')
  })

  it('displays correct styling classes', () => {
    const topics = [{ id: 't1', name: 'Panel Installation' }]
    const { container } = render(<EndorsementSummary topics={topics} count={1} />)
    expect(container.querySelector('.bg-trades-50')).toBeInTheDocument()
    expect(container.querySelector('.border-trades-200')).toBeInTheDocument()
  })
})
