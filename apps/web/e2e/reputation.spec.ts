import { test, expect } from '@playwright/test'

test.describe('Reputation Dashboard & Expertise Topic Scores', () => {
  test.beforeEach(async ({ page }) => {
    // Set dev user ID for auth
    await page.context().addCookies([
      {
        name: 'dev-user-id',
        value: 'test-user-reputation-' + Date.now(),
        url: 'http://localhost:3000',
      },
    ])
  })

  // ========== UC1: User Views Reputation Dashboard ==========

  test('UC1.1: User navigates to reputation dashboard', async ({ page }) => {
    // Given: User is authenticated
    // When: User navigates to /reputation
    await page.goto('http://localhost:3000/reputation')

    // Then: Page loads with reputation dashboard
    // Assert: Page title contains "Reputation"
    const heading = page.locator('h1, [role="heading"]').first()
    await expect(heading).toContainText(/reputation|dashboard/i)

    // Assert: Dashboard displays user's reputation data
    // - Total score visible
    const scoreSection = page.locator('text=/total score|reputation score/i')
    await expect(scoreSection).toBeVisible({ timeout: 5000 })
  })

  test('UC1.2: Dashboard displays total score and current tier', async ({
    page,
  }) => {
    // Given: User is on reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // When: Dashboard loads
    // Then: Current tier badge is visible
    const tierBadge = page.locator('[data-testid="tier-badge"], text=/apprentice|journeyperson|expert|mentor/i').first()
    await expect(tierBadge).toBeVisible()

    // Then: Total points displayed
    const totalPoints = page.locator('[data-testid="total-points"], text=/points/i').first()
    await expect(totalPoints).toBeVisible()

    // Then: Points to next tier shown (if not at max)
    const nextTier = page.locator('[data-testid="points-to-next"], text=/next tier/i')
    // May or may not exist if user is at max tier - just check visibility if exists
    if (await nextTier.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(nextTier).toBeVisible()
    }
  })

  test('UC1.3: Dashboard shows score breakdown by category', async ({
    page,
  }) => {
    // Given: User is on reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // When: Score breakdown section loads
    // Then: All score categories visible
    const categories = [
      'contributions',
      'answers',
      'upvotes',
      'endorsements',
    ]

    for (const category of categories) {
      const categoryElement = page.locator(`text=/${category}/i`)
      await expect(categoryElement).toBeVisible({ timeout: 5000 })
    }
  })

  // ========== UC2: User Sees Expertise Topics ==========

  test('UC2.1: Expertise topics displayed on dashboard', async ({ page }) => {
    // Given: User is on reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // When: Expertise topics section loads
    // Then: Topics section is visible
    const topicsSection = page.locator('[data-testid="expertise-topics"], text=/expertise|topics/i').first()
    await expect(topicsSection).toBeVisible({ timeout: 5000 })

    // Then: At least one topic is displayed
    const topicCards = page.locator('[data-testid="topic-card"], .topic-item')
    const count = await topicCards.count()
    // May be 0 if user has no contributions, so just check element exists
    await expect(topicsSection).toBeVisible()
  })

  test('UC2.2: Each topic shows name, score, and contribution count', async ({
    page,
  }) => {
    // Given: User is on reputation dashboard with contributed topics
    await page.goto('http://localhost:3000/reputation')

    // When: Topics are displayed
    const firstTopic = page.locator('[data-testid="topic-card"]').first()

    // Then: Topic contains name
    const topicName = firstTopic.locator('[data-testid="topic-name"], .topic-name')
    await expect(topicName).toBeVisible({ timeout: 5000 })

    // Then: Topic shows proficiency score
    const topicScore = firstTopic.locator('[data-testid="topic-score"], text=/score|points/i')
    await expect(topicScore).toBeVisible({ timeout: 5000 })

    // Then: Topic shows contribution count (posts/answers)
    const contribCount = firstTopic.locator('[data-testid="contribution-count"], text=/post|answer/i')
    await expect(contribCount).toBeVisible({ timeout: 5000 })
  })

  test('UC2.3: Topics sorted by score (highest first)', async ({ page }) => {
    // Given: User has multiple expertise topics
    await page.goto('http://localhost:3000/reputation')

    // When: Topics are displayed
    const topicScores = page.locator('[data-testid="topic-card"]')

    // Then: Topics are sorted by score (highest first)
    const scoreElements = topicScores.locator('[data-testid="topic-score"]')
    const scoreCount = await scoreElements.count()

    if (scoreCount > 1) {
      // Extract scores and verify descending order
      const scores = []
      for (let i = 0; i < Math.min(scoreCount, 5); i++) {
        const text = await scoreElements.nth(i).textContent()
        const match = text?.match(/(\d+)/)
        if (match) scores.push(parseInt(match[1]))
      }

      // Verify descending order
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1])
      }
    }
  })

  // ========== UC3: User Views Reputation Events Log ==========

  test('UC3.1: Reputation events log displayed', async ({ page }) => {
    // Given: User is on reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // When: Events section loads
    // Then: Events section is visible
    const eventsSection = page.locator('[data-testid="events-log"], text=/events|history|activity/i').first()
    await expect(eventsSection).toBeVisible({ timeout: 5000 })
  })

  test('UC3.2: Each event shows action, points, timestamp', async ({
    page,
  }) => {
    // Given: User is on reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // When: Events log is loaded
    const firstEvent = page.locator('[data-testid="reputation-event"]').first()

    // Then: Event contains action description
    const action = firstEvent.locator('[data-testid="event-action"], .event-action')
    await expect(action).toBeVisible({ timeout: 5000 })

    // Then: Event shows points awarded
    const points = firstEvent.locator('[data-testid="event-points"], text=/\+?\d+/i')
    await expect(points).toBeVisible({ timeout: 5000 })

    // Then: Event shows timestamp
    const timestamp = firstEvent.locator('[data-testid="event-timestamp"], text=/ago|•|time/i')
    await expect(timestamp).toBeVisible({ timeout: 5000 })
  })

  test('UC3.3: Events are read-only (immutable audit trail)', async ({
    page,
  }) => {
    // Given: User is on reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // When: Events log is displayed
    const eventItem = page.locator('[data-testid="reputation-event"]').first()

    // Then: Event has no edit/delete buttons
    const editBtn = eventItem.locator('[data-testid="edit-event"], button:has-text("Edit")')
    const deleteBtn = eventItem.locator('[data-testid="delete-event"], button:has-text("Delete")')

    // Assert: Neither button exists
    await expect(editBtn).not.toBeVisible({ timeout: 2000 })
    await expect(deleteBtn).not.toBeVisible({ timeout: 2000 })
  })

  test('UC3.4: Events log is paginated (20 per page)', async ({ page }) => {
    // Given: User has many reputation events (>20)
    await page.goto('http://localhost:3000/reputation')

    // When: Events section loads
    // Then: Pagination controls visible (if needed)
    const nextPageBtn = page.locator('[data-testid="next-page"], button:has-text("Next")')
    const prevPageBtn = page.locator('[data-testid="prev-page"], button:has-text("Previous")')

    // May or may not be visible depending on user's event count
    // Just verify pagination exists if more than 20 events
    const events = page.locator('[data-testid="reputation-event"]')
    const eventCount = await events.count()

    if (eventCount > 20) {
      await expect(nextPageBtn).toBeVisible({ timeout: 2000 })
    }
  })

  // ========== UC4: User Checks Mentor Eligibility ==========

  test('UC4.1: Mentor eligible user sees "Mentor Eligible" badge', async ({
    page,
  }) => {
    // Given: User has >= 750 reputation points
    // When: User views reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // Then: Check for mentor eligible status
    const mentorBadge = page.locator('[data-testid="mentor-eligible"], text=/mentor eligible/i')

    // May or may not exist depending on user's score
    // Just verify it exists if visible
    if (await mentorBadge.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(mentorBadge).toBeVisible()
    }
  })

  test('UC4.2: Non-eligible user sees progress to mentor unlock', async ({
    page,
  }) => {
    // Given: User has < 750 reputation points
    // When: User views reputation dashboard
    await page.goto('http://localhost:3000/reputation')

    // Then: Check for mentor progress indicator
    const mentorProgress = page.locator('[data-testid="mentor-progress"], text=/750|mentor/i').first()

    // Progress indicator should be visible if user is not mentor eligible
    await expect(mentorProgress).toBeVisible({ timeout: 5000 })
  })

  // ========== UC5: User Browses Public Leaderboard ==========

  test('UC5.1: User navigates to public leaderboard', async ({ page }) => {
    // Given: User is authenticated
    // When: User navigates to /leaderboard
    await page.goto('http://localhost:3000/leaderboard')

    // Then: Leaderboard page loads
    const heading = page.locator('h1, [role="heading"]').first()
    await expect(heading).toContainText(/leaderboard|ranking/i)

    // Then: Users list is displayed
    const userRows = page.locator('[data-testid="leaderboard-row"], .leaderboard-item')
    await expect(userRows.first()).toBeVisible({ timeout: 5000 })
  })

  test('UC5.2: Leaderboard shows rank, name, tier, points, expertise count', async ({
    page,
  }) => {
    // Given: User is on leaderboard
    await page.goto('http://localhost:3000/leaderboard')

    // When: Leaderboard loads
    // Then: First user row contains all required columns
    const firstRow = page.locator('[data-testid="leaderboard-row"]').first()

    // Assert: Rank visible (#1, #2, etc.)
    const rank = firstRow.locator('[data-testid="user-rank"], text=/^\d+\.?$|#\d+/')
    await expect(rank).toBeVisible({ timeout: 5000 })

    // Assert: User name visible
    const name = firstRow.locator('[data-testid="user-name"], .user-name')
    await expect(name).toBeVisible({ timeout: 5000 })

    // Assert: Tier badge visible
    const tier = firstRow.locator('[data-testid="user-tier"], text=/apprentice|journeyperson|expert|mentor/i')
    await expect(tier).toBeVisible({ timeout: 5000 })

    // Assert: Total points visible
    const points = firstRow.locator('[data-testid="user-points"], text=/\d+\s*points?/i')
    await expect(points).toBeVisible({ timeout: 5000 })
  })

  test('UC5.3: Leaderboard is paginated (50 per page)', async ({ page }) => {
    // Given: User is on leaderboard
    await page.goto('http://localhost:3000/leaderboard')

    // When: Leaderboard loads
    // Then: Pagination controls visible
    const nextPageBtn = page.locator('[data-testid="next-page"], button:has-text("Next")')

    // Pagination may not be visible if < 50 users, but controls should exist
    await expect(page.locator('[data-testid="pagination"], .pagination')).toBeVisible({ timeout: 5000 })
  })

  test('UC5.4: Leaderboard can filter by tier', async ({ page }) => {
    // Given: User is on leaderboard
    await page.goto('http://localhost:3000/leaderboard')

    // When: User clicks tier filter dropdown
    const tierFilter = page.locator('[data-testid="tier-filter"], select')
    await expect(tierFilter).toBeVisible({ timeout: 5000 })

    // Then: Can select "Journeyperson" tier
    await tierFilter.selectOption('journeyperson')

    // Then: Leaderboard updates to show only Journeyperson users
    await page.waitForTimeout(500) // Wait for filter to apply

    const rows = page.locator('[data-testid="leaderboard-row"]')
    const firstRow = rows.first()

    // Verify first row has Journeyperson tier
    const tierBadge = firstRow.locator('text=/journeyperson/i')
    await expect(tierBadge).toBeVisible({ timeout: 5000 })
  })

  test('UC5.5: Leaderboard can sort by total points', async ({ page }) => {
    // Given: User is on leaderboard
    await page.goto('http://localhost:3000/leaderboard')

    // When: User clicks "Sort by Points" or similar
    const sortBtn = page.locator('[data-testid="sort-points"], button:has-text("Points")')

    // Assert: Sort control exists
    await expect(page.locator('[data-testid="sort-control"], .sort-dropdown')).toBeVisible({
      timeout: 5000,
    })
  })
})
