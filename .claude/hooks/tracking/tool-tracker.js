#!/usr/bin/env node

/**
 * Universal Tool Tracker
 *
 * Event: PostToolUse (all tools)
 * Purpose: Track ALL tool calls for system observability
 *
 * Captures:
 * - Skill invocations (slash commands)
 * - MCP tool calls (context7, ag_*)
 * - File operations (Read, Edit, Write, Glob, Grep)
 * - Everything else
 *
 * Why: Verify the system is actually working, not just assume it is.
 */

const fs = require('fs');
const path = require('path');

const {
  findWorkspaceBrain,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.js');

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    // Log errors to a debug file so we know if tracking itself is broken
    logError('tool-tracker', e.message);
    process.exit(0);
  }
});

function logError(hook, message) {
  const debugPath = path.join(process.env.HOME, '.gemini/antigravity/brain/hook-errors.log');
  const entry = `[${new Date().toISOString()}] ${hook}: ${message}\n`;
  try {
    fs.appendFileSync(debugPath, entry);
  } catch (e) {}
}

function handleHook(data) {
  const { tool_name, tool_input, tool_response, session_id } = data;

  if (!tool_name) {
    process.exit(0);
  }

  const cwd = process.cwd();

  // Find brain folder and session
  const brainPath = findWorkspaceBrain(cwd);
  const sessionId = getSessionId(brainPath, session_id);

  // Load current session tracking
  const tracking = loadSessionTracking(brainPath, sessionId);

  // Initialize tools array if needed
  if (!tracking.tools) {
    tracking.tools = [];
  }

  // Build tool entry with relevant details
  const entry = {
    timestamp: new Date().toISOString(),
    tool: tool_name,
    success: true, // PostToolUse only fires on success
  };

  // Extract relevant input based on tool type
  switch (tool_name) {
    case 'Skill':
      entry.skill = tool_input?.skill;
      entry.args = tool_input?.args;
      break;

    case 'Read':
      entry.file = relativePath(cwd, tool_input?.file_path);
      break;

    case 'Edit':
    case 'Write':
      entry.file = relativePath(cwd, tool_input?.file_path);
      // Don't log content, just that it happened
      break;

    case 'Glob':
      entry.pattern = tool_input?.pattern;
      entry.matchCount = countMatches(tool_response);
      break;

    case 'Grep':
      entry.pattern = tool_input?.pattern;
      entry.path = tool_input?.path;
      entry.matchCount = countMatches(tool_response);
      break;

    case 'Bash':
      // Already tracked by command-log.js, but include here for completeness
      entry.command = truncate(tool_input?.command, 100);
      break;

    case 'Task':
      entry.subagent = tool_input?.subagent_type;
      entry.description = tool_input?.description;
      break;

    case 'WebSearch':
      entry.query = tool_input?.query;
      break;

    case 'WebFetch':
      entry.url = tool_input?.url;
      break;

    case 'AskUserQuestion':
      entry.questionCount = tool_input?.questions?.length;
      break;

    default:
      // MCP tools and others
      if (tool_name.startsWith('mcp__')) {
        entry.category = 'mcp';
        // Extract MCP server and function
        const parts = tool_name.split('__');
        entry.server = parts[1];
        entry.function = parts[2];
        // Include query if present
        if (tool_input?.query) {
          entry.query = truncate(tool_input.query, 100);
        }
        if (tool_input?.libraryId) {
          entry.libraryId = tool_input.libraryId;
        }
      } else {
        // Unknown tool, log input keys
        entry.inputKeys = tool_input ? Object.keys(tool_input) : [];
      }
  }

  tracking.tools.push(entry);

  // Save updated tracking
  saveSessionTracking(brainPath, sessionId, tracking);

  process.exit(0);
}

function relativePath(cwd, filePath) {
  if (!filePath) return null;
  if (filePath.startsWith(cwd)) {
    return path.relative(cwd, filePath);
  }
  // For paths outside cwd, show abbreviated
  if (filePath.startsWith(process.env.HOME)) {
    return '~' + filePath.slice(process.env.HOME.length);
  }
  return filePath;
}

function truncate(str, maxLen) {
  if (!str) return null;
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

function countMatches(response) {
  // Try to count matches from tool response
  if (!response) return null;
  if (typeof response === 'string') {
    const lines = response.split('\n').filter(l => l.trim());
    return lines.length;
  }
  if (Array.isArray(response)) {
    return response.length;
  }
  return null;
}
