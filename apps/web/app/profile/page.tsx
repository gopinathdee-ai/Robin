'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'
import { ReputationCard } from '@/components/dashboard/ReputationCard'
import { ExpertiseTopics } from '@/components/dashboard/ExpertiseTopics'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Spinner } from '@/components/ui/Spinner'
import { EndorsementSummary } from '@/components/endorsement/EndorsementSummary'

interface UserProfile {
  id: string
  displayName: string
  role: string
  email: string
  yearsExperience?: number
  provinceCode?: string
  bio?: string
  trades: { id: string; name: string }[]
  status: string
}

interface ReputationData {
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

interface ActivityData {
  id: string
  type: string
  points: number
  description: string
  referenceId: string | null
  createdAt: string
}

interface UserDocument {
  id: string
  status: string
  documentType: string
  fileName: string
}

interface DocumentsData {
  items: UserDocument[]
}

interface EndorsementsData {
  items: Array<{
    topic: { id: string; name: string }
    status: string
  }>
}


async function fetchData(path: string) {
  try {
    const res = await fetch(path, {
      credentials: 'include',  // Ensure cookies are sent
      next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error)
    return null
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [reputation, setReputation] = useState<ReputationData | null>(null)
  const [activity, setActivity] = useState<{ items: ActivityData[] } | null>(null)
  const [documents, setDocuments] = useState<DocumentsData | null>(null)
  const [endorsements, setEndorsements] = useState<EndorsementsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const profileData = await fetchData('/api/users/me')

        if (!profileData) {
          setError('Failed to load profile - returned null')
          setLoading(false)
          return
        }

        setProfile(profileData)

        // Load other data in parallel
        const [reputationData, activityData, documentsData, endorsementsData] = await Promise.all([
          fetchData('/api/users/me/reputation'),
          fetchData('/api/users/me/activity?limit=10'),
          fetchData('/api/documents'),
          fetchData('/api/endorsements?recipientId=me&status=accepted&limit=100'),
        ])

        if (reputationData) setReputation(reputationData)
        if (activityData) setActivity(activityData)
        if (documentsData) setDocuments(documentsData)
        if (endorsementsData) setEndorsements(endorsementsData)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.error('Failed to fetch profile data:', err)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner label="Loading profile..." />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AppHeader />
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">Unable to load profile</p>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            <p className="text-red-600 text-sm mt-2">
              Make sure you're logged in. <Link href="/auth/sign-in" className="underline font-medium">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const roleColors = {
    apprentice: 'bg-blue-50 text-blue-700',
    journeyperson: 'bg-trades-50 text-trades-700',
    master: 'bg-amber-50 text-amber-700',
    employer_admin: 'bg-green-50 text-green-700',
  }

  const roleLabel = {
    apprentice: 'Apprentice',
    journeyperson: 'Journeyperson ✓',
    master: 'Master / Supervisor ✓',
    employer_admin: 'Employer / Contractor',
  }


  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-ink-50">
        <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header Card */}
        <div className="bg-white border border-ink-200 rounded-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-ink-900 mb-3">{profile.displayName}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColors[profile.role as keyof typeof roleColors]}`}>
                  {roleLabel[profile.role as keyof typeof roleLabel]}
                </span>
                {profile.trades && profile.trades.length > 0 && (
                  <span className="text-ink-600">{profile.trades[0].name}</span>
                )}
                {profile.yearsExperience && (
                  <span className="text-ink-600">{profile.yearsExperience} years experience</span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/profile/edit"
                className="px-4 py-2 border border-ink-300 text-ink-900 rounded-lg hover:bg-ink-50 transition-colors text-sm font-medium"
              >
                Edit profile
              </Link>
            </div>
          </div>

          {profile.bio && (
            <p className="text-ink-700 mb-6 border-t border-ink-200 pt-6">{profile.bio}</p>
          )}
        </div>

        {/* Credentials Summary */}
        {documents && (
          <div className="mb-8 bg-white border border-ink-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ink-900">Credentials</h2>
              <Link
                href="/profile/credentials"
                className="px-4 py-2 border border-trades-300 text-trades-900 rounded-lg hover:bg-trades-50 transition-colors text-sm font-medium"
              >
                Manage
              </Link>
            </div>

            {documents.items.length === 0 ? (
              <p className="text-ink-600 text-sm">No credentials uploaded yet. Start building your credibility by uploading your qualifications.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">
                    {documents.items.filter(d => d.status === 'VERIFIED').length}
                  </div>
                  <div className="text-sm text-green-600">Verified</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700">
                    {documents.items.filter(d => d.status === 'PENDING').length}
                  </div>
                  <div className="text-sm text-yellow-600">Pending Review</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Endorsements Summary */}
        {endorsements && (
          <div className="mb-8">
            <EndorsementSummary
              topics={endorsements.items.map(e => e.topic)}
              count={endorsements.items.length}
            />
          </div>
        )}

        {/* Reputation Dashboard */}
        {reputation && (
          <div className="space-y-6 mb-8">
            <div className="lg:col-span-1">
              <ReputationCard {...reputation} />
            </div>
          </div>
        )}

        {/* Expertise Topics */}
        {reputation && (
          <div className="mb-8">
            <ExpertiseTopics topics={reputation.expertiseTopics} />
          </div>
        )}

        {/* Activity Feed */}
        {activity && (
          <div className="mb-8">
            <ActivityFeed
              activities={(activity?.items || []).map((item) => ({
                ...item,
                createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toISOString(),
              }))}
            />
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex gap-4">
          <Link
            href="/community"
            className="flex-1 py-3 px-4 bg-trades-500 text-white rounded-lg font-semibold hover:bg-trades-600 transition-colors text-center"
          >
            Browse community
          </Link>
        </div>
        </div>
      </div>
    </>
  )
}
