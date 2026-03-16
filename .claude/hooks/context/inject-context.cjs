#!/usr/bin/env node

/**
 * Inject Context Hook (Orchestrator)
 *
 * Event: UserPromptSubmit
 * Purpose: Auto-injects relevant context based on user prompt
 *
 * This is the main orchestrator that calls focused modules:
 * - route-commands.cjs - Command suggestions and workflow injection
 * - reasoning-checkpoints.cjs - Reasoning reminders
 * - methodology.cjs - Career/Professional and CPMAI reminders
 * - voice-identity.cjs - Voice profile and identity injection
 * - capture.cjs - Capture request handling
 * - spec-triggers.cjs - Auto-load specs based on keywords
 */

const { loadAndConsumePhaseEvaluation, logInjection } = require('./inject-utils.cjs');
const routeCommands = require('./route-commands.cjs');
const reasoningCheckpoints = require('./reasoning-checkpoints.cjs');
const methodology = require('./methodology.cjs');
const voiceIdentity = require('./voice-identity.cjs');
const capture = require('./capture.cjs');
const specTriggers = require('./spec-triggers.cjs');

// Read hook input from stdin
let inputData = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => inputData += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(inputData);
    handleHook(data);
  } catch {
    process.exit(0);
  }
});

function handleHook(data) {
  const { prompt, session_id } = data;

  if (!prompt) {
    process.exit(0);
  }

  const contextParts = [];
  const actions = { prompt };

  // 1. Check for Phase Evaluation from recent commit
  const phaseEvalContent = loadAndConsumePhaseEvaluation();
  if (phaseEvalContent) {
    contextParts.push(`[PHASE EVALUATION - From last commit]\n\n${phaseEvalContent}`);
    actions.phaseEvalInjected = true;
  }

  // 2. Check voice/identity needs first (affects command routing)
  const voiceResult = voiceIdentity.check(prompt);
  if (voiceResult.content) {
    contextParts.push(...voiceResult.content);
    if (voiceResult.identityLoaded) actions.identityLoaded = true;
    if (voiceResult.voiceProfileLoaded) actions.voiceProfileLoaded = true;
  }

  // 3. Check for capture requests
  const captureResult = capture.check(prompt);
  if (captureResult.content) {
    contextParts.push(captureResult.content);
    actions.captureTriggered = true;
  }

  // 4. Check for command routing (skip /start-task for content writing)
  const commandResult = routeCommands.check(prompt, {
    skipStartTask: voiceResult.isContentWriting || voiceResult.isIdeation
  });
  if (commandResult.content) {
    contextParts.push(commandResult.content);
    actions.commandSuggested = commandResult.command;
  }

  // 5. Check reasoning checkpoints (only if no command suggested)
  if (!commandResult.command) {
    const reasoningResult = reasoningCheckpoints.check(prompt);
    if (reasoningResult.content) {
      contextParts.push(reasoningResult.content);
      actions.reasoningCheckpoints = reasoningResult.checkpoints.length;
    }
  }

  // 6. Check methodology enforcement (always fires)
  const methodologyResult = methodology.check(prompt);
  if (methodologyResult.content) {
    contextParts.push(methodologyResult.content);
    actions.methodologyEnforced = true;
  }

  // 7. Check spec triggers (skip if workflow already injected)
  if (!commandResult.workflowInjected) {
    const specResult = specTriggers.check(prompt);
    if (specResult.content) {
      contextParts.push(...specResult.content);
      actions.specsLoaded = specResult.specsLoaded;
    }
  }

  // Log injection if any context was added
  if (contextParts.length > 0) {
    logInjection(session_id, actions);
  }

  // Output context if any was collected
  if (contextParts.length > 0) {
    const output = {
      additionalContext: contextParts.join('\n\n---\n\n')
    };
    console.log(JSON.stringify(output));
  }

  process.exit(0);
}
