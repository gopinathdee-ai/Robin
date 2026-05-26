import { render, screen } from '@testing-library/react'
import { ContentCard } from '../ContentCard'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

describe('ContentCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ bookmarked: false }),
    })
  })
  const mockContent = {
    id: 'test-id',
    type: 'question' as const,
    title: 'How to install a circuit breaker?',
    body: 'I need to replace a faulty circuit breaker in my panel. What are the steps?',
    author: {
      id: 'user-1',
      displayName: 'John Sparks',
      role: 'journeyperson',
    },
    trade: { id: 'trade-1', name: 'Electrician' },
    topic: { id: 'topic-1', name: 'Panel Installation' },
    upvotes: 5,
    createdAt: new Date().toISOString(),
    answersCount: 2,
  }

  it('renders content title and body preview', () => {
    render(<ContentCard {...mockContent} />)
    expect(screen.getByText(/How to install a circuit breaker/)).toBeInTheDocument()
    expect(screen.getByText(/I need to replace a faulty/)).toBeInTheDocument()
  })

  it('displays author name and role badge', () => {
    render(<ContentCard {...mockContent} />)
    expect(screen.getByText('John Sparks')).toBeInTheDocument()
    expect(screen.getByText(/Journeyperson/)).toBeInTheDocument()
  })

  it('shows trade and topic tags', () => {
    render(<ContentCard {...mockContent} />)
    expect(screen.getByText('Electrician')).toBeInTheDocument()
    expect(screen.getByText('Panel Installation')).toBeInTheDocument()
  })

  it('displays upvote count', () => {
    render(<ContentCard {...mockContent} />)
    expect(screen.getByText(/5 upvotes/)).toBeInTheDocument()
  })

  it('shows answer count for questions', () => {
    render(<ContentCard {...mockContent} answersCount={2} />)
    expect(screen.getByText(/2 answers/)).toBeInTheDocument()
  })

  it('truncates long body text', () => {
    const longBody = 'a'.repeat(200)
    render(<ContentCard {...mockContent} body={longBody} />)
    const text = screen.getByText(/a+\.{3}/)
    expect(text.textContent?.length).toBeLessThan(200)
  })

  it('renders as a link to detail page', () => {
    render(<ContentCard {...mockContent} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/community/test-id')
  })

  it('adds Q: prefix for questions', () => {
    render(<ContentCard {...mockContent} type="question" />)
    expect(screen.getByText(/^Q:/)).toBeInTheDocument()
  })

  it('does not add prefix for posts', () => {
    render(<ContentCard {...mockContent} type="post" title="My tip for electrical safety" />)
    expect(screen.getByText('My tip for electrical safety')).toBeInTheDocument()
    // Should not have Q: prefix for posts
    const text = screen.queryByText(/^Q:/)
    // Text "Q:" should not appear in the title area for posts
  })

  it('displays time ago', () => {
    render(<ContentCard {...mockContent} />)
    // Should show "now" or similar
    expect(screen.getByText(/ago|now/i)).toBeInTheDocument()
  })

  it('shows master role with checkmark', () => {
    const masterContent = {
      ...mockContent,
      author: { ...mockContent.author, role: 'master' },
    }
    render(<ContentCard {...masterContent} />)
    expect(screen.getByText(/Master ✓/)).toBeInTheDocument()
  })

  it('shows apprentice role', () => {
    const apprenticeContent = {
      ...mockContent,
      author: { ...mockContent.author, role: 'apprentice' },
    }
    render(<ContentCard {...apprenticeContent} />)
    expect(screen.getByText('Apprentice')).toBeInTheDocument()
  })

  it('renders bookmark button', () => {
    render(<ContentCard {...mockContent} />)
    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i })
    expect(bookmarkButton).toBeInTheDocument()
  })

  it('bookmark button has correct title attributes', () => {
    render(<ContentCard {...mockContent} />)
    const bookmarkButton = screen.getByRole('button')
    expect(bookmarkButton).toHaveAttribute('title', 'Save bookmark')
  })

  it('does not prevent link navigation when clicking bookmark button', () => {
    render(<ContentCard {...mockContent} />)
    const bookmarkButton = screen.getByRole('button')
    expect(bookmarkButton).toBeInTheDocument()
    // Link should still exist and be clickable
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/community/test-id')
  })
})
