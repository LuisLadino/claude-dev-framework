#!/usr/bin/env node

/**
 * Inject Context Hook
 *
 * Event: UserPromptSubmit
 * Purpose: Auto-injects relevant context and command suggestions
 *
 * Does two things:
 * 1. Injects relevant specs based on keywords
 * 2. Suggests slash commands for common task patterns
 */

const fs = require('fs');
const path = require('path');

// Command routing - suggest commands based on intent
// Patterns should match how Luis actually talks, not formal language
const COMMAND_ROUTES = [
  {
    patterns: [
      // Natural coding requests
      /\b(build|create|make|write|add|fix|update|change|modify)\s+(a|an|the|this|that|my)?\s*\w/i,
      /\blet'?s\s+(build|create|make|write|add|fix|work on)\b/i,
      /\bi (want|need) to\s+(build|create|make|write|add|fix)\b/i,
      /\bcan you\s+(build|create|make|write|add|fix|help me)\b/i,
      /\bhelp me (build|create|make|write|add|fix)\b/i,
      // App/script/tool creation
      /\b(python|node|typescript|react|astro)\s+(app|script|tool|site|project)\b/i,
      /\bwrite\s+(a|some)?\s*(code|script|function|component)\b/i,
      /\bneed\s+(a|an)\s+(script|tool|app|component|function)\b/i,
      // Task-oriented
      /\bwork on\b/i,
      /\bimplement\b/i,
      /\bstart (coding|building|working)\b/i
    ],
    command: '/start-task',
    reason: 'This looks like a coding task. /start-task loads your specs and enforces patterns.'
  },
  {
    patterns: [
      // Learning/understanding
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
      // Natural commit phrases
      /\bcommit (this|these|it)\b/i,
      /\blet'?s commit\b/i,
      /\bdone with (these |this |the )?changes\b/i,
      /\bsave (these |this |the )?changes\b/i,
      /\bpush (this|these|it) up\b/i,
      /\bready to (commit|push|save)\b/i,
      /\bfinished (with )?(this|these|the) changes\b/i
    ],
    command: '/commit',
    reason: 'Ready to commit? /commit follows your version-control.md patterns.'
  },
  {
    patterns: [
      // Natural review phrases
      /\blook (this |it )?over\b/i,
      /\bcheck my work\b/i,
      /\breview (this|it|the code)\b/i,
      /\bis this (good|ok|right|correct)\b/i,
      /\bany (issues|problems|concerns)\b/i,
      /\bsanity check\b/i,
      /\bbefore I (push|merge|submit|pr)\b/i,
      /\bgive (this|it) a once.over\b/i,
      /\baudit\b/i,
      /\bcode review\b/i
    ],
    command: '/audit',
    reason: 'Want a code review? /audit runs parallel agents for security, performance, tests, architecture.'
  },
  {
    patterns: [
      // Quick validation phrases
      /\bdoes this (look|seem) right\b/i,
      /\bam I doing this right\b/i,
      /\bquick (check|look)\b/i,
      /\bis this (following|matching) the patterns\b/i,
      /\bverify (this|it)\b/i,
      /\bdid I do this (right|correctly)\b/i
    ],
    command: '/verify',
    reason: 'Quick validation? /verify checks code against your specs.'
  },
  {
    patterns: [
      // Planning/complex feature phrases
      /\bthis is (gonna be |going to be )?(big|complex|complicated)\b/i,
      /\bneed to (plan|think through|figure out)\b/i,
      /\blet'?s (plan|think through|break down)\b/i,
      /\bbreak (this|it) down\b/i,
      /\bhow should (I|we) approach\b/i,
      /\bwhere do (I|we) start\b/i,
      /\blot of (parts|pieces|steps)\b/i,
      /\bmulti.?step\b/i,
      /\bplan this out\b/i
    ],
    command: '/add-feature',
    reason: 'Complex feature? /add-feature creates a PRD and breaks it into tasks.'
  },
  {
    patterns: [
      // New project phrases
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
      // Wiring/setup phrases
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
      // Session end/save phrases
      /\bsave (where we'?re at|progress|this)\b/i,
      /\b(gonna |going to )?(take a break|stop here|pause)\b/i,
      /\bwrap (this |it )?up\b/i,
      /\bbefore I (go|leave|stop)\b/i,
      /\blet'?s (pause|stop) here\b/i,
      /\bending (the |this )?session\b/i,
      /\bcheckpoint\b/i,
      /\bpicking this up later\b/i,
      /\bcontinue (this )?later\b/i,
      /\bthat'?s (it |all )?for (now|today)\b/i
    ],
    command: '/checkpoint',
    reason: 'Saving context? /checkpoint writes session state to brain files.'
  },
  {
    patterns: [
      // Analysis/improvement phrases
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
    command: '/reflect',
    reason: 'Analysis time? /reflect reads session data and identifies improvements.'
  }
];

// Reasoning checkpoints - inject reminders about how to approach tasks
// Only fires if no command was suggested (to avoid noise)
const REASONING_CHECKPOINTS = [
  {
    patterns: [
      /how (does|should|do|can|would).*work/i,
      /what'?s the (best|right|correct|proper) way/i,
      /is (this|that|it) (correct|right|the right way)/i,
      /best practice/i
    ],
    reminder: 'LOOK IT UP: Check context7 or official docs before answering. Don\'t guess at best practices.'
  },
  {
    patterns: [
      /should (I|we) (use|build|create|make|write)/i,
      /which (approach|pattern|tool|library|framework)/i,
      /(what|which) (should|would) (I|we) use/i,
      /between X and Y/i,
      /vs\b/i
    ],
    reminder: 'COMPARE OPTIONS: Look up both approaches. Check what the official docs recommend.'
  },
  {
    patterns: [
      /I need to (build|create|make|write) (a|an|the|my)/i,
      /let me (build|create|make|write) (a|an|the|my)/i,
      /going to (build|create|make|write)/i
    ],
    reminder: 'EXISTING TOOLS FIRST: Before building, check if a library or tool already does this.'
  },
  {
    patterns: [
      /I think (it|this|that) (works|does|is)/i,
      /I believe/i,
      /pretty sure/i,
      /I assume/i,
      /probably (works|does|is)/i
    ],
    reminder: 'VERIFY: Don\'t assume. Read the code or docs to confirm before stating as fact.'
  },
  {
    patterns: [
      /why (isn\'t|isn\'t|doesn\'t|won\'t|can\'t)/i,
      /not working/i,
      /getting (an |this )?error/i,
      /broken/i,
      /bug/i
    ],
    reminder: 'ROOT CAUSE: Read the actual error and code. Don\'t guess at fixes. Understand the problem first.'
  },
  {
    patterns: [
      /how do (I|we|you) (use|implement|set up|configure)/i,
      /how to (use|implement|set up|configure)/i,
      /can you show me how/i
    ],
    reminder: 'CHECK DOCS: Use context7 to get current documentation and examples. Patterns change between versions.'
  }
];

// Content writing detection - inject voice profile when writing for Luis
const CONTENT_WRITING_PATTERNS = [
  // Direct content requests
  /\b(write|draft|create|compose) (a |an |the |my |some )?(article|post|blog|email|message|bio|copy|content|text|description|about|intro|summary)\b/i,
  /\b(write|draft) (this |that |it )?(for me|in my voice)\b/i,
  // Site content
  /\b(portfolio|site|website|page) (content|copy|text)\b/i,
  /\b(home ?page|about page|landing page)\b/i,
  // Specific content types
  /\bcase study\b/i,
  /\bcover letter\b/i,
  /\bresume\b/i,
  /\blinkedin\b/i,
  /\btweet|thread|post\b/i,
  // Articles for sites
  /\barticle (about|on|for)\b/i,
  /\bblog post\b/i,
  // Implicit content
  /\bwrite (up|out)\b/i,
  /\bput (this |it )?into words\b/i,
  /\bhow (should|would) (I|this) (say|phrase|word)\b/i
];

const HOME = process.env.HOME || process.env.USERPROFILE;
const VOICE_PROFILE_PATH = path.join(HOME, '.gemini/antigravity/brain/voice-profile.md');

const {
  findWorkspaceBrain,
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.js');

function loadVoiceProfile() {
  try {
    return fs.readFileSync(VOICE_PROFILE_PATH, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Log what inject-context.js does for observability
 * This lets us verify the system is actually working
 */
function logInjection(sessionId, actions) {
  try {
    const cwd = process.cwd();
    const brainPath = findWorkspaceBrain(cwd);
    const tracking = loadSessionTracking(brainPath, sessionId);

    if (!tracking.injections) {
      tracking.injections = [];
    }

    tracking.injections.push({
      timestamp: new Date().toISOString(),
      ...actions
    });

    saveSessionTracking(brainPath, sessionId, tracking);
  } catch (e) {
    // Don't fail the hook if logging fails
  }
}

const CONTEXT_TRIGGERS = [
  {
    patterns: [/style/i, /design/i, /color/i, /typography/i, /ui\b/i, /component/i, /tailwind/i],
    specFile: '.claude/specs/design/design-system.md',
    label: 'Design System'
  },
  {
    patterns: [/test/i, /spec\b/i, /jest/i, /vitest/i, /coverage/i],
    specFile: '.claude/specs/config/testing.md',
    label: 'Testing Specs'
  },
  {
    patterns: [/structure/i, /architecture/i, /folder/i, /directory/i, /where.*put/i, /organize/i],
    specFile: '.claude/specs/architecture/project-structure.md',
    label: 'Project Structure'
  },
  {
    patterns: [/commit/i, /git\b/i, /branch/i, /push/i, /merge/i],
    specFile: '.claude/specs/config/version-control.md',
    label: 'Version Control'
  },
  {
    patterns: [/deploy/i, /production/i, /build\b/i, /release/i],
    specFile: '.claude/specs/config/deployment.md',
    label: 'Deployment'
  },
  {
    patterns: [/what.*changed/i, /files.*modified/i, /this session/i, /what.*done/i],
    specFile: '.claude/session-changes.json',
    label: 'Session Changes',
    isJson: true
  }
];

function readSpecFile(filePath, isJson = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (isJson) {
      const data = JSON.parse(content);
      return formatSessionChanges(data);
    }
    return content;
  } catch {
    return null;
  }
}

function formatSessionChanges(data) {
  const lines = ['## Session Changes'];

  if (data.filesModified?.length > 0) {
    lines.push('\n### Files Modified');
    data.filesModified.forEach(f => lines.push(`- ${f}`));
  }

  if (data.filesCreated?.length > 0) {
    lines.push('\n### Files Created');
    data.filesCreated.forEach(f => lines.push(`- ${f}`));
  }

  if (data.commands?.length > 0) {
    lines.push(`\n### Commands Run: ${data.commands.length}`);
    // Show last 5 commands
    const recent = data.commands.slice(-5);
    recent.forEach(c => lines.push(`- ${c.command.substring(0, 60)}${c.command.length > 60 ? '...' : ''}`));
  }

  return lines.join('\n');
}

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    handleHook(data);
  } catch (e) {
    process.exit(0);
  }
});

function handleHook(data) {
  const { prompt, session_id } = data;

  if (!prompt) {
    process.exit(0);
  }

  const contextParts = [];
  let commandSuggested = null;
  let reasoningCheckpoints = [];
  let voiceProfileLoaded = false;
  let specsLoaded = [];

  // Check for command routing first
  for (const route of COMMAND_ROUTES) {
    const matches = route.patterns.some(pattern => pattern.test(prompt));

    if (matches) {
      contextParts.push(`[SUGGESTED COMMAND: ${route.command}]\n${route.reason}\n\nConsider using ${route.command} for this task. If the user wants to proceed differently, follow their lead.`);
      commandSuggested = route.command;
      break; // Only suggest one command
    }
  }

  // Check reasoning checkpoints (only if no command suggested)
  // Commands already guide the workflow; checkpoints fill the gaps
  if (!commandSuggested) {
    const reminders = [];
    for (const checkpoint of REASONING_CHECKPOINTS) {
      const matches = checkpoint.patterns.some(pattern => pattern.test(prompt));
      if (matches) {
        reminders.push(checkpoint.reminder);
      }
    }
    // Dedupe and limit to 2 reminders max (avoid noise)
    reasoningCheckpoints = [...new Set(reminders)].slice(0, 2);
    if (reasoningCheckpoints.length > 0) {
      contextParts.push(`[REASONING CHECKPOINT]\n${reasoningCheckpoints.join('\n')}`);
    }
  }

  // Check for content writing - inject voice profile
  const isContentWriting = CONTENT_WRITING_PATTERNS.some(pattern => pattern.test(prompt));
  if (isContentWriting) {
    const voiceProfile = loadVoiceProfile();
    if (voiceProfile) {
      voiceProfileLoaded = true;
      contextParts.push(`[VOICE PROFILE - WRITE AS LUIS]\n\nYou are writing content that will be published as Luis's voice. Follow this profile EXACTLY:\n\n${voiceProfile}`);
    } else {
      // Fallback if file not found - inject key rules
      voiceProfileLoaded = 'fallback';
      contextParts.push(`[VOICE PROFILE - WRITE AS LUIS]\n
You are writing content that will be published as Luis's voice.

KEY RULES:
- NO em dashes (—). Use periods or colons.
- NO corporate speak: leverage, synergize, passionate, utilize, ensure
- NO filler: "solid", "comprehensive", "well-structured"
- NO scaffolding: "Here's what I found:", "Let me explain:"
- USE contractions: doesn't, won't, I've
- USE short sentences. Active voice. Specific examples.
- USE varied sentence length. Mix short and medium.
- SOUND human, not AI. Read it out loud. If it sounds like LinkedIn, rewrite.

Would Luis actually say this? If not, rewrite.`);
    }
  }

  // Check each context trigger
  for (const trigger of CONTEXT_TRIGGERS) {
    const matches = trigger.patterns.some(pattern => pattern.test(prompt));

    if (matches) {
      const content = readSpecFile(trigger.specFile, trigger.isJson);
      if (content) {
        specsLoaded.push(trigger.label);
        contextParts.push(`[Auto-loaded: ${trigger.label}]\n${content}`);
      }
    }
  }

  // Log what we did for observability
  // Only log if we actually did something
  if (contextParts.length > 0) {
    const actions = {
      promptSnippet: prompt.slice(0, 80) + (prompt.length > 80 ? '...' : '')
    };
    if (commandSuggested) actions.commandSuggested = commandSuggested;
    if (reasoningCheckpoints.length > 0) actions.reasoningCheckpoints = reasoningCheckpoints.length;
    if (voiceProfileLoaded) actions.voiceProfileLoaded = voiceProfileLoaded;
    if (specsLoaded.length > 0) actions.specsLoaded = specsLoaded;

    logInjection(session_id, actions);
  }

  // If we have context to inject, output it
  if (contextParts.length > 0) {
    const output = {
      additionalContext: contextParts.join('\n\n---\n\n')
    };
    console.log(JSON.stringify(output));
  }

  process.exit(0);
}
