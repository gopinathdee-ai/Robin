# Sprint 1 Implementation Tracker
**Duration:** Weeks 1-2 (6 weeks from start, this is weeks 1-2)
**Status:** In Progress
**Last Updated:** 2026-05-17

---

## Deliverables Overview

### 1.1 Onboarding Flow: Wire API Calls

| File | Task | Status | Notes |
|------|------|--------|-------|
| `apps/web/app/onboarding/role/page.tsx` | Wire PATCH /api/users/me for role | ⏳ Pending | Replace TODO with actual API call |
| `apps/web/app/onboarding/trade/page.tsx` | Create new trade selector page | ⏳ Pending | Fetch GET /api/trades, POST /api/users/me |
| `apps/web/app/onboarding/tutorial/page.tsx` | Wire tutorial completion | ⏳ Pending | PATCH /api/users/me { onboardingStep: 3 } |
| `apps/web/app/onboarding/profile/page.tsx` | Wire profile form submission | ⏳ Pending | PATCH /api/users/me with displayName, yearsExperience, etc. |
| `apps/web/app/onboarding/first-contribution/page.tsx` | Create first-contribution page | ⏳ Pending | POST /api/content { type, tradeId, topicId, title, body } |

### 1.2 Onboarding Flow Structure

| File | Task | Status | Notes |
|------|------|--------|-------|
| `apps/web/app/onboarding/layout.tsx` | Create onboarding wrapper layout | ⏳ Pending | Progress bar, back button, step indicators |
| `apps/web/app/onboarding/success/page.tsx` | Create success page after first contribution | ⏳ Pending | Congratulations message, credential preview, CTA |

### 1.3 Onboarding Status Tracking

| File | Task | Status | Notes |
|------|------|--------|-------|
| `apps/web/lib/auth.ts` | Add `requireOnboardingCompletion()` helper | ⏳ Pending | Check onboarding_step, redirect if incomplete |
| `apps/web/middleware.ts` | Add onboarding redirect logic | ⏳ Pending | Redirect unauthenticated to /auth/sign-in |

### 1.4 Component Library

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| OnboardingProgressBar | `components/onboarding/OnboardingProgressBar.tsx` | ⏳ Pending | Shows current step 1/5, 2/5, etc. |
| TradeSelector | `components/onboarding/TradeSelector.tsx` | ⏳ Pending | Dropdown or card grid for trade selection |
| SpecialisationSelector | `components/onboarding/SpecialisationSelector.tsx` | ⏳ Pending | Multi-select checkboxes for specialisations |
| FirstContributionForm | `components/forms/FirstContributionForm.tsx` | ⏳ Pending | Type selector, title, body, submit |
| FormInput | `components/ui/FormInput.tsx` | ⏳ Pending | Generic text input with validation |
| FormSelect | `components/ui/FormSelect.tsx` | ⏳ Pending | Generic dropdown select |

---

## Automated Testing (35 Tests Total)

### Unit Tests (10 tests)

| Test Suite | Task | Status | Count |
|-----------|------|--------|-------|
| `lib/__tests__/zod-schemas.test.ts` | Test all Zod schemas (onboarding, content, credentials) | ⏳ Pending | 5 tests |
| `hooks/__tests__/useOnboarding.test.ts` | Test useOnboarding hook state management | ⏳ Pending | 5 tests |

### Component Tests (12 tests)

| Test Suite | Task | Status | Count |
|-----------|------|--------|-------|
| `components/onboarding/__tests__/RoleSelector.test.tsx` | Role selection, button clicks | ⏳ Pending | 3 tests |
| `components/onboarding/__tests__/TradeSelector.test.tsx` | Trade/specialisation dropdown interaction | ⏳ Pending | 3 tests |
| `app/onboarding/profile/__tests__/page.test.tsx` | Form inputs, validation feedback | ⏳ Pending | 3 tests |
| `components/onboarding/__tests__/OnboardingProgressBar.test.tsx` | Progress bar rendering | ⏳ Pending | 3 tests |

### Integration Tests (10 tests)

