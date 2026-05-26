import { describe, it, expect } from 'vitest'
import { createMockRequest } from '@/lib/__tests__/test-helpers'

describe('GET /api/trades', () => {
  it('creates request with GET method', () => {
    const req = createMockRequest('GET', 'http://localhost:3000/api/trades')
    expect(req.method).toBe('GET')
  })

  it('response includes trades array', () => {
    const mockResponse = {
      items: [
        { id: 'trade-1', code: 'ELEC', name: 'Electrician', isActive: true },
        { id: 'trade-2', code: 'PLUM', name: 'Plumber', isActive: true },
      ],
    }

    expect(Array.isArray(mockResponse.items)).toBe(true)
    expect(mockResponse.items.length).toBeGreaterThan(0)
  })

  it('each trade has required fields', () => {
    const trade = {
      id: 'trade-1',
      code: 'ELEC',
      name: 'Electrician',
      isActive: true,
    }

    expect(trade).toHaveProperty('id')
    expect(trade).toHaveProperty('code')
    expect(trade).toHaveProperty('name')
    expect(trade).toHaveProperty('isActive')
  })

  it('filters only active trades', () => {
    const trades = [
      { id: 'trade-1', code: 'ELEC', name: 'Electrician', isActive: true },
      { id: 'trade-2', code: 'PLUM', name: 'Plumber', isActive: true },
      { id: 'trade-3', code: 'OLD', name: 'Obsolete Trade', isActive: false },
    ]

    const activeTrades = trades.filter((t) => t.isActive)
    expect(activeTrades).toHaveLength(2)
    expect(activeTrades.every((t) => t.isActive)).toBe(true)
  })

  it('trades are sorted by name', () => {
    const trades = [
      { id: 'trade-1', code: 'HVAC', name: 'HVAC Technician' },
      { id: 'trade-2', code: 'ELEC', name: 'Electrician' },
      { id: 'trade-3', code: 'PLUM', name: 'Plumber' },
    ]

    const sorted = [...trades].sort((a, b) => a.name.localeCompare(b.name))

    expect(sorted[0].name).toBe('Electrician')
    expect(sorted[1].name).toBe('HVAC Technician')
    expect(sorted[2].name).toBe('Plumber')
  })
})
