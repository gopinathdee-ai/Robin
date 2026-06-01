export interface TestUser {
  id: string
  email: string
  displayName: string
  role: 'apprentice' | 'journeyperson' | 'master' | 'employer_admin'
  onboardingStep: number
  status: 'active' | 'onboarding' | 'disabled'
  createdAt: Date
  updatedAt: Date
}

export async function createTestUser(overrides: Partial<TestUser> = {}): Promise<TestUser> {
  const defaultData: TestUser = {
    id: `test-user-${Date.now()}`,
    email: `test-${Date.now()}@local.test`,
    displayName: 'Test User',
    role: 'apprentice',
    onboardingStep: 0,
    status: 'onboarding',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }

  // TODO: Call API to create user in test database
  // const response = await fetch('/api/test-utils/create-user', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(defaultData),
  // })
  // return response.json()

  return defaultData
}

export async function deleteTestUser(userId: string): Promise<void> {
  // TODO: Call API to delete user from test database
  // await fetch(`/api/test-utils/delete-user/${userId}`, { method: 'DELETE' })
}

export async function getTestUser(userId: string): Promise<TestUser | null> {
  // TODO: Call API to fetch user from test database
  // const response = await fetch(`/api/test-utils/users/${userId}`)
  // if (!response.ok) return null
  // return response.json()
  return null
}
