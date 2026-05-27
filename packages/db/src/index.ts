import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL or DIRECT_URL environment variable is not set')
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log:
      process.env.NEXT_PUBLIC_DEV_MODE === 'true'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
  globalForPrisma.prisma = prisma
}

export * from '@prisma/client'
