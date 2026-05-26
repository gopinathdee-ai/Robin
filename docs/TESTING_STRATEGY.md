# Testing Strategy — Robin Platform

> **Purpose:** Define the testing framework, coverage targets, and integration points for the trades platform.  
> Reviewed by: Both co-founders before implementation.

---

## Testing Philosophy

- **Security-first:** Auth flows, credential issuance, and data validation REQUIRE tests before merge
- **Pragmatic coverage:** 80% target on business logic; lower on UI chrome
- **CI/CD integration:** Tests run automatically on every PR — failing tests block merge
- **Developer velocity:** Fast feedback loop — tests complete in <5 minutes

---

## Framework Choices

| **Layer** | **Framework** | **Runner** | **Rationale** |
|-----------|---------------|-----------|---------------|
| **Unit & Integration (API)** | Vitest | Node.js | Fast, ESM-native, excellent TypeScript support, Prisma-compatible |
| **Unit (React Components)** | Vitest + React Testing Library | Node.js | Industry standard, focuses on user behavior not implementation |
| **E2E (Full flows)** | Playwright | Chromium | Reliable, fast, cross-browser, excellent for PWA testing |
| **API Integration** | Vitest + node-fetch or axios | Node.js | Test real Express routes against test PostgreSQL |

---

## Implementation Roadmap

### **Phase 1 — Foundation (Week 1)**

**Setup in both `apps/api` and `apps/web`:**

```bash
pnpm add -D vitest @vitest/ui
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D playwright @playwright/test
```

**Create test structure:**

```
apps/api/
  src/
    __tests__/
      unit/              # Pure function tests
      integration/       # Route + database tests
      fixtures/          # Test data generators
apps/web/
  app/
    __tests__/          # Component tests
```

**Configure vitest.config.ts in both apps:**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // 'jsdom' for React components
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['node_modules/', 'dist/', '**/*.config.*'],
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    }
  }
})
```

**Add test scripts to package.json:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

---

### **Phase 2 — Security-Critical Tests (Week 1–2)**

**Priority order — do these first:**

1. **Auth middleware** (apps/api/src/middleware/auth.ts)
   - Valid JWT passes
   - Invalid JWT rejected
   - Expired token rejected
   - Missing token rejected

2. **Input validation** (all Zod schemas)
   - Valid input passes
   - Invalid input rejected with correct error message
   - Min/max length enforced
   - Type mismatches caught

3. **Credential issuance** (apps/api/src/services/credentialService.ts)
   - Credential issued correctly
   - Cryptographic signature valid
   - Only authorized users can issue
   - Revocation works

4. **Database isolation**
   - User cannot query another user's data
   - Soft deletes respected (status = REMOVED)
   - organisation_id filtering enforced

**Test template for Express routes (Vitest + Prisma):**

```typescript
// apps/api/src/__tests__/integration/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@db/client'
import express from 'express'
import { usersRouter } from '../../routes/users'

describe('PATCH /api/users/me', () => {
  let app: express.Application
  let testUser: any

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use('/api/users', usersRouter)
    
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        displayName: 'Test User',
        auth0Id: 'auth0|test123'
      }
    })
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.user.delete({ where: { id: testUser.id } })
  })

  it('should update user profile with valid data', async () => {
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ displayName: 'Updated Name' })
    
    expect(res.status).toBe(200)
    expect(res.body.displayName).toBe('Updated Name')
  })

  it('should reject displayName < 2 chars', async () => {
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ displayName: 'X' })
    
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/validation/i)
  })
})
```

---

### **Phase 3 — Full Coverage Build-Out (Ongoing)**

**By the end of each sprint, add tests for:**

- Every new API route
- Every Zod schema
- Every Prisma query
- Every service function
- All conditional logic (if/else branches)

**Exclude from coverage targets:**

- Next.js generated files
- UI chrome (styling, layout-only components)
- Third-party library code

---

## Integration with Development Workflow

### **Local development:**

```bash
# Watch mode — tests re-run on file save
pnpm test

# UI mode — visual test explorer
pnpm test:ui

# Check coverage before commit
pnpm test:coverage
```

### **CI/CD (GitHub Actions):**

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: trades_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

**PR merge rules:**

- ✅ All tests pass
- ✅ Coverage ≥ 80% on modified files (use codecov.io to track)
- ✅ Security tests pass (auth, validation, credential issuance)
- ❌ Any test failure blocks merge

---

## Updated PR Checklist

Add to SYSTEM_PROMPT.md **Checklist Before Opening a PR** section:

```
- [ ] All new API routes have unit + integration tests
- [ ] All new Zod schemas have validation tests
- [ ] Security-sensitive code reviewed by co-founder
- [ ] Test coverage ≥ 80% on new code (`pnpm test:coverage`)
- [ ] All tests passing locally (`pnpm test`)
- [ ] E2E tests passing for user-facing changes (`pnpm test:e2e`)
```

---

## Test Data & Fixtures

Create a reusable fixture generator to avoid duplication:

```typescript
// apps/api/src/__tests__/fixtures/users.ts
import { prisma } from '@db/client'

export async function createTestUser(overrides = {}) {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      displayName: 'Test User',
      auth0Id: `auth0|test-${Date.now()}`,
      role: 'JOURNEYPERSON',
      status: 'ACTIVE',
      provinceCode: 'AB',
      ...overrides
    }
  })
}

export async function createTestContent(userId: string, overrides = {}) {
  return prisma.content.create({
    data: {
      authorId: userId,
      type: 'QUESTION',
      title: 'Test Question',
      body: 'This is a test question body with enough content.',
      status: 'PUBLISHED',
      ...overrides
    }
  })
}
```

Then import and use in tests:

```typescript
const testUser = await createTestUser({ role: 'MASTER' })
const content = await createTestContent(testUser.id)
```

---

## Monitoring Test Health

Track over time:

- **Coverage trend:** Aim for 80%+ within 4 weeks
- **Test execution time:** Should stay under 5 minutes total
- **Flaky test detection:** Any test that fails >1% of the time is a bug in the test
- **Security test pass rate:** 100% non-negotiable

Use GitHub Actions artifacts to archive coverage reports and spot trends.

---

## When to Test vs. Manual QA

| **Scenario** | **Test** | **Manual** |
|---|---|---|
| Auth flows, credential issuance, validation logic | ✅ Yes | |
| UI layout, animations, visual polish | | ✅ Manual at 375px width |
| New third-party library integration | ✅ Yes | ✅ Also manual |
| Accessibility (WCAG) | ✅ Partial (a11y testing lib) | ✅ Full manual |
| Cross-browser (iOS Safari, Android Chrome) | ✅ Playwright | ✅ Real device |

---

## Questions for Co-Founder Review

Before implementing, agree on:

1. Is Vitest + Playwright the right choice, or prefer Jest + Cypress?
2. Coverage target: 80% or higher?
3. Can we enforce tests in the GitHub branch protection rule (no merge without passing tests)?
4. Who writes tests — developer as part of feature, or separate QA pass?

---

**Testing is not optional for a credentialing platform. Treat it like security.**
