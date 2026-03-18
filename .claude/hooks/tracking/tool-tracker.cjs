#!/usr/bin/env node

/**
 * Universal Tool Tracker
 *
 * Event: PostToolUse (all tools)
 * Purpose: Track ALL tool calls for system observability
 */

const fs = require('fs');
const path = require('path');

const {
  getSessionId,
  loadSessionTracking,
  saveSessionTracking,
  logError
} = require('../lib/session-utils.cjs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    logError('tool-tracker', e.message);
    process.exit(0);
  }
});

function handleHook(data) {
  const { tool_name, tool_input, tool_response, session_id } = data;

  if (!tool_name) {
    process.exit(0);
  }

  const cwd = process.cwd();
  const sessionId = getSessionId(session_id);
  const tracking = loadSessionTracking(sessionId);

  if (!tracking.tools) {
    tracking.tools = [];
  }

  const entry = {
    timestamp: new Date().toISOString(),
    tool: tool_name,
    success: true,
  };

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
      if (tool_name.startsWith('mcp__')) {
        entry.category = 'mcp';
        const parts = tool_name.split('__');
        entry.server = parts[1];
        entry.function = parts[2];
        if (tool_input?.query) {
          entry.query = truncate(tool_input.query, 100);
        }
        if (tool_input?.libraryId) {
          entry.libraryId = tool_input.libraryId;
        }
      } else {
        entry.inputKeys = tool_input ? Object.keys(tool_input) : [];
      }
  }

  tracking.tools.push(entry);
  tracking.lastActivity = new Date().toISOString();

  saveSessionTracking(sessionId, tracking);

  process.exit(0);
}

function relativePath(cwd, filePath) {
  if (!filePath) return null;
  if (filePath.startsWith(cwd)) {
    return path.relative(cwd, filePath);
  }
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
