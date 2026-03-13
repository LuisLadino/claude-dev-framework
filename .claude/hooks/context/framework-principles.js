#!/usr/bin/env node

/**
 * Framework Principles Hook
 *
 * Event: PreToolUse (Edit|Write)
 * Purpose: Remind about principles when editing framework files
 *
 * Only fires in claude-dev-framework repo.
 */

const fs = require('fs');
const path = require('path');

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
  const cwd = process.cwd();

  // Only fire in claude-dev-framework
  if (!cwd.includes('claude-dev-framework')) {
    process.exit(0);
  }

  // Load principles from .claude/CLAUDE.md
  const claudeMdPath = path.join(cwd, '.claude/CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) {
    process.exit(0);
  }

  const content = fs.readFileSync(claudeMdPath, 'utf8');

  // Extract Prime Directives section
  const match = content.match(/## Prime Directives\n\n([\s\S]*?)(?=\n---)/);
  if (!match) {
    process.exit(0);
  }

  const principles = match[1].trim();

  console.log(`[FRAMEWORK EDIT] Remember:\n${principles}`);

  process.exit(0);
}
