# TDD Implementation Roadmap

## Overview
Complete breakdown of all modules in the Robin platform that need Test-Driven Development (TDD) implementation, organized by phase and business priority.

---

## Phase 1: Knowledge Community & Onboarding (MVP) ✅ PARTIALLY DONE

### 8.1 Onboarding & Identity
**Status:** ✅ Implemented (code exists)
**TDD Status:** 🔴 Tests written (17 test cases in `e2e/onboarding.spec.ts`)
**Action:** Run tests to validate existing implementation

- [x] Role selection (apprentice, journeyperson, master, employer)
- [x] Trade & specialisation picker (Red Seal trades seeded)
- [x] Gamified three-step tutorial with trades hierarchy language
- [x] Profile setup (name, years experience, employer, province, union local)
- [x] Optional credential import (Red Seal ticket, safety tickets)
- [x] First contribution as onboarding action
- [x] First credential issued immediately upon completion

**Test Coverage:** 17 test cases across 6 test suites
**Next Step:** Run `pnpm test:e2e -- onboarding.spec.ts`

---

### 8.2 Knowledge Community (Q&A-First)
**Status:** ⚠️ Partially implemented (components exist, needs validation)
**TDD Status:** 🔴 Tests written (30+ test cases in `e2e/community.spec.ts`)
**Action:** Run tests and fix failing features

#### Core Features (All with Components):
- [x] Content feed (chronological + algorithmic)
- [x] Ask a question (trade, topic, title, body)
- [x] Answer a question (rich text, formatting)
- [x] Post knowledge (shorter form content)
- [x] Upvote / downvote on content
- [x] Content detail view (full thread)
- [x] Topic / tag browse
- [x] Full-text search
- [x] Saved content / bookmarks

#### AI Screening:
- [x] AI quality scoring (Claude Haiku-powered)
- [x] Content status (pending_review, published, flagged)
- [x] Quality badges (High Quality, Good Quality)

**Test Coverage:** 30+ test cases across 8 test suites (Browse, Ask, Post, Answer, Search, Filter, Vote, Bookmark, Quality)
**Next Step:** Run `pnpm test:e2e -- community.spec.ts`

---

### 8.3 Reputation Foundation
**Status:** 🟡 Partially implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Need comprehensive test suite for reputation system

#### Features Needing Tests:
- [ ] Personal reputation dashboard (score breakdown, tiers)
- [ ] Reputation events log (immutable audit trail)
- [ ] Peer endorsement system (verified users only)
- [ ] Endorsement rationale requirement (min 80 chars)
- [ ] Mentor eligibility threshold (750 points)
- [ ] Reputation score calculation

**Estimated Test Cases:** 25-30
**Priority:** High (directly impacts engagement loops)
**Modules:**
- Reputation Dashboard (Page)
- Endorsement Management (Modal/Form)
- Leaderboard (Already has page, needs tests)
- Reputation Events (API + display)

---

## Phase 2: Mentorship & Institutional Features

### Mentorship System
**Status:** ❌ Not implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Full TDD from scratch

#### Features Needing Tests:
- [ ] Mentor tier unlocking (750+ points)
- [ ] Mentor browse/search (by trade, location, availability)
- [ ] Mentorship request form (goals, commitment)
- [ ] Request acceptance/decline workflow
- [ ] Active mentorship dashboard
- [ ] Mentorship milestones & progress
- [ ] Mentorship reviews (post-completion, visible)

**Estimated Test Cases:** 35-40
**Priority:** High (Phase 2 core feature)
**Modules:**
- Mentor Dashboard (New Page)
- Mentor Browse/Search (New Page)
- Mentorship Request Form (New Component)
- Mentorship Management (New Page)
- Mentorship Reviews (New Component)

---

### Credential & Wallet System
**Status:** ⚠️ Partially implemented (credential cards exist)
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Tests for credential validation and wallet

#### Features Needing Tests:
- [ ] Open Badge credential issuance (cryptographically signed)
- [ ] Credential wallet display
- [ ] PDF export of credentials
- [ ] Open Badge JSON export
- [ ] QR code generation/sharing
- [ ] Credential verification
- [ ] Credential revocation

