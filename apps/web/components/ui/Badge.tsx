interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  icon?: React.ReactNode
}

export function Badge({ children, variant = 'default', icon }: BadgeProps) {
  const variantClasses = {
    default: 'bg-trades-50 text-trades-600 border-trades-100',
    success: 'bg-green-50 text-green-600 border-green-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    error: 'bg-red-50 text-red-600 border-red-100',
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border ${variantClasses[variant]}`}>
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </div>
  )
}
