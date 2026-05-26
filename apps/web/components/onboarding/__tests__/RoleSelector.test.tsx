import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RoleSelector } from '../RoleSelector'
import { describe, it, expect, vi } from 'vitest'

describe('RoleSelector', () => {
  it('renders all 4 role options', () => {
    const onSelect = vi.fn()
    render(<RoleSelector onSelect={onSelect} />)

    expect(screen.getByRole('button', { name: /apprentice/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /journeyperson/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /master/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /employer/i })).toBeInTheDocument()
  })

  it('calls onSelect with role when button clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<RoleSelector onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /apprentice/i }))
    expect(onSelect).toHaveBeenCalledWith('apprentice')
  })

  it('handles multiple role selections', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<RoleSelector onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /journeyperson/i }))
    expect(onSelect).toHaveBeenCalledWith('journeyperson')

    await user.click(screen.getByRole('button', { name: /master/i }))
    expect(onSelect).toHaveBeenCalledWith('master')

    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it('applies disabled state when provided', () => {
    const onSelect = vi.fn()
    const { rerender } = render(
      <RoleSelector onSelect={onSelect} disabled={false} />,
    )

    let button = screen.getByRole('button', { name: /apprentice/i })
    expect(button).not.toBeDisabled()

    rerender(<RoleSelector onSelect={onSelect} disabled={true} />)
    button = screen.getByRole('button', { name: /apprentice/i })
    expect(button).toBeDisabled()
  })
})
