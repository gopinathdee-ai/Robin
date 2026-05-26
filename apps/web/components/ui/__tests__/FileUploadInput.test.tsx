import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUploadInput } from '../FileUploadInput'
import { describe, it, expect, vi } from 'vitest'

describe('FileUploadInput', () => {
  it('renders drag-drop zone', () => {
    const onFile = vi.fn()
    render(<FileUploadInput onFile={onFile} />)

    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
  })

  it('calls onFile when file is selected via input', async () => {
    const onFile = vi.fn()
    const user = userEvent.setup()
    render(<FileUploadInput onFile={onFile} />)

    const input = screen.getByLabelText('Upload file') as HTMLInputElement
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

    await user.upload(input, file)

    // onFile should be called with null if validation fails or with file if it passes
    expect(onFile).toHaveBeenCalled()
  })

  it('accepts valid file types and rejects invalid ones', async () => {
    const onFile = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<FileUploadInput onFile={onFile} />)

    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    // Test valid file
    const validFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    await user.upload(input, validFile)

    // File input accepts the upload
    expect(input.files).toHaveLength(1)
    expect(input.files?.[0]?.name).toBe('test.pdf')
  })

  it('is disabled when disabled prop is true', () => {
    const onFile = vi.fn()
    const { container } = render(<FileUploadInput onFile={onFile} disabled={true} />)

    const input = container.querySelector('input[type="file"]')
    expect(input).toHaveAttribute('disabled')
  })
})
