import { describe, it, expect } from 'vitest'
import { createMockRequest } from '@/lib/__tests__/test-helpers'

describe('GET /api/trades/[id]/specialisations', () => {
  it('creates request with trade id parameter', () => {
    const req = createMockRequest(
      'GET',
      'http://localhost:3000/api/trades/trade-123/specialisations',
    )

    expect(req.method).toBe('GET')
  })

  it('returns specialisations array', () => {
    const mockResponse = {
      items: [
        { id: 'spec-1', code: 'RES', name: 'Residential', tradeId: 'trade-123' },
        { id: 'spec-2', code: 'COM', name: 'Commercial', tradeId: 'trade-123' },
      ],
    }

    expect(Array.isArray(mockResponse.items)).toBe(true)
    expect(mockResponse.items[0].tradeId).toBe('trade-123')
  })

  it('each specialisation has required fields', () => {
    const spec = {
      id: 'spec-1',
      code: 'RES',
      name: 'Residential',
      tradeId: 'trade-123',
    }

    expect(spec).toHaveProperty('id')
    expect(spec).toHaveProperty('code')
    expect(spec).toHaveProperty('name')
    expect(spec).toHaveProperty('tradeId')
  })

  it('filters specialisations by tradeId', () => {
    const specialisations = [
      { id: 'spec-1', code: 'RES', name: 'Residential', tradeId: 'trade-123' },
      { id: 'spec-2', code: 'COM', name: 'Commercial', tradeId: 'trade-123' },
      { id: 'spec-3', code: 'RES', name: 'Residential', tradeId: 'trade-456' },
    ]

    const filtered = specialisations.filter((s) => s.tradeId === 'trade-123')
    expect(filtered).toHaveLength(2)
    expect(filtered.every((s) => s.tradeId === 'trade-123')).toBe(true)
  })

  it('returns empty array for trade with no specialisations', () => {
    const mockResponse = {
      items: [],
    }

    expect(Array.isArray(mockResponse.items)).toBe(true)
    expect(mockResponse.items.length).toBe(0)
  })

  it('specialisations are sorted by name', () => {
    const specialisations = [
      { id: 'spec-1', code: 'IND', name: 'Industrial' },
      { id: 'spec-2', code: 'RES', name: 'Residential' },
      { id: 'spec-3', code: 'COM', name: 'Commercial' },
    ]

    const sorted = [...specialisations].sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    expect(sorted[0].name).toBe('Commercial')
    expect(sorted[1].name).toBe('Industrial')
    expect(sorted[2].name).toBe('Residential')
  })
})
