#!/usr/bin/env node

/**
 * Track File Changes Hook
 *
 * Event: PostToolUse (Edit|Write)
 * Purpose: Maintains a session log of all files modified
 *
 * This data is used by:
 * - /checkpoint for accurate session summaries
 * - /commit for knowing which files to stage
 * - Session state for brain artifacts
 */

const fs = require('fs');
const path = require('path');

const SESSION_CHANGES_FILE = '.claude/session-changes.json';

function loadSessionChanges() {
  try {
    const content = fs.readFileSync(SESSION_CHANGES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return {
      sessionStart: new Date().toISOString(),
      filesModified: [],
      filesCreated: [],
      operations: []
    };
  }
}

function saveSessionChanges(data) {
  const dir = path.dirname(SESSION_CHANGES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SESSION_CHANGES_FILE, JSON.stringify(data, null, 2));
}

function fileExisted(filePath) {
  // Check git to see if file existed before
  try {
    const { execSync } = require('child_process');
    execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
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
    process.exit(0);
  }
});

function handleHook(data) {
  const { tool_name, tool_input, tool_response } = data;

  // Get file path from tool input
  const filePath = tool_input?.file_path;
  if (!filePath) {
    process.exit(0);
  }

  // Load current session changes
  const changes = loadSessionChanges();

  // Determine if this is a create or modify
  const isCreate = tool_name === 'Write' && !fileExisted(filePath);
  const relativePath = path.relative(process.cwd(), filePath);

  // Add to appropriate list (deduplicated)
  if (isCreate) {
    if (!changes.filesCreated.includes(relativePath)) {
      changes.filesCreated.push(relativePath);
    }
  } else {
    if (!changes.filesModified.includes(relativePath)) {
      changes.filesModified.push(relativePath);
    }
  }

  // Log the operation with timestamp
  changes.operations.push({
    timestamp: new Date().toISOString(),
    tool: tool_name,
    file: relativePath,
    type: isCreate ? 'create' : 'modify'
  });

  // Save updated changes
  saveSessionChanges(changes);

  process.exit(0);
}
