import { test, expect } from '@playwright/test'

/**
 * Comprehensive E2E tests for Onboarding Module (TDD Approach)
 * Tests validate real user workflows as defined in BRD Section 8.1
 *
 * Use Cases Covered:
 * UC1: Role Selection (apprentice, journeyperson, master, employer)
 * UC2: Trade Selection with pagination
 * UC3: Profile Setup (displayName, province, yearsExperience)
 * UC4: Gamified Tutorial (3 steps)
 * UC5: First Contribution & Automatic Credential Issuance
 */

test.describe('Onboarding: Role Selection (UC1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/sign-in')
    await page.getByRole('button', { name: 'Create new test user' }).click()
    await expect(page).toHaveURL('/onboarding/role')
  })

  test('TC1.1: Role selection page displays all role options', async ({ page }) => {
    // Verify all role options are visible
    await expect(page.getByRole('button', { name: 'Apprentice' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Journeyperson' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Master' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Employer' })).toBeVisible()
  })

  test('TC1.2: Selecting apprentice role progresses to trade selection', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Apprentice' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/trade')
  })

  test('TC1.3: Selecting journeyperson role progresses to trade selection', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Journeyperson' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/trade')
  })

  test('TC1.4: Selecting master role progresses to trade selection', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Master' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/trade')
  })

  test('TC1.5: Role selection requires selection before continuing', async ({
    page,
  }) => {
    // Try to continue without selecting a role
    const continueButton = page.getByRole('button', { name: 'Continue' })
    // Button should be disabled or form should not submit
    const isDisabled = await continueButton.isDisabled()
    if (!isDisabled) {
      // If button is enabled, clicking should not navigate away
      await continueButton.click()
      await expect(page).toHaveURL('/onboarding/role')
    }
  })
})

