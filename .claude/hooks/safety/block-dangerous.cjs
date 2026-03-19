#!/usr/bin/env node

/**
 * Block Dangerous Commands Hook
 *
 * Event: PreToolUse (Bash)
 * Purpose: Prevents execution of dangerous commands
 *
 * Reads patterns from config/security-patterns.json (dangerous_commands section).
 * Blocks destructive file ops, force pushes, database drops,
 * credential exposure, and system damage commands.
 */

const fs = require('fs');
const path = require('path');

function loadPatterns() {
  const configPath = path.join(__dirname, '..', 'config', 'security-patterns.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    return (config.dangerous_commands || []).map(entry => ({
      pattern: new RegExp(entry.pattern, entry.flags || ''),
      reason: entry.reason
    }));
  } catch (e) {
    // Config missing or invalid — fail open, don't break the session
    return [];
  }
}

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

  // Strip heredoc/body content to avoid false positives on embedded examples.
  // Matches: <<'EOF' ... EOF, <<"EOF" ... EOF, << EOF ... EOF
  const commandToCheck = stripHeredocs(command);

  const patterns = loadPatterns();

  for (const { pattern, reason } of patterns) {
    if (pattern.test(commandToCheck)) {
      console.error(`[BLOCKED] ${reason}`);
      console.error(`Command: ${command}`);
      process.exit(2);
    }
  }

  process.exit(0);
}

/**
 * Strip heredoc content from commands to avoid false positives.
 * Body text in gh issue create, git commit, etc. may contain
 * example dangerous commands that shouldn't trigger blocks.
 */
function stripHeredocs(cmd) {
  // Match heredoc: <<'DELIM' or <<"DELIM" or <<DELIM through closing DELIM
  return cmd.replace(/<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\1(?:\s*\).*)?$/gm, '<<HEREDOC_STRIPPED');
}
