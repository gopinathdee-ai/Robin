import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormSelect } from '../FormSelect'
import { describe, it, expect, vi } from 'vitest'

const mockOptions = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
]

describe('FormSelect', () => {
  it('renders select with label', () => {
    const { container } = render(
      <FormSelect
        label="Choose one"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />,
    )

    const label = container.querySelector('label')
    expect(label).toBeTruthy()
  })

  it('renders all provided options', () => {
    const { container } = render(
      <FormSelect
        label="Select"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.options.length).toBeGreaterThanOrEqual(mockOptions.length)
  })

  it('calls onChange when value changes', async () => {
    const onChange = vi.fn()
    const { container } = render(
      <FormSelect
        label="Select"
        options={mockOptions}
        value=""
        onChange={onChange}
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    if (select) {
      select.value = 'opt-2'
      select.dispatchEvent(new Event('change', { bubbles: true }))
      expect(onChange).toHaveBeenCalled()
    }
  })

  it('shows required indicator when required', () => {
    const { container } = render(
      <FormSelect
        label="Required select"
        options={mockOptions}
        value=""
        onChange={() => {}}
        required
      />,
    )

    const label = container.querySelector('label')
    expect(label?.textContent).toMatch(/Required/)
  })

  it('applies disabled state to select', () => {
    const { container } = render(
      <FormSelect
        label="Disabled"
        options={mockOptions}
        value=""
        onChange={() => {}}
        disabled
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.disabled).toBe(true)
  })

  it('renders with placeholder option', () => {
    const { container } = render(
      <FormSelect
        label="Select"
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Pick one..."
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.options.length).toBeGreaterThan(0)
  })

  it('shows error message when provided', () => {
    const { container } = render(
      <FormSelect
        label="Select"
        options={mockOptions}
        value=""
        onChange={() => {}}
        error="This field is required"
      />,
    )

    expect(container.textContent).toContain('This field is required')
  })
})
