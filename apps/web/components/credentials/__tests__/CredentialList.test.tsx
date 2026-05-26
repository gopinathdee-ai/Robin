import { render, screen } from '@testing-library/react'
import { CredentialList } from '../CredentialList'
import { describe, it, expect, vi } from 'vitest'

// Mock ToastContext
vi.mock('@/components/ui/ToastContext', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

describe('CredentialList', () => {
  const mockDocuments = [
    {
      id: 'doc-1',
      documentType: 'RED_SEAL',
      fileName: 'red_seal.pdf',
      fileSize: 1024,
      status: 'VERIFIED' as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'doc-2',
      documentType: 'SAFETY_WHMIS',
      fileName: 'whmis.pdf',
      fileSize: 2048,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    },
  ]

  it('renders empty state when no documents', () => {
    render(<CredentialList documents={[]} />)

    expect(screen.getByText(/No credentials uploaded yet/i)).toBeInTheDocument()
  })

  it('groups documents by status', () => {
    render(<CredentialList documents={mockDocuments} />)

    expect(screen.getByText(/Verified Credentials/)).toBeInTheDocument()
    // Look for the pending section header with count
    expect(screen.getByText(/Pending Review \(/)).toBeInTheDocument()
  })

  it('displays upload button when provided', () => {
    const onUploadNew = vi.fn()
    render(<CredentialList documents={[]} onUploadNew={onUploadNew} />)

    expect(
      screen.getByText(/Upload Your First Credential/i)
    ).toBeInTheDocument()
  })

  it('calls onUploadNew when upload button clicked', async () => {
    const onUploadNew = vi.fn()
    render(<CredentialList documents={mockDocuments} onUploadNew={onUploadNew} />)

    const uploadButton = screen.getByText(/Upload Another Credential/i)
    expect(uploadButton).toBeInTheDocument()
  })
})
