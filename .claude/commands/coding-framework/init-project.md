# /init-project

**Initialize complete project foundation - product definition + tech stack + design system**

---

## Purpose

This is the **FIRST command** you run on a new project. It establishes:
- **WHAT** you're building (product definition)
- **HOW** you'll build it (tech stack selection)
- **DESIGN** foundation (design system setup)

**Single command that sets up everything** you need before coding.

**After this:** Run `/research-stack` to generate coding standards

---

## What This Creates

```
.claude/your-stack/
├── stack-config.yaml              # Tech stack configuration
├── design-system/
│   ├── design-tokens.json         # Colors, spacing, typography (machine-readable)
│   └── design-system-standards.md # Design patterns and usage (human-readable)
└── init/
    ├── product-brief.md           # What you're building and why
    └── project-guidelines.md      # Quality standards and requirements

README.md                          # Project overview
PROJECT-STATE.md                   # Cross-session progress tracking
```

---

## Usage

### Basic Usage

```bash
/init-project
```

Interactive questions guide you through product + tech + design setup.

### With Context

```bash
/init-project [path-to-file]
```

Pre-fills answers from research report or existing specs.

**Examples:**
```bash
/init-project .claude/research/opportunity-report.md
/init-project project-brief.md
```

---

## Workflow

### Step 0: Introduction

```
🚀 INITIALIZE PROJECT

Welcome! I'll help you set up your project from scratch.

This command will:
1. Define WHAT you're building (product)
2. Choose HOW you'll build it (tech stack)
3. Set up design foundation (design system)

Takes about 20-30 minutes.

Ready to start? (yes/no)
```

---

## PART 1: Product Definition (10 min)

### Question 1: The Problem

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 1: PRODUCT DEFINITION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTION 1: What problem are you solving?

Describe it in simple terms:
- What's frustrating or difficult right now?
- What could be better or easier?

Example:
"Spanish-speaking developers waste time reading English documentation"

Your answer:
→
```

### Question 2: Who Is This For?

```
QUESTION 2: Who specifically has this problem?

1. General public (anyone can use it)
2. Specific professional group (developers, designers, etc.)
3. Company employees (internal tool)
4. Students or educators
5. Small business owners
6. Other specific group

Choose (1-6):
→
```

### Question 3: The Solution

```
QUESTION 3: What type of solution are you building?

1. Website (web app, blog, portfolio)
2. Mobile app (iOS, Android)
3. Desktop app (Windows, Mac, Linux)
4. Browser extension (Chrome, Firefox, etc.)
5. Command-line tool
6. Backend service/API
7. Library or package

Choose (1-7):
→
```

**Based on answer, drill down:**

*If Website (1):*
```
What kind of website?

1. Interactive web app (users log in, interact with data)
   Examples: Gmail, Trello, Notion

2. Static website (displays information)
   Examples: Blog, portfolio, documentation

3. E-commerce (online store)
   Examples: Amazon, Shopify stores

Choose (1-3):
→
```

*If Browser Extension (4):*
```
Which browsers?

1. Chrome only
2. Chrome + Firefox
3. All browsers (Chrome + Firefox + Safari)

Choose (1-3):
→
```

*etc. for other types...*

### Question 4: Main Activity

```
QUESTION 4: What's the main thing users will DO?

Think about the #1 activity:

Examples:
- "Generate coding exercises in Spanish"
- "Translate technical documentation"
- "Browse dev jobs in Latin America"

Your answer:
→
```

### Question 5: Success Metric

```
QUESTION 5: How will you know this is successful?

What does success look like?

Examples:
- "1000 developers use it daily"
- "Reduces translation time from 2 hours to 10 minutes"
- "Users prefer it over English docs"

Your answer:
→
```

### Question 6: Project Name

```
QUESTION 6: What should we call this project?

Good project names:
- Short and memorable
- Descriptive of what it does
- Easy to type

Examples: "codigo", "dev-espanol", "spanish-ide"

