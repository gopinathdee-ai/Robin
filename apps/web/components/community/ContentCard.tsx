'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Bookmark } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComments } from '@fortawesome/free-solid-svg-icons'

interface ContentCardProps {
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
  status?: 'published' | 'pending_review' | 'flagged'
  answersCount?: number
  viewCount?: number
}

export function ContentCard({
  id,
  type,
  title,
  body,
  author,
  trade,
  topic,
  upvotes,
  createdAt,
  status = 'published',
  answersCount = 0,
}: ContentCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const res = await fetch(`/api/bookmarks/check?contentId=${id}`)
        if (res.ok) {
          const data = await res.json()
          setIsBookmarked(data.bookmarked)
        }
      } catch (error) {
        console.error('Failed to check bookmark status:', error)
      }
    }
    checkBookmark()
  }, [id])

  const handleBookmarkClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    try {
      if (isBookmarked) {
        const res = await fetch(`/api/bookmarks?contentId=${id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          setIsBookmarked(false)
        }
      } else {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId: id }),
        })
        if (res.ok) {
          setIsBookmarked(true)
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true })
  const preview = body.length > 150 ? body.substring(0, 150) + '...' : body

  const statusStyles = {
    published: '',
    pending_review: 'bg-amber-100 text-amber-700',
    flagged: 'bg-red-100 text-red-700',
  }

  const statusLabel = {
    published: '',
    pending_review: 'Review in progress',
    flagged: 'Flagged for review',
  }

  return (
    <Link href={`/community/${id}`}>
      <div className="border border-ink-200 rounded-lg p-4 hover:border-trades-400 hover:bg-trades-50 transition-colors cursor-pointer relative">
        {/* Bookmark button - top right */}
        <button
          onClick={handleBookmarkClick}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-ink-500 hover:text-trades-600 transition-colors disabled:opacity-50"
          title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
        >
          <Bookmark
            size={20}
            className={isBookmarked ? 'fill-trades-600 text-trades-600' : ''}
          />
        </button>

        {/* Header: Author, role, time */}
        <div className="flex items-center gap-3 mb-3 text-sm text-ink-600 flex-wrap">
          <span className="font-medium text-ink-900">{author.displayName}</span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-trades-100 text-trades-700">
            {author.role === 'journeyperson' ? 'Journeyperson ✓' : author.role === 'master' ? 'Master ✓' : 'Apprentice'}
          </span>
          {status !== 'published' && (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusStyles[status]}`}>
              {statusLabel[status]}
            </span>
          )}
          <span className="text-ink-500">• {timeAgo}</span>
        </div>

        {/* Content */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-ink-900 mb-1">
            {type === 'question' && 'Q: '}
            {title}
          </h3>
          <p className="text-ink-700">{preview}</p>
        </div>

        {/* Tags: trade + topic */}
        <div className="flex gap-2 mb-3">
          {trade && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-ink-100 text-ink-700">
              {trade.name}
            </span>
          )}
          {topic && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-ink-100 text-ink-700">
              {topic.name}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-sm text-ink-600">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faThumbsUp} /> {upvotes} upvotes
          </span>
          {answersCount !== undefined && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faComments} /> {answersCount} answers
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
