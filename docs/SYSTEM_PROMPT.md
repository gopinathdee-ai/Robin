# SYSTEM_PROMPT.md

> This file defines the code style, conventions, and architectural rules for the  
> Trades Platform codebase. All contributors — human and AI — follow these rules.  
> When using Claude Code or Cursor, paste the relevant sections as context.

---

## Project Identity

**Platform:** Trades Credential & Mentorship Platform (internal codename: Robin)  
**Purpose:** Portable skills records, earned mentorship, and Open Badge credentials  
for Canada's skilled trades workforce.  
**Stack:** Next.js 15 · Express · TypeScript · Prisma · PostgreSQL · Redis · Auth0  
**Monorepo:** pnpm workspaces — `apps/web`, `apps/api`, `packages/db`  
**Docs:** `/docs/BUSINESS_REQUIREMENTS.md`, `/docs/DATABASE_SCHEMA.md`, `/docs/API_ENDPOINTS.md`, `/docs/SYSTEM_PROMPT.md`

---

## Core Principles

1. **The tradesperson owns their record.** No design decision, data model, or feature should transfer ownership of a user's credentials or learning history to an employer or organisation.
2. **Earn don't claim.** Mentor status, expert status, and reputation are earned through the platform's data — never self-declared.
3. **Mobile first, job site ready.** Every screen works at 375px, with dirty hands, on a 3G connection, on a mid-range Android device.
4. **Transparent mechanics.** Reputation thresholds, scoring weights, and audit criteria are visible to users. Hidden systems erode trust.
5. **Security is not optional.** Credential-issuing code, auth flows, and PII handling require human review before merge — no exceptions.

---

## TypeScript Rules

```typescript
// ✅ Always use explicit return types on functions
async function getUser(id: string): Promise<User | null> {}

// ✅ Use type aliases for domain objects, interfaces for shapes
type UserId = string
interface UserProfile { id: UserId; displayName: string }

// ✅ Use Zod for all runtime validation at API boundaries
const schema = z.object({ body: z.string().min(20).max(10000) })

// ❌ Never use `any` — use `unknown` and narrow it
const data: unknown = JSON.parse(raw)

// ❌ Never use non-null assertion without a comment explaining why
const user = getUser()! // dangerous — use null check instead

// ✅ Prefer optional chaining and nullish coalescing
const name = user?.displayName ?? 'Anonymous'

// ✅ Enums from Prisma — use the generated types directly
import { UserRole, ContentStatus } from '@prisma/client'
```

**TypeScript config:** `strict: true` — no exceptions. Fix the error, don't suppress it.

---

## File and Folder Naming

```
apps/web/
  app/                        # Next.js App Router — route segments
    (auth)/                   # Route group — auth screens
      sign-in/page.tsx
      sign-up/page.tsx
    onboarding/
      role/page.tsx
      trade/page.tsx
    dashboard/page.tsx
  components/
    ui/                       # Generic reusable components (Button, Input, Card)
      Button.tsx              # PascalCase for component files
      Input.tsx
    onboarding/               # Feature-scoped components
      OnboardingShell.tsx
  lib/
    auth.ts                   # Auth0 helpers
    api.ts                    # API client (fetch wrapper)
    utils.ts                  # Shared utilities
  hooks/                      # Custom React hooks — useUser.ts, useReputation.ts

apps/api/src/
  routes/                     # One file per resource
    users.ts
    content.ts
    credentials.ts
  services/                   # Business logic — one file per domain
    aiScreening.ts
    reputationService.ts
    credentialService.ts
  middleware/
    auth.ts                   # Auth0 JWT verification
    rateLimit.ts
  types/                      # Shared TypeScript types for the API
    index.ts
```

**Rules:**
- Component files: `PascalCase.tsx`
- Everything else: `camelCase.ts`
- Route files named after the resource: `users.ts`, `content.ts`
- No `index.ts` barrel files in routes or services — import directly

---

## Component Patterns

```tsx
// ✅ Server Component by default (no 'use client' unless needed)
// Add 'use client' only when you need: useState, useEffect, event handlers,
// browser APIs, or third-party client libraries

// ✅ Props interface defined above the component
interface OnboardingShellProps {
  step: number
  totalSteps: number
  title: string
  children: React.ReactNode
}

export function OnboardingShell({ step, totalSteps, title, children }: OnboardingShellProps) {
  // ...
}

// ✅ Named exports — not default exports for components
// (exception: Next.js page.tsx files must be default exports)

// ❌ Do not inline complex logic in JSX — extract to a variable or function
// Bad:
<div>{items.filter(i => i.active).sort((a,b) => b.score - a.score).map(i => <Item key={i.id} {...i} />)}</div>

// Good:
const sortedActiveItems = items.filter(i => i.active).sort((a,b) => b.score - a.score)
return <div>{sortedActiveItems.map(i => <Item key={i.id} {...i} />)}</div>
```

---

## Styling Rules (Tailwind CSS)

```tsx
// ✅ Use the design tokens defined in tailwind.config.ts
// trades-500 = primary orange (#c8511b)
// ink-900 = near-black (#1a1007)
// ink-100 = light background (#faf5f0)

// ✅ Use component classes defined in globals.css for repeated patterns
<button className="btn-primary">Continue</button>
<div className="card">...</div>
<input className="input" />

// ✅ Use clsx for conditional classes
import { clsx } from 'clsx'
<div className={clsx('rounded-xl border-2 px-4 py-3', isSelected && 'border-trades-500 bg-trades-50')} />

// ❌ Do not write inline style={{ }} — use Tailwind classes
// ❌ Do not use arbitrary values like w-[347px] — use spacing scale

// ✅ Mobile-first — write base styles for mobile, add sm:/md:/lg: for larger
<div className="px-4 py-6 sm:px-8 sm:py-10" />

// ✅ Minimum tap target 44px for all interactive elements
<button className="min-h-[44px] min-w-[44px]" />
```

