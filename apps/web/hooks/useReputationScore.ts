'use client'

import { useState, useEffect, useCallback } from 'react'
import { REPUTATION_CONFIG } from '@/lib/reputation-config'

export interface ReputationData {
  totalPoints: number
  tier: string
  breakdown: {
    contributions: number
    answers: number
    upvotes: number
    endorsements: number
    other: number
  }
  expertiseTopics: Array<{
    topicId: string
    topicName: string
    points: number
  }>
  pointsToNextTier: number
}

export function useReputationScore() {
  const [score, setScore] = useState<ReputationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchScore = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/users/me/reputation')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setScore(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reputation')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch on mount
    fetchScore()

    // Poll every 30 seconds
    const interval = setInterval(fetchScore, REPUTATION_CONFIG.polling.intervalMs)

    return () => clearInterval(interval)
  }, [fetchScore])

  return { score, loading, error, refetch: fetchScore }
}
