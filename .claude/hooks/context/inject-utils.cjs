#!/usr/bin/env node

/**
 * Shared utilities for context injection modules
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const VOICE_PROFILE_PATH = path.join(HOME, '.gemini/antigravity/brain/voice-profile.md');
const IDENTITY_PATH = path.join(HOME, 'Repositories/Personal/my-brain/CLAUDE.md');
const PHASE_EVAL_PATH = '.claude/phase-evaluation.json';

// Re-export session utils
const sessionUtils = require('../lib/session-utils.cjs');

/**
 * Load voice profile from brain
 */
function loadVoiceProfile() {
  try {
    return fs.readFileSync(VOICE_PROFILE_PATH, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Load identity context from my-brain
 */
function loadIdentityContext() {
  try {
    const content = fs.readFileSync(IDENTITY_PATH, 'utf8');

    // Extract key sections for ideation context
    const sections = [];

    // Get the Professional section
    const professionalMatch = content.match(/## Professional\s*\n([\s\S]*?)(?=\n## |\n---|\$)/);
    if (professionalMatch) {
      sections.push('**Professional Context:**\n' + professionalMatch[1].trim());
    }

    // Get Current Projects
    const projectsMatch = content.match(/## Current Projects\s*\n([\s\S]*?)(?=\n## |\n---|\$)/);
    if (projectsMatch) {
      sections.push('**Current Projects:**\n' + projectsMatch[1].trim());
    }

    // Get Goals if present
    const goalsMatch = content.match(/## Goals?\s*\n([\s\S]*?)(?=\n## |\n---|\$)/);
    if (goalsMatch) {
      sections.push('**Goals:**\n' + goalsMatch[1].trim());
    }

    return sections.length > 0 ? sections.join('\n\n') : null;
  } catch {
    return null;
  }
}

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
  VOICE_PROFILE_PATH,
  IDENTITY_PATH,
  PHASE_EVAL_PATH,
  loadVoiceProfile,
  loadIdentityContext,
  loadAndConsumePhaseEvaluation,
  readSpecFile,
  logInjection,
  ...sessionUtils
};
