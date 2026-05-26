'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons'

interface ToastProps {
  id: string
  title: string
  description?: string
  variant: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
}

export function Toast({ id, title, description, variant, onClose }: ToastProps) {
  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: faCircleCheck,
      iconColor: 'text-green-600',
      title: 'text-green-900',
      description: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: faCircleXmark,
      iconColor: 'text-red-600',
      title: 'text-red-900',
      description: 'text-red-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: faTriangleExclamation,
      iconColor: 'text-amber-600',
      title: 'text-amber-900',
      description: 'text-amber-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: faCircleInfo,
      iconColor: 'text-blue-600',
      title: 'text-blue-900',
      description: 'text-blue-700',
    },
  }

  const style = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ duration: 0.3 }}
      className={`${style.bg} ${style.border} rounded-xl border p-4 shadow-lg max-w-sm w-full pointer-events-auto`}
    >
      <div className="flex items-start gap-3">
        <FontAwesomeIcon icon={style.icon} className={`${style.iconColor} h-5 w-5 flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`${style.title} font-semibold text-sm`}>{title}</p>
          {description && (
            <p className={`${style.description} text-sm mt-1`}>{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`${style.iconColor} hover:opacity-75 transition-opacity flex-shrink-0`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
