#!/usr/bin/env node

/**
 * Capture Corrections Hook (UserPromptSubmit)
 *
 * Detects when user is correcting Claude and immediately captures to learnings.md.
 * Runs on every user message, exits 0 (never blocks).
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const LEARNINGS_PATH = path.join(HOME, '.gemini/antigravity/brain/learnings.md');

// Patterns indicating user is correcting Claude
// Tightened to reduce false positives - must be about Claude's behavior being wrong
const CORRECTION_PATTERNS = [
  // Direct corrections about Claude's behavior
  /you('re| are) not (following|doing|applying|listening)/i,
  /you didn'?t (follow|do|apply|listen|read|check)/i,
  /I (told|asked) you (to|not to)/i,
  /why (aren't|didn't|haven't) you (follow|do|apply|read|check)/i,
  /that's (wrong|incorrect|not right|not what I asked)/i,

  // Methodology/instruction failures
  /you('re| are) not teaching/i,
  /you forgot to/i,
  /you skipped/i,
  /you missed the/i,

  // Explicit behavior callouts
  /stop (guessing|assuming|making up|hallucinating)/i,
  /you('re| are) (hallucinating|pattern.?matching|guessing)/i,
  /read (the code|the file|it) (first|again|before)/i,

  // Repeated corrections
  /I('ve| have) (already )?(told|corrected|reminded) you/i,
  /this is the (second|third|\d+) time/i,
  /we (already )?discussed this/i,
  /I already (said|told|explained)/i
];

async function getInput() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
  });
}

async function main() {
  const input = await getInput();
  const message = input.message || '';

  if (!message) {
    process.exit(0);
  }

  // Check for correction patterns
  const matches = [];
  for (const pattern of CORRECTION_PATTERNS) {
    if (pattern.test(message)) {
      matches.push(pattern.toString());
    }
  }

  if (matches.length === 0) {
    process.exit(0);
  }

  // Correction detected - capture to learnings.md
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toISOString().split('T')[1].slice(0, 5);

  // Truncate message for logging (keep it concise)
  const truncatedMessage = message.length > 200
    ? message.slice(0, 200) + '...'
    : message;

  const entry = `
### [${date} ${time}] (real-time capture)
- User correction: "${truncatedMessage}"
- Pattern matched: ${matches[0]}
- Action: Review and apply this feedback
`;

  try {
    fs.appendFileSync(LEARNINGS_PATH, entry);
    console.log(`[CORRECTION CAPTURED] "${truncatedMessage.slice(0, 50)}..."`);
  } catch (err) {
    console.error(`[CAPTURE ERROR] ${err.message}`);
  }

  // Always allow - this is tracking, not blocking
  process.exit(0);
}

main().catch(() => process.exit(0));
