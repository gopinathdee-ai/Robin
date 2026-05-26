import { render, screen } from '@testing-library/react'
import { LeaderboardTable } from '../LeaderboardTable'
import { describe, it, expect } from 'vitest'

describe('LeaderboardTable', () => {
  const mockItems = [
    {
      rank: 1,
      userId: '1',
      displayName: 'John Electrician',
      role: 'master',
      score: 850,
      topicsCount: 5,
      endorsementsCount: 12,
      verified: true,
    },
    {
      rank: 2,
      userId: '2',
      displayName: 'Jane Plumber',
      role: 'journeyperson',
      score: 650,
      topicsCount: 3,
      endorsementsCount: 8,
      verified: false,
    },
    {
      rank: 3,
      userId: '3',
      displayName: 'Bob Carpenter',
      role: 'apprentice',
      score: 150,
      topicsCount: 1,
      endorsementsCount: 0,
      verified: false,
    },
  ]

  it('displays table with all columns', () => {
    render(<LeaderboardTable items={mockItems} currentUserRank={null} />)
    expect(screen.getByText('Rank')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('displays user names and scores', () => {
    render(<LeaderboardTable items={mockItems} currentUserRank={null} />)
    expect(screen.getByText('John Electrician')).toBeInTheDocument()
    expect(screen.getByText('Jane Plumber')).toBeInTheDocument()
    expect(screen.getByText('850')).toBeInTheDocument()
    expect(screen.getByText('650')).toBeInTheDocument()
  })

  it('displays role badges', () => {
    render(<LeaderboardTable items={mockItems} currentUserRank={null} />)
    const masterBadges = screen.getByText('M ✓')
    expect(masterBadges).toBeInTheDocument()
  })

  it('displays topics and endorsement counts', () => {
    render(<LeaderboardTable items={mockItems} currentUserRank={null} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('shows medal emoji for top 3 ranks', () => {
    const { container } = render(<LeaderboardTable items={mockItems} currentUserRank={null} />)
    const text = container.textContent || ''
    expect(text.includes('🥇') || text.includes('🥈') || text.includes('🥉')).toBeTruthy()
  })
})
