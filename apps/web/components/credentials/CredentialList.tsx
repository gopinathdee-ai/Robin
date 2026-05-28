'use client'

import React, { useState } from 'react'
import { CredentialCard } from './CredentialCard'
import { useToast } from '@/components/ui/ToastContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface UserDocument {
  id: string
  documentType: string
  fileName: string
  fileSize: number
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  rejectionReason?: string
  createdAt: string
}

interface CredentialListProps {
  documents?: UserDocument[]
  loading?: boolean
  onUploadNew?: () => void
  onDocumentsChange?: () => void
}

export function CredentialList({
  documents = [],
  loading = false,
  onUploadNew,
  onDocumentsChange,
}: CredentialListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const verified = documents.filter((d) => d.status === 'VERIFIED')
  const pending = documents.filter((d) => d.status === 'PENDING')
  const rejected = documents.filter((d) => d.status === 'REJECTED')

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete document')
      }

      toast({
        title: 'Success',
        description: 'Document deleted successfully',
        variant: 'success',
      })

      if (onDocumentsChange) {
        onDocumentsChange()
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-600 mb-4">No credentials uploaded yet</p>
        {onUploadNew && (
          <button
            onClick={onUploadNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-trades-500 text-white rounded-lg font-medium hover:bg-trades-600 transition-colors min-h-[44px]"
          >
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            Upload Your First Credential
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Verified Credentials */}
      {verified.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-ink-900 mb-3">
            Verified Credentials ({verified.length})
          </h3>
          <div className="space-y-3">
            {verified.map((doc) => (
              <CredentialCard
                key={doc.id}
                {...doc}
                loading={deletingId === doc.id}
                // Verified documents can't be deleted
              />
            ))}
          </div>
        </section>
      )}

      {/* Pending Credentials */}
      {pending.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-ink-900 mb-3">
            Pending Review ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((doc) => (
              <CredentialCard
                key={doc.id}
                {...doc}
                loading={deletingId === doc.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Rejected Credentials */}
      {rejected.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-ink-900 mb-3">
            Rejected ({rejected.length})
          </h3>
          <p className="text-sm text-ink-600 mb-3">
            You can delete rejected documents and upload a corrected version
          </p>
          <div className="space-y-3">
            {rejected.map((doc) => (
              <CredentialCard
                key={doc.id}
                {...doc}
                loading={deletingId === doc.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upload More Button */}
      {onUploadNew && (
        <div className="pt-4 border-t border-ink-200">
          <button
            onClick={onUploadNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-trades-100 text-trades-700 rounded-lg font-medium hover:bg-trades-200 transition-colors min-h-[44px]"
          >
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
            Upload Another Credential
          </button>
        </div>
      )}
    </div>
  )
}
