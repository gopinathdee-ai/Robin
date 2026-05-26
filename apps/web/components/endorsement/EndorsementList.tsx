'use client'

import Link from 'next/link'
import { Endorsement, useEndorsements } from '@/hooks/useEndorsements'
import { EndorsementCard } from './EndorsementCard'

interface EndorsementListProps {
  recipientId: string
  limit?: number
  maxDisplay?: number
  showViewAll?: boolean
  canAccept?: boolean
  onAcceptReject?: () => void
}

export function EndorsementList({
  recipientId,
  limit = 5,
  maxDisplay = 5,
  showViewAll = true,
  canAccept = false,
  onAcceptReject,
}: EndorsementListProps) {
  const { endorsements, loading, error } = useEndorsements(recipientId, 'accepted')

  if (loading) {
    return <div className="text-sm text-ink-600">Loading endorsements...</div>
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load endorsements</div>
  }

  if (endorsements.length === 0) {
    return <div className="text-sm text-ink-600">No endorsements yet</div>
  }

  const displayed = endorsements.slice(0, maxDisplay)
  const hasMore = endorsements.length > maxDisplay

  return (
    <div className="space-y-3">
      {displayed.map((endorsement) => (
        <EndorsementCard
          key={endorsement.id}
          endorsement={endorsement}
          canAccept={canAccept}
          onAccept={onAcceptReject}
          onReject={onAcceptReject}
        />
      ))}

      {hasMore && showViewAll && (
        <Link
          href={`/profile/endorsements`}
          className="text-sm font-medium text-trades-600 hover:underline block text-center py-2"
        >
          View all {endorsements.length} endorsements →
        </Link>
      )}
    </div>
  )
}
