# Phase 1 MVP Implementation Roadmap

> **Document Status:** Sprint 5 Complete, Updated to MAY27 Requirements  
> **Current Phase:** Sprint 5 ✅ COMPLETE  
> **Next Phase:** Sprint 6 (Full Endorsement Management + Saved Content) — Ready to start  
> **Last Updated:** May 30, 2026  
> **Owner:** Development Team  
> **Note:** Updated to incorporate MAY27_BUSINESS_REQUIREMENTS.md (accepted answers, expertise topic scores, NOS taxonomy design, pre-build research)
>
> **Latest Progress:** 
> - ✅ Sprint 1: Onboarding + First Contribution complete
> - ✅ Sprint 2: Knowledge Community Feed complete
> - ✅ Sprint 3: Reputation Dashboard & Leaderboards complete
>   - `/dashboard` with reputation card, expertise topics, activity feed
>   - `/leaderboards/[trade]` with trade-specific rankings
>   - Real-time score polling (30 seconds configurable)
>   - 38+ tests covering reputation utilities, components, and API routes
> - ✅ Sprint 4: Credential Import + Notification Preferences complete
>   - `/profile/credentials` page with upload and management UI
>   - File upload with drag-drop and validation
>   - Credential listing grouped by status (verified, pending, rejected)
>   - Notification preferences form and onboarding integration
>   - 34 tests covering upload, storage, and credential display
> - ✅ Sprint 5: Peer Endorsement System complete
>   - `/api/endorsements` with weight calculation and anti-gaming framework
>   - Endorsement gate checks and reciprocal detection
>   - UI components: EndorseButton, EndorsementModal, EndorsementCard, EndorsementList, EndorsementSummary
>   - `/profile/endorsements` page with filtering, sorting, and accept/reject UI
>   - 23 tests (7 unit + 8 component + 7 integration + 1 E2E) all passing
> - 🚀 Ready to proceed with Sprint 6 (User Profiles + Mobile Polish)

---

## Executive Summary

This document outlines the **5-sprint implementation plan** to deliver Phase 1 MVP of the Trades Platform. The roadmap maps directly to business requirements (BUSINESS_REQUIREMENTS.md, Section 8).

**Phase 1 Goals:**
- 500+ daily active users in knowledge community
- 60%+ onboarding completion (through first contribution)
- <1% fraudulent credentials in audit
- 1 signed institutional partnership
- 200+ published posts/week
- 30%+ of resolved questions have an accepted answer
- Expertise topic scores visible and separate from overall reputation
- NOS taxonomy designed and validated (Phase 2 implementation readiness)

**Delivery:** Single Next.js app on port 3000 with consolidated API routes, featuring onboarding → Q&A → reputation loops.

---

## Pre-Build Research Requirements (Critical Path Blockers)

**Status:** ⏳ REQUIRED BEFORE PHASE 1 BUILD STARTS

The following research steps must be completed before development begins on Sprint 1. These steps define the expertise taxonomy and ensure Phase 1 features align with industry standards.

### Research Deliverables

| **Step** | **What** | **Owner** | **Blocks** | **Status** |
|---|---|---|---|---|
| Step 1 | Source NOS competency blocks for Electrician 309A from ESDC Canada | Product | Sprint 1 build | ⏳ Pending |
| Step 2 | Map NOS tasks to Robin expertise topics with tradesperson validation (5–8 interviews) | Product + Trades Expert | Sprint 1 build | ⏳ Pending |
| Step 3 | Define NOS block score targets per role tier (APPRENTICE/JOURNEYPERSON/MASTER) | Product + Data | Skill Mapping (Phase 2) | ⏳ Pending |
| Step 4 | Seed initial training resources per NOS block (NAIT, SAIT, BCIT, IBEW, exam prep) | Product | Skill Mapping (Phase 2) | ⏳ Pending |
| Step 5 | Validate expertise taxonomy with 5–8 real tradespeople in target market | Product + UX | Phase 1 accuracy | ⏳ Pending |
| Step 6 | Legal review of skill gap disclaimer language ("Robin does not certify; mirrors ESDC standards") | Legal | Skill Mapping (Phase 2) | ⏳ Pending |
| Step 7 | Expand NOS coverage to additional trades (Plumber, HVAC, Welder) | Product | Phase 2+ | ⏳ Planned for Phase 2 |
| Step 8 | Training provider partnership outreach (10–15 providers) | BD | Phase 3+ revenue | ⏳ Planned for Phase 3 |

**Critical Path:** Steps 1 and 2 must be complete before Sprint 1 build starts. Steps 3–6 inform Phase 2 (Skill Mapping) but can run in parallel with Sprints 1–3.

### Expertise Taxonomy Design (Phase 1 Foundation)

**Principle:** Robin mirrors National Occupational Standards (NOS) published by ESDC Canada. Robin does not invent competency frameworks.

**What the NOS provides:**
- Official competency blocks per Red Seal trade (e.g., Block B: Residential Wiring for Electrician 309A)
- Tasks within each block (e.g., B2: Install service entrances)
- Percentage weighting per block (used in Red Seal exams)

**How Robin uses NOS (Phase 1 & 2):**
- Phase 1 design: Every expertise topic maps to an NOS task code (not implemented in Phase 1, designed now)
- Phase 1 implementation: Expertise topics are labels; exact NOS mapping happens in Phase 2
- Phase 2: Full NOS block score view with gap identification
- Phase 2: Training recommendations surfaced per NOS block

**Legal safeguard (required for Phase 2 skill mapping):**
> *"Robin scores reflect demonstrated community knowledge as measured against the National Occupational Standards published by ESDC Canada. Robin does not certify competency and scores are not a substitute for official certification, licensing, or employer assessment."*

This disclaimer must appear on all skill gap recommendations, expertise score displays, and the credential wallet. Legal review required before Phase 2 launch.

---

## Sprint Breakdown (8 Sprints, 12+ Weeks)

```
Sprint 1: Weeks 1-2   → Onboarding + First Contribution (COMPLETE ✅)
Sprint 2: Weeks 2-3   → Knowledge Community Feed (COMPLETE ✅)
Sprint 3: Weeks 3-4   → Reputation Dashboard & Leaderboards (COMPLETE ✅)
Sprint 4: Weeks 4-5   → Credential Import & Notification Prefs (COMPLETE ✅)
Sprint 5: Weeks 5-6   → Peer Endorsement System (COMPLETE ✅)
Sprint 6: Weeks 6-8   → Full Endorsement Management + Saved Content (IN PROGRESS 🔄)
Sprint 7: Weeks 8-10  → Profile Settings + Mobile Polish (PLANNED 📋)
Sprint 8: Weeks 10-12 → NOS Taxonomy + Skill Mapping Foundation (PLANNED 📋)
```

Each sprint builds directly on the previous one, with overlapping weeks for parallel work.

---

# Sprint 1: Onboarding API Wiring + First Contribution (Weeks 1-2)

**Goal:** Get users from signup → onboarding → first content post → `active` status.

**Success Metric:** 60%+ completion through first contribution.

**Status:** ✅ **COMPLETE** — All deliverables implemented and tested end-to-end. Dev auth system functional. All 5 onboarding steps working. First contribution flow operational. See "What Was Built" section below.

---

## What Was Built (Sprint 1 Summary)

### ✅ Dev Authentication System
- **Created:** `apps/web/app/auth/sign-in/page.tsx` — Dev sign-in page with test user creation and resume
- **Created:** `apps/web/app/auth/sign-up/page.tsx` — Dev sign-up page (same flow, different label)
- **Updated:** `apps/web/lib/auth.ts` — `requireAuth()` now checks `dev-user-id` cookie as fallback to header
- **Updated:** `apps/web/app/onboarding/layout.tsx` — Auth guard redirects unauthenticated users to `/auth/sign-in`
- **Status:** Working. Users can sign in, create test users, and access onboarding.

### ✅ Complete Onboarding Flow (5 Steps)
1. **Role Selection** (`/onboarding/role`) — Working, sends role to API
2. **Trade Selection** (`/onboarding/trade`) — Working, fetches trades, shows expertise topics (fixed bug: now uses correct tradeId)
3. **Tutorial** (`/onboarding/tutorial`) — Working, submits first contribution with server action
4. **Profile Setup** (`/onboarding/profile`) — Working, collects displayName, bio, yearsExperience, provinceCode
5. **First Contribution** (`/onboarding/first-contribution`) — Working, submits question/post, returns 202, redirects to success

### ✅ Success Page
- **Created:** `apps/web/app/onboarding/success/page.tsx` — Displays completion message, credential stats, "what's next" guidance
- **Note:** "Go to your record" and "Browse community" buttons link to `/dashboard` and `/community` (Phase 2 pages, not yet built)

### 🐛 Critical Bugs Fixed
1. **First-contribution topics dropdown blank** — Fixed line 43: changed `user.trades[0].id` to `user.trades[0].tradeId`
2. **Database reset script error** — Fixed `reset-destroy.ts`: split multi-statement PostgreSQL into separate calls
3. **Server action FormData pattern** — Refactored all onboarding forms to use idiomatic Next.js FormData pattern

---

## Automated Testing (Required — Built Alongside Features)

**⚠️ CRITICAL:** Tests are **not** a post-sprint activity. Tests are written **daily as features ship**, using the testing pyramid in [TESTING_STRATEGY.md](TESTING_STRATEGY.md). This sprint allocates **4.5 days** for:
- **Unit tests:** Zod schemas, `useOnboarding` hook (10 tests)
- **Component tests:** RoleSelector, TradeSelector, ProfileForm (12 tests)
- **Integration tests:** 5 onboarding API routes + database interactions (10 tests)
- **E2E test:** Complete onboarding flow (role → trade → profile → first post) (3 tests)

**Acceptance criterion:** >75% code coverage on new code; all E2E critical path green before sign-off.

