#!/usr/bin/env node

/**
 * Sub-agent Context Injection Hook
 *
 * Event: PreToolUse (Agent)
 * Purpose: Injects lightweight project context into every spawned sub-agent
 *
 * Reads from (in priority order, uses whatever exists):
 * 1. stack-config.yaml — tech stack and spec list
 * 2. project-definition.yaml — project name, problem, scope
 * 3. Root CLAUDE.md — first 20 lines for project overview
 *
 * Prepends a ~200 token context block to the agent's prompt.
 * Never blocks (always exits 0). If no project files found, passes through silently.
 */

const fs = require('fs');
const path = require('path');

function findProjectRoot() {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --show-toplevel 2>/dev/null', { encoding: 'utf8' }).trim();
  } catch {
    return process.cwd();
  }
}

function readFileIfExists(filePath, maxLines) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (maxLines) {
      return content.split('\n').slice(0, maxLines).join('\n');
    }
    return content;
  } catch {
    return null;
  }
}

function extractFromStackConfig(content) {
  const lines = [];

  // Extract stack info
  const framework = content.match(/framework:\s*"?([^"\n]+)"?/);
  const language = content.match(/language:\s*"?([^"\n]+)"?/);
  const styling = content.match(/styling:\s*"?([^"\n]+)"?/);
  const testing = content.match(/testing:\s*"?([^"\n]+)"?/);
  const packageManager = content.match(/package_manager:\s*"?([^"\n]+)"?/);

  const stack = [framework, language, styling, testing, packageManager]
    .filter(m => m)
    .map(m => m[1].trim())
    .filter(v => v && v !== 'null');

  if (stack.length > 0) {
    lines.push(`Stack: ${stack.join(', ')}`);
  }

  // Extract spec names for awareness
  const specNames = [];
  const specMatches = content.matchAll(/name:\s*([^\n]+)/g);
  for (const match of specMatches) {
    const name = match[1].trim().replace(/"/g, '');
    if (name && name !== 'system-map') {
      specNames.push(name);
    }
  }
  if (specNames.length > 0) {
    lines.push(`Specs available: ${specNames.join(', ')}`);
  }

  return lines;
}

function extractFromProjectDefinition(content) {
  const lines = [];

  const name = content.match(/name:\s*"?([^"\n]+)"?/);
  const tagline = content.match(/tagline:\s*"?([^"\n]+)"?/);
  const statement = content.match(/statement:\s*"?([^"\n]+)"?/);

  if (name) lines.push(`Project: ${name[1].trim()}`);
  if (tagline) lines.push(`Purpose: ${tagline[1].trim()}`);
  if (statement) lines.push(`Problem: ${statement[1].trim()}`);

  return lines;
}

function buildContextBlock(projectRoot) {
  const contextLines = [];

  // 1. Root CLAUDE.md — the project's own description (always check first)
  const claudeMd = readFileIfExists(path.join(projectRoot, 'CLAUDE.md'), 20);
  if (claudeMd) {
    // Extract the title and first meaningful paragraph
    const lines = claudeMd.split('\n');
    const title = lines.find(l => l.startsWith('# '));
    if (title) {
      contextLines.push(`Project: ${title.replace('# ', '').trim()}`);
    }
    const meaningful = lines
      .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'))
      .slice(0, 3)
      .join(' ');
    if (meaningful.length > 10) {
      contextLines.push(`Overview: ${meaningful.slice(0, 250)}`);
    }
  }

  // 2. project-definition.yaml — structured project metadata (if available)
  const projDef = readFileIfExists(path.join(projectRoot, '.claude', 'specs', 'project-definition.yaml'));
  if (projDef) {
    contextLines.push(...extractFromProjectDefinition(projDef));
  }

  // 3. stack-config.yaml — tech stack and specs (most reliable after /sync-stack)
  const stackConfig = readFileIfExists(path.join(projectRoot, '.claude', 'specs', 'stack-config.yaml'));
  if (stackConfig) {
    contextLines.push(...extractFromStackConfig(stackConfig));
  }

  // 4. Kit awareness
  contextLines.push('Kit: claude-kit (specs enforced, design thinking phases, memory persistence)');

  return contextLines;
}

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch {
    process.exit(0);
  }
});

function handleHook(data) {
  const { tool_name, tool_input } = data;

  // Only intercept Agent tool calls
  if (tool_name !== 'Agent' || !tool_input?.prompt) {
    process.exit(0);
  }

  const projectRoot = findProjectRoot();
  const contextLines = buildContextBlock(projectRoot);

  // If we found nothing, pass through silently
  if (contextLines.length <= 1) {
    process.exit(0);
  }

  // Build the context block
  const contextBlock = [
    '## Project Context (auto-injected)',
    '',
    ...contextLines,
    '',
    '---',
    ''
  ].join('\n');

  // Prepend to the agent's prompt
  const modifiedInput = {
    ...tool_input,
    prompt: contextBlock + tool_input.prompt
  };

  // Output the modified tool input
  const output = JSON.stringify({ tool_input: modifiedInput });
  process.stdout.write(output);
  process.exit(0);
}
