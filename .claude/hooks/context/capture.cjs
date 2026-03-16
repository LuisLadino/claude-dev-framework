#!/usr/bin/env node

/**
 * Capture Module
 *
 * Handles "capture this" requests to persist ideas/insights to brain files.
 */

const path = require('path');
const HOME = process.env.HOME || process.env.USERPROFILE;

// Capture trigger patterns
const CAPTURE_PATTERNS = [
  /\bcapture[:\s]+this\b/i,
  /\bcapture[:\s]+that\b/i,
  /\bcapture[:\s]+.{5,}/i,
  /\bsave (this|that) (to|in) (the )?(brain|learnings|decisions|patterns)\b/i,
  /\bremember (this|that)\b/i,
  /\bwrite (this|that) down\b/i,
  /\badd (this|that) to (the )?(learnings|decisions|patterns)\b/i
];

// Routing keywords to determine target file
const CAPTURE_ROUTING = {
  'decision': 'decisions.md',
  'pattern': 'patterns.md',
  'learning': 'learnings.md',
  'mistake': 'learnings.md',
  'remember': 'learnings.md'
};

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

  // Determine target file based on keywords
  let targetFile = null;
  for (const [keyword, file] of Object.entries(CAPTURE_ROUTING)) {
    if (prompt.toLowerCase().includes(keyword)) {
      targetFile = file;
      break;
    }
  }

  // Extract explicit content if provided
  const explicitMatch = prompt.match(/capture[:\s]+(.{10,})/i);
  const explicitContent = explicitMatch ? explicitMatch[1].trim() : null;

  const brainBasePath = path.join(HOME, '.gemini/antigravity/brain');
  const today = new Date().toISOString().split('T')[0];

  const targetFileInstruction = targetFile
    ? `Target file: ${targetFile}`
    : `Target file: Decide based on content type:
  - decisions.md = architectural/design choices
  - patterns.md = technical patterns discovered
  - learnings.md = mistakes, corrections, things to remember`;

  const captureInstructions = explicitContent
    ? `[CAPTURE TRIGGERED]
Content to persist: "${explicitContent}"
${targetFileInstruction}

**Action required:** Write this to the brain file.
Use the brain path from your session context (e.g., ~/.gemini/antigravity/brain/{uuid}/).
Append with this format:

\`\`\`markdown
### [${today}] [Brief title]
${explicitContent}

Context: [What prompted this capture]
\`\`\`

Confirm what was captured and where.`
    : `[CAPTURE TRIGGERED]
User wants to capture something from this conversation.
${targetFileInstruction}

**Action required:** Extract and persist the relevant insight.
1. Identify what the user wants to capture from the conversation
2. Determine the appropriate file based on content type
3. Use the brain path from your session context
4. Append with this format:

\`\`\`markdown
### [${today}] [Brief title]
[The captured content - be specific]

Context: [What prompted this capture]
\`\`\`

Confirm what was captured and where.`;

  return {
    content: captureInstructions,
    triggered: true
  };
}

module.exports = {
  CAPTURE_PATTERNS,
  CAPTURE_ROUTING,
  isCaptureRequest,
  check
};
