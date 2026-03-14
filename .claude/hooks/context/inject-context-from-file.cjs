#!/usr/bin/env node

/**
 * Inject Context From File Hook
 *
 * Event: SessionStart (runs after Context Agent)
 * Purpose: Reads Context Agent output and injects as additionalContext
 *
 * This hook runs AFTER the Context Agent has written to .claude/current-context.json
 * It reads that file and outputs the content for Claude to see.
 */

const fs = require('fs');
const path = require('path');

const CONTEXT_FILE = '.claude/current-context.json';

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
  const contextPath = path.join(process.cwd(), CONTEXT_FILE);

  // Check if context file exists
  if (!fs.existsSync(contextPath)) {
    // No context file - Context Agent may not have run or failed
    const output = {
      additionalContext: `[CONTEXT AGENT: No output found]
Context Agent did not produce output. This may mean:
- First run in this project (no project-definition.yaml)
- Context Agent hook not configured
- Context Agent encountered an error

Proceed with task-level evaluation only.`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Read and parse context file
  let context;
  try {
    const content = fs.readFileSync(contextPath, 'utf8');
    context = JSON.parse(content);
  } catch (e) {
    const output = {
      additionalContext: `[CONTEXT AGENT: Failed to parse output]
Context file exists but could not be parsed: ${e.message}`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Format context for injection
  const parts = [];

  parts.push('[PROJECT CONTEXT - From Context Agent]');
  parts.push('');
  parts.push(`PROJECT: ${context.project || 'Unknown'}`);
  parts.push(`PHASE: ${context.phase?.toUpperCase() || 'Unknown'}`);
  parts.push(`CONFIDENCE: ${context.phase_confidence || 'Unknown'} - ${context.phase_rationale || ''}`);
  parts.push('');

  // Success criteria
  if (context.success_criteria) {
    parts.push('SUCCESS CRITERIA:');
    parts.push(`- North Star: ${context.success_criteria.north_star || 'undefined'}`);
    parts.push(`- Progress: ${context.success_criteria.progress || 'unknown'}`);
    if (context.success_criteria.blockers?.length > 0) {
      parts.push(`- Blockers: ${context.success_criteria.blockers.join(', ')}`);
    }
    parts.push('');
  }

  // Recent accomplishments
  if (context.recent_accomplishments?.length > 0) {
    parts.push('RECENT ACCOMPLISHMENTS:');
    context.recent_accomplishments.forEach(a => parts.push(`- ${a}`));
    parts.push('');
  }

  // Current focus
  if (context.current_focus) {
    parts.push(`CURRENT FOCUS: ${context.current_focus}`);
    parts.push('');
  }

  // Gaps
  if (context.gaps?.length > 0) {
    parts.push('GAPS IDENTIFIED:');
    context.gaps.forEach(g => {
      const severity = g.severity ? `[${g.severity}]` : '';
      parts.push(`- ${severity} ${g.type || g.description}: ${g.action || ''}`);
    });
    parts.push('');
  }

  // GitHub state
  if (context.github_state) {
    parts.push('GITHUB STATE:');
    parts.push(`- Open issues: ${context.github_state.open_issues || 0}`);
    parts.push(`- Milestone progress: ${context.github_state.milestone_progress || 0}%`);
    parts.push(`- Open PRs: ${context.github_state.open_prs || 0}`);
    parts.push('');
  } else if (context.github_note) {
    parts.push(`GITHUB: ${context.github_note}`);
    parts.push('');
  }

  // Lens
  if (context.lens) {
    parts.push(`PRIMARY LENS: ${context.lens.primary || 'Not set'}`);
    if (context.lens.supporting?.length > 0) {
      parts.push(`SUPPORTING LENSES: ${context.lens.supporting.join(', ')}`);
    }
    parts.push('');
  }

  // Context for Task Agent
  if (context.context_for_task_agent) {
    parts.push('CONTEXT FOR THIS SESSION:');
    parts.push(context.context_for_task_agent);
  }

  const output = {
    additionalContext: parts.join('\n')
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}
