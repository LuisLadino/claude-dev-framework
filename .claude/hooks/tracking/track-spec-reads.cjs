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
    return parseStackConfigYaml(content);
  } catch {
    return null;
  }
}

/**
 * Purpose-built parser for stack-config.yaml's spec structure.
 * Extracts specs: { category: [{ name, file }, ...] }
 * No external yaml package needed.
 */
function parseStackConfigYaml(content) {
  const result = { specs: {} };
  const lines = content.split('\n');

  let inSpecs = false;
  let currentCategory = null;
  let currentItem = null;

  for (const line of lines) {
    // Top-level "specs:" section
    if (/^specs:\s*$/.test(line)) {
      inSpecs = true;
      continue;
    }

    // Exit specs section on next top-level key
    if (inSpecs && /^\S/.test(line) && !line.startsWith('#')) {
      inSpecs = false;
      continue;
    }

    if (!inSpecs) continue;

    // Category key (2-space indent): "  claude-code:"
    const catMatch = line.match(/^  (\S[^:]+):\s*$/);
    if (catMatch) {
      currentCategory = catMatch[1];
      result.specs[currentCategory] = [];
      currentItem = null;
      continue;
    }

    if (!currentCategory) continue;

    // Array item start: "    - name: value"
    const itemMatch = line.match(/^\s{4}-\s+name:\s*(.+)/);
    if (itemMatch) {
      currentItem = { name: itemMatch[1].trim().replace(/^"|"$/g, '') };
      result.specs[currentCategory].push(currentItem);
      continue;
    }

    // Properties of current item: "      file: value"
    if (currentItem) {
      const propMatch = line.match(/^\s{6}(\w+):\s*(.+)/);
      if (propMatch) {
        const key = propMatch[1];
        const val = propMatch[2].trim().replace(/^"|"$/g, '');
        if (key === 'file') {
          currentItem.file = val;
        }
      }
    }
  }

  return result;
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
