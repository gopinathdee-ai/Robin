'use client'

import { useState } from 'react'

interface SearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBox({ onSearch, placeholder = 'What do you want to know?' }: SearchBoxProps) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-ink-300 rounded-lg focus:outline-none focus:border-trades-500 focus:ring-1 focus:ring-trades-500"
      />
      <span className="absolute right-4 top-3.5 text-ink-400">🔍</span>
    </div>
  )
}
