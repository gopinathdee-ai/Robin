'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/AppHeader'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Spinner } from '@/components/ui/Spinner'
import Link from 'next/link'

interface LeaderboardData {
  tradeName: string
  tradeCode: string
  items: Array<{
    rank: number
    userId: string
    displayName: string
    role: string
    verified: boolean
    score: number
    topicsCount: number
    endorsementsCount: number
  }>
  page: number
  limit: number
  total: number
  pages: number
  currentUserRank: number | null
}

export default function LeaderboardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const trade = params.trade as string
  const page = Number(searchParams.get('page') ?? 1)
  const sort = (searchParams.get('sort') as 'score' | 'recent' | 'endorsed') ?? 'score'

  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/leaderboards/${trade}?page=${page}&sort=${sort}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const result = await res.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [trade, page, sort])

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen">
          <Spinner label="Loading leaderboard..." />
        </div>
      </>
    )
  }

  if (error || !data) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-center text-red-600">{error || 'Failed to load leaderboard'}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">{data.tradeName} Rankings</h1>
        <p className="mt-2 text-ink-600">See the top contributors in {data.tradeName.toLowerCase()}</p>
        {data.currentUserRank && (
          <p className="mt-3 rounded-lg bg-trades-50 p-3 text-sm font-medium text-trades-700">
            You're ranked #{data.currentUserRank} in {data.tradeName}
          </p>
        )}
      </div>

      {/* Sort Options */}
      <div className="mb-6 flex gap-2">
        <Link
          href={`/leaderboards/${trade}?sort=score`}
          className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
            sort === 'score'
              ? 'bg-trades-500 text-white'
              : 'bg-trades-100 text-trades-900 hover:bg-trades-200'
          }`}
        >
          By Score
        </Link>
        <Link
          href={`/leaderboards/${trade}?sort=recent`}
          className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
            sort === 'recent'
              ? 'bg-trades-500 text-white'
              : 'bg-trades-100 text-trades-900 hover:bg-trades-200'
          }`}
        >
          Recent Activity
        </Link>
        <Link
          href={`/leaderboards/${trade}?sort=endorsed`}
          className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
            sort === 'endorsed'
              ? 'bg-trades-500 text-white'
              : 'bg-trades-100 text-trades-900 hover:bg-trades-200'
          }`}
        >
          Most Endorsed
        </Link>
      </div>

      {/* Leaderboard */}
      <LeaderboardTable items={data.items} currentUserRank={data.currentUserRank} />

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-ink-600">
            Page {page} of {data.pages} ({data.total} total users)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/leaderboards/${trade}?page=${page - 1}&sort=${sort}`}
                className="rounded px-4 py-2 text-sm font-medium bg-trades-100 text-trades-900 hover:bg-trades-200 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < data.pages && (
              <Link
                href={`/leaderboards/${trade}?page=${page + 1}&sort=${sort}`}
                className="rounded px-4 py-2 text-sm font-medium bg-trades-500 text-white hover:bg-trades-600 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  )
}
