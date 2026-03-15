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
    reason: 'Ready to commit? /commit follows your version-control.md patterns.',
    // Instead of just suggesting, inject the workflow
    injectWorkflow: true,
    workflowLoader: 'commit'
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
      /\bcode review\b/i,
      // Quick validation (merged from /verify)
      /\bdoes this (look|seem) right\b/i,
      /\bquick (check|look)\b/i,
      /\bverify (this|it)\b/i
    ],
    command: '/audit',
    reason: 'Want a code review? /audit runs parallel agents for security, performance, tests, architecture.'
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
    command: '/analyze',
    reason: 'Analysis time? /analyze reads session data and identifies improvements.'
  },
  {
    patterns: [
      // Session ending phrases
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
  },
  {
    patterns: [
      /context7/i,
      /look up.*(docs|documentation)/i,
      /check.*(docs|documentation)/i,
      /\/(astro|react|next|tailwind|typescript)/i
    ],
    reminder: 'CONTEXT7: Use direct library IDs instead of resolve-library-id. Common IDs: /withastro/astro, /facebook/react, /vercel/next.js, /tailwindlabs/tailwindcss, /microsoft/typescript, /motiondivision/motion'
  }
];

// Methodology enforcement - reinforce teaching mode based on context
// These fire IN ADDITION to reasoning checkpoints (complementary)
// ORDER MATTERS: More specific patterns first, generic teaching modes last
// Career/professional first (most specific), then CPMAI, then general teaching
const METHODOLOGY_ENFORCEMENT = [
  // CAREER/PROFESSIONAL CONTEXT FIRST (very specific, should win over generic)
  {
    patterns: [
      /\b(resume|cv|cover letter|job|interview|application)\b/i,
      /\b(hire|hiring|recruiter|employer|company)\b/i,
      /\b(portfolio|case study|work sample)\b/i,
      /\b(linkedin|profile|bio)\b/i,
      /\b(cmu|tepper|msba|mba|graduate|school)\b/i,
      /\b(career|professional|experience|background)\b/i,
      /\bhow (do|should) I (present|show|demonstrate|position)\b/i
    ],
    reminder: `[CONTEXT: CAREER/PROFESSIONAL]
Goal: AI product roles (PM, product analyst)

In progress:
- AI data annotation contract work (Handshake, Mercor)
- CMU Tepper Part-Time MSBA application (Fall 2026)
- Building portfolio that demonstrates design thinking + AI fluency

Key narrative: Design thinker who applies structured problem-solving. The methodology transfers; contexts change.
What to emphasize: UX research foundations → AI evaluation → PM fluency`
  },
  // CPMAI DOMAINS (specific AI project management contexts)
  {
    patterns: [
      // CPMAI Domain 1: Responsible AI - expanded
      /\b(bias|fairness|ethic|transparent|accountab|audit|compliance|regulat)\b/i,
      /\b(responsible|trustworthy) ai\b/i,
      /\b(safe|safety|harm|risk|danger)\b.*\b(ai|model|system)\b/i,
      /\b(ai|model|system)\b.*\b(safe|safety|harm|risk|danger)\b/i,
      /\bwhat could go wrong\b/i,
      /\b(discriminat|unfair|harmful output)\b/i
    ],
    reminder: `[CPMAI: RESPONSIBLE AI - Domain 1 (15%)]
- Bias assessment: Check models, data, AND algorithms
- Transparency: Can you explain data and algorithm selection?
- Compliance: What regulations apply? Document audit trails.
- Privacy/security: How is data protected?

The CPMAI question: "Would this pass an AI ethics review?"`
  },
  {
    patterns: [
      // CPMAI Domain 2: Business Needs - expanded
      /\b(feasib|roi|business case|success metric|kpi|stakeholder persona)\b/i,
      /\bshould (we|I) (use|build|implement) ai\b/i,
      /\bis ai (the right|necessary|needed)\b/i,
      /\bai (solution|project|initiative)\b/i,
      /\b(worth|value|cost|benefit|investment)\b.*\b(ai|model|ml)\b/i,
      /\bwhy (ai|ml|machine learning)\b/i,
      /\bwhat problem (does|is|are|will)\b/i,
      /\b(measure|track|prove) (success|value|impact)\b/i,
      /\bwill this (work|help|solve)\b/i
    ],
    reminder: `[CPMAI: BUSINESS NEEDS - Domain 2 (26%)]
- Problem assessment: Does AI actually solve this?
- Feasibility: Technical and organizational readiness?
- ROI: What's the business value vs cost?
- Success metrics: How will we know it worked?

The CPMAI question: "Is AI the right solution, or are we assuming it?"`
  },
  {
    patterns: [
      // CPMAI Domain 3: Data Needs - expanded
      /\b(data quality|data requirement|data source|data infrastructure|data compliance)\b/i,
      /\b(training data|dataset|data pipeline|data access)\b/i,
      /\bdo we have (the |enough )?data\b/i,
      /\b(where|what|how).*(data|dataset|training)\b/i,
      /\b(collect|gather|source|acquire) (the )?data\b/i,
      /\b(clean|label|annotate|prepare) (the )?(data|dataset)\b/i,
      /\bdata (is|are|looks|seems) (good|bad|dirty|clean|ready)\b/i,
      /\b(representative|balanced|biased) (data|dataset|sample)\b/i
    ],
    reminder: `[CPMAI: DATA NEEDS - Domain 3 (26%)]
- Requirements: What data do we actually need?
- Sources: Where does it come from? Access permissions?
- Quality: Is it accurate, complete, representative?
- Compliance: Privacy, consent, retention policies?

The CPMAI question: "Does our data meet solution requirements?"`
  },
  {
    patterns: [
      // CPMAI Domain 4: Model Development & Evaluation - expanded
      /\b(model (select|evaluat|valid|train|develop))/i,
      /\b(qa.?qc|quality assurance|model performance|accuracy|precision|recall|f1)\b/i,
      /\bwhich model (should|to use)\b/i,
      /\b(baseline|benchmark|ground truth)\b/i,
      /\bhow (good|well|accurate) (is|does)\b/i,
      /\b(compare|versus|vs) (models|approaches)\b/i,
      /\b(test|evaluate|assess|measure) (the |this )?(model|output|results)\b/i,
      /\bis (this|the|it) (working|good enough|ready)\b/i,
      /\b(improve|better|optimize) (the |this )?(model|performance|results)\b/i
    ],
    reminder: `[CPMAI: MODEL DEV & EVAL - Domain 4 (16%)]
- Technique selection: Why this model approach?
- QA/QC: How are we validating quality?
- Evaluation metrics: What are we actually measuring?
- Deployment readiness: Does data quality support deployment?

The CPMAI question: "How do we know this model is ready?"`
  },
  {
    patterns: [
      // CPMAI Domain 5: Operationalization - expanded
      /\b(mlops|model governance|monitor|drift|maintenance)\b/i,
      /\b(operationalize|productionize|roll.?out)\b/i,
      /\bafter (we |it )?(deploy|launch|ship)/i,
      /\bin production\b/i,
      /\b(deploy|ship|release|launch) (the |this )?(model|system|ai)\b/i,
      /\bwhat happens (after|when|if)\b/i,
      /\b(keep|maintain|update|refresh) (the |this )?(model|system)\b/i,
      /\b(degrade|decay|stale|outdated)\b/i,
      /\blong.?term\b/i
    ],
    reminder: `[CPMAI: OPERATIONALIZATION - Domain 5 (17%)]
- Deployment: What's the rollout plan?
- Governance: Who owns this model in production?
- Monitoring: How do we detect drift/degradation?
- Contingency: What if it fails?

The CPMAI question: "What's the plan for day 2 and beyond?"`
  },
  // GENERAL AI TECHNICAL (after CPMAI specifics)
  {
    patterns: [
      // AI/ML technical topics - expanded
      /\b(llm|gpt|claude|transformer|attention|embedding|rag|fine.?tun|rlhf|alignment|hallucination|inference)\b/i,
      /\b(machine learning|deep learning|neural)\b/i,
      /\b(vector|semantic|retrieval|generation|token)\b/i,
      /\b(prompt|context window|temperature|top.?p)\b/i,
      /\b(agent|tool use|function call|chain.?of.?thought)\b/i,
      /\bhow (does|do) (llm|gpt|claude|model|ai)\b/i,
      /\bwhy (does|do) (llm|gpt|claude|model|ai)\b/i,
      /\b(pretraining|pretrain|sft|supervised fine.?tun)\b/i,
      /\b(red team|jailbreak|prompt injection|adversarial)\b/i
    ],
    reminder: `[TEACHING MODE: AI TECHNICAL FLUENCY]
Explain HOW it works, not just WHAT it does.
- Mechanisms: Why does this happen? What's the underlying process?
- Failure modes: How can this break? What are the edge cases?
- Trade-offs: What are the costs of this approach?
- How to use it: When would you say this term? Formal vs casual. Example sentences.

Don't say "RAG helps with hallucinations."
Say "RAG reduces hallucination by grounding generation in retrieved context. The model relies less on parametric memory. But retrieval quality matters - garbage in, garbage out."
Usage: In a technical interview you'd say "we use RAG to ground generation." In a standup: "the retrieval step is slow."`
  },
  {
    patterns: [
      // Coding/building - expanded
      /\b(error|exception|bug|issue|problem)\s*(handling|recovery|catching|fix)\b/i,
      /\b(add|implement|write|create)\s+(a |an |the )?(function|component|handler|service|endpoint)\b/i,
      /\bvalidat(e|ion|ing)\b/i,
      /\brefactor/i,
      /\b(debug|fix|solve|resolve) (this|the|a)\b/i,
      /\bhow (should|do) (I|we) (handle|deal with|manage)\b/i,
      /\b(build|create|make|write) (this|it|a|the)\b/i,
      /\bwhat'?s the (pattern|approach|way) (for|to)\b/i
    ],
    reminder: `[TEACHING MODE: DISCIPLINE FRAMING]
Name the concept and connect to disciplines:
- What's this called in UX/PM/AI terms?
- How does it fit the design thinking cycle?
- What's the PM question (is this worth the investment)?
- How to use it: When would you say this term? Example sentences a practitioner would say.

"This is defensive design (UX) - anticipating errors. Nielsen's heuristic #9."
Usage: In a design review: "we need more defensive design here." In a PR: "added input validation - defensive design."`
  },
  {
    patterns: [
      // Planning/prioritization - expanded
      /\b(priorit|roadmap|scope|requirement|stakeholder|tradeoff|trade-off)/i,
      /\bwhich (one|approach|option|way)\b/i,
      /\b(plan|strategy|decision) (for|about|on)\b/i,
      /\bwhat (should|do) (I|we) (do|focus|work on) (first|next)\b/i,
      /\b(important|urgent|critical|blocker)\b/i,
      /\b(or|versus) (should|do) (I|we)\b/i,
      /\b(choose|decide|pick) (between|which)\b/i,
      /\bwhat matters (most|more)\b/i
    ],
    reminder: `[TEACHING MODE: PM FRAMEWORKS]
Make the framework visible:
- Name the prioritization approach (RICE, MoSCoW, impact/effort)
- Surface trade-offs explicitly
- What would a PM ask here?
- How to use it: When would you say this term? Example sentences.

The PM skill is making decisions transparent so stakeholders understand trade-offs.
Usage: In planning: "let's RICE score these." In a 1:1: "the impact/effort doesn't justify this." In a stakeholder meeting: "here's how we prioritized."`
  },
  {
    patterns: [
      // Research/investigation - expanded
      /\b(understand|investigate|research|explore|figure out|look into)\b/i,
      /\bwhy (does|is|do|are|did|was|isn't|doesn't)\b/i,
      /\bwhat('s| is) (happening|going on|wrong|the issue|causing)\b/i,
      /\bhelp me (understand|figure out|see|grasp)\b/i,
      /\bi (don't|do not) (understand|get|see)\b/i,
      /\b(confused|unclear|lost)\b/i,
      /\bwalk me through\b/i,
      /\bwhat (am I|are we) missing\b/i
    ],
    reminder: `[METHODOLOGY: DESIGN THINKING]
Start with Understand:
- What's actually happening? What are the constraints?
- Define precisely. Not symptoms, root causes.
- Research before acting. Read the code/docs first.

The check: "Would a PM with UX foundations and AI technical fluency approach it this way?"`
  },
  // (Career/professional moved to top of array for priority)
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

// Capture trigger - persist ideas/insights to brain files
// User says "capture this" or "capture: [idea]" and it gets saved
const CAPTURE_PATTERNS = [
  /\bcapture[:\s]+this\b/i,           // "capture this" or "capture: this"
  /\bcapture[:\s]+that\b/i,           // "capture that"
  /\bcapture[:\s]+(.{10,})/i,         // "capture: [explicit content]" (min 10 chars)
  /\bremember this\b/i,               // "remember this"
  /\bsave this (idea|thought|insight|decision|pattern)\b/i,
  /\bnote this down\b/i,              // "note this down"
  /\bpersist this\b/i,                // "persist this"
  /\bkeep this\b/i,                   // "keep this"
  /\bdon'?t forget (this|that)\b/i    // "don't forget this"
];

// Keywords to determine which brain file to write to
// Only routes to existing files - no new file types
const CAPTURE_ROUTING = {
  decision: 'decisions.md',
  pattern: 'patterns.md',
  learning: 'learnings.md'
  // Default (no keyword match) = Claude decides based on content
};

// Ideation/drafting detection - inject identity + voice BEFORE writing starts
const IDEATION_PATTERNS = [
  // Brainstorming
  /\b(brainstorm|ideate|ideas for|concepts for)\b/i,
  /\blet'?s (think about|explore|figure out)\b/i,
  /\bwhat (should|could) (I|we|this) (say|include|cover|show|demonstrate)\b/i,
  // Page/content planning
  /\b(page|section|narrative|story|message) (for|about|structure|outline)\b/i,
  /\bhow (should|do) (I|we) (present|position|frame|tell)\b/i,
  /\bwhat'?s the (story|narrative|angle|message)\b/i,
  // Portfolio/professional content
  /\b(portfolio|case study|project page)\b/i,
  /\b(showcase|demonstrate|highlight|feature) (my|this)\b/i,
  /\bhow do I (show|demonstrate|prove|convey)\b/i,
  // Drafting phases
  /\b(draft|outline|sketch out|rough out|v1|first pass)\b/i,
  /\bwork on (the |my )?(content|copy|page|narrative)\b/i,
  // Strategy/positioning
  /\bhow (should|do) (I|we) (approach|structure|organize)\b/i,
  /\bwhat (tone|angle|approach)\b/i,
  /\bwho is the audience\b/i
];

const HOME = process.env.HOME || process.env.USERPROFILE;
const VOICE_PROFILE_PATH = path.join(HOME, '.gemini/antigravity/brain/voice-profile.md');
const IDENTITY_PATH = path.join(HOME, 'Repositories/Personal/my-brain/CLAUDE.md');
const PHASE_EVAL_PATH = '.claude/phase-evaluation.json'; // Written by Phase Evaluator hook

const {
  getSessionId,
  loadSessionTracking,
  saveSessionTracking
} = require('../lib/session-utils.cjs');

function loadVoiceProfile() {
  try {
    return fs.readFileSync(VOICE_PROFILE_PATH, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Check for Phase Evaluation output from last commit
 * Written by spawn-phase-evaluator.cjs, consumed here, then deleted
 * This ensures the main Claude session receives strategic context
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
      // Stale evaluation - delete and skip
      fs.unlinkSync(evalPath);
      return null;
    }

    // Delete the file after reading (consume it)
    fs.unlinkSync(evalPath);

    return data.content;
  } catch {
    // If anything fails, try to clean up
    try { fs.unlinkSync(evalPath); } catch {}
    return null;
  }
}

/**
 * Load workflow content for auto-injection
 * Instead of suggesting /commit, inject the actual workflow
 */
function loadWorkflow(workflowName) {
  const cwd = process.cwd();

  if (workflowName === 'handoff') {
    // Find brain path for this workspace
    const brainDir = path.join(HOME, '.gemini/antigravity/brain');
    let brainPath = brainDir; // fallback

    // Try to find the workspace-specific brain folder
    try {
      const sessions = fs.readdirSync(brainDir).filter(f => {
        const fullPath = path.join(brainDir, f);
        return fs.statSync(fullPath).isDirectory() && f !== 'tempmediaStorage' && f !== 'tracking';
      });

      for (const uuid of sessions) {
        const statePath = path.join(brainDir, uuid, 'session_state.json');
        if (fs.existsSync(statePath)) {
          try {
            const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
            const workspacePath = (state.workspace || '').split(' -> ')[0];
            if (workspacePath === cwd || cwd.startsWith(workspacePath)) {
              brainPath = path.join(brainDir, uuid);
              break;
            }
          } catch {}
        }
      }
    } catch {}

    const today = new Date().toISOString().split('T')[0];

    return `[HANDOFF WORKFLOW - AUTO-LOADED]

**Brain path:** ${brainPath}
**Output file:** ${brainPath}/handoff.md

---

**HANDOFF WORKFLOW:**

1. **Review the session:** What did we work on? What did we discover?

2. **Write handoff.md** (use cat with heredoc):

\`\`\`bash
cat > "${brainPath}/handoff.md" << 'EOF'
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
EOF
\`\`\`

3. **Confirm** what was captured.

**Keep it short.** Focus on what the next session needs to resume.`;
  }

  if (workflowName === 'commit') {
    // Load version-control.md
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
 * Load identity context for ideation
 * Extracts: who Luis is, his goals, what he's trying to demonstrate
 */
function loadIdentityContext() {
  try {
    const content = fs.readFileSync(IDENTITY_PATH, 'utf8');

    const sections = [];

    // Extract key sections for ideation context
    const summaryMatch = content.match(/Design thinker[^\n]+/);
    if (summaryMatch) {
      sections.push(`**Who:** ${summaryMatch[0].trim()}`);
    }

    const currentMatch = content.match(/\*\*Current work:\*\*([^\n]+)/);
    if (currentMatch) {
      sections.push(`**Current work:** ${currentMatch[1].trim()}`);
    }

    // Extract "In progress:" (current activities)
    const inProgressSection = content.match(/\*\*In progress:\*\*\n([\s\S]*?)\n\n/);
    if (inProgressSection) {
      const items = inProgressSection[1]
        .split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => line.trim())
        .slice(0, 5);
      if (items.length > 0) {
        sections.push(`**In progress:**\n${items.join('\n')}`);
      }
    }

    // Extract "Target direction:" (actual goals)
    const targetMatch = content.match(/\*\*Target direction:\*\*([^\n]+)/);
    if (targetMatch) {
      sections.push(`**Goal:** ${targetMatch[1].trim()}`);
    }

    const approachMatch = content.match(/\*\*Approach:\*\*([^\n]+)/);
    if (approachMatch) {
      sections.push(`**Approach:** ${approachMatch[1].trim()}`);
    }

    const valuesSection = content.match(/\*\*Values:\*\*\n([\s\S]*?)\n\n\*\*Mindset/);
    if (valuesSection) {
      const values = valuesSection[1]
        .split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').split(':')[0].trim());
      if (values.length > 0) {
        sections.push(`**Values:** ${values.join(', ')}`);
      }
    }

    if (sections.length === 0) return null;

    return sections.join('\n\n');
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
    const tracking = loadSessionTracking(sessionId);

    if (!tracking.injections) {
      tracking.injections = [];
    }

    tracking.injections.push({
      timestamp: new Date().toISOString(),
      ...actions
    });

    saveSessionTracking(sessionId, tracking);
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
  let phaseEvalInjected = false;

  // Check for Phase Evaluation from recent commit
  // This is the strategic context from Phase Evaluator agent
  const phaseEvalContent = loadAndConsumePhaseEvaluation();
  if (phaseEvalContent) {
    contextParts.push(`[PHASE EVALUATION - From last commit]\n\n${phaseEvalContent}`);
    phaseEvalInjected = true;
  }
  let workflowInjected = false;
  let reasoningCheckpoints = [];
  let voiceProfileLoaded = false;
  let specsLoaded = [];

  // Pre-check: is this content writing or ideation?
  // If so, don't suggest /start-task (it's for coding, not writing)
  const isContentWriting = CONTENT_WRITING_PATTERNS.some(pattern => pattern.test(prompt));
  const isIdeation = IDEATION_PATTERNS.some(pattern => pattern.test(prompt));

  // Check for capture trigger - persist ideas/insights to brain
  const isCaptureRequest = CAPTURE_PATTERNS.some(pattern => pattern.test(prompt));

  if (isCaptureRequest) {
    // Determine target file based on keywords in prompt
    // If no keyword match, Claude decides based on content
    let targetFile = null;
    for (const [keyword, file] of Object.entries(CAPTURE_ROUTING)) {
      if (prompt.toLowerCase().includes(keyword)) {
        targetFile = file;
        break;
      }
    }

    // Extract explicit content if provided (e.g., "capture: this is my idea")
    const explicitMatch = prompt.match(/capture[:\s]+(.{10,})/i);
    const explicitContent = explicitMatch ? explicitMatch[1].trim() : null;

    // Get brain path from environment or construct it
    const brainBasePath = path.join(HOME, '.gemini/antigravity/brain');

    // Inject capture instructions for Claude
    // Note: Claude already has the brain path from session context injection
    const today = new Date().toISOString().split('T')[0];

    const targetFileInstruction = targetFile
      ? `Target file: ${targetFile}`
      : `Target file: Decide based on content type:
  - decisions.md = architectural/design choices
  - patterns.md = technical patterns discovered
  - learnings.md = mistakes, corrections, things to remember`;

    const captureInstructions = explicitContent
      ? `[CAPTURE TRIGGERED]
Content to persist: "${explicitContent}"
${targetFileInstruction}

**Action required:** Write this to the brain file.
Use the brain path from your session context (e.g., ~/.gemini/antigravity/brain/{uuid}/).
Append with this format:

\`\`\`markdown
### [${today}] [Brief title]
${explicitContent}

Context: [What prompted this capture]
\`\`\`

Confirm what was captured and where.`
      : `[CAPTURE TRIGGERED]
User wants to capture something from this conversation.
${targetFileInstruction}

**Action required:** Extract and persist the relevant insight.
1. Identify what the user wants to capture from the conversation
2. Determine the appropriate file based on content type
3. Use the brain path from your session context
4. Append with this format:

\`\`\`markdown
### [${today}] [Brief title]
[The captured content - be specific]

Context: [What prompted this capture]
\`\`\`

Confirm what was captured and where.`;

    contextParts.push(captureInstructions);
  }

  // Check for command routing first
  for (const route of COMMAND_ROUTES) {
    const matches = route.patterns.some(pattern => pattern.test(prompt));

    if (matches) {
      // Skip /start-task if this is content writing or ideation
      if (route.command === '/start-task' && (isContentWriting || isIdeation)) {
        continue;
      }

      // If workflow injection enabled, load and inject the full workflow
      if (route.injectWorkflow && route.workflowLoader) {
        const workflow = loadWorkflow(route.workflowLoader);
        if (workflow) {
          contextParts.push(workflow);
          commandSuggested = route.command;
          workflowInjected = true; // Skip CONTEXT_TRIGGERS - workflow already has the content
          break;
        }
      }

      // Otherwise, just suggest the command
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

  // Methodology enforcement - reinforce teaching mode based on context
  // These fire regardless of command suggestion (always remind about methodology)
  let methodologyReminders = [];
  for (const enforcement of METHODOLOGY_ENFORCEMENT) {
    const matches = enforcement.patterns.some(pattern => pattern.test(prompt));
    if (matches) {
      methodologyReminders.push(enforcement.reminder);
    }
  }
  // Limit to 1 methodology reminder (the most specific match wins)
  if (methodologyReminders.length > 0) {
    contextParts.push(methodologyReminders[0]);
  }

  // Check for ideation - inject identity + voice profile BEFORE creative work starts
  // (isIdeation already computed above for command routing)
  let identityLoaded = false;

  if (isIdeation) {
    const identity = loadIdentityContext();

    if (identity) {
      identityLoaded = true;
      contextParts.push(`[IDEATION CONTEXT - WHO IS LUIS]\n\nYou are ideating/drafting content for Luis. Keep this context in mind:\n\n${identity}\n\n**What to consider:**
- What is Luis trying to demonstrate or prove?
- Who is the audience for this content?
- How does this connect to his goals?
- What expertise should come through?`);
    }

    // Use condensed voice profile for ideation too
    voiceProfileLoaded = true;
    contextParts.push(`[VOICE PROFILE - MAINTAIN THROUGHOUT]
Even during ideation, think in Luis's voice:
- Direct, honest, evidence-based
- No em dashes, no corporate speak, no filler
- Short sentences, active voice, contractions
- Would Luis actually say this?`);
  }

  // Check for content writing - inject condensed voice profile (if not already loaded)
  // Full voice profile is at ~/.gemini/antigravity/brain/voice-profile.md for reference
  // (isContentWriting already computed above for command routing)
  if (isContentWriting && !voiceProfileLoaded) {
    voiceProfileLoaded = true;
    contextParts.push(`[VOICE PROFILE - WRITE AS LUIS]
Writing content as Luis's voice. Key rules:

**Core voice:** Direct, honest, evidence-based, warm but professional.

**NEVER use:**
- Em dashes (—) - use periods or colons
- Corporate speak: leverage, synergize, passionate, utilize, ensure
- Filler: "solid", "comprehensive", "well-structured"
- Scaffolding: "Here's what I found:", "Let me explain:"
- Absolutes: "I always..."

**DO use:**
- Contractions: doesn't, won't, I've
- Short sentences. Active voice. Specific examples.
- Varied sentence length. Mix short and medium.
- Technical vocabulary when precise (not buzzwords)

**The check:** Would Luis actually say this? If it sounds like LinkedIn, rewrite.
Full profile: ~/.gemini/antigravity/brain/voice-profile.md`);
  }

  // Check each context trigger (skip if workflow already injected - it includes the content)
  if (!workflowInjected) {
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
  }

  // Interaction framing reminder - keeps teaching mode primed
  // Now includes framing agents requirement
  const interactionReminder = `[MANDATORY FRAMING]

**Before responding to ANY non-trivial request:**

1. **Launch Context Agent** (if project-definition.yaml exists):
   - Read .claude/specs/project-definition.yaml
   - Determine: project phase, success criteria status, gaps
   - Output: big picture framing

2. **Launch Task Agent:**
   - Evaluate THIS prompt through design thinking micro-cycle
   - Determine: task type, micro-cycle position, research needed
   - Identify: applicable lenses (PM, UX, Engineering, AI/ML, etc.)
   - Determine: teaching focus (2-3 concepts)

3. **Then respond** with the framing applied:
   - Name the phase (big picture + micro)
   - Name the lenses
   - Teach the concepts as you work
   - Connect to Luis's curriculum gaps

Agent prompts: .claude/agents/context-agent.md and .claude/agents/task-agent.md

Skip framing for simple yes/no questions or quick clarifications.`;

  contextParts.push(interactionReminder);

  // Log what we did for observability
  // Full prompt captured for analysis (user confirmed privacy not a concern)
  const actions = {
    prompt: prompt,
    interactionReminder: true
  };
  if (commandSuggested) actions.commandSuggested = commandSuggested;
  if (reasoningCheckpoints.length > 0) actions.reasoningCheckpoints = reasoningCheckpoints.length;
  if (methodologyReminders.length > 0) actions.methodologyEnforced = true;
  if (identityLoaded) actions.identityLoaded = true;
  if (voiceProfileLoaded) actions.voiceProfileLoaded = voiceProfileLoaded;
  if (specsLoaded.length > 0) actions.specsLoaded = specsLoaded;
  if (isCaptureRequest) actions.captureTriggered = true;
  if (phaseEvalInjected) actions.phaseEvalInjected = true;

  // Log injection (always happens now due to interaction reminder)
  logInjection(session_id, actions);

  // Output context (always has at least interaction reminder)
  const output = {
    additionalContext: contextParts.join('\n\n---\n\n')
  };
  console.log(JSON.stringify(output));

  process.exit(0);
}
