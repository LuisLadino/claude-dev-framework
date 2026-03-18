#!/usr/bin/env node

/**
 * Track File Changes Hook
 *
 * Event: PostToolUse (Edit|Write)
 * Purpose: Maintains a session log of all files modified
 *
 * Stores tracking in:
 * ~/.claude/projects/{workspace-key}/tracking/{session-id}.json
 */

const fs = require('fs');
const path = require('path');

const {
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.cjs');

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
  const { tool_name, tool_input, tool_response, session_id } = data;

  // Get file path from tool input
  const filePath = tool_input?.file_path;
  if (!filePath) {
    process.exit(0);
  }

  const cwd = process.cwd();

  // Get session (global tracking)
  const sessionId = getSessionId(session_id);

  // Load current session tracking
  const tracking = loadSessionTracking(sessionId);

  // Determine if this is a create or modify
  const isCreate = tool_name === 'Write' && !fileExisted(filePath);
  const relativePath = path.relative(cwd, filePath);

  // Add to appropriate list (deduplicated)
  if (isCreate) {
    if (!tracking.filesCreated.includes(relativePath)) {
      tracking.filesCreated.push(relativePath);
    }
  } else {
    if (!tracking.filesModified.includes(relativePath)) {
      tracking.filesModified.push(relativePath);
    }
  }

  // Log the operation with timestamp
  tracking.operations.push({
    timestamp: new Date().toISOString(),
    tool: tool_name,
    file: relativePath,
    type: isCreate ? 'create' : 'modify'
  });

  // Save updated tracking
  saveSessionTracking(sessionId, tracking);

  process.exit(0);
}
