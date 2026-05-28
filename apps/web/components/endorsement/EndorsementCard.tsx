'use client'

import { formatDistanceToNow } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircleXmark, faClock } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useUpdateEndorsement } from '@/hooks/useEndorsements'

interface EndorsementCardProps {
  endorsement: {
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
  canAccept?: boolean
  onAccept?: () => void
  onReject?: () => void
}

export function EndorsementCard({ endorsement, canAccept, onAccept, onReject }: EndorsementCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { update, loading } = useUpdateEndorsement()

  const handleAccept = async () => {
    try {
      await update(endorsement.id, 'accepted')
      onAccept?.()
    } catch (err) {
      console.error('Failed to accept endorsement', err)
    }
  }

  const handleReject = async () => {
    try {
      await update(endorsement.id, 'rejected')
      onReject?.()
    } catch (err) {
      console.error('Failed to reject endorsement', err)
    }
  }

  const statusIconData = {
    icon:
      endorsement.status === 'accepted'
        ? faCheckCircle
        : endorsement.status === 'rejected'
          ? faCircleXmark
          : faClock,
    color:
      endorsement.status === 'accepted'
        ? 'text-green-600'
        : endorsement.status === 'rejected'
          ? 'text-red-600'
          : 'text-yellow-600',
  }

  const statusIcon = (
    <FontAwesomeIcon icon={statusIconData.icon} className={`h-4 w-4 ${statusIconData.color}`} />
  )

  const statusText =
    endorsement.status === 'accepted'
      ? 'Accepted'
      : endorsement.status === 'rejected'
        ? 'Rejected'
        : 'Pending'

  const ratioView = expanded
    ? endorsement.rationale
    : endorsement.rationale.substring(0, 120) + (endorsement.rationale.length > 120 ? '...' : '')

  return (
    <div className="border border-ink-200 rounded-lg p-4 bg-white hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-ink-900">{endorsement.endorser.displayName}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-trades-100 text-trades-700">
              {endorsement.endorser.role === 'journeyperson' ? 'Journeyperson ✓' : endorsement.endorser.role === 'master' ? 'Master ✓' : 'Apprentice'}
            </span>
            {endorsement.endorser.verified && <span className="text-xs text-green-600">Verified</span>}
          </div>
          <p className="text-sm text-ink-600">
            Endorsed for <span className="font-medium">{endorsement.topic.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {statusIcon}
          <span className="text-xs font-medium text-ink-600">{statusText}</span>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-sm text-ink-700 mb-3 whitespace-pre-wrap">{ratioView}</p>

      {endorsement.rationale.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-trades-600 font-medium mb-3 hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>{formatDistanceToNow(new Date(endorsement.createdAt), { addSuffix: true })}</span>
          <span className="text-trades-600 font-medium">Weight: {endorsement.weight.toFixed(2)}x</span>
        </div>

        {canAccept && endorsement.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex items-center justify-center px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex items-center justify-center px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
