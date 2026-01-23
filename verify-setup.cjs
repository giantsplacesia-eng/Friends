#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to verify your Friends with Giants setup is complete
 *
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description} - NOT FOUND`, 'red');
  }
  return exists;
}

function checkEnvVar(varName, description) {
  // Load .env.local if it exists
  if (fs.existsSync('.env.local')) {
    const env = fs.readFileSync('.env.local', 'utf-8');
    const hasVar = env.includes(varName);
    if (hasVar && !env.includes(`${varName}=your-`) && !env.includes(`${varName}=[`)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else if (hasVar) {
      log(`⚠️  ${description} - SET BUT NEEDS VALUE`, 'yellow');
      return false;
    } else {
      log(`❌ ${description} - MISSING`, 'red');
      return false;
    }
  } else {
    log(`⚠️  .env.local not found - copy from .env.local.example`, 'yellow');
    return false;
  }
}

async function main() {
  log('\n🦖 Friends with Giants - Setup Verification\n', 'blue');

  let allGood = true;

  // Check core files
  log('📁 Checking Core Files...', 'blue');
  allGood &= checkFile('package.json', 'package.json');
  allGood &= checkFile('tsconfig.json', 'TypeScript config');
  allGood &= checkFile('next.config.ts', 'Next.js config');
  allGood &= checkFile('tailwind.config.ts', 'Tailwind config');
  allGood &= checkFile('drizzle.config.ts', 'Drizzle config');

  // Check source directories
  log('\n📦 Checking Source Structure...', 'blue');
  allGood &= checkFile('src/app/(site)/page.tsx', 'Main page');
  allGood &= checkFile('src/app/(payload)/admin/[[...segments]]/page.tsx', 'Admin page');
  allGood &= checkFile('src/payload.config.ts', 'Payload config');

  // Check collections
  log('\n📊 Checking Payload Collections...', 'blue');
  allGood &= checkFile('src/collections/Services.ts', 'Services collection');
  allGood &= checkFile('src/collections/CaseStudies.ts', 'Case Studies collection');
  allGood &= checkFile('src/collections/Leads.ts', 'Leads collection');
  allGood &= checkFile('src/collections/Media.ts', 'Media collection');

  // Check components
  log('\n🎨 Checking Components...', 'blue');
  allGood &= checkFile('src/components/canvas/GiantScrubber.tsx', 'Giant Scrubber');
  allGood &= checkFile('src/components/nav/LeftController.tsx', 'Left Controller');
  allGood &= checkFile('src/components/ui/SmoothScrollProvider.tsx', 'Smooth Scroll Provider');

  // Check database
  log('\n🗄️  Checking Database Layer...', 'blue');
  allGood &= checkFile('src/db/schema.ts', 'Drizzle schema');
  allGood &= checkFile('src/db/index.ts', 'Database client');

  // Check lib
  log('\n🛠️  Checking Library Files...', 'blue');
  allGood &= checkFile('src/lib/gsap-register.ts', 'GSAP registration');
  allGood &= checkFile('src/lib/ai-agent.ts', 'AI agent config');
  allGood &= checkFile('src/lib/utils.ts', 'Utility functions');

  // Check API routes
  log('\n🤖 Checking API Routes...', 'blue');
  allGood &= checkFile('src/app/api/ai/analyze/route.ts', 'AI analysis endpoint');

  // Check environment variables
  log('\n🔐 Checking Environment Variables...', 'blue');
  allGood &= checkEnvVar('DATABASE_URL', 'Database URL (pooled)');
  allGood &= checkEnvVar('DIRECT_URL', 'Database URL (direct)');
  allGood &= checkEnvVar('PAYLOAD_SECRET', 'Payload secret');
  allGood &= checkEnvVar('DEEPSEEK_API_KEY', 'DeepSeek API key');

  // Check node_modules
  log('\n📦 Checking Dependencies...', 'blue');
  if (fs.existsSync('node_modules')) {
    log('✅ node_modules exists', 'green');

    // Check key dependencies
    const keyDeps = [
      'next',
      'payload',
      'drizzle-orm',
      'gsap',
      'lenis',
      'ai',
    ];

    for (const dep of keyDeps) {
      const depPath = path.join('node_modules', dep);
      if (fs.existsSync(depPath)) {
        log(`  ✅ ${dep}`, 'green');
      } else {
        log(`  ❌ ${dep} - NOT INSTALLED`, 'red');
        allGood = false;
      }
    }
  } else {
    log('❌ node_modules not found - run: npm install', 'red');
    allGood = false;
  }

  // Check documentation
  log('\n📚 Checking Documentation...', 'blue');
  checkFile('README.md', 'Main README');
  checkFile('SETUP.md', 'Setup guide');
  checkFile('ARCHITECTURE.md', 'Architecture docs');
  checkFile('DEPLOYMENT.md', 'Deployment guide');
  checkFile('QUICKSTART.md', 'Quick reference');
  checkFile('PROJECT_SUMMARY.md', 'Project summary');

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  if (allGood) {
    log('\n🎉 All checks passed! You\'re ready to start development.', 'green');
    log('\nNext steps:', 'blue');
    log('  1. Run: npm run dev', 'reset');
    log('  2. Visit: http://localhost:3000', 'reset');
    log('  3. Visit: http://localhost:3000/admin', 'reset');
    log('  4. Create your first admin user\n', 'reset');
  } else {
    log('\n⚠️  Some checks failed. Please review the errors above.', 'yellow');
    log('\nCommon fixes:', 'blue');
    log('  - Missing files: Verify project was set up correctly', 'reset');
    log('  - Missing node_modules: Run npm install', 'reset');
    log('  - Missing env vars: Copy .env.local.example to .env.local', 'reset');
    log('  - Check SETUP.md for detailed instructions\n', 'reset');
  }
}

main().catch(console.error);
