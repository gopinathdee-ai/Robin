import { render, screen } from '@testing-library/react'
import { CredentialCard } from '../CredentialCard'
import { describe, it, expect, vi } from 'vitest'

describe('CredentialCard', () => {
  const mockDoc = {
    id: 'doc-1',
    documentType: 'RED_SEAL',
    fileName: 'red_seal.pdf',
    fileSize: 1024 * 100, // 100KB
    status: 'PENDING' as const,
    createdAt: new Date('2024-01-15').toISOString(),
  }

  it('renders credential document info', () => {
    render(<CredentialCard {...mockDoc} />)

    expect(screen.getByText('Red Seal Certificate')).toBeInTheDocument()
    expect(screen.getByText('red_seal.pdf')).toBeInTheDocument()
    expect(screen.getByText(/Pending Review/)).toBeInTheDocument()
  })

  it('displays verified status with checkmark', () => {
    render(
      <CredentialCard
        {...mockDoc}
        status="VERIFIED"
      />
    )

    expect(screen.getByText(/Verified/)).toBeInTheDocument()
  })

  it('displays file size correctly', () => {
    render(<CredentialCard {...mockDoc} />)

    expect(screen.getByText(/0\.10 MB/)).toBeInTheDocument()
  })

  it('shows delete button for pending documents', () => {
    const onDelete = vi.fn()
    render(<CredentialCard {...mockDoc} onDelete={onDelete} />)

    const deleteButton = screen.getByLabelText('Delete document')
    expect(deleteButton).toBeInTheDocument()
  })

  it('does not show delete button for verified documents', () => {
    const onDelete = vi.fn()
    render(<CredentialCard {...mockDoc} status="VERIFIED" onDelete={onDelete} />)

    const deleteButton = screen.queryByLabelText('Delete document')
    expect(deleteButton).not.toBeInTheDocument()
  })
})
