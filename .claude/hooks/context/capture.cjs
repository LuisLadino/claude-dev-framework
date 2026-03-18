#!/usr/bin/env node

/**
 * Capture Module
 *
 * Handles "capture this" / "remember that" requests.
 * Redirects to Claude's native memory system instead of brain files.
 */

// Capture trigger patterns
const CAPTURE_PATTERNS = [
  /\bcapture[:\s]+this\b/i,
  /\bcapture[:\s]+that\b/i,
  /\bcapture[:\s]+.{5,}/i,
  /\bsave (this|that) (to|in) (the )?(brain|learnings|decisions|patterns|memory)\b/i,
  /\bremember (this|that)\b/i,
  /\bwrite (this|that) down\b/i,
  /\badd (this|that) to (the )?(learnings|decisions|patterns|memory)\b/i
];

/**
 * Check if prompt is a capture request
 */
function isCaptureRequest(prompt) {
  return CAPTURE_PATTERNS.some(pattern => pattern.test(prompt));
}

/**
 * Check prompt for capture requests
 * @param {string} prompt - User's prompt
 * @returns {{ content: string|null, triggered: boolean }}
 */
function check(prompt) {
  if (!isCaptureRequest(prompt)) {
    return { content: null, triggered: false };
  }

  return {
    content: `[CAPTURE TRIGGERED]
User wants to save something. Use your memory system to persist it.

Choose the appropriate memory type:
- **user** — information about Luis's role, goals, preferences
- **feedback** — corrections or guidance Luis has given you
- **project** — ongoing work context, decisions, discoveries
- **reference** — pointers to external resources

Write the memory file, then update MEMORY.md index. Confirm what was captured.`,
    triggered: true
  };
}

module.exports = {
  CAPTURE_PATTERNS,
  isCaptureRequest,
  check
};
