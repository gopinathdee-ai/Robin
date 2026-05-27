import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  return new PrismaClient({
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
