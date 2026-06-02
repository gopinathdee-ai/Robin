'use client'

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { Spinner } from '@/components/ui/Spinner'

interface Credential {
  id: string
  trade: string
  tier: string
  issueDate: string
  expiryDate?: string
  status: 'verified' | 'pending' | 'expired'
}

export const dynamic = 'force-dynamic'

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    async function fetchCredentials() {
      setLoading(true)
      try {
        const response = await fetch('/api/credentials')
        if (response.ok) {
          const data = await response.json()
          setCredentials(data.credentials || [])
        }
      } catch (err) {
        console.error('Failed to fetch credentials:', err)
        // Mock data for development
        setCredentials([
          {
            id: '1',
            trade: 'electrician',
            tier: 'journeyperson',
            issueDate: '2023-01-15',
            expiryDate: '2026-01-15',
            status: 'verified',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [])

  const handleImport = async () => {
    setIsImporting(true)
    try {
      const response = await fetch('/api/credentials/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        setCredentials((prev) => [...prev, data])
      }
    } catch (err) {
      console.error('Failed to import credential:', err)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink-900 mb-2">Credentials</h1>
            <p className="text-ink-600">Manage your trade credentials and certifications</p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex gap-3">
            <button
              data-testid="import-credential"
              onClick={handleImport}
              disabled={isImporting}
              className="px-4 py-2 bg-trades-500 text-white rounded-lg hover:bg-trades-600 disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Import Credential'}
            </button>
            <button
              onClick={() => alert('Export functionality coming soon')}
              className="px-4 py-2 border border-trades-500 text-trades-500 rounded-lg hover:bg-trades-50"
            >
              Export
            </button>
          </div>

          {/* Credentials List */}
          {loading ? (
            <div className="text-center py-12">
              <Spinner label="Loading credentials..." />
            </div>
          ) : credentials.length === 0 ? (
            <div className="text-center py-12 bg-trades-50 rounded-lg">
              <p className="text-ink-600 mb-2">No credentials yet.</p>
              <p className="text-ink-600">Import your trade certifications to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="p-4 border border-trades-200 rounded-lg hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                        className="text-lg font-semibold text-ink-900 capitalize"
                        data-testid="credential-trade"
                      >
                        {cred.trade}
                      </h3>
                      <p className="text-sm text-ink-600">
                        Tier:{' '}
                        <span
                          data-testid="credential-tier"
                          className="font-medium capitalize"
                        >
                          {cred.tier}
                        </span>
                      </p>
                    </div>
                    <span
                      data-testid="credential-status"
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cred.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : cred.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cred.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-ink-600">Issue Date</p>
                      <p className="font-medium text-ink-900">
                        {new Date(cred.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {cred.expiryDate && (
                      <div>
                        <p className="text-ink-600">Expiry Date</p>
                        <p className="font-medium text-ink-900">
                          {new Date(cred.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="text-sm px-3 py-1 border border-trades-300 rounded hover:bg-trades-50">
                      View Details
                    </button>
                    <button className="text-sm px-3 py-1 border border-trades-300 rounded hover:bg-trades-50">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
