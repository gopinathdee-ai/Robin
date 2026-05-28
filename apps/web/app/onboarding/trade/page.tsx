'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronRight, faCheck } from '@fortawesome/free-solid-svg-icons'

import React from 'react'
import { useRouter } from 'next/navigation'

import { OnboardingShell } from '@/components/onboarding/OnboardingShell'
import { Spinner } from '@/components/ui/Spinner'

interface Trade {
  id: string
  code: string
  name: string
}

interface Specialisation {
  id: string
  code: string
  name: string
}

export default function TradeSelectionPage() {
  const router = useRouter()
  const [trades, setTrades] = useState<Trade[]>([])
  const [specs, setSpecs] = useState<Specialisation[]>([])
  const [query, setQuery] = useState('')
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null)
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch trades on mount
  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch('/api/trades')
        if (!res.ok) throw new Error('Failed to fetch trades')
        const data = await res.json()
        setTrades(data.items)
      } catch (error) {
        console.error('Error fetching trades:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrades()
  }, [])

  // Fetch specialisations when trade is selected
  useEffect(() => {
    async function fetchSpecs() {
      if (!selectedTrade) {
        setSpecs([])
        return
      }

      try {
        const res = await fetch(`/api/trades/${selectedTrade}/specialisations`)
        if (!res.ok) throw new Error('Failed to fetch specialisations')
        const data = await res.json()
        setSpecs(data.items)
        setSelectedSpecs([])
      } catch (error) {
        console.error('Error fetching specialisations:', error)
        setSpecs([])
      }
    }
    fetchSpecs()
  }, [selectedTrade])

  const filtered = trades.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  function toggleSpec(specId: string) {
    setSelectedSpecs((prev) =>
      prev.includes(specId) ? prev.filter((s) => s !== specId) : [...prev, specId]
    )
  }

  async function handleContinue() {
    if (!selectedTrade) return
    setSaving(true)

    try {
      const res = await fetch('/api/users/me/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tradeId: selectedTrade,
          specialisationIds: selectedSpecs,
          isPrimary: true,
        }),
      })

      if (!res.ok) throw new Error('Failed to save trade')

      // Also update onboarding step
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingStep: 2 }),
      })

      router.push('/onboarding/logbook')
    } catch (error) {
      console.error('Error saving trade:', error)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <OnboardingShell currentStep={2} totalSteps={6} title="What's your trade?">
        <div className="flex items-center justify-center py-12">
          <Spinner label="Loading trades..." />
        </div>
      </OnboardingShell>
    )
  }

  return (
    <OnboardingShell currentStep={2} totalSteps={6} title="What's your trade?">
      <div className="space-y-6">
        <p className="text-ink-600">
          Your feed and peer connections are built around this. You can add more trades later.
        </p>

        {/* Search */}
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search trades..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedTrade(null)
              setSelectedSpecs([])
            }}
            className="w-full pl-10 pr-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
          />
        </div>

        {/* Trade list */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filtered.map((trade) => (
            <button
              key={trade.id}
              onClick={() => {
                setSelectedTrade(trade.id)
                setSelectedSpecs([])
              }}
              className={`w-full text-left flex items-center gap-3 rounded-xl border-2 px-4 py-3
                          transition-all text-sm font-medium
                ${selectedTrade === trade.id
                  ? 'border-trades-500 bg-trades-50 text-trades-700'
                  : 'border-ink-200 text-ink-700 hover:border-ink-300'
                }`}
            >
              <span className="flex-1">{trade.name}</span>
              {selectedTrade === trade.id && (
                <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-trades-500" />
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-6 text-sm text-ink-400">
              No trades match &ldquo;{query}&rdquo; — try a different search term
            </p>
          )}
        </div>

        {/* Specialisations */}
        {selectedTrade && specs.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-ink-700 mb-3">
              Any specialisations? <span className="text-ink-400 font-normal">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {specs.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => toggleSpec(spec.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all
                    ${selectedSpecs.includes(spec.id)
                      ? 'border-trades-500 bg-trades-500 text-white'
                      : 'border-ink-300 text-ink-600 hover:border-trades-400'
                    }`}
                >
                  {spec.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selectedTrade || saving}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2 ${
            !selectedTrade || saving
              ? 'bg-ink-200 text-ink-600 cursor-not-allowed'
              : 'bg-trades-500 text-white hover:bg-trades-600'
          }`}
        >
          {saving ? (
            <>
              <Spinner size="sm" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-ink-400">
          You can add more trades and specialisations from your profile later
        </p>
      </div>
    </OnboardingShell>
  )
}
