#!/usr/bin/env node

/**
 * Enforce Specs Hook
 *
 * Event: PreToolUse (Edit|Write)
 * Purpose: DENY file edits until the relevant spec has been read
 *
 * Reads patterns from stack-config.yaml (single source of truth).
 * Each spec in stack-config has applies_to patterns.
 * If the file being edited matches a pattern, that spec must be read first.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const STACK_CONFIG_PATH = '.claude/specs/stack-config.yaml';
const SESSION_STATE_FILE = '.claude/session-state.json';

// Files/paths to skip enforcement entirely
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    process.exit(0); // Allow on error
  }
});

function handleHook(data) {
  const { tool_input } = data;
  const filePath = tool_input?.file_path;

  if (!filePath) {
    process.exit(0); // Allow
  }

  // Check if should skip entirely
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(filePath)) {
      process.exit(0); // Allow
    }
  }

  // Load stack-config.yaml for spec mappings
  const mappings = loadSpecMappings();
  if (!mappings || mappings.length === 0) {
    process.exit(0); // No mappings, allow
  }

  // Find which spec applies to this file
  const match = findMatchingSpec(filePath, mappings);

  if (!match) {
    process.exit(0); // No spec requirement for this file type
  }

  // Check if the required spec was read (pendingEdit matches this spec name)
  const sessionState = loadSessionState();

  // Check if ANY of the required specs were read
  const requiredSpecs = [match.name, ...(match.related || [])];
  const readSpecs = sessionState.pendingEdit || [];
  const pendingEditArray = Array.isArray(readSpecs) ? readSpecs : [readSpecs];

  // Check if we have all required specs
  const hasRequired = requiredSpecs.some(req => pendingEditArray.includes(req));

  if (hasRequired) {
    process.exit(0); // Spec was read, allow
  }

  // Spec not read - DENY and instruct
  const specPath = `.claude/specs/${match.file}`;
  const relatedNote = match.related?.length
    ? `\nRelated specs to also read: ${match.related.join(', ')}`
    : '';

  console.error(`[BLOCKED] Read the spec before editing.

You're about to edit: ${path.basename(filePath)}
Required spec: ${specPath}${relatedNote}

**Read the spec first, then retry this edit.**

This ensures you have the current guidelines fresh in context.`);

  process.exit(2); // DENY
}

function loadStackConfig() {
  try {
    const content = fs.readFileSync(STACK_CONFIG_PATH, 'utf8');
    return yaml.parse(content);
  } catch {
    return null;
  }
}

function loadSpecMappings() {
  const config = loadStackConfig();
  if (!config?.specs) return [];

  const mappings = [];

  // Flatten all spec categories into a single list with their patterns
  for (const category of Object.keys(config.specs)) {
    const specs = config.specs[category];
    if (!Array.isArray(specs)) continue;

    for (const spec of specs) {
      if (spec.applies_to && spec.applies_to.length > 0) {
        mappings.push({
          name: spec.name,
          file: spec.file,
          patterns: spec.applies_to,
          related: spec.related || []
        });
      }
    }
  }

  return mappings;
}

function findMatchingSpec(filePath, mappings) {
  // Normalize the file path for matching
  const normalizedPath = filePath.replace(/^\//, '');

  for (const mapping of mappings) {
    for (const pattern of mapping.patterns) {
      if (matchGlob(normalizedPath, pattern)) {
        return mapping;
      }
    }
  }

  return null;
}

function matchGlob(filePath, pattern) {
  // Convert glob pattern to regex
  // Handle: ** (any path), * (any segment), ? (single char)
  let regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars except * and ?
    .replace(/\*\*/g, '{{DOUBLESTAR}}')    // Placeholder for **
    .replace(/\*/g, '[^/]*')               // * matches anything except /
    .replace(/\?/g, '.')                   // ? matches single char
    .replace(/{{DOUBLESTAR}}/g, '.*');     // ** matches anything including /

  // Match against the file path (could be absolute or relative)
  const re = new RegExp(regex);
  return re.test(filePath) || re.test(filePath.replace(/^.*?\.claude/, '.claude'));
}

function loadSessionState() {
  try {
    const content = fs.readFileSync(SESSION_STATE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}
