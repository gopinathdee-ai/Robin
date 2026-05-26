'use client'

import { useCallback, useEffect, useState } from 'react'

export interface Endorsement {
  id: string
  endorser: {
    id: string
    displayName: string
    role: string
    verified: boolean
  }
  topic: {
    id: string
    name: string
  }
  rationale: string
  weight: number
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface EndorsementCheckResult {
  canEndorse: boolean
  reason?: string
  endorsedAt?: string
  nextAvailableAt?: string
}

export function useEndorsements(recipientId: string, status: 'accepted' | 'all' = 'accepted') {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEndorsements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await globalThis.fetch(`/api/endorsements?recipientId=${recipientId}&status=${status}&limit=100`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEndorsements(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch endorsements')
    } finally {
      setLoading(false)
    }
  }, [recipientId, status])

  useEffect(() => {
    fetchEndorsements()
  }, [fetchEndorsements])

  return { endorsements, loading, error, refetch: fetchEndorsements }
}

export function useCheckEndorse(recipientId: string, topicId: string) {
  const [result, setResult] = useState<EndorsementCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const check = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/endorsements/check?recipientId=${recipientId}&topicId=${topicId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check endorsement eligibility')
    } finally {
      setLoading(false)
    }
  }, [recipientId, topicId])

  useEffect(() => {
    if (recipientId && topicId) {
      check()
    }
  }, [recipientId, topicId, check])

  return { result, loading, error, recheck: check }
}

export function useCreateEndorsement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (recipientId: string, topicId: string, rationale: string): Promise<Endorsement | null> => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/endorsements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientId, topicId, rationale }),
        })

        if (!res.ok) {
          const errData = await res.json()
          let msg = errData.error || `HTTP ${res.status}`

          // Add specific reason for gate check failures
          if (errData.reason && errData.details) {
            const { required, current } = errData.details
            if (errData.reason === 'needs_contributions') {
              msg = `You need at least ${required} published contributions to endorse peers (you have ${current})`
            } else if (errData.reason === 'needs_account_age') {
              msg = `Your account must be at least ${required} days old to endorse peers (currently ${current} days old)`
            } else if (errData.reason === 'needs_reputation') {
              msg = `You need at least ${required} reputation points to endorse peers (you have ${current})`
            }
          }

          throw new Error(msg)
        }

        const data = await res.json()
        return data
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to create endorsement'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { create, loading, error }
}

export function useUpdateEndorsement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(
    async (endorsementId: string, status: 'accepted' | 'rejected'): Promise<Endorsement | null> => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/endorsements/${endorsementId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || `HTTP ${res.status}`)
        }

        const data = await res.json()
        return data
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update endorsement'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { update, loading, error }
}

export function useDeleteEndorsement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_endorsement = useCallback(async (endorsementId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/endorsements/${endorsementId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete endorsement'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { delete: delete_endorsement, loading, error }
}
