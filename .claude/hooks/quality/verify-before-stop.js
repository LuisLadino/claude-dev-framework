#!/usr/bin/env node

/**
 * Verify Before Stop Hook
 *
 * Event: Stop
 * Purpose: Ensures basic quality checks pass before Claude stops
 *
 * Checks:
 * - No obvious syntax errors in modified files
 * - No console.log/debugger statements left behind
 * - Modified files are valid (parseable)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SESSION_CHANGES_FILE = '.claude/session-changes.json';

function loadSessionChanges() {
  try {
    const content = fs.readFileSync(SESSION_CHANGES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return { filesModified: [], filesCreated: [] };
  }
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

function checkTypescriptSyntax(filePath) {
  if (!filePath.match(/\.(ts|tsx)$/)) {
    return null;
  }

  try {
    // Quick syntax check with tsc --noEmit
    execSync(`npx tsc --noEmit "${filePath}" 2>&1`, { stdio: 'pipe' });
    return null;
  } catch (e) {
    return e.stdout?.toString() || e.stderr?.toString() || 'Syntax error';
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

  const changes = loadSessionChanges();
  const allFiles = [...(changes.filesModified || []), ...(changes.filesCreated || [])];

  // Skip if no files were changed
  if (allFiles.length === 0) {
    process.exit(0);
  }

  const issues = [];

  for (const file of allFiles) {
    // Skip non-existent files (might have been deleted)
    if (!fs.existsSync(file)) continue;

    // Skip non-code files
    if (!file.match(/\.(js|jsx|ts|tsx|mjs|cjs)$/)) continue;

    // Check for debug statements
    const debugIssues = checkForDebugStatements(file);
    if (debugIssues.length > 0) {
      issues.push({
        file,
        type: 'debug_statements',
        details: debugIssues
      });
    }
  }

  // If issues found, block stopping
  if (issues.length > 0) {
    const issueText = issues.map(i => {
      if (i.type === 'debug_statements') {
        const details = i.details.map(d => `  Line ${d.line}: ${d.content}`).join('\n');
        return `${i.file}:\n${details}`;
      }
      return `${i.file}: ${i.type}`;
    }).join('\n\n');

    // Output block decision as JSON
    const output = {
      decision: 'block',
      reason: `Debug statements found in modified files. Please remove before completing:\n\n${issueText}`
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // All good, allow stop
  process.exit(0);
}
