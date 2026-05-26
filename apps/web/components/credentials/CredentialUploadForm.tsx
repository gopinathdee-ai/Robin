'use client'

import React, { useState } from 'react'
import { FileUploadInput } from '@/components/ui/FileUploadInput'
import { DocumentTypeSelector } from './DocumentTypeSelector'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastContext'

interface UserDocument {
  id: string
  documentType: string
  fileName: string
  status: string
  fileSize: number
  createdAt: string
}

interface CredentialUploadFormProps {
  onSuccess?: (document: UserDocument) => void
  onCancel?: () => void
}

export function CredentialUploadForm({
  onSuccess,
  onCancel,
}: CredentialUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isValid = file && documentType && !loading

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file || !documentType) {
      toast({
        title: 'Error',
        description: 'Please select a document type and file',
        variant: 'error',
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const document = await response.json()

      toast({
        title: 'Success',
        description: 'Document uploaded successfully. It will be reviewed by our team.',
        variant: 'success',
      })

      setFile(null)
      setDocumentType(null)

      if (onSuccess) {
        onSuccess(document)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Document Type Selector */}
      <DocumentTypeSelector
        selected={documentType}
        onSelect={setDocumentType}
        disabled={loading}
      />

      {/* File Upload Input */}
      <FileUploadInput
        onFile={setFile}
        disabled={loading}
      />

      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            size="md"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          loading={loading}
          size="md"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  )
}
