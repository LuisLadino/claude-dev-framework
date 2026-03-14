#!/usr/bin/env node

/**
 * Pivot Detection Hook for Claude Code
 *
 * Detects when dependency or config changes happen and prompts for /sync-stack.
 *
 * Usage: Configure as PostToolUse hook for Bash commands
 *
 * Triggers on:
 * - npm install, yarn add, pnpm add, bun add
 * - Changes to package.json, tsconfig.json, tailwind.config.*, vite.config.*, etc.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    // Silent fail - don't break the workflow
    process.exit(0);
  }
});

function handleHook(data) {
  const { tool_input, tool_response, session_id, cwd } = data;

  // Only process Bash commands
  if (!tool_input?.command) {
    process.exit(0);
  }

  const command = tool_input.command;

  // Check for package install commands
  const installPatterns = [
    /npm\s+(install|i|add)/i,
    /yarn\s+(add|install)/i,
    /pnpm\s+(add|install|i)/i,
    /bun\s+(add|install|i)/i
  ];

  const isInstallCommand = installPatterns.some(pattern => pattern.test(command));

  if (isInstallCommand && tool_response?.exitCode === 0) {
    // Dependency was added - notify about potential wiring changes
    console.error('\n[PIVOT DETECTED] Dependencies changed.');
    console.error('Consider running /sync-stack to update wiring and specs.\n');
  }

  process.exit(0);
}
