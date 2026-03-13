#!/usr/bin/env node

/**
 * Shared utilities for session tracking hooks
 *
 * Session tracking is GLOBAL (framework telemetry):
 * ~/.gemini/antigravity/brain/tracking/sessions/{session-id}.json
 *
 * Project context is per-workspace:
 * ~/.gemini/antigravity/brain/{workspace-uuid}/task.md, decisions.md, etc.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOME = process.env.HOME || process.env.USERPROFILE;
const BRAIN_DIR = path.join(HOME, '.gemini/antigravity/brain');
const TRACKING_DIR = path.join(BRAIN_DIR, 'tracking/sessions');

/**
 * Find the brain folder for a workspace
 * Same logic as session-context.js
 */
function findWorkspaceBrain(workspacePath) {
  if (!fs.existsSync(BRAIN_DIR)) {
    fs.mkdirSync(BRAIN_DIR, { recursive: true });
  }

  // Look for existing session folder matching this workspace
  const sessions = fs.readdirSync(BRAIN_DIR).filter(f => {
    const fullPath = path.join(BRAIN_DIR, f);
    return fs.statSync(fullPath).isDirectory() && f !== 'tempmediaStorage';
  });

  for (const uuid of sessions) {
    const statePath = path.join(BRAIN_DIR, uuid, 'session_state.json');
    if (fs.existsSync(statePath)) {
      try {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        const storedPath = (state.workspace || '').split(' -> ')[0];
        if (storedPath === workspacePath || workspacePath.startsWith(storedPath)) {
          return path.join(BRAIN_DIR, uuid);
        }
      } catch (e) {}
    }
  }

  // No existing folder, create new one
  const newUuid = crypto.randomUUID();
  const newPath = path.join(BRAIN_DIR, newUuid);
  fs.mkdirSync(newPath, { recursive: true });

  // Initialize session_state.json with workspace
  fs.writeFileSync(
    path.join(newPath, 'session_state.json'),
    JSON.stringify({ workspace: workspacePath, type: 'auto-created' }, null, 2)
  );

  return newPath;
}

/**
 * Generate a session ID
 * Uses process start time + pid for uniqueness within a Claude session
 */
function generateSessionId() {
  // Use timestamp + random for uniqueness
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}-${random}`;
}

/**
 * Get session ID - prefer Claude Code's session_id from hook input
 * Falls back to generating our own if not provided
 *
 * @param {string} [claudeSessionId] - Claude Code's session_id from hook input
 */
function getSessionId(claudeSessionId) {
  if (!fs.existsSync(TRACKING_DIR)) {
    fs.mkdirSync(TRACKING_DIR, { recursive: true });
  }

  // Use Claude Code's session_id if provided (preferred - eliminates fragmentation)
  if (claudeSessionId) {
    return claudeSessionId;
  }

  // Fallback: use our own session ID with timeout logic
  const activeSessionFile = path.join(TRACKING_DIR, '.active-session');

  if (fs.existsSync(activeSessionFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(activeSessionFile, 'utf8'));
      const age = Date.now() - data.createdAt;
      // If less than 5 minutes old, same session (increased from 30s)
      if (age < 300000) {
        return data.sessionId;
      }
    } catch (e) {}
  }

  // Generate new session ID
  const sessionId = generateSessionId();
  fs.writeFileSync(activeSessionFile, JSON.stringify({
    sessionId,
    createdAt: Date.now()
  }));

  return sessionId;
}

/**
 * Get path to session tracking file (global tracking dir)
 */
function getSessionTrackingPath(sessionId) {
  return path.join(TRACKING_DIR, `${sessionId}.json`);
}

/**
 * Load session tracking data
 */
function loadSessionTracking(sessionId) {
  const trackingPath = getSessionTrackingPath(sessionId);
  try {
    const content = fs.readFileSync(trackingPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return {
      sessionId,
      sessionStart: new Date().toISOString(),
      workspace: process.cwd(),
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
function saveSessionTracking(sessionId, data) {
  if (!fs.existsSync(TRACKING_DIR)) {
    fs.mkdirSync(TRACKING_DIR, { recursive: true });
  }

  const trackingPath = getSessionTrackingPath(sessionId);
  fs.writeFileSync(trackingPath, JSON.stringify(data, null, 2));
}

/**
 * Initialize a new session
 */
function initSession() {
  const sessionId = generateSessionId();

  if (!fs.existsSync(TRACKING_DIR)) {
    fs.mkdirSync(TRACKING_DIR, { recursive: true });
  }

  // Write active session marker
  const activeSessionFile = path.join(TRACKING_DIR, '.active-session');
  fs.writeFileSync(activeSessionFile, JSON.stringify({
    sessionId,
    createdAt: Date.now()
  }));

  // Initialize tracking data
  const trackingData = {
    sessionId,
    sessionStart: new Date().toISOString(),
    workspace: process.cwd(),
    filesModified: [],
    filesCreated: [],
    operations: [],
    commands: []
  };

  saveSessionTracking(sessionId, trackingData);

  return sessionId;
}

/**
 * Clean up old session files (older than 7 days)
 */
function cleanupOldSessions() {
  if (!fs.existsSync(TRACKING_DIR)) return;

  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();

  const files = fs.readdirSync(TRACKING_DIR);
  for (const file of files) {
    if (file === '.active-session') continue;

    const filePath = path.join(TRACKING_DIR, file);
    try {
      const stat = fs.statSync(filePath);
      if (now - stat.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {}
  }
}

module.exports = {
  findWorkspaceBrain,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking,
  initSession,
  cleanupOldSessions,
  BRAIN_DIR,
  TRACKING_DIR
};
