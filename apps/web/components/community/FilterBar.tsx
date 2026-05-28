'use client'

import { useState } from 'react'

interface Trade {
  id: string
  name: string
}

interface FilterBarProps {
  trades: Trade[]
  selectedTrade?: string
  selectedType?: string
  selectedSort?: string
  onTradeChange: (tradeId: string) => void
  onTypeChange: (type: string) => void
  onSortChange: (sort: string) => void
}

export function FilterBar({
  trades,
  selectedTrade = '',
  selectedType = '',
  selectedSort = 'newest',
  onTradeChange,
  onTypeChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Trade filter */}
      <div className="flex-1">
        <label htmlFor="trade-filter" className="block text-sm font-medium text-ink-700 mb-1">
          Trade
        </label>
        <select
          id="trade-filter"
          value={selectedTrade}
          onChange={(e) => onTradeChange(e.target.value)}
          className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:border-trades-500"
        >
          <option value="">All trades</option>
          {trades.map((trade) => (
            <option key={trade.id} value={trade.id}>
              {trade.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type filter */}
      <div className="flex-1">
        <label htmlFor="type-filter" className="block text-sm font-medium text-ink-700 mb-1">
          Type
        </label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:border-trades-500"
        >
          <option value="">All types</option>
          <option value="question">Question</option>
          <option value="post">Post</option>
        </select>
      </div>

      {/* Sort filter */}
      <div className="flex-1">
        <label htmlFor="sort-filter" className="block text-sm font-medium text-ink-700 mb-1">
          Sort
        </label>
        <select
          id="sort-filter"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:border-trades-500"
        >
          <option value="newest">Newest</option>
          <option value="trending">Most upvoted</option>
          <option value="most_answered">Most answered</option>
        </select>
      </div>
    </div>
  )
}
