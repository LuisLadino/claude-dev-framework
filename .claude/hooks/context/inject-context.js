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

Don't say "RAG helps with hallucinations."
Say "RAG reduces hallucination by grounding generation in retrieved context. The model relies less on parametric memory. But retrieval quality matters - garbage in, garbage out."`
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

"This is defensive design (UX) - anticipating errors. Nielsen's heuristic #9. The PM question: is this error common enough to justify complexity?"`
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

The PM skill is making decisions transparent so stakeholders understand trade-offs.`
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

const {
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
  let reasoningCheckpoints = [];
  let voiceProfileLoaded = false;
  let specsLoaded = [];

  // Pre-check: is this content writing or ideation?
  // If so, don't suggest /start-task (it's for coding, not writing)
  const isContentWriting = CONTENT_WRITING_PATTERNS.some(pattern => pattern.test(prompt));
  const isIdeation = IDEATION_PATTERNS.some(pattern => pattern.test(prompt));

  // Check for command routing first
  for (const route of COMMAND_ROUTES) {
    const matches = route.patterns.some(pattern => pattern.test(prompt));

    if (matches) {
      // Skip /start-task if this is content writing or ideation
      if (route.command === '/start-task' && (isContentWriting || isIdeation)) {
        continue;
      }
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

  // ALWAYS inject methodology reminder
  // This fires every input to reinforce the operating system
  const complianceReminder = `[METHODOLOGY]
**Why:** Luis is building fluency for AI product roles. Internalization, not memorization.

**Teach:** Name the concept. Explain HOW it works. Frame in UX, PM, AI/ML, or CPMAI (AI project management) terms.

**Mindset:** Systematize it. Impact over output. Research first. Say "I don't know" when true.

**Think:** What does Luis actually want? Am I thinking or pattern-matching? One root cause, not symptoms.

**The check:** Would a PM with UX foundations and AI technical fluency approach it this way?

---

**CRITICAL - DO THIS NOW:** Before responding, identify ONE concept from this interaction that connects to UX, PM, AI/ML, or CPMAI. Name it explicitly in your response. If you cannot identify a concept, state what discipline lens applies to this task. DO NOT skip this step.`;

  contextParts.push(complianceReminder);

  // Log what we did for observability (always log now since we always inject)
  // Full prompt captured for analysis (user confirmed privacy not a concern)
  const actions = {
    prompt: prompt,
    complianceReminderInjected: true
  };
  if (commandSuggested) actions.commandSuggested = commandSuggested;
  if (reasoningCheckpoints.length > 0) actions.reasoningCheckpoints = reasoningCheckpoints.length;
  if (methodologyReminders.length > 0) actions.methodologyEnforced = true;
  if (identityLoaded) actions.identityLoaded = true;
  if (voiceProfileLoaded) actions.voiceProfileLoaded = voiceProfileLoaded;
  if (specsLoaded.length > 0) actions.specsLoaded = specsLoaded;

  logInjection(session_id, actions);

  // Output context (always has at least compliance reminder)
  const output = {
    additionalContext: contextParts.join('\n\n---\n\n')
  };
  console.log(JSON.stringify(output));

  process.exit(0);
}
