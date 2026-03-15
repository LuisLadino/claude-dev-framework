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
    // Matches: git commit, git commit -m "...", etc.
    pattern: /^git\s+commit\b/i,
    skill: 'commit',
    reason: 'Use the commit skill for proper workflow (version-control.md, CHANGELOG, docs)',
    instruction: 'Invoke: Skill(skill: "commit")'
  },
  {
    // Matches: gh pr create, gh pr create --title "..."
    pattern: /^gh\s+pr\s+create\b/i,
    skill: 'pr',
    reason: 'Use the PR skill for proper workflow (summary generation, linking)',
    instruction: 'Invoke: Skill(skill: "pr")'
  }
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
      if (skill === 'commit') {
        console.error('- Reading version-control.md for commit format');
        console.error('- Updating CHANGELOG and related docs');
        console.error('- Asking continue/push after commit');
      } else if (skill === 'pr') {
        console.error('- Generating summary from all commits');
        console.error('- Creating branch and pushing if needed');
        console.error('- Proper PR body format');
      }

      // Exit code 2 = deny the tool call
      process.exit(2);
    }
  }

  // Command is allowed, let it through
  process.exit(0);
}
