#!/usr/bin/env node

/**
 * MCP Security Scan Hook
 *
 * Event: PreToolUse (mcp__*)
 * Purpose: Scans outbound MCP tool calls for secrets before they leave the machine
 *
 * Reads patterns from config/security-patterns.json (secret_patterns section).
 * Recursively scans all string values in tool_input.
 * Checks matches against whitelist to avoid false positives on placeholders.
 * DENY (exit 2) if a real secret is detected.
 */

const fs = require('fs');
const path = require('path');

function loadConfig() {
  const configPath = path.join(__dirname, '..', 'config', 'security-patterns.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { secret_patterns: [], sensitive_files: [], whitelist: [] };
  }
}

/**
 * Recursively extract all string values from an object.
 * This ensures we scan every field, not just known ones.
 * Fixes the CDK bug where only 3 specific fields were checked.
 */
function extractStrings(obj) {
  const strings = [];
  if (typeof obj === 'string') {
    strings.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      strings.push(...extractStrings(item));
    }
  } else if (obj && typeof obj === 'object') {
    for (const value of Object.values(obj)) {
      strings.push(...extractStrings(value));
    }
  }
  return strings;
}

/**
 * Check if a matched string is whitelisted (placeholder, not a real secret).
 * Unlike CDK, we check per-match, not per-content-block.
 */
function isWhitelisted(matchedText, whitelist) {
  const lower = matchedText.toLowerCase();
  return whitelist.some(placeholder =>
    lower.includes(placeholder.toLowerCase())
  );
}

/**
 * Check if any string references a sensitive filename.
 * Uses path-aware matching: checks that the match occurs at a path boundary
 * (start of string, after /, or after whitespace) and isn't followed by
 * safe extensions like .example, .sample, .template.
 */
function containsSensitiveFile(text, sensitiveFiles) {
  const lower = text.toLowerCase();
  for (const f of sensitiveFiles) {
    const fl = f.toLowerCase();
    let idx = lower.indexOf(fl);
    while (idx !== -1) {
      // Check preceding char is a path boundary.
      // For extension-style entries (starting with .), any preceding char is valid
      // since the dot itself is the boundary (e.g., "server.pem" matches ".pem").
      const before = idx === 0 ? '/' : lower[idx - 1];
      const isExtensionEntry = fl.startsWith('.');
      const isBoundary = isExtensionEntry || before === '/' || before === ' ' || before === '\t' || before === '\n' || before === '"' || before === "'";

      // Check following char isn't part of a safe extension
      const after = lower.substring(idx + fl.length);
      const isSafeExt = /^\.(example|sample|template|bak|md|txt)\b/.test(after);
      const isWordContinuation = /^\w/.test(after) && !after.startsWith('.');

      if (isBoundary && !isSafeExt && !isWordContinuation) {
        return f;
      }
      idx = lower.indexOf(fl, idx + 1);
    }
  }
  return null;
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
  const { tool_name, tool_input } = data;

  if (!tool_input) {
    process.exit(0);
  }

  const config = loadConfig();
  const patterns = (config.secret_patterns || []).map(entry => ({
    id: entry.id,
    pattern: new RegExp(entry.pattern, entry.flags || ''),
    reason: entry.reason
  }));
  const whitelist = config.whitelist || [];
  const sensitiveFiles = config.sensitive_files || [];

  // Extract all string values from the tool input
  const strings = extractStrings(tool_input);

  if (strings.length === 0) {
    process.exit(0);
  }

  const content = strings.join('\n');

  // Check for sensitive file references
  const sensitiveFile = containsSensitiveFile(content, sensitiveFiles);
  if (sensitiveFile) {
    console.error(`[BLOCKED] MCP call to ${tool_name} references sensitive file: ${sensitiveFile}`);
    console.error('Sensitive files should not be sent to external MCP servers.');
    process.exit(2);
  }

  // Check for secret patterns
  for (const { id, pattern, reason } of patterns) {
    const match = content.match(pattern);
    if (match) {
      const matchedText = match[0];

      // Check whitelist per-match (not per-content-block)
      if (isWhitelisted(matchedText, whitelist)) {
        continue;
      }

      console.error(`[BLOCKED] MCP call to ${tool_name} contains secret: ${reason}`);
      console.error(`Pattern: ${id}`);
      console.error('Secret data must not be sent to external MCP servers.');
      process.exit(2);
    }
  }

  // Clean, allow through
  process.exit(0);
}
