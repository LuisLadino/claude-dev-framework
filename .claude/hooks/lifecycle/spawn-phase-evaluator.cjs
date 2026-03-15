#!/usr/bin/env node

/**
 * Spawn Phase Evaluator Hook
 *
 * Event: PostToolUse (Bash with git commit)
 * Purpose: Spawns Phase Evaluator via `claude -p` to evaluate project rhythm after commits
 *
 * This hook:
 * 1. Reads Phase Evaluator instructions from .claude/agents/phase-evaluator.md
 * 2. Includes recent commit info in the spawn command
 * 3. Spawns `claude -p` with those instructions
 * 4. Parses the JSON response
 * 5. Outputs observations for the main session to consider
 *
 * The Phase Evaluator:
 * - Observes (doesn't direct) design thinking rhythm
 * - Detects groan zone indicators
 * - Provides reflection prompts
 * - Says "I notice..." not "You should..."
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const AGENT_INSTRUCTIONS_PATH = '.claude/agents/phase-evaluator.md';
const PROJECT_DEFINITION_PATH = '.claude/specs/project-definition.yaml';
const TIMEOUT_MS = 60000; // 60 seconds
const MODEL = 'haiku'; // Fast model

// Read stdin (hook input)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    runPhaseEvaluator();
  } catch (e) {
    // On error, continue silently
    process.exit(0);
  }
});

function runPhaseEvaluator() {
  const cwd = process.cwd();
  const agentPath = path.join(cwd, AGENT_INSTRUCTIONS_PATH);

  // Parse hook input
  let hookInput;
  try {
    hookInput = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  // Verify this was a git commit
  const command = hookInput.tool_input?.command || '';
  if (!command.includes('git commit')) {
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

  // Get recent commit info
  let commitInfo = '';
  try {
    const lastCommit = execSync('git log -1 --pretty=format:"%s%n%n%b"', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();

    const filesChanged = execSync('git diff-tree --no-commit-id --name-status -r HEAD', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();

    commitInfo = `
RECENT COMMIT:
${lastCommit}

FILES CHANGED:
${filesChanged}
`;
  } catch (e) {
    commitInfo = '\n[Could not get commit info]\n';
  }

  // Check for project definition
  let projectPhase = '';
  const projectDefPath = path.join(cwd, PROJECT_DEFINITION_PATH);
  if (fs.existsSync(projectDefPath)) {
    try {
      const yamlContent = fs.readFileSync(projectDefPath, 'utf8');
      const phaseMatch = yamlContent.match(/current_phase:\s*(\w+)/);
      if (phaseMatch) {
        projectPhase = `\nCURRENT RECORDED PHASE: ${phaseMatch[1]}\n`;
      }
    } catch (e) {
      // Ignore
    }
  }

  // Build the prompt for claude -p
  const prompt = `You are the Phase Evaluator. A commit was just made. Evaluate the project rhythm.
${commitInfo}
${projectPhase}

INSTRUCTIONS:
${instructions}

IMPORTANT:
- Return ONLY valid JSON (no markdown code fences, no explanation)
- Focus on OBSERVATIONS, not directives
- Say "I notice..." not "You should..."
- Detect groan zone if multiple approaches discussed without selection
- Include 1-2 reflection prompts`;

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
  let evalJson;
  try {
    let resultText = claudeOutput.result || '';

    // Strip markdown code fence if present
    const jsonMatch = resultText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      resultText = jsonMatch[1];
    }

    evalJson = JSON.parse(resultText.trim());
  } catch (e) {
    process.exit(0);
  }

  // Format phase evaluation for output
  const evalParts = [];
  evalParts.push(`[PHASE EVALUATION - From Phase Evaluator (${elapsed}ms)]`);
  evalParts.push('');

  // Phase assessment
  if (evalJson.phase_assessment) {
    if (evalJson.phase_assessment.micro) {
      evalParts.push(`MICRO (this task): ${evalJson.phase_assessment.micro.phase} (${evalJson.phase_assessment.micro.confidence})`);
    }
    if (evalJson.phase_assessment.macro) {
      evalParts.push(`MACRO (project): ${evalJson.phase_assessment.macro.phase} (${evalJson.phase_assessment.macro.confidence})`);
    }
    evalParts.push('');
  }

  // Observations
  if (evalJson.observations?.length > 0) {
    evalParts.push('OBSERVATIONS:');
    evalJson.observations.forEach(o => evalParts.push(`- ${o}`));
    evalParts.push('');
  }

  // Rhythm
  if (evalJson.rhythm) {
    evalParts.push(`RHYTHM: ${evalJson.rhythm.mode} - ${evalJson.rhythm.pattern}`);
    if (evalJson.rhythm.groan_zone_detected) {
      evalParts.push('**GROAN ZONE DETECTED** - This discomfort between options is normal.');
    }
    evalParts.push('');
  }

  // Transition signals
  if (evalJson.transition_signals) {
    if (evalJson.transition_signals.ready_to_advance?.length > 0) {
      evalParts.push('READY TO ADVANCE:');
      evalJson.transition_signals.ready_to_advance.forEach(s => evalParts.push(`- ${s}`));
    }
    if (evalJson.transition_signals.reasons_to_stay?.length > 0) {
      evalParts.push('REASONS TO STAY:');
      evalJson.transition_signals.reasons_to_stay.forEach(s => evalParts.push(`- ${s}`));
    }
    if (evalJson.transition_signals.reasons_to_go_back?.length > 0) {
      evalParts.push('CONSIDER GOING BACK:');
      evalJson.transition_signals.reasons_to_go_back.forEach(s => evalParts.push(`- ${s}`));
    }
    evalParts.push('');
  }

  // Reflection prompts
  if (evalJson.reflection_prompts?.length > 0) {
    evalParts.push('REFLECTION PROMPTS:');
    evalJson.reflection_prompts.forEach(p => evalParts.push(`- ${p}`));
    evalParts.push('');
  }

  // Summary
  if (evalJson.observation_summary) {
    evalParts.push(`SUMMARY: ${evalJson.observation_summary}`);
  }

  // Output as stderr so it shows as a note, not blocking
  console.error(evalParts.join('\n'));
  process.exit(0);
}
