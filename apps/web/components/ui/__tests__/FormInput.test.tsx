import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormInput } from '../FormInput'
import { describe, it, expect, vi } from 'vitest'

describe('FormInput', () => {
  it('renders input with label', () => {
    const { container } = render(
      <FormInput
        label="Email"
        placeholder="Enter email"
        value=""
        onChange={() => {}}
      />,
    )

    const label = container.querySelector('label')
    expect(label).toBeTruthy()
    expect(label?.textContent).toContain('Email')
  })

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <FormInput
        label="Name"
        placeholder="Enter name"
        value=""
        onChange={onChange}
      />,
    )

    const input = screen.getByPlaceholderText('Enter name')
    await user.type(input, 'John')
    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith('J')
    expect(onChange).toHaveBeenCalledWith('h')
  })

  it('displays error state when error prop provided', () => {
    const { container } = render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />,
    )

    expect(container.textContent).toContain('Invalid email')
  })

  it('respects maxLength attribute', () => {
    const { container } = render(
      <FormInput
        label="Code"
        placeholder="Max 3 chars"
        value=""
        onChange={() => {}}
        maxLength={3}
      />,
    )

    const input = container.querySelector('input') as HTMLInputElement
    expect(input.maxLength).toBe(3)
  })

  it('marks required fields', () => {
    const { container } = render(
      <FormInput
        label="Password"
        placeholder="Enter password"
        value=""
        onChange={() => {}}
        required
      />,
    )

    const label = container.querySelector('label')
    expect(label?.textContent).toContain('*')
  })

  it('applies disabled state', () => {
    const { container } = render(
      <FormInput
        label="Disabled field"
        value=""
        onChange={() => {}}
        disabled
      />,
    )

    const input = container.querySelector('input') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })
})
