# Database Migration: Add Union Local Name Field

This migration adds a new `union_local_name` column to the `users` table to store freeform union local information.

## Prerequisites

The migration requires access to the PostgreSQL database. Choose one of the following methods to apply it.

---

## Method 1: Using Node.js Script (Recommended)

This is the easiest method if you have Node.js installed.

```bash
# Install dependencies (if not already installed)
npm install pg

# Run the migration
node apply-migration.js
```

**Environment Variables:**
- `DATABASE_URL` - Full PostgreSQL connection string (preferred)
- Or use individual variables:
  - `DATABASE_URL_HOST` (default: localhost)
  - `DATABASE_URL_PORT` (default: 5432)
  - `DATABASE_URL_DB` (default: trades_platform)
  - `DATABASE_URL_USER` (default: postgres)
  - `DATABASE_URL_PASSWORD`

**Example:**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/trades_platform" node apply-migration.js
```

---

## Method 2: Using Bash Script

If you're on a Unix-like system with `psql` installed:

```bash
chmod +x apply-migration.sh
./apply-migration.sh
```

**Environment Variables:**
- `DATABASE_URL_HOST` (default: localhost)
- `DATABASE_URL_PORT` (default: 5432)
- `DATABASE_URL_DB` (default: trades_platform)
- `DATABASE_URL_USER` (default: postgres)
- `DATABASE_URL_PASSWORD`

---

## Method 3: Using psql Directly

Run the SQL migration directly with `psql`:

```bash
psql -h localhost -p 5432 -U postgres -d trades_platform -f migration-union-local.sql
```

Replace the connection parameters with your actual database credentials.

---

## Method 4: Using Prisma Migrate

If you have Prisma CLI set up:

```bash
# Deploy all pending migrations
cd packages/db
prisma migrate deploy

# Or if you need to run it in development mode
prisma migrate dev
```

---

## Verification

After running the migration, verify that the column was created:

```bash
psql -h localhost -p 5432 -U postgres -d trades_platform -c "\\d users" | grep union_local
```

You should see a line like:
```
 union_local_name | character varying(200) |
```

---

## Rollback (if needed)

If you need to revert this migration:

```bash
psql -h localhost -p 5432 -U postgres -d trades_platform -c "ALTER TABLE \"users\" DROP COLUMN \"union_local_name\";"
```

---

## What This Migration Does

- Adds a `union_local_name` column of type `VARCHAR(200)` to the `users` table
- Allows users to store their union local information as freeform text
- The field is optional (nullable) for existing users
- New users can optionally provide their union local during onboarding or profile setup

## After Migration

Once the migration is applied:
1. The Prisma schema will recognize the new column
2. Users can enter and save their union local information in:
   - Onboarding Profile Setup
   - Post-onboarding Profile Setup
   - Edit Profile page
3. The union local information will be persisted to the database
