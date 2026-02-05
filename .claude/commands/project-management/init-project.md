# /init-project

**Initialize complete project foundation - product definition + tech stack + design system**

---

## Purpose

First command for a new project. Establishes what you're building (product), how (tech stack), and design foundation.

**After this:** Run `/research-stack` to generate coding standards

---

## What This Creates

- `.claude/your-stack/stack-config.yaml` - Tech stack configuration
- `.claude/your-stack/design-system/design-tokens.json` - Colors, spacing, typography
- `.claude/your-stack/design-system/design-system-standards.md` - Design patterns and usage
- `.claude/your-stack/init/product-brief.md` - What you're building and why
- `.claude/your-stack/init/project-guidelines.md` - Quality standards and requirements
- `README.md` - Project overview
- `PROJECT-STATE.md` - Cross-session progress tracking

---

## Usage

```bash
/init-project                # Interactive setup
/init-project [path-to-file] # Pre-fill from research report or existing specs
```

---

## Workflow

### Step 0: Introduction

Inform the user this command will:
1. Define what they're building (product)
2. Choose how to build it (tech stack)
3. Set up design foundation (design system)

Ask if ready to start.

---

## PART 1: Product Definition

### Question 1: The Problem
Ask: What problem are you solving? What's frustrating or difficult right now?

### Question 2: Who Is This For?
Ask user to choose target audience:
1. General public
2. Specific professional group
3. Company employees (internal tool)
4. Students or educators
5. Small business owners
6. Other specific group

### Question 3: The Solution
Ask what type of solution:
1. Website (web app, blog, portfolio)
2. Mobile app (iOS, Android)
3. Desktop app (Windows, Mac, Linux)
4. Browser extension
5. Command-line tool
6. Backend service/API
7. Library or package

**Based on answer, drill down** with follow-up questions (e.g., if Website: interactive web app vs static vs e-commerce; if Browser Extension: which browsers).

### Question 4: Main Activity
Ask: What's the main thing users will DO? (the #1 activity)

### Question 5: Success Metric
Ask: How will you know this is successful?

### Question 6: Project Name
Ask for a short, memorable, descriptive project name.

---

## PART 2: Tech Stack Selection

### Step 1: Research Recommendations

Research current best practices for the user's project type. Present recommendations for each stack component:
- Framework
- Language
- Styling
- Database
- Testing
- Package Manager

For each, give the recommendation and a brief rationale.

Then ask the user:
1. Accept recommendations
2. Customize (choose different options)
3. Configure manually later

### Step 2: Customize (If User Chooses Option 2)

For each stack component, present alternatives relevant to their project type and let them choose. Continue for each component.

---

## PART 3: Project Guidelines

### Question 7: Quality Approach
Ask user to choose:
1. **Speed First** - MVPs, prototypes. Fewer tests, basic accessibility.
2. **Balanced** - Most production projects. Good test coverage, WCAG AA.
3. **Quality First** - Regulated industries. High coverage, WCAG AAA, performance budgets.

### Question 8: Testing Requirements
Based on quality approach, recommend a testing level:
- Speed First: Basic testing, critical paths only
- Balanced: 70-80% coverage, unit + integration + E2E for critical flows
- Quality First: 85-95% coverage, comprehensive unit/integration/E2E + performance tests

Let user accept, specify custom target, or opt out.

### Question 9: Accessibility Level
1. Basic - Semantic HTML, keyboard navigation
2. WCAG A
3. WCAG AA (recommended)
4. WCAG AAA

### Question 10: Performance Targets
1. No specific targets
2. Standard (Lighthouse > 90)
3. Strict performance budgets
4. Custom (ask for TTI, Lighthouse score, Core Web Vitals)

### Question 11: Required Integrations
Ask about must-have integrations (auth, database, analytics, error tracking, payments, email, etc.). Accept comma-separated list or "none".

---

### Generate project-guidelines.md

After answering questions, generate `project-guidelines.md` containing:
- **Quality Approach** - Selected level and what it means
- **Testing Requirements** - Coverage target, required test types, testing framework
- **Accessibility Standards** - Level, specific requirements (keyboard nav, screen reader, contrast, focus, ARIA), validation approach
- **Performance Targets** - Specified targets or "monitor only", enforcement method
- **Required Integrations** - From Question 11
- **Team Agreements** - Code review, deployment process, documentation requirements
- **Enforcement** - How coding commands use this file (rigor adjusted per quality approach)

---

## PART 4: Design System Setup

### Step 1: Design Foundation Questions
Ask: What's the primary feel/tone?
1. Professional & Corporate
2. Creative & Vibrant
3. Minimal & Modern
4. Warm & Friendly
5. Technical & Dev-focused

### Step 2: Generate Design Tokens
Based on the chosen tone, generate `design-tokens.json` with appropriate values for:
- Colors (primary, secondary, background, text, accent/status)
- Spacing scale (xs through 2xl)
- Typography (font families, sizes, weights, line heights)
- Border radius scale
- Shadow scale

### Step 3: Generate Design Standards
Generate `design-system-standards.md` covering:
- Color usage guidelines (when to use each color, accessibility notes)
- Typography rules (which fonts/sizes/weights for which purposes)
- Spacing conventions (internal padding vs external margins vs section spacing)
- Component patterns (buttons, cards, forms with style specifications)
- Accessibility requirements (contrast ratios, focus indicators, color reliance)
- Integration instructions (Tailwind mapping, CSS-in-JS import)

---

## PART 5: Final Review & Creation

### Step 1: Review Everything
Present a summary of all choices (project definition, tech stack, design system) and ask the user to confirm: yes / no / edit.

### Step 2: Create Files
Create the directory structure and write all files listed in "What This Creates" above. Confirm each file was created.

---

## Files Created

### 1. stack-config.yaml
Contains: project name, version, description, project_type, initialization_date, full stack config (framework, language, styling, database, testing, package manager, build tool), empty standards_active list (populated by /research-stack), project_specifics (import alias, directories), and design_system references.

### 2. design-tokens.json
JSON file with all design tokens generated in Part 4.

### 3. design-system-standards.md
Markdown file with design patterns generated in Part 4.

### 4. product-brief.md
Contains: problem statement with impact, solution description, target users, success criteria (primary + secondary metrics), and constraints.

### 5. PROJECT-STATE.md
Contains: project overview (product, problem, solution, users, tech stack, design system), implementation status with phase checklists, architecture decisions with rationale/impact, current work + next steps, sessions log, known issues, notes and context with resource links.

### 6. README.md
Contains: project name and description, overview, problem statement, solution, quick start with next commands, tech stack summary, design system references, project documentation links, success metrics.

---

## Next Steps

After completion, inform the user:

- **Required next:** `/research-stack` - Generates coding standards for the chosen stack
- **Optional:** `/generate-project-specs` - Creates comprehensive product specifications (skip if you want to start coding quickly)

Ask if they want to run `/research-stack` now.
