import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentTypeSelector } from '../DocumentTypeSelector'
import { describe, it, expect, vi } from 'vitest'

describe('DocumentTypeSelector', () => {
  it('renders the document type selector', () => {
    const onSelect = vi.fn()
    render(<DocumentTypeSelector selected={null} onSelect={onSelect} />)

    expect(screen.getByText('Document Type')).toBeInTheDocument()
  })

  it('calls onSelect when option is selected', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<DocumentTypeSelector selected={null} onSelect={onSelect} />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'RED_SEAL')

    expect(onSelect).toHaveBeenCalledWith('RED_SEAL')
  })

  it('displays selected value', () => {
    const onSelect = vi.fn()
    render(<DocumentTypeSelector selected="RED_SEAL" onSelect={onSelect} />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('RED_SEAL')
  })
})
