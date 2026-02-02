# Your Stack - Coding Standards Framework

**Purpose:** Define and enforce coding standards for any project you work on.

---

## What Is This?

The `your-stack/` directory contains:

1. **`init/`** (Optional) - Project foundation for enterprise teams
   - `product-brief.md` - What you're building and why
   - `project-guidelines.md` - Project requirements and quality commitments
   - `technical-spec.md` - Technical specifications (from /generate-project-specs)
2. **`stack-config.yaml`** - Defines your tech stack for the current project
3. **`stack-config.template.yaml`** - Template to copy for new projects
4. **`coding-standards/`** - Language/framework-specific coding patterns
5. **`architecture/`** - File organization and structure standards
6. **`documentation-standards/`** - How to document code

When you start coding, AI reads these files to understand:
- What framework/language you're using
- What patterns you prefer
- What quality gates to enforce
- How to organize files

---

## Quick Start

### Two Approaches

**Simple Projects (Individual Developers):**
→ Skip to "Configure Stack" below

**Enterprise Projects (Teams):**
→ Start with "Initialize Project Foundation"

---

### Initialize Project Foundation (Optional)

**For enterprise teams or projects requiring heavy guidance:**

1. **Run initialization:**
   ```bash
   /init-project
   ```

2. **Answer beginner-friendly questionnaire:**
   - Problem you're solving
   - Solution type (web app, mobile, extension, etc.)
   - Quality commitments (speed vs quality, accessibility, performance)
   - Timeline and constraints

3. **Outputs created:**
   - `.claude/your-stack/init/product-brief.md` - Product context
   - `.claude/your-stack/init/project-guidelines.md` - Project requirements
   - `README.md` - Project documentation
   - `PROJECT-STATE.md` - Cross-session progress tracking

4. **Continue to stack configuration below**

---

### Configure Stack

1. **Run stack setup:**
   ```bash
   /init-stack
   ```

   This will:
   - Guide you through stack selection
   - Update `stack-config.yaml`
   - Read project-guidelines.md if it exists (from `/init-project`)
   - Generate or update coding standards

2. **Or manually configure:**

   Copy the template:
   ```bash
   cp .claude/your-stack/stack-config.template.yaml .claude/your-stack/stack-config.yaml
   ```

   Fill in your stack:
   - Project name and description
   - Framework (React, Vue, Astro, Next.js, etc.)
   - Language (TypeScript, JavaScript)
   - Styling (Tailwind, CSS Modules, etc.)
   - Other tools

   Activate relevant standards:
   ```yaml
   standards_active:
     - react-standards        # If using React
     - typescript-standards   # If using TypeScript
     - styling-standards      # Your CSS approach
   ```

3. **Start coding:**
   ```bash
   /start-task "Build a feature"
   ```

   AI automatically:
   - Reads your stack config
   - Loads project-guidelines.md (if exists)
   - Applies your standards
   - Enforces project requirements

---

## Directory Structure

```
.claude/your-stack/
├── init/                             # Project foundation (optional)
│   ├── product-brief.md              # Created by /init-project
│   ├── project-guidelines.md         # Created by /init-project
│   └── technical-spec.md             # Created by /generate-project-specs
│
├── stack-config.yaml                 # Your current project config (NEW SCHEMA)
├── stack-config.template.yaml        # Template for new projects
├── README.md                         # This file
│
├── coding-standards/                 # Framework/language/styling patterns
│   ├── react-standards.md
│   ├── vue-standards.md
│   ├── typescript-standards.md
│   ├── javascript-standards.md
│   ├── styling-standards.md         # Tailwind/CSS Modules/etc
│   ├── testing-standards.md
│   └── [create more as needed]
│
├── architecture/                     # File organization
│   ├── file-structure.md
│   ├── component-patterns.md
│   ├── component-implementation.md
│   └── [create more as needed]
│
├── documentation-standards/          # How to document
│   ├── code-comments.md
│   ├── component-docs.md
│   └── [create more as needed]
│
├── design-system/                    # Design system standards (auto-discovered)
│   ├── component-patterns.md        # Component specs and variations
│   ├── brand-identity.md            # Brand guidelines, visual identity
│   ├── design-tokens.md             # Colors, spacing, typography
│   └── [create more as needed]
│
├── api-standards/                    # API patterns (auto-discovered)
│   ├── rest-api.md                  # REST endpoint patterns
│   ├── graphql-api.md               # GraphQL schema patterns
│   └── [create more as needed]
│
├── database-standards/               # Database patterns (auto-discovered)
│   ├── schema-design.md
│   ├── query-patterns.md
│   └── [create more as needed]
│
├── security-standards/               # Security patterns (auto-discovered)
│   ├── authentication.md
│   ├── authorization.md
│   └── [create more as needed]
│
├── performance-standards/            # Performance patterns (auto-discovered)
│   ├── optimization-patterns.md
│   ├── caching-strategies.md
│   └── [create more as needed]
│
├── accessibility-standards/          # Accessibility patterns (auto-discovered)
│   ├── wcag-compliance.md
│   ├── aria-patterns.md
│   └── [create more as needed]
│
└── [any-custom-directory]/           # Auto-discovered by /init-stack --review
    └── [your domain-specific standards]
```

