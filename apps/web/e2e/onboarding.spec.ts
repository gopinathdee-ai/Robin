import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start at landing page
    await page.goto('http://localhost:3000')
  })

  test('Complete full onboarding flow (role → trade → tutorial → profile → first-contribution)', async ({
    page,
  }) => {
    // Step 1: Navigate to sign-in
    await page.click('text=Sign In')
    await expect(page).toHaveURL('/auth/sign-in')

    // Step 2: Create new test user
    await page.click('button:has-text("Create new test user")')
    await expect(page).toHaveURL('/onboarding/role')

    // Step 3: Select role (Tradesperson)
    await page.click('button:has-text("Tradesperson")')
    await page.click('button:has-text("Continue")')
    await expect(page).toHaveURL('/onboarding/trade')

    // Step 4: Select trade (Electrician)
    await page.selectOption('select', { label: 'Electrician (Construction)' })
    await page.click('button:has-text("Continue")')
    await expect(page).toHaveURL('/onboarding/tutorial')

    // Step 5: Complete tutorial intro screens
    await page.click('button:has-text("Got it")')
    await page.click('button:has-text("Got it")')

    // Step 6: Submit first contribution in tutorial
    await page.fill('textarea', 'Wire should be pulled carefully through conduit')
    await page.click('button:has-text("Submit my answer")')
    await expect(page.locator('text=First contribution earned')).toBeVisible()

    // Step 7: Proceed to profile setup
    await page.click('button:has-text("Finish setup")')
    await expect(page).toHaveURL('/onboarding/profile')

    // Step 8: Fill profile
    await page.fill('input[name="displayName"]', 'Test Electrician')
    await page.fill('textarea[name="bio"]', 'I am a skilled electrician with 5 years of experience')
    await page.click('button:has-text("Continue")')
    await expect(page).toHaveURL('/onboarding/first-contribution')

    // Step 9: Submit first contribution
    await page.click('button:has-text("Post")')
    await page.fill('input[name="title"]', 'Residential Wiring Best Practices')
    await page.fill(
      'textarea[name="body]',
      'Always test circuits before touching. Use proper grounding. Follow local code.'
    )
    await page.click('button:has-text("Submit")')

    // Step 10: Reach success page
    await expect(page).toHaveURL('/onboarding/success')
    await expect(page.locator('text=You\'re ready')).toBeVisible()
    await expect(page.locator('text=First credential is being issued')).toBeVisible()
  })

  test('User cannot access onboarding without signing in', async ({ page }) => {
    // Try to access onboarding directly
    await page.goto('http://localhost:3000/onboarding/role')

    // Should redirect to sign-in
    await expect(page).toHaveURL('/auth/sign-in')
  })

  test('Can resume existing user from sign-in page', async ({ page }) => {
    // Create a user first
    await page.click('text=Sign In')
    const userId = await page.evaluate(() => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('dev-user-id='))
      return cookie?.split('=')[1]
    })

    // Go back to sign-in
    await page.goto('http://localhost:3000/auth/sign-in')

    // Should see the user in recent users list
    await expect(page.locator(`button:has-text("${userId}")`)).toBeVisible()
  })
})