**Reference:** [TESTING_STRATEGY.md — Sprint 1 Section](TESTING_STRATEGY.md#sprint-1-onboarding--first-post)

## Deliverables

### 1.1 Onboarding Flow: Wire API Calls

**Current State:** UI shells exist (role, trade, tutorial, profile pages) but API calls are stubbed with `TODO` comments.

**Required Changes:**

#### File: `apps/web/app/onboarding/role/page.tsx`
- Replace `TODO: PATCH /api/users/me` with actual API call
- Send: `{ role: selected, onboardingStep: 1 }`
- On error: Show toast "Failed to save. Please try again."

#### File: `apps/web/app/onboarding/trade/page.tsx` (CREATE NEW)
**Purpose:** Step 2 — User selects primary trade + specialisation.

```tsx
// Expected structure:
// - Fetch GET /api/trades (list all)
// - Display trade picker (dropdown or cards by category)
// - On selection, fetch GET /api/trades/[id]/specialisations
// - Display specialisation picker
// - Continue button PATCH /api/users/me { tradeId, specialisationIds, onboardingStep: 2 }
// - Navigate to /onboarding/tutorial on success
```

**Acceptance Criteria:**
- Can select one primary trade
- Can select 0+ specialisations in that trade
- API call succeeds and navigates forward
- Error toast on failure, allow retry
- Mobile responsive (44px buttons min)

#### File: `apps/web/app/onboarding/tutorial/page.tsx` (MODIFY EXISTING)
**Purpose:** Step 3 — Gamified trades-hierarchy tutorial (already exists, needs minimal changes).

**Changes:**
- Replace placeholder CTA button with real form submission
- On completion of tutorial: PATCH `/api/users/me { onboardingStep: 3 }` and navigate to `/onboarding/profile`

#### File: `apps/web/app/onboarding/profile/page.tsx` (MODIFY EXISTING)
**Purpose:** Step 4 — User profile setup (name, years of experience, etc.).

**Fields to collect:**
- `displayName` (required)
- `yearsExperience` (number, optional)
- `provinceCode` (dropdown, optional)
- `bio` (text, optional, max 500 chars)
- `profilePhotoUrl` (optional, can defer file upload to Phase 2)

**API:**
- PATCH `/api/users/me` with form data
- Response: User object with updated fields
- On success: Navigate to `/onboarding/first-contribution`

**Acceptance Criteria:**
- Form validates required fields
- Bio character count displayed
- Submit button disabled while saving
- Spinner shown during save
- Error toast on failure
- Mobile responsive

#### File: `apps/web/app/onboarding/first-contribution/page.tsx` (CREATE NEW)
**Purpose:** Step 5 — User makes their first content post (question or post).

**Two-option flow:**
1. **Ask a question** (simple flow)
   - Trade (pre-selected from step 2, can change)
   - Expertise topic (dropdown for selected trade)
   - Question title
   - Question body (rich text or markdown)
   - Submit → POST `/api/content` { type: 'question', tradeId, topicId, title, body }
   - Response: 202 Accepted (content queued for AI screening)
   - Display: "Thanks! We're reviewing your question. It usually takes 2-5 minutes."

2. **Share a knowledge post** (simpler alternative)
   - Same as above but `type: 'post'` instead of `question`

**API Integration:**
```ts
const response = await fetch('/api/content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'question', // or 'post'
    tradeId: selected.tradeId,
    topicId: selected.topicId,
    title: formData.title,
    body: formData.body,
  }),
})
// Expect: 202 Accepted with { id, status: 'pending_review' }
```

**Acceptance Criteria:**
- Can select question or post type
- Form validates non-empty title and body
- Submit disabled while saving
- Spinner shown during POST
- 202 response handled gracefully with success message
- Next button: "Go to Dashboard" navigates to `/dashboard`
- Mobile responsive

---

### 1.2 Complete Onboarding Flow Wiring

#### File: `apps/web/app/onboarding/layout.tsx` (CREATE IF MISSING)
**Purpose:** Wrapper layout for all onboarding pages.

**Features:**
- Progress bar showing current step (1/5, 2/5, etc.)
- "Back" button to previous step (except step 1)
- Prevent backward navigation if step incomplete (basic UX protection)
- Mobile-optimized layout

---

### 1.3 Add Onboarding Status Tracking

#### Modify: `apps/web/lib/auth.ts`
**Add helper:**
```ts
export async function requireOnboardingCompletion(user: AuthUser) {
  // GET /api/users/me to fetch latest onboarding_step
  // If onboarding_step < 4, throw or return redirect to /onboarding/[next-step]
  // If onboarding_step >= 4 and account status != 'active', 
  //   allow access but prompt to complete first contribution
}
```

#### Modify: Root middleware to redirect unauthenticated onboarding page requests
- If user not authenticated, redirect to `/auth/sign-in`
- If user authenticated but not onboarded, redirect to `/onboarding/role`

---

### 1.4 Create First-Contribution Success Handler

#### File: `apps/web/app/onboarding/success/page.tsx` (CREATE)
**Purpose:** Completion page after first contribution.

**Content:**
- Congratulations message
- Show first credential issued (Open Badge preview)
- +10 reputation points awarded message
- CTA: "Go to Dashboard" or "Browse Community"
- Display referral link (optional, Phase 2)

---

## API Contracts Needed (Verify All Exist)

### Existing APIs to Verify:

1. **POST `/api/users/me`** (PATCH method)
   - Updates user profile fields
   - ✅ Already built in previous sprint
   - Accepts: `{ role, onboardingStep, tradeId, specialisationId, displayName, yearsExperience, ... }`

2. **GET `/api/trades`**
   - Returns all active trades
   - ✅ Already built
   - Response: `{ items: [ { id, name, description }, ... ] }`

3. **GET `/api/trades/[id]/specialisations`**
   - ✅ Already built

4. **GET `/api/trades/[id]/topics`**
   - ✅ Already built

5. **POST `/api/content`**
   - Creates new content (question/post/answer)
   - ✅ Already built
   - Expects: `{ type, tradeId, topicId, title, body }`
   - Returns: 202 Accepted with `{ id, status: 'pending_review' }`

6. **PATCH `/api/users/me`**
   - Update current user
   - ✅ Already built

### Verification Checklist:
- [ ] All 6 APIs respond correctly with `curl` or Postman
- [ ] POST `/api/content` fires async `screenContent()` without blocking
- [ ] Error responses include clear messages
- [ ] Rate limiting middleware not blocking requests (currently disabled, OK for dev)

---

## Database Schema: Verify Onboarding Fields

**Required fields in `User` table:**
- `onboardingStep` (Int, default 0)
- `accountStatus` (Enum: 'onboarding' | 'active' | 'suspended' | 'deactivated', default 'onboarding')
- `displayName` (String, optional, length < 100)
- `yearsExperience` (Int, optional)
- `provinceCode` (String 2-char, optional)
- `bio` (String, optional, length < 500)

**Verify:** Run `pnpm db:migrate` — if migrations are pending, create a new migration:
```bash
pnpm db:migrate -- --name add_onboarding_fields
```

Then seed with sample trades/specialisations/topics (already done, verify with `SELECT COUNT(*) FROM "Trade";`).

---

## Component Library to Build

### New Components:

#### `components/onboarding/OnboardingProgressBar.tsx`
**Props:** `{ currentStep: number; totalSteps: number }`
**Output:** Visual progress bar + step indicator

#### `components/onboarding/TradeSelector.tsx`
**Props:** `{ trades: Trade[]; selected: string | null; onSelect: (id) => void }`
**Output:** Dropdown or card grid of trades

#### `components/onboarding/SpecialisationSelector.tsx`
**Props:** `{ specialisations: Specialisation[]; selected: string[]; onSelect: (ids) => void }`
**Output:** Multi-select checkbox list

#### `components/forms/FirstContributionForm.tsx`
**Props:** `{ tradeId: string; topicId: string; onSubmit: (data) => Promise<void> }`
**Output:** Form with type selector, title, body, submit button

#### `components/ui/FormInput.tsx` (if not exists)
**Props:** `{ label, placeholder, value, onChange, error, required }`
**Output:** Styled text input with error state

#### `components/ui/FormSelect.tsx` (if not exists)
**Props:** `{ label, options, value, onChange, error, required }`
**Output:** Styled dropdown select

---

## Testing Checklist

### Manual Testing (Dev Environment):

**Test Flow: Signup → Onboarding → Dashboard**

1. **Sign-in with dev header:**
   ```bash
   curl -H "x-dev-user-id: test-user-1" http://localhost:3000/api/users/me
   # Should return: { id: 'test-user-1', accountStatus: 'onboarding', ... }
   ```

2. **Navigate to `/onboarding/role`**
   - [ ] All 4 role options visible
   - [ ] Selection persists when clicking back/forward
   - [ ] Continue button only enabled when role selected

3. **Select role, navigate to `/onboarding/trade`**
   - [ ] Trades list fetched from API
   - [ ] Can select trade
   - [ ] Can view specialisations for selected trade
   - [ ] Continue button navigates forward

4. **Complete tutorial, profile, first contribution**
   - [ ] Profile fields accepted
   - [ ] Content posted returns 202 Accepted
   - [ ] User redirected to success page
   - [ ] Verify in DB: `accountStatus = 'active'`, `onboardingStep = 4`

5. **Mobile Testing (Chrome DevTools 375×667 iPhone SE)**
   - [ ] All buttons ≥44px
   - [ ] No horizontal scroll
   - [ ] Touch targets properly spaced
   - [ ] Form labels visible on small screens

### Automated Testing:

**Create:** `apps/web/app/onboarding/__tests__/flow.test.ts`
```ts
describe('Onboarding Flow', () => {
  it('completes full onboarding and marks user as active', async () => {
    // Mock auth with dev user
    // Navigate through all steps
    // Verify final state: accountStatus = 'active'
  })
})
```

---

## Deployment Readiness

- [ ] All onboarding pages compiled without TypeScript errors
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` starts without errors
- [ ] No console warnings in browser dev tools
- [ ] No network errors in Network tab

---

## Acceptance Criteria (Sprint 1 Complete)

- [x] User can sign in via dev auth → complete all 5 onboarding steps → reach success page
- [x] First contribution posted successfully (POST `/api/content` returns 202)
- [x] User marked as `active` in database after completion
- [x] All 5 onboarding pages mobile-optimized (responsive layout applied)
- [x] Form validation prevents invalid submissions (required fields checked)
- [x] Error handling shows clear user-facing messages (console errors logged)
- [x] `pnpm typecheck` and `pnpm build` pass with 0 errors
- [x] Tested manually end-to-end in browser (complete flow verified)

**Notes:**
- Mobile formal audit (44px buttons, 3G performance) deferred to Sprint 5 (accessibility pass)
- Automated testing (unit/integration/E2E) deferred — manual testing confirms functionality
- Dashboard and Community pages are Phase 2 (success page buttons will link there later)

---

---

# Sprint 2: Knowledge Community Feed (Weeks 2-3)

**Goal:** Build the **Q&A discovery experience** so users can search, browse, and engage with community knowledge.

**Business Goal:** Support Loop 3 (Learning & Problem-Solving) — users discover answers to practical problems and return to apply knowledge.

**Status:** ✅ **COMPLETE** — All Sprint 2 deliverables implemented. Community feed, content detail pages, upvoting system, search, and bookmarks API all working. 15 component tests written.

## Automated Testing (Required — Built Alongside Features)

**⚠️ CRITICAL:** Tests are **not** a post-sprint activity. Tests are written **daily as features ship**, using the testing pyramid in [TESTING_STRATEGY.md](TESTING_STRATEGY.md). This sprint allocates **3 days** for:
- **Unit tests:** `useSearch` hook, pagination helpers (5 tests)
- **Component tests:** ContentCard, SearchBar, FilterBar (15 tests)
- **Integration tests:** Content routes + full-text search backend (8 tests)
- **E2E tests:** Feed browsing, search filtering, sorting (2 tests)

**Acceptance criterion:** >75% code coverage on new code; feed pagination + search working correctly in E2E tests.

**Reference:** [TESTING_STRATEGY.md — Sprint 2 Section](TESTING_STRATEGY.md#sprint-2-feed--search--qa)

## What Was Built (Sprint 2 Summary)

### ✅ Content Feed Page (`/community`)
- **Created:** `apps/web/app/community/page.tsx` — Full Q&A feed with search, filter, sort
- **Features:** Pagination, trade/type/sort filters, search integration, load-more button
- **Status:** Working. Users can browse published content by trade and search.

### ✅ Content Detail Page (`/community/[id]`)
- **Created:** `apps/web/app/community/[id]/page.tsx` — Full thread view with answers
- **Features:** Question display, answer list (sorted by accepted then upvotes), answer form, upvote buttons
- **Status:** Working. Users can read threads and post answers.

### ✅ Upvote/Downvote System
- **Created:** `apps/web/app/api/content/[id]/upvote/route.ts` — Vote toggle API
- **Created:** `apps/web/components/community/VoteButtons.tsx` — Vote UI component
- **Features:** Toggle upvotes, real-time count updates, user vote state tracking
- **Status:** Working. Voting increments/decrements upvote count.

### ✅ Accepted Answer System
- **Created:** `apps/web/app/api/content/[id]/accept-answer/route.ts` — Accept/unaccept API
- **Created:** `apps/web/components/community/AcceptAnswerButton.tsx` — UI button (visible to question author only)
- **Features:** 
  - Question author marks one answer as "accepted"
  - Accepted answer pinned to top with visual checkmark badge
  - Answerer receives 15 reputation points
  - Only question author can mark accepted (not self-markable)
  - Accepting a new answer unaccepts the previous one
- **Rules:** Only one accepted answer per question; cannot accept your own answer
- **Status:** Working. Accepted answers visible on threads and drive reputation.

### ✅ Community Promotion Fallback
- **Created:** `apps/web/app/api/content/[id]/community-promote/route.ts` — Auto-promotion logic
- **Features:**
  - If no answer is marked accepted after 14 days AND answer has 10+ upvotes, auto-promote to top
  - Answerer receives 8 reputation points for community promotion (vs 15 for accepted)
  - Protects answerers when question asker never returns to mark accepted
- **Status:** Working. Automatic job runs daily to promote eligible answers.

### ✅ Content Reporting System
- **Created:** `apps/web/app/api/content/[id]/report/route.ts` — Report submission API
- **Created:** `apps/web/components/community/ReportButton.tsx` — Report UI button
- **Features:**
  - Users can flag content as unsafe, off-topic, or harmful
  - Report reason required (dropdown: "Dangerous/Unsafe", "Off-topic", "Spam/Harassment", "Other")
  - Optional detailed comment (max 500 chars)
  - Admin dashboard to review flagged content
  - Flagged content still visible but marked with warning badge
- **Status:** Working. Content can be reported and reviewed by admins.

### ✅ Search Integration
- **Created:** `apps/web/app/api/content/search/route.ts` — Full-text search API
- **Features:** Ilike queries on title/body, debounced client-side search
- **Status:** Working. Search returns results in real-time.

### ✅ Component Library (Sprint 2)
- **ContentCard** — Renders individual content items with metadata
- **VoteButtons** — Upvote button with count
- **SearchBox** — Search input with live query
- **FilterBar** — Trade/type/sort filter dropdowns
- **AnswerForm** — Text input for posting answers

### ✅ Bookmarks API (Placeholder)
- **Created:** `apps/web/app/api/bookmarks/route.ts` — Bookmark endpoints (deferred to Phase 2)
- **Created:** `apps/web/app/saved/page.tsx` — Bookmarks placeholder page
- **Status:** API skeleton ready; full implementation deferred to Phase 2.

### ✅ Testing
- **Unit tests:** Accepted answer logic, community promotion eligibility (4 tests)
- **Component tests:** ContentCard (11 tests), SearchBox (6 tests), FilterBar (10 tests), AcceptAnswerButton (3 tests), ReportButton (2 tests)
- **Integration tests:** Upvote API (5 tests), Accept answer API (4 tests), Report API (3 tests), Community promotion job (2 tests)
- **Total:** 50 tests written

---

## Deliverables (Detailed Spec)

### 2.1 Content Feed Page

#### File: `apps/web/app/community/page.tsx` (✅ CREATED)
**Purpose:** Main discovery hub for Q&A content.

**Features:**
1. **Header + Filter Bar**
   - Title: "Community Knowledge"
   - Filter by:
     - Trade (dropdown with all active trades)
     - Content type: Question | Post | Answer
     - Sort: Newest | Most upvoted | Most answered
   - Search box (placeholder: "What do you want to know?")

2. **Content List**
   - Fetch: GET `/api/content?status=published&trade_id=...&type=...&sort=...&page=1&limit=20`
   - Display each item as a card:
     ```
     [Author Name] • [Role Badge: Journeyperson ✓] • [2 hours ago]
     
     Q: What's the difference between 12 and 14 AWG wire?
     
     [2 upvotes] [3 answers] [1 comment]
     ```
   - Alternate layout for posts (no answer count)

3. **Pagination**
   - "Load more" button or infinite scroll
   - Show: "Showing 20 of 847 posts"

4. **Empty State**
   - If no results: "No posts yet. Be the first to ask!"
   - CTA button: "Post a question"

**API Contract:**
```ts
GET /api/content
Query params: {
  status: 'published',
  trade_id?: string,
  topic_id?: string,
  type?: 'question' | 'answer' | 'post',
  sort?: 'newest' | 'trending' | 'most_answered',
  page: number,
  limit: number (default 20)
}

Response: {
  items: [
    {
      id: string,
      type: 'question' | 'post',
      title: string,
      body: string,
      author: { id, displayName, role },
      trade: { id, name },
      topic: { id, name },
      createdAt: ISO string,
      upvotes: number,
      answers: number,
      status: 'published' | 'pending_review',
      aiQualityScore: number
    },
    ...
  ],
  page: number,
  limit: number,
  total: number,
  pages: number
}
```

**Acceptance Criteria:**
- [ ] Renders list of published content
- [ ] Filters work (trade selector updates feed)
- [ ] Sort options work (newest/trending/most answered)
- [ ] Pagination works (load more or scroll)
- [ ] Empty state displays appropriately
- [ ] Mobile responsive (cards stack vertically)
- [ ] Loads in <1s on fast connection

---

### 2.2 Content Detail Page

#### File: `apps/web/app/community/[id]/page.tsx` (CREATE)
**Purpose:** Full thread view with question + all answers.

**Layout:**
```
[ORIGINAL QUESTION]
├─ Author + role + date + reputation
├─ Title + body + any media
├─ [Upvote] [Downvote] [View count] [Share button]
├─ Status badge: "Verified ✓" | "Pending review" | "Not approved"
└─ [Answer this question] button

[ANSWERS - Sorted by: Accepted first, then by upvotes]
├─ Answer 1
│  ├─ Author + role + reputation
│  ├─ Body
│  ├─ [Upvote] [Downvote] [Mark as accepted] (if question author)
│  └─ Status: "✓ Verified" if approved
│
├─ Answer 2
│  └─ ...
│
└─ [Post your answer] form (if authenticated)
```

**Features:**
1. **Question Detail**
   - Fetch: GET `/api/content/[id]` (already built)
   - Display full question with metadata
   - Show AI screening status
   - Upvote/downvote buttons (POST `/api/content/[id]/upvote`)

2. **Answers List**
   - Fetch from API response (answers nested in content object)
   - Sort: `isAccepted` first, then `upvotes` DESC
   - Show each answer with author, body, vote count
   - "Mark as accepted" button only visible to question author

3. **Post Answer Form** (authenticated users only)
   - Rich text editor for answer body
   - Submit button → POST `/api/content` with type='answer', parentId=question.id
   - On success: Clear form, show new answer at top with "pending review" badge
   - Loading state during POST

4. **Engagement Metrics**
   - Views counter (if we add view tracking)
   - Upvote/downvote counts in real-time
   - "Helpful" count from upvotes

**API Contracts to Verify/Create:**

```ts
// Already built:
GET /api/content/[id]
Response: {
  id, type, title, body, author, trade, topic, 
  createdAt, upvotes, answers: [ { id, body, author, upvotes }, ... ],
  status, aiQualityScore
}

// Need to create (or extend existing):
POST /api/content/[id]/upvote
Body: { direction: 'up' | 'down' } or null to clear
Response: { upvotes: number }

POST /api/content (for posting answers)
Body: { type: 'answer', parentId: string, body: string, tradeId?, topicId? }
Response: 202 Accepted { id, status: 'pending_review' }

PATCH /api/content/[id]
Body: { isAccepted: boolean } (author only)
Response: { isAccepted: boolean }
```

**Acceptance Criteria:**
- [ ] Question and all answers display
- [ ] Answers sorted by accepted + upvotes
- [ ] Upvote/downvote buttons work
- [ ] Can post answer if authenticated
- [ ] Answer appears in list after posting (with pending badge)
- [ ] Author can mark answer as accepted
- [ ] Unauthenticated users see "Sign in to answer"
- [ ] Mobile responsive
- [ ] Loads full thread in <1.5s

---

### 2.3 Add Upvote/Downvote System

#### Modify: `apps/web/lib/api.ts` or create `apps/web/hooks/useUpvote.ts`
**Purpose:** Shared hook for upvote UI + API calls.

```ts
export function useUpvote(contentId: string) {
  const [upvotes, setUpvotes] = useState(0)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVote(direction: 'up' | 'down') {
    setLoading(true)
    const response = await fetch(`/api/content/${contentId}/upvote`, {
      method: 'POST',
      body: JSON.stringify({ 
        direction: userVote === direction ? null : direction 
      }),
    })
    const data = await response.json()
    setUpvotes(data.upvotes)
    setUserVote(data.userVote)
    setLoading(false)
  }

  return { upvotes, userVote, handleVote, loading }
}
```

#### Create API endpoint: `apps/web/app/api/content/[id]/upvote/route.ts`
**Purpose:** Handle vote state changes.

```ts
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth()
  if (isUnauthorized(user)) return user

  const { id } = await params
  const { direction } = await req.json()

  // Logic: If user already voted 'up', clicking 'up' again removes vote (toggle)
  // If user voted 'up', clicking 'down' changes to 'down'
  
  const result = await prisma.contentVote.upsert({
    where: { contentId_userId: { contentId: id, userId: user.id } },
    update: { direction: direction || null },
    create: { contentId: id, userId: user.id, direction },
  })

  const upvotes = await prisma.contentVote.count({
    where: { contentId: id, direction: 'up' }
  })

  return NextResponse.json({ upvotes, userVote: result.direction })
}
```

**Acceptance Criteria:**
- [ ] Upvote button toggles on click
- [ ] Downvote button toggles on click
- [ ] Vote count updates in real-time
- [ ] User cannot both upvote and downvote same content
- [ ] Unauthenticated users see tooltip "Sign in to vote"
- [ ] Loading state shown during API call
- [ ] No duplicate API calls on rapid clicks

---

### 2.3a Accepted Answer System & Community Promotion

#### Create API: `apps/web/app/api/content/[id]/accept-answer/route.ts`
**Purpose:** Allow question author to mark an answer as accepted.

```ts
PATCH /api/content/[id]/accept-answer
Body: { answerId: string } // which answer to accept
Response: { 
  isAccepted: boolean,
  previousAnswerId?: string, // was this the current accepted answer
  reputationDelta: number // +15 for accepted answer
}

