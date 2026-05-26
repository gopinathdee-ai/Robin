import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PATCH } from '../route'
import { createMockRequest } from '@/lib/__tests__/test-helpers'

vi.mock('@trades/db', () => ({
  prisma: {
    notificationPreferences: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn(),
}))

const { prisma } = await import('@trades/db')
const { requireAuth } = await import('@/lib/auth')

describe('notification-preferences API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/users/me/notification-preferences', () => {
    it('returns existing preferences', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockPrefs = {
        id: 'pref-1',
        userId: 'user-1',
        weeklyDigest: true,
        endorsements: true,
        credentialUpdates: true,
        communityActivity: false,
        marketing: false,
      }

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any)
      vi.mocked(prisma.notificationPreferences.findUnique).mockResolvedValue(
        mockPrefs as any
      )

      const response = await GET()
      const data = await response.json()

      expect(data).toEqual(mockPrefs)
    })

    it('creates default preferences if none exist', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const defaultPrefs = {
        id: 'pref-1',
        userId: 'user-1',
        weeklyDigest: true,
        endorsements: true,
        credentialUpdates: true,
        communityActivity: false,
        marketing: false,
      }

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any)
      vi.mocked(prisma.notificationPreferences.findUnique).mockResolvedValue(
        null as any
      )
      vi.mocked(prisma.notificationPreferences.create).mockResolvedValue(
        defaultPrefs as any
      )

      const response = await GET()
      const data = await response.json()

      expect(data).toEqual(defaultPrefs)
      expect(prisma.notificationPreferences.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          weeklyDigest: true,
          endorsements: true,
          credentialUpdates: true,
          communityActivity: false,
          marketing: false,
        },
      })
    })
  })

  describe('PATCH /api/users/me/notification-preferences', () => {
    it('updates preferences and advances onboarding step', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const updatedPrefs = {
        id: 'pref-1',
        userId: 'user-1',
        weeklyDigest: false,
        endorsements: true,
        credentialUpdates: true,
        communityActivity: false,
        marketing: false,
      }

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any)
      vi.mocked(prisma.notificationPreferences.upsert).mockResolvedValue(
        updatedPrefs as any
      )
      vi.mocked(prisma.user.update).mockResolvedValue({} as any)

      const request = createMockRequest(
        'PATCH',
        'http://localhost:3000/api/users/me/notification-preferences',
        { body: JSON.stringify({ weeklyDigest: false }) }
      )

      const response = await PATCH(request)
      const data = await response.json()

      expect(data).toEqual(updatedPrefs)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { onboardingStep: 6 },
      })
    })

    it('rejects invalid request body', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }

      vi.mocked(requireAuth).mockResolvedValue(mockUser as any)

      const request = createMockRequest(
        'PATCH',
        'http://localhost:3000/api/users/me/notification-preferences',
        { body: JSON.stringify({ weeklyDigest: 'invalid' }) }
      )

      const response = await PATCH(request)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Invalid request body')
    })
  })
})
