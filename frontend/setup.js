#!/usr/bin/env node

/**
 * Proper setup script for frontend
 * Run with: node setup.js
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const isWindows = process.platform === 'win32';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(cmd, cwd) {
  try {
    log(`Running: ${cmd}`, 'blue');
    const result = execSync(cmd, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });
    return result;
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    throw error;
  }
}

// Check node version
function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.split('.')[0], 10);
  
  if (major < 18) {
    log(`Node.js version ${version} detected. Minimum required: 18.0.0`, 'red');
    log('Please upgrade Node.js: https://nodejs.org/', 'yellow');
    process.exit(1);
  }
  
  log(`✓ Node.js ${version} detected`, 'green');
}

// Install dependencies
function installDependencies() {
  log('\n📦 Installing dependencies...', 'bright');
  
  const packageManager = existsSync(join(process.cwd(), 'package-lock.json')) ? 'npm' : 'npm';
  
  runCommand(`${packageManager} install`, process.cwd());
  
  log('✓ Dependencies installed', 'green');
}

// Initialize git
function initGit() {
  if (existsSync(join(process.cwd(), '.git'))) {
    log('✓ Git already initialized', 'green');
    return;
  }
  
  log('\n📦 Initializing git...', 'bright');
  runCommand('git init', process.cwd());
  runCommand('git add .', process.cwd());
  runCommand('git commit -m "Initial commit: SOA frontend with React + Vite + Tailwind v4 + shadcn/ui"', process.cwd());
  log('✓ Git initialized', 'green');
}

// Create .env file
function setupEnv() {
  const envPath = join(process.cwd(), '.env');
  
  if (existsSync(envPath)) {
    log('✓ .env file already exists', 'green');
    return;
  }
  
  log('\n📝 Creating .env file...', 'bright');
  
  const envContent = `# Vite Configuration
VITE_API_URL=http://localhost:3000

# API Configuration (optional - overrides VITE_*)
API_URL=http://localhost:3000
`;
  
  writeFileSync(envPath, envContent);
  log('✓ .env file created', 'green');
}

// Main setup function
function setup() {
  console.log('\n' + '='.repeat(60));
  console.log('  🚀 SOA Frontend Setup');
  console.log('  React 19.2.0 + Vite 7.3.1 + Tailwind CSS v4 + shadcn/ui');
  console.log('='.repeat(60) + '\n');
  
  // Step 1: Check Node version
  checkNodeVersion();
  
  // Step 2: Install dependencies
  installDependencies();
  
  // Step 3: Setup environment
  setupEnv();
  
  // Step 4: Initialize git
  initGit();
  
  console.log('\n' + '='.repeat(60));
  console.log('  ✨ Setup Complete!');
  console.log('');
  console.log('  Next steps:');
  console.log('  1. Run development server: npm run dev');
  console.log('  2. Build for production: npm run build');
  console.log('  3. Add shadcn/ui components: npm run shadcn add [component]');
  console.log('');
  console.log('  Documentation: frontend/README.md');
  console.log('='.repeat(60) + '\n');
}

// Run setup
try {
  setup();
} catch (error) {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
}