Project name:
→
```

---

## PART 2: Tech Stack Selection (10 min)

### Step 1: Research Recommendations

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 2: TECH STACK SELECTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Researching best practices for [project type]...

Let me find current recommendations for:
- [Project type] development (2025)
- Popular frameworks and tools
- Industry standards

This takes ~30 seconds...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMMENDATIONS

Based on research for [interactive web app]:

**Framework:** Next.js 14
Why:
- Best for interactive web apps (60% market share)
- Built-in routing, API routes, server components
- Excellent performance
- Great developer experience

**Language:** TypeScript
Why:
- Catches errors before runtime
- Better IDE support
- Industry standard (90% of new projects)
- Official types for Next.js

**Styling:** Tailwind CSS
Why:
- Fastest way to build UI
- Small bundle size
- Highly customizable
- Used by top companies

**Database:** PostgreSQL (via Supabase)
Why:
- Reliable, scales well
- Supabase provides auth + storage
- Great TypeScript support

**Testing:** Vitest
Why:
- Fastest test runner
- Same API as Jest
- Great TypeScript support

**Package Manager:** pnpm
Why:
- Faster than npm/yarn
- Uses less disk space
- Better security

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1. Accept these recommendations (recommended)
2. Customize (choose different options)
3. I'll configure manually later

Choose (1-3):
→
```

### Step 2: Customize (If User Chooses Option 2)

```
Let's customize your stack...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRAMEWORK: Currently recommended Next.js

Other options for interactive web apps:

1. Keep Next.js (recommended)
2. Remix - React with better data loading
3. SvelteKit - Faster, simpler syntax
4. Astro - Best for content-heavy sites
5. Create React App - Simple React setup
6. Vue/Nuxt - Easier to learn
7. Other (specify)

Choose (1-7):
→
```

*Continue for each stack component...*

---

## PART 3: Project Guidelines (5 min)

### Quality Standards Questions

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 3: PROJECT GUIDELINES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now let's define quality standards for this project.

QUESTION 7: What's your quality approach?

1. Speed First - Move fast, iterate quickly, minimum viable quality
   → Fewer tests, basic accessibility, optimize later
   → Best for: MVPs, prototypes, rapid experimentation

2. Balanced - Professional quality with reasonable velocity
   → Good test coverage, WCAG AA accessibility, performance monitoring
   → Best for: Most production projects, SaaS products

3. Quality First - Enterprise rigor, comprehensive testing, zero shortcuts
   → High test coverage, WCAG AAA, performance budgets enforced
   → Best for: Healthcare, finance, regulated industries

Choose (1-3):
→
```

### Question 8: Testing Requirements

```
QUESTION 8: What are your testing requirements?

Based on your quality approach, here's the recommendation:

[If Speed First:]
Recommended: Basic testing (no coverage requirement)
- Test critical paths only
- Focus on integration over unit tests

[If Balanced:]
Recommended: 70-80% coverage
- Unit tests for business logic
- Integration tests for key flows
- E2E for critical user journeys

[If Quality First:]
Recommended: 85-95% coverage
- Comprehensive unit tests
- Full integration test suite
- E2E tests for all user flows
- Performance tests

Accept recommendation or specify custom requirement:
1. Accept recommendation
2. Custom coverage target (specify %)
3. No formal testing requirement

Choose (1-3):
→
```

### Question 9: Accessibility Level

```
QUESTION 9: What accessibility level do you need?

1. Basic - Semantic HTML, keyboard navigation
   → Meets minimum standards, not WCAG certified

2. WCAG A - Level A compliance
   → Basic accessibility, some users may struggle

3. WCAG AA (Recommended) - Level AA compliance
   → Industry standard, required for many organizations
   → Covers most user needs

4. WCAG AAA - Level AAA compliance
   → Highest standard, comprehensive accessibility
   → Required for: Government, healthcare, education

Choose (1-4):
→
```

### Question 10: Performance Targets

```
QUESTION 10: Do you have specific performance requirements?

1. No specific targets - Monitor but don't enforce
2. Standard targets - Good Lighthouse scores (> 90)
3. Strict targets - Excellent performance budgets
4. Custom targets - I'll specify exact requirements

Choose (1-4):
→

[If 3 or 4 selected, ask for specifics:]

Specify your performance targets:
- Time to Interactive (TTI): [e.g., < 3 seconds]
- Lighthouse Performance Score: [e.g., > 95]
- Core Web Vitals: [All green / Some metrics]
→
```

### Question 11: Required Integrations

```
QUESTION 11: Are there any must-have integrations?

Common integrations for [project type]:
- Authentication (Auth0, Supabase, Firebase)
- Database (PostgreSQL, MongoDB, Supabase)
- Analytics (PostHog, Plausible, Google Analytics)
- Error tracking (Sentry, Rollbar)
- Payments (Stripe, PayPal)
- Email (SendGrid, Resend)
- Other

List required integrations (comma-separated) or "none":
→
```

---

### Generate project-guidelines.md

After answering questions, generate the file:

```markdown
# Project Guidelines

