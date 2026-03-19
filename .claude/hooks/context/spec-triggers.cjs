#!/usr/bin/env node

/**
 * Spec Triggers Module
 *
 * Auto-loads spec files based on keywords in the user's prompt.
 *
 * Dynamic — scans .claude/specs/ for files with a `triggers` field in
 * frontmatter. No hardcoded paths. Works in any project.
 *
 * Spec frontmatter example:
 *   ---
 *   name: design-system
 *   triggers: [style, design, color, typography, tailwind]
 *   ---
 *
 * Also handles session-changes.json for "what changed" queries.
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse YAML frontmatter from a markdown file (simple parser — no deps)
 * Returns { name, triggers } or null
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Parse name
  const nameMatch = yaml.match(/^name:\s*(.+)$/m);
  if (nameMatch) result.name = nameMatch[1].trim().replace(/^["']|["']$/g, '');

  // Parse triggers — supports both inline [a, b] and multi-line list
  const triggersInline = yaml.match(/^triggers:\s*\[([^\]]+)\]/m);
  const triggersBlock = yaml.match(/^triggers:\s*\n((?:\s+-\s+.+\n?)+)/m);

  if (triggersInline) {
    result.triggers = triggersInline[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
  } else if (triggersBlock) {
    result.triggers = triggersBlock[1]
      .split('\n')
      .map(line => line.replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }

  return result.triggers ? result : null;
}

/**
 * Recursively find all .md files in a directory
 */
function findMarkdownFiles(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findMarkdownFiles(fullPath));
      } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist — fine
  }
  return results;
}

/**
 * Build trigger list from spec frontmatter
 * Cached per process (hook runs once per prompt)
 */
function buildTriggers() {
  const specsDir = path.join(process.cwd(), '.claude/specs');
  const files = findMarkdownFiles(specsDir);
  const triggers = [];

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const meta = parseFrontmatter(content);
      if (meta && meta.triggers && meta.triggers.length > 0) {
        const relPath = path.relative(process.cwd(), filePath);
        triggers.push({
          patterns: meta.triggers.map(t => new RegExp(`\\b${t}\\b`, 'i')),
          specFile: relPath,
          label: meta.name || path.basename(filePath, '.md')
        });
      }
    } catch {
      // Skip unreadable files
    }
  }

  // Built-in: session changes (not a spec, but useful)
  triggers.push({
    patterns: [/what.*changed/i, /files.*modified/i, /this session/i, /what.*done/i],
    specFile: '.claude/session-changes.json',
    label: 'Session Changes',
    isJson: true
  });

  return triggers;
}

/**
 * Format session changes JSON for display
 */
function formatSessionChanges(data) {
  const parts = [];

  if (data.filesModified?.length > 0) {
    parts.push('**Files Modified:**');
    data.filesModified.forEach(f => parts.push(`- ${f}`));
  }

  if (data.filesCreated?.length > 0) {
    parts.push('\n**Files Created:**');
    data.filesCreated.forEach(f => parts.push(`- ${f}`));
  }

  if (data.commands?.length > 0) {
    parts.push('\n**Commands Run:**');
    data.commands.slice(-10).forEach(c => parts.push(`- ${c}`));
  }

  return parts.length > 0 ? parts.join('\n') : 'No changes tracked this session.';
}

/**
 * Read a spec file
 */
function readSpecFile(filePath, isJson = false) {
  const fullPath = path.join(process.cwd(), filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (isJson) {
      const data = JSON.parse(content);
      return formatSessionChanges(data);
    }
    return content;
  } catch {
    return null;
  }
}

/**
 * Check prompt for spec triggers
 * @param {string} prompt - User's prompt
 * @returns {{ content: string[]|null, specsLoaded: string[] }}
 */
function check(prompt) {
  const triggers = buildTriggers();
  const contentParts = [];
  const specsLoaded = [];

  for (const trigger of triggers) {
    const matches = trigger.patterns.some(pattern => pattern.test(prompt));

    if (matches) {
      const content = readSpecFile(trigger.specFile, trigger.isJson);
      if (content) {
        specsLoaded.push(trigger.label);
        contentParts.push(`[Auto-loaded: ${trigger.label}]\n${content}`);
      }
    }
  }

  return {
    content: contentParts.length > 0 ? contentParts : null,
    specsLoaded
  };
}

module.exports = {
  buildTriggers,
  parseFrontmatter,
  formatSessionChanges,
  readSpecFile,
  check
};