// Rules enforced:
// - Only question author can mark accepted
// - Cannot accept your own answer
// - Accepting a new answer unaccepts the previous one
// - Answerer receives 15 reputation points
```

#### Create API: `apps/web/app/api/content/[id]/community-promote/route.ts`
**Purpose:** Auto-promote top answer when question author never marks accepted.

```ts
// Background job runs daily (or on-demand via admin trigger)
// For each question with status='published':
//   - Check if any answer is marked as accepted
//   - If not, check if any answer has upvotes >= 10 AND question is > 14 days old
//   - If so, promote highest-upvoted answer to "community_promoted" status
//   - Award answerer 8 reputation points (vs 15 for accepted)
```

#### Create Component: `apps/web/components/community/AcceptAnswerButton.tsx`
**Props:** `{ answerId: string; questionAuthorId: string; currentUserId: string; isCurrentlyAccepted: boolean; onSuccess: () => void }`
**Output:** Button visible only to question author. Disabled if trying to accept own answer.

#### Create Component: `apps/web/components/community/PromotionBadge.tsx`
**Props:** `{ type: 'accepted' | 'community_promoted' }`
**Output:** Visual badge on top of accepted or promoted answers.

**Acceptance Criteria:**
- [ ] Question author can mark answer as accepted
- [ ] Accepted answer pinned to top with checkmark badge
- [ ] Answerer receives 15 points for accepted answer
- [ ] Cannot accept own answer (button disabled)
- [ ] Accepting new answer unaccepts previous (tested)
- [ ] Community promotion runs daily (background job)
- [ ] Promoted answer receives 8 points (verified in reputation events)
- [ ] Promoted badge displays correctly

---

### 2.3b Content Reporting System

#### Create API: `apps/web/app/api/content/[id]/report/route.ts`
**Purpose:** Allow users to report dangerous, off-topic, or harmful content.

```ts
POST /api/content/[id]/report
Body: {
  reason: 'dangerous' | 'off_topic' | 'spam' | 'harassment' | 'other',
  details?: string (optional, max 500 chars)
}
Response: 201 Created { reportId, status: 'pending_review' }

GET /api/admin/reports (admin only)
Query: ?status=pending|reviewed|dismissed&sort=newest&limit=50&page=1
Response: {
  items: [ { id, contentId, reportedBy, reason, details, reportedAt, status }, ... ],
  total: number,
  page: number
}

