import { render, screen } from '@testing-library/react'
import { EndorsementList } from '../EndorsementList'
import { Endorsement } from '@/hooks/useEndorsements'
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../../hooks/useEndorsements', () => ({
  useEndorsements: vi.fn(),
}))

describe('EndorsementList', () => {
  const mockEndorsements: Endorsement[] = [
    {
      id: 'e1',
      endorser: {
        id: 'user-1',
        displayName: 'John Sparks',
        role: 'journeyperson',
        verified: true,
      },
      topic: { id: 't1', name: 'Panel Installation' },
      rationale: 'Excellent expertise in electrical panel work.',
      weight: 1.5,
      status: 'accepted',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e2',
      endorser: {
        id: 'user-2',
        displayName: 'Jane Wires',
        role: 'master',
        verified: true,
      },
      topic: { id: 't2', name: 'Circuit Troubleshooting' },
      rationale: 'Outstanding skills in diagnosing electrical issues and solving complex problems.',
      weight: 3.0,
      status: 'accepted',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'e3',
      endorser: {
        id: 'user-3',
        displayName: 'Mike Tools',
        role: 'apprentice',
        verified: false,
      },
      topic: { id: 't1', name: 'Panel Installation' },
      rationale: 'Great help understanding the basics of electrical installation.',
      weight: 0.5,
      status: 'accepted',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useEndorsements } = await import('../../../hooks/useEndorsements')
    vi.mocked(useEndorsements).mockReturnValue({
      endorsements: mockEndorsements,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
  })

  it('renders endorsement cards up to maxDisplay limit', () => {
    render(<EndorsementList recipientId="user-me" maxDisplay={2} />)
    expect(screen.getByText('John Sparks')).toBeInTheDocument()
    expect(screen.getByText('Jane Wires')).toBeInTheDocument()
  })

  it('shows "View all endorsements" link when more exist', () => {
    render(<EndorsementList recipientId="user-me" maxDisplay={2} showViewAll={true} />)
    expect(screen.getByText(/View all/)).toBeInTheDocument()
  })

  it('does not show "View all" link when disabled', () => {
    render(<EndorsementList recipientId="user-me" maxDisplay={5} showViewAll={false} />)
    expect(screen.queryByText(/View all/)).not.toBeInTheDocument()
  })

  it('displays all endorsements when maxDisplay >= total count', () => {
    render(<EndorsementList recipientId="user-me" maxDisplay={10} />)
    expect(screen.getByText('John Sparks')).toBeInTheDocument()
    expect(screen.getByText('Jane Wires')).toBeInTheDocument()
    expect(screen.getByText('Mike Tools')).toBeInTheDocument()
  })

  it('renders endorsement details for each card', () => {
    render(<EndorsementList recipientId="user-me" maxDisplay={1} />)
    expect(screen.getByText('John Sparks')).toBeInTheDocument()
    expect(screen.getByText('Panel Installation')).toBeInTheDocument()
  })

  it('respects limit parameter', () => {
    render(
      <EndorsementList recipientId="user-me" limit={5} maxDisplay={3} />
    )
    // Should display 3 max even though limit is 5
    expect(screen.getByText('John Sparks')).toBeInTheDocument()
  })
})
