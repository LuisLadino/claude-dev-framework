#!/usr/bin/env node

/**
 * Awareness Hook
 *
 * Event: UserPromptSubmit
 * Purpose: Detect conditions that warrant running /analyze
 *
 * Checks for:
 * - Large context files (learnings.md)
 * - Failures accumulating
 * - Overview.txt bloat
 *
 * Outputs a gentle reminder when conditions are met.
 * Note: Context saving is handled automatically by pre-compact.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Global tracking directory
const HOME = process.env.HOME || process.env.USERPROFILE;
const TRACKING_DIR = path.join(HOME, '.gemini/antigravity/brain/tracking/sessions');

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

// Thresholds
const LEARNINGS_LINE_THRESHOLD = 200;
const PATTERNS_LINE_THRESHOLD = 150;
const FAILURES_THRESHOLD = 5;

// Cooldown: don't spam the same warning
const COOLDOWN_FILE = path.join(os.tmpdir(), 'claude-awareness-cooldown.json');
const COOLDOWN_MINUTES = 30;

function handleHook(data) {
  const { session_id } = data;

  // Load cooldown state
  let cooldowns = {};
  try {
    cooldowns = JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf8'));
  } catch (e) {}

  const now = Date.now();
  const warnings = [];

  // Check brain files
  const brainPath = findBrainPath();
  if (brainPath) {
    // Check learnings.md size
    const learningsPath = path.join(brainPath, '..', 'learnings.md');
    const learningsLines = countLines(learningsPath);
    if (learningsLines > LEARNINGS_LINE_THRESHOLD && !inCooldown(cooldowns, 'learnings', now)) {
      warnings.push(`learnings.md is ${learningsLines} lines (threshold: ${LEARNINGS_LINE_THRESHOLD}). May need consolidation.`);
      cooldowns.learnings = now;
    }

    // Check patterns.md size
    const patternsPath = path.join(brainPath, 'patterns.md');
    const patternsLines = countLines(patternsPath);
    if (patternsLines > PATTERNS_LINE_THRESHOLD && !inCooldown(cooldowns, 'patterns', now)) {
      warnings.push(`patterns.md is ${patternsLines} lines (threshold: ${PATTERNS_LINE_THRESHOLD}). May need review.`);
      cooldowns.patterns = now;
    }

    // Check session tracking for failures and activity (global tracking)
    const sessionFile = findCurrentSessionFile(session_id);
    if (sessionFile) {
      try {
        const tracking = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));

        // Check failures
        const failureCount = tracking.failures?.length || 0;
        if (failureCount >= FAILURES_THRESHOLD && !inCooldown(cooldowns, 'failures', now)) {
          warnings.push(`${failureCount} tool failures this session. Worth investigating.`);
          cooldowns.failures = now;
        }

        // Note: Tool call volume, file edits, and session duration checks removed
        // pre-compact.js handles context saving automatically before compaction
      } catch (e) {}
    }

    // Check overview.txt size (if daemon is generating it)
    const overviewPath = path.join(brainPath, 'overview.txt');
    const overviewLines = countLines(overviewPath);
    if (overviewLines > 100 && !inCooldown(cooldowns, 'overview', now)) {
      warnings.push(`overview.txt is ${overviewLines} lines. Daemon may need tuning.`);
      cooldowns.overview = now;
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
    console.error('Consider running /analyze to analyze and improve.\n');
  }

  process.exit(0);
}

function findBrainPath() {
  // Look for brain path in environment or find workspace brain
  const cwd = process.cwd();
  const antigravityBase = path.join(os.homedir(), '.gemini', 'antigravity', 'brain');

  // Find workspace brain by checking for session files
  try {
    const dirs = fs.readdirSync(antigravityBase);
    for (const dir of dirs) {
      const workspacePath = path.join(antigravityBase, dir);
      const stat = fs.statSync(workspacePath);
      if (stat.isDirectory()) {
        // Check if this is a workspace brain (has sessions/)
        const sessionsDir = path.join(workspacePath, 'sessions');
        if (fs.existsSync(sessionsDir)) {
          // Check if any session file references our cwd
          const sessionFiles = fs.readdirSync(sessionsDir);
          for (const sf of sessionFiles.slice(-5)) { // Check recent files
            try {
              const session = JSON.parse(fs.readFileSync(path.join(sessionsDir, sf), 'utf8'));
              if (session.workspace === cwd) {
                return workspacePath;
              }
            } catch (e) {}
          }
        }
      }
    }
  } catch (e) {}

  return null;
}

function findCurrentSessionFile(sessionId) {
  if (!sessionId) return null;

  const sessionFile = path.join(TRACKING_DIR, `${sessionId}.json`);

  if (fs.existsSync(sessionFile)) {
    return sessionFile;
  }

  return null;
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (e) {
    return 0;
  }
}

function inCooldown(cooldowns, key, now) {
  if (!cooldowns[key]) return false;
  const elapsed = (now - cooldowns[key]) / 60000; // minutes
  return elapsed < COOLDOWN_MINUTES;
}
