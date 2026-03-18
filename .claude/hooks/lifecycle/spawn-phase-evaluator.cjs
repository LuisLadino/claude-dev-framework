#!/usr/bin/env node

/**
 * Spawn Phase Evaluator Hook
 *
 * Event: PostToolUse (Bash)
 * Purpose: After a git commit, tells Claude to spawn the phase-evaluator agent
 *
 * Same pattern as spawn-context-agent.cjs — inject an instruction,
 * Claude spawns the agent using the Agent tool.
 */

const { execSync } = require('child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  let hookInput;
  try {
    hookInput = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  // Only trigger on git commit
  const command = hookInput.tool_input?.command || '';
  if (!command.includes('git commit')) {
    process.exit(0);
  }

  // Get commit info for the prompt
  let commitMsg = '';
  let filesChanged = '';
  try {
    commitMsg = execSync('git log -1 --pretty=format:"%s"', {
      encoding: 'utf8',
      timeout: 5000
    }).trim();
    filesChanged = execSync('git diff-tree --no-commit-id --name-status -r HEAD', {
      encoding: 'utf8',
      timeout: 5000
    }).trim();
  } catch (e) {}

  console.log(`IMPORTANT: A commit was just made. Spawn the phase evaluator agent in the background.

<commentary>
A git commit just happened: "${commitMsg}"
Files changed: ${filesChanged}
The phase-evaluator agent evaluates project health after commits. Spawn it in the background so the user is not blocked.
</commentary>

Use the Agent tool with these exact parameters:
- description: "Evaluate commit impact"
- subagent_type: "phase-evaluator"
- model: "haiku"
- prompt: "A commit was just made: '${commitMsg.replace(/'/g, "\\'")}'. Files changed: ${filesChanged.replace(/\n/g, ', ')}. Evaluate the project state, check if phase transitions are needed, and surface any observations."
- run_in_background: true

Do NOT skip this. Do NOT wait for the user to ask for it.`);
  process.exit(0);
});
