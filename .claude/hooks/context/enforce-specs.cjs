#!/usr/bin/env node

/**
 * Enforce Specs Hook
 *
 * Event: PreToolUse (Edit|Write)
 * Purpose: DENY file edits until the RELEVANT spec has been read
 *
 * Per-action enforcement (not per-session):
 * 1. Determine which spec applies to the file being edited
 * 2. Check if that specific spec was read BEFORE this action
 * 3. If not → DENY with instruction to read the spec first
 * 4. If yes → ALLOW and clear the flag (must re-read for next edit)
 *
 * This prevents context drift by forcing re-reading before each action.
 */

const fs = require('fs');
const path = require('path');

// File patterns → required spec mapping
const FILE_TO_SPEC = [
  {
    pattern: /\.claude\/hooks\/.*\.cjs$/,
    spec: '.claude/specs/claude-code/hooks.md',
    name: 'hooks'
  },
  {
    pattern: /\.claude\/skills\/.*\.md$/,
    spec: '.claude/specs/claude-code/skills.md',
    name: 'skills'
  },
  {
    pattern: /\.claude\/agents\/.*\.md$/,
    spec: '.claude/specs/claude-code/agents.md',
    name: 'agents'
  },
  {
    pattern: /\.claude\/commands\/.*\.md$/,
    spec: '.claude/specs/claude-code/tools.md',
    name: 'commands'
  },
  {
    pattern: /\.claude\/specs\/.*\.md$/,
    spec: '.claude/specs/README.md',
    name: 'specs-readme'
  },
  {
    pattern: /\.(js|ts|jsx|tsx|mjs|cjs)$/,
    spec: '.claude/specs/stack-config.yaml',
    name: 'coding'
  }
];

// Files/paths to skip enforcement entirely
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
];

// Session state file
const SESSION_STATE_FILE = '.claude/session-state.json';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    process.exit(0); // Allow on error
  }
});

function handleHook(data) {
  const { tool_input } = data;
  const filePath = tool_input?.file_path;

  if (!filePath) {
    process.exit(0); // Allow
  }

  // Check if should skip entirely
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(filePath)) {
      process.exit(0); // Allow
    }
  }

  // Find which spec applies to this file
  const mapping = FILE_TO_SPEC.find(m => m.pattern.test(filePath));

  if (!mapping) {
    process.exit(0); // No spec requirement for this file type
  }

  // Check if the required spec was read (pendingEdit matches this file type)
  const sessionState = loadSessionState();

  if (sessionState.pendingEdit === mapping.name) {
    // Spec was just read for this file type, allow the edit
    // Clear the pending flag so next edit requires re-reading
    clearPendingEdit();
    process.exit(0);
  }

  // Spec not read - DENY and instruct
  console.error(`[BLOCKED] Read the spec before editing.

You're about to edit: ${path.basename(filePath)}
Required spec: ${mapping.spec}

**Read the spec first, then retry this edit.**

This ensures you have the current guidelines fresh in context.
Every edit requires reading the relevant spec - this prevents context drift.`);

  process.exit(2); // DENY
}

function loadSessionState() {
  try {
    const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// pendingEdit is cleared by clear-pending.cjs at UserPromptSubmit
// This allows multiple edits within a single prompt after reading the spec
