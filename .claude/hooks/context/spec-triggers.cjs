#!/usr/bin/env node

/**
 * Spec Triggers Module
 *
 * Auto-loads spec files based on keywords in the prompt.
 */

const fs = require('fs');
const path = require('path');

const CONTEXT_TRIGGERS = [
  {
    patterns: [/style/i, /design/i, /color/i, /typography/i, /ui\b/i, /component/i, /tailwind/i],
    specFile: '.claude/specs/design/design-system.md',
    label: 'Design System'
  },
  {
    patterns: [/test/i, /spec\b/i, /jest/i, /vitest/i, /coverage/i],
    specFile: '.claude/specs/config/testing.md',
    label: 'Testing Specs'
  },
  {
    patterns: [/structure/i, /architecture/i, /folder/i, /directory/i, /where.*put/i, /organize/i],
    specFile: '.claude/specs/architecture/project-structure.md',
    label: 'Project Structure'
  },
  {
    patterns: [/commit/i, /git\b/i, /branch/i, /push/i, /merge/i],
    specFile: '.claude/specs/config/version-control.md',
    label: 'Version Control'
  },
  {
    patterns: [/deploy/i, /production/i, /build\b/i, /release/i],
    specFile: '.claude/specs/config/deployment.md',
    label: 'Deployment'
  },
  {
    patterns: [/what.*changed/i, /files.*modified/i, /this session/i, /what.*done/i],
    specFile: '.claude/session-changes.json',
    label: 'Session Changes',
    isJson: true
  }
];

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
  const contentParts = [];
  const specsLoaded = [];

  for (const trigger of CONTEXT_TRIGGERS) {
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
  CONTEXT_TRIGGERS,
  formatSessionChanges,
  readSpecFile,
  check
};
