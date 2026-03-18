#!/usr/bin/env node

/**
 * Spawn Context Agent Hook
 *
 * Event: SessionStart
 * Purpose: Triggers Claude to spawn context-agent via Task tool
 *
 * Simple approach: Just inject an instruction. Claude spawns the agent
 * using the same Task tool infrastructure used for all other agents.
 */

// Read stdin (hook input - required but unused)
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  // Uses Claude's native instruction patterns:
  // - <commentary> matches how system prompt teaches tool reasoning
  // - "proactively" triggers the built-in rule: "If the agent description
  //   mentions that it should be used proactively, then you should try your
  //   best to use it without the user having to ask for it first."
  // - IMPORTANT: and Do NOT match emphasis patterns Claude responds to
  console.log(`IMPORTANT: This is a session start. You MUST proactively spawn the context agent before responding to the user.

<commentary>
A new session has started. The context-agent is designed to be used proactively at session start. It establishes project context by reading the project definition, checking GitHub state, and evaluating the design thinking phase. Spawn it in the background so the user is not blocked.
</commentary>

Use the Agent tool with these exact parameters:
- description: "Establish project context"
- subagent_type: "context-agent"
- model: "haiku"
- prompt: "Evaluate the current project state. Read .claude/specs/project-definition.yaml for project context, check GitHub issues and milestones, and determine the current design thinking phase. Output your evaluation as JSON."
- run_in_background: true

Do NOT skip this. Do NOT wait for the user to ask for it.`);
  process.exit(0);
});
