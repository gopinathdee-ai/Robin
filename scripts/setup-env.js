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
  
  // Check if we are in a CI/Cloud environment where .env files are typically not used
  const isCI = process.env.CI || process.env.VERCEL || process.env.GITHUB_ACTIONS
  
  if (isCI) {
    console.log('  ℹ CI environment detected. Skipping .env sync as environment variables should be provided by the platform.\n')
    process.exit(0)
  } else {
    console.log('  → Create it: cp .env.example .env')
    console.log('  → Then update DATABASE_URL with your Supabase credentials\n')
    process.exit(1)
  }
}
