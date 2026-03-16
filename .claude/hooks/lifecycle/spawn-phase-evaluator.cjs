#!/usr/bin/env node

// Fix: Using "Bash" matcher instead of "Bash(*git commit*)" - glob pattern wasn't matching

/**
 * Spawn Phase Evaluator Hook
 *
 * Event: PostToolUse (Bash with git commit)
 * Purpose: Spawns Phase Evaluator via `claude -p` to evaluate project rhythm after commits
 *
 * This hook:
 * 1. Reads Phase Evaluator instructions from .claude/agents/phase-evaluator.md
 * 2. Includes commit info and workspace path in the spawn command
 * 3. Spawns `claude -p` with those instructions
 * 4. Parses the JSON response
 * 5. EXECUTES ACTIONS:
 *    - Creates GitHub issues for items in issues_to_create
 *    - Adds comment to active issue if issue_comment provided
 *    - Updates project-definition.yaml if phase_change specified
 * 6. Outputs to BOTH:
 *    - stdout (JSON with additionalContext) - for main Claude session
 *    - stderr (formatted text) - for user to see in terminal
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const AGENT_INSTRUCTIONS_PATH = '.claude/agents/phase-evaluator.md';
const PROJECT_DEFINITION_PATH = '.claude/specs/project-definition.yaml';
const PHASE_EVAL_OUTPUT_PATH = '.claude/phase-evaluation.json'; // Written for inject-context.cjs to read
const TIMEOUT_MS = 120000; // 120 seconds (agent does research now)
const MODEL = 'haiku';

// Read stdin (hook input)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  // Debug: Log every invocation
  const debugPath = path.join(process.cwd(), '.claude/phase-evaluator-debug.log');
  try {
    const timestamp = new Date().toISOString();
    const debugEntry = `[${timestamp}] Hook invoked\nInput: ${input.substring(0, 500)}\n---\n`;
    fs.appendFileSync(debugPath, debugEntry);
  } catch (e) { /* ignore */ }

  try {
    runPhaseEvaluator();
  } catch (e) {
    // On error, continue silently
    process.exit(0);
  }
});

