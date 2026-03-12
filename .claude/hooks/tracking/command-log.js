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
  const { tool_input, tool_response } = data;

  const command = tool_input?.command;
  if (!command) {
    process.exit(0);
  }

  const cwd = process.cwd();

  // Find brain folder and session
  const brainPath = findWorkspaceBrain(cwd);
  const sessionId = getSessionId(brainPath);

  // Load current session tracking
  const tracking = loadSessionTracking(brainPath, sessionId);

  // Initialize commands array if needed
  if (!tracking.commands) {
    tracking.commands = [];
  }

  // Log the command
  tracking.commands.push({
    timestamp: new Date().toISOString(),
    command: command,
    exitCode: tool_response?.exitCode ?? null,
    success: tool_response?.exitCode === 0
  });

  // Save updated tracking
  saveSessionTracking(brainPath, sessionId, tracking);

  process.exit(0);
}
