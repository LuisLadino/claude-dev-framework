#!/usr/bin/env node

/**
 * Inject Context Hook (Orchestrator)
 *
 * Event: UserPromptSubmit
 * Purpose: Auto-injects relevant context based on user prompt
 *
 * Modules:
 * - reasoning-checkpoints.cjs - Reasoning reminders (LOOK IT UP, VERIFY, ROOT CAUSE)
 * - voice-identity.cjs - Short voice reminder when writing content for Luis
 * - capture.cjs - Capture requests → Claude memory system
 * - spec-triggers.cjs - Auto-load specs based on keywords
 *
 * Removed:
 * - route-commands.cjs — skills system + gating hooks handle command routing natively
 * - methodology.cjs — CPMAI domains folded into lenses in system-prompt.md
 */

const { loadAndConsumePhaseEvaluation, logInjection } = require('./inject-utils.cjs');
const reasoningCheckpoints = require('./reasoning-checkpoints.cjs');
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

  // 2. Check voice reminder (short — full rules are in CLAUDE.md)
  const voiceResult = voiceIdentity.check(prompt);
  if (voiceResult.content) {
    contextParts.push(...voiceResult.content);
    if (voiceResult.voiceProfileLoaded) actions.voiceProfileLoaded = true;
  }

  // 3. Check for capture requests
  const captureResult = capture.check(prompt);
  if (captureResult.content) {
    contextParts.push(captureResult.content);
    actions.captureTriggered = true;
  }

  // 4. Check reasoning checkpoints
  const reasoningResult = reasoningCheckpoints.check(prompt);
  if (reasoningResult.content) {
    contextParts.push(reasoningResult.content);
    actions.reasoningCheckpoints = reasoningResult.checkpoints.length;
  }

  // 5. Check spec triggers
  const specResult = specTriggers.check(prompt);
  if (specResult.content) {
    contextParts.push(...specResult.content);
    actions.specsLoaded = specResult.specsLoaded;
  }

  // 6. Design thinking phase + Response format reminder (ALWAYS fires)
  contextParts.push('[DESIGN THINKING] You are always in a phase: UNDERSTAND, DEFINE, IDEATE, PROTOTYPE, TEST, or ITERATE. The phase tracks the WORK, not this message. A question during prototyping is still PROTOTYPE. Phase only changes when the work moves. Use the phase skills (/research, /define, /ideate, /build, /test) to guide transitions.\n\n[RESPONSE FORMAT] Start with: **Lens:** [perspective] | **Refine:** [restated prompt] | **Phase:** [design thinking phase] | **Teach:** [concept + framings + usage]. No exceptions.');
  actions.formatReminder = true;

  // Log injection (always fires due to format reminder)
  logInjection(session_id, actions);

  // Output context
  const output = {
    additionalContext: contextParts.join('\n\n---\n\n')
  };
  console.log(JSON.stringify(output));

  process.exit(0);
}
