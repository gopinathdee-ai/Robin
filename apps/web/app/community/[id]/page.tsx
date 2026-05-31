'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

import { AppHeader } from '@/components/AppHeader'
import { VoteButtons } from '@/components/community/VoteButtons'
import { AnswerForm } from '@/components/community/AnswerForm'
import { Spinner } from '@/components/ui/Spinner'

interface ContentDetail {
  id: string
  type: string
  title?: string
  body: string
  author: {
    id: string
    displayName: string
    role: string
  }
  trade: { id: string; name: string } | null
  topic: { id: string; name: string } | null
  upvoteCount: number
  status: string
  createdAt: string
  aiQualityScore?: number | null
  answers: Array<{
    id: string
    body: string
    author: { id: string; displayName: string; role: string }
    upvoteCount: number
    isAccepted: boolean
    createdAt: string
    aiQualityScore?: number | null
  }>
}

export default function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [content, setContent] = useState<ContentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [answersRefresh, setAnswersRefresh] = useState(0)
  const [id, setId] = useState<string>('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  useEffect(() => {
    params.then(({ id }) => setId(id))
  }, [params])

  // Fetch content detail
  useEffect(() => {
    if (!id) return

    async function fetchContent() {
      setLoading(true)
      try {
        const response = await fetch(`/api/content/${id}`)
        if (!response.ok) {
          setError('Content not found')
          return
        }
        const data = await response.json()
        setContent(data)
      } catch (err) {
        setError('Failed to load content')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [id, answersRefresh])

  // Check bookmark status
  useEffect(() => {
    if (!id) return

    async function checkBookmark() {
      try {
        const response = await fetch(`/api/bookmarks/check?contentId=${id}`)
        if (response.ok) {
          const data = await response.json()
          setIsBookmarked(data.bookmarked)
        }
      } catch (err) {
        console.error('Failed to check bookmark status', err)
      }
    }

    checkBookmark()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner label="Loading post..." /></div>
  if (error || !content) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">{error || 'Post not found'}</p></div>

  const handleBookmarkClick = async () => {
    setIsBookmarkLoading(true)
    try {
      if (isBookmarked) {
        const response = await fetch(`/api/bookmarks?contentId=${id}`, { method: 'DELETE' })
        if (response.ok) {
          setIsBookmarked(false)
        }
      } else {
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId: id }),
        })
        if (response.ok) {
          setIsBookmarked(true)
        }
      }
    } catch (err) {
      console.error('Failed to update bookmark', err)
    } finally {
      setIsBookmarkLoading(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link href="/community" className="text-trades-500 hover:underline text-sm mb-6 inline-block">
            ← Back to Community
          </Link>

        {/* Question */}
        <div className="border border-ink-200 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="font-medium text-ink-900">{content.author.displayName}</span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-trades-100 text-trades-700">
                  {content.author.role === 'journeyperson' ? 'Journeyperson ✓' : content.author.role === 'master' ? 'Master ✓' : 'Apprentice'}
                </span>
                {content.status === 'published' && content.aiQualityScore && content.aiQualityScore >= 0.50 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-50 border border-blue-200" title="AI Verified Quality">
                    <span className="text-lg">✨</span>
                    <span className="text-blue-700 font-medium">
                      {content.aiQualityScore >= 0.65 ? 'High Quality' : 'Good Quality'}
                    </span>
                  </span>
                )}
                <span className="text-sm text-ink-500">{timeAgo}</span>
              </div>
              {content.type === 'question' && content.title && (
                <h1 className="text-2xl font-bold text-ink-900">Q: {content.title}</h1>
              )}
            </div>
            <div className="text-right text-sm text-ink-500">
              {content.status === 'published' && <span className="text-green-600">✓ Published</span>}
            </div>
          </div>

          <p className="text-ink-700 mb-6 whitespace-pre-wrap">{content.body}</p>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {content.trade && (
              <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-ink-100 text-ink-700">
                {content.trade.name}
              </span>
            )}
            {content.topic && (
              <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-ink-100 text-ink-700">
                {content.topic.name}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <VoteButtons contentId={id} initialUpvotes={content.upvoteCount} />
            <button
              onClick={handleBookmarkClick}
              disabled={isBookmarkLoading}
              title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
              className="flex items-center gap-2 px-4 py-2 rounded border border-ink-300 hover:border-trades-500 transition disabled:opacity-50"
            >
              <FontAwesomeIcon
                icon={faBookmark}
                className={`h-5 w-5 ${isBookmarked ? 'fill-trades-600 text-trades-600' : 'text-ink-600'}`}
              />
              <span className="text-sm font-medium text-ink-700">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-ink-900 mb-4">
            {content.answers.length === 0 ? 'No answers yet' : `Answers (${content.answers.length})`}
          </h2>

          {content.answers.length > 0 && (
            <div className="space-y-4 mb-8">
              {content.answers
                .sort((a, b) => {
                  // Accepted first, then by upvotes
                  if (a.isAccepted !== b.isAccepted) return a.isAccepted ? -1 : 1
                  return b.upvoteCount - a.upvoteCount
                })
                .map((answer) => (
                  <div key={answer.id} className="border border-ink-200 rounded-lg p-4 bg-ink-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-medium text-ink-900">{answer.author.displayName}</span>
                          <span className="text-xs font-medium px-2 py-1 bg-trades-100 text-trades-700 rounded">
                            {answer.author.role}
                          </span>
                          {content.status === 'published' && answer.aiQualityScore && answer.aiQualityScore >= 0.50 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-50 border border-blue-200" title="AI Verified Quality">
                              <span className="text-lg">✨</span>
                              <span className="text-blue-700 font-medium">
                                {answer.aiQualityScore >= 0.65 ? 'High Quality' : 'Good Quality'}
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-500">
                          {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {answer.isAccepted && (
                        <span className="inline-flex items-center px-3 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                          ✓ Accepted
                        </span>
                      )}
                    </div>
                    <p className="text-ink-700 mb-3 whitespace-pre-wrap">{answer.body}</p>
                    <VoteButtons contentId={answer.id} initialUpvotes={answer.upvoteCount} />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Post Your Answer</h2>
          <AnswerForm questionId={id} onAnswerPosted={() => setAnswersRefresh((r) => r + 1)} />
        </div>
        </div>
      </div>
    </>
  )
}
