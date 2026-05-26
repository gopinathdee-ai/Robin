# Trades Credential & Mentorship Platform

A portable skills, mentorship, and credentialing platform for Canada's skilled trades workforce.

---

## Environment Decision Guide

### Start here: Local Development (recommended for months 1–6)

Run everything on your machine using Docker. No cloud costs, no deployment complexity,
full production-equivalent environment. Move to AWS when you have paying customers.

**What you need installed:**
- Node.js 20+ (https://nodejs.org)
- Docker Desktop (https://docker.com/products/docker-desktop)
- pnpm 8+ (`npm install -g pnpm`)
- VS Code + recommended extensions (see .vscode/extensions.json)

### Later: AWS (when you need it)
When you're ready to deploy: RDS (PostgreSQL), ElastiCache (Redis), ECS (containers),
S3 (file storage), CloudFront (CDN). The docker-compose setup maps directly to these
managed services — no architectural changes required.

---

## Quick Start

### Prerequisites
- Node.js 20+ (https://nodejs.org)
- Docker Desktop (https://docker.com/products/docker-desktop)
- pnpm 8+ (`npm install -g pnpm`)

### Setup (first time)

```bash
# 1. Clone and install
git clone <your-repo>
cd trades-platform
git checkout dev

# 2. Copy environment variables (to BOTH locations — same content)
cp .env.example .env
cp .env.example apps/web/.env
# Optional: Edit .env files to add Auth0/Anthropic API keys

# 3. Install dependencies
pnpm install

# 4. Generate Prisma client (required after pnpm install)
cd packages/db
pnpm prisma generate
cd ../..

# 5. Start Docker containers (PostgreSQL + Redis)
docker compose up -d
# Wait ~10 seconds for PostgreSQL to be ready

# 6. Run database migrations
pnpm db:migrate

# 7. Seed database with reference data (trades, topics)
pnpm db:seed:mandatory

# 8. Optional: Seed test data (test users, sample content)
pnpm db:seed:optional

# 9. Start development servers
pnpm dev
```

**Important:** The `.env` file must be present in **both locations**:
- `/.env` — Used by database migrations, seed scripts, and other monorepo tools
- `/apps/web/.env` — Used by Next.js dev server and build process

**Why both?** In a monorepo, Next.js only reads `.env` from the app directory (`apps/web`). Without it, `NEXT_PUBLIC_*` variables like `NEXT_PUBLIC_DEV_MODE` will be undefined, breaking authentication and dev features.

**Content:** Both files should be identical copies (same database, same Redis, same API keys).

### After pulling latest changes
```bash
git pull origin dev
pnpm install
cd packages/db && pnpm prisma generate && cd ../..
docker compose up -d
pnpm dev
```

### Local URLs
- **Web app:** http://localhost:3000
- **API:** http://localhost:4000
- **PostgreSQL:** localhost:15432 (trades_platform)
- **Redis:** localhost:16379

---

## Deployment (Vercel)

### Before pushing to production
```bash
# Run database migrations locally (using /.env)
pnpm db:migrate

# Make sure your code is committed
git push origin dev
```

### Configure Vercel
1. Connect your repo to Vercel (select `dev` branch)
2. Set **Root Directory** to `apps/web`
3. Go to **Settings → Environment Variables**
4. Add the same variables from `/apps/web/.env`:
   - `DATABASE_URL` — production PostgreSQL
   - `REDIS_URL` — production Redis
   - `NEXT_PUBLIC_DEV_MODE` — set to `false` for production
   - `AUTH0_*` — production Auth0 credentials
   - Any other API keys (ANTHROPIC_API_KEY, OPENBADGE_*, etc.)
5. Deploy!

**Note:** The root `/.env` is **only for local development** (migrations, seeds, scripts). Vercel doesn't use it — it uses environment variables you set in the dashboard.

---

## Monorepo Structure

```
trades-platform/
├── apps/
│   └── web/                # Next.js 14 (frontend + API routes)
│       └── app/api/        # REST API endpoints (route handlers)
├── packages/
│   └── db/                 # Database schema, migrations, shared types
├── docker-compose.yml
├── .env.example
├── .env                    # (local dev only) Database + Redis + Auth0 + API keys
└── package.json            # Root workspace (pnpm)
```

**Note:** The API is not a separate server—all endpoints are Next.js route handlers in `apps/web/app/api/`.
When you run `pnpm dev`, it starts a single Next.js server on port 3000 that serves both the frontend and API.

---

## Tech Stack

| Layer            | Technology          | Why                                              |
|------------------|---------------------|--------------------------------------------------|
| Frontend         | Next.js 14 (App Router) | SSR for SEO, React Server Components        |
| Backend API      | Next.js Route Handlers | Co-located with frontend, zero-latency calls    |
| Styling          | Tailwind CSS        | Rapid UI, consistent design tokens               |
| Database         | PostgreSQL 16       | Relational data model fits credentials perfectly |
| Cache/Sessions   | Redis 7             | Fast session storage and queue management        |
| Auth             | Auth0               | Never build your own auth for a credential app   |
| AI Screening     | Anthropic API       | Content quality analysis and domain verification |
| Credentials      | Open Badges 3.0     | IMS Global standard — portable, verifiable       |
| Search           | Algolia (later)     | Add when content volume demands it               |

---

## Development Workflow

```bash
pnpm dev                    # Start all apps in watch mode
pnpm build                  # Build all apps
pnpm lint                   # Lint all apps
pnpm typecheck              # TypeScript check all apps

# Database commands
pnpm db:migrate             # Apply pending migrations
pnpm db:seed:mandatory      # Seed reference data (trades, topics)
pnpm db:seed:optional       # Seed test data (users, content)
pnpm db:reset:soft          # Truncate all tables, keep schema
pnpm db:reset:destroy       # Drop entire schema (requires confirmation)
pnpm db:studio              # Open Prisma Studio (database GUI)
```

---

## Key Decisions & Conventions

- **All credential-issuing code** requires a second human review before merge — no exceptions
- **PIPEDA compliance**: PII stored in Canadian AWS regions only (ca-central-1)
- **Mobile-first**: Every screen tested at 375px width before desktop
- **Offline-first**: Core read screens work without connectivity (PWA)
- **Open Badges 3.0**: Never issue proprietary credentials — use the open standard

---

## Phase Roadmap

- **Phase 1 (MVP)**: Zones 1-3 — Onboarding, Knowledge Community, Credentials & Mentorship
- **Phase 2**: Zone 4 — Training Marketplace + Employer portal
- **Phase 3**: Zone 5 — Full institutional admin + government integration

See the business venture document for full detail.
