import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SpecialisationSelector } from '../SpecialisationSelector'
import { describe, it, expect, vi } from 'vitest'

const mockSpecialisations = [
  { id: 'spec-1', code: 'RES', name: 'Residential' },
  { id: 'spec-2', code: 'COM', name: 'Commercial' },
  { id: 'spec-3', code: 'IND', name: 'Industrial' },
]

describe('SpecialisationSelector', () => {
  it('renders specialisation checkboxes', () => {
    render(
      <SpecialisationSelector
        specialisations={mockSpecialisations}
        selected={[]}
        onSelect={() => {}}
      />,
    )

    expect(screen.getByLabelText(/residential/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/commercial/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/industrial/i)).toBeInTheDocument()
  })

  it('calls onSelect when checkbox toggled', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <SpecialisationSelector
        specialisations={mockSpecialisations}
        selected={[]}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByLabelText(/residential/i))
    expect(onSelect).toHaveBeenCalled()
  })

  it('checks selected specialisations', () => {
    const { container } = render(
      <SpecialisationSelector
        specialisations={mockSpecialisations}
        selected={['spec-1', 'spec-2']}
        onSelect={() => {}}
      />,
    )

    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    expect((checkboxes[0] as HTMLInputElement).checked).toBe(true)
    expect((checkboxes[1] as HTMLInputElement).checked).toBe(true)
    expect((checkboxes[2] as HTMLInputElement).checked).toBe(false)
  })

  it('displays empty state when no specialisations provided', () => {
    render(
      <SpecialisationSelector
        specialisations={[]}
        selected={[]}
        onSelect={() => {}}
      />,
    )

    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes.length).toBe(0)
  })
})
