'use client'

interface Trade {
  id: string
  code: string
  name: string
}

interface TradeSelectorProps {
  trades: Trade[]
  selectedTradeCode: string
  onSelect: (code: string) => void
}

export function TradeSelector({ trades, selectedTradeCode, onSelect }: TradeSelectorProps) {
  return (
    <div className="rounded-lg border border-trades-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-ink-900">Select a Trade</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {trades.map((trade) => (
          <button
            key={trade.id}
            onClick={() => onSelect(trade.code)}
            className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
              selectedTradeCode === trade.code
                ? 'bg-trades-500 text-white'
                : 'border border-trades-200 bg-white text-ink-900 hover:bg-trades-50'
            }`}
          >
            {trade.name}
          </button>
        ))}
      </div>
    </div>
  )
}
