'use client'

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/AppHeader'
import { EndorsementCard } from '@/components/endorsement/EndorsementCard'
import { Endorsement, useEndorsements } from '@/hooks/useEndorsements'
import { Spinner } from '@/components/ui/Spinner'

export default function EndorsementsPage() {
  const [userEndorsements, setUserEndorsements] = useState<Endorsement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')
  const [filterTopic, setFilterTopic] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'weight'>('recent')

  // For received endorsements
  const { endorsements: receivedEndorsements, loading: receivedLoading } = useEndorsements('me', 'all')

  useEffect(() => {
    setLoading(receivedLoading)
    let filtered = receivedEndorsements

    if (filterTopic !== 'all') {
      filtered = filtered.filter((e) => e.topic.id === filterTopic)
    }

    if (sortBy === 'weight') {
      filtered = [...filtered].sort((a, b) => b.weight - a.weight)
    } else {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }

    setUserEndorsements(filtered)
  }, [receivedEndorsements, receivedLoading, filterTopic, sortBy])

  // Get unique topics for filter
  const uniqueTopics = Array.from(
    new Map(
      receivedEndorsements.map((e) => [e.topic.id, e.topic]),
    ).values(),
  )

  // Group by status
  const byStatus = {
    accepted: userEndorsements.filter((e) => e.status === 'accepted'),
    pending: userEndorsements.filter((e) => e.status === 'pending'),
    rejected: userEndorsements.filter((e) => e.status === 'rejected'),
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink-900 mb-2">Endorsements</h1>
            <p className="text-ink-600">
              Peer recognition of your expertise across trades and topics
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-ink-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'received'
                    ? 'border-trades-600 text-trades-600'
                    : 'border-transparent text-ink-600 hover:text-ink-900'
                }`}
              >
                Received ({byStatus.accepted.length + byStatus.pending.length})
              </button>
              <button
                onClick={() => setActiveTab('given')}
                disabled
                className="py-3 px-1 border-b-2 font-medium text-sm transition border-transparent text-ink-400 cursor-not-allowed"
              >
                Given (Coming soon)
              </button>
            </div>
          </div>

          {/* Filters & Sort */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {/* Topic Filter */}
            <div>
              <label className="text-sm font-medium text-ink-700 block mb-2">Filter by Topic</label>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="px-3 py-2 border border-ink-300 rounded-lg text-sm focus:ring-2 focus:ring-trades-500"
              >
                <option value="all">All Topics ({uniqueTopics.length})</option>
                {uniqueTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-ink-700 block mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'weight')}
                className="px-3 py-2 border border-ink-300 rounded-lg text-sm focus:ring-2 focus:ring-trades-500"
              >
                <option value="recent">Most Recent</option>
                <option value="weight">Most Impactful (Weight)</option>
              </select>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">
              <Spinner label="Loading endorsements..." />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Failed to load endorsements</div>
          ) : userEndorsements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink-600 mb-4">No endorsements yet</p>
              <p className="text-sm text-ink-500">
                Keep contributing to earn endorsements from your peers!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Accepted */}
              {byStatus.accepted.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink-900 mb-3 text-green-700">
                    ACCEPTED ({byStatus.accepted.length})
                  </h3>
                  <div className="space-y-3">
                    {byStatus.accepted.map((endorsement) => (
                      <EndorsementCard
                        key={endorsement.id}
                        endorsement={endorsement}
                        canAccept={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Pending */}
              {byStatus.pending.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink-900 mb-3 text-yellow-700">
                    PENDING ({byStatus.pending.length})
                  </h3>
                  <div className="space-y-3">
                    {byStatus.pending.map((endorsement) => (
                      <EndorsementCard
                        key={endorsement.id}
                        endorsement={endorsement}
                        canAccept={true}
                        onAccept={handleRefresh}
                        onReject={handleRefresh}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected */}
              {byStatus.rejected.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink-900 mb-3 text-red-700">
                    REJECTED ({byStatus.rejected.length})
                  </h3>
                  <div className="space-y-3">
                    {byStatus.rejected.map((endorsement) => (
                      <EndorsementCard
                        key={endorsement.id}
                        endorsement={endorsement}
                        canAccept={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
