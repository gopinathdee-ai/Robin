'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'
import { ContentCard } from '@/components/community/ContentCard'
import { Spinner } from '@/components/ui/Spinner'

interface BookmarkedContent {
  bookmarkId: string
  id: string
  type: 'question' | 'answer' | 'post'
  title: string
  body: string
  author: {
    id: string
    displayName: string
    role: string
  }
  trade: {
    id: string
    name: string
  } | null
  topic: {
    id: string
    name: string
  } | null
  upvotes: number
  createdAt: string
  status: string
  answersCount?: number
  bookmarkedAt: string
}

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch('/api/bookmarks')
        if (!res.ok) {
          throw new Error('Failed to fetch bookmarks')
        }
        const data = await res.json()
        setBookmarks(data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookmarks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">Saved Content</h1>
          <p className="text-ink-600 mb-8">
            Bookmark content to save it for later reading. You have {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}.
          </p>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Spinner label="Loading your bookmarks..." />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!isLoading && bookmarks.length === 0 && (
            <div className="bg-trades-50 border border-trades-200 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-ink-900 mb-4">No saved content yet</h2>
              <p className="text-ink-600 mb-6">
                Visit the community to find interesting questions and posts, then bookmark them to revisit later.
              </p>
              <Link
                href="/community"
                className="inline-flex items-center justify-center px-6 py-2 bg-trades-500 text-white rounded-lg hover:bg-trades-600"
              >
                Browse Community
              </Link>
            </div>
          )}

          {!isLoading && bookmarks.length > 0 && (
            <div>
              {bookmarks.map((bookmark) => (
                <div key={bookmark.bookmarkId} className="mb-8">
                  <ContentCard
                    id={bookmark.id}
                    type={bookmark.type}
                    title={bookmark.title}
                    body={bookmark.body}
                    author={bookmark.author}
                    trade={bookmark.trade}
                    topic={bookmark.topic}
                    upvotes={bookmark.upvotes}
                    createdAt={bookmark.createdAt}
                    status={bookmark.status as 'published' | 'pending_review' | 'flagged'}
                    answersCount={bookmark.answersCount}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
