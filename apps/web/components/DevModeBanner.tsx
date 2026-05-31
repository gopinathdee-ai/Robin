import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faFlask } from '@fortawesome/free-solid-svg-icons'
import { isDevMode } from '@/lib/dev-mode'

interface DevModeBannerProps {
  message?: string
  variant?: 'default' | 'compact'
}

export function DevModeBanner({ message, variant = 'default' }: DevModeBannerProps) {
  if (!isDevMode()) return null

  if (variant === 'compact') {
    return (
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <span className="font-medium"><FontAwesomeIcon icon={faClipboard} /> Dev Mode:</span> {message || 'Development mode enabled'}
        </p>
      </div>
    )
  }

  return (
    <div className="mb-8 p-3 bg-trades-50 border border-trades-200 rounded-lg">
      <p className="text-sm font-semibold text-trades-700 flex items-center gap-2"><FontAwesomeIcon icon={faFlask} className="h-3.5 w-3.5 flex-shrink-0" /> DEV MODE</p>
      <p className="text-xs text-trades-600 mt-1">{message || 'Development mode enabled'}</p>
    </div>
  )
}