| Test Suite | Task | Status | Count |
|-----------|------|--------|-------|
| `app/api/users/me/__tests__/route.test.ts` | GET /api/users/me, PATCH /api/users/me | ⏳ Pending | 3 tests |
| `app/api/users/me/trades/__tests__/route.test.ts` | POST /api/users/me/trades | ⏳ Pending | 2 tests |
| `app/api/content/__tests__/route.test.ts` | POST /api/content (first contribution) | ⏳ Pending | 3 tests |
| `app/api/trades/__tests__/route.test.ts` | GET /api/trades, GET /api/trades/:id/specialisations | ⏳ Pending | 2 tests |

### E2E Tests (3 tests)

| Test Suite | Task | Status | Count |
|-----------|------|--------|-------|
| `e2e/onboarding.spec.ts` | Complete onboarding flow (role → trade → profile → first-contribution → success) | ⏳ Pending | 2 tests |
| `e2e/onboarding.spec.ts` | Form validation prevents empty submission | ⏳ Pending | 1 test |

---

## Test Infrastructure Setup

| Task | Status | Notes |
|------|--------|-------|
| Create `vitest.config.ts` | ⏳ Pending | Unit + component test config |
| Create `playwright.config.ts` | ⏳ Pending | E2E test config |
| Create `lib/__tests__/test-helpers.ts` | ⏳ Pending | Database setup, seeding, cleanup utilities |
| Install test dependencies in package.json | ⏳ Pending | vitest, @testing-library/react, playwright, msw |

---

## Database Verification

| Task | Status | Notes |
|------|--------|-------|
| Verify User table has required fields (onboardingStep, accountStatus, displayName, etc.) | ✅ Complete | Schema confirmed in previous sprint |
| Run `pnpm db:migrate` to apply any pending migrations | ⏳ Pending | Check if migrations needed |
| Verify trades, specialisations, topics are seeded | ✅ Complete | Already seeded in previous sprint |

---

## API Verification

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/health` | GET | ✅ Verified | Returns { status: 'ok' } |
| `/api/trades` | GET | ✅ Verified | Returns array of trades |
| `/api/trades/[id]/specialisations` | GET | ✅ Verified | Works correctly |
| `/api/trades/[id]/topics` | GET | ✅ Verified | Works correctly |
| `/api/users/me` | GET | ✅ Verified | Works with x-dev-user-id header |
| `/api/users/me` | PATCH | ✅ Verified | Accepts user profile updates |
| `/api/users/me/trades` | POST | ✅ Verified | Adds trade to user |
| `/api/content` | POST | ✅ Verified | Returns 202 Accepted, fires async screening |
| `/api/content/[id]` | GET | ✅ Verified | Returns content with full data |

---

## Deployment Readiness Checklist

| Task | Status |
|------|--------|
| All onboarding pages compile without TypeScript errors | ⏳ Pending |
| `pnpm typecheck` passes | ⏳ Pending |
| `pnpm build` succeeds | ⏳ Pending |
| `pnpm dev` starts without errors | ⏳ Pending |
| No console warnings in browser dev tools | ⏳ Pending |
| No network errors in Network tab | ⏳ Pending |

---

## Sprint 1 Acceptance Criteria

- [ ] User can sign up → complete all 5 onboarding steps → reach dashboard
- [ ] First contribution posted successfully (POST `/api/content` returns 202)
- [ ] User marked as `active` in database after completion
- [ ] All 5 onboarding pages mobile-optimized (44px min tap targets)
- [ ] Form validation prevents invalid submissions
- [ ] Error handling shows clear user-facing messages
- [ ] `pnpm typecheck` and `pnpm build` pass with 0 errors
- [ ] Tested on mobile browser (iOS Safari, Chrome Android)
- [ ] All 35 tests written and passing (10 unit + 12 component + 10 integration + 3 E2E)
- [ ] Code coverage >75% on new code

---

## Known Blockers / Issues

(None currently identified)

---

## Notes

- Test infrastructure must be set up first (vitest, playwright, test-helpers)
- Components and API wiring should be built in parallel
- Tests written daily as features ship, not retroactively
- Manual testing on mobile (iPhone SE or Android) before sign-off
- All form validations use Zod schemas for consistency

