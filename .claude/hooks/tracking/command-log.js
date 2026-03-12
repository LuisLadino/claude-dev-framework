#!/usr/bin/env node

/**
 * Command Log Hook
 *
 * Event: PostToolUse (Bash)
 * Purpose: Logs all bash commands executed during session
 *
 * Stores tracking in brain:
 * ~/.gemini/antigravity/brain/{workspace-uuid}/sessions/{session-id}.json
 */

const fs = require('fs');
const path = require('path');

const {
  findWorkspaceBrain,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.js');

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
  const { tool_input, tool_response, session_id } = data;

  const command = tool_input?.command;
  if (!command) {
    process.exit(0);
  }

  const cwd = process.cwd();

  // Find brain folder and session
  // Use Claude Code's session_id to eliminate fragmentation
  const brainPath = findWorkspaceBrain(cwd);
  const sessionId = getSessionId(brainPath, session_id);

  // Load current session tracking
  const tracking = loadSessionTracking(brainPath, sessionId);

  // Initialize commands array if needed
  if (!tracking.commands) {
    tracking.commands = [];
  }

  // Log the command
  // PostToolUse only fires for successful commands (exit code 0)
  // Failed commands don't trigger PostToolUse at all
  tracking.commands.push({
    timestamp: new Date().toISOString(),
    command: command,
    exitCode: 0,  // PostToolUse = success
    success: true,
    stdout: tool_response?.stdout?.slice(0, 500) || '',  // Capture first 500 chars
    interrupted: tool_response?.interrupted || false
  });

  // Save updated tracking
  saveSessionTracking(brainPath, sessionId, tracking);

  process.exit(0);
}
