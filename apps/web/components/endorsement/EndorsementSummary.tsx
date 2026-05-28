'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'

interface EndorsementSummaryProps {
  topics: Array<{ id: string; name: string }>
  count: number
}

export function EndorsementSummary({ topics, count }: EndorsementSummaryProps) {
  if (count === 0) {
    return null
  }

  const topicNames = topics.slice(0, 3).map((t) => t.name).join(', ')
  const moreTopics = topics.length > 3 ? ` +${topics.length - 3} more` : ''

  return (
    <div className="bg-trades-50 border border-trades-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMedal} className="h-5 w-5 text-trades-600" />
          <h3 className="font-semibold text-ink-900">How peers recognize you</h3>
        </div>
        <div className="bg-trades-600 text-white px-2.5 py-1 rounded-full text-xs font-bold">
          {count} {count === 1 ? 'endorsement' : 'endorsements'}
        </div>
      </div>

      <p className="text-sm text-ink-700 mb-3">
        Endorsed for <span className="font-medium">{topicNames}</span>
        {moreTopics}
      </p>

      <Link
        href="/profile/endorsements"
        className="text-sm font-medium text-trades-600 hover:underline inline-flex items-center gap-1"
      >
        View all endorsements →
      </Link>
    </div>
  )
}
