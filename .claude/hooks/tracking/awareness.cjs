#!/usr/bin/env node

/**
 * Awareness Hook
 *
 * Event: UserPromptSubmit
 * Purpose: Detect conditions that warrant running /analyze
 *
 * Checks tracking data for accumulated failures.
 * Outputs a gentle reminder when conditions are met.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  getSessionId,
  loadSessionTracking
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

// Thresholds
const FAILURES_THRESHOLD = 5;

// Cooldown: don't spam the same warning
const COOLDOWN_FILE = path.join(os.tmpdir(), 'claude-awareness-cooldown.json');
const COOLDOWN_MINUTES = 30;

function handleHook(data) {
  const { session_id } = data;

  let cooldowns = {};
  try {
    cooldowns = JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf8'));
  } catch (e) {}

  const now = Date.now();
  const warnings = [];

  // Check session tracking for failures
  if (session_id) {
    const sessionId = getSessionId(session_id);
    const tracking = loadSessionTracking(sessionId);

    const failureCount = tracking.failures?.length || 0;
    if (failureCount >= FAILURES_THRESHOLD && !inCooldown(cooldowns, 'failures', now)) {
      warnings.push(`${failureCount} tool failures this session. Worth investigating.`);
      cooldowns.failures = now;
    }
  }

  // Save cooldown state
  try {
    fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(cooldowns, null, 2));
  } catch (e) {}

  // Output warnings
  if (warnings.length > 0) {
    console.error('\n[AWARENESS] System check:');
    warnings.forEach(w => console.error(`  - ${w}`));
    console.error('Consider running /analyze to investigate.\n');
  }

  process.exit(0);
}

function inCooldown(cooldowns, key, now) {
  if (!cooldowns[key]) return false;
  const elapsed = (now - cooldowns[key]) / 60000;
  return elapsed < COOLDOWN_MINUTES;
}