**Key change:** Standards are now **dynamically discovered**. Create any directory with `.md` files and run `/init-stack --review` to add it to your config automatically.

---

## How It Works

### 1. (Optional) Define Project Requirements

**Enterprise teams run `/init-project` first:**

Creates `init/constitution.md` with:
- Problem definition and solution type
- Quality approach (Speed First / Balanced / Quality First)
- Testing requirements (coverage %, approach)
- Accessibility level (WCAG A/AA/AAA or None)
- Performance targets (load times, Lighthouse scores)
- Must-have integrations
- Timeline and constraints

**Simple projects skip this step.**

### 2. Define Your Stack

In `stack-config.yaml`:
```yaml
stack:
  framework: "React"
  language: "TypeScript"
  styling: "Tailwind CSS"
```

Run `/init-stack` to configure or review.

### 3. AI Reads Standards Before Coding

When you use `/start-task`, AI:
1. Reads `stack-config.yaml`
2. **If exists:** Reads `init/constitution.md` for project requirements
3. Loads `react-standards.md`, `typescript-standards.md`, `styling-standards.md`
4. Shows you what standards it found (including project requirements)
5. Waits for approval
6. Codes following your patterns
7. Enforces project requirements (if constitution exists)

### 4. Quality Gates Enforce Standards

Before committing, AI verifies:
```yaml
quality_gates:
  pre_commit:
    - format      # Prettier/Biome
    - lint        # ESLint/Biome
    - type_check  # TypeScript
```

**If constitution.md exists and quality approach is "Quality First":**
- Accessibility validation (WCAG level from constitution)
- Performance benchmarks (targets from constitution)
- Test coverage measurement (minimum from constitution)

---

## Creating Standards Files

### Option 1: Copy from Templates

Many frameworks have standard patterns. Create a new file:

```bash
# Example: Create Vue standards
touch .claude/your-stack/coding-standards/vue-standards.md
```

Then add Vue-specific patterns (composition API, script setup, etc.)

### Option 2: Let AI Help

Ask AI to create standards:
```
"Create typescript-standards.md based on best practices"
```

### What to Include in Standards Files

**Coding Standards:**
- Component structure
- Naming conventions
- Import order
- State management patterns
- Error handling
- API patterns

**Architecture:**
- Where files go
- Component hierarchy
- Data flow
- Testing organization

**Documentation:**
- Comment style
- Component documentation
- API documentation

---

## Examples by Framework

### React + TypeScript + Tailwind

**stack-config.yaml:**
```yaml
stack:
  framework: "React"
  language: "TypeScript"
  styling: "Tailwind CSS"

standards_active:
  - react-standards
  - typescript-standards
  - styling-standards
```

**What AI reads:**
- `coding-standards/react-standards.md` - Functional components, hooks patterns
- `coding-standards/typescript-standards.md` - Type definitions, interfaces
- `coding-standards/styling-standards.md` - Tailwind utility patterns

### Next.js + TypeScript + shadcn/ui

**stack-config.yaml:**
```yaml
stack:
  framework: "Next.js"
  framework_version: "14.0"
  language: "TypeScript"
  styling: "Tailwind CSS"
  component_library: "shadcn/ui"

standards_active:
  - react-standards       # Next.js uses React
  - typescript-standards
  - styling-standards
  - shadcn-standards      # Create this
```

