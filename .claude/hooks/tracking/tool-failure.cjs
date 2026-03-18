#!/usr/bin/env node

/**
 * Tool Failure Tracker
 *
 * Event: PostToolUseFailure (all tools)
 * Purpose: Track failed tool calls for debugging
 */

const fs = require('fs');
const path = require('path');

const {
  getSessionId,
  loadSessionTracking,
  saveSessionTracking,
  logError
} = require('../lib/session-utils.cjs');

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

function handleHook(data) {
  const { tool_name, tool_input, tool_response, session_id } = data;

  if (!tool_name) {
    process.exit(0);
  }

  const sessionId = getSessionId(session_id);
  const tracking = loadSessionTracking(sessionId);

  if (!tracking.failures) {
    tracking.failures = [];
  }

  const entry = {
    timestamp: new Date().toISOString(),
    tool: tool_name,
    error: tool_response?.error || tool_response?.stderr || 'Unknown error'
  };

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
