#!/usr/bin/env node

/**
 * Track Spec Reads Hook
 *
 * Event: PostToolUse (Read)
 * Purpose: Track when spec files are read, enable gated actions
 *
 * Reads spec definitions from stack-config.yaml.
 * When a spec file is read, adds spec name to pendingEdit array.
 * Multiple specs can be tracked per prompt.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const STACK_CONFIG_PATH = '.claude/specs/stack-config.yaml';
const SESSION_STATE_FILE = '.claude/session-state.json';

// Pattern for plan skill (separate enforcement)
const PLAN_SKILL_PATTERN = /\.claude\/skills\/plan\/SKILL\.md$/;

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

  // Check if this is the plan skill
  const isPlanSkill = PLAN_SKILL_PATTERN.test(filePath);

  // Check if this is a spec file
  const specName = findSpecName(filePath);

  if (!specName && !isPlanSkill) {
    process.exit(0);
  }

  // Update session state
  const sessionState = loadSessionState();

  if (specName) {
    // Initialize pendingEdit as array if needed
    if (!Array.isArray(sessionState.pendingEdit)) {
      sessionState.pendingEdit = [];
    }

    // Add spec name if not already present
    if (!sessionState.pendingEdit.includes(specName)) {
      sessionState.pendingEdit.push(specName);
    }

    sessionState.lastSpecRead = filePath;
    sessionState.specReadAt = new Date().toISOString();
    console.log(`[READY] Read ${specName} spec - edits allowed this prompt.`);
  }

  if (isPlanSkill) {
    sessionState.pendingIssue = true;
    sessionState.planSkillReadAt = new Date().toISOString();
    console.log(`[READY] Read plan skill - issue creation allowed this prompt.`);
  }

  saveSessionState(sessionState);
  process.exit(0);
}

function loadStackConfig() {
  try {
    const content = fs.readFileSync(STACK_CONFIG_PATH, 'utf8');
    return yaml.parse(content);
  } catch {
    return null;
  }
}

function findSpecName(filePath) {
  const config = loadStackConfig();
  if (!config?.specs) return null;

  // Normalize the file path
  const normalizedPath = filePath.replace(/^.*?\.claude\/specs\//, '');

  // Check each spec to see if the file matches
  for (const category of Object.keys(config.specs)) {
    const specs = config.specs[category];
    if (!Array.isArray(specs)) continue;

    for (const spec of specs) {
      // Check if the read file IS this spec
      if (spec.file && normalizedPath.endsWith(spec.file.replace(/^.*\//, ''))) {
        return spec.name;
      }
      // Also match full path
      if (spec.file && filePath.includes(spec.file)) {
        return spec.name;
      }
    }
  }

  // Fallback: check if it's in the specs directory at all
  if (filePath.includes('.claude/specs/')) {
    // Return a generic name based on the file
    const basename = path.basename(filePath, path.extname(filePath));
    return basename;
  }

  return null;
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
    const dir = path.dirname(SESSION_STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SESSION_STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    // Ignore write errors
  }
}
