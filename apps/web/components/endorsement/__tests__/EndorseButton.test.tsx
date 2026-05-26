import { render, screen } from '@testing-library/react'
import { EndorseButton } from '../EndorseButton'
import { describe, it, expect, vi, beforeEach } from 'vitest'

global.fetch = vi.fn()

describe('EndorseButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders endorse button with default text', () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ canEndorse: true }),
    })
    render(<EndorseButton recipientId="user-2" recipientName="John Doe" />)
    expect(screen.getByRole('button', { name: /Endorse/i })).toBeInTheDocument()
  })

  it('disables button when endorser lacks contributions', () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ canEndorse: false, reason: 'needs_20_contributions' }),
    })
    render(<EndorseButton recipientId="user-2" recipientName="John Doe" />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('disables button when account too new', () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ canEndorse: false, reason: 'needs_60_days' }),
    })
    render(<EndorseButton recipientId="user-2" recipientName="John Doe" />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('disables button when reputation too low', () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ canEndorse: false, reason: 'needs_50_reputation' }),
    })
    render(<EndorseButton recipientId="user-2" recipientName="John Doe" />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows tooltip text for disabled button', () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ canEndorse: false, reason: 'needs_20_contributions' }),
    })
    render(<EndorseButton recipientId="user-2" recipientName="John Doe" />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title')
  })
})
