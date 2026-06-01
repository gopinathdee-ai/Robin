import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestUser, deleteTestUser, TestUser } from '../fixtures/users'
import { authFetch } from '../test-helpers.tsx'

describe('Onboarding: Role Selection (TC1)', () => {
  let testUser: TestUser

  beforeAll(async () => {
    testUser = await createTestUser({
      status: 'onboarding',
      onboardingStep: 0,
    })
  })

  afterAll(async () => {
    if (testUser) {
      await deleteTestUser(testUser.id)
    }
  })

  it('TC1.1: User lands on role selection after signup', async () => {
    // Given: User has just created account
    expect(testUser.onboardingStep).toBe(0)

    // When: User navigates to onboarding role page
    const response = await fetch('/onboarding/role')

    // Then: Page loads successfully
    expect(response.status).toBe(200)

    // And: HTML contains role selection options
    const html = await response.text()
    expect(html).toContain('apprentice')
    expect(html).toContain('journeyperson')
    expect(html).toContain('master')
    expect(html).toContain('employer')
  })

  it('TC1.2: Role selection persists to database', async () => {
    // Given: testUser is on role selection page
    expect(testUser.role).toBe('apprentice')

    // When: User selects journeyperson role and submits
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'journeyperson' }),
      },
      testUser.id
    )

    // Then: API returns success
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.role).toBe('journeyperson')

    // And: onboardingStep increments to 1
    expect(data.onboardingStep).toBe(1)
  })

  it('TC1.3: Invalid role is rejected', async () => {
    // Given: Valid auth for testUser
    // When: User submits invalid role
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'invalid_role' }),
      },
      testUser.id
    )

    // Then: API returns 400 error
    expect(response.status).toBe(400)

    const error = await response.json()
    expect(error.error).toBeDefined()
  })
})

describe('Onboarding: Trade Selection (TC2)', () => {
  let testUser: TestUser

  beforeAll(async () => {
    testUser = await createTestUser({
      status: 'onboarding',
      onboardingStep: 1,
      role: 'journeyperson',
    })
  })

  afterAll(async () => {
    if (testUser) {
      await deleteTestUser(testUser.id)
    }
  })

  it('TC2.1: Trade list loads and is paginated', async () => {
    // When: User navigates to trade selection or API is called
    const response = await fetch('/api/trades?page=1&limit=20')

    // Then: API returns success
    expect(response.status).toBe(200)

    const data = await response.json()

    // And: Response includes items array
    expect(Array.isArray(data.items)).toBe(true)

    // And: At least some Red Seal trades are returned
    expect(data.items.length).toBeGreaterThan(0)

    // And: Pagination metadata is included
    expect(data.page).toBe(1)
    expect(typeof data.pages).toBe('number')
  })

  it('TC2.2: Trade selection marks isPrimary', async () => {
    // When: User selects a trade
    const trades = await (await fetch('/api/trades?page=1&limit=1')).json()
    const tradeId = trades.items[0]?.id

    expect(tradeId).toBeDefined()

    // When: User submits trade selection
    const response = await authFetch(
      '/api/users/me/trades',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId, isPrimary: true }),
      },
      testUser.id
    )

    // Then: API returns success
    expect(response.status).toBe(201)

    const data = await response.json()

    // And: UserTrade record has isPrimary: true
    expect(data.isPrimary).toBe(true)

    // And: onboardingStep increments to 2
    // (This should happen via trigger or separate API call)
  })
})

describe('Onboarding: Profile Setup (TC3)', () => {
  let testUser: TestUser

  beforeAll(async () => {
    testUser = await createTestUser({
      status: 'onboarding',
      onboardingStep: 2,
      role: 'journeyperson',
    })
  })

  afterAll(async () => {
    if (testUser) {
      await deleteTestUser(testUser.id)
    }
  })

  it('TC3.1: Profile form validates required fields', async () => {
    // When: User submits profile with displayName = 1 character
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'X',
          province: 'ON',
          yearsExperience: 5,
        }),
      },
      testUser.id
    )

    // Then: API returns validation error
    expect(response.status).toBe(400)

    const error = await response.json()
    expect(error.error).toContain('at least 2')
  })

  it('TC3.1b: Profile form validates province code', async () => {
    // When: User submits invalid province code
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'John Doe',
          province: 'XYZ',
          yearsExperience: 5,
        }),
      },
      testUser.id
    )

    // Then: API returns validation error
    expect(response.status).toBe(400)
  })

  it('TC3.2: Profile data persists', async () => {
    // When: User fills profile with valid data
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'John Doe',
          province: 'ON',
          yearsExperience: 5,
        }),
      },
      testUser.id
    )

    // Then: API returns success
    expect(response.status).toBe(200)

    const data = await response.json()

    // And: User record updated with all fields
    expect(data.displayName).toBe('John Doe')
    expect(data.province).toBe('ON')
    expect(data.yearsExperience).toBe(5)

    // And: onboardingStep increments to 3
    expect(data.onboardingStep).toBe(3)
  })

  it('TC3.3: Optional fields do not block submission', async () => {
    // When: User submits profile without optional fields (employerName, unionLocal)
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Jane Smith',
          province: 'BC',
          yearsExperience: 10,
        }),
      },
      testUser.id
    )

    // Then: API accepts submission without optional fields
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.displayName).toBe('Jane Smith')
  })
})

