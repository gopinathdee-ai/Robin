interface RoleSelectorProps {
  selected?: string | null
  onSelect: (role: string) => void
  disabled?: boolean
}

const roles = [
  {
    id: 'apprentice',
    label: 'Apprentice',
    description: 'New to the trade, learning from others',
  },
  {
    id: 'journeyperson',
    label: 'Journeyperson',
    description: 'Skilled tradesperson, certified in my trade',
  },
  {
    id: 'master',
    label: 'Master',
    description: 'Expert tradesperson with years of experience',
  },
  {
    id: 'employer_admin',
    label: 'Employer/Admin',
    description: 'Managing a team or organisation',
  },
]

export function RoleSelector({ selected, onSelect, disabled = false }: RoleSelectorProps) {
  return (
    <div className="w-full space-y-4">
      <p className="text-lg font-medium text-ink-900">
        What's your role in the trade?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all text-left h-24 flex flex-col justify-center ${
              selected === role.id
                ? 'border-trades-500 bg-trades-50'
                : 'border-ink-300 bg-white hover:border-trades-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-semibold text-ink-900">{role.label}</span>
            <span className="text-sm text-ink-600">{role.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
