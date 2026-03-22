#!/usr/bin/env node

/**
 * Enforce Specs Hook
 *
 * Event: PreToolUse (Edit|Write)
 * Purpose: DENY file edits until the relevant spec has been read
 *
 * Scans .claude/specs/ for spec files with frontmatter.
 * Each spec declares applies_to patterns in its frontmatter.
 * If the file being edited matches a pattern, that spec must be read first.
 *
 * No manual registration needed — create a spec with frontmatter,
 * it's automatically enforced.
 */

const fs = require('fs');
const path = require('path');

const SPECS_DIR = '.claude/specs';
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

  // Scan spec files for applies_to patterns
  const mappings = scanSpecFiles();
  if (!mappings || mappings.length === 0) {
    process.exit(0); // No specs with applies_to, allow
  }

  // Find which spec applies to this file
  const match = findMatchingSpec(filePath, mappings);

  if (!match) {
    process.exit(0); // No spec requirement for this file type
  }

  // Check if the required spec was read this prompt
  const sessionState = loadSessionState();
  const readSpecs = sessionState.pendingEdit || [];
  const pendingEditArray = Array.isArray(readSpecs) ? readSpecs : [readSpecs];

  // Check if we have the required spec (or any related specs)
  // Accept both frontmatter name and file basename — track-spec-reads may use either
  const basename = path.basename(match.specPath, path.extname(match.specPath));
  const requiredSpecs = [match.name, basename, ...(match.related || [])];
  const hasRequired = requiredSpecs.some(req => pendingEditArray.includes(req));

  if (hasRequired) {
    process.exit(0); // Spec was read, allow
  }

  // Spec not read - DENY and instruct
  const relatedNote = match.related?.length
    ? `\nRelated specs to also read: ${match.related.join(', ')}`
    : '';

  console.error(`[BLOCKED] Read the spec before editing.

You're about to edit: ${path.basename(filePath)}
Required spec: ${match.specPath}${relatedNote}

**Read the spec first, then retry this edit.**

This ensures you have the current guidelines fresh in context.`);

  process.exit(2); // DENY
}

/**
 * Scan .claude/specs/ recursively for files with frontmatter containing applies_to.
 * Returns array of { name, specPath, patterns, related }
 */
function scanSpecFiles() {
  const mappings = [];

  try {
    const specFiles = findSpecFiles(SPECS_DIR);

    for (const specFile of specFiles) {
      try {
        const frontmatter = readFrontmatter(specFile);
        if (frontmatter && frontmatter.applies_to && frontmatter.applies_to.length > 0) {
          mappings.push({
            name: frontmatter.name || path.basename(specFile, path.extname(specFile)),
            specPath: specFile,
            patterns: frontmatter.applies_to,
            related: frontmatter.related || []
          });
        }
      } catch {
        // Skip files with bad frontmatter — don't crash enforcement
      }
    }
  } catch {
    // If specs dir doesn't exist, no enforcement
  }

  return mappings;
}

/**
 * Recursively find .md and .yaml files in a directory
 */
function findSpecFiles(dir) {
  const files = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...findSpecFiles(fullPath));
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.yaml')) {
        // Skip README and stack-config (not specs)
        if (entry.name === 'README.md' || entry.name === 'stack-config.yaml') continue;
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist or isn't readable
  }

  return files;
}

/**
 * Read YAML frontmatter from a file (--- delimited block at top).
 * For .yaml files, read the comment-based metadata instead.
 */
function readFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  if (filePath.endsWith('.yaml')) {
    return readYamlMetadata(content);
  }

  // Parse markdown frontmatter (--- delimited)
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  return parseSimpleYaml(match[1]);
}

/**
 * Read metadata from YAML file comments.
 * Looks for comment lines like:  #   name: system-map
 */
function readYamlMetadata(content) {
  const lines = content.split('\n');
  const metadata = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match comment-based metadata: #   key: value
    const metaMatch = line.match(/^#\s+(name|description|applies_to|category|related):\s*(.*)/);
    if (!metaMatch) continue;

    const key = metaMatch[1];
    const value = metaMatch[2].trim();

    if (key === 'applies_to' || key === 'related') {
      // Collect as array from subsequent comment lines
      const arr = [];
      for (let j = i + 1; j < lines.length; j++) {
        const itemMatch = lines[j].match(/^#\s+-\s+"?([^"]*)"?/);
        if (itemMatch) {
          arr.push(itemMatch[1]);
        } else if (lines[j].match(/^#\s+\w+:/) || !lines[j].match(/^#/)) {
          break;
        }
      }
      metadata[key] = arr;
    } else {
      metadata[key] = value;
    }
  }

  return Object.keys(metadata).length > 0 ? metadata : null;
}

/**
 * Simple YAML parser for frontmatter.
 * Handles: name, description, applies_to, related, category
 * No external yaml package needed.
 */
function parseSimpleYaml(yamlStr) {
  const result = {};
  const lines = yamlStr.split('\n');

  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    // Key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value === '' || value === '>') {
        if (value === '') {
          currentArray = [];
          result[currentKey] = currentArray;
        } else {
          result[currentKey] = '';
        }
      } else {
        result[currentKey] = value;
        currentArray = null;
      }
      continue;
    }

    // Array item:   - "value" or   - value
    const arrayMatch = line.match(/^\s+-\s+"?([^"]*)"?/);
    if (arrayMatch && currentArray !== null) {
      currentArray.push(arrayMatch[1]);
      continue;
    }

    // Multi-line string continuation
    if (currentKey && typeof result[currentKey] === 'string' && line.match(/^\s+\S/)) {
      result[currentKey] = result[currentKey]
        ? result[currentKey] + ' ' + line.trim()
        : line.trim();
    }
  }

  // Convert related from string to array if needed
  if (result.related && typeof result.related === 'string') {
    result.related = result.related.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }

  return result;
}

function findMatchingSpec(filePath, mappings) {
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
  let regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '{{DOUBLESTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.')
    .replace(/{{DOUBLESTAR}}/g, '.*');

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
