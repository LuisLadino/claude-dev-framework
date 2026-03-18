#!/usr/bin/env node

/**
 * Session End Hook
 *
 * Event: SessionEnd
 * Purpose: Save session summary to tracking
 *
 * Note: SessionEnd is unreliable (doesn't fire on terminal close).
 * Don't depend on this for critical persistence.
 */

const fs = require('fs');
const path = require('path');

const {
  getProjectDir,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.cjs');

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
  const { session_id } = data;

  const cwd = process.cwd();
  const sessionId = getSessionId(session_id);
  const tracking = loadSessionTracking(sessionId);

  // Mark session as ended
  tracking.sessionEnd = new Date().toISOString();

  // Calculate duration
  if (tracking.sessionStart) {
    const start = new Date(tracking.sessionStart);
    const end = new Date(tracking.sessionEnd);
    const durationMs = end - start;
    tracking.durationMinutes = Math.floor(durationMs / 60000);
  }

  // Create summary
  tracking.summary = {
    filesModified: tracking.filesModified?.length || 0,
    filesCreated: tracking.filesCreated?.length || 0,
    commandsRun: tracking.commands?.length || 0,
    toolsUsed: tracking.tools?.length || 0,
    failures: tracking.failures?.length || 0,
    injections: tracking.injections?.length || 0
  };

  saveSessionTracking(sessionId, tracking);

  console.error(`[SESSION END] Duration: ${tracking.durationMinutes || '?'}min | Files: ${tracking.summary.filesModified}mod/${tracking.summary.filesCreated}new | Tools: ${tracking.summary.toolsUsed} | Failures: ${tracking.summary.failures}`);

  process.exit(0);
}
