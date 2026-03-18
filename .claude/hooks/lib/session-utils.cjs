#!/usr/bin/env node

/**
 * Shared utilities for session tracking hooks
 *
 * All persistence goes to ~/.claude/projects/{workspace-key}/
 * This is Claude Code's native per-project directory.
 *
 * Tracking data: ~/.claude/projects/{workspace-key}/tracking/{session-id}.json
 * Workspace state: ~/.claude/projects/{workspace-key}/ (handoff, session state, etc.)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const HOME = process.env.HOME || process.env.USERPROFILE;
const PROJECTS_DIR = path.join(HOME, '.claude/projects');

/**
 * Get the workspace key for the current directory.
 * Uses git root when available, falls back to cwd.
 * Matches Claude Code's native convention: path with / replaced by -
 */
function getWorkspaceKey(workspacePath) {
  let root = workspacePath || process.cwd();

  // Normalize to git root when possible
  try {
    root = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: root
    }).trim();
  } catch (e) {
    // Not a git repo, use cwd
  }

  // Claude Code convention: leading - then path separators become -
  return '-' + root.replace(/\//g, '-').slice(1);
}

/**
 * Get the project directory for a workspace.
 * This is where all persistence lives.
 */
function getProjectDir(workspacePath) {
  const key = getWorkspaceKey(workspacePath);
  return path.join(PROJECTS_DIR, key);
}

/**
 * Get the tracking directory for a workspace.
 */
function getTrackingDir(workspacePath) {
  const projectDir = getProjectDir(workspacePath);
  return path.join(projectDir, 'tracking');
}

/**
 * Generate a session ID
 */
function generateSessionId() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}-${random}`;
}

/**
 * Get session ID - prefer Claude Code's session_id from hook input
 * Falls back to generating our own if not provided
 */
function getSessionId(claudeSessionId) {
  if (claudeSessionId) {
    return claudeSessionId;
  }

  const trackingDir = getTrackingDir();
  if (!fs.existsSync(trackingDir)) {
    fs.mkdirSync(trackingDir, { recursive: true });
  }

  // Fallback: use our own session ID with timeout logic
  const activeSessionFile = path.join(trackingDir, '.active-session');

  if (fs.existsSync(activeSessionFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(activeSessionFile, 'utf8'));
      const age = Date.now() - data.createdAt;
      if (age < 300000) {
        return data.sessionId;
      }
    } catch (e) {}
  }

  const sessionId = generateSessionId();
  fs.writeFileSync(activeSessionFile, JSON.stringify({
    sessionId,
    createdAt: Date.now()
  }));

  return sessionId;
}

/**
 * Get path to session tracking file
 */
function getSessionTrackingPath(sessionId, workspacePath) {
  const trackingDir = getTrackingDir(workspacePath);
  return path.join(trackingDir, `${sessionId}.json`);
}

/**
 * Load session tracking data
 */
function loadSessionTracking(sessionId, workspacePath) {
  const trackingPath = getSessionTrackingPath(sessionId, workspacePath);
  try {
    const content = fs.readFileSync(trackingPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return {
      sessionId,
      sessionStart: new Date().toISOString(),
      workspace: workspacePath || process.cwd(),
      filesModified: [],
      filesCreated: [],
      operations: [],
      commands: []
    };
  }
}

/**
 * Save session tracking data
 */
function saveSessionTracking(sessionId, data, workspacePath) {
  const trackingDir = getTrackingDir(workspacePath);
  if (!fs.existsSync(trackingDir)) {
    fs.mkdirSync(trackingDir, { recursive: true });
  }

  const trackingPath = getSessionTrackingPath(sessionId, workspacePath);
  fs.writeFileSync(trackingPath, JSON.stringify(data, null, 2));
}

/**
 * Initialize a new session
 */
function initSession(workspacePath) {
  const sessionId = generateSessionId();
  const trackingDir = getTrackingDir(workspacePath);

  if (!fs.existsSync(trackingDir)) {
    fs.mkdirSync(trackingDir, { recursive: true });
  }

  const activeSessionFile = path.join(trackingDir, '.active-session');
  fs.writeFileSync(activeSessionFile, JSON.stringify({
    sessionId,
    createdAt: Date.now()
  }));

  const trackingData = {
    sessionId,
    sessionStart: new Date().toISOString(),
    workspace: workspacePath || process.cwd(),
    filesModified: [],
    filesCreated: [],
    operations: [],
    commands: []
  };

  saveSessionTracking(sessionId, trackingData, workspacePath);

  return sessionId;
}

/**
 * Clean up old session tracking files (older than 7 days)
 */
function cleanupOldSessions(workspacePath) {
  const trackingDir = getTrackingDir(workspacePath);
  if (!fs.existsSync(trackingDir)) return;

  const maxAge = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const files = fs.readdirSync(trackingDir);
  for (const file of files) {
    if (file === '.active-session') continue;

    const filePath = path.join(trackingDir, file);
    try {
      const stat = fs.statSync(filePath);
      if (now - stat.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {}
  }
}

/**
 * Get the error log path for this workspace
 */
function getErrorLogPath(workspacePath) {
  const projectDir = getProjectDir(workspacePath);
  return path.join(projectDir, 'hook-errors.log');
}

/**
 * Log an error to the workspace error log
 */
function logError(hook, message, workspacePath) {
  const errorLogPath = getErrorLogPath(workspacePath);
  const entry = `[${new Date().toISOString()}] ${hook}: ${message}\n`;
  try {
    const dir = path.dirname(errorLogPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(errorLogPath, entry);
  } catch (e) {}
}

module.exports = {
  getWorkspaceKey,
  getProjectDir,
  getTrackingDir,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking,
  initSession,
  cleanupOldSessions,
  getErrorLogPath,
  logError,
  PROJECTS_DIR
};
