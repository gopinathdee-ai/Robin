import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n⏳ Fetching all tables...')

  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != '_prisma_migrations'`

  const tableNames = tables
    .map((t) => `"${t.tablename}"`)
    .join(', ')

  if (tableNames.length === 0) {
    console.log('✓ No tables to truncate.')
    await prisma.$disconnect()
    return
  }

  console.log(`⏳ Truncating ${tables.length} table(s)...`)
  await prisma.$executeRawUnsafe(
    `TRUNCATE ${tableNames} CASCADE`
  )

  console.log(`✓ Truncated ${tables.length} table(s).`)
  console.log('✓ Schema intact — all data cleared.\n')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
