interface QualityBadgeProps {
  score?: number | null
  showTooltip?: boolean
}

export function QualityBadge({ score, showTooltip = true }: QualityBadgeProps) {
  if (!score || score < 0.50) return null

  const isGold = score >= 0.65
  const title = isGold ? 'High Quality' : 'Good Quality'

  return (
    <span
      title={showTooltip ? title : undefined}
      className={`inline-block ${isGold ? 'text-amber-500' : 'text-gray-500'} text-lg leading-none`}
    >
      {isGold ? '⭐' : '✓'}
    </span>
  )
}
