import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../FilterBar'
import { describe, it, expect, vi } from 'vitest'

describe('FilterBar', () => {
  const mockTrades = [
    { id: 'trade-1', name: 'Electrician' },
    { id: 'trade-2', name: 'Plumber' },
    { id: 'trade-3', name: 'HVAC' },
  ]

  it('renders trade filter dropdown', () => {
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn(), onSortChange: vi.fn() }
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )
    expect(screen.getByLabelText('Trade')).toBeInTheDocument()
  })

  it('renders type filter dropdown', () => {
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn(), onSortChange: vi.fn() }
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )
    expect(screen.getByLabelText('Type')).toBeInTheDocument()
  })

  it('renders sort filter dropdown', () => {
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn(), onSortChange: vi.fn() }
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )
    expect(screen.getByLabelText('Sort')).toBeInTheDocument()
  })

  it('displays all trades in dropdown', () => {
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn(), onSortChange: vi.fn() }
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )
    expect(screen.getByText('Electrician')).toBeInTheDocument()
    expect(screen.getByText('Plumber')).toBeInTheDocument()
    expect(screen.getByText('HVAC')).toBeInTheDocument()
  })

  it('calls onTradeChange when trade selected', async () => {
    const onTradeChange = vi.fn()
    const callbacks = { onTypeChange: vi.fn(), onSortChange: vi.fn() }
    const user = userEvent.setup()
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )

    const tradeSelect = screen.getByDisplayValue('All trades') as HTMLSelectElement
    tradeSelect.value = 'trade-1'
    tradeSelect.dispatchEvent(new Event('change', { bubbles: true }))

    expect(onTradeChange).toHaveBeenCalledWith('trade-1')
  })

  it('calls onTypeChange when type selected', async () => {
    const onTypeChange = vi.fn()
    const callbacks = { onTradeChange: vi.fn(), onSortChange: vi.fn() }
    const user = userEvent.setup()
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )

    const typeSelect = screen.getByDisplayValue('All types') as HTMLSelectElement
    typeSelect.value = 'question'
    typeSelect.dispatchEvent(new Event('change', { bubbles: true }))

    expect(onTypeChange).toHaveBeenCalledWith('question')
  })

  it('calls onSortChange when sort selected', async () => {
    const onSortChange = vi.fn()
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn() }
    const user = userEvent.setup()
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={onSortChange}
      />
    )

    const sortSelect = screen.getByDisplayValue('Newest') as HTMLSelectElement
    sortSelect.value = 'trending'
    sortSelect.dispatchEvent(new Event('change', { bubbles: true }))

    expect(onSortChange).toHaveBeenCalledWith('trending')
  })

  it('shows type options', () => {
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn(), onSortChange: vi.fn() }
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )
    expect(screen.getByText('Question')).toBeInTheDocument()
    expect(screen.getByText('Post')).toBeInTheDocument()
    expect(screen.getByText('Answer')).toBeInTheDocument()
  })

  it('shows sort options', () => {
    const callbacks = { onTradeChange: vi.fn(), onTypeChange: vi.fn(), onSortChange: vi.fn() }
    render(
      <FilterBar
        trades={mockTrades}
        onTradeChange={callbacks.onTradeChange}
        onTypeChange={callbacks.onTypeChange}
        onSortChange={callbacks.onSortChange}
      />
    )
    expect(screen.getByText('Newest')).toBeInTheDocument()
    expect(screen.getByText('Most upvoted')).toBeInTheDocument()
    expect(screen.getByText('Most answered')).toBeInTheDocument()
  })
})
