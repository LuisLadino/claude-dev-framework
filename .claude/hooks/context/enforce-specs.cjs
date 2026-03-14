#!/usr/bin/env node

/**
 * Enforce Specs Hook
 *
 * Event: PreToolUse (Edit|Write)
 * Purpose: DENY code edits until specs have been read this session
 *
 * The forcing function:
 * 1. Check if editing a code file
 * 2. Check if specs were read this session (tracked in session state)
 * 3. If not → DENY with instruction to read specs first
 * 4. If yes → ALLOW
 */

const fs = require('fs');
const path = require('path');

// Code file extensions that require specs
const CODE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.mjs', '.cjs'];

// Files/paths to skip enforcement
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.claude\/hooks/,      // Don't block editing hooks
  /package-lock\.json/,
  /yarn\.lock/,
  /\.md$/,                // Markdown doesn't need coding specs
  /\.json$/,              // Config files don't need coding specs
  /\.yaml$/,
  /\.yml$/,
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

  // Check if should skip
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(filePath)) {
      process.exit(0); // Allow
    }
  }

  // Check if code file
  const ext = path.extname(filePath);
  if (!CODE_EXTENSIONS.includes(ext)) {
    process.exit(0); // Allow - not a code file
  }

  // Check if specs were read this session
  const sessionState = loadSessionState();

  if (sessionState.specsRead) {
    // Specs were read, allow the edit
    process.exit(0);
  }

  // Specs not read - DENY and instruct
  console.error(`[BLOCKED] Editing code without reading specs.

You're about to edit ${path.basename(filePath)} but haven't read the project specs this session.

**Required action:** Read the relevant specs first:
1. Read .claude/specs/stack-config.yaml to see what specs are active
2. Read the spec files listed there (e.g., .claude/specs/coding/*.md)
3. Then retry this edit

After reading specs, the session state will be updated and edits will be allowed.

This ensures code follows project patterns.`);

  process.exit(2); // DENY
}

function loadSessionState() {
  try {
    const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return { specsRead: false };
  }
}
