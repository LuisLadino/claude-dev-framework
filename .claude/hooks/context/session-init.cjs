#!/usr/bin/env node

/**
 * Session Init Hook
 *
 * Event: SessionStart
 * Purpose: Initialize session tracking in brain and check for changes
 *
 * Does:
 * - Creates session tracking file in brain
 * - Checks sync state for project changes
 * - Cleans up old session files
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const {
  findWorkspaceBrain,
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

const LOCAL_SESSION_STATE = '.claude/session-state.json';

function resetLocalSessionState() {
  try {
    // Reset per-prompt flags at session start
    // pendingEdit: cleared, must read spec before editing
    // pendingIssue: cleared, must read plan skill before creating issues
    // These are also cleared at each UserPromptSubmit by clear-pending.cjs
    const state = {
      sessionStart: new Date().toISOString()
      // pendingEdit and pendingIssue intentionally not set
      // Their absence means "must read spec first"
    };
    fs.writeFileSync(LOCAL_SESSION_STATE, JSON.stringify(state, null, 2));
  } catch (e) {
    // Ignore errors
  }
}

function loadProjectContext() {
  const context = [];

  // Check for project brief
  const briefPath = '.claude/specs/project-brief.md';
  if (fs.existsSync(briefPath)) {
    const brief = fs.readFileSync(briefPath, 'utf8');
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
    try {
      const brainPath = findWorkspaceBrain(process.cwd());
      initSession(brainPath);
    } catch (e2) {}
    process.exit(0);
  }
});

function handleHook(data) {
  const { source } = data;
  const cwd = process.cwd();

  // Find brain folder for this workspace
  const brainPath = findWorkspaceBrain(cwd);

  // Initialize session tracking in brain
  if (source === 'startup' || source === 'clear') {
    const sessionId = initSession(brainPath);

    // Clean up old sessions (7+ days old)
    cleanupOldSessions(brainPath);

    // Reset local session state (for spec enforcement)
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

  // Load and display project context
  const context = loadProjectContext();
  if (context.length > 0) {
    console.log(context.join(' | '));
  }

  process.exit(0);
}