PATCH /api/admin/reports/[id] (admin only)
Body: { status: 'dismissed' | 'accepted', action?: 'remove_content' | 'suspend_user', notes?: string }
Response: { status, actionsApplied }
```

#### Create Component: `apps/web/components/community/ReportButton.tsx`
**Props:** `{ contentId: string; contentAuthorId: string; onSuccess: () => void }`
**Output:** Flag/report button. Opens modal with reason dropdown + optional details.

**Validation:**
- Reason dropdown: Dangerous/Unsafe, Off-topic, Spam/Harassment, Other (required)
- Details textarea: optional, max 500 chars
- Cannot report own content (button disabled)
- Submit disabled until reason is selected

**Acceptance Criteria:**
- [ ] Users can report content
- [ ] Report reasons are clear and actionable
- [ ] Admin can view pending reports
- [ ] Admin can dismiss or act on reports
- [ ] Removing content deletes it from feed (soft delete)
- [ ] Suspending user suspends account (no login, no contributions)
- [ ] Mobile friendly (modal works on small screens)
- [ ] Users cannot report own content

---

### 2.3c AI-Powered Content Verification & Quality Badges

**Goal:** Automatically screen community posts and responses using Claude Haiku to evaluate quality and domain relevance, then display visual quality badges to help users identify high-quality contributions.

#### Status: ✅ **COMPLETE**

**What Was Built:**

1. **Claude Haiku Screening System** (`apps/web/lib/aiScreening.ts`)
   - Async AI evaluation on every post/question/answer submission
   - Scores: `qualityScore` (0.0–1.0) and `domainScore` (0.0–1.0)
   - Auto-publish decision: quality ≥ 0.35 AND domain ≥ 0.40 AND no safety concerns
   - Fallback: Below-threshold content flagged for human review
   - Audit trail: Full `AiScreeningResult` records with raw response

2. **Configurable Model Selection** (`CLAUDE_SCREENING_MODEL` env var)
   - Default: `claude-haiku-4-5-20251001` (fast, cost-effective)
   - Alternatives: `claude-sonnet-4-6`, `claude-opus-4-8`
   - Can be changed without code recompile

3. **Quality Badges** (`components/community/QualityBadge.tsx`)
   - Gold badge: Quality score ≥ 0.65 (⭐ High Quality)
   - Silver badge: Quality score ≥ 0.50 (✓ Good)
   - No badge: Below 0.50 (standard quality)
   - Displayed on feed and detail pages

4. **Integration Points**
   - **Community Feed** (`ContentCard`): Badge shows next to type badge
   - **Question/Answer Detail** (`community/[id]/page.tsx`): Badge shows with author info
   - Only visible on published content (not pending/flagged)

5. **Smart Screening Context**
   - **Titles included**: Posts/questions screened with full title context
   - **Trade inheritance**: Answers inherit trade context from parent question
   - **Trade name resolution**: Specific trade name passed to prompt (not generic "skilled trades")

#### Files Created/Modified:
- ✅ `apps/web/lib/aiScreening.ts` — Claude Haiku screening engine
- ✅ `apps/web/components/community/QualityBadge.tsx` — Badge component
- ✅ `apps/web/components/community/ContentCard.tsx` — Integrated badge display
- ✅ `apps/web/app/community/[id]/page.tsx` — Detail page badge display
- ✅ `apps/web/app/api/content/route.ts` — Trade name + title resolution
- ✅ `apps/web/.env`, `.env.example` — Added `ANTHROPIC_API_KEY`, `CLAUDE_SCREENING_MODEL`

#### Key Features:
- ✅ Async screening (doesn't block user response)
- ✅ 202 Accepted response (content queued for review)
- ✅ Auto-publish above threshold
- ✅ Transparent scoring (visible to admins)
- ✅ Audit trail for compliance
- ✅ Visual indicators (Gold/Silver badges)
- ✅ Environment-driven model selection

#### Scoring Thresholds:
| Score | Threshold | Result |
|-------|-----------|--------|
| Quality | ≥ 0.35 | Passes initial gate |
| Domain | ≥ 0.40 | Passes relevance gate |
| Safety Flag | absent | Hard block if present |

#### Acceptance Criteria: ✅ All Met
- [x] Posts submitted get 202 response with pending_review status
- [x] Async screening runs 5–10 seconds after submission
- [x] High-quality content (both thresholds met) auto-publishes
- [x] Low-quality content flagged for human review
- [x] Scores stored in database (aiQualityScore, aiDomainScore, aiScreenedAt)
- [x] Quality badges display Gold/Silver based on scores
- [x] Badges visible on community feed listing
- [x] Badges visible on post/answer detail pages
- [x] Trade name fetched and passed to screener
- [x] Answer trade inherited from parent question
- [x] Title included in screening context
- [x] CLAUDE_SCREENING_MODEL env var configurable
- [x] All testing verified (posted good/bad content, saw correct publish/flag behavior)

---

### 2.4 Search Integration

#### Create: `apps/web/hooks/useSearch.ts`
**Purpose:** Connect to search API (Algolia or PostgreSQL full-text search).

**For MVP:** Use PostgreSQL full-text search (simpler, no external dependency).

```ts
export function useSearch(query: string, tradeId?: string) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    
    setLoading(true)
    fetch(`/api/content/search?q=${query}&trade_id=${tradeId}`)
      .then(r => r.json())
      .then(data => setResults(data.items))
      .finally(() => setLoading(false))
  }, [query, tradeId])

  return { results, loading }
}
```

#### Create API: `apps/web/app/api/content/search/route.ts`
**Purpose:** Full-text search on content title + body.

```ts
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  const tradeId = req.nextUrl.searchParams.get('trade_id')

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] })
  }

  const results = await prisma.$queryRaw`
    SELECT id, type, title, body, "authorId", "tradeId", status, "createdAt"
    FROM "Content"
    WHERE status = 'published'
      AND ("title" ILIKE ${'%' + q + '%'} OR "body" ILIKE ${'%' + q + '%'})
      ${tradeId ? Prisma.sql`AND "tradeId" = ${tradeId}` : Prisma.empty}
    ORDER BY "createdAt" DESC
    LIMIT 20
  `

  return NextResponse.json({ items: results })
}
```

**Acceptance Criteria:**
- [ ] Search box accepts input
- [ ] Results display as you type
- [ ] Results respect selected trade filter
- [ ] Search < 300ms latency
- [ ] Can click result to view detail

---

### 2.5 Bookmarking (Save Content)

#### Create: `apps/web/app/api/bookmarks/route.ts`
**Purpose:** Save content to user's personal library.

```ts
// POST /api/bookmarks
Body: { contentId: string }
Response: { bookmarked: boolean }

// DELETE /api/bookmarks/[id]
Response: { bookmarked: false }

// GET /api/bookmarks
Response: { items: [ { contentId, title, savedAt }, ... ] }
```

#### Add to Content Detail Page:
- Star icon: "Save this" / "Remove from saved"
- Click → POST `/api/bookmarks { contentId }`
- Icon fills on success
- Toast: "Saved to your library"

#### Create: `apps/web/app/saved/page.tsx`
**Purpose:** View all saved content.

- List all bookmarked content
- Sort by: saved date, most recent
- Can remove from list
- Search saved content

**Acceptance Criteria:**
- [ ] Can bookmark content from detail page
- [ ] Bookmarked icon shows user has saved it
- [ ] Can view all saved content in `/saved`
- [ ] Can remove bookmark
- [ ] Bookmark count accurate

---

## Component Library to Build (Sprint 2)

#### `components/community/ContentCard.tsx`
**Props:** `{ content: Content; showAnswerCount?: boolean }`
**Output:** Card displaying question/post with metadata, votes, author

#### `components/community/ContentDetail.tsx`
**Props:** `{ content: Content; onAnswerPosted: (answer) => void }`
**Output:** Full question + answers + form to post answer

#### `components/community/AnswerForm.tsx`
**Props:** `{ questionId: string; onSubmit: (answer) => Promise<void> }`
**Output:** Rich text form to post answer

#### `components/community/VoteButtons.tsx`
**Props:** `{ contentId: string; initialVotes: number; onVoteChange: (votes) => void }`
**Output:** Up/down vote buttons with count

#### `components/community/SearchBox.tsx`
**Props:** `{ onSearch: (query) => void; tradeFilter?: string }`
**Output:** Search input with live results dropdown

#### `components/community/FilterBar.tsx`
**Props:** `{ trades: Trade[]; onTradeSelect: (id) => void; onTypeSelect: (type) => void }`
**Output:** Filters and sort options

---

## Testing Checklist (Sprint 2)

### Manual Testing:

1. **Browse Feed**
   - [ ] Feed loads with published content
   - [ ] Filters update feed
   - [ ] Pagination works
   - [ ] Can click card to open detail

2. **View Question Thread**
   - [ ] Question displays with full text
   - [ ] All answers visible
   - [ ] Answers sorted correctly
   - [ ] Can upvote/downvote

3. **Post Answer**
   - [ ] Authenticated user can post answer
   - [ ] Form validates non-empty body
   - [ ] Answer appears in thread with pending badge
   - [ ] Unauthenticated user sees sign-in prompt

4. **Search**
   - [ ] Can search by keyword
   - [ ] Results appear in <500ms
   - [ ] Can filter search by trade

5. **Bookmarks**
   - [ ] Can save question
   - [ ] Star icon fills on save
   - [ ] Saved content visible in `/saved`
   - [ ] Can remove bookmark

### Automated Testing:

```ts
describe('Community Feed', () => {
  it('fetches and displays published content', async () => {
    const response = await fetch('/api/content?status=published')
    expect(response.status).toBe(200)
  })
  
  it('allows user to post answer to question', async () => {
    // Post answer
    // Verify 202 response
    // Verify answer appears in thread
  })
})
```

---

## Acceptance Criteria (Sprint 2 Complete)

- [x] `/community` page displays feed of published Q&A content
- [x] Can filter by trade, type, and sort
- [x] Can search content by keyword
- [x] Can click content to view full thread with all answers
- [x] Can upvote/downvote content
- [x] Can post answer to question (returns 202)
- [x] Can bookmark content to `/saved` (API ready, UI placeholder)
- [x] **Question author can mark answer as accepted** — accepted answer pinned to top with checkmark badge
- [x] **Answerer receives 15 reputation points for accepted answer**
- [x] **Community promotion fallback** — auto-promotes top answer (10+ upvotes) if no accepted answer after 14 days
- [x] **Users can report content** — flag as dangerous/unsafe, off-topic, spam, or harassment
- [x] **Content reporting includes admin queue** — admin dashboard to review and act on reports
- [x] Pagination works (20 per page)
- [x] Mobile responsive (scrollable list, touch-friendly)
- [x] All API calls succeed without errors
- [x] `pnpm typecheck` and `pnpm build` pass
- [x] 50+ component and integration tests written (includes accepted answer and reporting tests)

---

---

# Sprint 3: Reputation Dashboard & Expertise Topic Scores (Weeks 3-4)

**Goal:** Make reputation **visible and aspirational** so users understand their progress toward mentor tier. Establish two separate score types: overall reputation (drives tier) and expertise topic scores (drives leaderboards and skill mapping).

**Business Goal:** Support Loop 2 (Ranking & Recognition) — gamified progress toward 750-point mentor tier; establish expertise domain expertise for skill mapping in Phase 2.

**Status:** ✅ **COMPLETE** — All Sprint 3 deliverables implemented and tested. User reputation dashboard, leaderboards by trade, reputation calculation utilities, and activity feeds all operational. 38 tests written (unit, component, and integration).

## Automated Testing (Required — Built Alongside Features)

**⚠️ CRITICAL:** Tests are **not** a post-sprint activity. Tests are written **daily as features ship**, using the testing pyramid in [TESTING_STRATEGY.md](TESTING_STRATEGY.md). This sprint allocates **3 days** for:
- **Unit tests:** `reputation.ts`, `leaderboard.ts` score calculation (8 tests)
- **Component tests:** ScoreCard, LeaderboardRow display (8 tests)
- **Integration tests:** Reputation API, leaderboard ranking API (6 tests)
- **E2E tests:** Dashboard score display, leaderboard ranking visibility (2 tests)

**Acceptance criterion:** >75% code coverage on new code; reputation score calculation verified; leaderboards ordered correctly.

**Reference:** [TESTING_STRATEGY.md — Sprint 3 Section](TESTING_STRATEGY.md#sprint-3-reputation--leaderboards)

---

## Reputation Scoring System (Transparent to All Users)

**Principle:** All reputation mechanics are public and visible. Users can see exactly how they earned points and what the thresholds are.

### Two Separate Score Types (Not Interchangeable)

**1. Overall Reputation Score**
- Platform-wide standing
- Used to determine tier (Apprentice → Journeyperson → Master)
- Visible on profile and dashboard
- Contribution: All reputation events combined (answers, upvotes, endorsements, etc.)

**2. Expertise Topic Scores**
- Subject-matter credibility in specific NOS-mapped topics
- **Separate from overall score** — two tradespeople can have identical overall scores with completely different expertise profiles
- Used for leaderboards (ranked by topic, not platform tier)
- Used for skill mapping recommendations (Phase 2)
- Visible on profile (top topics shown)
- Example: Electrician A has 750 overall points but 450 in "Panel Installation" and 200 in "Troubleshooting"

### Public Reputation Point Values

All users can see these point values. Transparency prevents gaming and builds trust.

| **Event** | **Points** | **Notes** |
|---|---|---|
| Upvote received on answer | +5 pts | Per upvote, all added to overall + topic score |
| Accepted answer (from question author) | +15 pts | Question author marks your answer as best; points go to overall + topic |
| Community-promoted answer (auto-promoted) | +8 pts | 14+ days old, 10+ upvotes, no accepted answer; points go to overall + topic |
| Peer endorsement (verified, same trade) | Weighted by tier × 1.0–3.0× | Master 3.0x, Journeyperson 1.5x, Apprentice 0.5x; goes to overall + topic |
| Audit pass (credential verified) | +25 pts | One-time award when uploaded credential passes audit |
| Audit fail (credential rejected) | -15 pts | One-time penalty if credential is fraudulent or invalid |

**How these distribute across score types:**
- **Upvotes, accepted answers, community promotion:** Points awarded to BOTH overall reputation AND the specific topic being discussed
- **Endorsements:** Points awarded to BOTH overall reputation AND the specific topic endorsed for
- **Credentials:** Audit pass/fail affects overall reputation only (flat bonus/penalty)

**Example flow:**
1. User answers a question about "Panel Installation"
2. Answer receives 5 upvotes → +25 points to overall reputation + Panel Installation topic score
3. Question author marks answer accepted → +15 points to overall reputation + Panel Installation topic score
4. User now has +40 points overall and +40 points in Panel Installation
5. On dashboard: Overall score increased by 40; Panel Installation topic now shows 40 points
6. On leaderboards: User appears ranked by their Panel Installation score

### Deliverables

#### File: `apps/web/app/dashboard/page.tsx` (CREATE)
**Purpose:** Personal dashboard showing reputation, progress, and activity.

**Sections:**

1. **Welcome Header**
   ```
   "Welcome, [Name]!"
   "You're [100 points] away from Expert status"
   ```

2. **Reputation Score Card**
   - Large number: Current reputation score
   - Progress bar to next tier (0–750 for mentor)
   - Breakdown: "100 from contributions, 40 from endorsements, 20 from accepted answers"

3. **Expertise Topics** (Top 5)
   ```
   Panel Installation (250 pts)  [████████░░]  (80%)
   Troubleshooting Circuits (120) [██████░░░░]  (60%)
   ...
   ```

4. **Recent Activity Feed**
   - Last 10 reputation events
   - "+10 pts: Your answer was accepted"
   - "+3 pts: Your post was upvoted"
   - "+5 pts: Sarah K. endorsed you for panel installation"
   - With timestamps and links to content

5. **Engagement Summary (This Month)**
   - Posts made: 8
   - Answers posted: 3
   - Endorsements received: 2
   - Questions asked: 5

6. **Next Milestone**
   - If < 750 pts: "You're 150 pts away from Mentor eligibility"
   - If >= 750 pts: "You're eligible for mentor tier! 🎉"
   - CTA button: "Explore mentoring" (deferred to Phase 2)

**API Contracts:**

```ts
GET /api/users/me
Response: {
  id, displayName, email, role,
  reputationScore: { total: 500, ... },
  trades: [ ... ],
  ...
}

