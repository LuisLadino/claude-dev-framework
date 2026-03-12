#!/usr/bin/env node

/**
 * Session Init Hook
 *
 * Event: SessionStart
 * Purpose: Initialize session tracking and check for changes
 *
 * Does:
 * - Resets session-changes.json for new session
 * - Checks sync state (calls check-sync-state logic)
 * - Loads project context
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SESSION_CHANGES_FILE = '.claude/session-changes.json';
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

function initSessionChanges() {
  const data = {
    sessionStart: new Date().toISOString(),
    filesModified: [],
    filesCreated: [],
    operations: [],
    commands: []
  };

  const dir = path.dirname(SESSION_CHANGES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(SESSION_CHANGES_FILE, JSON.stringify(data, null, 2));
}

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

function loadProjectContext() {
  const context = [];

  // Check for project brief
  const briefPath = '.claude/specs/project-brief.md';
  if (fs.existsSync(briefPath)) {
    const brief = fs.readFileSync(briefPath, 'utf8');
    // Just get first few lines
    const summary = brief.split('\n').slice(0, 10).join('\n');
    context.push(`Project: ${summary.substring(0, 200)}...`);
  }

  // Check for stack config
  const stackPath = '.claude/specs/stack-config.yaml';
  if (fs.existsSync(stackPath)) {
    const stack = fs.readFileSync(stackPath, 'utf8');
    const frameworkMatch = stack.match(/framework:\s*"?([^"\n]+)"?/);
    if (frameworkMatch) {
      context.push(`Stack: ${frameworkMatch[1]}`);
    }
  }

  return context;
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
    // Still try to init even if parsing fails
    initSessionChanges();
    process.exit(0);
  }
});

function handleHook(data) {
  const { source } = data;

  // Initialize session changes tracking
  if (source === 'startup' || source === 'clear') {
    initSessionChanges();
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

  // Load and display project context
  const context = loadProjectContext();
  if (context.length > 0) {
    console.log(context.join(' | '));
  }

  process.exit(0);
}
