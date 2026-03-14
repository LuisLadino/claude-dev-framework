#!/usr/bin/env node

/**
 * Apply Phase Update Hook
 *
 * Event: PostToolUse on Bash (runs after Phase Evaluator)
 * Purpose: Reads Phase Evaluator output and applies updates to project-definition.yaml
 *
 * This hook runs AFTER the Phase Evaluator has written to .claude/phase-evaluation.json
 * If a phase transition or iteration is recommended, it updates project-definition.yaml
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const EVALUATION_FILE = '.claude/phase-evaluation.json';
const PROJECT_DEF_FILE = '.claude/specs/project-definition.yaml';

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    handleHook();
  } catch (e) {
    console.error(`[Phase Update] Error: ${e.message}`);
    process.exit(0);
  }
});

function handleHook() {
  const evalPath = path.join(process.cwd(), EVALUATION_FILE);
  const projectDefPath = path.join(process.cwd(), PROJECT_DEF_FILE);

  // Check if evaluation file exists
  if (!fs.existsSync(evalPath)) {
    // No evaluation - nothing to do
    process.exit(0);
  }

  // Read evaluation
  let evaluation;
  try {
    const content = fs.readFileSync(evalPath, 'utf8');
    evaluation = JSON.parse(content);
  } catch (e) {
    console.error(`[Phase Update] Failed to parse evaluation: ${e.message}`);
    process.exit(0);
  }

  // Check recommendation
  if (evaluation.recommendation === 'no_change') {
    // Log progress but don't update
    if (evaluation.progress) {
      console.log(`[Phase] ${evaluation.current_phase}: ${evaluation.progress.milestone_percent || 0}% complete`);
    }
    process.exit(0);
  }

  // Need to update project-definition.yaml
  if (!fs.existsSync(projectDefPath)) {
    console.error('[Phase Update] No project-definition.yaml found');
    process.exit(0);
  }

  // Read project definition
  let projectDef;
  let projectDefContent;
  try {
    projectDefContent = fs.readFileSync(projectDefPath, 'utf8');
    projectDef = yaml.parse(projectDefContent);
  } catch (e) {
    console.error(`[Phase Update] Failed to parse project definition: ${e.message}`);
    process.exit(0);
  }

  // Apply updates based on recommendation
  const today = new Date().toISOString().split('T')[0];
  const previousPhase = projectDef.lifecycle?.current_phase;

  if (evaluation.recommendation === 'transition') {
    // Phase transition
    const nextPhase = evaluation.next_phase;

    // Update current phase
    if (!projectDef.lifecycle) projectDef.lifecycle = {};
    projectDef.lifecycle.current_phase = nextPhase;
    projectDef.lifecycle.phase_started = today;

    // Add to phase history
    if (!projectDef.lifecycle.phase_history) projectDef.lifecycle.phase_history = [];
    projectDef.lifecycle.phase_history.push({
      phase: previousPhase,
      started: projectDef.lifecycle.phase_started || today,
      completed: today,
      key_artifacts: evaluation.evidence || [],
      key_learnings: []
    });

    console.log(`[Phase Transition] ${previousPhase} → ${nextPhase}`);
    console.log(`Evidence: ${evaluation.evidence?.join(', ') || 'none provided'}`);

  } else if (evaluation.recommendation === 'iterate') {
    // Iteration triggered
    projectDef.lifecycle.current_phase = 'iterate';
    projectDef.lifecycle.phase_started = today;

    // Add iteration entry to history
    if (!projectDef.lifecycle.phase_history) projectDef.lifecycle.phase_history = [];
    projectDef.lifecycle.phase_history.push({
      phase: 'iterate',
      started: today,
      completed: '',
      trigger: evaluation.cause?.type || 'unknown',
      trigger_description: evaluation.cause?.description || '',
      phase_to_revisit: evaluation.scope?.phase_to_revisit || previousPhase,
      key_artifacts: [],
      key_learnings: []
    });

    console.log(`[Iteration Triggered] ${evaluation.cause?.type || 'unknown'}`);
    console.log(`Cause: ${evaluation.cause?.description || 'not specified'}`);
    console.log(`Revisiting: ${evaluation.scope?.phase_to_revisit || previousPhase}`);
  }

  // Write updated project definition
  try {
    const updatedContent = yaml.stringify(projectDef, { lineWidth: 120 });
    fs.writeFileSync(projectDefPath, updatedContent);
    console.log('[Phase Update] project-definition.yaml updated');
  } catch (e) {
    console.error(`[Phase Update] Failed to write: ${e.message}`);
  }

  // Clean up evaluation file (it's been processed)
  try {
    fs.unlinkSync(evalPath);
  } catch (e) {
    // Ignore cleanup errors
  }

  process.exit(0);
}
