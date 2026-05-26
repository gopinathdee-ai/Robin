import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationPrefsForm } from '../NotificationPrefsForm'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/components/ui/Spinner', () => ({
  Spinner: () => <div>Loading...</div>,
}))

global.fetch = vi.fn()

describe('NotificationPrefsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads and displays preferences', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        weeklyDigest: true,
        endorsements: true,
        credentialUpdates: true,
        communityActivity: false,
        marketing: false,
      }),
    } as any)

    render(<NotificationPrefsForm onSuccess={onSuccess} onError={onError} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Weekly Digest')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Endorsements')).toBeInTheDocument()
    expect(screen.getByLabelText('Credential Updates')).toBeInTheDocument()
  })

  it('allows toggling preferences', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const user = userEvent.setup()

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        weeklyDigest: true,
        endorsements: true,
        credentialUpdates: true,
        communityActivity: false,
        marketing: false,
      }),
    } as any)

    render(<NotificationPrefsForm onSuccess={onSuccess} onError={onError} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Weekly Digest')).toBeInTheDocument()
    })

    const weeklyDigestCheckbox = screen.getByLabelText(
      'Weekly Digest'
    ) as HTMLInputElement
    expect(weeklyDigestCheckbox.checked).toBe(true)

    await user.click(weeklyDigestCheckbox)

    expect(weeklyDigestCheckbox.checked).toBe(false)
  })

  it('submits updated preferences', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const user = userEvent.setup()

    const mockPrefs = {
      id: 'pref-1',
      userId: 'user-1',
      weeklyDigest: true,
      endorsements: true,
      credentialUpdates: true,
      communityActivity: false,
      marketing: false,
    }

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrefs,
    } as any)

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrefs,
    } as any)

    render(<NotificationPrefsForm onSuccess={onSuccess} onError={onError} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Weekly Digest')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /Continue/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.any(Object))
    })
  })
})
