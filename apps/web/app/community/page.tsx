'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { prisma } from '@trades/db'
import { AppHeader } from '@/components/AppHeader'
import { ContentCard } from '@/components/community/ContentCard'
import { SearchBox } from '@/components/community/SearchBox'
import { FilterBar } from '@/components/community/FilterBar'
import { DevModeBanner } from '@/components/DevModeBanner'
import { Spinner } from '@/components/ui/Spinner'
import { CreatePostModal } from '@/components/community/CreatePostModal'

export const dynamic = 'force-dynamic'

interface Trade {
  id: string
  name: string
}

interface ContentItem {
  id: string
  type: 'question' | 'answer' | 'post'
  title: string
  body: string
  author: { id: string; displayName: string; role: string }
  trade: { id: string; name: string }
  topic: { id: string; name: string }
  upvoteCount: number
  status?: 'published' | 'pending_review' | 'flagged'
  answers?: any[]
  createdAt: string
}

function CommunityContent() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrade, setSelectedTrade] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedSort, setSelectedSort] = useState('newest')
  const [trades, setTrades] = useState<Trade[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Check for create query param and open modal
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreateModalOpen(true)
    }
  }, [searchParams])

  // Fetch trades on mount
  useEffect(() => {
    async function fetchTrades() {
      try {
        const response = await fetch('/api/trades')
        if (response.ok) {
          const data = await response.json()
          setTrades(data.items || [])
        }
      } catch (err) {
        console.error('Failed to fetch trades', err)
      }
    }
    fetchTrades()
  }, [])

  // Fetch content with filters
  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '20',
        })

        if (selectedTrade) params.append('trade_id', selectedTrade)
        if (selectedType) params.append('type', selectedType)
        if (selectedSort && selectedSort !== 'newest') params.append('sort', selectedSort)

        let url = `/api/content?${params.toString()}`

        // If searching, use search API
        if (searchQuery.length >= 2) {
          url = `/api/content/search?q=${encodeURIComponent(searchQuery)}&limit=20`
          if (selectedTrade) url += `&trade_id=${selectedTrade}`
          if (selectedSort && selectedSort !== 'newest') url += `&sort=${selectedSort}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          const items = data.items || []
          setContent(items)
          setHasMore(data.pages ? page < data.pages : items.length === 20)
        }
      } catch (err) {
        console.error('Failed to fetch content', err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timer = setTimeout(() => {
      setPage(1)
      fetchContent()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedTrade, selectedType, selectedSort, page])

  const handleLoadMore = () => {
    setPage((p) => p + 1)
  }

  const handlePostSuccess = () => {
    setPage(1)
    setSearchQuery('')
    setSelectedTrade('')
    setSelectedType('')
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
        <DevModeBanner message="Showing content under review. This will not appear in production." variant="compact" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">Community Knowledge</h1>
          <p className="text-ink-600">Share and discover trades knowledge</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBox onSearch={setSearchQuery} />
        </div>

        {/* Filters */}
        <FilterBar
          trades={trades}
          selectedTrade={selectedTrade}
          selectedType={selectedType}
          selectedSort={selectedSort}
          onTradeChange={setSelectedTrade}
          onTypeChange={setSelectedType}
          onSortChange={setSelectedSort}
        />

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12">
            <Spinner label="Loading community posts..." />
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12 bg-trades-50 rounded-lg">
            <p className="text-ink-600 mb-4">No posts yet. Be the first to share!</p>
            <Link
              href="/onboarding/first-contribution"
              className="inline-block px-6 py-2 bg-trades-500 text-white rounded-lg hover:bg-trades-600"
            >
              Post a Question
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {content.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id}
                type={item.type}
                title={item.title || 'Untitled'}
                body={item.body}
                author={item.author}
                trade={item.trade}
                topic={item.topic}
                upvotes={item.upvoteCount}
                status={item.status}
                answersCount={item.answers?.length || 0}
                createdAt={item.createdAt}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-3 border border-trades-500 text-trades-500 rounded-lg hover:bg-trades-50 disabled:opacity-50"
              >
                Load More
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handlePostSuccess}
      />
    </>
  )
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CommunityContent />
    </Suspense>
  )
}
