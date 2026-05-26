import { motion } from 'framer-motion'

export function Spinner({ size = 'lg', label }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const sizeMap = {
    sm: 8,
    md: 12,
    lg: 16,
  }
  const dotSize = sizeMap[size]
  const gap = size === 'sm' ? 2 : size === 'md' ? 3 : 4
  const isSmall = size === 'sm'

  const dotVariants = {
    animate: (i: number) => ({
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  }

  const dotContainer = (
    <div className="inline-flex items-center" style={{ gap: `${gap}px` }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full bg-trades-500"
          style={{
            width: dotSize,
            height: dotSize,
          }}
          variants={dotVariants}
          animate="animate"
          custom={i}
        />
      ))}
    </div>
  )

  // Small spinner: inline layout (for buttons)
  if (isSmall) {
    return <span className="inline-flex items-center gap-2">{dotContainer}</span>
  }

  // Large spinner: centered layout with optional label
  return (
    <div className="flex flex-col items-center gap-4">
      {dotContainer}
      {label && <p className="text-sm text-ink-600">{label}</p>}
    </div>
  )
}
