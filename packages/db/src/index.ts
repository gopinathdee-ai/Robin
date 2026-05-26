import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NEXT_PUBLIC_DEV_MODE === 'true'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
  globalForPrisma.prisma = prisma
}

export * from '@prisma/client'
