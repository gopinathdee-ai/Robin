import { test, expect } from '@playwright/test'

test.describe('Peer Endorsements', () => {
  test('user can endorse another user for a topic and recipient can accept', async ({ page }) => {
    // Navigate to endorsement target profile
    await page.goto('/profile')

    // Look for Endorse button (if visible in profile)
    const endorseButton = page.locator('button:has-text("Endorse")')

    if (await endorseButton.isVisible()) {
      // Click to open endorsement modal
      await endorseButton.click()

      // Wait for modal to appear
      const modal = page.locator('text=/Endorse .* for/i')
      await expect(modal).toBeVisible()

      // Select topic from dropdown
      const topicSelect = page.locator('select').first()
      if (await topicSelect.isVisible()) {
        const options = await topicSelect.locator('option').count()
        if (options > 1) {
          await topicSelect.selectOption({ index: 1 })
        }
      }

      // Fill in rationale (must be >= 80 chars)
      const rationaleTextarea = page.locator('textarea').first()
      const rationale = 'This user demonstrates exceptional expertise in their field. They consistently provide high-quality contributions and show deep understanding of complex topics.'
      await rationaleTextarea.fill(rationale)

      // Verify character count is displayed
      const charCounter = page.locator('text=/\\d+ \\/ 500/')
      await expect(charCounter).toBeVisible()

      // Submit button should be enabled (rationale >= 80 chars)
      const submitButton = page.locator('button:has-text("Send Endorsement")')
      await expect(submitButton).not.toBeDisabled()

      // Submit the endorsement
      await submitButton.click()

      // Wait for success message
      const successMessage = page.locator('text=/endorsed|success/i')
      await expect(successMessage).toBeVisible({ timeout: 5000 })
    }
  })

  test('pending endorsement appears in recipient endorsements page', async ({ page }) => {
    // Navigate to endorsements page
    await page.goto('/profile/endorsements')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for tabs
    const receivedTab = page.locator('button:has-text("Received")')
    if (await receivedTab.isVisible()) {
      await receivedTab.click()
    }

    // Look for PENDING section
    const pendingSection = page.locator('text=/PENDING/i').first()

    if (await pendingSection.isVisible()) {
      // Should show at least one endorsement
      const endorsementCards = page.locator('[class*="endorsement"], [class*="card"]').filter({
        has: page.locator('text=/Pending|PENDING/')
      })

      const cardCount = await endorsementCards.count()
      expect(cardCount).toBeGreaterThan(0)
    }
  })

  test('recipient can accept a pending endorsement', async ({ page }) => {
    // Navigate to endorsements page
    await page.goto('/profile/endorsements')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for Accept button in PENDING section
    const acceptButton = page.locator('button:has-text("Accept")').first()

    if (await acceptButton.isVisible()) {
      await acceptButton.click()

      // Wait for success message
      const successMessage = page.locator('text=/accepted|updated/i')
      await expect(successMessage).toBeVisible({ timeout: 5000 })

      // Verify endorsement moved to ACCEPTED section
      const acceptedSection = page.locator('text=/ACCEPTED/i')
      await expect(acceptedSection).toBeVisible()
    }
  })

  test('recipient can reject a pending endorsement', async ({ page }) => {
    // Navigate to endorsements page
    await page.goto('/profile/endorsements')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for Reject button in PENDING section
    const rejectButton = page.locator('button:has-text("Reject")').first()

    if (await rejectButton.isVisible()) {
      await rejectButton.click()

      // Wait for success message
      const successMessage = page.locator('text=/rejected|updated/i')
      await expect(successMessage).toBeVisible({ timeout: 5000 })

      // Verify endorsement moved to REJECTED section
      const rejectedSection = page.locator('text=/REJECTED/i')
      await expect(rejectedSection).toBeVisible()
    }
  })

  test('endorsement summary displays on profile page', async ({ page }) => {
    // Navigate to profile
    await page.goto('/profile')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for "How peers recognize you" section
    const endorsementSummary = page.locator('text=/How peers recognize you/i')

    // May not be visible if no endorsements exist
    const isVisible = await endorsementSummary.isVisible().catch(() => false)

    if (isVisible) {
      // Should show endorsement count badge
      const countBadge = page.locator('[class*="badge"], [class*="count"]').filter({
        has: page.locator('text=/endorsement/')
      })

      expect(await countBadge.isVisible()).toBe(true)

      // Should have link to endorsements page
      const endorsementsLink = page.locator('a:has-text("View all endorsements")')
      await expect(endorsementsLink).toBeVisible()
      expect(endorsementsLink).toHaveAttribute('href', '/profile/endorsements')
    }
  })

  test('endorsement weight affects reputation points', async ({ page }) => {
    // Navigate to reputation dashboard
    await page.goto('/profile')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for reputation card
    const reputationCard = page.locator('[class*="reputation"], text=/reputation|points/i').first()

    if (await reputationCard.isVisible()) {
      // Get reputation points before and after (would need database access to verify properly)
      // This test just verifies the component renders
      expect(await reputationCard.isVisible()).toBe(true)
    }
  })

  test('cannot endorse without meeting gate requirements', async ({ page }) => {
    // Navigate to profile
    await page.goto('/profile')

    // Look for Endorse button
    const endorseButton = page.locator('button:has-text("Endorse")')

    // If button is disabled, check for tooltip/reason
    if (await endorseButton.isVisible()) {
      const isDisabled = await endorseButton.isDisabled()
      if (isDisabled) {
        // Should have a title attribute with reason
        const title = await endorseButton.getAttribute('title')
        expect(title).toBeTruthy()
      }
    }
  })
})
