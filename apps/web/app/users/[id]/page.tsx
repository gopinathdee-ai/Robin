'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'
import { Spinner } from '@/components/ui/Spinner'
import { EndorseButton } from '@/components/endorsement/EndorseButton'
import { EndorsementRequirements } from '@/components/endorsement/EndorsementRequirements'

interface PublicProfile {
  user: {
    id: string
    displayName: string
    role: string
    bio?: string
    yearsExperience?: number
    provinceCode?: string
    status: string
    trades: Array<{ id: string; name: string }>
  }
  reputation: {
    totalPoints: number
    tier: string
    expertiseTopics: Array<{
      topicId: string
      topicName: string
      points: number
    }>
  }
  endorsementsCount: number
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/users/${userId}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('User not found')
          } else {
            throw new Error(`HTTP ${res.status}`)
          }
          return
        }
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen">
          <Spinner label="Loading profile..." />
        </div>
      </>
    )
  }

  if (error || !profile) {
    return (
      <>
        <AppHeader />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <button onClick={() => router.back()} className="text-trades-600 hover:underline mb-4 inline-block">
              ← Back
            </button>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center">
            <p className="text-red-800 text-lg">{error || 'User profile not available'}</p>
          </div>
        </div>
      </>
    )
  }

  const { user, reputation, endorsementsCount } = profile

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="text-trades-600 hover:underline">
            ← Back
          </button>
        </div>

        {/* Profile Header */}
        <div className="mb-8 border-b border-ink-200 pb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-ink-900 mb-2">{user.displayName}</h1>
              <p className="text-ink-600 mb-4">
                <span className="inline-block px-3 py-1 bg-trades-100 text-trades-700 rounded-full text-sm font-medium capitalize">
                  {user.role}
                </span>
              </p>
            </div>
            {user.trades.length > 0 && (
              <div className="flex-shrink-0">
                <EndorseButton
                  recipientId={user.id}
                  recipientName={user.displayName}
                  recipientTradeId={user.trades[0].id}
                />
              </div>
            )}
          </div>
          {user.bio && <p className="text-ink-700 mb-4">{user.bio}</p>}
          <div className="flex gap-6 text-sm text-ink-600">
            {user.yearsExperience !== null && user.yearsExperience !== undefined && (
              <div>{user.yearsExperience} years experience</div>
            )}
            {user.provinceCode && <div>{user.provinceCode}</div>}
            {user.trades.length > 0 && (
              <div>{user.trades.map((t) => t.name).join(', ')}</div>
            )}
          </div>

          {/* Endorsement Requirements - grouped with button */}
          {user.trades.length > 0 && (
            <div className="mt-6">
              <EndorsementRequirements recipientId={user.id} />
            </div>
          )}
        </div>

        {/* Reputation Stats Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg border border-trades-200 bg-trades-50 p-6">
            <div className="text-4xl font-bold text-trades-700 mb-2">{reputation.totalPoints}</div>
            <div className="text-sm text-trades-600">Reputation Points</div>
          </div>

          <div className="rounded-lg border border-trades-200 bg-trades-50 p-6">
            <div className="text-2xl font-bold text-trades-700 mb-2 capitalize">{reputation.tier}</div>
            <div className="text-sm text-trades-600">Current Tier</div>
          </div>

          <div className="rounded-lg border border-trades-200 bg-trades-50 p-6">
            <div className="text-2xl font-bold text-trades-700 mb-2">{endorsementsCount}</div>
            <div className="text-sm text-trades-600">Endorsements</div>
          </div>
        </div>

        {/* Expertise Topics */}
        {reputation.expertiseTopics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">Expertise Topics</h2>
            <div className="space-y-4">
              {reputation.expertiseTopics.map((topic) => (
                <div key={topic.topicId}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-ink-900">{topic.topicName}</span>
                    <span className="text-xs text-ink-600">{topic.points} contributions</span>
                  </div>
                  <div className="w-full bg-ink-200 rounded-full h-2">
                    <div
                      className="bg-trades-500 h-2 rounded-full"
                      style={{ width: `${Math.min((topic.points / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endorsements Section */}
        {endorsementsCount > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-6">How peers recognize {user.displayName}</h2>
            <div className="rounded-lg bg-trades-50 border border-trades-200 p-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-trades-900 mb-2">
                  Endorsed by {endorsementsCount} {endorsementsCount === 1 ? 'peer' : 'peers'}
                </p>
                <p className="text-sm text-trades-600 mb-4">
                  {user.displayName} has received recognition from the professional community
                </p>
                <Link
                  href={`/profile/endorsements?user=${user.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-trades-500 text-white rounded-lg hover:bg-trades-600 text-sm font-medium"
                >
                  View All Endorsements
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
