#!/usr/bin/env node

/**
 * Session End Hook
 *
 * Event: SessionEnd
 * Purpose: Save meaningful context for next session
 *
 * Saves:
 * - What was accomplished this session
 * - Files worked on
 * - Current task status
 * - What to continue next
 *
 * This feeds into SessionStart so context persists.
 */

const fs = require('fs');
const path = require('path');

const {
  findWorkspaceBrain,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.cjs');

// Note: Session tracking is global. Project state (session_state.json) is per-workspace.

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
  const { session_id } = data;

  const cwd = process.cwd();

  // Session tracking is global
  const sessionId = getSessionId(session_id);
  const tracking = loadSessionTracking(sessionId);

  // Project state is per-workspace
  const brainPath = findWorkspaceBrain(cwd);

  // Mark session as ended
  tracking.sessionEnd = new Date().toISOString();

  // Calculate duration
  if (tracking.sessionStart) {
    const start = new Date(tracking.sessionStart);
    const end = new Date(tracking.sessionEnd);
    const durationMs = end - start;
    tracking.durationMinutes = Math.floor(durationMs / 60000);
  }

  // Create summary (counts for quick reference)
  tracking.summary = {
    filesModified: tracking.filesModified?.length || 0,
    filesCreated: tracking.filesCreated?.length || 0,
    commandsRun: tracking.commands?.length || 0,
    toolsUsed: tracking.tools?.length || 0,
    failures: tracking.failures?.length || 0,
    injections: tracking.injections?.length || 0
  };

  saveSessionTracking(sessionId, tracking);

  // Also update session_state.json with session summary
  // This is what SessionStart loads
  const statePath = path.join(brainPath, 'session_state.json');
  let state = {};
  try {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (e) {}

  // Update with session end info
  state.lastSessionEnd = tracking.sessionEnd;
  state.lastSessionDuration = tracking.durationMinutes;
  state.lastSessionFiles = {
    modified: tracking.filesModified || [],
    created: tracking.filesCreated || []
  };

  // Extract skill/command usage for context
  const skillsUsed = (tracking.tools || [])
    .filter(t => t.tool === 'Skill')
    .map(t => t.skill);
  if (skillsUsed.length > 0) {
    state.lastSessionCommands = [...new Set(skillsUsed)];
  }

  // Extract MCP usage (did I use context7?)
  const mcpUsed = (tracking.tools || [])
    .filter(t => t.tool?.startsWith('mcp__'))
    .map(t => t.server);
  if (mcpUsed.length > 0) {
    state.lastSessionMCP = [...new Set(mcpUsed)];
  }

  // Check if voice profile was used
  const voiceLoads = (tracking.injections || []).filter(i => i.voiceProfileLoaded);
  if (voiceLoads.length > 0) {
    state.voiceProfileUsed = true;
  }

  // Save state
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  // Log summary
  console.error(`[SESSION END] Duration: ${tracking.durationMinutes || '?'}min | Files: ${tracking.summary.filesModified}mod/${tracking.summary.filesCreated}new | Tools: ${tracking.summary.toolsUsed} | Failures: ${tracking.summary.failures}`);

  process.exit(0);
}
