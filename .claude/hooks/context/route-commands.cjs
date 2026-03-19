#!/usr/bin/env node

/**
 * Command Routing Module
 *
 * Suggests commands based on user intent patterns.
 * Some commands auto-inject their workflow content.
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;

// Command routing patterns - match how Luis actually talks
// Skills map to design thinking phases: research → define → ideate → build → test → commit
const COMMAND_ROUTES = [
  // Research (UNDERSTAND) - entry point for substantive work
  {
    patterns: [
      /\blet'?s (start|begin|go|do this)\b/i,
      /\bnew (problem|task|challenge|issue)\b/i,
      /\bwhat (are|should) we (work on|do|tackle)\b/i,
      /\bwhat are we working on\b/i,
      /\bstart fresh\b/i,
      /\bwhere (do|should) (we|I) start\b/i,
      /\bkick (this |it )?off\b/i,
      /\b(tackle|approach) this (problem|issue|task)?\b/i,
      /\bwork on\s+(issue\s+)?#?\d+\b/i,
      /\blook into\b/i,
      /\binvestigat/i,
      /\bresearch\b/i,
      /\bexplore\b/i,
      /\bwhat'?s going on with\b/i
    ],
    command: '/research',
    reason: 'Starting work? /research loads context and guides you through understanding the problem before jumping to solutions.'
  },
  // Define (DEFINE) - precise problem definition
  {
    patterns: [
      /\bwhat (are|is) we actually (solving|fixing|doing)\b/i,
      /\bscope this\b/i,
      /\broot cause\b/i,
      /\bwhat'?s the (real|actual) problem\b/i,
      /\bnarrow (this |it )?down\b/i,
      /\bdefinition of done\b/i,
      /\bwhat does (done|success) look like\b/i,
      /\bwhat exactly\b/i
    ],
    command: '/define',
    reason: 'Time to get precise. /define separates symptoms from root causes and sets the Definition of Done.'
  },
  // Ideate (IDEATE) - generate and evaluate approaches
  {
    patterns: [
      /\bwhat are (our|the) options\b/i,
      /\bhow should (we|I)\b/i,
      /\bapproach(es)?\b/i,
      /\bwhat if\b/i,
      /\balternativ/i,
      /\bbrainstorm\b/i,
      /\btrade.?offs?\b/i,
      /\bpros (and|&) cons\b/i,
      /\bthis is (gonna be |going to be )?(big|complex|complicated)\b/i,
      /\bneed to (think through|figure out)\b/i,
      /\blet'?s (think through|break down)\b/i,
      /\bhow (do|should) (I|we) approach\b/i,
      /\bplan this out\b/i
    ],
    command: '/ideate',
    reason: 'Exploring options? /ideate generates genuinely different approaches and evaluates trade-offs before committing.'
  },
  // Build (PROTOTYPE) - make something concrete
  {
    patterns: [
      /\b(build|create|make|write|add|fix|update|change|modify)\s+(a|an|the|this|that|my)?\s*\w/i,
      /\blet'?s\s+(build|create|make|write|add|fix)\b/i,
      /\bi (want|need) to\s+(build|create|make|write|add|fix)\b/i,
      /\bcan you\s+(build|create|make|write|add|fix|help me)\b/i,
      /\bhelp me (build|create|make|write|add|fix)\b/i,
      /\bwrite\s+(a|some)?\s*(code|script|function|component)\b/i,
      /\bneed\s+(a|an)\s+(script|tool|app|component|function)\b/i,
      /\bimplement\b/i,
      /\bstart (coding|building)\b/i,
      /\bdraft (it|this|a)\b/i,
      /\bcode (it|this)\b/i
    ],
    command: '/build',
    reason: 'Ready to build? /build is the commitment point — creates a branch and makes something concrete.'
  },
  // Test (TEST) - verify against definition of done
  {
    patterns: [
      /\bdoes (it|this) work\b/i,
      /\btest (it|this)\b/i,
      /\bevaluate\b/i,
      /\bdid (it|we|this) (work|pass|succeed)\b/i,
      /\bcheck against\b/i,
      /\bvalidate\b/i,
      /\bmeet the (criteria|requirements|DoD)\b/i
    ],
    command: '/test',
    reason: 'Time to validate. /test checks work against the Definition of Done and decides if we iterate or ship.'
  },
  {
    patterns: [
      /\bexplain\b/i,
      /\bteach me\b/i,
      /\bhelp me understand\b/i,
      /\bhow (does|do|is|are|can|should)\b/i,
      /\bwhat (is|are|does)\b/i,
      /\bwhy (does|is|do|are)\b/i,
      /\bwalk me through\b/i,
      /\bbreak.*down\b/i,
      /\beli5\b/i,
      /\bi don'?t (understand|get)\b/i,
      /\bconfused about\b/i
    ],
    command: '/learn',
    reason: 'This looks like a learning question. /learn explains with analogies and foundations first.'
  },
  {
    patterns: [
      /\bcommit (this|these|it)\b/i,
      /\blet'?s commit\b/i,
      /\bdone with (these |this |the )?changes\b/i,
      /\bsave (these |this |the )?changes\b/i,
      /\bpush (this|these|it) up\b/i,
      /\bready to (commit|push|save)\b/i,
      /\bfinished (with )?(this|these|the) changes\b/i
    ],
    command: '/commit',
    reason: 'Ready to commit? /commit follows your version-control.md patterns.',
    injectWorkflow: true,
    workflowLoader: 'commit'
  },
  {
    patterns: [
      /\blook (this |it )?over\b/i,
      /\bcheck my work\b/i,
      /\breview (this|it|the code)\b/i,
      /\bis this (good|ok|right|correct)\b/i,
      /\bany (issues|problems|concerns)\b/i,
      /\bsanity check\b/i,
      /\bbefore I (push|merge|submit|pr)\b/i,
      /\bgive (this|it) a once.over\b/i,
      /\baudit\b/i,
      /\bcode review\b/i,
      /\bdoes this (look|seem) right\b/i,
      /\bquick (check|look)\b/i,
      /\bverify (this|it)\b/i
    ],
    command: '/audit',
    reason: 'Want a code review? /audit runs parallel agents for security, performance, tests, architecture.'
  },
  // Note: /add-feature patterns now handled by /ideate route above
  {
    patterns: [
      /\b(new|start a|starting a|create a) (project|repo|app|site)\b/i,
      /\bfrom scratch\b/i,
      /\bset (this|it) up\b/i,
      /\binitialize (this|the|a)\b/i,
      /\bstarting fresh\b/i,
      /\bnew (codebase|repository)\b/i,
      /\bkick off (a|the|this) project\b/i
    ],
    command: '/init-project',
    reason: 'Setting up a project? /init-project defines requirements, architecture, and design system.'
  },
  {
    patterns: [
      /\bwire (this|it) up\b/i,
      /\bget (this|it|everything) (set up|connected|working)\b/i,
      /\bmake sure everything'?s (connected|wired|working)\b/i,
      /\binstall (the )?(deps|dependencies|packages)\b/i,
      /\bset up the (stack|deps|dependencies)\b/i,
      /\bsync.?stack\b/i,
      /\bgenerate (the )?specs\b/i,
      /\bupdate (the )?specs\b/i
    ],
    command: '/sync-stack',
    reason: 'Need to wire the project? /sync-stack installs deps, verifies configs, generates specs.'
  },
  {
    patterns: [
      /\b(analyze|review) (the |my )?(sessions?|patterns?|learnings?)\b/i,
      /\bwhat (have I|have we|did I|did we) learn\b/i,
      /\bwhat patterns\b/i,
      /\bimprove (the |my )?system\b/i,
      /\bevaluate (how|what|the)\b/i,
      /\bwhat'?s (working|not working)\b/i,
      /\bwhat should (I |we )?(change|update|improve)\b/i,
      /\breflect\b/i,
      /\bclean ?up (the |my )?(learnings?|patterns?|brain|context)\b/i,
      /\bconsolidate\b/i,
      /\b(are|is) (the |my )?(learnings?|brain|context) (too big|large|bloated)\b/i
    ],
    command: '/analyze',
    reason: 'Analysis time? /analyze reads session data and identifies improvements.'
  },
  {
    patterns: [
      /\bhandoff\b/i,
      /\blet'?s handoff\b/i,
      /\bend session\b/i,
      /\bsave (the )?context\b/i,
      /\bi'?m done( for now)?\b/i,
      /\bwrapping up\b/i,
      /\bswitching context\b/i,
      /\bcall it (a day|here)\b/i,
      /\bpause (here|this)\b/i,
      /\bpick (this |it )?up later\b/i,
      /\bcontinue (this )?later\b/i,
      /\bsave (where we are|our place|progress)\b/i
    ],
    command: '/handoff',
    reason: 'Ending session? /handoff captures context so the next session can resume.',
    injectWorkflow: true,
    workflowLoader: 'handoff'
  }
];

/**
 * Load workflow content for auto-injection
 */
