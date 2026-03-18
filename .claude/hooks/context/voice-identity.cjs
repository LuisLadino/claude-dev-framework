#!/usr/bin/env node

/**
 * Voice Reminder Module
 *
 * Detects when Claude is writing content on Luis's behalf and injects
 * a short reminder. Full voice rules are in .claude/CLAUDE.md (always loaded).
 * This just reinforces them at the moment of writing.
 */

// Content writing detection patterns
const CONTENT_WRITING_PATTERNS = [
  /\b(write|draft|create|compose) (a |an |the |my |some )?(article|post|blog|email|message|bio|copy|content|text|description|about|intro|summary)\b/i,
  /\b(write|draft) (this |that |it )?(for me|in my voice)\b/i,
  /\b(portfolio|site|website|page) (content|copy|text)\b/i,
  /\b(home ?page|about page|landing page)\b/i,
  /\bcase study\b/i,
  /\bcover letter\b/i,
  /\bresume\b/i,
  /\blinkedin\b/i,
  /\btweet|thread|post\b/i,
  /\barticle (about|on|for)\b/i,
  /\bblog post\b/i,
  /\bwrite (up|out)\b/i,
  /\bput (this |it )?into words\b/i,
  /\bhow (should|would) (I|this) (say|phrase|word)\b/i
];

/**
 * Check if prompt is content writing
 */
function isContentWriting(prompt) {
  return CONTENT_WRITING_PATTERNS.some(pattern => pattern.test(prompt));
}

/**
 * Check prompt for voice reminder needs
 * @param {string} prompt - User's prompt
 * @returns {{ content: string[]|null, voiceProfileLoaded: boolean }}
 */
function check(prompt) {
  if (!isContentWriting(prompt)) {
    return { content: null, voiceProfileLoaded: false };
  }

  return {
    content: [`[VOICE REMINDER] You are writing content on Luis's behalf. Follow the "Writing for Luis" rules in CLAUDE.md. Key points: no em dashes, no corporate speak, active voice, short sentences, contractions, specific examples. Would Luis actually say this?`],
    voiceProfileLoaded: true
  };
}

module.exports = {
  CONTENT_WRITING_PATTERNS,
  isContentWriting,
  check
};