### Astro + TypeScript + daisyUI

**stack-config.yaml:**
```yaml
stack:
  framework: "Astro"
  language: "TypeScript"
  styling: "Tailwind CSS"
  component_library: "daisyUI"

standards_active:
  - astro-standards
  - react-standards      # If using React islands
  - typescript-standards
  - daisyui-standards
```

---

## Best Practices

### 1. Start Simple

Don't create every possible standard file upfront. Start with:
- Framework standards (react/vue/etc)
- Language standards (typescript/javascript)
- Styling standards

Add more as needed.

### 2. Keep Standards Focused

Each file should cover ONE topic:
- ✅ `react-standards.md` - React patterns
- ✅ `typescript-standards.md` - TypeScript patterns
- ❌ `react-typescript-standards.md` - Too broad

### 3. Use Templates

The current files are good templates. Copy and modify:
```bash
cp react-standards.md vue-standards.md
# Edit vue-standards.md for Vue-specific patterns
```

### 4. Version Your Standards

Track changes in git. When best practices evolve, update files.

### 5. Share Across Projects

Keep this `your-stack/` directory in a central location (like my-brain).
Copy `stack-config.yaml` to each project and customize.

---

## Common Workflows

### Starting a New Project (Enterprise)

**Full workflow with project foundation:**

1. Initialize project: `/init-project`
2. Answer questionnaire about requirements
3. Configure stack: `/init-stack`
4. Generate standards: `/research-stack` (if needed)
5. Start building: `/start-task [feature]`

**constitution.md automatically enforces:**
- Quality commitments throughout development
- Testing requirements in verification
- Accessibility validation
- Performance benchmarks

### Starting a New Project (Simple)

**Quick workflow for individual developers:**

1. Configure stack: `/init-stack`
2. Or manually: Copy template and fill in stack
3. Start coding: `/start-task [feature]`

**Universal CLAUDE.md standards apply** (no project-specific requirements)

### Switching Projects

1. If project has constitution: AI automatically loads it
2. Update `stack-config.yaml` for the new project's stack
3. Activate different standards files
4. AI adapts to new patterns + project requirements

### Adding a New Framework

1. Create `coding-standards/framework-name-standards.md`
2. Document framework patterns
3. Add to `standards_active` in stack-config
4. AI reads and applies

---

## Troubleshooting

**"AI isn't following my standards"**
→ Check `stack-config.yaml` - is the standard file listed in `standards_active`?
→ Check the file exists: `ls .claude/your-stack/coding-standards/`

**"Where do I put X standard?"**
→ Framework/language patterns → `coding-standards/`
→ File organization → `architecture/`
→ Documentation rules → `documentation-standards/`

**"Can I have multiple configs?"**
→ Yes! Copy `stack-config.template.yaml` with different names
→ Load different configs for different projects
→ But typically one `stack-config.yaml` per project

---

## Integration with my-brain

This `your-stack/` framework is part of the larger my-brain system:

- **Knowledge Foundations** (`.claude/foundations/`) - Professional expertise (UX, PM, Research)
- **Coding Framework** (`.claude/your-stack/`) - How to write code
- **Commands** (`.claude/commands/`) - Workflows like /start-task, /verify
- **Workflows** (`.claude/workflows/`) - Complex execution templates

**Together they enable:**
- Knowledge foundations inform WHAT to build
- Coding framework enforces HOW to build it
- Commands orchestrate execution
- Workflows handle complex multi-step tasks

---

## Summary

**Purpose:** Define coding standards for any project

**Key Files:**
- `stack-config.yaml` - Your current project
- `stack-config.template.yaml` - Template for new projects
- `coding-standards/*.md` - Framework/language patterns
- `architecture/*.md` - File organization
- `documentation-standards/*.md` - How to document

**Workflow:**
1. Define your stack in `stack-config.yaml`
2. Create/activate relevant standards files
3. Use `/start-task` - AI reads standards automatically
4. AI enforces quality gates before commits

**Result:** Consistent, professional code across all projects.

---

**Your standards, enforced. Your patterns, followed. Your quality, maintained. 🚀**
