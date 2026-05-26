interface Specialisation {
  id: string
  code: string
  name: string
}

interface SpecialisationSelectorProps {
  specialisations: Specialisation[]
  selected: string[]
  onSelect: (ids: string[]) => void
  loading?: boolean
}

export function SpecialisationSelector({
  specialisations,
  selected,
  onSelect,
  loading = false,
}: SpecialisationSelectorProps) {
  const handleChange = (id: string, checked: boolean) => {
    if (checked) {
      onSelect([...selected, id])
    } else {
      onSelect(selected.filter((s) => s !== id))
    }
  }

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-lg font-medium text-ink-900 mb-2">
          Select your specialisations (optional)
        </h2>
        <p className="text-sm text-ink-600">
          Choose areas where you have expertise. You can add more later.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-ink-600">Loading specialisations...</p>
      ) : specialisations.length === 0 ? (
        <p className="text-sm text-ink-500">
          No specialisations available for this trade.
        </p>
      ) : (
        <div className="space-y-2">
          {specialisations.map((spec) => (
            <label
              key={spec.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-ink-300 hover:bg-ink-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(spec.id)}
                onChange={(e) => handleChange(spec.id, e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-ink-300 accent-trades-500 cursor-pointer"
              />
              <span className="text-ink-900">{spec.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
