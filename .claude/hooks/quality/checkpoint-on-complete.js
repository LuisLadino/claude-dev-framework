#!/usr/bin/env node

/**
 * Checkpoint on Task Complete Hook
 *
 * Event: TaskCompleted
 * Purpose: Auto-saves session state when a task is marked complete
 *
 * Writes:
 * - Updates brain files with task completion
 * - Saves session changes summary
 * - Preserves context for next session
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_CHANGES_FILE = '.claude/session-changes.json';

function loadSessionChanges() {
  try {
    const content = fs.readFileSync(SESSION_CHANGES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return {
      sessionStart: new Date().toISOString(),
      filesModified: [],
      filesCreated: [],
      operations: [],
      commands: []
    };
  }
}

function getBrainPath() {
  // Try to get brain path from environment or default location
  const brainBase = path.join(os.homedir(), '.gemini', 'antigravity', 'brain');

  // Find most recent session folder
  try {
    const sessions = fs.readdirSync(brainBase)
      .filter(f => fs.statSync(path.join(brainBase, f)).isDirectory())
      .map(f => ({
        name: f,
        mtime: fs.statSync(path.join(brainBase, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (sessions.length > 0) {
      return path.join(brainBase, sessions[0].name);
    }
  } catch {
    // Fall back to no brain path
  }

  return null;
}

function saveTaskCheckpoint(taskData, sessionChanges) {
  const brainPath = getBrainPath();
  if (!brainPath) {
    return;
  }

  // Create checkpoint file
  const checkpoint = {
    timestamp: new Date().toISOString(),
    task: {
      id: taskData.task_id,
      subject: taskData.task_subject,
      description: taskData.task_description
    },
    session: {
      filesModified: sessionChanges.filesModified || [],
      filesCreated: sessionChanges.filesCreated || [],
      commandCount: (sessionChanges.commands || []).length
    }
  };

  // Append to checkpoints file
  const checkpointsFile = path.join(brainPath, 'checkpoints.json');
  let checkpoints = [];

  try {
    const existing = fs.readFileSync(checkpointsFile, 'utf8');
    checkpoints = JSON.parse(existing);
  } catch {
    // File doesn't exist yet
  }

  checkpoints.push(checkpoint);

  fs.writeFileSync(checkpointsFile, JSON.stringify(checkpoints, null, 2));

  // Also update task.md
  const taskFile = path.join(brainPath, 'task.md');
  const taskContent = `## Task: ${taskData.task_subject}
- Status: Completed
- Completed: ${new Date().toISOString()}

### Files Changed
${[...sessionChanges.filesModified, ...sessionChanges.filesCreated].map(f => `- ${f}`).join('\n') || '- None tracked'}

### Summary
${taskData.task_description || 'No description'}
`;

  fs.writeFileSync(taskFile, taskContent);
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
  const { task_id, task_subject, task_description } = data;

  // Load session changes
  const sessionChanges = loadSessionChanges();

  // Save checkpoint
  saveTaskCheckpoint(data, sessionChanges);

  // Log to stderr (visible but doesn't affect decision)
  console.error(`[CHECKPOINT] Task completed: ${task_subject}`);
  console.error(`  Files modified: ${sessionChanges.filesModified?.length || 0}`);
  console.error(`  Files created: ${sessionChanges.filesCreated?.length || 0}`);

  process.exit(0);
}