function runPhaseEvaluator() {
  const cwd = process.cwd();
  const agentPath = path.join(cwd, AGENT_INSTRUCTIONS_PATH);

  // Parse hook input
  let hookInput;
  try {
    hookInput = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  // Verify this was a git commit
  const command = hookInput.tool_input?.command || '';
  if (!command.includes('git commit')) {
    process.exit(0);
  }

  // Check if agent instructions exist
  if (!fs.existsSync(agentPath)) {
    process.exit(0);
  }

  // Read agent instructions (skip frontmatter)
  const agentContent = fs.readFileSync(agentPath, 'utf8');
  const instructionsMatch = agentContent.match(/---[\s\S]*?---\n([\s\S]*)/);
  const instructions = instructionsMatch ? instructionsMatch[1].trim() : agentContent;

  // Get recent commit info
  let commitInfo = '';
  try {
    const lastCommit = execSync('git log -1 --pretty=format:"%s%n%n%b"', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();

    const filesChanged = execSync('git diff-tree --no-commit-id --name-status -r HEAD', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();

    const recentCommits = execSync('git log -5 --oneline', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();

    const currentBranch = execSync('git branch --show-current', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();

    commitInfo = `
RECENT COMMIT:
${lastCommit}

FILES CHANGED:
${filesChanged}

RECENT COMMITS (for pattern detection):
${recentCommits}

CURRENT BRANCH:
${currentBranch}
`;
  } catch (e) {
    commitInfo = '\n[Could not get commit info]\n';
  }

  // Check for project definition
  let projectPhase = '';
  const projectDefPath = path.join(cwd, PROJECT_DEFINITION_PATH);
  if (fs.existsSync(projectDefPath)) {
    try {
      const yamlContent = fs.readFileSync(projectDefPath, 'utf8');
      const phaseMatch = yamlContent.match(/current_phase:\s*(\w+)/);
      if (phaseMatch) {
        projectPhase = `\nCURRENT RECORDED PHASE: ${phaseMatch[1]}\n`;
      }
    } catch (e) {
      // Ignore
    }
  }

  // Get open issues for context
  let openIssues = '';
  try {
    openIssues = execSync('gh issue list --state open --limit 5 --json number,title 2>/dev/null || echo "[]"', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 10000
    }).trim();
    if (openIssues && openIssues !== '[]') {
      openIssues = `\nOPEN ISSUES:\n${openIssues}\n`;
    } else {
      openIssues = '';
    }
  } catch (e) {
    openIssues = '';
  }

  // Build the prompt for claude -p
  const prompt = `You are the Phase Evaluator. A commit was just made. Evaluate the project and take action.

WORKSPACE: ${cwd}
${commitInfo}
${projectPhase}
${openIssues}

YOUR ROLE: Project-level strategic advisor. You:
- Evaluate project health and rhythm at the macro level
- Identify research needs, gaps, things to track
- Find relevant documentation and links
- Surface patterns the main session might miss
- Create GitHub issues for things that need attention

INSTRUCTIONS:
${instructions}

CRITICAL: You MUST respond with ONLY valid JSON. No explanations. No markdown fences. No text before or after.
If you lack information for a field, use null or empty arrays. NEVER respond with prose.

REQUIRED JSON STRUCTURE:
{
  "phase_assessment": {
    "micro": { "phase": "understand|define|ideate|prototype|test|iterate", "confidence": "low|medium|high" },
    "macro": { "phase": "understand|define|ideate|prototype|test|iterate", "confidence": "low|medium|high" }
  },
  "commit_analysis": {
    "summary": "What this commit accomplished",
    "type": "feature|fix|refactor|docs|test|chore"
  },
  "observations": ["observation 1", "observation 2"],
  "rhythm": {
    "mode": "diverging|groan_zone|converging",
    "health": "on_track|needs_attention|blocked",
    "pattern": "description"
  },
  "issues_to_create": [
    {
      "title": "Issue title",
      "body": "Issue body with context",
      "labels": ["label1", "label2"]
    }
  ],
  "issue_comment": {
    "active_issue": null,
    "comment": null
  },
  "related_links": [
    { "title": "Link title", "url": "https://..." }
  ],
  "reflection_prompts": ["question 1", "question 2"],
  "summary": "One sentence summary"
}

RESPOND WITH JSON ONLY:`;

  // Spawn claude -p with pre-authorized tools
  // Without --allowedTools, the subprocess can't get user approval for tool access
  const ALLOWED_TOOLS = 'Read,Bash,Glob,Grep';
  const start = Date.now();
  let result;

  // Debug helper
  const debugLog = (msg) => {
    try {
      const timestamp = new Date().toISOString();
      fs.appendFileSync(debugPath, `[${timestamp}] ${msg}\n`);
    } catch (e) { /* ignore */ }
  };

  debugLog('Spawning claude -p...');

  try {
    // Run from /tmp to avoid deadlock with parent Claude session
    result = execSync(
      `claude -p --model ${MODEL} --output-format json --allowedTools "${ALLOWED_TOOLS}"`,
      {
        input: prompt,
        encoding: 'utf8',
        timeout: TIMEOUT_MS,
        maxBuffer: 5 * 1024 * 1024,
        cwd: '/tmp',
        env: { ...process.env }
      }
    );
  } catch (err) {
    debugLog(`Spawn FAILED: ${err.message}`);
    process.exit(0);
  }

  const elapsed = Date.now() - start;
  debugLog(`Spawn completed in ${elapsed}ms`);

  // Parse the claude -p output
  let claudeOutput;
  try {
    claudeOutput = JSON.parse(result);
  } catch (e) {
    debugLog(`JSON parse FAILED: ${e.message}. Raw: ${result.substring(0, 200)}`);
    process.exit(0);
  }

  // Extract the actual result
  let evalJson;
  try {
    let resultText = claudeOutput.result || '';

    // Strip markdown code fence if present
    const jsonMatch = resultText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      resultText = jsonMatch[1];
    }

    evalJson = JSON.parse(resultText.trim());
    debugLog(`Evaluation parsed successfully`);
  } catch (e) {
    debugLog(`Eval parse FAILED: ${e.message}. Result: ${(claudeOutput.result || '').substring(0, 200)}`);
    process.exit(0);
  }

  // ============================================
  // EXECUTE ACTIONS
  // ============================================

  const actionResults = [];

  // 1. Create GitHub issues
  if (evalJson.issues_to_create && evalJson.issues_to_create.length > 0) {
    for (const issue of evalJson.issues_to_create) {
      if (!issue.title) continue;

      try {
        const labels = issue.labels && issue.labels.length > 0
          ? `--label "${issue.labels.join(',')}"`
          : '';
        const body = issue.body || 'Created by Phase Evaluator';

        // Create the issue
        const createCmd = `gh issue create --title "${issue.title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" ${labels}`;
        const issueUrl = execSync(createCmd, {
          encoding: 'utf8',
          cwd: cwd,
          timeout: 15000
        }).trim();

        actionResults.push(`Created issue: ${issueUrl}`);
      } catch (e) {
        actionResults.push(`Failed to create issue: ${issue.title}`);
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
        timeout: 15000
      });

      actionResults.push(`Added comment to issue #${issueNum}`);
    } catch (e) {
      actionResults.push(`Failed to comment on issue #${evalJson.issue_comment.active_issue}`);
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
      }
    } catch (e) {
      actionResults.push(`Failed to update project phase`);
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

  // Output to stderr for user to see in terminal
  console.error(formattedOutput);

  // Write to file for inject-context.cjs to read on next prompt
  // This ensures the main Claude session receives the context
  const outputPath = path.join(cwd, PHASE_EVAL_OUTPUT_PATH);
  try {
    const fileContent = {
      timestamp: new Date().toISOString(),
      elapsed_ms: elapsed,
      content: formattedOutput,
      raw: evalJson
    };
    fs.writeFileSync(outputPath, JSON.stringify(fileContent, null, 2));
    debugLog(`Output written to ${outputPath}`);
  } catch (e) {
    debugLog(`File write FAILED: ${e.message}`);
    // If we can't write the file, at least stderr was shown
  }

  process.exit(0);
}
