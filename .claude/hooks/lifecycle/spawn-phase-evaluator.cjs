#!/usr/bin/env node

/**
 * Spawn Phase Evaluator Hook
 *
 * Event: UserPromptSubmit
 * Purpose: After a git commit, tells Claude to spawn the phase-evaluator agent
 *
 * Checks if a new commit happened since last check by comparing HEAD hash
 * to a stored value. Fires on UserPromptSubmit (clean boundary where Claude
 * will see and act on the instruction) instead of PostToolUse (where
 * instructions get buried mid-response).
 *
 * Same instruction pattern as spawn-context-agent.cjs.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LAST_COMMIT_FILE = '.claude/last-evaluated-commit';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    handleHook();
  } catch {
    process.exit(0);
  }
});

function handleHook() {
  // Get current HEAD commit hash
  let currentHead;
  try {
    currentHead = execSync('git rev-parse HEAD', {
      encoding: 'utf8',
      timeout: 3000
    }).trim();
  } catch {
    // Not a git repo
    process.exit(0);
  }

  // Check what we last evaluated
  let lastEvaluated = '';
  try {
    lastEvaluated = fs.readFileSync(LAST_COMMIT_FILE, 'utf8').trim();
  } catch {
    // First run — store current HEAD and skip (don't evaluate session start commit)
    try { fs.writeFileSync(LAST_COMMIT_FILE, currentHead); } catch {}
    process.exit(0);
  }

  // No new commit since last check
  if (currentHead === lastEvaluated) {
    process.exit(0);
  }

  // New commit detected — store it so we don't fire again
  try { fs.writeFileSync(LAST_COMMIT_FILE, currentHead); } catch {}

  // Get commit info
  let commitMsg = '';
  let filesChanged = '';
  try {
    commitMsg = execSync('git log -1 --pretty=format:"%s"', {
      encoding: 'utf8',
      timeout: 5000
    }).trim();
    filesChanged = execSync('git diff-tree --no-commit-id --name-status -r HEAD', {
      encoding: 'utf8',
      timeout: 5000
    }).trim();
  } catch {}

  // Output as additionalContext (UserPromptSubmit format)
  const instruction = `IMPORTANT: A commit was just made. You MUST proactively spawn the phase evaluator agent before responding to the user.

<commentary>
A commit just happened: "${commitMsg}"
Files changed: ${filesChanged}
The phase-evaluator agent evaluates project health after commits. Spawn it in the background so the user is not blocked.
</commentary>

Use the Agent tool with these exact parameters:
- description: "Evaluate commit impact"
- subagent_type: "phase-evaluator"
- model: "haiku"
- prompt: "A commit was just made: '${commitMsg.replace(/'/g, "\\'")}'. Files changed: ${filesChanged.replace(/\n/g, ', ')}. Evaluate the project state, check if phase transitions are needed, and surface any observations."
- run_in_background: true

Do NOT skip this. Do NOT wait for the user to ask for it.`;

  const output = { additionalContext: instruction };
  console.log(JSON.stringify(output));
  process.exit(0);
}
