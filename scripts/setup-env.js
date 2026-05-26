const fs = require('fs')
const path = require('path')

const rootEnv = path.join(__dirname, '..', '.env')
const targets = [
  path.join(__dirname, '..', 'apps', 'web', '.env'),
  path.join(__dirname, '..', 'packages', 'db', '.env'),
]

console.log('\n📋 Setting up environment files...\n')

if (fs.existsSync(rootEnv)) {
  targets.forEach((target) => {
    const dir = path.dirname(target)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.copyFileSync(rootEnv, target)
    console.log(`  ✓ Copied .env to ${path.relative(path.join(__dirname, '..'), target)}`)
  })
  console.log('\n✅ Environment files synced from root .env\n')
} else {
  console.log('  ⚠ Root .env not found.')
  console.log('  → Create it: cp .env.example .env')
  console.log('  → Then update DATABASE_URL with your Supabase credentials\n')
  process.exit(1)
}
