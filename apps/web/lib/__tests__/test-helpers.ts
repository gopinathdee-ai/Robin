import { NextRequest } from 'next/server'

// Test helpers for Sprint 1 - simplified for now
// Full integration testing deferred to when Prisma schema is stable

export function createMockRequest(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  url: string = 'http://localhost:3000/api/test',
  options?: { body?: string; headers?: Record<string, string> }
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: options?.headers,
    body: options?.body,
  })
}

export function createDevAuthHeader(userId: string): Record<string, string> {
  return {
    'x-dev-user-id': userId,
  }
}

// Mock test data for unit/component tests
export const mockTrades = [
  { id: 'trade-1', code: 'ELEC', name: 'Electrician' },
  { id: 'trade-2', code: 'PLUM', name: 'Plumber' },
]

export const mockSpecialisations = [
  { id: 'spec-1', code: 'RES', name: 'Residential' },
  { id: 'spec-2', code: 'COM', name: 'Commercial' },
]

export const mockTopics = [
  { id: 'topic-1', code: 'PANEL', name: 'Panel Installation' },
  { id: 'topic-2', code: 'WIRE', name: 'Wiring' },
]

export const mockUser = {
  id: 'user-1',
  auth0Id: 'dev|user-1',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'journeyperson',
  provinceCode: 'ON',
  onboardingStep: 0,
}
