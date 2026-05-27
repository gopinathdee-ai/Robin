'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'

interface LeaderboardItem {
  rank: number
  userId: string
  displayName: string
  role: string
  verified: boolean
  score: number
  topicsCount: number
  endorsementsCount: number
}

interface LeaderboardTableProps {
  items: LeaderboardItem[]
  currentUserRank: number | null
}

function getRoleBadge(role: string, verified: boolean): { label: string; color: string } {
  const roleLabel = role === 'journeyperson' ? 'JP' : role === 'master' ? 'M' : 'A'
  const color =
    role === 'master'
      ? 'bg-purple-100 text-purple-700'
      : role === 'journeyperson'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-amber-100 text-amber-700'

  return {
    label: `${roleLabel}${verified ? ' ✓' : ''}`,
    color,
  }
}

export function LeaderboardTable({ items, currentUserRank }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-trades-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-trades-200 bg-trades-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-ink-900">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-ink-900">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-ink-900">Role</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-ink-900">Score</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-ink-900">Topics</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-ink-900">Endorsements</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const badge = getRoleBadge(item.role, item.verified)
            const isCurrentUser = currentUserRank !== null && item.rank === currentUserRank

            return (
              <tr
                key={item.userId}
                className={`border-b border-trades-50 transition-colors last:border-b-0 ${
                  isCurrentUser ? 'bg-trades-50' : 'hover:bg-ink-50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-trades-600">{item.rank}</span>
                    {item.rank === 1 && <FontAwesomeIcon icon={faMedal} className="text-yellow-500" />}
                    {item.rank === 2 && <FontAwesomeIcon icon={faMedal} className="text-gray-400" />}
                    {item.rank === 3 && <FontAwesomeIcon icon={faMedal} className="text-orange-600" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/users/${item.userId}`} className="text-sm font-medium text-trades-600 hover:underline">
                    {item.displayName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${badge.color}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-ink-900">{item.score}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-ink-600">{item.topicsCount}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-ink-600">{item.endorsementsCount}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-sm text-ink-500">No users found for this trade yet.</p>
        </div>
      )}
    </div>
  )
}
