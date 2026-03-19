#!/usr/bin/env node

/**
 * Enforce Skills Hook
 *
 * Event: PreToolUse (Bash)
 * Purpose: Block direct execution of commands that have skill workflows
 *
 * Problem: Skills trigger via LLM judgment, which undertriggers ~80% of the time.
 * Solution: Block the underlying action and force proper skill invocation.
 *
 * This is a "paved road" pattern - make the right thing easy and the wrong thing hard.
 * The skill handles pre-checks, documentation updates, and proper formatting.
 */

const SKILL_COMMANDS = [
  {
    // Matches: git commit anywhere in command (handles chained commands like "git add && git commit")
    // This is the entry point - blocking this ensures the commit skill is used,
    // which handles docs, push, and PR creation.
    pattern: /\bgit\s+commit\b/i,
    skill: 'commit',
    reason: 'Use the commit skill for proper workflow (version-control.md, CHANGELOG, push, PR)',
    instruction: 'Invoke: Skill(skill: "commit")'
  }
  // Note: gh pr create is NOT blocked because the commit skill runs it internally.
  // Blocking git commit is sufficient - it's the entry point to the workflow.
];

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

  // Allow commands with SKILL_ACTIVE marker (set by skills to bypass enforcement)
  if (command.includes('SKILL_ACTIVE=1')) {
    // Check if documentation was verified (DOCS_CHECKED marker)
    if (/\bgit\s+commit\b/i.test(command) && !command.includes('DOCS_CHECKED=1')) {
      console.error('[DOCUMENTATION CHECK REQUIRED] You are committing via the commit skill but skipped the documentation check.');
      console.error('');
      console.error('Go back to Step 3 of the commit skill:');
      console.error('1. Read CHANGELOG.md and README.md (if they exist)');
      console.error('2. Update what is stale');
      console.error('3. Output a DOCUMENTATION CHECK report');
      console.error('4. Then commit with: SKILL_ACTIVE=1 DOCS_CHECKED=1 git commit ...');
      process.exit(2);
    }
    process.exit(0);
  }

  // Check if this command should use a skill instead
  for (const { pattern, skill, reason, instruction } of SKILL_COMMANDS) {
    if (pattern.test(command.trim())) {
      // Output denial message
      console.error(`[WORKFLOW REQUIRED] ${reason}`);
      console.error(`Blocked command: ${command}`);
      console.error('');
      console.error(instruction);
      console.error('');
      console.error('The skill handles:');
      console.error('- Reading version-control.md for commit format');
      console.error('- Updating CHANGELOG and related docs');
      console.error('- Push to remote');
      console.error('- Create PR with proper format');

      // Exit code 2 = deny the tool call
      process.exit(2);
    }
  }

  // Command is allowed, let it through
  process.exit(0);
}