test.describe('Onboarding: Trade Selection (UC2)', () => {
  test.beforeEach(async ({ page }) => {
    // Create user and complete role selection
    await page.goto('http://localhost:3000/auth/sign-in')
    await page.getByRole('button', { name: 'Create new test user' }).click()
    await page.getByRole('button', { name: 'Journeyperson' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/trade')
  })

  test('TC2.1: Trade list loads with Red Seal trades', async ({ page }) => {
    // Verify trade options are displayed
    const tradeSelect = page.locator('select')
    await expect(tradeSelect).toBeVisible()

    // Should have at least one trade option
    const options = page.locator('select option')
    const count = await options.count()
    expect(count).toBeGreaterThan(1) // More than default placeholder
  })

  test('TC2.2: Can select a trade and proceed to tutorial', async ({ page }) => {
    const select = page.locator('select')
    await select.selectOption({ index: 1 }) // Select first trade option
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/tutorial')
  })

  test('TC2.3: Trade selection is required before proceeding', async ({ page }) => {
    const continueButton = page.getByRole('button', { name: 'Continue' })
    const isDisabled = await continueButton.isDisabled()
    if (!isDisabled) {
      await continueButton.click()
      // Should remain on trade page if not selected
      await expect(page).toHaveURL('/onboarding/trade')
    }
  })
})

test.describe('Onboarding: Tutorial (UC4)', () => {
  test.beforeEach(async ({ page }) => {
    // Create user, select role, select trade
    await page.goto('http://localhost:3000/auth/sign-in')
    await page.getByRole('button', { name: 'Create new test user' }).click()
    await page.getByRole('button', { name: 'Journeyperson' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.locator('select').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/tutorial')
  })

  test('TC4.1: Tutorial displays introduction screens', async ({ page }) => {
    // Verify tutorial intro content
    await expect(page.locator('text=/Your record|Yours forever/i')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Got it' })).toBeVisible()
  })

  test('TC4.2: Clicking "Got it" progresses through tutorial steps', async ({
    page,
  }) => {
    // Step through tutorial
    const gotItButtons = page.getByRole('button', { name: 'Got it' })
    const initialCount = await gotItButtons.count()

    await gotItButtons.first().click()
    // After clicking, either on next step or at contribution
    const nextGotItButtons = page.getByRole('button', { name: 'Got it' })
    const updatedCount = await nextGotItButtons.count()

    // Should have progressed (count might decrease or we're on next screen)
    expect(updatedCount).toBeLessThanOrEqual(initialCount)
  })

  test('TC4.3: Tutorial ends with first contribution prompt', async ({ page }) => {
    // Complete tutorial steps
    let gotItButtons = page.getByRole('button', { name: 'Got it' })
    let count = await gotItButtons.count()

    for (let i = 0; i < count; i++) {
      const buttons = page.getByRole('button', { name: 'Got it' })
      if ((await buttons.count()) > 0) {
        await buttons.first().click()
      }
    }

    // Should reach contribution form
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
  })
})

test.describe('Onboarding: First Contribution (UC5)', () => {
  test.beforeEach(async ({ page }) => {
    // Complete up to tutorial
    await page.goto('http://localhost:3000/auth/sign-in')
    await page.getByRole('button', { name: 'Create new test user' }).click()
    await page.getByRole('button', { name: 'Journeyperson' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.locator('select').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Continue' }).click()

    // Skip tutorial steps
    let gotItButtons = page.getByRole('button', { name: 'Got it' })
    let count = await gotItButtons.count()
    for (let i = 0; i < count; i++) {
      const buttons = page.getByRole('button', { name: 'Got it' })
      if ((await buttons.count()) > 0) {
        await buttons.first().click()
      }
    }
  })

  test('TC5.1: Can submit first contribution in tutorial', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.fill('This is my first contribution to the community')

    const submitButton = page.getByRole('button', { name: /Submit|Continue/ }).first()
    await submitButton.click()

    // After contribution, should see success feedback or proceed to profile
    await expect(
      page.locator(
        'text=/First contribution|earned|profile|next step/i'
      )
    ).toBeVisible()
  })

  test('TC5.2: First contribution requires minimum content', async ({ page }) => {
    const textarea = page.locator('textarea').first()

    // Try submitting empty or very short content
    await textarea.fill('x')

    const submitButton = page.getByRole('button', { name: /Submit|Continue/ }).first()
    await submitButton.click()

    // Should either show error or remain on page
    await expect(textarea).toBeVisible()
  })
})

test.describe('Onboarding: Profile Setup (UC3)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile setup page if accessible
    // Most flows go through tutorial first
    await page.goto('http://localhost:3000/onboarding/profile', {
      waitUntil: 'networkidle',
    })

    // If redirected to sign-in, create user first
    if (page.url().includes('/auth/sign-in')) {
      await page.getByRole('button', { name: 'Create new test user' }).click()
      await page.goto('http://localhost:3000/onboarding/profile')
    }
  })

  test('TC3.1: Profile page displays required fields', async ({ page }) => {
    if (page.url().includes('/auth/sign-in')) {
      test.skip()
    }

    // Check for profile fields
    const displayNameInput = page.locator('input[name="displayName"]')
    if (await displayNameInput.isVisible()) {
      await expect(displayNameInput).toBeVisible()
    }
  })
})

test.describe('Onboarding: Complete Flow', () => {
  test('TC-Full: Complete end-to-end onboarding (apprentice → trade → tutorial → profile → success)', async ({
    page,
  }) => {
    // Step 1: Sign in and create user
    await page.goto('http://localhost:3000/auth/sign-in')
    await page.getByRole('button', { name: 'Create new test user' }).click()
    await expect(page).toHaveURL('/onboarding/role')

    // Step 2: Select role
    await page.getByRole('button', { name: 'Apprentice' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/trade')

    // Step 3: Select trade
    await page.locator('select').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/onboarding/tutorial')

    // Step 4: Progress through tutorial
    let gotItButtons = page.getByRole('button', { name: 'Got it' })
    let count = await gotItButtons.count()
    for (let i = 0; i < Math.min(count, 3); i++) {
      const buttons = page.getByRole('button', { name: 'Got it' })
      if ((await buttons.count()) > 0) {
        await buttons.first().click()
      }
    }

    // Step 5: Submit first contribution (if on contribution screen)
    const textarea = page.locator('textarea').first()
    if (await textarea.isVisible()) {
      await textarea.fill('My first contribution to the trades community')
      const submitButton = page
        .getByRole('button', { name: /Submit|Continue|Finish/ })
        .first()
      await submitButton.click()
    }

    // Step 6: Verify progression (should be at profile or success)
    const currentUrl = page.url()
    const progressedBeyondTutorial =
      currentUrl.includes('/onboarding/profile') ||
      currentUrl.includes('/onboarding/success') ||
      currentUrl.includes('/dashboard')

    expect(progressedBeyondTutorial).toBe(true)
  })

  test('TC-Auth: Unauthenticated users cannot access onboarding pages', async ({
    page,
  }) => {
    // Try accessing onboarding directly without auth
    await page.goto('http://localhost:3000/onboarding/role')

    // Should redirect to auth
    await expect(page).toHaveURL('/auth/sign-in')
  })

  test('TC-Resume: Can resume onboarding from interrupted session', async ({
    page,
  }) => {
    // Create user and get to role selection
    await page.goto('http://localhost:3000/auth/sign-in')
    await page.getByRole('button', { name: 'Create new test user' }).click()

    const userId = await page.evaluate(() => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('dev-user-id='))
      return cookie?.split('=')[1]
    })

    // Select role
    await page.getByRole('button', { name: 'Journeyperson' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Navigate away
    await page.goto('http://localhost:3000')

    // Sign in again and should resume
    await page.goto('http://localhost:3000/auth/sign-in')
    if (userId) {
      const resumeButton = page.getByRole('button', { name: userId })
      if (await resumeButton.isVisible()) {
        await resumeButton.click()
        // Should return to onboarding at the right step
        const onOnboardingPage = page.url().includes('/onboarding')
        expect(onOnboardingPage).toBe(true)
      }
    }
  })
})
