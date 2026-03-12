#!/usr/bin/env node

/**
 * Block Dangerous Commands Hook
 *
 * Event: PreToolUse (Bash)
 * Purpose: Prevents execution of dangerous commands
 *
 * Blocks:
 * - rm -rf with broad paths
 * - Force pushes to main/master
 * - Database drops
 * - Credential exposure
 */

const DANGEROUS_PATTERNS = [
  // Destructive file operations
  {
    pattern: /rm\s+(-[rf]+\s+)*[\/~]\s*$/i,
    reason: 'Refusing to delete root or home directory'
  },
  {
    pattern: /rm\s+-rf?\s+\*|rm\s+-rf?\s+\.(?!\w)/i,
    reason: 'Refusing to delete all files or hidden files recursively'
  },

  // Dangerous git operations
  {
    pattern: /git\s+push\s+.*--force.*\s+(main|master)\b/i,
    reason: 'Refusing to force push to main/master branch'
  },
  {
    pattern: /git\s+push\s+-f\s+.*\s+(main|master)\b/i,
    reason: 'Refusing to force push to main/master branch'
  },
  {
    pattern: /git\s+reset\s+--hard\s+origin\/(main|master)/i,
    reason: 'Refusing to hard reset to remote main/master - this discards local changes'
  },
  {
    pattern: /git\s+clean\s+-fd/i,
    reason: 'Refusing git clean -fd - this removes untracked files permanently'
  },

  // Database operations
  {
    pattern: /drop\s+database/i,
    reason: 'Refusing to drop database'
  },
  {
    pattern: /drop\s+table\s+(?!if\s+exists)/i,
    reason: 'Refusing to drop table without IF EXISTS'
  },
  {
    pattern: /truncate\s+table/i,
    reason: 'Refusing to truncate table'
  },

  // Credential exposure
  {
    pattern: /cat\s+.*\.(env|pem|key|secret)/i,
    reason: 'Refusing to cat credential files - use secure methods'
  },
  {
    pattern: /echo\s+.*\$[A-Z_]*(KEY|SECRET|PASSWORD|TOKEN)/i,
    reason: 'Refusing to echo potential credentials'
  },

  // System damage
  {
    pattern: /:(){ :|:& };:/,
    reason: 'Refusing fork bomb'
  },
  {
    pattern: /mkfs\./i,
    reason: 'Refusing filesystem format command'
  },
  {
    pattern: /dd\s+if=.*of=\/dev\//i,
    reason: 'Refusing to write directly to device'
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

  // Check against dangerous patterns
  for (const { pattern, reason } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      // Output denial to stderr (shown to Claude)
      console.error(`[BLOCKED] ${reason}`);
      console.error(`Command: ${command}`);

      // Exit code 2 = deny the tool call
      process.exit(2);
    }
  }

  // Command is safe, allow it
  process.exit(0);
}
