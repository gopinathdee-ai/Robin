'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

interface EndorsementRequirementsProps {
  recipientId: string
}

interface Requirement {
  name: string
  met: boolean
  current: number
  required: number
  unit: string
}

export function EndorsementRequirements({ recipientId }: EndorsementRequirementsProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRequirements() {
      try {
        setLoading(true)
        const res = await fetch('/api/endorsements/requirements')
        if (!res.ok) throw new Error('Failed to fetch requirements')
        const data = await res.json()
        setRequirements(data.requirements)
      } catch (err) {
        console.error('Failed to fetch endorsement requirements:', err)
        setError(err instanceof Error ? err.message : 'Failed to load requirements')
      } finally {
        setLoading(false)
      }
    }

    fetchRequirements()
  }, [])

  if (loading) return null
  if (error) return null
  if (!requirements.length) return null

  const allMet = requirements.every((r) => r.met)

  return (
    <div className={`mt-4 p-4 rounded-lg border ${allMet ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      <p className={`text-sm font-medium mb-3 ${allMet ? 'text-green-900' : 'text-amber-900'}`}>
        {allMet ? '✓ You can endorse peers' : 'Requirements to endorse:'}
      </p>
      <div className="space-y-2">
        {requirements.map((req) => (
          <div key={req.name} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <Check size={16} className="text-green-600 flex-shrink-0" />
            ) : (
              <X size={16} className="text-amber-600 flex-shrink-0" />
            )}
            <span className="text-ink-900 flex-1">
              {req.name}
            </span>
            <span className={`text-xs font-medium ${req.met ? 'text-green-700' : 'text-amber-700'}`}>
              {req.current} / {req.required} {req.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