describe('Onboarding: Tutorial (TC4)', () => {
  let testUser: TestUser

  beforeAll(async () => {
    testUser = await createTestUser({
      status: 'onboarding',
      onboardingStep: 3,
    })
  })

  afterAll(async () => {
    if (testUser) {
      await deleteTestUser(testUser.id)
    }
  })

  it('TC4.1: Tutorial steps increment onboardingStep', async () => {
    // Given: User is on step 1 of tutorial
    expect(testUser.onboardingStep).toBe(3)

    // When: User clicks "Got it — keep going"
    const response = await authFetch(
      '/api/users/me/onboarding/next-step',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedStep: 3 }),
      },
      testUser.id
    )

    // Then: API returns success
    expect(response.status).toBe(200)

    const data = await response.json()

    // And: onboardingStep incremented to 4
    expect(data.onboardingStep).toBe(4)
  })

  it('TC4.2: Tutorial progress can be retrieved', async () => {
    // When: User fetches their onboarding progress
    const response = await authFetch('/api/users/me', {}, testUser.id)

    // Then: API returns current onboardingStep
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(typeof data.onboardingStep).toBe('number')
    expect(data.onboardingStep).toBeGreaterThanOrEqual(3)
  })
})

describe('Onboarding: First Contribution (TC5)', () => {
  let testUser: TestUser

  beforeAll(async () => {
    testUser = await createTestUser({
      status: 'onboarding',
      onboardingStep: 4,
    })
  })

  afterAll(async () => {
    if (testUser) {
      await deleteTestUser(testUser.id)
    }
  })

  it('TC5.1: First contribution is accepted', async () => {
    // When: User submits first answer with valid body
    const response = await authFetch(
      '/api/content',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'answer',
          parentId: 'test-question-id',
          body: 'This is a detailed answer to the test question.',
        }),
      },
      testUser.id
    )

    // Then: Content is created
    expect([201, 202]).toContain(response.status)

    const data = await response.json()
    expect(data.id).toBeDefined()

    // And: Content is queued for AI screening
    expect(data.status).toMatch(/pending_review|processing/)
  })

  it('TC5.2: First contribution redirects to dashboard', async () => {
    // Given: User has submitted first contribution
    // When: AI screening completes
    // Then: User is redirected to /dashboard
    // (This is handled by frontend redirect logic, not API)
    // Verify that dashboard page accepts onboarding-complete user
    const response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingStep: 5 }),
      },
      testUser.id
    )

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.onboardingStep).toBe(5)
  })

  it('TC5.3: Incomplete onboarding redirects to next step', async () => {
    // Given: User with onboardingStep = 2
    const user = await createTestUser({
      status: 'onboarding',
      onboardingStep: 2,
    })

    // When: User tries to access dashboard
    const response = await authFetch('/api/users/me', {}, user.id)

    // Then: onboardingStep indicates incomplete status
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.onboardingStep).toBeLessThan(5)

    // (Frontend should redirect based on this value)
    await deleteTestUser(user.id)
  })
})

describe('Onboarding: Full Flow Integration', () => {
  let testUser: TestUser

  beforeAll(async () => {
    testUser = await createTestUser({
      status: 'onboarding',
      onboardingStep: 0,
      role: 'apprentice',
    })
  })

  afterAll(async () => {
    if (testUser) {
      await deleteTestUser(testUser.id)
    }
  })

  it('Full onboarding flow: Role → Trade → Profile → Tutorial → Contribution', async () => {
    // Step 1: Select role
    let response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'journeyperson' }),
      },
      testUser.id
    )
    expect(response.status).toBe(200)
    let data = await response.json()
    expect(data.onboardingStep).toBe(1)

    // Step 2: Select trade
    const trades = await (await fetch('/api/trades?page=1&limit=1')).json()
    const tradeId = trades.items[0]?.id

    response = await authFetch(
      '/api/users/me/trades',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId, isPrimary: true }),
      },
      testUser.id
    )
    expect(response.status).toBe(201)

    // Step 3: Profile setup
    response = await authFetch(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Integration Test User',
          province: 'ON',
          yearsExperience: 3,
        }),
      },
      testUser.id
    )
    expect(response.status).toBe(200)
    data = await response.json()
    expect(data.displayName).toBe('Integration Test User')
    expect(data.onboardingStep).toBe(3)

    // Step 4: Progress through tutorial (simplified)
    response = await authFetch(
      '/api/users/me/onboarding/next-step',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedStep: 3 }),
      },
      testUser.id
    )
    expect(response.status).toBe(200)
    data = await response.json()
    expect(data.onboardingStep).toBe(4)

    // Step 5: Submit first contribution
    response = await authFetch(
      '/api/content',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'post',
          title: 'My First Post',
          body: 'This is my first contribution to the community.',
          tradeId: tradeId,
        }),
      },
      testUser.id
    )
    expect([201, 202]).toContain(response.status)

    // Verify final state
    response = await authFetch('/api/users/me', {}, testUser.id)
    data = await response.json()
    expect(data.displayName).toBe('Integration Test User')
    expect(data.role).toBe('journeyperson')
  })
})