**Project:** [Project Name]
**Created:** [Date]
**Last Updated:** [Date]

---

## Quality Approach

**Selected:** [Speed First / Balanced / Quality First]

**What this means:**
[Based on selection, explain the approach and expectations]

---

## Testing Requirements

**Coverage Target:** [% or approach]

**Test Types Required:**
- Unit tests: [Yes/No/When applicable]
- Integration tests: [Yes/No/When applicable]
- E2E tests: [Yes/No/When applicable]
- Performance tests: [Yes/No/When applicable]

**Testing Framework:** [From stack-config.yaml]

---

## Accessibility Standards

**Level:** [Basic / WCAG A / WCAG AA / WCAG AAA]

**Requirements:**
- Semantic HTML: Required
- Keyboard navigation: [All interactive elements / Critical paths / Basic]
- Screen reader support: [Full / Critical paths / Basic]
- Color contrast: [WCAG AAA 7:1 / WCAG AA 4.5:1 / No requirement]
- Focus indicators: [Visible on all elements / Critical elements / Default browser]
- ARIA labels: [Comprehensive / Where needed / Minimal]

**Validation:**
- Automated testing: [Required / Recommended / Optional]
- Manual testing: [Required / Recommended / Optional]
- Screen reader testing: [Required / Recommended / Optional]

---

## Performance Targets

**Targets:**
[If specified:]
- Time to Interactive: < [X] seconds
- Lighthouse Performance Score: > [X]
- Core Web Vitals: [All green / Specific metrics]
- Bundle size: < [X] KB

[If not specified:]
- No formal performance budgets
- Monitor via Lighthouse
- Optimize when issues detected

**Enforcement:**
- Performance budgets: [Enforced in CI / Monitored / Not tracked]
- Lighthouse in CI: [Required / Optional / Not configured]

---

## Required Integrations

[List from Question 11:]
- [Integration 1]: [Purpose]
- [Integration 2]: [Purpose]
- [Integration 3]: [Purpose]

[Or:]
No required integrations specified.

---

## Team Agreements

**Code Review:**
- Required before merge: [Yes / No / For major changes]
- Minimum reviewers: [1 / 2 / Not specified]

**Deployment:**
- Process: [Direct to prod / Staging → Production / Not defined]
- Branch protection: [Enabled on main / Not configured]
- CI/CD: [Required / Optional / Not set up]

**Documentation:**
- Code comments: [Required for complex logic / Minimal / Not required]
- Component docs: [Required for public APIs / Optional / Not required]

---

## How These Standards Are Enforced

**During Development:**
- Coding commands (`/start-task`, `/process-tasks`) read this file
- Verification rigor adjusted based on quality approach
- Test coverage checked against requirements
- Accessibility validation at specified level
- Performance benchmarks enforced if targets set

**What This Means:**
- [Quality First]: AI will be strict about quality gates, won't accept incomplete work
- [Balanced]: AI will enforce good practices but allow reasonable trade-offs
- [Speed First]: AI will focus on functionality, skip non-critical quality checks

---

**These guidelines can be updated anytime by editing this file.**
```

---

## PART 4: Design System Setup (5-10 min)

### Step 1: Design Foundation Questions

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 3: DESIGN SYSTEM SETUP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTION 7: What's the primary feel/tone?

1. Professional & Corporate (blues, grays, clean)
2. Creative & Vibrant (bold colors, playful)
3. Minimal & Modern (black/white, lots of space)
4. Warm & Friendly (oranges, rounded corners)
5. Technical & Dev-focused (terminal colors, monospace)

Choose (1-5):
→
```

### Step 2: Generate Design Tokens

**Based on answers, generate appropriate design tokens:**

*For "Technical & Dev-focused":*
```json
{
  "colors": {
    "primary": {
      "DEFAULT": "#3B82F6",
      "dark": "#2563EB",
      "light": "#60A5FA"
    },
    "secondary": {
      "DEFAULT": "#10B981",
      "dark": "#059669",
      "light": "#34D399"
    },
    "background": {
      "DEFAULT": "#0F172A",
      "paper": "#1E293B",
      "elevated": "#334155"
    },
    "text": {
      "primary": "#F1F5F9",
      "secondary": "#94A3B8",
      "muted": "#64748B"
    },
    "accent": {
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444",
      "info": "#3B82F6"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "'Fira Code', 'JetBrains Mono', monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  }
}
```

### Step 3: Generate Design Standards