GET /api/users/me/reputation
Response: {
  totalPoints: 500,
  breakdown: {
    contributions: 100,
    endorsements: 40,
    acceptedAnswers: 20
  },
  expertiseTopics: [
    { topicId, topicName, points: 250 },
    ...
  ],
  nextTierName: 'Expert',
  nextTierThreshold: 750,
  pointsToNextTier: 250
}

GET /api/users/me/activity?limit=10&offset=0
Response: {
  items: [
    {
      type: 'post_published' | 'answer_accepted' | 'content_upvoted' | 'peer_endorsement_received',
      points: 10,
      description: 'Your answer was accepted',
      contentId?: string,
      createdAt: ISO,
      relatedUser?: { id, displayName, role }
    },
    ...
  ]
}

GET /api/users/me/summary
Response: {
  postsThisMonth: 8,
  answersThisMonth: 3,
  endorsementsReceivedThisMonth: 2,
  questionsAskedThisMonth: 5,
  topicsCount: 3,
  ...
}
```

**Acceptance Criteria:**
- [ ] Dashboard loads user's reputation score
- [ ] Progress bar shows correct % to next tier
- [ ] Expertise topics displayed in rank order
- [ ] Recent activity shows last 10 events
- [ ] Engagement summary calculates correctly
- [ ] Mobile responsive (card layout)
- [ ] Loads in <1.5s

---

### 3.2 Leaderboards by Trade

#### File: `apps/web/app/leaderboards/[trade]/page.tsx` (CREATE)
**Purpose:** Gamified rankings to drive engagement and credibility signals.

**Layout:**
```
[Trade Name] Expert Rankings
"See the top contributors in [Trade Name]"

[Rank] [Name] [Role Badge] [Score] [Topics] [Endorsements]
1      Mike T.  Journeyperson ✓  580     5       12
2      Sarah K. Master ✓         540     4       15
3      John D.  Apprentice       420     3       8
...

[View all] (paginated, 50 per page)

[Filter by topic dropdown]
```

**Features:**
1. **Trade Selector**
   - Dropdown or tabs to switch between trades
   - Shows leaderboard for selected trade
   - Sort by: Score (default), Recent activity, Most endorsed

2. **Leaderboard Table**
   - Rank (1–50 per page)
   - User name + role badge (Apprentice, Journeyperson, Master, with ✓ if verified)
   - Reputation score in that trade
   - Number of topics mastered in that trade
   - Number of endorsements received
   - Click to go to user profile

3. **Your Rank Section** (if user logged in)
   - "You're ranked #42 in Electrical Engineering"
   - "You need 180 more points to reach the top 10"
   - "Your trending: +25 pts this month"

4. **Topic Leaderboards** (optional, Phase 2)
   - Sub-leaderboards per expertise topic
   - "Top experts in Panel Installation"
   - Accessible via filter dropdown

**API Contracts:**

```ts
GET /api/leaderboards/[trade]?page=1&limit=50&sort=score|recent|endorsed
Response: {
  tradeName: string,
  items: [
    {
      rank: 1,
      userId: string,
      displayName: string,
      role: 'apprentice' | 'journeyperson' | 'master',
      verified: boolean,
      score: 580,
      topicsCount: 5,
      endorsementsCount: 12
    },
    ...
  ],
  currentUserRank: 42,
  totalUsers: 342
}

GET /api/leaderboards/[trade]/[topic]?page=1
Response: {
  tradeName, topicName,
  items: [ ... (same structure) ]
}
```

**Acceptance Criteria:**
- [ ] Leaderboards fetch correctly from API
- [ ] Can switch trades to see different leaderboards
- [ ] User's rank shown if authenticated
- [ ] Can click user to view profile
- [ ] Pagination works (50 per page)
- [ ] Sort options work
- [ ] Mobile responsive
- [ ] Loads in <1.5s

---

### 3.3 Reputation System Backend

#### Create: `apps/web/app/api/users/me/reputation/route.ts`
**Purpose:** GET user's reputation breakdown.

**Logic:**
```ts
// Fetch user
// Calculate total reputation from ReputationEvent table
// Group by type (post_published, answer_accepted, etc.)
// Fetch top expertise topics from Content table (group by topic, sum points)
// Calculate points to next tier
// Return aggregated data
```

#### Create: `apps/web/app/api/users/me/activity/route.ts`
**Purpose:** GET user's activity feed (reputation events).

**Logic:**
```ts
// Fetch ReputationEvent entries for user
// Join with Content table to show what earned points
// Join with User table to show who endorsed them
// Order by createdAt DESC
// Limit to page * limit
```

#### Verify Database Schema:

**Tables needed:**
- `ReputationEvent` table (already created in previous sprints)
  - Fields: id, userId, eventType (enum), points, contentId, endorsementId, createdAt
- `Endorsement` table (for Loop 4, but can be empty for now)

**Verify migrations:**
```bash
pnpm db:migrate
# Should have tables: ReputationEvent, Endorsement, ContentVote, Content, User, Trade, etc.
```

---

### 3.4 Real-Time Score Updates

#### Create: `apps/web/hooks/useReputationScore.ts`
**Purpose:** Hook to fetch and poll user's reputation score.

```ts
export function useReputationScore() {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch on mount
    fetchScore()
    
    // Poll every 10 seconds (can optimize with WebSocket in Phase 2)
    const interval = setInterval(fetchScore, 10000)
    return () => clearInterval(interval)
  }, [])

  async function fetchScore() {
    const res = await fetch('/api/users/me/reputation')
    const data = await res.json()
    setScore(data)
    setLoading(false)
  }

  return { score, loading, refetch: fetchScore }
}
```

**Usage in dashboard:**
- After user posts content, call `refetch()` to update score
- Show toast: "+10 pts: Your post was published!"

---

## Component Library to Build (Sprint 3)

#### `components/dashboard/ReputationCard.tsx`
**Props:** `{ score: number; nextTierThreshold: number; tierName: string }`
**Output:** Large score display with progress bar

#### `components/dashboard/ExpertiseTopics.tsx`
**Props:** `{ topics: Topic[]; topicsLimit?: number }`
**Output:** Top 5 topics with point bars

#### `components/dashboard/ActivityFeed.tsx`
**Props:** `{ activities: ReputationEvent[] }`
**Output:** Chronological list of reputation events

#### `components/dashboard/EngagementSummary.tsx`
**Props:** `{ summary: { posts, answers, endorsements, questions } }`
**Output:** 4-card grid showing engagement metrics

#### `components/leaderboard/LeaderboardTable.tsx`
**Props:** `{ items: LeaderboardEntry[]; currentUserRank?: number }`
**Output:** Ranked list with name, score, badges

#### `components/leaderboard/TradeSelector.tsx`
**Props:** `{ trades: Trade[]; selected: string; onSelect: (id) => void }`
**Output:** Dropdown or pill buttons to switch trade

---

## Testing Checklist (Sprint 3)

### Manual Testing:

1. **Dashboard Page**
   - [ ] User's reputation score displays
   - [ ] Progress bar shows correct % to next tier
   - [ ] Expertise topics listed in rank order
   - [ ] Recent activity shows correct events
   - [ ] Engagement summary calculates correctly
   - [ ] Page loads in <1.5s

2. **Leaderboards**
   - [ ] Can switch trades
   - [ ] Leaderboard shows correct top 50 users
   - [ ] Current user rank displayed
   - [ ] Can click user to view profile
   - [ ] Pagination works

3. **Real-Time Score Update**
   - [ ] Post a new question
   - [ ] Dashboard score updates (may need manual refresh or poll)
   - [ ] Activity feed shows new event

### Automated Testing:

```ts
describe('Reputation System', () => {
  it('calculates reputation score correctly', async () => {
    // Create test user with known events
    // Fetch reputation endpoint
    // Verify score = sum of all points
  })
  
  it('shows user rank on leaderboard', async () => {
    // Get leaderboard for trade
    // Verify authenticated user's rank is shown
  })
})
```

---

## Acceptance Criteria (Sprint 3 Complete)

- [ ] `/dashboard` displays user's reputation score and progress
- [ ] Expertise topics shown in ranked order
- [ ] Recent activity feed shows last 10 events
- [ ] Engagement summary shows accurate counts
- [ ] Leaderboards accessible at `/leaderboards/[trade]`
- [ ] Current user's rank visible on leaderboard
- [ ] Can switch between trade leaderboards
- [ ] Pagination works (50 per page)
- [ ] Real-time score updates after posting (may require refresh)
- [ ] Mobile responsive
- [ ] All API endpoints respond correctly
- [ ] `pnpm typecheck` and `pnpm build` pass

---

---

# Sprint 4: Credential Import (Weeks 4-5)

**Goal:** Allow users to upload and verify trade credentials (Red Seal, safety tickets) to establish baseline expertise and credibility.

**Business Goal:** Reduce fraud risk, provide portable credential record, establish user credibility on day one.

**Status:** ✅ **COMPLETE** — All Sprint 4 deliverables implemented and tested. User credential upload, storage, and management fully operational. 24+ tests passing.

---

## Deliverables

### 4.1 Credential Upload Infrastructure

#### File: `apps/web/components/onboarding/CredentialUploadForm.tsx` (CREATE)
**Purpose:** Form for users to upload trade credentials during/after onboarding.

**Features:**
1. **Document Type Selector**
   - Dropdown with options: Red Seal, Safety Ticket (WHMIS, Fall Protection, etc.), Other
   - Description of each type
   - Links to official credential info (deferred to Phase 2)

2. **File Upload**
   - Drag-and-drop zone or file picker
   - Accepted formats: PDF, JPG, PNG
   - File size limit: 10 MB
   - Preview of uploaded file
   - Progress indicator during upload

3. **Upload Confirmation**
   - File name and type displayed
   - Status: pending verification
   - Skip option (can add credentials later)
   - Submit button

**API:**
```ts
POST /api/credentials
Body: {
  documentType: 'RED_SEAL' | 'SAFETY_TICKET' | 'OTHER',
  file: File (multipart)
}
Response: 201 Created {
  id: string,
  userId: string,
  documentType: string,
  fileName: string,
  status: 'pending',
  createdAt: ISO
}
```

**Acceptance Criteria:**
- [ ] Can select document type
- [ ] Can upload file (drag-drop or picker)
- [ ] File validation works (format, size)
- [ ] Preview shown before upload
- [ ] Upload progress indicator displayed
- [ ] Success message on upload
- [ ] Can skip credential upload
- [ ] Mobile responsive

---

### 4.2 Credential Management UI

#### File: `apps/web/components/credentials/CredentialCard.tsx` (CREATE)
**Purpose:** Display single credential with status and options.

**Display:**
```
[Document Icon] [Red Seal Certificate]
Uploaded: May 18, 2026
Status: ⏳ Pending Verification

[View] [Delete] (if pending/rejected)
```

**Features:**
- Document type with icon
- Upload date
- Verification status (pending, verified, rejected)
- View document link
- Delete button (only if pending or rejected)
- If verified: checkmark badge ✓
- If rejected: rejection reason (optional)

#### File: `apps/web/components/credentials/CredentialList.tsx` (CREATE)
**Purpose:** Display all user credentials grouped by status.

**Sections:**
1. **Verified Credentials** (green)
2. **Pending Credentials** (yellow)
3. **Rejected Credentials** (red)
4. Empty state: "No credentials yet"

**Features:**
- Add credential button (to upload new)
- Status indicators
- Sort by: recent, type
- Pagination if > 10 credentials

#### File: `apps/web/components/credentials/DocumentTypeSelector.tsx` (CREATE)
**Purpose:** Dropdown to select document type.

**Options:**
- Red Seal Certificate (interprovincial trade certification)
- Safety Ticket - WHMIS
- Safety Ticket - Fall Protection
- Safety Ticket - First Aid
- Other Trade Credential

**Features:**
- Descriptions for each type
- Icons
- Search/filter capability (if > 5 types)

---

### 4.3 Credential Verification Workflow

#### File: `apps/web/app/api/credentials/route.ts` (CREATE)
**Purpose:** Handle credential upload and listing.

```ts
POST /api/credentials
- Authenticate user
- Validate file (format, size)
- Store file (local storage for MVP, S3/cloud deferred to Phase 2)
- Create credential record in DB with status: pending
- Return credential object with ID

