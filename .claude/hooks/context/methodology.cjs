#!/usr/bin/env node

/**
 * Methodology Enforcement Module
 *
 * Reinforces teaching mode based on context.
 * Contains Career/Professional context and CPMAI domain reminders.
 */

const METHODOLOGY_ENFORCEMENT = [
  // CAREER/PROFESSIONAL CONTEXT (Luis-specific)
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
  // CPMAI Domain 1: Responsible AI (15%)
  {
    patterns: [
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
  // CPMAI Domain 2: Business Needs (26%)
  {
    patterns: [
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
  // CPMAI Domain 3: Data Needs (26%)
  {
    patterns: [
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
  // CPMAI Domain 4: Model Development & Evaluation (16%)
  {
    patterns: [
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
  // CPMAI Domain 5: Operationalization (17%)
  {
    patterns: [
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
  }
];

/**
 * Check prompt for methodology enforcement
 * @param {string} prompt - User's prompt
 * @returns {{ content: string|null, matched: boolean }}
 */
function check(prompt) {
  for (const enforcement of METHODOLOGY_ENFORCEMENT) {
    const matches = enforcement.patterns.some(pattern => pattern.test(prompt));
    if (matches) {
      // Return the first (most specific) match
      return {
        content: enforcement.reminder,
        matched: true
      };
    }
  }

  return { content: null, matched: false };
}

module.exports = {
  METHODOLOGY_ENFORCEMENT,
  check
};