```markdown
# Design System Standards

**Project:** [Project Name]
**Created:** [Date]
**Theme:** Technical & Dev-focused

---

## Color Usage

### Primary (Blue)
- **Use for:** Main CTAs, important actions, links
- **Don't use for:** Large backgrounds (too intense)
- **Accessibility:** Meets WCAG AA against dark backgrounds

### Secondary (Green)
- **Use for:** Success states, secondary actions, highlights
- **Don't use for:** Error messages (use error color)

### Backgrounds
- **DEFAULT (#0F172A):** Main app background
- **paper (#1E293B):** Cards, containers, elevated surfaces
- **elevated (#334155):** Modals, dropdowns, highest elevation

### Text
- **primary (#F1F5F9):** Headlines, body text, primary content
- **secondary (#94A3B8):** Captions, helper text, less emphasis
- **muted (#64748B):** Disabled text, placeholder text

---

## Typography

### Font Families
- **Sans (Inter):** UI text, body content, headings
- **Mono (Fira Code):** Code blocks, technical content, data

### Font Sizes
- **xs-sm:** Captions, helper text, labels
- **base-lg:** Body text, form inputs
- **xl-2xl:** Section headings
- **3xl+:** Page titles, hero text

### Font Weights
- **normal (400):** Body text
- **medium (500):** Emphasized text
- **semibold (600):** Subheadings
- **bold (700):** Headings

---

## Spacing

Use consistent spacing scale:
- **xs-sm:** Component internal padding
- **md-lg:** Component external margins, gaps
- **xl-2xl:** Section spacing, page margins

**Rule:** Use the same spacing value consistently for similar purposes

---

## Component Patterns

### Buttons
```
Primary: bg-primary text-white (main actions)
Secondary: bg-secondary text-white (supporting actions)
Outline: border-primary text-primary (tertiary actions)
Ghost: text-primary hover:bg-primary/10 (minimal actions)
```

### Cards
```
Background: bg-background-paper
Padding: p-md or p-lg
Border Radius: rounded-lg
Shadow: shadow-md (elevated states)
```

### Forms
```
Inputs: bg-background-elevated border-gray-600
Labels: text-sm font-medium text-secondary
Helper text: text-xs text-muted
Error states: border-error text-error
```

---

## Accessibility

- **Contrast ratios:** All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- **Focus indicators:** Visible 2px outline on all interactive elements
- **Color reliance:** Never use color alone to convey information

---

## Integration

### Tailwind CSS
Design tokens automatically map to Tailwind utilities:
- `bg-primary` → primary color
- `text-secondary` → secondary text color
- `p-md` → medium padding

### CSS-in-JS
Import tokens:
```js
import tokens from '@/design-system/design-tokens.json'
```

---

**These standards ensure consistent, accessible, professional design throughout your app.**
```

---

## PART 4: Final Review & Creation

### Step 1: Review Everything

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLETE PROJECT OVERVIEW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PROJECT DEFINITION

Name: Código
Type: Interactive web application
Problem: Spanish-speaking developers waste time with English docs
Solution: Web-based IDE with AI assistant in Spanish
Success: 1000 daily active users

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ TECH STACK

Framework: Next.js 14 (App Router)
Language: TypeScript (strict mode)
Styling: Tailwind CSS 4.0
Database: PostgreSQL (Supabase)
Testing: Vitest + React Testing Library
Package Manager: pnpm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 DESIGN SYSTEM

Theme: Technical & Dev-focused
Colors: Blue primary, green secondary, dark backgrounds
Typography: Inter (UI), Fira Code (code)
Spacing: Consistent 4px scale
Components: Defined patterns for buttons, cards, forms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Is this correct? (yes/no/edit)
→
```

### Step 2: Create Files

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 CREATING PROJECT FILES

Creating directory structure...
✓ Created .claude/your-stack/

Writing configuration files...
✓ .claude/your-stack/stack-config.yaml
✓ .claude/your-stack/design-system/design-tokens.json
✓ .claude/your-stack/design-system/design-system-standards.md
✓ .claude/your-stack/init/product-brief.md
✓ .claude/your-stack/init/project-guidelines.md
✓ README.md
✓ PROJECT-STATE.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PROJECT FOUNDATION COMPLETE!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Files Created

### 1. stack-config.yaml

```yaml
name: "Código"
version: "1.0.0"
description: "Web-based IDE for Spanish-speaking developers"
project_type: "web-app-interactive"
initialization_date: "2025-01-23"

