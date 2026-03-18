#!/usr/bin/env node

/**
 * Phase Evaluator Worker
 *
 * Background worker that runs `claude -p` for Phase Evaluator.
 * Spawned by spawn-phase-evaluator.cjs hook as a detached process.
 *
 * This runs in the background so commits don't block waiting for evaluation.
 * Results are written to:
 * - .claude/phase-evaluation.json (current, for inject-context.cjs)
 * - .claude/phase-evaluation-history.jsonl (append-only, for trend analysis)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_DEFINITION_PATH = '.claude/specs/project-definition.yaml';
const PHASE_EVAL_OUTPUT_PATH = '.claude/phase-evaluation.json';
const PHASE_EVAL_HISTORY_PATH = '.claude/phase-evaluation-history.jsonl';
const MODEL = 'sonnet';
const ALLOWED_TOOLS = 'Read,Bash,Glob,Grep';

// Read input from file (path passed as argv[2])
const inputPath = process.argv[2];
if (!inputPath || !fs.existsSync(inputPath)) {
  process.exit(1);
}

const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const { cwd, prompt, debugPath, commitHash } = input;

// Debug helper
const debugLog = (msg) => {
  if (!debugPath) return;
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(debugPath, `[${timestamp}] [WORKER] ${msg}\n`);
  } catch (e) { /* ignore */ }
};

debugLog('Worker started');

// Clean up input file
try {
  fs.unlinkSync(inputPath);
} catch (e) { /* ignore */ }

const start = Date.now();
let result;

try {
  // Run claude -p (no timeout - let it take as long as needed)
  result = execSync(
    `claude -p --model ${MODEL} --output-format json --allowedTools "${ALLOWED_TOOLS}"`,
    {
      input: prompt,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      cwd: '/tmp',
      env: { ...process.env }
    }
  );
} catch (err) {
  debugLog(`Spawn FAILED: ${err.message}`);
  process.exit(1);
}

const elapsed = Date.now() - start;
debugLog(`Spawn completed in ${elapsed}ms`);

// Parse the claude -p output
let claudeOutput;
try {
  claudeOutput = JSON.parse(result);
} catch (e) {
  debugLog(`JSON parse FAILED: ${e.message}. Raw: ${result.substring(0, 200)}`);
  process.exit(1);
}

// Extract the actual result (JSON should be at the END, after research output)
let evalJson;
try {
  let resultText = claudeOutput.result || '';

  // Find the LAST markdown code fence (JSON comes after research)
  const allFences = [...resultText.matchAll(/```(?:json)?\n?([\s\S]*?)\n?```/g)];
  if (allFences.length > 0) {
    resultText = allFences[allFences.length - 1][1];
  }

  evalJson = JSON.parse(resultText.trim());
  debugLog(`Evaluation parsed successfully`);
} catch (e) {
  debugLog(`Eval parse FAILED: ${e.message}. Result: ${(claudeOutput.result || '').substring(0, 200)}`);
  process.exit(1);
}

// ============================================
// EXECUTE ACTIONS
// ============================================

const actionResults = [];
const projectDefPath = path.join(cwd, PROJECT_DEFINITION_PATH);

// 1. Create GitHub issues
if (evalJson.issues_to_create && evalJson.issues_to_create.length > 0) {
  for (const issue of evalJson.issues_to_create) {
    if (!issue.title) continue;

    try {
      const labels = issue.labels && issue.labels.length > 0
        ? `--label "${issue.labels.join(',')}"`
        : '';
      const body = issue.body || 'Created by Phase Evaluator';

      const createCmd = `gh issue create --title "${issue.title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" ${labels}`;
      const issueUrl = execSync(createCmd, {
        encoding: 'utf8',
        cwd: cwd,
        timeout: 30000
      }).trim();

      actionResults.push(`Created issue: ${issueUrl}`);
      debugLog(`Created issue: ${issueUrl}`);
    } catch (e) {
      actionResults.push(`Failed to create issue: ${issue.title}`);
      debugLog(`Failed to create issue: ${issue.title} - ${e.message}`);
    }
  }
}

