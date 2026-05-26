import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EndorsementModal } from '../EndorsementModal'
import { describe, it, expect, vi, beforeEach } from 'vitest'

global.fetch = vi.fn()

describe('EndorsementModal', () => {
  const mockOnSuccess = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch for topics API
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          { id: 'topic-1', name: 'Panel Installation' },
          { id: 'topic-2', name: 'Troubleshooting' },
        ],
      }),
    })
  })

  it('renders modal with title', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText(/Endorse John Doe for/i)).toBeInTheDocument()
  })

  it('renders topic selector dropdown', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Expertise Topic')).toBeInTheDocument()
  })

  it('renders rationale textarea', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByText('Why are they great?')).toBeInTheDocument()
  })

  it('shows character count for rationale', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    const textarea = screen.getByPlaceholderText(/Share what makes them great/i)
    fireEvent.change(textarea, {
      target: { value: 'This is a test rationale for endorsement purposes.' },
    })
    expect(screen.getByText(/\d+ \/ 500/)).toBeInTheDocument()
  })

  it('disables submit button when rationale < 80 chars', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    const textarea = screen.getByPlaceholderText(/Share what makes them great/i)
    fireEvent.change(textarea, { target: { value: 'Too short' } })
    const submitButton = screen.getByRole('button', { name: /Send Endorsement/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when rationale 80-500 chars', async () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    // Wait for topics to load
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toHaveValue('')
    })
    const textarea = screen.getByPlaceholderText(/Share what makes them great/i)
    fireEvent.change(textarea, {
      target: { value: 'a'.repeat(100) },
    })
    const submitButton = screen.getByRole('button', { name: /Send Endorsement/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('shows validation error for text < 80 chars', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    const textarea = screen.getByPlaceholderText(/Share what makes them great/i)
    fireEvent.change(textarea, { target: { value: 'Short' } })
    expect(screen.getByText(/Minimum 80 characters/i)).toBeInTheDocument()
  })

  it('renders Cancel and Submit buttons', () => {
    render(
      <EndorsementModal
        recipientId="user-2"
        recipientName="John Doe"
        recipientTradeId="trade-1"
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Endorsement/i })).toBeInTheDocument()
  })
})
