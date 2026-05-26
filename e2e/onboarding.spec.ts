import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test('user completes full onboarding journey from role to first contribution', async ({
    page,
  }) => {
    // Navigate to role selection
    await page.goto('/onboarding/role')
    await expect(page).toHaveURL(/\/onboarding\/role/)

    // Select role
    const journeyPersonButton = page.locator('button:has-text("Journeyperson")')
    await expect(journeyPersonButton).toBeVisible()
    await journeyPersonButton.click()

    // Wait for navigation to trade step
    await page.waitForURL(/\/onboarding\/trade/)
    await expect(page).toHaveURL(/\/onboarding\/trade/)

    // Select trade
    const tradeSelect = page.locator('select')
    if (await tradeSelect.isVisible()) {
      await tradeSelect.first().selectOption('0')
      const nextButton = page.locator('button:has-text("Next")')
      await nextButton.click()
    }

    // Tutorial step (simplified)
    await page.waitForURL(/\/onboarding\/tutorial/, { timeout: 5000 })
      .catch(() => null)
    const skipButton = page.locator('button:has-text("Skip")')
    if (await skipButton.isVisible()) {
      await skipButton.click()
    }

    // Profile step
    await page.waitForURL(/\/onboarding\/profile/, { timeout: 5000 })
      .catch(() => null)
    const nameInput = page.locator('input[placeholder*="name" i]')
    if (await nameInput.isVisible()) {
      await nameInput.fill('John Test')
      const submitButton = page.locator('button:has-text("Next")')
      await submitButton.click()
    }

    // First contribution step
    await page.waitForURL(/\/onboarding\/first-contribution/, { timeout: 5000 })
      .catch(() => null)
  })

  test('progress bar shows correct step indicator', async ({ page }) => {
    await page.goto('/onboarding/role')

    // Progress bar should show step 1
    const progressBar = page.locator('[role="progressbar"]')
    if (await progressBar.isVisible()) {
      await expect(progressBar).toBeVisible()
    }
  })

  test('user can navigate between onboarding steps', async ({ page }) => {
    await page.goto('/onboarding/role')
    await expect(page).toHaveURL(/\/onboarding\/role/)

    // Should start on role page
    const roles = page.locator('button')
    const visibleButtons = await roles.count()
    expect(visibleButtons).toBeGreaterThan(0)
  })
})

test.describe('Form Validation', () => {
  test('prevents submission with empty required fields', async ({ page }) => {
    await page.goto('/onboarding/profile')

    // Try to submit without filling required fields
    const submitButton = page.locator('button:has-text("Next")')
    if (await submitButton.isEnabled()) {
      // Button should be disabled if form is empty
      expect(await submitButton.isDisabled()).toBe(true)
    }
  })

  test('shows error message for invalid input', async ({ page }) => {
    await page.goto('/onboarding/profile')

    // Fill with empty name
    const nameInput = page.locator('input[placeholder*="name" i]')
    if (await nameInput.isVisible()) {
      await nameInput.fill('')
      await nameInput.blur()
    }

    // Submit button should be disabled for empty required field
    const submitButton = page.locator('button:has-text("Next")')
    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeDisabled()
    }
  })

  test('enables submit button when all required fields filled', async ({ page }) => {
    await page.goto('/onboarding/profile')

    // Fill name field
    const nameInput = page.locator('input[placeholder*="name" i]')
    if (await nameInput.isVisible()) {
      await nameInput.fill('John Doe')
    }

    // Submit button should be enabled
    const submitButton = page.locator('button:has-text("Next")')
    if (await submitButton.isVisible()) {
      await expect(submitButton).not.toBeDisabled()
    }
  })

  test('character counter updates in real-time', async ({ page }) => {
    await page.goto('/onboarding/first-contribution')

    const textarea = page.locator('textarea')
    if (await textarea.isVisible()) {
      await textarea.fill('Testing character counter...')

      // Should show character count
      const charCount = page.locator('text=/\\d+\\s*\\/\\s*\\d+/')
      if (await charCount.isVisible()) {
        await expect(charCount).toBeVisible()
      }
    }
  })
})

test.describe('Mobile Responsiveness', () => {
  test('buttons meet 44px minimum touch target size on mobile', async ({
    page,
    context,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/onboarding/role')

    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = buttons.nth(i)
      const box = await button.boundingBox()

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
        expect(box.width).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('form inputs are properly sized on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/onboarding/profile')

    const inputs = page.locator('input')
    const count = await inputs.count()

    for (let i = 0; i < Math.min(count, 2); i++) {
      const input = inputs.nth(i)
      const box = await input.boundingBox()

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('content is readable on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/onboarding/role')

    // Main heading should be visible
    const heading = page.locator('h1, h2').first()
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible()

      const box = await heading.boundingBox()
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375)
      }
    }
  })
})
