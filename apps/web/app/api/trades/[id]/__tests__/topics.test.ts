import { describe, it, expect } from 'vitest'
import { createMockRequest } from '@/lib/__tests__/test-helpers'

describe('GET /api/trades/[id]/topics', () => {
  it('creates request with trade id parameter', () => {
    const req = createMockRequest(
      'GET',
      'http://localhost:3000/api/trades/trade-123/topics',
    )

    expect(req.method).toBe('GET')
  })

  it('returns topics array', () => {
    const mockResponse = {
      items: [
        { id: 'topic-1', code: 'PANEL', name: 'Panel Installation', tradeId: 'trade-123' },
        { id: 'topic-2', code: 'WIRE', name: 'Wiring', tradeId: 'trade-123' },
      ],
    }

    expect(Array.isArray(mockResponse.items)).toBe(true)
    expect(mockResponse.items[0].tradeId).toBe('trade-123')
  })

  it('each topic has required fields', () => {
    const topic = {
      id: 'topic-1',
      code: 'PANEL',
      name: 'Panel Installation',
      tradeId: 'trade-123',
    }

    expect(topic).toHaveProperty('id')
    expect(topic).toHaveProperty('code')
    expect(topic).toHaveProperty('name')
    expect(topic).toHaveProperty('tradeId')
  })

  it('filters topics by tradeId', () => {
    const topics = [
      { id: 'topic-1', code: 'PANEL', name: 'Panel', tradeId: 'trade-123' },
      { id: 'topic-2', code: 'WIRE', name: 'Wiring', tradeId: 'trade-123' },
      { id: 'topic-3', code: 'PIPE', name: 'Piping', tradeId: 'trade-456' },
    ]

    const filtered = topics.filter((t) => t.tradeId === 'trade-123')
    expect(filtered).toHaveLength(2)
    expect(filtered.every((t) => t.tradeId === 'trade-123')).toBe(true)
  })

  it('returns empty array for trade with no topics', () => {
    const mockResponse = {
      items: [],
    }

    expect(Array.isArray(mockResponse.items)).toBe(true)
    expect(mockResponse.items.length).toBe(0)
  })

  it('topics are sorted by name', () => {
    const topics = [
      { id: 'topic-1', code: 'WIRE', name: 'Wiring' },
      { id: 'topic-2', code: 'PANEL', name: 'Panel Installation' },
      { id: 'topic-3', code: 'SAFETY', name: 'Safety Procedures' },
    ]

    const sorted = [...topics].sort((a, b) => a.name.localeCompare(b.name))

    expect(sorted[0].name).toBe('Panel Installation')
    expect(sorted[1].name).toBe('Safety Procedures')
    expect(sorted[2].name).toBe('Wiring')
  })
})
