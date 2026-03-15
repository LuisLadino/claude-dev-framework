#!/usr/bin/env node

/**
 * Enforce Plan Skill Hook
 *
 * Event: PreToolUse (Bash)
 * Purpose: DENY `gh issue create` until plan skill has been read
 *
 * Issues are the system of record for WHY work happens.
 * The plan skill documents how to create issues with proper context.
 * This hook ensures Claude reads those guidelines before creating issues.
 */

const fs = require('fs');
const path = require('path');

// Commands that require plan skill to be read first
const PLAN_COMMANDS = [
  /gh\s+issue\s+create/i,
];

// Session state file
const SESSION_STATE_FILE = '.claude/session-state.json';

// Allow if invoked from within the skill
const SKILL_ACTIVE_MARKER = 'SKILL_ACTIVE=1';

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
  const command = tool_input?.command;

  if (!command) {
    process.exit(0); // Allow
  }

  // Allow if SKILL_ACTIVE marker present (invoked from skill)
  if (command.includes(SKILL_ACTIVE_MARKER)) {
    process.exit(0);
  }

  // Check if this is a plan-related command
  const isPlanCommand = PLAN_COMMANDS.some(pattern => pattern.test(command));

  if (!isPlanCommand) {
    process.exit(0); // Allow - not a plan command
  }

  // Check if plan skill was read this prompt
  const sessionState = loadSessionState();

  if (sessionState.pendingIssue) {
    // Plan skill was read, allow issue creation
    // pendingIssue is cleared at start of next prompt by clear-pending.cjs
    process.exit(0);
  }

  // Plan skill not read - DENY and instruct
  console.error(`[BLOCKED] Creating GitHub issue without reading plan guidelines.

You're about to create a GitHub issue but haven't read the plan skill this session.

**Why this matters:**
Issues are the system of record for WHY work happens. They need proper context
so future sessions (including Claude) understand the problem being solved.

**Required action:**
1. Read .claude/skills/plan/SKILL.md
2. Note the required sections: Problem, Why It Matters
3. Then retry creating the issue

This ensures issues capture the reasoning, not just the task.`);

  process.exit(2); // DENY
}

function loadSessionState() {
  try {
    const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return { planSkillRead: false };
  }
}
