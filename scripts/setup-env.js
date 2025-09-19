#!/usr/bin/env node

/**
 * Environment Setup Script
 *
 * This script helps you set up environment files for different deployment environments.
 *
 * Usage:
 *   node scripts/setup-env.js
 *   npm run setup:env
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

async function setupEnvironment() {
  log('\n🚀 Environment Setup for Convex + SvelteKit + Cloudflare Workers\n');

  // Check existing files
  const environments = ['local', 'staging', 'production'];
  const existingFiles = {};

  environments.forEach(env => {
    const filename = env === 'local' ? '.env.local' : `.env.${env}`;
    existingFiles[env] = {
      filename,
      exists: existsSync(filename)
    };
  });

  log('Current environment files:');
  environments.forEach(env => {
    const status = existingFiles[env].exists ? '✅ Exists' : '❌ Missing';
    log(`  ${existingFiles[env].filename}: ${status}`);
  });

  const setupChoice = await question('\nWhich environment would you like to set up? (local/staging/production/all): ');

  if (setupChoice === 'all') {
    for (const env of environments) {
      await setupSingleEnvironment(env, existingFiles[env]);
    }
  } else if (environments.includes(setupChoice)) {
    await setupSingleEnvironment(setupChoice, existingFiles[setupChoice]);
  } else {
    log('Invalid choice. Please run the script again.', 'error');
    rl.close();
    return;
  }

  log('\n✅ Environment setup completed!', 'success');
  log('\nNext steps:');
  log('1. Review your environment files');
  log('2. Update any placeholder values');
  log('3. Test deployment: npm run deploy:status <env>');
  log('4. Deploy: npm run deploy:<env>');

  rl.close();
}

async function setupSingleEnvironment(env, fileInfo) {
  log(`\n📝 Setting up ${env} environment...`);

  if (fileInfo.exists) {
    const overwrite = await question(`${fileInfo.filename} already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      log(`Skipping ${env} environment setup.`);
      return;
    }
  }

  let convexUrl, adminKey;

  if (env === 'local') {
    convexUrl = await question('Local Convex URL (default: http://localhost:3210): ') || 'http://localhost:3210';
    adminKey = await question('Local Convex Admin Key (optional): ') || '';
  } else {
    convexUrl = await question(`${env.charAt(0).toUpperCase() + env.slice(1)} Convex URL: `);
    adminKey = await question(`${env.charAt(0).toUpperCase() + env.slice(1)} Convex Admin Key: `);

    if (!convexUrl || !adminKey) {
      log('URL and Admin Key are required for non-local environments.', 'error');
      return;
    }
  }

  const envContent = generateEnvContent(env, convexUrl, adminKey);
  writeFileSync(fileInfo.filename, envContent);

  log(`✅ Created ${fileInfo.filename}`, 'success');
}

function generateEnvContent(env, convexUrl, adminKey) {
  const envName = env.charAt(0).toUpperCase() + env.slice(1);

  return `# ${envName} Environment Configuration
# Generated on ${new Date().toISOString()}

# Convex Configuration
CONVEX_SELF_HOSTED_URL='${convexUrl}'
CONVEX_SELF_HOSTED_ADMIN_KEY='${adminKey}'
PUBLIC_CONVEX_URL=${convexUrl}

# Note: NODE_ENV is automatically managed by Vite
# NODE_ENV=development during 'vite dev'
# NODE_ENV=production during 'vite build'

# Optional: Convex Deploy Key (for CI/CD)
# CONVEX_DEPLOY_KEY=your-${env}-deploy-key-here
`;
}

// Run the setup
setupEnvironment().catch(error => {
  log(`Setup failed: ${error.message}`, 'error');
  process.exit(1);
});
