#!/usr/bin/env node

/**
 * Shared utilities for context injection modules
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const PHASE_EVAL_PATH = '.claude/phase-evaluation.json';

// Re-export session utils
const sessionUtils = require('../lib/session-utils.cjs');

/**
 * Load phase evaluation from last commit
 *
 * Instead of consuming (deleting) on first read, we mark it as delivered.
 * This way if the file arrives after the first prompt, it still gets
 * picked up on the next prompt. The 10-minute expiry handles cleanup.
 */
function loadAndConsumePhaseEvaluation() {
  const evalPath = path.join(process.cwd(), PHASE_EVAL_PATH);
  try {
    if (!fs.existsSync(evalPath)) {
      return null;
    }

    const content = fs.readFileSync(evalPath, 'utf8');
    const data = JSON.parse(content);

    // Skip if already delivered
    if (data.delivered) {
      // Check expiry — clean up after 10 minutes
      const timestamp = new Date(data.timestamp);
      const now = new Date();
      const ageMinutes = (now - timestamp) / 1000 / 60;
      if (ageMinutes > 10) {
        fs.unlinkSync(evalPath);
      }
      return null;
    }

    // Check if it's recent (within last 10 minutes)
    const timestamp = new Date(data.timestamp);
    const now = new Date();
    const ageMinutes = (now - timestamp) / 1000 / 60;

    if (ageMinutes > 10) {
      fs.unlinkSync(evalPath);
      return null;
    }

    // Mark as delivered instead of deleting
    data.delivered = true;
    fs.writeFileSync(evalPath, JSON.stringify(data, null, 2));

    return data.content;
  } catch {
    try { fs.unlinkSync(evalPath); } catch {}
    return null;
  }
}

/**
 * Read a spec file
 */
function readSpecFile(filePath, isJson = false) {
  const fullPath = path.join(process.cwd(), filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (isJson) {
      return JSON.stringify(JSON.parse(content), null, 2);
    }
    return content;
  } catch {
    return null;
  }
}

/**
 * Log injection to session tracking
 */
function logInjection(sessionId, actions) {
  if (!sessionId) return;

  try {
    const tracking = sessionUtils.loadSessionTracking(sessionId) || {};
    tracking.injections = tracking.injections || [];
    tracking.injections.push({
      timestamp: new Date().toISOString(),
      ...actions
    });
    sessionUtils.saveSessionTracking(sessionId, tracking);
  } catch {
    // Silent fail - tracking is optional
  }
}

module.exports = {
  HOME,
  PHASE_EVAL_PATH,
  loadAndConsumePhaseEvaluation,
  readSpecFile,
  logInjection,
  ...sessionUtils
};
