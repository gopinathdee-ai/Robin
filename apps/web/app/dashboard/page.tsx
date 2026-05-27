import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/AppHeader'
import { ReputationCard } from '@/components/dashboard/ReputationCard'
import { ExpertiseTopics } from '@/components/dashboard/ExpertiseTopics'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { EngagementSummary } from '@/components/dashboard/EngagementSummary'
import { NextResponse } from 'next/server'

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

interface UserTrade {
  id: string
  name: string
  code: string
  isPrimary: boolean
  specialisationId?: string
  specialisationName?: string
  verifiedAt?: string
}

interface ActivityData {
  id: string
  type: string
  points: number
  description: string
  referenceId: string | null
  createdAt: string
}

interface SummaryData {
  postsThisMonth: number
  answersThisMonth: number
  questionsThisMonth: number
  endorsementsReceivedThisMonth: number
  topicsCount: number
}

async function fetchData(path: string, userId?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000'
    const url = new URL(path, baseUrl).toString()
    const headers: Record<string, string> = {}
    if (userId) {
      headers['x-dev-user-id'] = userId
    }
    const res = await fetch(url, {
      headers,
      credentials: 'include',
      next: { revalidate: 60 }
    })
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API Error ${path}:`, res.status, errorText)
      throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 200)}`)
    }
    return await res.json()
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error)
    return null
  }
}

export default async function DashboardPage() {
  const result = await requireAuth()

  // Handle unauthorized response
  if (result instanceof NextResponse) {
    redirect('/auth/sign-in')
  }

  const user = result
  const displayName = 'User'

  // Fetch all data in parallel
  let reputationData: ReputationData | null = null
  let activityData: { items: ActivityData[] } | null = null
  let summaryData: SummaryData | null = null
  let primaryTradeCode: string | null = null

  try {
    const [reputation, activity, summary, userTrades] = await Promise.all([
      fetchData('/api/users/me/reputation', user.id),
      fetchData('/api/users/me/activity?limit=10', user.id),
      fetchData('/api/users/me/summary', user.id),
      fetchData('/api/users/me/trades', user.id),
    ])

    // Deep clone to ensure plain objects
    reputationData = reputation ? JSON.parse(JSON.stringify(reputation)) : null
    activityData = activity ? JSON.parse(JSON.stringify(activity)) : null
    summaryData = summary ? JSON.parse(JSON.stringify(summary)) : null

    // Get primary trade code for leaderboard link
    if (userTrades?.items && userTrades.items.length > 0) {
      const primaryTrade = userTrades.items.find((t: UserTrade) => t.isPrimary)
      primaryTradeCode = (primaryTrade?.code || userTrades.items[0]?.code || null)?.toLowerCase()
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }

  if (!reputationData) {
    return (
      <>
        <AppHeader />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-center text-red-600">Failed to load dashboard data</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900">Welcome back, {displayName}!</h1>
          <p className="mt-2 text-ink-600">
            You're {reputationData.pointsToNextTier} points away from {getNextTierName(reputationData.totalPoints)}
          </p>
        </div>

        {/* Main Grid */}
        <div className="space-y-6">
          {/* Row 1: Reputation + Summary + Next Steps */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 auto-rows-max lg:auto-rows-fr">
            <ReputationCard {...reputationData} />
            {summaryData && (
              <EngagementSummary
                postsThisMonth={summaryData.postsThisMonth}
                answersThisMonth={summaryData.answersThisMonth}
                questionsThisMonth={summaryData.questionsThisMonth}
                endorsementsReceivedThisMonth={summaryData.endorsementsReceivedThisMonth}
                topicsCount={summaryData.topicsCount}
              />
            )}
            <div className="rounded-lg border border-trades-200 bg-trades-50 p-6 flex flex-col justify-center">
              <h3 className="mb-2 text-lg font-semibold text-trades-900">Next Steps</h3>
              <ul className="space-y-2 text-sm text-trade-800">
                <li>✓ Share expertise in the <a href="/community" className="font-medium text-trades-600 hover:underline">community</a></li>
                {primaryTradeCode && (
                  <li>✓ View your <a href={`/leaderboards/${primaryTradeCode}`} className="font-medium text-trades-600 hover:underline">ranking</a></li>
                )}
                <li>✓ Reach 750 points for mentor</li>
              </ul>
            </div>
          </div>

          {/* Row 2: Expertise Topics */}
          <div>
            <ExpertiseTopics topics={reputationData.expertiseTopics} />
          </div>

          {/* Row 3: Activity Feed */}
          <div>
            <ActivityFeed activities={activityData?.items || []} />
          </div>
        </div>
      </div>
    </>
  )
}

function getNextTierName(totalPoints: number): string {
  if (totalPoints < 200) return 'Journeyperson'
  if (totalPoints < 500) return 'Expert'
  if (totalPoints < 750) return 'Mentor Eligible'
  return 'Mentor'
}
