'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastContext'

interface Activity {
  id: string
  type: string
  points: number
  description: string
  referenceId: string | null
  createdAt: string
  metadata?: string | Record<string, any> | null
}

interface ActivityFeedProps {
  activities: Activity[]
}

function isPendingEndorsement(activity: Activity): boolean {
  // If no metadata, assume it's pending (safer default)
  if (!activity.metadata) return true

  const meta = typeof activity.metadata === 'string'
    ? JSON.parse(activity.metadata)
    : activity.metadata

  // Only show buttons for pending endorsements
  return meta?.endorsementStatus === 'pending'
}

export function ActivityFeed({ activities: initialActivities }: ActivityFeedProps) {
  const [activities, setActivities] = useState(initialActivities)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEndorsement = async (endorsementId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoadingId(endorsementId)
      const res = await fetch(`/api/endorsements/${endorsementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        // Remove the endorsement activity from the feed after accepting/declining
        setActivities(activities.filter((a) => a.referenceId !== endorsementId))

        // Show success toast
        const action = status === 'accepted' ? 'accepted' : 'declined'
        toast({
          title: 'Success',
          description: `You ${action} the endorsement. Refresh to see updated stats.`,
          variant: 'success',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update endorsement',
          variant: 'error',
        })
      }
    } catch (error) {
      console.error('Failed to update endorsement:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'error',
      })
    } finally {
      setLoadingId(null)
    }
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-ink-900">Recent Activity</h3>
        <p className="text-sm text-ink-500">No activity yet. Start contributing to build your reputation!</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-ink-900">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const isPositive = activity.points >= 0
          const isEndorsement = activity.type === 'peer_endorsement_received'

          return (
            <div key={activity.id} className="flex gap-3 border-b border-trades-50 pb-3 last:border-b-0">
              <div
                className={`flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center text-xs font-semibold ${
                  isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isPositive ? '+' : '−'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-900">{activity.description}</p>
                <p className="text-xs text-ink-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
              {isEndorsement && activity.referenceId && !isPendingEndorsement(activity) && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEndorsement(activity.referenceId!, 'accepted')}
                    disabled={loadingId === activity.referenceId}
                    loading={loadingId === activity.referenceId}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEndorsement(activity.referenceId!, 'rejected')}
                    disabled={loadingId === activity.referenceId}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
