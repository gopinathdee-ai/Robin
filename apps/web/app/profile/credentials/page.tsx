'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { CredentialUploadForm } from '@/components/credentials/CredentialUploadForm'
import { CredentialList } from '@/components/credentials/CredentialList'
import { Spinner } from '@/components/ui/Spinner'
import { X } from 'lucide-react'

interface UserDocument {
  id: string
  documentType: string
  fileName: string
  fileSize: number
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  rejectionReason?: string
  createdAt: string
}

export default function CredentialsPage() {
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents')
      if (!response.ok) throw new Error('Failed to fetch documents')
      const data = await response.json()
      setDocuments(data.items || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (newDocument: any) => {
    setShowUploadForm(false)
    fetchDocuments()
  }

  const handleDocumentsChange = () => {
    fetchDocuments()
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink-900">My Credentials</h1>
            <p className="mt-2 text-ink-600">
              Upload and manage your trade credentials and certifications
            </p>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner label="Loading your credentials..." />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Upload Form Modal/Section */}
              {showUploadForm && (
                <div className="rounded-lg border border-ink-200 bg-ink-50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-ink-900">
                      Upload New Credential
                    </h2>
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="text-ink-500 hover:text-ink-700 p-1 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Close form"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <CredentialUploadForm
                    onSuccess={handleUploadSuccess}
                    onCancel={() => setShowUploadForm(false)}
                  />
                </div>
              )}

              {/* Documents List or Empty State */}
              {documents.length === 0 && !showUploadForm ? (
                <div className="text-center py-16">
                  <p className="text-ink-600 mb-6">
                    You haven't uploaded any credentials yet.
                  </p>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="flex items-center justify-center px-6 py-3 bg-trades-500 text-white rounded-lg font-medium hover:bg-trades-600 transition-colors min-h-[44px]"
                  >
                    Upload Your First Credential
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    {!showUploadForm && (
                      <button
                        onClick={() => setShowUploadForm(true)}
                        className="flex items-center justify-center px-4 py-2.5 bg-trades-100 text-trades-700 rounded-lg font-medium hover:bg-trades-200 transition-colors min-h-[44px]"
                      >
                        + Upload New Credential
                      </button>
                    )}
                  </div>
                  <CredentialList
                    documents={documents}
                    onUploadNew={() => setShowUploadForm(true)}
                    onDocumentsChange={handleDocumentsChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 rounded-lg border border-trades-200 bg-trades-50 p-6">
            <h3 className="font-semibold text-trades-900 mb-2">About Credentials</h3>
            <ul className="space-y-2 text-sm text-trades-800">
              <li>✓ Upload Red Seal certificates, safety tickets, and other credentials</li>
              <li>✓ Documents are reviewed and verified by our team</li>
              <li>✓ Verified credentials appear on your public profile</li>
              <li>✓ Maximum file size: 10MB (PDF, JPEG, or PNG)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
