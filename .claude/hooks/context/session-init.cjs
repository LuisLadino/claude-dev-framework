#!/usr/bin/env node

/**
 * Session Init Hook
 *
 * Event: SessionStart
 * Purpose: Initialize session tracking and check for project changes
 *
 * Does:
 * - Creates session tracking file
 * - Checks sync state for project changes
 * - Cleans up old session tracking files
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const {
  initSession,
  cleanupOldSessions
} = require('../lib/session-utils.cjs');

const SYNC_STATE_PATH = '.claude/specs/.sync-state.json';

const WATCHED_FILES = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'tsconfig.json',
  'tailwind.config.js',
  'tailwind.config.ts',
  'vite.config.js',
  'vite.config.ts',
  'next.config.js',
  'next.config.ts',
  'next.config.mjs',
  'astro.config.mjs',
  'astro.config.ts'
];

function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch {
    return null;
  }
}

function loadSyncState() {
  try {
    const content = fs.readFileSync(SYNC_STATE_PATH, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function checkForChanges() {
  const cwd = process.cwd();
  const syncState = loadSyncState();

  if (!syncState) {
    const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
    if (hasPackageJson) {
      return {
        changed: true,
        reason: 'Project has never been synced. Run /sync-stack to set up specs and wiring.'
      };
    }
    return { changed: false };
  }

  const changes = [];
  for (const file of WATCHED_FILES) {
    const filePath = path.join(cwd, file);
    const currentHash = getFileHash(filePath);
    const storedHash = syncState.hashes?.[file];

    if (currentHash && storedHash && currentHash !== storedHash) {
      changes.push(file);
    } else if (currentHash && !storedHash) {
      changes.push(`${file} (new)`);
    }
  }

  if (changes.length > 0) {
    return {
      changed: true,
      reason: `Files changed since last sync: ${changes.join(', ')}`,
      files: changes,
      lastSync: syncState.lastSync
    };
  }

  return { changed: false };
}

const LOCAL_SESSION_STATE = '.claude/session-state.json';

function resetLocalSessionState() {
  try {
    const state = {
      sessionStart: new Date().toISOString()
    };
    fs.writeFileSync(LOCAL_SESSION_STATE, JSON.stringify(state, null, 2));
  } catch (e) {}
}

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    process.exit(0);
  }
});

function handleHook(data) {
  const { source } = data;
  const cwd = process.cwd();

  // Initialize session tracking
  if (source === 'startup' || source === 'clear') {
    initSession(cwd);
    cleanupOldSessions(cwd);
  }

  // Project-specific work — only run inside a framework project
  const isFrameworkProject = fs.existsSync(path.join(cwd, '.claude'));
  if (!isFrameworkProject) {
    process.exit(0);
    return;
  }

  // Reset local session state (for spec enforcement)
  if (source === 'startup' || source === 'clear') {
    resetLocalSessionState();
  }

  // Check for project changes
  const result = checkForChanges();
  if (result.changed) {
    console.log('\n========================================');
    console.log('PROJECT CHANGES DETECTED');
    console.log('========================================');
    console.log(result.reason);
    if (result.lastSync) {
      console.log(`Last sync: ${result.lastSync}`);
    }
    console.log('\nConsider running /sync-stack to update wiring and specs.');
    console.log('========================================\n');
  }

  process.exit(0);
}
