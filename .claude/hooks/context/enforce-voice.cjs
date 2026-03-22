#!/usr/bin/env node

/**
 * Enforce Voice Guidelines Hook
 *
 * Event: PreToolUse (Bash)
 * Type: Marker-based enforcement
 * Purpose: Injects voice reminder when content is being copied to clipboard
 *
 * pbcopy is a reliable signal that content is going external (Slack, email,
 * applications). This is the last gate before content represents Luis.
 *
 * Blocks pbcopy unless VOICE_CHECKED=1 marker is present, proving Claude
 * saw the voice guidelines before copying.
 */

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
  const { tool_input } = data;
  const command = tool_input?.command;

  if (!command) {
    process.exit(0);
  }

  // Only care about commands that pipe to pbcopy
  if (!/\bpbcopy\b/.test(command)) {
    process.exit(0);
  }

  // Allow if voice check marker is present
  if (command.includes('VOICE_CHECKED=1')) {
    process.exit(0);
  }

  // Block and inject voice reminder
  const reminder = [
    '[VOICE CHECK] Content is going to clipboard — it will represent Luis externally.',
    '',
    'Before copying, verify the content follows "Writing for Luis" rules in CLAUDE.md:',
    '- No em dashes (use periods or colons)',
    '- No corporate speak (leverage, synergize, ensure, utilize, passionate)',
    '- Active voice, short sentences, contractions',
    '- Specific examples over adjectives. Show, don\'t tell.',
    '- Varied sentence length. Mix short and medium.',
    '- No scaffolding phrases ("Here\'s what I found:", "Let me explain:")',
    '- Would Luis actually say this? If it sounds like AI wrote it, rewrite it.',
    '',
    'Review the content, apply voice guidelines, then retry with VOICE_CHECKED=1 prefix.',
    'Example: VOICE_CHECKED=1 echo "revised content" | pbcopy'
  ].join('\n');

  console.error(reminder);
  process.exit(2);
}
