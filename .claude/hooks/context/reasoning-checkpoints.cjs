#!/usr/bin/env node

/**
 * Reasoning Checkpoints Module
 *
 * Injects reminders about how to approach tasks.
 * Only fires if no command was suggested (to avoid noise).
 */

const REASONING_CHECKPOINTS = [
  {
    patterns: [
      /how (does|should|do|can|would).*work/i,
      /what'?s the (best|right|correct|proper) way/i,
      /is (this|that|it) (correct|right|the right way)/i,
      /best practice/i
    ],
    reminder: 'LOOK IT UP: Check context7 or official docs before answering. Don\'t guess at best practices.'
  },
  {
    patterns: [
      /should (I|we) (use|build|create|make|write)/i,
      /which (approach|pattern|tool|library|framework)/i,
      /(what|which) (should|would) (I|we) use/i,
      /between X and Y/i,
      /vs\b/i
    ],
    reminder: 'COMPARE OPTIONS: Look up both approaches. Check what the official docs recommend.'
  },
  {
    patterns: [
      /I need to (build|create|make|write) (a|an|the|my)/i,
      /let me (build|create|make|write) (a|an|the|my)/i,
      /going to (build|create|make|write)/i
    ],
    reminder: 'EXISTING TOOLS FIRST: Before building, check if a library or tool already does this.'
  },
  {
    patterns: [
      /I think (it|this|that) (works|does|is)/i,
      /I believe/i,
      /pretty sure/i,
      /I assume/i,
      /probably (works|does|is)/i
    ],
    reminder: 'VERIFY: Don\'t assume. Read the code or docs to confirm before stating as fact.'
  },
  {
    patterns: [
      /why (isn\'t|isn\'t|doesn\'t|won\'t|can\'t)/i,
      /not working/i,
      /getting (an |this )?error/i,
      /broken/i,
      /bug/i
    ],
    reminder: 'ROOT CAUSE: Read the actual error and code. Don\'t guess at fixes. Understand the problem first.'
  },
  {
    patterns: [
      /how do (I|we|you) (use|implement|set up|configure)/i,
      /how to (use|implement|set up|configure)/i,
      /can you show me how/i
    ],
    reminder: 'CHECK DOCS: Use context7 to get current documentation and examples. Patterns change between versions.'
  },
  {
    patterns: [
      /context7/i,
      /look up.*(docs|documentation)/i,
      /check.*(docs|documentation)/i,
      /\/(astro|react|next|tailwind|typescript)/i
    ],
    reminder: 'CONTEXT7: Use direct library IDs instead of resolve-library-id. Common IDs: /withastro/astro, /facebook/react, /vercel/next.js, /tailwindlabs/tailwindcss, /microsoft/typescript, /motiondivision/motion'
  }
];

/**
 * Check prompt for reasoning checkpoints
 * @param {string} prompt - User's prompt
 * @returns {{ content: string|null, checkpoints: string[] }}
 */
function check(prompt) {
  const reminders = [];

  for (const checkpoint of REASONING_CHECKPOINTS) {
    const matches = checkpoint.patterns.some(pattern => pattern.test(prompt));
    if (matches) {
      reminders.push(checkpoint.reminder);
    }
  }

  // Dedupe and limit to 2 reminders max
  const uniqueReminders = [...new Set(reminders)].slice(0, 2);

  if (uniqueReminders.length > 0) {
    return {
      content: `[REASONING CHECKPOINT]\n${uniqueReminders.join('\n')}`,
      checkpoints: uniqueReminders
    };
  }

  return { content: null, checkpoints: [] };
}

module.exports = {
  REASONING_CHECKPOINTS,
  check
};
