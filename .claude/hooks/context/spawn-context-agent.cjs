#!/usr/bin/env node

/**
 * Spawn Context Agent Hook
 *
 * Event: SessionStart
 * Purpose: Spawns Context Agent via `claude -p` to evaluate project state and design thinking phase
 *
 * This hook:
 * 1. Reads Context Agent instructions from .claude/agents/context-agent.md
 * 2. Spawns `claude -p` with those instructions
 * 3. Parses the JSON response
 * 4. Outputs as additionalContext for the main session
 *
 * The Context Agent has access to tools (Read, Bash, Grep, Glob) and can:
 * - Read project-definition.yaml
 * - Check GitHub state via gh commands
 * - Load session state
 * - Evaluate design thinking phase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const AGENT_INSTRUCTIONS_PATH = '.claude/agents/context-agent.md';
const TIMEOUT_MS = 60000; // 60 seconds
const MODEL = 'haiku'; // Fast model for context gathering

// Read stdin (hook input)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    runContextAgent();
  } catch (e) {
    // On error, output minimal context and continue
    const output = {
      additionalContext: `[CONTEXT AGENT: Error] ${e.message}\nProceeding without project context evaluation.`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
});

function runContextAgent() {
  const cwd = process.cwd();
  const agentPath = path.join(cwd, AGENT_INSTRUCTIONS_PATH);

  // Check if agent instructions exist
  if (!fs.existsSync(agentPath)) {
    const output = {
      additionalContext: `[CONTEXT AGENT: Not configured]\nNo agent instructions at ${AGENT_INSTRUCTIONS_PATH}.\nContext evaluation skipped.`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Read agent instructions (skip frontmatter)
  const agentContent = fs.readFileSync(agentPath, 'utf8');
  const instructionsMatch = agentContent.match(/---[\s\S]*?---\n([\s\S]*)/);
  const instructions = instructionsMatch ? instructionsMatch[1].trim() : agentContent;

  // Build the prompt for claude -p
  // The agent should return JSON with project context
  // NOTE: We run from /tmp to avoid deadlock with parent Claude session
  const prompt = `You are the Context Agent. Execute these instructions and return ONLY valid JSON (no markdown code fences, no explanation).

WORKSPACE: ${cwd}
(Use absolute paths based on WORKSPACE - we run from /tmp to avoid session conflicts)

${instructions}

IMPORTANT:
- Execute all steps (read files, run gh commands, evaluate phase)
- Use absolute paths: ${cwd}/.claude/specs/project-definition.yaml, etc.
- Return the final JSON object directly (no \`\`\`json wrapper)
- If you cannot complete a step, include an error in the output
- Be fast - this runs at session start`;

  // Spawn claude -p
  const start = Date.now();
  let result;

  try {
    // Run from /tmp to avoid deadlock with parent Claude session
    // (claude -p hangs when run from same directory as parent)
    result = execSync(
      `claude -p --model ${MODEL} --output-format json`,
      {
        input: prompt,
        encoding: 'utf8',
        timeout: TIMEOUT_MS,
        maxBuffer: 5 * 1024 * 1024, // 5MB buffer
        cwd: '/tmp',
        env: { ...process.env }
      }
    );
  } catch (err) {
    // Handle spawn errors
    const output = {
      additionalContext: `[CONTEXT AGENT: Spawn failed] ${err.message}\nProceeding without context evaluation.`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  const elapsed = Date.now() - start;

  // Parse the claude -p output
  let claudeOutput;
  try {
    claudeOutput = JSON.parse(result);
  } catch (e) {
    const output = {
      additionalContext: `[CONTEXT AGENT: Parse error] Could not parse claude output\nRaw: ${result.substring(0, 500)}`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Extract the actual result (it's in claudeOutput.result, possibly with markdown fence)
  let contextJson;
  try {
    let resultText = claudeOutput.result || '';

    // Strip markdown code fence if present
    const jsonMatch = resultText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      resultText = jsonMatch[1];
    }

    contextJson = JSON.parse(resultText.trim());
  } catch (e) {
    // If we can't parse as JSON, use the raw result as context
    const output = {
      additionalContext: `[CONTEXT AGENT: Completed in ${elapsed}ms]\n${claudeOutput.result || 'No result'}`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // Format context for injection
  const contextParts = [];
  contextParts.push(`[PROJECT CONTEXT - From Context Agent (${elapsed}ms)]`);
  contextParts.push('');

  // Project and phase
  if (contextJson.project) {
    contextParts.push(`PROJECT: ${contextJson.project}`);
  }
  if (contextJson.phase) {
    contextParts.push(`PHASE: ${contextJson.phase.toUpperCase()}`);
    if (contextJson.phase_confidence) {
      contextParts.push(`CONFIDENCE: ${contextJson.phase_confidence} - ${contextJson.phase_rationale || ''}`);
    }
  }
  contextParts.push('');

  // Success criteria
  if (contextJson.success_criteria) {
    contextParts.push('SUCCESS CRITERIA:');
    if (contextJson.success_criteria.north_star) {
      contextParts.push(`- North Star: ${contextJson.success_criteria.north_star}`);
    }
    if (contextJson.success_criteria.progress) {
      contextParts.push(`- Progress: ${contextJson.success_criteria.progress}`);
    }
    if (contextJson.success_criteria.blockers?.length > 0) {
      contextParts.push(`- Blockers: ${contextJson.success_criteria.blockers.join(', ')}`);
    }
    contextParts.push('');
  }

  // Recent accomplishments
  if (contextJson.recent_accomplishments?.length > 0) {
    contextParts.push('RECENT ACCOMPLISHMENTS:');
    contextJson.recent_accomplishments.forEach(a => contextParts.push(`- ${a}`));
    contextParts.push('');
  }

  // Current focus
  if (contextJson.current_focus) {
    contextParts.push(`CURRENT FOCUS: ${contextJson.current_focus}`);
    contextParts.push('');
  }

  // Gaps
  if (contextJson.gaps?.length > 0) {
    contextParts.push('GAPS IDENTIFIED:');
    contextJson.gaps.forEach(g => {
      const severity = g.severity ? `[${g.severity}]` : '';
      contextParts.push(`- ${severity} ${g.type}: ${g.action || g.description || ''}`);
    });
    contextParts.push('');
  }

  // GitHub state
  if (contextJson.github_state) {
    contextParts.push('GITHUB STATE:');
    contextParts.push(`- Open issues: ${contextJson.github_state.open_issues || 0}`);
    contextParts.push(`- Milestone progress: ${contextJson.github_state.milestone_progress || 0}%`);
    contextParts.push(`- Open PRs: ${contextJson.github_state.open_prs || 0}`);
    contextParts.push('');
  } else if (contextJson.github_note) {
    contextParts.push(`GITHUB: ${contextJson.github_note}`);
    contextParts.push('');
  }

  // Lens
  if (contextJson.lens) {
    contextParts.push(`PRIMARY LENS: ${contextJson.lens.primary || 'Not set'}`);
    if (contextJson.lens.supporting?.length > 0) {
      contextParts.push(`SUPPORTING LENSES: ${contextJson.lens.supporting.join(', ')}`);
    }
    contextParts.push('');
  }

  // Task state (design thinking phases)
  if (contextJson.task_state) {
    contextParts.push('DESIGN THINKING TASKS:');
    if (contextJson.task_state.current_task) {
      contextParts.push(`- Current: ${contextJson.task_state.current_task}`);
    }
    if (contextJson.task_state.completed_tasks?.length > 0) {
      contextParts.push(`- Completed: ${contextJson.task_state.completed_tasks.join(', ')}`);
    }
    if (contextJson.task_state.next_task) {
      contextParts.push(`- Next: ${contextJson.task_state.next_task}`);
    }
    if (!contextJson.task_state.design_thinking_tasks_exist) {
      contextParts.push('- No design thinking tasks exist for current work');
    }
    contextParts.push('');
  }

  // Context for Task Agent (or main session)
  if (contextJson.context_for_task_agent) {
    contextParts.push('CONTEXT FOR THIS SESSION:');
    contextParts.push(contextJson.context_for_task_agent);
  }

  const output = {
    additionalContext: contextParts.join('\n')
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}
