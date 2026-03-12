#!/usr/bin/env node

/**
 * Check Sync State Hook for Claude Code
 *
 * Runs at SessionStart to detect if project files changed since last /sync-stack.
 * Compares current file hashes to stored hashes in .sync-state.json.
 *
 * Usage: Add to SessionStart hook in settings.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Files to monitor for changes
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

const SYNC_STATE_PATH = '.claude/specs/.sync-state.json';

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

  // No sync state = never synced
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

  // Compare current hashes to stored hashes
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

// Main
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
