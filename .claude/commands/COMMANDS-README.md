# Command System Reference Guide

**Your AI-Powered Development Workflow - Works with ANY Tech Stack**

This system helps you build professional projects while learning development. Every command adapts to YOUR stack and enforces YOUR standards automatically.

---

## Stack-Agnostic Design

**The commands work with:**
- ✅ React, Vue, Svelte, Angular, Solid, Preact
- ✅ Next.js, Nuxt, SvelteKit, Remix, Astro
- ✅ TypeScript or JavaScript
- ✅ Tailwind, CSS Modules, styled-components, plain CSS
- ✅ Vitest, Jest, or any test framework
- ✅ Any package manager (npm, pnpm, yarn)

**How they adapt:**
1. Read `stack-config.yaml` to know your stack
2. Use `project_knowledge_search` to find your standards
3. Apply framework-specific patterns
4. Generate code that matches YOUR conventions

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [When to Use Each Command](#when-to-use-each-command)
3. [Complete Workflows](#complete-workflows)
4. [Command Reference](#command-reference)
5. [Common Scenarios](#common-scenarios)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Setup

1. **Ensure you have stack configuration:**
   ```bash
   .claude/your-stack/stack-config.yaml
   ```

   If not, run `/research-stack` to create it.

2. **Save command files** to `.claude/commands/`:
   ```
   .claude/commands/
   ├── start-task.md
   ├── standards.md
   ├── verify.md
   ├── create-prd.md
   ├── generate-tasks.md
   ├── process-tasks.md
   └── learn.md
   ```

3. **Your first task**:
   ```bash
   /start-task
   "Add a footer component"
   ```

---

## When to Use Each Command

### 🚀 `/start-task` - Your Main Command

**Use for:** Quick features, bug fixes, single components, small changes

**Works with ANY stack** - Adapts to your framework automatically

**When:**
- "Add a dark mode toggle"
- "Fix the navigation spacing"
- "Create a Button component"
- "Refactor [Component] to follow standards"
- Any task that takes < 2 hours

**What it does:**
1. Loads YOUR stack configuration
2. Finds YOUR standards via project_knowledge_search
3. Shows standards check (adapted to your stack)
4. Waits for your approval
5. Executes using YOUR framework's patterns
6. Verifies everything works
7. Commits properly
8. Done!

**Example:**
```bash
/start-task
"Add a contact form"

Stack detected: Vue 3 + TypeScript + Tailwind
[Loads Vue standards, TypeScript rules]
[Shows Vue-specific patterns in checklist]
[Generates Vue SFC with Composition API]
✅ Complete & committed
```

---

### 📚 `/learn` - Your Teacher

**Use for:** Understanding what you just built or learning concepts

**Adapts explanations to YOUR framework**

**When:**
- After `/start-task` completes - "What did I just build?"
- Confused about something - "What is [framework concept]?"
- Want to understand a pattern - "Why this pattern?"
- Learning fundamentals - "Explain [concept]"

**Two modes:**

**1. No question = Explains last work:**
```bash
/learn

[Detects your stack from stack-config.yaml]
[Explains in context of YOUR framework]
[Uses YOUR framework's terminology]
```

**2. With question = Answers anything:**
```bash
/learn "What is state management in Vue?"

[Gives Vue-specific explanation with ref/reactive]

# vs asking about React:
/learn "What is state management in React?"

[Gives React-specific explanation with useState]
```

**Framework-aware teaching:**
- React users learn about hooks
- Vue users learn about Composition API
- Svelte users learn about reactivity
- All adapted automatically

---

### ⚠️ `/standards` - Emergency Brake

**Use for:** When Claude skips standards

**Stack-aware enforcement**

**When:**
- Claude writes code without showing standards check
- Code doesn't follow your patterns
- Something feels wrong

**How:**
```bash
YOU: /start-task
     "Add button"

CLAUDE: [Writes code immediately without standards check]

YOU: Standards?

CLAUDE: [Loads your stack config]
        [Shows what was violated]
        [Restarts with proper checklist for YOUR stack]
```

---

### ✅ `/verify` - Quality Check

**Use for:** Checking if code follows YOUR standards

**Adapts checks to YOUR stack**

**When:**
- Before committing manual changes
- Reviewing old code
- Making sure everything is correct
- After making changes outside workflow

**What it checks (adapted to your stack):**
- Core compliance (universal)
- Framework-specific standards (React vs Vue vs Svelte)
- Language standards (TypeScript vs JavaScript)
- Styling standards (Tailwind vs CSS Modules vs styled-components)
- Testing standards (Vitest vs Jest)
- Architecture (YOUR file organization)

**Example output:**
```bash
/verify

Loading: React 18 + TypeScript + Tailwind stack

✓ React standards (functional components, named exports)
✓ TypeScript standards (strict mode, no any)
✓ Tailwind standards (utility classes)
✓ Testing standards (React Testing Library)

✅ All standards verified for React stack
```

---

### ➕ `/add-standard` - Add Custom Standards

**Use for:** Extending the framework with domain-specific standards

**Adapts to YOUR needs**

**When:**
- You need standards for a specific domain (design, animation, performance)
- Your project has unique requirements (accessibility, SEO, security)
- You want to enforce team conventions
- You're adding new technologies to your stack

**What it does:**
1. Creates the file in the correct location
2. Registers it in `stack-config.yaml`
3. Optionally researches and generates content
4. Validates everything works
5. Ready to use immediately

**Example:**
```bash
/add-standard design-standards

# Choose:
Type: 1 (Coding Standard)
Generate: Yes
Research: "Design tokens and component variants for Tailwind CSS"

# Result:
✓ Created: .claude/your-stack/coding-standards/design-standards.md
✓ Registered in: stack-config.yaml
✓ Generated with researched patterns
✓ /start-task now reads and applies design-standards.md
```

**Common additions:**
- `design-standards` - Design tokens, spacing, colors
- `animation-standards` - Animation patterns, transitions
- `accessibility-standards` - WCAG compliance patterns
- `performance-standards` - Performance optimization
- `seo-standards` - SEO best practices
- `security-standards` - Security patterns

**See:** [Full documentation](./add-standard.md)

---

### 📄 `/create-prd` - For Big Features

**Use for:** Features that need planning (> 2 hours work)

**Stack-aware PRD generation**

**When:**
- "Build a project gallery with filtering"
- "Add a blog system"
- "Create a contact form with validation"
- Any complex feature

**What it does:**
1. Loads YOUR stack configuration
2. Asks 12 clarifying questions
3. Generates PRD adapted to your stack
4. Includes framework-specific implementation notes
5. Saves to `/tasks/NNNN-prd-[feature-name].md`

**Stack adaptation:**
- **React PRD** suggests React components, hooks, testing with RTL
- **Vue PRD** suggests Vue SFCs, Composition API, testing with VTU
- **Svelte PRD** suggests Svelte components, stores, testing with STL

**After this:** Use `/generate-tasks`

---

### 📋 `/generate-tasks` - PRD → Task List

**Use for:** Converting a PRD into actionable steps

**Generates tasks for YOUR stack**

**When:**
- Right after `/create-prd`
- You have a PRD and need implementation plan

**What it does:**
1. Reads the PRD
2. Loads YOUR stack from stack-config.yaml
3. Analyzes YOUR codebase patterns
4. Creates parent tasks
5. Breaks down into subtasks (framework-specific)
6. Identifies files (YOUR architecture)
7. Saves to `/tasks/tasks-NNNN-prd-[feature-name].md`

**Stack adaptation:**
- React tasks use React patterns and file structure
- Vue tasks use Vue patterns and SFC organization
- Svelte tasks use Svelte patterns and lib structure

**After this:** Use `/process-tasks`

---

### ⚙️ `/process-tasks` - Execute Task List

**Use for:** Building features from a task list

**Executes with YOUR stack's patterns**

**When:**
- After `/generate-tasks`
- You have a task list ready to implement

**What it does:**
1. Loads YOUR stack configuration
2. Reads task list
3. For EACH subtask:
   - Executes `/start-task` workflow
   - Uses YOUR framework patterns
   - Verifies with YOUR tools
   - Waits for approval
4. Commits after each parent task
5. Can pause/resume anytime

**Stack adaptation:**
- Generates React components with hooks
- Generates Vue components with Composition API
- Generates Svelte components with reactivity
- Tests with YOUR test framework
- Styles with YOUR styling solution

**Time:** Multiple sessions, fully pausable

---

## Complete Workflows

### Quick Task Workflow (Any Stack)

```
/start-task
"Add a footer component"
↓
[Loads stack-config.yaml]
[Detects: Your Framework + Language + Styling]
↓
[Shows standards check for YOUR stack]
↓
"yes"
↓
[Builds using YOUR patterns]
↓
[Verifies with YOUR tools]
↓
[Commits]
↓
/learn
[Explains in context of YOUR framework]
```

**Time:** 15-30 minutes
**Works with:** React, Vue, Svelte, any framework

---

### Big Feature Workflow (Any Stack)

```
Day 1: Planning
/create-prd
"Build project gallery with filtering"
↓
[Loads your stack]
[Asks questions]
[Generates stack-specific PRD]
↓
/generate-tasks
↓
[Creates tasks for YOUR framework]
[YOUR file structure]
[YOUR patterns]

Day 2-N: Building
/process-tasks
↓
For each subtask:
  - Standards check (YOUR stack)
  - Build (YOUR patterns)
  - Verify (YOUR tools)
  - Wait for approval
↓
[Generates components in YOUR framework]
[Tests with YOUR test framework]
[Styles with YOUR solution]

Final: Learning
/learn
[Explains in YOUR framework's context]
```

**Time:** Multiple sessions, pausable
**Works with:** React, Vue, Svelte, any framework

---

## Command Reference

### `/start-task`

**Stack-agnostic workflow:**

1. Load stack-config.yaml
2. Find standards via project_knowledge_search
3. Show standards check (adapted to framework)
4. Wait for approval
5. Execute (using framework patterns)
6. Verify (framework tools)
7. Commit

**Adapts to:**
- Framework (React/Vue/Svelte/etc.)
- Language (TypeScript/JavaScript)
- Styling (Tailwind/CSS Modules/etc.)
- Testing (Vitest/Jest/etc.)

---

### `/learn`

**Stack-aware teaching:**

**Mode 1:** Explain last work (in context of your stack)
**Mode 2:** Answer questions (framework-specific)

**Covers:**
- Your framework's concepts
- Your language features
- Your styling approach
- Your testing patterns

**Examples:**
- React user asks "What is state?" → Gets useState explanation
- Vue user asks "What is state?" → Gets ref/reactive explanation
- Svelte user asks "What is state?" → Gets let + $: explanation

---

### `/standards`

**Stack-aware enforcement:**

Loads your stack, shows violations specific to:
- Your framework's anti-patterns
- Your language rules
- Your styling conventions
- Your architecture

Forces restart with proper workflow.

---

### `/verify`

**Comprehensive stack-specific checks:**

Verifies against:
- Core standards (universal)
- Framework standards (yours)
- Language standards (yours)
- Styling standards (yours)
- Testing standards (yours)
- Architecture standards (yours)
- Company standards (if imported)

Reports violations with framework-specific fixes.

---

### `/create-prd`

**Stack-aware PRD generation:**

12 questions → PRD document with:
- Stack-specific technical notes
- Framework-appropriate architecture
- Testing strategy for your framework
- Implementation notes for your patterns

---

### `/generate-tasks`

**Framework-specific task breakdown:**

PRD → Task list with:
- Framework-appropriate subtasks
- Your file structure
- Your naming conventions
- Your patterns and practices

---

### `/process-tasks`

**Stack-adaptive execution:**

Task list → Implementation:
- Each subtask uses your framework patterns
- Tests with your test framework
- Styles with your solution
- Verifies with your tools
- Commits properly

---

## Common Scenarios

### Scenario 1: React Developer

**Stack:** React 18 + TypeScript + Tailwind + Vitest

```bash
/start-task "Add theme toggle"

# Command adapts:
- Uses React functional components
- TypeScript interfaces for props
- useState and useEffect hooks
- Tailwind utility classes
- React Testing Library tests
- Named exports per React standards

✅ Creates: ThemeToggle.tsx with proper React patterns
```

---

### Scenario 2: Vue Developer

**Stack:** Vue 3 + TypeScript + CSS Modules + Vitest

```bash
/start-task "Add theme toggle"

# Command adapts:
- Uses Vue SFC with script setup
- Composition API with ref()
- defineProps for props
- CSS Modules for styling
- Vue Test Utils for tests

✅ Creates: ThemeToggle.vue with proper Vue patterns
```

---

### Scenario 3: Svelte Developer

**Stack:** SvelteKit + TypeScript + Tailwind

```bash
/start-task "Add theme toggle"

# Command adapts:
- Uses Svelte component structure
- export let for props
- Reactive declarations ($:)
- Svelte stores for global state
- Tailwind utility classes
- Svelte Testing Library tests

✅ Creates: ThemeToggle.svelte with proper Svelte patterns
```

---

## Troubleshooting

### Problem: "Can't find stack-config.yaml"

**Solution:**
```bash
/research-stack

[Set up your stack configuration]
[Generates standards for your stack]

# Then commands work perfectly
```

---

### Problem: Wrong framework patterns applied

**Check stack-config.yaml:**
```yaml
stack:
  framework: "React"  # or "Vue", "Svelte", etc.
  version: "18.2"
```

Ensure it matches your actual stack.

---

### Problem: Don't understand framework-specific explanation

**Ask for your framework:**
```bash
/learn "Explain state management in [my framework]"

[Gets explanation specific to your framework]
```

---

### Problem: Standards don't match my code

**Update your standards:**
1. Review `.claude/your-stack/` directory
2. Update standards files to match preferences
3. Ensure `stack-config.yaml` has correct `standards_active` list

---

## Tips for Success

### 1. Set Up Stack Configuration First

```bash
# Before using commands:
/research-stack

# This creates:
- stack-config.yaml (your stack definition)
- Framework-specific standards
- Language standards
- Your patterns and conventions

# Then all commands adapt automatically
```

---

### 2. Use `/learn` After Every Task

```bash
/start-task
[Build something]
✅ Done

/learn
[Explains in YOUR framework's context]
[Uses YOUR framework's terminology]

✅ Built AND learned (in your framework)
```

---

### 3. Let Commands Adapt

Don't try to force commands to use patterns from other frameworks:
- Let React commands generate React patterns
- Let Vue commands generate Vue patterns
- Let Svelte commands generate Svelte patterns

The framework is smart - it knows your stack.

---

## Key Principles

**1. Stack-Agnostic Design**
- Commands work with ANY framework
- Automatically detect and adapt
- Same workflow, different patterns

**2. Standards-Driven**
- Load YOUR standards from project_knowledge
- Follow YOUR conventions
- Enforce YOUR patterns

**3. Quality-First**
- Every task verified
- Every commit clean
- Every pattern correct

**4. Learning-Focused**
- Explanations match your stack
- Examples in your framework
- Concepts adapted to your context

---

## Remember

**You're not limited to one stack.**

The same commands that work for React also work for:
- Vue, Svelte, Angular, Solid
- Next.js, Nuxt, SvelteKit, Remix, Astro
- TypeScript or JavaScript
- Tailwind or CSS Modules or styled-components
- Vitest or Jest

**Same discipline, different stacks.**
**Same quality, adapted patterns.**
**Same workflow, framework-aware.**

---

## Getting Help

### If Confused About Your Framework:

```bash
/learn "[your framework] [concept]"
```

### If Commands Don't Match Your Stack:

```bash
# Check configuration:
.claude/your-stack/stack-config.yaml

# Update if needed
# Or re-run: /research-stack
```

### If Standards Seem Wrong:

```bash
# Review and edit:
.claude/your-stack/[framework]-standards.md
.claude/your-stack/[language]-standards.md

# Commands will use your updated standards
```

---

**This system is built to ADAPT. Whatever your stack, the commands will learn it, understand it, and help you build with it - while teaching you along the way.**