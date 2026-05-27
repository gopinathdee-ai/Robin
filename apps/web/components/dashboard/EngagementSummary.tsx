'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faLightbulb, faCircleQuestion, faHands } from '@fortawesome/free-solid-svg-icons'

interface EngagementSummaryProps {
  postsThisMonth: number
  answersThisMonth: number
  questionsThisMonth: number
  endorsementsReceivedThisMonth: number
  topicsCount: number
  hideHeader?: boolean
}

export function EngagementSummary({
  postsThisMonth,
  answersThisMonth,
  questionsThisMonth,
  endorsementsReceivedThisMonth,
  topicsCount,
  hideHeader = false,
}: EngagementSummaryProps) {
  const stats = [
    {
      label: 'Posts',
      value: postsThisMonth,
      icon: faFileLines,
    },
    {
      label: 'Answers',
      value: answersThisMonth,
      icon: faLightbulb,
    },
    {
      label: 'Questions',
      value: questionsThisMonth,
      icon: faCircleQuestion,
    },
    {
      label: 'Endorsed',
      value: endorsementsReceivedThisMonth,
      icon: faHands,
    },
  ]

  return (
    <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
      {!hideHeader && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-ink-900">This Month</h3>
          <p className="text-xs text-ink-500">Your engagement metrics for the current month</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-trades-50 p-3 text-center">
            <div className="text-2xl text-trades-600">
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="mt-2 text-2xl font-bold text-trades-600">{stat.value}</div>
            <div className="mt-1 text-xs text-ink-600 truncate">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Topics count */}
      <div className="mt-4 border-t border-trades-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-600">Topics of expertise</span>
          <span className="text-lg font-bold text-trades-600">{topicsCount}</span>
        </div>
      </div>
    </div>
  )
}
