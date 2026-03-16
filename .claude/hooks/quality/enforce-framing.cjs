#!/usr/bin/env node

/**
 * Enforce Framing Hook
 *
 * Event: Stop
 * Purpose: ENFORCE design thinking task tracking for all tool use
 *
 * Type: Marker-based enforcement (checks transcript for TaskCreate/TaskUpdate)
 * Constraint: Claude ignores task reminders, does work without tracking decisions
 * Solution: Block responses that have tool use without task management
 *
 * Any tool use = changes = decisions being made = needs task tracking
 * Tasks tie to GitHub Issues (system of record)
 *
 * Exit 2 if tool use without task usage (blocks response)
 * Exit 0 if task usage present OR no tool use (allows)
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
    console.error('\n[BLOCKED] Tool use without task tracking.');
    console.error('\nAny tool use = changes = decisions being made.');
    console.error('Decisions need to be tracked in design thinking tasks.');
    console.error('\nRequired: Use TaskCreate to create a task for the current work.');
    console.error('Tasks should tie to a GitHub Issue (system of record).');
    console.error('\nExample:');
    console.error('  TaskCreate: "UNDERSTAND - Research enforcement patterns"');
    console.error('  TaskCreate: "PROTOTYPE - Implement teaching format hook"');
    console.error('\nThen retry your action.\n');
    process.exit(2);  // BLOCK - enforce task tracking
  }

  process.exit(0);
}
