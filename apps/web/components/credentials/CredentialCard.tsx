'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faCheckCircle, faClock, faCircleXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { DOCUMENT_TYPE_LABELS } from '@/lib/documents'
import { format } from 'date-fns'

interface CredentialCardProps {
  id: string
  documentType: string
  fileName: string
  fileSize: number
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  rejectionReason?: string
  createdAt: string
  onDelete?: (id: string) => void
  loading?: boolean
}

export function CredentialCard({
  id,
  documentType,
  fileName,
  fileSize,
  status,
  rejectionReason,
  createdAt,
  onDelete,
  loading = false,
}: CredentialCardProps) {
  const statusConfig = {
    PENDING: {
      icon: faClock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Pending Review',
      borderColor: 'border-amber-200',
    },
    VERIFIED: {
      icon: faCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Verified',
      borderColor: 'border-green-200',
    },
    REJECTED: {
      icon: faCircleXmark,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Rejected',
      borderColor: 'border-red-200',
    },
  }

  const config = statusConfig[status]

  const canDelete = status === 'PENDING' || status === 'REJECTED'

  return (
    <div className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0 pt-0.5">
            <FontAwesomeIcon icon={faFileLines} className={`h-5 w-5 ${config.color}`} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-ink-900 break-words">
                {DOCUMENT_TYPE_LABELS[documentType] || documentType}
              </h3>
              <span className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold ${config.color}`}>
                <FontAwesomeIcon icon={config.icon} className="h-4 w-4" />
                {config.label}
              </span>
            </div>

            <p className="text-sm text-ink-600 break-all">{fileName}</p>
            <p className="text-xs text-ink-500 mt-1">
              {(fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded{' '}
              {format(new Date(createdAt), 'MMM d, yyyy')}
            </p>

            {rejectionReason && status === 'REJECTED' && (
              <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                <p className="font-semibold">Rejection reason:</p>
                <p>{rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(id)}
            disabled={loading}
            className="flex-shrink-0 p-2 text-ink-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Delete document"
            aria-label="Delete document"
          >
            <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
