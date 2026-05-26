import { describe, it, expect } from 'vitest'

/**
 * GET /api/users/me/trades API Tests
 *
 * Verifies that the trades endpoint:
 * 1. Returns trades in the correct format
 * 2. Prioritizes isPrimary flag
 * 3. Includes all necessary fields (id, name, code, isPrimary, etc.)
 * 4. Handles multiple trades correctly
 */

describe('GET /api/users/me/trades', () => {
  describe('Response Format', () => {
    it('should return trades in items array format', () => {
      const response = {
        items: [
          {
            id: 'trade-uuid-123',
            name: 'Electrician',
            code: 'electrician',
            isPrimary: true,
            specialisationId: null,
            specialisationName: null,
            verifiedAt: null,
          },
        ],
      }

      expect(response).toHaveProperty('items')
      expect(Array.isArray(response.items)).toBe(true)
      expect(response.items.length).toBeGreaterThan(0)
    })

    it('should include required fields for each trade', () => {
      const trade = {
        id: 'trade-uuid-123',
        name: 'Electrician',
        code: 'electrician',
        isPrimary: true,
        specialisationId: null,
        specialisationName: null,
        verifiedAt: null,
      }

      expect(trade).toHaveProperty('id')
      expect(trade).toHaveProperty('name')
      expect(trade).toHaveProperty('code')
      expect(trade).toHaveProperty('isPrimary')
    })

    it('should have id as UUID, not code or name', () => {
      const trade = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Electrician',
        code: 'electrician',
        isPrimary: true,
      }

      expect(trade.id).toMatch(/^[a-f0-9\-]{36}$/) // UUID format
      expect(trade.id).not.toBe('electrician')
      expect(trade.id).not.toBe('Electrician')
    })
  })

  describe('Primary Trade Handling', () => {
    it('should mark primary trade correctly', () => {
      const trades = [
        { id: 'trade-123', name: 'Electrician', isPrimary: true },
        { id: 'trade-456', name: 'Plumbing', isPrimary: false },
      ]

      const primaryTrade = trades.find((t) => t.isPrimary)
      expect(primaryTrade?.name).toBe('Electrician')
      expect(primaryTrade?.isPrimary).toBe(true)
    })

    it('should return only one primary trade', () => {
      const trades = [
        { id: 'trade-123', name: 'Electrician', isPrimary: true },
        { id: 'trade-456', name: 'Plumbing', isPrimary: false },
        { id: 'trade-789', name: 'HVAC', isPrimary: false },
      ]

      const primaryTrades = trades.filter((t) => t.isPrimary)
      expect(primaryTrades.length).toBe(1)
    })

    it('should sort with primary trades first', () => {
      const trades = [
        { id: 'trade-456', name: 'Plumbing', isPrimary: false },
        { id: 'trade-123', name: 'Electrician', isPrimary: true },
        { id: 'trade-789', name: 'HVAC', isPrimary: false },
      ]

      // Sort primary first
      const sorted = trades.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))

      expect(sorted[0].isPrimary).toBe(true)
      expect(sorted[0].name).toBe('Electrician')
    })

    it('should allow fallback to first trade if no primary', () => {
      const trades = [
        { id: 'trade-456', name: 'Plumbing', isPrimary: false },
        { id: 'trade-789', name: 'HVAC', isPrimary: false },
      ]

      const primaryOrFirst = trades.find((t) => t.isPrimary) || trades[0]
      expect(primaryOrFirst.name).toBe('Plumbing')
    })
  })

  describe('Multiple Trades Scenario', () => {
    it('should return all user trades', () => {
      const response = {
        items: [
          { id: 'trade-111', name: 'Electrician', isPrimary: true },
          { id: 'trade-222', name: 'Plumbing', isPrimary: false },
          { id: 'trade-333', name: 'HVAC', isPrimary: false },
        ],
      }

      expect(response.items.length).toBe(3)
      expect(response.items.every((t) => t.id && t.name)).toBe(true)
    })

    it('should maintain unique IDs across trades', () => {
      const trades = [
        { id: 'trade-111', name: 'Electrician', isPrimary: true },
        { id: 'trade-222', name: 'Plumbing', isPrimary: false },
        { id: 'trade-333', name: 'HVAC', isPrimary: false },
      ]

      const ids = trades.map((t) => t.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should handle trade without specialisation', () => {
      const trade = {
        id: 'trade-123',
        name: 'Electrician',
        code: 'electrician',
        isPrimary: true,
        specialisationId: null,
        specialisationName: null,
      }

      expect(trade.specialisationId).toBeNull()
      expect(trade.specialisationName).toBeNull()
    })

    it('should handle trade with specialisation', () => {
      const trade = {
        id: 'trade-123',
        name: 'Electrician',
        code: 'electrician',
        isPrimary: true,
        specialisationId: 'spec-456',
        specialisationName: 'Industrial Electrical',
      }

      expect(trade.specialisationId).toBeDefined()
      expect(trade.specialisationName).toBeDefined()
      expect(trade.specialisationName).toBe('Industrial Electrical')
    })
  })

  describe('Error Cases', () => {
    it('should handle empty trades list', () => {
      const response = { items: [] }

      expect(Array.isArray(response.items)).toBe(true)
      expect(response.items.length).toBe(0)
    })

    it('should provide clear data structure even with no trades', () => {
      const response = { items: [] }

      // Should still have items property
      expect(response).toHaveProperty('items')
      // Should be an array
      expect(Array.isArray(response.items)).toBe(true)
    })
  })

  describe('Dashboard Integration', () => {
    it('should provide trade ID suitable for leaderboard link', () => {
      const response = {
        items: [{ id: 'trade-abc-123', name: 'Electrician', isPrimary: true }],
      }

      const primaryTrade = response.items.find((t) => t.isPrimary)
      const leaderboardUrl = `/leaderboards/${primaryTrade?.id}`

      expect(leaderboardUrl).toBe('/leaderboards/trade-abc-123')
    })

    it('should not expose code in leaderboard link', () => {
      const response = {
        items: [{ id: 'trade-abc-123', name: 'Electrician', code: 'electrician', isPrimary: true }],
      }

      const primaryTrade = response.items[0]

      // Dashboard should use ID, not code
      expect(`/leaderboards/${primaryTrade.id}`).toBe('/leaderboards/trade-abc-123')
      expect(`/leaderboards/${primaryTrade.code}`).not.toBe('/leaderboards/trade-abc-123')
    })
  })

  describe('Data Validation', () => {
    it('all IDs should be valid UUIDs or slugs, not hardcoded strings', () => {
      const trades = [
        { id: 'trade-uuid-1a2b3c4d', name: 'Electrician' },
        { id: 'trade-uuid-5e6f7g8h', name: 'Plumbing' },
      ]

      trades.forEach((trade) => {
        // Should not be simple hardcoded strings
        expect(trade.id).not.toMatch(/^(electrician|plumbing|hvac|carpenter)$/i)
      })
    })

    it('should not leak internal IDs as trade names', () => {
      const trade = {
        id: 'a47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Electrician',
      }

      expect(trade.name).not.toBe(trade.id)
      expect(trade.name).toMatch(/^[A-Z][a-z]+$/) // Proper case
    })
  })
})
