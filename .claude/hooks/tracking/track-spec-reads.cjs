#!/usr/bin/env node

/**
 * Track Spec Reads Hook
 *
 * Event: PostToolUse (Read)
 * Purpose: Track when spec files are read, update session state
 *
 * When Claude reads a spec file (.claude/specs/*), mark specsRead: true
 * This unlocks code editing (enforce-specs.js checks this flag)
 */

const fs = require('fs');
const path = require('path');

// Patterns that count as "reading specs"
const SPEC_PATTERNS = [
  /\.claude\/specs\//,
  /stack-config\.yaml$/,
];

// Pattern for plan skill
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

  // Check if this is a spec file
  const isSpecFile = SPEC_PATTERNS.some(pattern => pattern.test(filePath));

  // Check if this is the plan skill
  const isPlanSkill = PLAN_SKILL_PATTERN.test(filePath);

  if (!isSpecFile && !isPlanSkill) {
    process.exit(0);
  }

  // Update session state
  const sessionState = loadSessionState();

  if (isSpecFile) {
    sessionState.specsRead = true;
    sessionState.lastSpecRead = filePath;
    sessionState.specReadAt = new Date().toISOString();
    console.log(`[SPECS] Read ${path.basename(filePath)} - code editing now allowed.`);
  }

  if (isPlanSkill) {
    sessionState.planSkillRead = true;
    sessionState.planSkillReadAt = new Date().toISOString();
    console.log(`[PLAN] Read plan skill - issue creation now allowed.`);
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