// 2. Add comment to active issue
if (evalJson.issue_comment && evalJson.issue_comment.active_issue && evalJson.issue_comment.comment) {
  try {
    const issueNum = evalJson.issue_comment.active_issue;
    const comment = evalJson.issue_comment.comment.replace(/"/g, '\\"');

    execSync(`gh issue comment ${issueNum} --body "${comment}"`, {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 30000
    });

    actionResults.push(`Added comment to issue #${issueNum}`);
    debugLog(`Added comment to issue #${issueNum}`);
  } catch (e) {
    actionResults.push(`Failed to comment on issue #${evalJson.issue_comment.active_issue}`);
    debugLog(`Failed to comment: ${e.message}`);
  }
}

// 3. Update project-definition.yaml if phase changed
if (evalJson.project_updates && evalJson.project_updates.phase_change) {
  try {
    if (fs.existsSync(projectDefPath)) {
      let yamlContent = fs.readFileSync(projectDefPath, 'utf8');
      const newPhase = evalJson.project_updates.phase_change;

      if (yamlContent.includes('current_phase:')) {
        yamlContent = yamlContent.replace(
          /current_phase:\s*\w+/,
          `current_phase: ${newPhase}`
        );
      } else {
        yamlContent += `\ncurrent_phase: ${newPhase}\n`;
      }

      fs.writeFileSync(projectDefPath, yamlContent);
      actionResults.push(`Updated phase to: ${newPhase}`);
      debugLog(`Updated phase to: ${newPhase}`);
    }
  } catch (e) {
    actionResults.push(`Failed to update project phase`);
    debugLog(`Failed to update phase: ${e.message}`);
  }
}

// ============================================
// FORMAT OUTPUT
// ============================================

const outputParts = [];
outputParts.push(`[PHASE EVALUATION - ${elapsed}ms]`);
outputParts.push('');

// Phase assessment
if (evalJson.phase_assessment) {
  if (evalJson.phase_assessment.micro) {
    outputParts.push(`MICRO: ${evalJson.phase_assessment.micro.phase} (${evalJson.phase_assessment.micro.confidence})`);
  }
  if (evalJson.phase_assessment.macro) {
    outputParts.push(`MACRO: ${evalJson.phase_assessment.macro.phase} (${evalJson.phase_assessment.macro.confidence})`);
  }
}

// Rhythm
if (evalJson.rhythm) {
  outputParts.push(`RHYTHM: ${evalJson.rhythm.mode} | ${evalJson.rhythm.health}`);
  if (evalJson.rhythm.pattern) {
    outputParts.push(`  ${evalJson.rhythm.pattern}`);
  }
}
outputParts.push('');

// Commit analysis
if (evalJson.commit_analysis) {
  outputParts.push(`COMMIT: ${evalJson.commit_analysis.type} - ${evalJson.commit_analysis.summary}`);
  outputParts.push('');
}

// Observations
if (evalJson.observations && evalJson.observations.length > 0) {
  outputParts.push('OBSERVATIONS:');
  evalJson.observations.forEach(o => outputParts.push(`- ${o}`));
  outputParts.push('');
}

// Related links
if (evalJson.related_links && evalJson.related_links.length > 0) {
  outputParts.push('RELATED:');
  evalJson.related_links.forEach(l => {
    if (l.url) {
      outputParts.push(`- ${l.title}: ${l.url}`);
    } else if (l.file) {
      outputParts.push(`- ${l.title}: ${l.file}`);
    }
  });
  outputParts.push('');
}

// Actions taken
if (actionResults.length > 0) {
  outputParts.push('ACTIONS TAKEN:');
  actionResults.forEach(a => outputParts.push(`- ${a}`));
  outputParts.push('');
}

// Reflection prompts
if (evalJson.reflection_prompts && evalJson.reflection_prompts.length > 0) {
  outputParts.push('CONSIDER:');
  evalJson.reflection_prompts.forEach(p => outputParts.push(`- ${p}`));
  outputParts.push('');
}

// Summary
if (evalJson.summary) {
  outputParts.push(`SUMMARY: ${evalJson.summary}`);
}

const formattedOutput = outputParts.join('\n');
const timestamp = new Date().toISOString();

// ============================================
// WRITE OUTPUT
// ============================================

// 1. Current evaluation (for inject-context.cjs)
const outputPath = path.join(cwd, PHASE_EVAL_OUTPUT_PATH);
try {
  const fileContent = {
    timestamp,
    commit: commitHash || null,
    elapsed_ms: elapsed,
    content: formattedOutput,
    raw: evalJson
  };
  fs.writeFileSync(outputPath, JSON.stringify(fileContent, null, 2));
  debugLog(`Current output written to ${outputPath}`);
} catch (e) {
  debugLog(`Current output write FAILED: ${e.message}`);
}

// 2. History (append-only, for trend analysis)
const historyPath = path.join(cwd, PHASE_EVAL_HISTORY_PATH);
try {
  const historyEntry = {
    timestamp,
    commit: commitHash || null,
    elapsed_ms: elapsed,
    phase_micro: evalJson.phase_assessment?.micro?.phase || null,
    phase_macro: evalJson.phase_assessment?.macro?.phase || null,
    rhythm_mode: evalJson.rhythm?.mode || null,
    rhythm_health: evalJson.rhythm?.health || null,
    commit_type: evalJson.commit_analysis?.type || null,
    observations_count: evalJson.observations?.length || 0,
    issues_created: actionResults.filter(a => a.startsWith('Created issue')).length,
    reflection_prompts: evalJson.reflection_prompts || [],
    summary: evalJson.summary || null
  };
  fs.appendFileSync(historyPath, JSON.stringify(historyEntry) + '\n');
  debugLog(`History appended to ${historyPath}`);
} catch (e) {
  debugLog(`History write FAILED: ${e.message}`);
}

debugLog('Worker completed');
process.exit(0);