---

## API Route Patterns

```typescript
// ✅ Standard route structure
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

export const usersRouter = Router()

// ✅ Validate all input with Zod at the top of the handler
const patchSchema = z.object({
  displayName: z.string().min(2).max(120).optional(),
  provinceCode: z.string().length(2).optional(),
})

usersRouter.patch('/me', requireAuth, async (req, res) => {
  try {
    const data = patchSchema.parse(req.body)
    // business logic here
    return res.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors })
    }
    throw err  // let the global error handler catch it
  }
})

// ✅ Always return from res.json() — avoids "headers already sent" errors
// ✅ Use 201 for created resources, 202 for accepted async operations
// ✅ Use 204 for successful deletes with no body

// ❌ Never return sensitive fields (password hashes, internal IDs, auth tokens)
// ❌ Never catch and swallow errors silently
```

---

## Database / Prisma Rules

```typescript
// ✅ Import Prisma client from a singleton
// packages/db/src/client.ts
import { PrismaClient } from '@prisma/client'
const prisma = global.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prisma = prisma
export { prisma }

// ✅ Always select only the fields you need
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, displayName: true, role: true }
})

// ✅ Use transactions for operations that must succeed together
await prisma.$transaction([
  prisma.reputationEvent.create({ data: event }),
  prisma.reputationScore.update({ where: { userId }, data: { totalScore: { increment: points } } })
])

// ❌ Never write directly to reputationScores.totalScore outside a transaction
// ❌ Never expose raw database errors to API responses
// ❌ Never skip the where clause on update or delete

// ✅ Soft delete pattern — never hard delete user data
await prisma.content.update({
  where: { id },
  data: { status: 'REMOVED' }
})
```

---

## Security Rules

These are non-negotiable. A code review that finds a violation should block the merge.

```
1. All credential-issuing code requires human review before merge
2. All auth flow changes require human review before merge  
3. OWASP ZAP scan must pass before any production deployment
4. No secrets in code — use environment variables only
5. No .env file committed to git — .env.example only
6. PII stored in AWS ca-central-1 only — never us-east-1 or other regions
7. UUIDs in all public URLs — never sequential integer IDs
8. Input validated with Zod at every API boundary — never trust req.body directly
9. AI-generated code in auth/credential paths requires extra scrutiny
10. Rate limiting applied to all mutation endpoints
```

---

## Git Conventions

```
# Commit message format: <type>(<scope>): <description>
# Types: feat | fix | chore | docs | refactor | test | style

feat(onboarding): add trade specialisation picker to step 2
fix(api): return 422 instead of 500 for self-endorsement attempt
chore(deps): update next to 15.2.8
docs(schema): add organisations table to DATABASE_SCHEMA.md
refactor(reputation): extract score calculation to reputationService

# Rules:
# - Present tense: "add feature" not "added feature"
# - Max 72 chars on the first line
# - Leave a blank line before extended description
# - Reference issue numbers where relevant: "closes #42"
```

**Branch naming:**
```
feature/auth0-integration
fix/onboarding-trade-picker-validation
chore/prisma-migration
docs/update-api-endpoints
```

**Branch rules:**
- `main` is always deployable
- No direct pushes to `main` once both founders are active — use short-lived branches
- PR requires at least one co-founder review before merge
- Delete branches after merge

---

## Environment Variables

All environment variables are documented in `.env.example`.  
Never add a variable to the code without adding it to `.env.example` first.

```bash
# Naming convention: SCREAMING_SNAKE_CASE
# Prefix public (browser-visible) Next.js vars with NEXT_PUBLIC_
# Never prefix server-only vars with NEXT_PUBLIC_

ANTHROPIC_API_KEY=         # server only
AUTH0_CLIENT_SECRET=       # server only
DATABASE_URL=              # server only
NEXT_PUBLIC_API_URL=       # browser-visible — safe, no secrets
```

---

## AI Coding Assistant Guidelines (Claude Code / Cursor)

When using AI coding tools on this project:

0. **Read BUSINESS_REQUIREMENTS.md first** — understand what you're building, why it matters, and the product decisions (credential verification, engagement loops, content liability, anti-gaming rules)
1. **Always provide this file as context** for any new feature work
2. **Reference DATABASE_SCHEMA.md** for any database query or schema change
3. **Reference API_ENDPOINTS.md** for any new route or endpoint change
4. **Review all generated code** — do not merge AI output without reading it
5. **Never let AI generate** auth flows, credential-issuing logic, or migration files without human review
6. **Preferred prompt pattern:**
   ```
   I am building the [feature name] for the Trades Platform (Robin).
   Stack: Next.js 15, Express, TypeScript, Prisma, PostgreSQL, Auth0.
   Follow the conventions in SYSTEM_PROMPT.md.
   Reference BUSINESS_REQUIREMENTS.md for product context and decisions.
   Reference DATABASE_SCHEMA.md for data shapes.
   
   Build: [specific thing to build]
   Do not: [specific things to avoid]
   ```

---

## Checklist Before Opening a PR

- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] All new API routes have Zod validation
- [ ] All new database queries select only needed fields
- [ ] No `console.log` left in production code paths
- [ ] `.env.example` updated if new env vars added
- [ ] `DATABASE_SCHEMA.md` updated if schema changed
- [ ] `API_ENDPOINTS.md` updated if endpoints changed
- [ ] Mobile layout tested at 375px width
- [ ] Security-sensitive changes flagged for extra review
