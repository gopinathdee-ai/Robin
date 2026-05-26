'use client'

interface Topic {
  topicId: string
  topicName: string
  points: number
}

interface ExpertiseTopicsProps {
  topics: Topic[]
  maxPoints?: number
}

export function ExpertiseTopics({ topics, maxPoints = 750 }: ExpertiseTopicsProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-ink-900">Expertise Topics</h3>
        <p className="text-sm text-ink-500">
          Your expertise topics will appear as you contribute content and receive endorsements.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-ink-900">Expertise Topics</h3>
      <div className="space-y-4">
        {topics.map((topic) => {
          const percent = Math.min(100, Math.round((topic.points / maxPoints) * 100))
          return (
            <div key={topic.topicId}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-ink-900">{topic.topicName}</span>
                <span className="text-xs text-ink-500">{topic.points} pts ({percent}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-trades-100">
                <div
                  className="h-full bg-trades-500 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