GET /api/credentials?status=all|pending|verified|rejected
- Fetch user's credentials
- Filter by status if provided
- Return array of credential objects
```

#### File: `apps/web/app/api/credentials/[id]/route.ts` (CREATE)
**Purpose:** Get, update, or delete credential.

```ts
GET /api/credentials/[id]
- Fetch credential details
- Return with document URL

PATCH /api/credentials/[id]
- Admin only: update verification status
- Body: { status: 'verified' | 'rejected', rejectionReason?: string }
- Return updated credential

DELETE /api/credentials/[id]
- Delete credential (user or admin)
- Return success
```

---

### 4.4 Database Schema

#### Update `schema.prisma`:
```ts
model Credential {
  id            String   @id @default(cuid())
  userId        String   @db.VarChar(255)
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  documentType  DocumentType // enum: RED_SEAL, SAFETY_TICKET, OTHER
  fileName      String
  fileUrl       String   // path to stored file
  fileSize      Int      // bytes
  mimeType      String   // e.g., application/pdf
  
  status        CredentialStatus // enum: PENDING, VERIFIED, REJECTED
  verifiedAt    DateTime?
  verifiedBy    String?  // admin user ID (deferred to Phase 2)
  rejectionReason String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

enum DocumentType {
  RED_SEAL
  SAFETY_TICKET_WHMIS
  SAFETY_TICKET_FALL_PROTECTION
  SAFETY_TICKET_FIRST_AID
  OTHER
}

enum CredentialStatus {
  PENDING
  VERIFIED
  REJECTED
}
```

---

### 4.5 Onboarding Integration (Optional)

#### Option A: Add credential upload as optional onboarding step
- File: `apps/web/app/onboarding/credentials/page.tsx`
- Place after profile setup (Step 4.5)
- Skip button to proceed to first contribution
- Success message shows credentials queued for verification

#### Option B: Post-onboarding credential management
- Link from success page: "Add your credentials" (optional)
- Link from profile: "Add credentials" button
- Deferred to post-MVP if timeline tight

---

### 4.6 Display Credentials on Profile (Sprint 6)

**Note:** Displaying verified credentials on public profile happens in Sprint 6 (User Profiles).

---

## Component Library to Build (Sprint 4)

#### `components/credentials/CredentialUploadForm.tsx`
**Props:** `{ onSuccess: (credential) => void; onSkip?: () => void }`
**Output:** Form with type selector, file upload, progress

#### `components/credentials/CredentialCard.tsx`
**Props:** `{ credential: Credential; onDelete?: (id) => void }`
**Output:** Single credential card with status badge

#### `components/credentials/CredentialList.tsx`
**Props:** `{ credentials: Credential[]; onUploadNew: () => void }`
**Output:** Grouped list by status (verified, pending, rejected)

#### `components/credentials/DocumentTypeSelector.tsx`
**Props:** `{ selected: string; onSelect: (type) => void }`
**Output:** Dropdown with document type options

#### `components/ui/FileUploadInput.tsx`
**Props:** `{ onFile: (file) => void; accept?: string; maxSize?: number }`
**Output:** Drag-drop zone + file picker with validation

---

## Testing Checklist (Sprint 4)

### Manual Testing:

1. **File Upload**
   - [ ] Can drag-drop PDF/image file
   - [ ] Can use file picker
   - [ ] File validation works (rejects non-PDF/image)
   - [ ] File size validation works (rejects > 10 MB)
   - [ ] Progress indicator shown during upload
   - [ ] Success message on completion

2. **Credential Management**
   - [ ] Can view uploaded credentials
   - [ ] Status shows pending until verified
   - [ ] Can delete pending/rejected credentials
   - [ ] Cannot delete verified credentials
   - [ ] Can upload multiple credentials

3. **Verification Workflow** (Admin)
   - [ ] Admin can see pending credentials
   - [ ] Admin can mark as verified
   - [ ] Admin can reject with reason
   - [ ] User sees status update
   - [ ] Verified credentials show checkmark

### Automated Testing:

```ts
describe('Credential Upload', () => {
  it('validates file format and size', async () => {
    // Test file format validation
    // Test size validation (reject > 10 MB)
  })
  
  it('uploads credential and returns pending status', async () => {
    // Upload file
    // Verify 201 response
    // Verify status = pending
  })
  
  it('allows user to delete pending credential', async () => {
    // Upload credential
    // Delete it
    // Verify 404 on subsequent GET
  })
})

describe('Credential Verification', () => {
  it('admin can verify credential', async () => {
    // Create pending credential
    // Admin marks as verified
    // Verify user sees verified status
  })
})
```

---

## Acceptance Criteria (Sprint 4 Complete)

- [x] Users can upload credential documents (PDF, image)
- [x] File validation works (format, size limits)
- [x] Credentials display with verification status
- [x] Users can view list of their credentials
- [x] Users can delete pending/rejected credentials
- [x] Credentials stored with metadata
- [x] API endpoints for upload, list, delete working
- [x] Mobile responsive (upload form works on small screens)
- [x] File upload progress indicator shown
- [x] Success/error messages clear
- [x] Manual verification workflow ready (admin review deferred to Phase 2 UI)
- [x] Database schema migrated
- [x] 24+ tests written (unit, component, integration)
- [x] TypeScript strict mode passes
- [x] `pnpm build` succeeds

---

### 4.7 Notification Preferences (1.9 — Final Onboarding Step)

**Goal:** Collect low-frequency notification preferences from users as the final onboarding step.

**Status:** ✅ **COMPLETE** — Database model created, API routes implemented, component and page built, tests passing.

## What Was Built (Notification Preferences Summary)

### ✅ Database Model
- **Created:** `NotificationPreferences` table in Prisma schema
- **Fields:** `weeklyDigest`, `endorsements`, `credentialUpdates`, `communityActivity`, `marketing`
- **Defaults:** Low-frequency (digest, endorsements, credential updates ON; community activity, marketing OFF)
- **Relation:** One-to-one with User

### ✅ API Routes
- **GET `/api/users/me/notification-preferences`** — Returns current prefs (or defaults if not set)
- **PATCH `/api/users/me/notification-preferences`** — Upserts preferences and advances onboarding to step 6
- **Error handling:** 400 for invalid request body, 401 for unauthorized

### ✅ Component
- **Created:** `components/onboarding/NotificationPrefsForm.tsx`
- **Features:** Toggle rows for each preference category with descriptions, low-frequency defaults pre-checked
- **Behavior:** Submit button POSTs to API, shows toast on success/error, redirects to success page

### ✅ Onboarding Page
- **Created:** `app/onboarding/notifications/page.tsx`
- **Step:** Step 6 of 6 in `OnboardingShell`
- **Flow:** Fetches current prefs on mount, submits to API, redirects to `/onboarding/success` on success
- **UX:** Clear explanations of each notification type

### ✅ Updates to Onboarding Flow
- **Modified:** `app/onboarding/first-contribution/page.tsx` — Changed redirect from `/onboarding/success` to `/onboarding/notifications`
- **Modified:** `components/onboarding/OnboardingProgressBar.tsx` — Updated total steps from 5 to 6

### ✅ Testing
- **Unit tests:** 2 tests for GET/PATCH API behavior
- **Component tests:** 3 tests for form rendering, toggling, submission
- **All passing:** 5 tests written, all green

---

#### 4.7.1 Notification Categories

| Toggle | Default | Description |
|--------|---------|-------------|
| Weekly Digest | ON | A weekly summary of activity in your trade |
| Endorsements | ON | When someone endorses your expertise |
| Credential Updates | ON | When your credentials are verified or need attention |
| Community Activity | OFF | Replies and upvotes on your posts |
| Marketing | OFF | Platform news and announcements |

---

#### 4.7.2 Database Schema

```ts
model NotificationPreferences {
  id                 String   @id @default(uuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  weeklyDigest       Boolean  @default(true)
  endorsements       Boolean  @default(true)
  credentialUpdates  Boolean  @default(true)
  communityActivity  Boolean  @default(false)
  marketing          Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@map("notification_preferences")
}
```

---

#### 4.7.3 Acceptance Criteria (Notification Preferences)

- [x] NotificationPreferences model created and migrated
- [x] GET/PATCH API routes working
- [x] NotificationPrefsForm component displays toggles
- [x] `/onboarding/notifications` page functional
- [x] Form submission updates user preferences and onboarding step
- [x] Low-frequency defaults applied
- [x] Integration with onboarding flow (step 6)
- [x] Tests passing (unit + component)
- [x] TypeScript strict mode passes
- [x] `pnpm build` succeeds

---

## Sprint 4 Complete: Credential Import + Notification Preferences

**Status:** ✅ **FULLY COMPLETE**

### Deliverables Shipped:
1. ✅ File upload UI (drag-and-drop, file picker)
2. ✅ Document type selection (Red Seal, safety tickets, other)
3. ✅ File validation (format, size, type)
4. ✅ Credential management UI (upload form, credential list, cards)
5. ✅ API routes (POST, GET, PATCH, DELETE for credentials)
6. ✅ Database schema (Credential table with status tracking)
7. ✅ Onboarding integration (credentials step, skip option)
8. ✅ Profile credentials display (summary with verified/pending counts)
9. ✅ Notification preferences model and API
10. ✅ Notification preferences form and page
11. ✅ Final onboarding step wiring (step 6)

### Testing Complete:
- ✅ 7 unit tests (file validation, document type, status logic)
- ✅ 8 component tests (upload form, credential display, type selector)
- ✅ 7 integration tests (upload API, file storage, verification workflow)
- ✅ 2 E2E tests (complete credential upload flow, verification)
- ✅ 2 unit tests (notification API behavior)
- ✅ 3 component tests (notification form, toggling, submission)
- **Total: 29 tests, all passing**

### Key Metrics:
- **Code coverage:** >75% on new code
- **TypeScript:** Zero errors in strict mode
- **Build:** `pnpm build` succeeds
- **Tests:** All 222 unit tests passing (across all sprints)

---

# Sprint 5: Peer Endorsement System (Weeks 5-6)

**Goal:** Build peer recognition so users can endorse expertise, creating Loop 4 (Peer Recognition & Status).

**Business Goal:** Enable verified professionals to signal expertise, weighted by their own credibility.

**Status:** ✅ **COMPLETE** — All Sprint 5 deliverables implemented and tested. Endorsement API routes, weight calculation, UI components, pages, and comprehensive test suite (23 tests) all operational. Anti-gaming framework validated.

## Automated Testing (Required — Built Alongside Features)

**⚠️ CRITICAL:** Tests are **not** a post-sprint activity. Tests are written **daily as features ship**, using the testing pyramid in [TESTING_STRATEGY.md](TESTING_STRATEGY.md). This sprint allocates **3 days** for:
- **Unit tests:** `antiGaming.ts` cooldown/reciprocal logic, `endorsement.ts` weight calculation (7 tests)
- **Component tests:** EndorseButton modal, EndorsementList filtering (8 tests)
- **Integration tests:** Endorsement API, anti-gaming backend checks (7 tests)
- **E2E tests:** Send → accept/reject endorsement flow (1 test)

**Acceptance criterion:** >75% code coverage on new code; anti-gaming logic blocks duplicate endorsements; cooldown enforced.

**Reference:** [TESTING_STRATEGY.md — Sprint 4 Section](TESTING_STRATEGY.md#sprint-4-peer-endorsements)

## Deliverables

### 4.1 Endorsement API Backend

#### Create: `apps/web/app/api/endorsements/route.ts`
**Purpose:** POST to create endorsement, GET to list received endorsements.

```ts
POST /api/endorsements
Body: {
  recipientId: string,
  topicId: string,
  rationale: string (min 80 chars)
}
Response: 201 Created {
  id: string,
  endorserId: string,
  recipientId: string,
  topicId: string,
  rationale: string,
  status: 'pending' | 'accepted',
  weight: number (1.0 for initial),
  createdAt: ISO
}

GET /api/endorsements?recipientId=...&status=...
Response: {
  items: [
    {
      id,
      endorser: { id, displayName, role, verified },
      topic: { id, name },
      rationale,
      weight,
      createdAt,
      status
    },
    ...
  ]
}
```

#### Create: `apps/web/app/api/endorsements/[id]/route.ts`
**Purpose:** Accept/reject endorsement (recipient only).

```ts
PATCH /api/endorsements/[id]
Body: { status: 'accepted' | 'rejected' }
Response: { status: 'accepted' | 'rejected' }
```

#### Add Validation in API:

```ts
// Endorsement can only be created if:
// 1. Endorser has min 20 published contributions
// 2. Endorser has min 50 reputation points
// 3. Endorser has not endorsed same recipient for same topic in past 30 days
// 4. Endorser is verified (for weighted endorsements)
// 5. Rationale is min 80 chars, max 500 chars

// Weight calculation (in database trigger or API logic):
// baseWeight = 1.0
// if endorserRole == 'master' && verified: weight = 3.0
// if endorserRole == 'journeyperson' && verified: weight = 1.5
// if endorserRole == 'apprentice': weight = 0.5
// if endorser.createdAt < 30 days ago: weight *= 0.5
```

---

### 4.2 Endorsement UI on User Profile

#### Modify: `apps/web/app/users/[id]/page.tsx` (will create in Sprint 5, but plan here)
**Purpose:** Show received endorsements on profile.

**Section: Endorsements Received**
```
[Endorsed by Sarah K. (Journeyperson ✓) for Panel Installation]
"Sarah has consistently demonstrated expertise in wiring residential and commercial panels..."
[Accept] [Reject]  (only if you're the recipient and status = pending)

[Endorsed by Mike T. (Journeyperson ✓) for Troubleshooting Circuits]
...
```

---

### 4.3 Endorsement Button on Profiles & Leaderboard

#### Create: `components/endorsement/EndorseButton.tsx`
**Props:** `{ recipientId: string; recipientName: string; onSuccess: () => void }`
**Output:** Button + Modal form

**Workflow:**
1. Click "Endorse [Name]" button
2. Modal appears:
   ```
   "Endorse Sarah K. for..."
   [Select expertise topic dropdown]
   [Text area: "What makes them great at this? (min 80 chars)"]
   [Cancel] [Submit]
   ```
3. On submit: POST `/api/endorsements { recipientId, topicId, rationale }`
4. On success: Toast "You endorsed Sarah for Panel Installation" + refetch user profile
5. On error: Show error message

**Validation:**
- Topic dropdown populated from user's expertise topics
- Rationale min 80 chars (show counter)
- Submit disabled until form valid
- Check: Can endorser meet criteria? (min contributions, verified, etc.)
  - Fetch `/api/endorsements/check?recipientId=` to validate before showing form
  - Show reason if endorsement blocked

#### Place endorsement button:
- On user profile: "Endorse this person"
- On leaderboard: Small "+" button next to each user

---

### 4.4 Endorsement Notifications

#### Add to Activity Feed (from Sprint 3):
- Endorsement received event type
- "+5 pts: Sarah K. endorsed you for Panel Installation"
- Click to view endorsement

#### Create Toast Notification:
```ts
// In endorsement form submit:
if (response.ok) {
  toast.success(`You endorsed ${recipientName} for ${topicName}`)
  // Optional: Show endorsement weight "journeyperson 1.5x weight"
}
```

---

### 4.5 Verify Anti-Gaming Protections

#### Update Database Schema:
Verify `Endorsement` table has fields:
```
- id (PK)
- endorserId (FK → User)
- recipientId (FK → User)
- topicId (FK → ExpertiseTopic)
- rationale (text, min 80)
- weight (decimal, 1.0–3.0)
- status (enum: pending, accepted, rejected)
- createdAt
- updatedAt
- revokedAt (nullable, for fraud detection)

Unique constraint: (endorserId, recipientId, topicId, month) to prevent duplicate endorsements
```

#### Implement Reciprocal Detection:
When creating endorsement, check if recipient has endorsed endorser for same topic recently.
If yes, weight both endorsements at 0.5x.

```ts
// In POST /api/endorsements:
const reciprocal = await prisma.endorsement.findFirst({
  where: {
    endorserId: recipientId,
    recipientId: endorserId,
    topicId: topicId,
    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }
})

if (reciprocal) {
  // Update both endorsements' weight to 0.5x
  // Log for admin review
}
```

---

## Component Library to Build (Sprint 4)

#### `components/endorsement/EndorseButton.tsx`
**Props:** `{ recipientId, recipientName, onSuccess }`
**Output:** Button opens modal form

#### `components/endorsement/EndorsementList.tsx`
**Props:** `{ endorsements: Endorsement[]; recipientId?: string }`
**Output:** List of received endorsements with accept/reject buttons (if recipient)

#### `components/endorsement/EndorsementCard.tsx`
**Props:** `{ endorsement: Endorsement; canAccept?: boolean; onAccept, onReject }`
**Output:** Single endorsement card with rationale and endorser info

#### `components/endorsement/TopicSelector.tsx`
**Props:** `{ topics: ExpertiseTopic[]; selected: string; onSelect }`
**Output:** Dropdown to select topic for endorsement

---

## Testing Checklist (Sprint 4)

### Manual Testing:

1. **Create Endorsement**
   - [ ] Can click "Endorse [User]" button
   - [ ] Modal shows topics user can endorse for
   - [ ] Rationale field shows character count
   - [ ] Submit disabled until rationale >= 80 chars
   - [ ] Can submit → POST succeeds → toast shown

2. **View Endorsements**
   - [ ] Endorsements display on user profile
   - [ ] Shows endorser name, role badge, topic, rationale
   - [ ] If pending, shows Accept/Reject buttons (for recipient only)
   - [ ] Can accept/reject endorsement

3. **Endorsement Weight**
   - [ ] Master endorsement shows "3.0x weight" or similar
   - [ ] Journeyperson shows "1.5x"
   - [ ] Apprentice shows "0.5x"

4. **Anti-Gaming**
   - [ ] User with < 20 contributions cannot endorse (blocked)
   - [ ] Error message explains why
   - [ ] Reciprocal endorsements flagged (may show warning to endorser)

### Automated Testing:

```ts
describe('Endorsement System', () => {
  it('prevents endorsement from new users', async () => {
    // Create user with 0 contributions
    // Try to POST endorsement
    // Expect 403 Forbidden
  })
  
  it('detects reciprocal endorsements', async () => {
    // User A endorses User B for topic X
    // User B endorses User A for same topic
    // Both endorsements weight should be 0.5x
  })
})
```

---

## Acceptance Criteria (Sprint 4 Complete)

- [ ] Can create endorsement for another user
- [ ] Endorsement requires valid topic and rationale (min 80 chars)
- [ ] Endorsements display on user profile
- [ ] Recipient can accept/reject pending endorsements
- [ ] Endorsement weight calculated correctly (master 3.0x, journeyperson 1.5x, etc.)
- [ ] Cannot endorse with < 20 contributions (blocked with reason)
- [ ] Reciprocal endorsements detected and downweighted
- [ ] Endorsement notifications show in activity feed
- [ ] Mobile responsive (modal works on small screens)
- [ ] All API endpoints respond correctly
- [ ] `pnpm typecheck` and `pnpm build` pass

---

---

# Sprint 6: User Profiles + Mobile Polish (Weeks 6-8)

**Goal:** Complete the profile system so users have discoverable, credible public presence.

**Business Goal:** Enable users to showcase expertise to employers and peers; build network effects.

## Automated Testing (Required — Built Alongside Features)

**⚠️ CRITICAL:** Tests are **not** a post-sprint activity. Tests are written **daily as features ship**, using the testing pyramid in [TESTING_STRATEGY.md](TESTING_STRATEGY.md). This sprint allocates **4 days** for:
- **Component tests:** PublicProfile tabs, ProfileSettings form (10 tests)
- **Integration tests:** Profile API endpoints (3 tests)
- **E2E tests:** Profile setup, public visibility (2 tests)
- **Performance tests:** Lighthouse audit on key pages (LCP <2.5s mobile, CLS <0.1)
- **Accessibility tests:** WCAG 2.1 AA compliance, axe-core scan on all pages

**Acceptance criterion:** >75% code coverage on new code; Lighthouse score ≥90 on mobile; zero accessibility violations (A, AA).

**Reference:** [TESTING_STRATEGY.md — Sprint 5 Section](TESTING_STRATEGY.md#sprint-5-profiles--mobile--accessibility) and [Performance & Accessibility Testing](TESTING_STRATEGY.md#layer-5-performance--accessibility-testing)

## Deliverables

### 5.1 Public User Profile Page

#### File: `apps/web/app/users/[id]/page.tsx` (CREATE)
**Purpose:** Public-facing user profile showing expertise, contributions, and endorsements.

**Layout:**

```
[HEADER]
├─ Profile photo (if set)
├─ Name + Role badge (Apprentice | Journeyperson ✓ | Master ✓)
├─ Years of experience + Province
├─ Reputation score + "Expert" or "Mentor eligible" badge
└─ [Endorse this person] [Message] (if not own profile)

[TABS]
├─ Overview (default)
├─ Contributions
├─ Endorsements
└─ Expertise

[OVERVIEW TAB]
├─ Bio (if set)
├─ Quick stats:
│  ├─ 580 reputation points
│  ├─ 24 posts published
│  ├─ 18 answers accepted
│  └─ 12 endorsements received
├─ Top 3 expertise topics with point bars
└─ Recent activity (last 5)

[CONTRIBUTIONS TAB]
├─ List of user's 10 most recent published content
├─ Shows: title, votes, answers count, date
└─ Pagination

[ENDORSEMENTS TAB]
├─ List of all received endorsements
├─ Grouped by topic
├─ Shows: endorser name + role, topic, weight, rationale
└─ If own profile: Accept/reject buttons for pending

[EXPERTISE TAB]
├─ Leaderboard position in each topic
├─ "Ranked #5 in Panel Installation" (250 pts)
├─ "Ranked #12 in Troubleshooting Circuits" (180 pts)
└─ [See full leaderboard] link
```

**API Contracts:**

```ts
GET /api/users/[id]?includePrivate=true (if requester is self)
Response: {
  id, displayName, email (if self), role, verified,
  yearsExperience, provinceCode, bio, profilePhotoUrl,
  reputationScore: 580,
  createdAt, lastActiveAt,
  trades: [ { id, name, specialisations: [...] } ],
  topicsCount: 15,
  postsPublished: 24,
  answersAccepted: 18,
  endorsementsReceived: 12,
  isMentorEligible: true | false
}

GET /api/users/[id]/content?limit=10&offset=0
Response: {
  items: [
    { id, type, title, upvotes, answers, createdAt },
    ...
  ]
}

GET /api/users/[id]/endorsements
Response: {
  items: [
    {
      id, endorser: { id, displayName, role },
      topic: { id, name },
      rationale, weight,
      status, createdAt
    },
    ...
  ]
}

GET /api/users/[id]/expertise
Response: {
  items: [
    { topicId, topicName, points: 250, leaderboardRank: 5 },
    ...
  ]
}
```

**Acceptance Criteria:**
- [ ] Profile page loads and displays correct user data
- [ ] Tab navigation works
- [ ] Contributions tab shows user's posts/answers
- [ ] Endorsements tab shows received endorsements
- [ ] Expertise tab shows topic rankings
- [ ] "Endorse this person" button visible (if not own profile)
- [ ] Own profile shows editable fields (defer to Sprint 5.2)
- [ ] Mobile responsive
- [ ] Loads in <1.5s

---

### 5.2 Private Profile Settings Page

#### File: `apps/web/app/profile/settings/page.tsx` (CREATE)
**Purpose:** User can edit their own profile.

**Form Fields:**
- Display name (required)
- Bio (optional, max 500 chars)
- Years of experience (optional)
- Province (optional)
- Profile photo upload (optional, can defer file upload to Phase 2)
- Email (display only, read-only)
- Account status (display only)

**API:**
- PATCH `/api/users/me { displayName, bio, yearsExperience, provinceCode }`

**Features:**
- Character counter for bio
- Form validation
- Save button disabled until changes made
- Success toast on save
- Error handling

**Acceptance Criteria:**
- [ ] Can edit all profile fields
- [ ] Changes saved to database
- [ ] Public profile updates immediately
- [ ] Form validates required fields
- [ ] Mobile responsive

---

### 5.3 Mobile Optimization Pass

**Goal:** Ensure all views work on mid-range Android phones (375px width, slow 3G).

#### Checklist:

1. **Tap Targets**
   - [ ] All buttons ≥44px height (at least)
   - [ ] All links ≥44px height
   - [ ] Buttons spaced ≥8px apart
   - [ ] Use `touch-target-size` in Tailwind or custom class

2. **Typography & Readability**
   - [ ] Base font size ≥16px (no zoom required on input focus)
   - [ ] Line height ≥1.5 for body text
   - [ ] Headings clear hierarchy (h1, h2, h3 sizes distinct)
   - [ ] High contrast: ink-900 on white or white on trades-500

3. **Layouts**
   - [ ] No horizontal scroll (except intentional carousels)
   - [ ] Modal dialogs fit screen (padding, scrollable body)
   - [ ] Lists stack vertically on mobile
   - [ ] Images scale responsively (not fixed width > 100vw)

4. **Forms**
   - [ ] Input fields stack vertically
   - [ ] Labels above inputs (not side-by-side on mobile)
   - [ ] Keyboard doesn't hide submit button (use `space-y-6`)
   - [ ] Form error messages readable without scrolling

5. **Navigation**
   - [ ] Sticky header doesn't cover content (adequate top padding)
   - [ ] Mobile menu (if needed) accessible
   - [ ] Bottom nav has adequate spacing

6. **Performance**
   - [ ] First paint < 2s on 3G
   - [ ] Images lazy-loaded (use Next.js Image component)
   - [ ] No large JavaScript bundles
   - [ ] Fonts load without layout shift

#### Testing on Real Devices:

- [ ] Test on iOS Safari (iPhone SE or similar)
- [ ] Test on Chrome Android (mid-range Samsung A-series or similar)
- [ ] Test on slow 3G (DevTools throttling)
- [ ] Test with gloves/thick fingers (44px+ targets)
- [ ] Test with dirty/muddy screen (high contrast colors)

#### Files to Update:

**Audit all pages created so far:**
- `app/page.tsx` (landing)
- `app/onboarding/**/page.tsx` (onboarding flow)
- `app/community/page.tsx` (feed)
- `app/community/[id]/page.tsx` (detail)
- `app/dashboard/page.tsx` (dashboard)
- `app/leaderboards/[trade]/page.tsx` (leaderboards)
- `app/users/[id]/page.tsx` (profile)
- All forms and modals

**Updates likely needed:**
```tsx
// Mobile breakpoints in Tailwind:
// sm: 640px (iPad mini)
// md: 768px (iPad)
// lg: 1024px (iPad Pro, desktop)
// xl: 1280px (wide desktop)

// Use responsive classes:
// "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" (stacks on mobile)
// "text-base sm:text-lg" (larger on desktop)
// "p-4 sm:p-6 lg:p-8" (more padding on larger screens)

// Ensure buttons are at least 44px:
// "btn-primary py-2.5 px-4" // 40px tall + padding = 44+
// OR
// "h-11 px-4" // Explicit 44px height
```

---

### 5.4 Accessibility Audit

**Goal:** WCAG 2.1 AA compliance (from BUSINESS_REQUIREMENTS.md, Section 9).

#### Checklist:

1. **Color Contrast**
   - [ ] All text ≥ 4.5:1 contrast ratio (normal text)
   - [ ] All UI elements ≥ 3:1 contrast ratio
   - [ ] Use WebAIM Contrast Checker or browser DevTools

2. **Keyboard Navigation**
   - [ ] Can tab through all interactive elements
   - [ ] Tab order logical (left-to-right, top-to-bottom)
   - [ ] Focus visible (outline or highlight)
   - [ ] Can submit forms with Enter key

3. **Screen Reader Testing**
   - [ ] All images have alt text
   - [ ] Form inputs have labels (associated with `for` attribute)
   - [ ] Buttons have text or aria-label
   - [ ] Semantic HTML (use `<button>`, `<a>`, `<label>`, not divs)
   - [ ] No empty headings

4. **Motion & Animation**
   - [ ] No seizure-inducing flashes (< 3 flashes/sec)
   - [ ] Respect `prefers-reduced-motion` (disable Framer Motion if set)
   - [ ] Add Tailwind config: `media: ['prefers-reduced-motion']`

5. **Language**
   - [ ] Plain English, avoid jargon where possible
   - [ ] Technical trades terms are OK (part of user's expertise)
   - [ ] Sentences < 20 words where possible
   - [ ] Use short paragraphs

#### Test Tools:

- Chrome DevTools: Lighthouse Accessibility audit
- axe DevTools browser extension
- WAVE (WebAIM Evaluation Tool)
- Screen reader: NVDA (Windows) or VoiceOver (Mac)

#### Update Tailwind Config:

```ts
// tailwind.config.ts
const config: Config = {
  // ...
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [
    // Respect motion preferences
    plugin(function({ addUtilities, e, matchUtilities, theme }) {
      matchUtilities(
        {
          'motion-reduce': (value) => ({
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
              transition: 'none',
            },
          }),
        }
      )
    }),
  ],
}

// Usage in components:
// <motion.div initial={{ opacity: 0 }} className="motion-reduce:static">
```

---

### 5.5 Browser Compatibility & Testing

**Target Browsers:**
- Chrome/Edge 120+ (latest)
- Safari 17+ (latest)
- Firefox 122+ (latest)
- Mobile: iOS Safari 17+, Chrome Android 120+

**Test on:**
- BrowserStack (if available) or local browsers
- Focus on mobile browsers (mid-range Android, iPhone)

**Verify:**
- [ ] No console errors or warnings
- [ ] All API calls succeed
- [ ] Images load correctly
- [ ] Forms submit without issues
- [ ] Links navigate correctly
- [ ] No broken styles

---

## Component Library Refinements (Sprint 5)

Refine and polish existing components:

#### `components/ui/Button.tsx` (if not exists)
**Standard button component with variants:**
- primary, secondary, ghost, danger
- Sizes: sm, md, lg
- Ensure 44px min height on mobile

#### `components/ui/Modal.tsx`
**Ensure all modals:**
- Scrollable body (doesn't hide buttons)
- Close button (X) accessible
- Escape key closes
- Focus trap (focus stays in modal)
- Works on mobile (full-screen or overlay)

#### `components/layouts/MobileNav.tsx`
**Mobile navigation:**
- Sticky footer nav with main sections
- Icons + labels
- Active state indication

---

## Testing Checklist (Sprint 5)

### Manual Testing:

1. **User Profile**
   - [ ] Public profile displays correct user info
   - [ ] Tabs switch correctly
   - [ ] Contributions listed with vote counts
   - [ ] Endorsements displayed with weight
   - [ ] Can endorse from profile
   - [ ] Profile settings editable

2. **Mobile Testing**
   - [ ] All pages accessible on 375px width
   - [ ] No horizontal scroll
   - [ ] Buttons ≥44px
   - [ ] Can complete onboarding on mobile
   - [ ] Can post content on mobile
   - [ ] Forms usable on mobile
   - [ ] First paint < 2s on 3G

3. **Accessibility**
   - [ ] Can navigate with keyboard only
   - [ ] Tab order logical
   - [ ] Form labels associated
   - [ ] Images have alt text
   - [ ] Screen reader announces buttons, links
   - [ ] No low-contrast text

### Automated Testing:

```ts
describe('Mobile Responsiveness', () => {
  it('buttons are at least 44px tall on mobile', async () => {
    // Render page at 375px viewport
    // Measure all button heights
    // Expect all >= 44px
  })
  
  it('has no horizontal scroll on mobile', async () => {
    // Viewport 375px
    // Check max-width doesn't exceed 100vw
  })
})

describe('Accessibility', () => {
  it('passes axe accessibility audit', async () => {
    // Use axe-core library
    // Render page
    // Run audit
    // Expect 0 violations
  })
})
```

### Lighthouse Audit:

```bash
# Run Lighthouse on each major page
npx lighthouse http://localhost:3000/community --output-path=./lighthouse/community.html
npx lighthouse http://localhost:3000/dashboard --output-path=./lighthouse/dashboard.html
npx lighthouse http://localhost:3000/users/[test-user-id] --output-path=./lighthouse/profile.html

# Goals:
# - Performance: >80
# - Accessibility: >95
# - Best Practices: >90
# - SEO: >90
```

---

## Acceptance Criteria (Sprint 5 Complete)

- [ ] `/users/[id]` displays user profile with all sections
- [ ] Can view user's contributions, endorsements, expertise
- [ ] Can endorse user from profile
- [ ] `/profile/settings` allows editing own profile
- [ ] All changes save to database
- [ ] Mobile responsive: <375px width works, no scroll
- [ ] All buttons ≥44px (mobile friendly)
- [ ] First paint < 2s on 3G
- [ ] Keyboard navigation works
- [ ] No console errors or warnings
- [ ] Lighthouse scores >80 across the board
- [ ] WCAG 2.1 AA compliance verified
- [ ] `pnpm typecheck` and `pnpm build` pass

---

---

# Phase 1 MVP Definition (All Sprints Complete)

## What's Shipped

### ✅ Core Onboarding
- 5-step guided flow (role → trade → specialisation → profile → first contribution)
- Optional credential import (Red Seal, safety tickets) during onboarding
- Dev stub auth support
- Account transitions to `active` on completion
- First content posts automatically to platform

### ✅ Knowledge Community
- Full Q&A feed with search, filter, sort
- Can ask questions, post answers
- Upvote/downvote system with real-time counts
- Bookmark/save content for later
- AI screening status visible (pending/published/flagged)
- Content detail page with full thread

### ✅ Reputation System
- Personal dashboard showing score breakdown
- Progress bar to mentor tier (750 points)
- Expertise topic rankings (top 5)
- Activity feed of reputation events (+pts from posts, upvotes, endorsements)
- Public leaderboards by trade (top 50, with current rank)
- Real-time score updates

### ✅ Peer Endorsement
- Can endorse other users for expertise topics
- Endorsement weighted by endorser's role (master 3.0x, journeyperson 1.5x, etc.)
- Anti-gaming protections: min 20 contributions, 50 points to endorse
- Reciprocal detection (paired endorsements downweighted)
- Endorsements visible on profile

### ✅ User Profiles
- Public profile showing expertise, contributions, endorsements
- Profile tabs: Overview, Contributions, Endorsements, Expertise
- Own profile editable (name, bio, years of experience)
- Profile discovery via leaderboards

### ✅ Mobile & Accessibility
- All pages work on 375px+ screens
- 44px+ tap targets
- Keyboard navigation
- WCAG 2.1 AA compliance
- <2s first paint on 3G

---

## Phase 1 Success Metrics (Exit Criteria)

From BUSINESS_REQUIREMENTS.md, Section 13:

- [ ] **500+ daily active users** in knowledge community
- [ ] **60%+ onboarding completion** (through first contribution)
- [ ] **<1% fraudulent credentials** in audit sample
- [ ] **1 signed institutional partnership** (union or apprenticeship board)
- [ ] **200+ published posts/week**
- [ ] No major UX friction in usability testing (15+ target users)
- [ ] Reputation scoring stable (score recalculation <20% variance)
- [ ] AI screening accuracy <5% false positive + false negative combined

---

## Known Deferrals to Phase 2

- Mentorship tier (requires Phase 1 reputation data)
- Credential wallet & Open Badges
- Institutional bulk verification
- Union/employer dashboards
- Advanced admin tools
- Native mobile app
- Real-time WebSocket notifications (polling OK for Phase 1)
- File uploads (profile photo, credential documents)
- Red Seal exam prep tools

---

## Deployment & Launch Checklist

Before shipping to production:

- [ ] All 5 sprints complete
- [ ] Typecheck passes (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No console errors in production build
- [ ] All API endpoints tested with curl/Postman
- [ ] Database migrations run successfully
- [ ] Auth0 production config set
- [ ] Environment variables all set (prod)
- [ ] Rate limiting active (on production-grade service)
- [ ] Security headers configured
- [ ] HTTPS/TLS enforced
- [ ] Logging & error tracking configured (Sentry or similar)
- [ ] Database backups configured (daily)
- [ ] Monitoring set up (uptime, error rates, API latency)
- [ ] Load testing done (can handle 1,000 concurrent users)
- [ ] Disaster recovery plan documented
- [ ] Terms of Service reviewed by legal
- [ ] Privacy policy reviewed by legal
- [ ] Accessibility audit completed
- [ ] Security audit completed (especially auth, credentials, data residency)

---

## Team & Timeline

**Team Capacity:** 1 developer (you) or small team
**Duration:** 8 weeks (2 months)
**Target Ship Date:** Mid-July 2026 (from start of Sprint 1)

**Weekly Check-ins:**
- EOD Friday: Demo what shipped
- Monday: Plan next week's priorities
- Adjust based on blockers, discoveries, UX feedback

---

## How to Use This Document

1. **Reference During Work:** Keep open while coding. Use section headings to jump to current sprint.
2. **Track Progress:** Mark acceptance criteria as complete.
3. **Escalate Blockers:** If stuck, note issue in Sprint section and raise for discussion.
4. **Update as You Go:** If requirements change or new learnings emerge, update relevant section (don't delete, add `[UPDATED]` marker).
5. **Hand-Off:** If taking a break or handing off to another developer, update "Last Updated" timestamp and "Current Work" note at top.

---

## Questions or Issues?

- Feature scope unclear? Check BUSINESS_REQUIREMENTS.md (Sections 8–10)
- API contract unclear? Check existing route files in `apps/web/app/api/`
- Styling/design unclear? Check `apps/web/tailwind.config.ts` and existing components
- Database schema unclear? Check `packages/db/prisma/schema.prisma`

---

**Document Version:** 1.0  
**Next Review:** After Sprint 2 (end of Week 3)  
**Owner:** Development Team

