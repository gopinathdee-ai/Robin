import { FormSelect, type SelectOption } from '@/components/ui/FormSelect'

interface Trade {
  id: string
  code: string
  name: string
}

interface TradeSelectorProps {
  trades: Trade[]
  selected: string | null
  onSelect: (tradeId: string) => void
  loading?: boolean
}

export function TradeSelector({
  trades,
  selected,
  onSelect,
  loading = false,
}: TradeSelectorProps) {
  const options: SelectOption[] = trades.map((trade) => ({
    value: trade.id,
    label: trade.name,
  }))

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-lg font-medium text-ink-900 mb-2">
          Select your primary trade
        </h2>
        <p className="text-sm text-ink-600">
          You can specialise in multiple trades later, but let's start with your main one.
        </p>
      </div>

      <FormSelect
        label="Trade"
        options={options}
        value={selected || ''}
        onChange={onSelect}
        placeholder="Choose a trade..."
        required
        disabled={loading}
      />

      {loading && (
        <p className="text-sm text-ink-600">Loading trades...</p>
      )}
    </div>
  )
}
