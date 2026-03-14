#!/usr/bin/env node

/**
 * Tool Failure Tracker
 *
 * Event: PostToolUseFailure (all tools)
 * Purpose: Track failed tool calls for debugging
 *
 * Why: PostToolUse only fires on success. This catches failures.
 */

const fs = require('fs');
const path = require('path');

const {
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.cjs');

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    logError('tool-failure', e.message);
    process.exit(0);
  }
});

function logError(hook, message) {
  const debugPath = path.join(process.env.HOME, '.gemini/antigravity/brain/hook-errors.log');
  const entry = `[${new Date().toISOString()}] ${hook}: ${message}\n`;
  try {
    fs.appendFileSync(debugPath, entry);
  } catch (e) {}
}

function handleHook(data) {
  const { tool_name, tool_input, tool_response, session_id } = data;

  if (!tool_name) {
    process.exit(0);
  }

  // Get session (global tracking)
  const sessionId = getSessionId(session_id);
  const tracking = loadSessionTracking(sessionId);

  // Initialize failures array if needed
  if (!tracking.failures) {
    tracking.failures = [];
  }

  // Build failure entry
  const entry = {
    timestamp: new Date().toISOString(),
    tool: tool_name,
    error: tool_response?.error || tool_response?.stderr || 'Unknown error'
  };

  // Add relevant input for debugging
  switch (tool_name) {
    case 'Read':
    case 'Edit':
    case 'Write':
      entry.file = tool_input?.file_path;
      break;
    case 'Bash':
      entry.command = tool_input?.command?.slice(0, 100);
      break;
    case 'Glob':
    case 'Grep':
      entry.pattern = tool_input?.pattern;
      break;
    default:
      if (tool_name.startsWith('mcp__')) {
        entry.server = tool_name.split('__')[1];
      }
  }

  tracking.failures.push(entry);
  saveSessionTracking(sessionId, tracking);

  process.exit(0);
}
