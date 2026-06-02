import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Helper to set dev user ID in cookies/headers for auth
export function setDevUserId(userId: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `dev-user-id=${userId}; path=/`
  }
}

// Helper to clear dev user ID
export function clearDevUserId() {
  if (typeof window !== 'undefined') {
    document.cookie = 'dev-user-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
  }
}

// Helper to fetch with auth headers and base URL
const BASE_URL = process.env.VITEST ? 'http://localhost:3000' : ''

export async function authFetch(url: string, options: RequestInit = {}, userId?: string) {
  const headers = new Headers(options.headers)
  if (userId) {
    headers.set('x-dev-user-id', userId)
  }
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`
  return fetch(fullUrl, { ...options, headers })
}
