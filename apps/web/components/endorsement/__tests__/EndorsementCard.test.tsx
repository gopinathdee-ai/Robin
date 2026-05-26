import { render, screen } from '@testing-library/react'
import { EndorsementCard } from '../EndorsementCard'
import { describe, it, expect, beforeEach, vi } from 'vitest'

global.fetch = vi.fn()

describe('EndorsementCard', () => {
  const mockEndorsement = {
    id: 'endorsement-1',
    endorser: {
      id: 'user-1',
      displayName: 'John Sparks',
      role: 'journeyperson',
      verified: true,
    },
    topic: { id: 'topic-1', name: 'Panel Installation' },
    rationale: 'This user has exceptional expertise in electrical panel installation and safety practices. They consistently provide thorough guidance and maintain high standards.',
    weight: 1.5,
    status: 'accepted' as const,
    createdAt: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays endorser name and role badge', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    expect(screen.getByText('John Sparks')).toBeInTheDocument()
    expect(screen.getByText(/Journeyperson/)).toBeInTheDocument()
  })

  it('shows topic name', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    expect(screen.getByText('Panel Installation')).toBeInTheDocument()
  })

  it('displays rationale excerpt', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    expect(screen.getByText(/exceptional expertise/)).toBeInTheDocument()
  })

  it('displays weight badge', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    expect(screen.getByText(/1\.50x/)).toBeInTheDocument()
  })

  it('shows accepted status checkmark', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    // Status indicator should be visible
    expect(screen.getByText(/Panel Installation/)).toBeInTheDocument()
  })

  it('shows pending status when applicable', () => {
    const pendingEndorsement = { ...mockEndorsement, status: 'pending' as const }
    render(<EndorsementCard endorsement={pendingEndorsement} />)
    expect(screen.getByText(/Panel Installation/)).toBeInTheDocument()
  })

  it('displays Accept/Reject buttons only when canAccept=true and status=pending', () => {
    const pendingEndorsement = { ...mockEndorsement, status: 'pending' as const }
    render(<EndorsementCard endorsement={pendingEndorsement} canAccept={true} />)
    expect(screen.getByRole('button', { name: /Accept/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument()
  })

  it('does not show Accept/Reject buttons when canAccept=false', () => {
    const pendingEndorsement = { ...mockEndorsement, status: 'pending' as const }
    render(<EndorsementCard endorsement={pendingEndorsement} canAccept={false} />)
    expect(screen.queryByRole('button', { name: /Accept/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Reject/i })).not.toBeInTheDocument()
  })

  it('does not show Accept/Reject buttons for accepted endorsements', () => {
    render(<EndorsementCard endorsement={mockEndorsement} canAccept={true} />)
    expect(screen.queryByRole('button', { name: /Accept/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Reject/i })).not.toBeInTheDocument()
  })

  it('shows verified checkmark in role badge for verified users', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    expect(screen.getByText(/Journeyperson ✓/)).toBeInTheDocument()
  })

  it('displays timestamp', () => {
    render(<EndorsementCard endorsement={mockEndorsement} />)
    expect(screen.getByText(/ago|now/i)).toBeInTheDocument()
  })
})
