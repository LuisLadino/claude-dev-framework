#!/usr/bin/env node

/**
 * Spawn Task Agent Hook
 *
 * Event: UserPromptSubmit
 * Purpose: Spawns Task Agent via `claude -p` to evaluate each prompt through design thinking
 *
 * This hook:
 * 1. Reads Task Agent instructions from .claude/agents/task-agent.md
 * 2. Includes the user's prompt in the spawn command
 * 3. Spawns `claude -p` with those instructions
 * 4. Parses the JSON response
 * 5. Outputs as additionalContext for the main session
 *
 * The Task Agent evaluates:
 * - Task type (coding, research, planning, etc.)
 * - Design cycle position (understand, define, ideate, prototype, test, iterate)
 * - Applicable lenses (PM, Engineering, UX, etc.)
 * - Teaching focus (concepts to explain)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const AGENT_INSTRUCTIONS_PATH = '.claude/agents/task-agent.md';
const CONTEXT_FILE_PATH = '.claude/current-context.json';
const TIMEOUT_MS = 45000; // 45 seconds (faster than Context Agent)
const MODEL = 'haiku'; // Fast model for per-prompt evaluation

// Read stdin (hook input includes user's prompt)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    runTaskAgent();
  } catch (e) {
    // On error, continue without task framing
    const output = {
      additionalContext: `[TASK AGENT: Error] ${e.message}\nProceeding without task framing.`
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
});

function runTaskAgent() {
  const cwd = process.cwd();
  const agentPath = path.join(cwd, AGENT_INSTRUCTIONS_PATH);

  // Parse hook input to get user's prompt
  let hookInput;
  try {
    hookInput = JSON.parse(input);
  } catch (e) {
    // No valid input, skip
    process.exit(0);
  }

  const userPrompt = hookInput.prompt || hookInput.user_prompt || '';

  // Skip for very short prompts (greetings, etc.)
  if (userPrompt.length < 10) {
    process.exit(0);
  }

  // Check if agent instructions exist
  if (!fs.existsSync(agentPath)) {
    process.exit(0);
  }

  // Read agent instructions (skip frontmatter)
  const agentContent = fs.readFileSync(agentPath, 'utf8');
  const instructionsMatch = agentContent.match(/---[\s\S]*?---\n([\s\S]*)/);
  const instructions = instructionsMatch ? instructionsMatch[1].trim() : agentContent;

  // Read context from Context Agent if available
  let projectContext = '';
  const contextPath = path.join(cwd, CONTEXT_FILE_PATH);
  if (fs.existsSync(contextPath)) {
    try {
      const contextData = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
      projectContext = `
PROJECT CONTEXT (from Context Agent):
- Project: ${contextData.project || 'Unknown'}
- Phase: ${contextData.phase || 'Unknown'}
- Focus: ${contextData.current_focus || 'Not specified'}
- Gaps: ${(contextData.gaps || []).map(g => g.type || g.description).join(', ') || 'None'}
`;
    } catch (e) {
      projectContext = '\n[No project context available]\n';
    }
  }

  // Build the prompt for claude -p
  const prompt = `You are the Task Agent. Evaluate the following user prompt through design thinking.

USER PROMPT:
"""
${userPrompt}
"""
${projectContext}

INSTRUCTIONS:
${instructions}

IMPORTANT:
- Return ONLY valid JSON (no markdown code fences, no explanation)
- Be fast - this runs on every user prompt
- For simple prompts (greetings, quick questions), return {"simple_task": true}
- Focus on the most applicable 1-2 teaching concepts`;

  // Spawn claude -p
  const start = Date.now();
  let result;

  try {
    result = execSync(
      `claude -p --model ${MODEL} --output-format json`,
      {
        input: prompt,
        encoding: 'utf8',
        timeout: TIMEOUT_MS,
        maxBuffer: 5 * 1024 * 1024,
        cwd: cwd,
        env: { ...process.env }
      }
    );
  } catch (err) {
    // Handle spawn errors - continue without framing
    process.exit(0);
  }

  const elapsed = Date.now() - start;

  // Parse the claude -p output
  let claudeOutput;
  try {
    claudeOutput = JSON.parse(result);
  } catch (e) {
    process.exit(0);
  }

  // Extract the actual result
  let taskJson;
  try {
    let resultText = claudeOutput.result || '';

    // Strip markdown code fence if present
    const jsonMatch = resultText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      resultText = jsonMatch[1];
    }

    taskJson = JSON.parse(resultText.trim());
  } catch (e) {
    // If we can't parse as JSON, skip
    process.exit(0);
  }

  // Skip output for simple tasks
  if (taskJson.simple_task) {
    process.exit(0);
  }

  // Format task framing for injection
  const framingParts = [];
  framingParts.push(`[TASK FRAMING - From Task Agent (${elapsed}ms)]`);
  framingParts.push('');

  // Task type and phase
  if (taskJson.task_type) {
    framingParts.push(`TASK TYPE: ${taskJson.task_type}`);
  }

  if (taskJson.design_cycle) {
    framingParts.push(`DESIGN PHASE: ${taskJson.design_cycle.phase}`);
    if (taskJson.design_cycle.status) {
      framingParts.push(`STATUS: ${taskJson.design_cycle.status}`);
    }
    if (taskJson.design_cycle.next_action) {
      framingParts.push(`NEXT ACTION: ${taskJson.design_cycle.next_action}`);
    }
    framingParts.push('');
  }

  // Research needed
  if (taskJson.research_needed?.length > 0) {
    framingParts.push('RESEARCH NEEDED:');
    taskJson.research_needed.forEach(r => {
      framingParts.push(`- ${r.type}: ${r.target} (${r.reason})`);
    });
    framingParts.push('');
  }

  // Lenses
  if (taskJson.lenses) {
    const primary = Array.isArray(taskJson.lenses.primary)
      ? taskJson.lenses.primary.join(', ')
      : taskJson.lenses.primary;
    framingParts.push(`LENSES: ${primary}`);
    if (taskJson.lenses.rationale) {
      framingParts.push(`RATIONALE: ${taskJson.lenses.rationale}`);
    }
    framingParts.push('');
  }

  // Teaching focus
  if (taskJson.teaching_focus?.length > 0) {
    framingParts.push('TEACHING FOCUS:');
    taskJson.teaching_focus.forEach(t => {
      framingParts.push(`- **${t.concept}** (${t.competency})`);
      if (t.mechanism) {
        framingParts.push(`  Mechanism: ${t.mechanism}`);
      }
      if (t.usage) {
        framingParts.push(`  Usage: ${t.usage}`);
      }
    });
    framingParts.push('');
  }

  // Recommended approach
  if (taskJson.recommended_approach) {
    framingParts.push(`APPROACH: ${taskJson.recommended_approach}`);
    framingParts.push('');
  }

  // Big picture connection
  if (taskJson.big_picture_connection) {
    framingParts.push(`BIG PICTURE: ${taskJson.big_picture_connection}`);
  }

  const output = {
    additionalContext: framingParts.join('\n')
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}
