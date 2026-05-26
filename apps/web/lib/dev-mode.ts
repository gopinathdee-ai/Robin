/**
 * Single source of truth for dev mode detection
 * Uses NEXT_PUBLIC_DEV_MODE environment variable
 */

export function isDevMode(): boolean {
  return process.env.NEXT_PUBLIC_DEV_MODE === 'true'
}
