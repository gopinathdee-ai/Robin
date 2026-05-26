'use client'

import { isMentorEligible } from '@/lib/reputation'

interface ReputationCardProps {
  totalPoints: number
  tier: string
  pointsToNextTier: number
  breakdown: {
    contributions: number
    answers: number
    upvotes: number
    endorsements: number
    other: number
  }
}

export function ReputationCard({
  totalPoints,
  tier,
  pointsToNextTier,
  breakdown,
}: ReputationCardProps) {
  const isMentor = isMentorEligible(totalPoints)
  const progressPercent = isMentor ? 100 : Math.min(100, Math.round((totalPoints / 750) * 100))

  return (
    <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {/* Score Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-trades-600">{totalPoints}</span>
          <span className="text-lg text-ink-600">reputation points</span>
        </div>

        {/* Tier Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-trades-100 px-3 py-1 text-sm font-semibold text-trades-700">
            {tier}
          </span>
          {isMentor && <span className="text-lg">🎉</span>}
        </div>

        {/* Progress Bar */}
        {!isMentor && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-ink-600">Progress to Mentor</span>
              <span className="text-sm font-medium text-trades-600">{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-trades-100">
              <div
                className="h-full bg-trades-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-ink-500">{pointsToNextTier} points to next tier</p>
          </div>
        )}

        {isMentor && (
          <div className="rounded-lg bg-trades-50 p-3">
            <p className="text-sm font-medium text-trades-700">
              ✓ Eligible for mentor tier
            </p>
          </div>
        )}

        {/* Breakdown */}
        <div className="space-y-2 border-t border-trades-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Posts & articles</span>
            <span className="font-medium text-ink-900">{breakdown.contributions} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Answers accepted</span>
            <span className="font-medium text-ink-900">{breakdown.answers} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Upvotes received</span>
            <span className="font-medium text-ink-900">{breakdown.upvotes} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Endorsements</span>
            <span className="font-medium text-ink-900">{breakdown.endorsements} pts</span>
          </div>
          {breakdown.other !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Other</span>
              <span className="font-medium text-ink-900">{breakdown.other} pts</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
