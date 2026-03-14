#!/usr/bin/env node

/**
 * Verify Before Stop Hook
 *
 * Event: Stop
 * Purpose: Ensures quality checks pass before Claude stops
 *
 * Checks:
 * 1. No console.log/debugger statements left behind
 * 2. If a slash command was invoked, confirm all steps were completed
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const BRAIN_DIR = path.join(HOME, '.gemini/antigravity/brain');
const TRACKING_DIR = path.join(BRAIN_DIR, 'tracking/sessions');

function getRecentSessionTracking() {
  try {
    if (!fs.existsSync(TRACKING_DIR)) return null;

    const files = fs.readdirSync(TRACKING_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(TRACKING_DIR, f),
        mtime: fs.statSync(path.join(TRACKING_DIR, f)).mtime.getTime()
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) return null;

    // Get most recent session (within last hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recent = files.find(f => f.mtime > oneHourAgo);
    if (!recent) return null;

    return JSON.parse(fs.readFileSync(recent.path, 'utf8'));
  } catch {
    return null;
  }
}

function getInvokedCommands(tracking) {
  if (!tracking || !tracking.toolCalls) return [];

  const commands = tracking.toolCalls
    .filter(t => t.tool === 'Skill' && t.skill)
    .map(t => '/' + t.skill);

  // Dedupe
  return [...new Set(commands)];
}

function checkForDebugStatements(filePath) {
  const debugPatterns = [
    /console\.log\(/,
    /console\.debug\(/,
    /debugger;/,
    /TODO:\s*REMOVE/i,
    /FIXME:\s*REMOVE/i,
    /XXX:/
  ];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const issues = [];
    lines.forEach((line, index) => {
      for (const pattern of debugPatterns) {
        if (pattern.test(line)) {
          issues.push({
            line: index + 1,
            content: line.trim(),
            pattern: pattern.toString()
          });
        }
      }
    });

    return issues;
  } catch {
    return [];
  }
}

function loadSessionChanges() {
  try {
    const content = fs.readFileSync('.claude/session-changes.json', 'utf8');
    return JSON.parse(content);
  } catch {
    return { filesModified: [], filesCreated: [] };
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
  const { stop_hook_active } = data;

  // Safety: prevent infinite loops
  if (stop_hook_active) {
    process.exit(0);
  }

  const issues = [];

  // Check 1: Debug statements in modified files
  const changes = loadSessionChanges();
  const allFiles = [...(changes.filesModified || []), ...(changes.filesCreated || [])];

  for (const file of allFiles) {
    if (!fs.existsSync(file)) continue;
    if (!file.match(/\.(js|jsx|ts|tsx|mjs|cjs)$/)) continue;

    const debugIssues = checkForDebugStatements(file);
    if (debugIssues.length > 0) {
      issues.push({
        type: 'debug_statements',
        file,
        details: debugIssues
      });
    }
  }

  // Check 2: Command completion
  const tracking = getRecentSessionTracking();
  const commands = getInvokedCommands(tracking);

  if (commands.length > 0) {
    issues.push({
      type: 'command_completion',
      commands
    });
  }

  // If issues found, block stopping
  if (issues.length > 0) {
    const parts = [];

    // Debug statements
    const debugIssues = issues.filter(i => i.type === 'debug_statements');
    if (debugIssues.length > 0) {
      parts.push('DEBUG STATEMENTS FOUND:');
      for (const issue of debugIssues) {
        const details = issue.details.map(d => `  Line ${d.line}: ${d.content}`).join('\n');
        parts.push(`${issue.file}:\n${details}`);
      }
      parts.push('');
    }

    // Command completion
    const cmdIssue = issues.find(i => i.type === 'command_completion');
    if (cmdIssue) {
      parts.push('COMMAND COMPLETION CHECK:');
      parts.push(`You invoked: ${cmdIssue.commands.join(', ')}`);
      parts.push('');
      parts.push('Before stopping, confirm:');
      parts.push('- Did you complete ALL numbered steps in the command?');
      parts.push('- Did you skip any steps or stop early?');
      parts.push('- If the command has a summary/verification step at the end, did you do it?');
      parts.push('');
      parts.push('If you completed everything, proceed. If not, go back and finish.');
    }

    const output = {
      decision: 'block',
      reason: parts.join('\n')
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // All good, allow stop
  process.exit(0);
}
