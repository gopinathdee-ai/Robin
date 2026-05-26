import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { createInterface } from 'readline'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      realtime: { transport: ws as any },
    })
  : null

async function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main() {
  console.log('\n')
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  🔴 DANGER: DATABASE DESTRUCTION & RECREATION              ║')
  console.log('║                                                            ║')
  console.log('║  This will:                                                ║')
  console.log('║  1. Drop ALL tables and the schema                         ║')
  console.log('║  2. Delete ALL data permanently                            ║')
  console.log('║  3. Delete ALL files from Supabase Storage                 ║')
  console.log('║  4. Recreate schema via Prisma migration                   ║')
  console.log('║  5. Run mandatory seed data                                ║')
  console.log('║                                                            ║')
  console.log('║  This action CANNOT be undone.                             ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('\n')

  const confirmation = await prompt(
    'Type "DESTROY DATABASE" to confirm (or press Enter to cancel): '
  )

  if (confirmation !== 'DESTROY DATABASE') {
    console.log('\n✓ Cancelled. Database is safe.')
    process.exit(0)
  }

  try {
    console.log('\n⏳ Dropping schema...')
    await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE')
    await prisma.$executeRawUnsafe('CREATE SCHEMA public')
    console.log('✓ Schema dropped and public schema recreated.')
    await prisma.$disconnect()

    if (supabase) {
      console.log('\n⏳ Deleting all files from Supabase Storage...')
      try {
        const allFilePaths: string[] = []

        // Recursively collect all file paths
        async function listFilesRecursive(path: string): Promise<void> {
          const { data: items, error } = await supabase.storage.from('credentials').list(path, {
            limit: 10000,
          })

          if (error) {
            console.warn(`⚠ Could not list path '${path}':`, error.message)
            return
          }

          if (!items || items.length === 0) return

          for (const item of items) {
            const fullPath = path ? `${path}/${item.name}` : item.name

            if (item.id === null) {
              // It's a folder, recurse
              await listFilesRecursive(fullPath)
            } else {
              // It's a file, collect it
              allFilePaths.push(fullPath)
            }
          }
        }

        await listFilesRecursive('')

        if (allFilePaths.length > 0) {
          const { error: deleteError } = await supabase.storage.from('credentials').remove(allFilePaths)

          if (deleteError) {
            console.warn('⚠ Could not delete all files:', deleteError.message)
          } else {
            console.log(`✓ Deleted ${allFilePaths.length} files from Supabase Storage.`)
          }
        } else {
          console.log('✓ No files to delete in Supabase Storage.')
        }
      } catch (error) {
        console.warn('⚠ Storage cleanup error:', error)
      }
    } else {
      console.log('\n⚠ SUPABASE_SERVICE_ROLE_KEY not configured. Skipping storage cleanup.')
    }

    console.log('\n⏳ Running migrations...')
    execSync('pnpm prisma migrate deploy', { stdio: 'inherit' })
    console.log('✓ Migrations completed.')

    console.log('\n⏳ Seeding mandatory data...')
    execSync('pnpm tsx scripts/seed-mandatory.ts', { stdio: 'inherit' })
    console.log('✓ Mandatory seed data loaded.')

    console.log('\n')
    console.log('╔════════════════════════════════════════════════════════════╗')
    console.log('║  ✅ DATABASE RECREATION COMPLETE                           ║')
    console.log('║                                                            ║')
    console.log('║  Completed:                                                ║')
    console.log('║  ✓ Schema destroyed and recreated                          ║')
    console.log('║  ✓ Storage files deleted                                   ║')
    console.log('║  ✓ Migrations applied                                      ║')
    console.log('║  ✓ Mandatory seed data loaded                              ║')
    console.log('║                                                            ║')
    console.log('║  OPTIONAL: Load test/sample data                           ║')
    console.log('║  ─────────────────────────────────────────────────────────')
    console.log('║  If needed, load optional test data by running:            ║')
    console.log('║                                                            ║')
    console.log('║    \x1b[1;32mpnpm db:seed:optional\x1b[0m                                ║')
    console.log('║                                                            ║')
    console.log('║  (Only run if you want sample questions, answers, etc.)    ║')
    console.log('╚════════════════════════════════════════════════════════════╝')
    console.log('\n')
  } catch (error) {
    console.error('\n✗ Error during database recreation:', error)
    process.exit(1)
  }
}

main()
