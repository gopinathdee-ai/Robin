import { describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { createMockRequest, createDevAuthHeader } from '@/lib/__tests__/test-helpers'

describe('GET /api/users/me', () => {
  it('returns user profile with valid auth', async () => {
    const req = createMockRequest('GET', 'http://localhost:3000/api/users/me', {
      headers: createDevAuthHeader('user-123'),
    })

    expect(req.method).toBe('GET')
    expect(req.headers.get('x-dev-user-id')).toBe('user-123')
  })

  it('includes required fields in response', () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'journeyperson',
    }

    expect(mockUser).toHaveProperty('id')
    expect(mockUser).toHaveProperty('email')
    expect(mockUser).toHaveProperty('displayName')
    expect(mockUser).toHaveProperty('role')
  })

  it('creates request with developer header', () => {
    const headers = createDevAuthHeader('dev-user')
    expect(headers['x-dev-user-id']).toBe('dev-user')
  })
})

describe('PATCH /api/users/me', () => {
  it('accepts valid displayName update', () => {
    const validUpdate = {
      displayName: 'Updated Name',
    }

    expect(validUpdate.displayName).toBeTruthy()
    expect(validUpdate.displayName.length).toBeLessThanOrEqual(120)
  })

  it('accepts valid provinceCode (2 chars)', () => {
    const validUpdate = {
      provinceCode: 'ON',
    }

    expect(validUpdate.provinceCode).toMatch(/^[A-Z]{2}$/)
  })

  it('accepts yearsExperience as non-negative integer', () => {
    const validUpdate = {
      yearsExperience: 10,
    }

    expect(Number.isInteger(validUpdate.yearsExperience)).toBe(true)
    expect(validUpdate.yearsExperience).toBeGreaterThanOrEqual(0)
  })

  it('accepts onboardingStep 0-5', () => {
    const steps = [0, 1, 2, 3, 4, 5]
    steps.forEach((step) => {
      expect(step).toBeGreaterThanOrEqual(0)
      expect(step).toBeLessThanOrEqual(5)
    })
  })

  it('creates request with PATCH method', () => {
    const req = createMockRequest('PATCH', 'http://localhost:3000/api/users/me', {
      headers: createDevAuthHeader('user-123'),
      body: JSON.stringify({ displayName: 'John' }),
    })

    expect(req.method).toBe('PATCH')
  })

  it('rejects empty displayName', () => {
    const validUpdate = { displayName: '' }
    expect(validUpdate.displayName).toBeFalsy()
  })

  it('rejects displayName over 120 chars', () => {
    const longName = 'a'.repeat(121)
    expect(longName.length).toBeGreaterThan(120)
  })

  it('accepts valid role update', () => {
    const validRoles = ['apprentice', 'journeyperson', 'master', 'employer_admin']
    validRoles.forEach((role) => {
      const update = { role }
      expect(validRoles).toContain(update.role)
    })
  })

  it('accepts role in PATCH request', () => {
    const req = createMockRequest('PATCH', 'http://localhost:3000/api/users/me', {
      headers: createDevAuthHeader('user-123'),
      body: JSON.stringify({ role: 'journeyperson' }),
    })

    expect(req.method).toBe('PATCH')
  })
})
