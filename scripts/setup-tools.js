#!/usr/bin/env node

/**
 * Friends with Giants - Tool Setup Script
 * Run this once after npm install to set up all development tools
 * Works on Windows, Mac, and Linux
 */

const { execSync } = require('child_process');
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

function exec(command, description) {
  try {
    log(`\n⏳ ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} - complete`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} - failed`, 'red');
    return false;
  }
}

async function main() {
  log('\n🦖 Friends with Giants - Setting up development tools\n', 'blue');

  let allGood = true;

  // Step 1: Install shadcn/ui
  log('📦 Step 1/3: Installing shadcn/ui foundations...', 'blue');

  // Check if already initialized
  const componentsJsonExists = fs.existsSync(path.join(process.cwd(), 'components.json'));

  if (!componentsJsonExists) {
    allGood &= exec(
      'npx shadcn@latest init -y',
      'Initialize shadcn/ui'
    );
  } else {
    log('ℹ️  shadcn/ui already initialized', 'yellow');
  }

  allGood &= exec(
    'npx shadcn@latest add button card scroll-area -y',
    'Install base components'
  );

  // Step 2: Install agent-browser globally
  log('\n🌐 Step 2/3: Installing agent-browser CLI...', 'blue');

  // Check if already installed
  try {
    execSync('agent-browser --version', { stdio: 'ignore' });
    log('ℹ️  agent-browser already installed', 'yellow');
  } catch {
    allGood &= exec(
      'npm install -g agent-browser',
      'Install agent-browser globally'
    );

    allGood &= exec(
      'agent-browser install',
      'Download Chromium binaries'
    );
  }

  // Step 3: Verify animation dependencies
  log('\n🎨 Step 3/3: Verifying animation dependencies...', 'blue');

  const requiredDeps = [
    'gsap',
    '@gsap/react',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'lenis'
  ];

  let allDepsInstalled = true;
  for (const dep of requiredDeps) {
    try {
      require.resolve(dep);
      log(`  ✅ ${dep}`, 'green');
    } catch {
      log(`  ❌ ${dep} - missing`, 'red');
      allDepsInstalled = false;
    }
  }

  if (!allDepsInstalled) {
    log('\n⚠️  Installing missing animation dependencies...', 'yellow');
    allGood &= exec(
      'npm install gsap @gsap/react three @types/three @react-three/fiber @react-three/drei lenis',
      'Install animation dependencies'
    );
  } else {
    log('✅ All animation dependencies verified', 'green');
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  if (allGood) {
    log('\n🎉 All tools installed successfully!\n', 'green');
    log('Next steps:', 'blue');
    log('  1. Copy .env.local.example to .env.local', 'reset');
    log('  2. Add your API keys (Supabase, DeepSeek)', 'reset');
    log('  3. Run: npm run db:push', 'reset');
    log('  4. Run: npm run dev\n', 'reset');
    log('For more info, see SETUP.md', 'blue');
  } else {
    log('\n⚠️  Some steps failed. Please check the errors above.\n', 'yellow');
    log('You may need to run some commands manually:', 'blue');
    log('  - npx shadcn@latest init', 'reset');
    log('  - npm install -g agent-browser', 'reset');
    log('  - agent-browser install\n', 'reset');
  }
}

main().catch(console.error);