stack:
  framework: "Next.js"
  framework_version: "14"
  routing: "App Router"
  language: "TypeScript"
  language_mode: "strict"
  styling: "Tailwind CSS"
  styling_version: "4.0"
  database: "PostgreSQL"
  database_provider: "Supabase"
  testing: "Vitest"
  testing_library: "React Testing Library"
  package_manager: "pnpm"
  build_tool: "Vite"

standards_active: []  # Will be populated by /research-stack

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  app_dir: "app"
  design_system_dir: ".claude/your-stack/design-system"

design_system:
  theme: "technical-dev-focused"
  tokens_file: ".claude/your-stack/design-system/design-tokens.json"
  standards_file: ".claude/your-stack/design-system/design-system-standards.md"
```

### 2. design-tokens.json

*(JSON file with all the design tokens from Part 3)*

### 3. design-system-standards.md

*(Markdown file with design patterns from Part 3)*

### 4. product-brief.md

```markdown
# Product Brief: Código

**Created:** 2025-01-23
**Status:** Planning

## The Problem

Spanish-speaking developers waste hours reading English documentation and struggle to find resources in their native language.

**Impact:** Slower learning, reduced productivity, barriers to entry for new developers.

## The Solution

A web-based IDE with integrated AI assistant that:
- Generates coding exercises in Spanish
- Provides documentation and examples in Spanish
- Helps developers learn and code in their native language

**Core value:** Make development accessible to Spanish-speaking community.

## Target Users

**Primary:** Spanish-speaking developers (students and professionals)
- Need to learn programming concepts in Spanish
- Want coding environment that speaks their language
- Frustrated by English-only resources

## Success Criteria

**Primary metric:**
- 1000 daily active users within 6 months

**Secondary metrics:**
- User satisfaction: 8+ out of 10
- Weekly active retention: 60%+
- Time to complete exercises: 30% faster than English alternatives

## Constraints

- Must support Spanish (Spain + Latin American variants)
- Performance critical (developers expect fast tools)
- Accessibility important (reach wider audience)
```

### 5. PROJECT-STATE.md

```markdown
# Project State: Código

**Last Updated:** 2025-01-23 10:30 AM
**Status:** Initialized - Ready for development

---

## Project Overview

**Product:** Código - Spanish-language coding IDE with AI assistant

**Problem:** Spanish-speaking developers waste hours reading English documentation and lack resources in their native language.

**Solution:** Web-based IDE with integrated AI assistant that generates coding exercises, provides documentation, and helps developers learn in Spanish.

**Target Users:** Spanish-speaking developers (students and professionals) across Spain and Latin America

**Tech Stack:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS 4.0
- Database: PostgreSQL (Supabase)
- Testing: Vitest + React Testing Library
- Package Manager: pnpm

