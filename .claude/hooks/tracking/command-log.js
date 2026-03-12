#!/usr/bin/env node

/**
 * Command Log Hook
 *
 * Event: PostToolUse (Bash)
 * Purpose: Logs all bash commands executed during session
 *
 * This data is used by:
 * - Learning review (what commands were run)
 * - Debugging (what happened in this session)
 * - /checkpoint for session summaries
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
      operations: [],
      commands: []
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
  const { tool_input, tool_response } = data;

  const command = tool_input?.command;
  if (!command) {
    process.exit(0);
  }

  // Load current session changes
  const changes = loadSessionChanges();

  // Initialize commands array if needed
  if (!changes.commands) {
    changes.commands = [];
  }

  // Log the command
  changes.commands.push({
    timestamp: new Date().toISOString(),
    command: command,
    exitCode: tool_response?.exitCode ?? null,
    success: tool_response?.exitCode === 0
  });

  // Save updated changes
  saveSessionChanges(changes);

  process.exit(0);
}
