'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComments, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { MarkdownPreview } from '@/components/forms/MarkdownPreview'

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
  lastActivityAt?: string
  status?: 'published' | 'pending_review' | 'flagged'
  answersCount?: number
  viewCount?: number
  aiQualityScore?: number | null
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
  lastActivityAt,
  status = 'published',
  answersCount = 0,
  aiQualityScore,
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

  const timeAgo = formatDistanceToNow(
    new Date(lastActivityAt || createdAt),
    { addSuffix: true }
  )
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
      <div className="border border-ink-200 rounded-lg p-4 hover:border-trades-400 hover:bg-trades-50 transition-colors cursor-pointer">
        {/* Header: Author, role, time */}
        <div className="flex items-center gap-2 mb-3 text-sm text-ink-600 flex-wrap">
          <span className="font-medium text-ink-900">{author.displayName}</span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-trades-100 text-trades-700 flex-shrink-0">
            {author.role === 'journeyperson' ? 'Journeyperson ✓' : author.role === 'master' ? 'Master ✓' : 'Apprentice'}
          </span>
          {status !== 'published' && (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${statusStyles[status]}`}>
              {statusLabel[status]}
            </span>
          )}
          <span className="text-ink-500 text-xs flex-shrink-0">• {timeAgo}</span>
        </div>

        {/* Type and quality badge row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {(type === 'question' || type === 'post') && (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              type === 'question'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {type === 'question' ? 'Question' : 'Post'}
            </span>
          )}

          {status === 'published' && aiQualityScore && aiQualityScore >= 0.50 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-50 border border-blue-200" title="AI Verified Quality">
              <span className="text-lg">✨</span>
              <span className="text-blue-700 font-medium">
                {aiQualityScore >= 0.65 ? 'High Quality' : 'Good Quality'}
              </span>
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-ink-900 mb-1">
            {type === 'question' && 'Q: '}
            {title}
          </h3>
          <div className="text-ink-700">
            <MarkdownPreview>{preview}</MarkdownPreview>
          </div>
        </div>

        {/* Tags: trade + topic */}
        <div className="flex gap-2 mb-3 flex-wrap">
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
        <div className="flex items-center justify-between text-sm text-ink-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faThumbsUp} /> {upvotes} upvotes
            </span>
            {answersCount !== undefined && (
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faComments} /> {answersCount} answers
              </span>
            )}
          </div>
          <button
            onClick={handleBookmarkClick}
            disabled={isLoading}
            className="p-1 text-ink-500 hover:text-trades-600 transition-colors disabled:opacity-50 flex-shrink-0"
            title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
          >
            <FontAwesomeIcon
              icon={faBookmark}
              className={`h-4 w-4 transition-colors ${isBookmarked ? 'text-trades-600' : 'text-ink-400 opacity-60'}`}
            />
          </button>
        </div>
      </div>
    </Link>
  )
}
