# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> Onboarding Flow >> Complete full onboarding flow (role → trade → tutorial → profile → first-contribution)
- Location: e2e\onboarding.spec.ts:9:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/auth/sign-in"
Received: "http://localhost:3000/"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:3000/"

```

```yaml
- navigation:
  - img "Trades Platform"
  - text: Trades Platform
  - link "Sign in":
    - /url: /auth/sign-in
  - link "Get started free":
    - /url: /auth/sign-up
- text: Now available to electricians in Alberta
- heading "Your skills record. Built to last a career." [level=1]
- paragraph: Portable credentials and real mentorship for Canada's skilled trades workers. Yours to keep no matter where you work.
- link "Start building your record":
  - /url: /auth/sign-up
  - text: Start building your record
  - img
- link "See how it works":
  - /url: "#how-it-works"
- list:
  - listitem: Recognised by Alberta apprenticeship boards
  - listitem: Built on the Open Badges standard
  - listitem: Your data. Your privacy. Canadian servers.
- text: 12 Red Seal trades ∞ Career portability 🇨🇦 Canadian servers
- heading "Built for the way trades actually work" [level=2]
- img
- heading "Your logbook. Forever." [level=3]
- paragraph: Every job, every ticket, every skill — all in one place that belongs to you. Not your employer. You.
- img
- heading "Credentials that travel with you." [level=3]
- paragraph: Move between contractors without losing your record. Share a verified credential with any employer, anywhere.
- img
- heading "Learn from the best in the trade." [level=3]
- paragraph: Connect with journeypersons and masters who have earned the right to teach — not just claimed it.
- heading "Ready to own your record?" [level=2]
- paragraph: Free to join. No employer required.
- link "Create your free account":
  - /url: /auth/sign-up
  - text: Create your free account
  - img
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Onboarding Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Start at landing page
  6  |     await page.goto('http://localhost:3000')
  7  |   })
  8  | 
  9  |   test('Complete full onboarding flow (role → trade → tutorial → profile → first-contribution)', async ({
  10 |     page,
  11 |   }) => {
  12 |     // Step 1: Navigate to sign-in
  13 |     await page.click('text=Sign In')
> 14 |     await expect(page).toHaveURL('/auth/sign-in')
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  15 | 
  16 |     // Step 2: Create new test user
  17 |     await page.click('button:has-text("Create new test user")')
  18 |     await expect(page).toHaveURL('/onboarding/role')
  19 | 
  20 |     // Step 3: Select role (Tradesperson)
  21 |     await page.click('button:has-text("Tradesperson")')
  22 |     await page.click('button:has-text("Continue")')
  23 |     await expect(page).toHaveURL('/onboarding/trade')
  24 | 
  25 |     // Step 4: Select trade (Electrician)
  26 |     await page.selectOption('select', { label: 'Electrician (Construction)' })
  27 |     await page.click('button:has-text("Continue")')
  28 |     await expect(page).toHaveURL('/onboarding/tutorial')
  29 | 
  30 |     // Step 5: Complete tutorial intro screens
  31 |     await page.click('button:has-text("Got it")')
  32 |     await page.click('button:has-text("Got it")')
  33 | 
  34 |     // Step 6: Submit first contribution in tutorial
  35 |     await page.fill('textarea', 'Wire should be pulled carefully through conduit')
  36 |     await page.click('button:has-text("Submit my answer")')
  37 |     await expect(page.locator('text=First contribution earned')).toBeVisible()
  38 | 
  39 |     // Step 7: Proceed to profile setup
  40 |     await page.click('button:has-text("Finish setup")')
  41 |     await expect(page).toHaveURL('/onboarding/profile')
  42 | 
  43 |     // Step 8: Fill profile
  44 |     await page.fill('input[name="displayName"]', 'Test Electrician')
  45 |     await page.fill('textarea[name="bio"]', 'I am a skilled electrician with 5 years of experience')
  46 |     await page.click('button:has-text("Continue")')
  47 |     await expect(page).toHaveURL('/onboarding/first-contribution')
  48 | 
  49 |     // Step 9: Submit first contribution
  50 |     await page.click('button:has-text("Post")')
  51 |     await page.fill('input[name="title"]', 'Residential Wiring Best Practices')
  52 |     await page.fill(
  53 |       'textarea[name="body]',
  54 |       'Always test circuits before touching. Use proper grounding. Follow local code.'
  55 |     )
  56 |     await page.click('button:has-text("Submit")')
  57 | 
  58 |     // Step 10: Reach success page
  59 |     await expect(page).toHaveURL('/onboarding/success')
  60 |     await expect(page.locator('text=You\'re ready')).toBeVisible()
  61 |     await expect(page.locator('text=First credential is being issued')).toBeVisible()
  62 |   })
  63 | 
  64 |   test('User cannot access onboarding without signing in', async ({ page }) => {
  65 |     // Try to access onboarding directly
  66 |     await page.goto('http://localhost:3000/onboarding/role')
  67 | 
  68 |     // Should redirect to sign-in
  69 |     await expect(page).toHaveURL('/auth/sign-in')
  70 |   })
  71 | 
  72 |   test('Can resume existing user from sign-in page', async ({ page }) => {
  73 |     // Create a user first
  74 |     await page.click('text=Sign In')
  75 |     const userId = await page.evaluate(() => {
  76 |       const cookie = document.cookie
  77 |         .split('; ')
  78 |         .find(row => row.startsWith('dev-user-id='))
  79 |       return cookie?.split('=')[1]
  80 |     })
  81 | 
  82 |     // Go back to sign-in
  83 |     await page.goto('http://localhost:3000/auth/sign-in')
  84 | 
  85 |     // Should see the user in recent users list
  86 |     await expect(page.locator(`button:has-text("${userId}")`)).toBeVisible()
  87 |   })
  88 | })
  89 | 
```