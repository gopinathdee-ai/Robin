'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'
import { Spinner } from '@/components/ui/Spinner'

interface LeaderboardEntry {
  id: string
  rank: number
  displayName: string
  tier: 'apprentice' | 'journeyperson' | 'expert' | 'mentor'
  totalPoints: number
  expertiseCount: number
}

export const dynamic = 'force-dynamic'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('points')
  const [tierFilter, setTierFilter] = useState('')
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '50',
          sortBy,
        })

        if (tierFilter) params.append('tier', tierFilter)

        const response = await fetch(`/api/leaderboard?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
          setHasMore(data.hasMore ?? false)
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        // Mock data for development
        const mockUsers: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i}`,
          rank: i + 1,
          displayName: `User ${i + 1}`,
          tier: ['apprentice', 'journeyperson', 'expert', 'mentor'][i % 4] as any,
          totalPoints: Math.max(0, 1000 - i * 50),
          expertiseCount: Math.floor(Math.random() * 10) + 1,
        }))
        setUsers(mockUsers)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [page, sortBy, tierFilter])

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink-900 mb-2">Leaderboard</h1>
            <p className="text-ink-600">Top contributors in the trades community</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Sort By
              </label>
              <select
                data-testid="sort-control"
                className="px-4 py-2 border border-trades-300 rounded-lg"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1)
                }}
              >
                <option value="points">Points</option>
                <option value="rank">Rank</option>
                <option value="recent">Recent Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Filter by Tier
              </label>
              <select
                data-testid="tier-filter"
                className="px-4 py-2 border border-trades-300 rounded-lg"
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All Tiers</option>
                <option value="apprentice">Apprentice</option>
                <option value="journeyperson">Journeyperson</option>
                <option value="expert">Expert</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="text-center py-12">
              <Spinner label="Loading leaderboard..." />
            </div>
          ) : (
            <>
              <div data-testid="pagination" className="mb-6">
                {/* Pagination will go here */}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-trades-200">
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-ink-900"
                        data-testid="col-rank"
                      >
                        Rank
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-ink-900"
                        data-testid="col-name"
                      >
                        Name
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-ink-900"
                        data-testid="col-tier"
                      >
                        Tier
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-ink-900"
                        data-testid="col-points"
                      >
                        Points
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-semibold text-ink-900"
                        data-testid="col-expertise"
                      >
                        Expertise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        data-testid="leaderboard-row"
                        className="border-b border-trades-100 hover:bg-trades-50"
                      >
                        <td className="px-4 py-3 text-sm text-ink-900">
                          <span data-testid="user-rank">#{user.rank}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-900">
                          <span data-testid="user-name" className="user-name">
                            {user.displayName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            data-testid="user-tier"
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              user.tier === 'mentor'
                                ? 'bg-amber-100 text-amber-800'
                                : user.tier === 'expert'
                                  ? 'bg-purple-100 text-purple-800'
                                  : user.tier === 'journeyperson'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {user.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-900">
                          <span data-testid="user-points">
                            {user.totalPoints.toLocaleString()} points
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-600">
                          {user.expertiseCount} areas
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    data-testid="next-page"
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2 border border-trades-500 text-trades-500 rounded-lg hover:bg-trades-50"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