function loadWorkflow(workflowName) {
  const cwd = process.cwd();

  if (workflowName === 'handoff') {
    // Get the .claude/projects/ memory path for this workspace
    const { execSync } = require('child_process');
    let root = cwd;
    try {
      root = execSync('git rev-parse --show-toplevel', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd
      }).trim();
    } catch (e) {}
    const workspaceKey = '-' + root.replace(/\//g, '-').slice(1);
    const memoryDir = path.join(HOME, '.claude/projects', workspaceKey, 'memory');

    const today = new Date().toISOString().split('T')[0];

    return `[HANDOFF WORKFLOW - AUTO-LOADED]

**Memory path:** ${memoryDir}

---

**HANDOFF WORKFLOW:**

Save a project memory with the handoff context. This will be auto-loaded next session via MEMORY.md.

1. **Review the session:** What did we work on? What did we discover?

2. **Write handoff as a project memory** using the Write tool:

File: \`${memoryDir}/project_handoff.md\`

\`\`\`markdown
---
name: session-handoff
description: Handoff context from ${today} session
type: project
---

# Session Handoff - {Brief Title}

**Created:** ${today}
**Reason:** {Why handing off}

## What We Were Doing

{1-3 sentences: task/issue, where we are}

## What We Discovered

{Key decisions, problems solved, things that didn't work}

## Next Steps

{Clear actions for resuming}

## Related

{Links to issues, PRs, files}
\`\`\`

3. **Update MEMORY.md** to include a pointer to the handoff file.

4. **Confirm** what was captured.

**Keep it short.** Focus on what the next session needs to resume.`;
  }

  if (workflowName === 'commit') {
    const vcPath = path.join(cwd, '.claude/specs/config/version-control.md');
    let vcContent = '';
    try {
      vcContent = fs.readFileSync(vcPath, 'utf8');
    } catch {
      vcContent = 'No version-control.md found. Use conventional commits: type(scope): description';
    }

    return `[COMMIT WORKFLOW - AUTO-LOADED]

**Version Control Spec:**
${vcContent}

---

**WORKFLOW - Follow these steps:**

1. **Check status:**
   \`\`\`bash
   git status
   git diff --staged
   git diff
   \`\`\`

2. **Update documentation BEFORE committing:**
   - Find all .md files near changed files (same dir + parents)
   - Read each one
   - Update any that need it (CHANGELOG, README, etc.)
   - Report: \`[filepath]: [still accurate / updated: what changed]\`
   - Do NOT update CLAUDE.md (user-only file)

3. **Stage and commit:**
   - Use the commit format from version-control spec above
   - No Co-Authored-By for Claude

**Do not skip the documentation check.** This is the key differentiator.`;
  }

  return null;
}

/**
 * Check prompt for command routing
 * @param {string} prompt - User's prompt
 * @returns {{ content: string|null, command: string|null, workflowInjected: boolean }}
 */
function check(prompt) {
  for (const route of COMMAND_ROUTES) {
    const matches = route.patterns.some(pattern => pattern.test(prompt));

    if (matches) {

      // If workflow injection enabled, load and inject the full workflow
      if (route.injectWorkflow && route.workflowLoader) {
        const workflow = loadWorkflow(route.workflowLoader);
        if (workflow) {
          return {
            content: workflow,
            command: route.command,
            workflowInjected: true
          };
        }
      }

      // Otherwise, just suggest the command
      return {
        content: `[SUGGESTED COMMAND: ${route.command}]\n${route.reason}\n\nConsider using ${route.command} for this task. If the user wants to proceed differently, follow their lead.`,
        command: route.command,
        workflowInjected: false
      };
    }
  }

  return { content: null, command: null, workflowInjected: false };
}

module.exports = {
  COMMAND_ROUTES,
  loadWorkflow,
  check
};
