import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'
import { requireAuth } from '../auth'

// Mock headers and cookies
vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}))

describe('requireAuth', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_DEV_MODE', 'true')
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('returns AuthUser with dev header in development mode', async () => {
    const { headers, cookies } = await import('next/headers')
    vi.mocked(headers).mockResolvedValue({
      get: (name: string) => name === 'x-dev-user-id' ? 'test-user-123' : null,
    } as any)
    vi.mocked(cookies).mockResolvedValue({
      getAll: () => [],
      get: () => undefined,
    } as any)

    const result = await requireAuth()
    expect(result).not.toBeInstanceOf(NextResponse)
    expect(result).toEqual({
      id: 'test-user-123',
      auth0Id: 'dev|stub',
      email: 'dev@local',
    })
  })

  it('returns 401 error when no dev header and not authenticated', async () => {
    const { headers, cookies } = await import('next/headers')
    vi.mocked(headers).mockResolvedValue({
      get: () => null,
    } as any)
    vi.mocked(cookies).mockResolvedValue({
      getAll: () => [],
      get: () => undefined,
    } as any)

    const result = await requireAuth()
    expect(result).toBeInstanceOf(NextResponse)
    if (result instanceof NextResponse) {
      expect(result.status).toBe(401)
    }
  })
})
