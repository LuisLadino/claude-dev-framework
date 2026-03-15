#!/usr/bin/env node

/**
 * Inject Task Framing Hook
 *
 * Event: UserPromptSubmit (runs after Task Agent)
 * Purpose: Reads Task Agent output and injects as additionalContext
 *
 * This hook runs AFTER the Task Agent has written to .claude/current-task.json
 * It reads that file and outputs the content for Claude to see.
 */

const fs = require('fs');
const path = require('path');

const TASK_FILE = '.claude/current-task.json';

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    handleHook();
  } catch (e) {
    // On error, exit silently
    process.exit(0);
  }
});

function handleHook() {
  const taskPath = path.join(process.cwd(), TASK_FILE);

  // Check if task file exists
  if (!fs.existsSync(taskPath)) {
    // No task file - Task Agent may not have run
    // Don't inject anything, let the main agent handle it
    process.exit(0);
  }

  // Read and parse task file
  let task;
  try {
    const content = fs.readFileSync(taskPath, 'utf8');
    task = JSON.parse(content);
  } catch (e) {
    // Can't parse, skip injection
    process.exit(0);
  }

  // Check if this is a simple task that doesn't need framing
  if (task.simple_task) {
    process.exit(0);
  }

  // Format task framing for injection
  const parts = [];

  parts.push('[TASK FRAMING - From Task Agent]');
  parts.push('');

  // Task type and summary
  parts.push(`TASK: ${task.prompt_summary || 'Unknown'}`);
  parts.push(`TYPE: ${task.task_type || 'Unknown'}`);
  parts.push('');

  // Design cycle position
  if (task.design_cycle) {
    parts.push('DESIGN CYCLE:');
    parts.push(`- Phase: ${task.design_cycle.phase || 'Unknown'}`);
    parts.push(`- Status: ${task.design_cycle.status || ''}`);
    parts.push(`- Next Action: ${task.design_cycle.next_action || ''}`);
    parts.push('');
  }

  // Research needed
  if (task.research_needed?.length > 0) {
    parts.push('RESEARCH NEEDED:');
    task.research_needed.forEach(r => {
      parts.push(`- [${r.type}] ${r.target}: ${r.reason || ''}`);
    });
    parts.push('');
  }

  // Lenses
  if (task.lenses) {
    parts.push(`LENSES: ${task.lenses.primary?.join(', ') || 'Not set'}`);
    if (task.lenses.supporting?.length > 0) {
      parts.push(`SUPPORTING: ${task.lenses.supporting.join(', ')}`);
    }
    if (task.lenses.rationale) {
      parts.push(`RATIONALE: ${task.lenses.rationale}`);
    }
    parts.push('');
  }

  // Teaching focus
  if (task.teaching_focus?.length > 0) {
    parts.push('TEACHING FOCUS:');
    task.teaching_focus.forEach(t => {
      parts.push(`\nCONCEPT: ${t.concept}`);
      parts.push(`COMPETENCY: ${t.competency}`);
      parts.push(`MECHANISM: ${t.mechanism}`);
      parts.push(`USAGE: ${t.usage}`);
      parts.push(`CONNECTION: ${t.connection}`);
    });
    parts.push('');
  }

  // Big picture connection
  if (task.big_picture_connection) {
    parts.push(`BIG PICTURE: ${task.big_picture_connection}`);
    parts.push('');
  }

  // Task state (design thinking phases)
  if (task.task_state) {
    parts.push('TASK STATE:');
    if (task.task_state.current_phase_task) {
      parts.push(`- Current: ${task.task_state.current_phase_task}`);
    }
    if (task.task_state.completed_tasks?.length > 0) {
      parts.push(`- Completed: ${task.task_state.completed_tasks.join(', ')}`);
    }
    if (task.task_state.next_task) {
      parts.push(`- Next: ${task.task_state.next_task}`);
    }
    if (task.task_state.note) {
      parts.push(`- Note: ${task.task_state.note}`);
    }
    parts.push('');
  }

  // Task actions (what Claude should do with tasks)
  if (task.task_actions?.length > 0) {
    parts.push('TASK ACTIONS NEEDED:');
    task.task_actions.forEach(a => {
      if (a.action === 'create_phase_tasks') {
        parts.push(`- CREATE phase tasks for: ${a.work_area}`);
        parts.push(`  Reason: ${a.reason}`);
      } else if (a.action === 'complete') {
        parts.push(`- COMPLETE task ${a.taskId}: ${a.reason}`);
      } else if (a.action === 'start') {
        parts.push(`- START task ${a.taskId}: ${a.reason}`);
      }
    });
    parts.push('');
  }

  // Recommended approach
  if (task.recommended_approach) {
    parts.push('RECOMMENDED APPROACH:');
    parts.push(task.recommended_approach);
  }

  const output = {
    additionalContext: parts.join('\n')
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}
