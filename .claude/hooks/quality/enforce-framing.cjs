#!/usr/bin/env node

/**
 * Enforce Framing Hook
 *
 * Event: Stop
 * Purpose: Verify that design thinking tasks were used for substantive work
 *
 * Checks for:
 * 1. TaskCreate/TaskUpdate usage (native task management, not external agents)
 * 2. Design thinking phases being tracked
 *
 * Warns if substantive work happened without task tracking.
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

  // Check for native task tool usage (TaskCreate, TaskUpdate, TaskList, TaskGet)
  // This is the NEW pattern - Claude uses tasks natively, not via external agents
  const assistantMessages = lastMessages.filter(m => m.role === 'assistant');

  let hasTaskUsage = false;
  const taskTools = ['TaskCreate', 'TaskUpdate', 'TaskList', 'TaskGet'];

  for (const msg of assistantMessages) {
    const content = msg.content || [];
    for (const block of content) {
      if (block.type === 'tool_use' && taskTools.includes(block.name)) {
        hasTaskUsage = true;
        break;
      }
    }
    if (hasTaskUsage) break;
  }

  // Also check for design thinking skill invocation
  let hasDesignThinkingSkill = false;
  for (const msg of assistantMessages) {
    const content = msg.content || [];
    for (const block of content) {
      if (block.type === 'tool_use' && block.name === 'Skill') {
        const skill = block.input?.skill?.toLowerCase() || '';
        if (skill.includes('design-thinking')) {
          hasDesignThinkingSkill = true;
          break;
        }
      }
    }
  }

  const hasFraming = hasTaskUsage || hasDesignThinkingSkill;

  if (!hasFraming && hasToolUse) {
    // Output warning but don't block yet - we're in training mode
    console.log('[FRAMING REMINDER] Substantive work without design thinking tasks. Consider using TaskCreate to track the work.');
    process.exit(0);  // Exit 0 to not block
  }

  process.exit(0);
}
