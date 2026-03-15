#!/usr/bin/env node

/**
 * Track Spec Reads Hook
 *
 * Event: PostToolUse (Read)
 * Purpose: Track when spec/skill files are read, enable gated actions
 *
 * Per-prompt enforcement:
 * - When a spec is read, set pendingEdit to the spec type
 * - Multiple edits of that type allowed within the same prompt
 * - UserPromptSubmit clears pendingEdit at start of each new prompt
 * - This forces re-reading for each new user request, preventing context drift
 */

const fs = require('fs');
const path = require('path');

// Spec file → edit type mapping
const SPEC_TO_EDIT_TYPE = [
  { pattern: /hooks\.md$/, type: 'hooks' },
  { pattern: /skills\.md$/, type: 'skills' },
  { pattern: /agents\.md$/, type: 'agents' },
  { pattern: /tools\.md$/, type: 'commands' },
  { pattern: /specs\/README\.md$/, type: 'specs-readme' },
  { pattern: /stack-config\.yaml$/, type: 'coding' },
  { pattern: /coding\/.*\.md$/, type: 'coding' },
];

// Pattern for plan skill (separate enforcement)
const PLAN_SKILL_PATTERN = /\.claude\/skills\/plan\/SKILL\.md$/;

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
    process.exit(0);
  }
});

function handleHook(data) {
  const { tool_input } = data;
  const filePath = tool_input?.file_path;

  if (!filePath) {
    process.exit(0);
  }

  // Check if this is a spec file and get the edit type
  const mapping = SPEC_TO_EDIT_TYPE.find(m => m.pattern.test(filePath));

  // Check if this is the plan skill
  const isPlanSkill = PLAN_SKILL_PATTERN.test(filePath);

  if (!mapping && !isPlanSkill) {
    process.exit(0);
  }

  // Update session state
  const sessionState = loadSessionState();

  if (mapping) {
    sessionState.pendingEdit = mapping.type;
    sessionState.lastSpecRead = filePath;
    sessionState.specReadAt = new Date().toISOString();
    console.log(`[READY] Read ${path.basename(filePath)} - ${mapping.type} edits allowed this prompt.`);
  }

  if (isPlanSkill) {
    sessionState.pendingIssue = true;
    sessionState.planSkillReadAt = new Date().toISOString();
    console.log(`[READY] Read plan skill - issue creation allowed this prompt.`);
  }

  saveSessionState(sessionState);

  process.exit(0);
}

function loadSessionState() {
  try {
    const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function saveSessionState(state) {
  try {
    // Ensure directory exists
    const dir = path.dirname(SESSION_STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SESSION_STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    // Ignore write errors
  }
}
