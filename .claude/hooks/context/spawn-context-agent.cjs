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
  const output = {
    additionalContext: `[CONTEXT AGENT] Spawn context-agent via Task tool to evaluate project state and design thinking phase. Use model haiku for speed.`
  };
  console.log(JSON.stringify(output));
  process.exit(0);
});