**Estimated Test Cases:** 20-25
**Priority:** High (credentialing is core)
**Modules:**
- Credential Wallet (Page) - mostly done
- Credential Upload (Component) - mostly done
- Credential Export (Feature)
- Verification Link (API + Feature)

---

### Institutional Dashboards (Union Coordinator)
**Status:** ❌ Not implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Full TDD for union features

#### Features Needing Tests:
- [ ] Union coordinator login/auth
- [ ] Member directory (searchable, filterable)
- [ ] Mentorship program management
- [ ] Member performance analytics
- [ ] Bulk operations (invite, activate, manage)
- [ ] Union-specific branding

**Estimated Test Cases:** 30-35
**Priority:** Medium (depends on sales)
**Modules:**
- Coordinator Dashboard (New Page)
- Member Directory (New Page)
- Program Management (New Page)
- Analytics (New Page)

---

### Institutional Dashboards (Employer)
**Status:** ❌ Not implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Full TDD for employer features

#### Features Needing Tests:
- [ ] Employer login/auth
- [ ] Workforce credential visibility
- [ ] Skills gap analysis
- [ ] Training recommendations
- [ ] Employee onboarding management

**Estimated Test Cases:** 25-30
**Priority:** Medium (depends on sales)
**Modules:**
- Employer Dashboard (New Page)
- Workforce Analytics (New Page)
- Skills Gap Analysis (New Page)

---

## Phase 3: Scale & Ecosystem

### Training Marketplace
**Status:** ❌ Not implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Full TDD for marketplace

#### Features Needing Tests:
- [ ] Course discovery/search
- [ ] Provider integration
- [ ] Course booking/enrollment
- [ ] Completion tracking
- [ ] Credential import from courses

**Estimated Test Cases:** 30-35
**Priority:** Low (Phase 3)

---

### Advanced Institutional Features
**Status:** ❌ Not implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Full TDD for job posting, advanced analytics

#### Features Needing Tests:
- [ ] Job posting (for employers)
- [ ] Job browsing/search (for trades workers)
- [ ] Job application workflow
- [ ] Advanced analytics/reporting
- [ ] Bulk operations

**Estimated Test Cases:** 35-40
**Priority:** Low (Phase 3)

---

## Cross-Cutting Features (All Phases)

### Authentication & Authorization
**Status:** ⚠️ Partially implemented (Auth0 stub + dev mode)
**TDD Status:** 🔴 Basic tests in onboarding
**Action:** ENHANCE - Comprehensive auth flow tests

#### Features Needing Tests:
- [ ] Sign up flow
- [ ] Sign in flow
- [ ] Password reset
- [ ] Auth0 integration
- [ ] Dev mode authentication (cookie-based)
- [ ] Protected routes
- [ ] Role-based access control

**Estimated Test Cases:** 20-25
**Priority:** Critical (foundational)
**Modules:**
- Auth Routes (already exist)
- Auth Middleware (already exists)

---

### User Profile & Settings
**Status:** ⚠️ Partially implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Tests for profile and settings

#### Features Needing Tests:
- [ ] Profile edit (name, bio, photo, etc.)
- [ ] Trade & specialisation management
- [ ] Notification preferences
- [ ] Privacy settings
- [ ] Account deletion

**Estimated Test Cases:** 20-25
**Priority:** High (user engagement)
**Modules:**
- Profile Edit (Page exists, needs tests)
- Notification Preferences (Page exists, needs tests)
- Settings (Need to create)

---

### Search & Discovery
**Status:** ⚠️ Partially implemented (Algolia integration planned)
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Full-text search tests

#### Features Needing Tests:
- [ ] Content search (Q&A, posts)
- [ ] Mentor search
- [ ] Course search (Phase 3)
- [ ] Job search (Phase 3)
- [ ] Filter & sort
- [ ] Saved searches

**Estimated Test Cases:** 25-30
**Priority:** High (user engagement)
**Modules:**
- Search API
- Search Components (reusable)
- Search Results Pages

---

