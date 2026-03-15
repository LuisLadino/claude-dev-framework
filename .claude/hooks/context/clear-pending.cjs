#!/usr/bin/env node

/**
 * Clear Pending Hook
 *
 * Event: UserPromptSubmit
 * Purpose: Clear pending edit/issue flags at the start of each new prompt
 *
 * Per-prompt enforcement:
 * - Reading a spec enables edits for the CURRENT prompt only
 * - When user sends a new prompt, flags are cleared
 * - Must re-read specs for the new prompt's work
 * - This prevents context drift across prompts
 */

const fs = require('fs');

const SESSION_STATE_FILE = '.claude/session-state.json';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    clearPendingFlags();
  } catch (e) {
    // Ignore errors
  }
  process.exit(0);
});

function clearPendingFlags() {
  try {
    const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
    const state = JSON.parse(content);

    // Clear per-prompt flags
    delete state.pendingEdit;
    delete state.pendingIssue;

    fs.writeFileSync(SESSION_STATE_FILE, JSON.stringify(state, null, 2));
  } catch {
    // If file doesn't exist or is invalid, that's fine
  }
}
