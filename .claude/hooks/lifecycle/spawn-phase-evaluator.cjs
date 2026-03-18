#!/usr/bin/env node

/**
 * Spawn Phase Evaluator Hook
 *
 * Event: PostToolUse (Bash with git commit)
 * Purpose: Spawns Phase Evaluator worker as a BACKGROUND process
 *
 * This hook is NON-BLOCKING. It:
 * 1. Gathers commit info and builds the prompt (fast)
 * 2. Writes input to a temp file
 * 3. Spawns phase-evaluator-worker.cjs as a detached background process
 * 4. Exits immediately - commit continues without waiting
 *
 * The worker handles:
 * - Running `claude -p` for evaluation
 * - Parsing response and executing actions
 * - Writing results to .claude/phase-evaluation.json
 * - Appending to .claude/phase-evaluation-history.jsonl
 *
 * Results are available on the next UserPromptSubmit via inject-context.cjs.
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const AGENT_INSTRUCTIONS_PATH = '.claude/agents/phase-evaluator.md';
const PROJECT_DEFINITION_PATH = '.claude/specs/project-definition.yaml';
const WORKER_PATH = '.claude/hooks/lifecycle/phase-evaluator-worker.cjs';

// Read stdin (hook input)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  const cwd = process.cwd();
  const debugPath = path.join(cwd, '.claude/phase-evaluator-debug.log');

  // Debug helper
  const debugLog = (msg) => {
    try {
      const timestamp = new Date().toISOString();
      fs.appendFileSync(debugPath, `[${timestamp}] [HOOK] ${msg}\n`);
    } catch (e) { /* ignore */ }
  };

  debugLog('Hook invoked');

  try {
    spawnPhaseEvaluator(cwd, debugPath, debugLog);
  } catch (e) {
    debugLog(`Hook error: ${e.message}`);
    process.exit(0);
  }
});

function spawnPhaseEvaluator(cwd, debugPath, debugLog) {
  const agentPath = path.join(cwd, AGENT_INSTRUCTIONS_PATH);
  const workerPath = path.join(cwd, WORKER_PATH);

  // Parse hook input
  let hookInput;
  try {
    hookInput = JSON.parse(input);
  } catch (e) {
    debugLog('Failed to parse input');
    process.exit(0);
  }

  // Verify this was a git commit
  const command = hookInput.tool_input?.command || '';
  if (!command.includes('git commit')) {
    debugLog('Not a git commit, skipping');
    process.exit(0);
  }

  // Check if agent instructions exist
  if (!fs.existsSync(agentPath)) {
    debugLog(`Agent instructions not found: ${agentPath}`);
    process.exit(0);
  }

  // Check if worker exists
  if (!fs.existsSync(workerPath)) {
    debugLog(`Worker not found: ${workerPath}`);
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

  // Read full project definition (not just phase)
  let projectDef = '';
  const projectDefPath = path.join(cwd, PROJECT_DEFINITION_PATH);
  if (fs.existsSync(projectDefPath)) {
    try {
      const yamlContent = fs.readFileSync(projectDefPath, 'utf8');
      projectDef = `\nPROJECT DEFINITION:\n${yamlContent}\n`;
    } catch (e) {
      // Ignore
    }
  }

  // Get open issues for context
  let openIssues = '';
  try {
    openIssues = execSync('gh issue list --state open --limit 10 --json number,title,labels 2>/dev/null || echo "[]"', {
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

  // Get recent evaluation history for trend detection
  let evalHistory = '';
  const historyPath = path.join(cwd, '.claude/phase-evaluation-history.jsonl');
  if (fs.existsSync(historyPath)) {
    try {
      const lines = fs.readFileSync(historyPath, 'utf8').trim().split('\n');
      const recent = lines.slice(-5); // Last 5 evaluations
      evalHistory = `\nRECENT EVALUATIONS (for trend detection):\n${recent.join('\n')}\n`;
    } catch (e) {
      // Ignore
    }
  }

  // Build the prompt for claude -p
  const prompt = `You are the Phase Evaluator. A commit was just made. Evaluate the project and take action.

WORKSPACE: ${cwd}
${commitInfo}
${projectDef}
${openIssues}
${evalHistory}

YOUR ROLE: Project-level strategic advisor. You:
- Evaluate project health and rhythm at the macro level
- Identify research needs, gaps, things to track
- Find relevant documentation and links
- Surface patterns the main session might miss
- Create GitHub issues for things that need attention

INSTRUCTIONS:
${instructions}

IMPORTANT: Use the context provided above as your primary source. You may also use tools to read additional files or check GitHub for more context if needed.

THEN output your findings as JSON.
Your JSON output MUST be the LAST thing you output, wrapped in a markdown code fence:

\`\`\`json
{ ... your evaluation ... }
\`\`\`

If you lack information for a field, use null or empty arrays.

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

  // Get commit hash for tracking
  let commitHash = null;
  try {
    commitHash = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      cwd: cwd,
      timeout: 5000
    }).trim();
  } catch (e) {
    // Ignore - commit hash is optional
  }

  // ============================================
  // SPAWN WORKER AS BACKGROUND PROCESS
  // ============================================

  // Write input to temp file for worker
  const inputFile = path.join(os.tmpdir(), `phase-eval-${Date.now()}.json`);
  const workerInput = {
    cwd,
    prompt,
    debugPath,
    commitHash
  };

  try {
    fs.writeFileSync(inputFile, JSON.stringify(workerInput));
    debugLog(`Wrote worker input to ${inputFile}`);
  } catch (e) {
    debugLog(`Failed to write worker input: ${e.message}`);
    process.exit(0);
  }

  // Spawn worker as detached process
  // This runs in the background - hook exits immediately
  try {
    const worker = spawn('node', [workerPath, inputFile], {
      detached: true,
      stdio: 'ignore',
      cwd: cwd,
      env: { ...process.env }
    });

    // Unreference to allow hook to exit
    worker.unref();

    debugLog(`Spawned worker (PID: ${worker.pid})`);
    console.error('[PHASE EVALUATOR] Running in background...');
  } catch (e) {
    debugLog(`Failed to spawn worker: ${e.message}`);
    // Clean up input file
    try { fs.unlinkSync(inputFile); } catch (e) { /* ignore */ }
  }

  // Exit immediately - don't block the commit
  process.exit(0);
}
