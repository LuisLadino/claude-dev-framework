#!/usr/bin/env node

/**
 * Voice & Identity Module
 *
 * Handles content writing detection and identity injection for ideation.
 */

const { loadIdentityContext } = require('./inject-utils.cjs');

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

// Ideation patterns - inject identity BEFORE creative work starts
const IDEATION_PATTERNS = [
  /\b(brainstorm|ideate|ideas? for|think about|explore options)\b/i,
  /\bwhat (should|could|might) (I|we|this) (say|write|include|mention)\b/i,
  /\bhow (should|could|might) (I|we) (approach|frame|position|present)\b/i,
  /\bhelp me (think|come up with|figure out|draft|write)\b/i,
  /\bwhat'?s (the|a good) (angle|approach|way to say)\b/i,
  /\b(draft|outline|sketch) (a |an |the |some )?(concept|idea|approach)\b/i,
  /\blet'?s (brainstorm|think about|explore)\b/i,
  /\bwhat (points|things|aspects) should\b/i,
  /\bhow do I (demonstrate|show|prove|convey)\b/i,
  /\bwhat (story|narrative|message)\b/i
];

/**
 * Check if prompt is content writing
 */
function isContentWriting(prompt) {
  return CONTENT_WRITING_PATTERNS.some(pattern => pattern.test(prompt));
}

/**
 * Check if prompt is ideation
 */
function isIdeation(prompt) {
  return IDEATION_PATTERNS.some(pattern => pattern.test(prompt));
}

/**
 * Check prompt for voice/identity injection needs
 * @param {string} prompt - User's prompt
 * @returns {{ content: string[]|null, identityLoaded: boolean, voiceProfileLoaded: boolean, isContentWriting: boolean, isIdeation: boolean }}
 */
function check(prompt) {
  const contentParts = [];
  let identityLoaded = false;
  let voiceProfileLoaded = false;

  const contentWriting = isContentWriting(prompt);
  const ideation = isIdeation(prompt);

  // Ideation - inject identity + condensed voice
  if (ideation) {
    const identity = loadIdentityContext();

    if (identity) {
      identityLoaded = true;
      contentParts.push(`[IDEATION CONTEXT - WHO IS LUIS]

You are ideating/drafting content for Luis. Keep this context in mind:

${identity}

**What to consider:**
- What is Luis trying to demonstrate or prove?
- Who is the audience for this content?
- How does this connect to his goals?
- What expertise should come through?`);
    }

    // Condensed voice for ideation
    voiceProfileLoaded = true;
    contentParts.push(`[VOICE PROFILE - MAINTAIN THROUGHOUT]
Even during ideation, think in Luis's voice:
- Direct, honest, evidence-based
- No em dashes, no corporate speak, no filler
- Short sentences, active voice, contractions
- Would Luis actually say this?`);
  }

  // Content writing - inject full voice profile (if not already loaded)
  if (contentWriting && !voiceProfileLoaded) {
    voiceProfileLoaded = true;
    contentParts.push(`[VOICE PROFILE - WRITE AS LUIS]
Writing content as Luis's voice. Key rules:

**Core voice:** Direct, honest, evidence-based, warm but professional.

**NEVER use:**
- Em dashes (—) - use periods or colons
- Corporate speak: leverage, synergize, passionate, utilize, ensure
- Filler: "solid", "comprehensive", "well-structured"
- Scaffolding: "Here's what I found:", "Let me explain:"
- Absolutes: "I always..."

**DO use:**
- Contractions: doesn't, won't, I've
- Short sentences. Active voice. Specific examples.
- Varied sentence length. Mix short and medium.
- Technical vocabulary when precise (not buzzwords)

**The check:** Would Luis actually say this? If it sounds like LinkedIn, rewrite.
Full profile: ~/.gemini/antigravity/brain/voice-profile.md`);
  }

  return {
    content: contentParts.length > 0 ? contentParts : null,
    identityLoaded,
    voiceProfileLoaded,
    isContentWriting: contentWriting,
    isIdeation: ideation
  };
}

module.exports = {
  CONTENT_WRITING_PATTERNS,
  IDEATION_PATTERNS,
  isContentWriting,
  isIdeation,
  check
};
