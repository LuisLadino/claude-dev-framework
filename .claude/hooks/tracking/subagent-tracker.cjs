#!/usr/bin/env node

/**
 * Subagent Tracker
 *
 * Event: SubagentStart, SubagentStop
 * Purpose: Track when subagents spawn and finish
 *
 * Useful for:
 * - /audit parallel agents
 * - Task tool subagents
 * - Background tasks
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
    process.exit(0);
  }
});

function handleHook(data) {
  const { session_id, hook_type, subagent_id, subagent_type, description } = data;

  // Get session (global tracking)
  const sessionId = getSessionId(session_id);
  const tracking = loadSessionTracking(sessionId);

  // Initialize subagents array if needed
  if (!tracking.subagents) {
    tracking.subagents = [];
  }

  const event = hook_type?.includes('Start') ? 'start' : 'stop';

  // For start events, add new entry
  // For stop events, try to find and update existing entry
  if (event === 'start') {
    tracking.subagents.push({
      id: subagent_id,
      type: subagent_type,
      description: description,
      startedAt: new Date().toISOString()
    });
  } else {
    // Find the matching subagent and update it
    const subagent = tracking.subagents.find(s => s.id === subagent_id);
    if (subagent) {
      subagent.stoppedAt = new Date().toISOString();
      // Calculate duration
      if (subagent.startedAt) {
        const start = new Date(subagent.startedAt);
        const end = new Date(subagent.stoppedAt);
        subagent.durationSeconds = Math.floor((end - start) / 1000);
      }
    } else {
      // Subagent not found (maybe started before tracking), add it anyway
      tracking.subagents.push({
        id: subagent_id,
        type: subagent_type,
        stoppedAt: new Date().toISOString()
      });
    }
  }

  saveSessionTracking(sessionId, tracking);

  process.exit(0);
}
