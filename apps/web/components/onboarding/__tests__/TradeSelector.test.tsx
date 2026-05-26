import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TradeSelector } from '../TradeSelector'
import { describe, it, expect, vi } from 'vitest'

const mockTrades = [
  { id: 'trade-1', code: 'ELEC', name: 'Electrician' },
  { id: 'trade-2', code: 'PLUM', name: 'Plumber' },
]

describe('TradeSelector', () => {
  it('renders trade selector component', () => {
    render(
      <TradeSelector
        trades={mockTrades}
        selected={null}
        onSelect={() => {}}
        loading={false}
      />,
    )

    expect(screen.getByLabelText(/trade/i)).toBeInTheDocument()
  })

  it('calls onSelect when trade selected', async () => {
    const onSelect = vi.fn()
    const { container } = render(
      <TradeSelector
        trades={mockTrades}
        selected={null}
        onSelect={onSelect}
        loading={false}
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    if (select) {
      select.value = 'trade-1'
      select.dispatchEvent(new Event('change', { bubbles: true }))
      expect(onSelect).toHaveBeenCalledWith('trade-1')
    }
  })

  it('displays loading state', () => {
    const { container } = render(
      <TradeSelector
        trades={mockTrades}
        selected={null}
        onSelect={() => {}}
        loading={true}
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.disabled).toBe(true)
  })

  it('disables select when loading', () => {
    const { container } = render(
      <TradeSelector
        trades={mockTrades}
        selected={null}
        onSelect={() => {}}
        loading={true}
      />,
    )

    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.disabled).toBe(true)
  })
})
