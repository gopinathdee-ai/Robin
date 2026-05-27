'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

interface VoteButtonsProps {
  contentId: string
  initialUpvotes: number
}

export function VoteButtons({ contentId, initialUpvotes }: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [userVoted, setUserVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleVote() {
    setLoading(true)
    try {
      const response = await fetch(`/api/content/${contentId}/upvote`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Vote failed')

      const data = await response.json()
      setUpvotes(data.upvotes)
      setUserVoted(data.userVoted)
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleVote}
        disabled={loading}
        variant={userVoted ? 'primary' : 'secondary'}
        size="sm"
        className={userVoted ? 'bg-trades-500 text-white border-trades-500 hover:bg-trades-600' : ''}
      >
        <FontAwesomeIcon icon={faThumbsUp} /> {upvotes}
      </Button>
    </div>
  )
}
