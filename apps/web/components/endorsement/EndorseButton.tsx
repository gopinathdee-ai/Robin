'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/Button'
import { EndorsementModal } from './EndorsementModal'

interface EndorseButtonProps {
  recipientId: string
  recipientName: string
  recipientTradeId?: string
  onSuccess?: () => void
}

interface Requirement {
  name: string
  met: boolean
}

export function EndorseButton({
  recipientId,
  recipientName,
  recipientTradeId,
  onSuccess,
}: EndorseButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [blockedReason, setBlockedReason] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const res = await fetch('/api/endorsements/requirements')
        if (res.ok) {
          const data = await res.json()
          setRequirements(data.requirements)
          const unmet = data.requirements.find((r: Requirement) => !r.met)
          if (unmet) {
            setBlockedReason(`You need: ${unmet.name}`)
          }
        }
      } catch (err) {
        console.error('Failed to fetch requirements:', err)
      }
    }

    fetchRequirements()
  }, [])

  const canEndorse = requirements.length > 0 && requirements.every((r) => r.met)

  const handleOpenModal = () => {
    if (canEndorse) {
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSuccess = () => {
    handleCloseModal()
    onSuccess?.()
  }

  return (
    <>
      <div className="relative inline-block group">
        <Button
          onClick={handleOpenModal}
          disabled={!canEndorse}
          variant="primary"
          title={blockedReason || 'Endorse'}
        >
          <FontAwesomeIcon icon={faMedal} className="h-4 w-4" />
          <span>Endorse</span>
        </Button>
        {!canEndorse && blockedReason && (
          <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-ink-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
            {blockedReason}
          </div>
        )}
      </div>

      {showModal && recipientTradeId && (
        <EndorsementModal
          recipientId={recipientId}
          recipientName={recipientName}
          recipientTradeId={recipientTradeId}
          onSuccess={handleSuccess}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
