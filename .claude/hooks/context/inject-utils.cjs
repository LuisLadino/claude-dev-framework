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
 * Load and consume phase evaluation from last commit
 */
function loadAndConsumePhaseEvaluation() {
  const evalPath = path.join(process.cwd(), PHASE_EVAL_PATH);
  try {
    if (!fs.existsSync(evalPath)) {
      return null;
    }

    const content = fs.readFileSync(evalPath, 'utf8');
    const data = JSON.parse(content);

    // Check if it's recent (within last 10 minutes)
    const timestamp = new Date(data.timestamp);
    const now = new Date();
    const ageMinutes = (now - timestamp) / 1000 / 60;

    if (ageMinutes > 10) {
      fs.unlinkSync(evalPath);
      return null;
    }

    // Delete after reading (consume it)
    fs.unlinkSync(evalPath);
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
