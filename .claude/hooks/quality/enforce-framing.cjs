#!/usr/bin/env node

/**
 * Enforce Framing Hook
 *
 * Event: Stop
 * Purpose: Verify that Context and Task agents were launched this turn
 *
 * Blocks session completion if framing agents weren't used.
 */

const fs = require('fs');
const path = require('path');

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    // If we can't parse, let it through
    process.exit(0);
  }
});

function handleHook(data) {
  const { transcript, stop_hook_active } = data;

  // Only run if this is a stop hook
  if (!stop_hook_active) {
    process.exit(0);
  }

  // Check if this is a simple interaction that doesn't need framing
  // (e.g., just answering a quick question, no tool use)
  const lastMessages = transcript?.slice(-5) || [];
  const hasToolUse = lastMessages.some(msg =>
    msg.role === 'assistant' &&
    msg.content?.some(c => c.type === 'tool_use')
  );

  // If no tool use, framing agents aren't required
  if (!hasToolUse) {
    process.exit(0);
  }

  // Check if Task agents were launched with framing prompts
  const assistantMessages = lastMessages.filter(m => m.role === 'assistant');

  let hasContextAgent = false;
  let hasTaskAgent = false;

  for (const msg of assistantMessages) {
    const content = msg.content || [];
    for (const block of content) {
      if (block.type === 'tool_use' && block.name === 'Task') {
        const prompt = block.input?.prompt?.toLowerCase() || '';
        const desc = block.input?.description?.toLowerCase() || '';

        // Check for context agent
        if (prompt.includes('context agent') ||
            prompt.includes('project definition') ||
            prompt.includes('big picture') ||
            desc.includes('context')) {
          hasContextAgent = true;
        }

        // Check for task agent
        if (prompt.includes('task agent') ||
            prompt.includes('micro-cycle') ||
            prompt.includes('design thinking') ||
            prompt.includes('teaching focus') ||
            desc.includes('task evaluation')) {
          hasTaskAgent = true;
        }
      }
    }
  }

  // For now, just check if EITHER agent was launched
  // We can tighten this to require BOTH once the system is working
  const hasFraming = hasContextAgent || hasTaskAgent;

  if (!hasFraming && hasToolUse) {
    // Output warning but don't block yet - we're in training mode
    console.log('[FRAMING REMINDER] No framing agents detected. Consider launching Context and Task agents for better responses.');
    process.exit(0);  // Exit 0 to not block
  }

  process.exit(0);
}
