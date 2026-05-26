import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { createInterface } from 'readline'

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
  console.log('║  🔴 DANGER: DATABASE DESTRUCTION                          ║')
  console.log('║                                                            ║')
  console.log('║  This will:                                                ║')
  console.log('║  1. Drop ALL tables and the schema                         ║')
  console.log('║  2. Delete ALL data permanently                            ║')
  console.log('║  3. Delete ALL files from Supabase Storage                 ║')
  console.log('║  4. Recreate the schema via Prisma migration               ║')
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

  console.log('\n⏳ Dropping schema...')
  await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE')
  await prisma.$executeRawUnsafe('CREATE SCHEMA public')
  console.log('✓ Schema dropped and public schema recreated.')

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

  console.log('\n✓ Database destroyed.')
  console.log('✓ Next: run migrations and seeding yourself.\n')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