**Design System:**
- Theme: Technical & dev-focused
- Primary: Blue (#3B82F6)
- Secondary: Green (#10B981)
- Tokens: .claude/your-stack/design-system/design-tokens.json

---

## Implementation Status

### Phase 1: Foundation ⏳ In Progress

- [x] Project initialized (/init-project completed)
- [x] Tech stack configured (stack-config.yaml created)
- [x] Design system defined (tokens + standards created)
- [x] Product brief documented
- [x] Project state tracking initialized
- [ ] Coding standards generated (→ Run /research-stack)
- [ ] Development environment setup
- [ ] First commit

### Phase 2: Core Features 🔜 Not Started

_Features will be planned after /generate-project-specs or during development_

---

## Architecture Decisions

### Decision 1: Next.js App Router

**Rationale:** Modern routing with React Server Components, built-in optimization, best performance for interactive apps

**Date:** 2025-01-23

**Impact:** All pages will use app directory structure, server components by default, client components only when needed for interactivity

### Decision 2: TypeScript Strict Mode

**Rationale:** Catch errors early, better IDE support, more maintainable code for long-term project

**Date:** 2025-01-23

**Impact:** All code must be fully typed, no implicit any, null checks enforced

### Decision 3: Supabase for Backend

**Rationale:** Auth + database + storage in one platform, PostgreSQL reliability, great TypeScript support, faster development

**Date:** 2025-01-23

**Impact:** User auth, data storage, and file uploads all through Supabase client library

---

## Current Work

**Active Session:** Initial project setup

**Current Task:** Initialization complete, ready to generate coding standards

**Next Step:** Run /research-stack to generate framework-specific coding standards

**Blockers:** None

---

## Sessions Log

### Session 1: Project Initialization
**Date:** 2025-01-23
**Duration:** ~30 minutes
**Completed:**
- ✅ Defined product vision and problem statement
- ✅ Selected tech stack (Next.js + TypeScript + Tailwind + Supabase)
- ✅ Defined project quality guidelines
- ✅ Created design system with tokens and standards
- ✅ Generated stack-config.yaml
- ✅ Created product-brief.md
- ✅ Created project-guidelines.md
- ✅ Initialized project state tracking

**Decisions Made:**
- Using App Router (not Pages Router) for modern React features
- Tailwind CSS 4.0 for styling (utility-first approach)
- Supabase for auth + database (all-in-one solution)
- pnpm for package management (faster, more efficient)

**Next Session:** Generate coding standards with /research-stack

---

## Known Issues

_None yet - project just started_

---

## Notes & Context

**Important Considerations:**
- Must support multiple Spanish variants (Spain, Mexico, Argentina, etc.)
- Performance is critical - developers expect fast, responsive tools
- Accessibility is important to reach wider audience
- Mobile support may be lower priority (desktop-first for IDE)

**Key Constraints:**
- 6 month timeline to beta launch
- Target: 1000 daily active users
- Success metric: 8+ satisfaction score, 60%+ weekly retention

**Resources:**
- Product Brief: .claude/your-stack/init/product-brief.md
- Project Guidelines: .claude/your-stack/init/project-guidelines.md
- Stack Config: .claude/your-stack/stack-config.yaml
- Design Tokens: .claude/your-stack/design-system/design-tokens.json
- Design Standards: .claude/your-stack/design-system/design-system-standards.md
```

### 6. README.md

```markdown
# Código

Web-based IDE for Spanish-speaking developers with integrated AI assistant.

## Overview

Makes development accessible to the Spanish-speaking community by providing coding exercises, documentation, and AI assistance in Spanish.

**Status:** Planning phase
**Timeline:** 6 months to beta launch

## Problem Statement

Spanish-speaking developers waste hours reading English documentation and lack resources in their native language.

## Solution

Real-time coding environment + AI-powered assistant + Spanish-language exercises and docs.

## Quick Start

**Project Setup** (Complete ✓)
```bash
/init-project ✓
```

**Next Steps:**
```bash
/research-stack     # Generate coding standards
/generate-project-specs  # Create comprehensive product specs (optional)
/start-task         # Begin development
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4.0
- **Database:** PostgreSQL (Supabase)
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm

## Design System

- **Theme:** Technical & dev-focused
- **Colors:** Blue primary, green secondary, dark backgrounds
- **Tokens:** `.claude/your-stack/design-system/design-tokens.json`
- **Standards:** `.claude/your-stack/design-system/design-system-standards.md`

## Project Documentation

- **Product Brief:** `.claude/your-stack/init/product-brief.md`
- **Project Guidelines:** `.claude/your-stack/init/project-guidelines.md`
- **Stack Config:** `.claude/your-stack/stack-config.yaml`
- **Design System:** `.claude/your-stack/design-system/`
- **Project State:** `PROJECT-STATE.md` (tracks progress across sessions)

## Success Metrics

- 1000 daily active users
- 8+ satisfaction score
- 60%+ weekly retention

---

**Next:** Run `/research-stack` to generate coding standards for this stack.
```

---

## Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 WHAT'S NEXT

Your project foundation is complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUIRED: /research-stack

This will:
✓ Research Next.js 14 App Router best practices
✓ Research TypeScript strict mode patterns
✓ Research Tailwind CSS 4.0 utility patterns
✓ Research Supabase integration patterns
✓ Research Vitest + React Testing Library
✓ Generate coding standards files

Time: 20-30 minutes
Result: Complete coding standards for your stack

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTIONAL: /generate-project-specs

This will:
✓ Create comprehensive product specifications
✓ Define all features in detail
✓ Plan technical architecture
✓ Create implementation roadmap

Time: 120-150 minutes
Result: Enterprise-level project documentation

Skip this if you just want to start coding quickly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run /research-stack now? (yes/no)
```

---

## Summary

This command is your **all-in-one project initialization**:

1. ✅ Defines your product (problem, solution, users)
2. ✅ Chooses your tech stack (with research-backed recommendations)
3. ✅ Sets up design system (tokens + standards)
4. ✅ Creates all configuration files
5. ✅ Generates project README

**After this:**
- Run `/research-stack` to get coding standards
- Optionally run `/generate-project-specs` for detailed specs
- Start coding with `/add-feature` or dive in directly

**Everything is ready to go in 20-30 minutes.**

**Project state tracking:** PROJECT-STATE.md is created automatically and tracks your progress across sessions.