### Notifications & Engagement
**Status:** ❌ Not implemented
**TDD Status:** ❌ No tests yet
**Action:** CREATE - Notification system tests

#### Features Needing Tests:
- [ ] Real-time notifications (upvotes, answers, endorsements)
- [ ] Notification preferences
- [ ] Mobile push notifications
- [ ] Email digest
- [ ] Notification badge/bell

**Estimated Test Cases:** 25-30
**Priority:** High (engagement loop dependency)
**Modules:**
- Notification Service (API)
- Notification UI (Component)
- Push Service (Integration)

---

## Summary: TDD Implementation Checklist

### ✅ Already Have Tests (Ready to Validate)
- [x] Onboarding Module (17 tests)
- [x] Community Page (30+ tests)

### 🔴 Need Tests - High Priority (Phase 1)
- [ ] Reputation Foundation (25-30 tests)
- [ ] Authentication & Authorization (20-25 tests)
- [ ] Search & Discovery (25-30 tests)
- [ ] Notifications & Engagement (25-30 tests)
- [ ] User Profile & Settings (20-25 tests)

### 🟡 Need Tests - Medium Priority (Phase 2)
- [ ] Mentorship System (35-40 tests)
- [ ] Credential & Wallet (20-25 tests)
- [ ] Union Coordinator Dashboard (30-35 tests)
- [ ] Employer Dashboard (25-30 tests)

### ⚫ Need Tests - Low Priority (Phase 3+)
- [ ] Training Marketplace (30-35 tests)
- [ ] Advanced Institutional Features (35-40 tests)
- [ ] Additional Trades Onboarding (Reuse Onboarding Tests)

---

## Total Test Coverage Estimate

| Phase | Module | Tests | Status |
|-------|--------|-------|--------|
| **Phase 1** | Onboarding | 17 | ✅ Done |
| **Phase 1** | Community Page | 30+ | ✅ Done |
| **Phase 1** | Reputation | 25-30 | ❌ TODO |
| **Phase 1** | Auth | 20-25 | ❌ TODO |
| **Phase 1** | Search | 25-30 | ❌ TODO |
| **Phase 1** | Notifications | 25-30 | ❌ TODO |
| **Phase 1** | Profile/Settings | 20-25 | ❌ TODO |
| **Phase 2** | Mentorship | 35-40 | ❌ TODO |
| **Phase 2** | Credentials | 20-25 | ❌ TODO |
| **Phase 2** | Union Dashboard | 30-35 | ❌ TODO |
| **Phase 2** | Employer Dashboard | 25-30 | ❌ TODO |
| **Phase 3** | Marketplace | 30-35 | ❌ TODO |
| **Phase 3** | Advanced Features | 35-40 | ❌ TODO |
| **TOTAL** | | **380-420 tests** | 15% Done |

---

## Recommended TDD Order (Dependency-First)

1. **Auth & Authorization** (foundation for all other tests)
2. **User Profile & Settings** (user data management)
3. **Reputation Foundation** (enables engagement loops)
4. **Notifications & Engagement** (keeps users returning)
5. **Search & Discovery** (improves content discoverability)
6. **Mentorship System** (Phase 2 critical path)
7. **Credentials & Wallet** (Phase 2 critical path)
8. **Institutional Dashboards** (sales enablement)
9. **Training Marketplace** (Phase 3)
10. **Advanced Features** (Phase 3)

---

## Running Tests

```bash
# Run specific module tests
pnpm test:e2e -- onboarding.spec.ts
pnpm test:e2e -- community.spec.ts

# Run all E2E tests
pnpm test:e2e

# Interactive UI mode for debugging
pnpm test:e2e -- --ui

# Single browser (faster iteration)
pnpm test:e2e -- --project=chromium

# Against deployed instance
TEST_URL=https://robin-git-dev-gopinathdee.vercel.app pnpm test:e2e
```

---

## Notes

- All estimates are for comprehensive E2E test coverage (not unit tests)
- Each module test suite includes happy path, error handling, and edge cases
- Tests follow existing pattern: Playwright-based, real browser interactions
- Integration tests validate API calls + UI behavior together
- Estimated 2-3 hours per 20-25 test cases for implementation
