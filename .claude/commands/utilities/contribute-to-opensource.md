# /contribute-to-opensource

**Set up your framework to contribute to an open source project**

---

## Purpose

Automatically configure your coding framework to match an open source project's tech stack, coding patterns, and contribution guidelines.

**Use when:**
- You want to contribute to an open source project
- You've cloned a repo and want to understand their codebase
- You need to match their coding standards
- You want to learn how they structure their code

**Time:** 15-20 minutes

---

## What This Does

This command runs a complete setup workflow:

1. **Detects their tech stack** - Scans the codebase to identify framework, language, tools
2. **Discovers their patterns** - Analyzes code to find their conventions and structure
3. **Extracts documentation** - Reads CONTRIBUTING.md, docs/ for their guidelines
4. **Generates standards** - Creates framework-specific best practices
5. **Creates tracking file** - Sets up PROJECT-STATE.md for your contribution

**After running this, your framework will code using THEIR patterns, not yours.**

---

## Prerequisites

**You must have:**
- Cloned the open source project locally
- `cd` into the project directory
- Copied your framework: `cp -r ~/my-brain/.claude .`

**Example:**
```bash
cd ~/projects
git clone https://github.com/org/awesome-project.git
cd awesome-project
cp -r ~/my-brain/.claude .

# Now you're ready to run the command
/contribute-to-opensource
```

---

## Workflow

### Step 1: Verify Location

Check that we're in the right place:

```bash
# Verify we're in a git repo
git remote -v 2>/dev/null || echo "ERROR: Not a git repository"

# Verify .claude exists
ls -la .claude 2>/dev/null || echo "ERROR: .claude directory not found"

# Get repo info
repo_url=$(git remote get-url origin 2>/dev/null)
repo_name=$(basename -s .git "$repo_url")
```

If errors, stop and tell user:
```markdown
❌ **SETUP ERROR**

This command must be run from an open source project directory.

**Steps to fix:**
1. Clone the project: `git clone [repo-url]`
2. Navigate into it: `cd [project-name]`
3. Copy framework: `cp -r ~/my-brain/.claude .`
4. Run this command again

**Current directory:** [pwd]
**Git repo:** [yes/no]
**.claude exists:** [yes/no]
```

### Step 2: Project Overview

Show user what we found:

```markdown
🔍 **OPEN SOURCE PROJECT DETECTED**

**Repository:** [org/repo-name]
**URL:** [repo-url]

**Package Manager:** [detected from lock files]
**Project Type:** [detected from package.json or file structure]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm going to configure your framework to match this project's:
✓ Tech stack (framework, language, tools)
✓ Coding patterns (component structure, naming, imports)
✓ Contribution guidelines (commit format, PR process)
✓ Testing conventions (file structure, naming patterns)

This will take about 15-20 minutes.

Ready to proceed? (yes/no)
```

⏸️ **WAIT for user approval**

### Step 3: Detect Tech Stack

Run `/sync-stack` automatically:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 STEP 1/5: Detecting Tech Stack

Scanning project files...
```

Follow the `/sync-stack` workflow:
- Detect framework from dependencies and file structure
- Detect language from file extensions and tsconfig
- Detect styling approach
- Detect testing framework
- Detect package manager
- Create/update `stack-config.yaml`

**Display results:**
```markdown
✅ Tech Stack Detected

Framework: React 18.2 (using Vite)
Language: TypeScript (strict mode)
Styling: CSS Modules
State Management: Zustand
Testing: Vitest + React Testing Library
Package Manager: pnpm
Build Tool: Vite

Saved to: .claude/your-stack/stack-config.yaml
```

### Step 4: Analyze Codebase Patterns

Run `/analyze-standards codebase` automatically:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 STEP 2/5: Discovering Coding Patterns

Analyzing codebase for patterns...
- Scanning components/
- Analyzing file structure
- Detecting naming conventions
- Identifying import patterns
- Finding testing patterns
```

Follow the `/analyze-standards codebase` workflow:
- Scan component files
- Discover patterns (structure, naming, imports, state, testing)
- Create standards files matching their patterns

**Display results:**
```markdown
✅ Coding Patterns Discovered

Component Structure:
- Functional components with TypeScript
- Props interface: [Component]Props pattern
- Export: Named exports only (no default)

File Organization:
- Components: src/components/[feature]/
- Co-located tests: Component.test.tsx
- Co-located styles: Component.module.css

Naming Conventions:
- PascalCase for components
- camelCase for functions/variables
- kebab-case for file names

Import Patterns:
- Path alias: @/ for src/
- Barrel exports via index.ts
- React import: import * as React

State Management:
- Zustand stores in src/stores/
- Store naming: use[Feature]Store
- Selector pattern for derived state

Testing:
- describe('[Component]', () => {})
- Test names: "should [behavior]"
- Setup in beforeEach hooks

Saved to: .claude/your-stack/coding-standards/
```

### Step 5: Check Documentation

Run `/analyze-standards docs` automatically:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 STEP 3/5: Extracting Contribution Guidelines

Looking for documentation...
```

Search for:
- `CONTRIBUTING.md`
- `DEVELOPMENT.md`
- `CODE_OF_CONDUCT.md`
- `docs/` directory
- `README.md` (contributing section)

If found, extract:
- Commit message format (conventional commits, custom format)
- PR requirements (tests, linting, descriptions)
- Code style rules
- Branch naming conventions
- Review process

**Display results:**
```markdown
✅ Contribution Guidelines Found

Commit Format: Conventional Commits
- Pattern: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore

PR Requirements:
- Must reference issue number
- All tests must pass
- Linting must pass (pnpm lint)
- Type checking must pass (pnpm type-check)

Code Style:
- ESLint configuration in .eslintrc.js
- Prettier configuration in .prettierrc
- Single quotes, no semicolons, 2 spaces

Branch Naming:
- Pattern: [type]/[issue-number]-[description]
- Example: fix/1234-button-typescript-error

Review Process:
- Requires 1 approval from maintainer
- CI must pass (GitHub Actions)

Saved to: .claude/config/version-control.md (updated)
```

**If no docs found:**
```markdown
⚠️  No Contribution Guidelines Found

No CONTRIBUTING.md or similar files detected.

I'll use standard open source best practices:
- Conventional commits format
- Tests required for PRs
- Standard GitHub PR workflow

You should check the project's GitHub for contribution info.
```

### Step 6: Generate Framework Standards

Run `/research-stack` automatically:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔬 STEP 4/5: Generating Framework Best Practices

Researching official standards for this stack...
- React 18 best practices
- TypeScript patterns
- Vite configuration
- Zustand patterns
- Vitest testing strategies
```

Follow the `/research-stack` workflow:
- Research each technology in their stack
- Generate comprehensive standards
- Align with their detected patterns

**Display results:**
```markdown
✅ Framework Standards Generated

Created:
- react-standards.md (React 18 + Hooks patterns)
- typescript-standards.md (strict mode best practices)
- vite-standards.md (build optimization)
- zustand-standards.md (state management patterns)
- vitest-standards.md (testing best practices)

Saved to: .claude/your-stack/coding-standards/
```

### Step 7: Create Contribution Tracking

Create `PROJECT-STATE.md` for tracking work:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 STEP 5/5: Creating Contribution Tracker

Creating PROJECT-STATE.md...
```

Generate this file:

```markdown
# Project State: Contributing to [Project Name]

**Last Updated:** [Current date/time]
**Status:** Ready to contribute
**Repository:** [repo-url]

---

## Project Overview

**Project:** [Project name from package.json or README]
**Description:** [From README or package.json description]

**Tech Stack:**
- Framework: [from stack-config.yaml]
- Language: [from stack-config.yaml]
- Styling: [from stack-config.yaml]
- State Management: [from stack-config.yaml]
- Testing: [from stack-config.yaml]
- Package Manager: [detected]

**Their Patterns:**
- Component structure: [discovered pattern]
- File organization: [discovered pattern]
- Naming conventions: [discovered pattern]
- Import style: [discovered pattern]
- Testing approach: [discovered pattern]

---

## Contribution Setup

### Completed
- [x] Tech stack detected and configured
- [x] Codebase patterns analyzed
- [x] Contribution guidelines extracted
- [x] Framework standards generated
- [x] Ready to work on issues

### Next Steps
1. Find an issue to work on (good first issue, help wanted)
2. Comment on issue to claim it
3. Read issue description carefully
4. Create branch: [type]/[issue-number]-[description]
5. Make changes following their patterns
6. Run tests: `[package-manager] test`
7. Run linter: `[package-manager] lint`
8. Commit using their format
9. Push and create PR

---

## Their Contribution Guidelines

**Commit Format:**
[Their commit format from CONTRIBUTING.md or "Conventional Commits (assumed)"]

**PR Requirements:**
[List from CONTRIBUTING.md or standard requirements]

**Code Style:**
[From .eslintrc, .prettierrc, or "Follow existing patterns"]

**Branch Naming:**
[From CONTRIBUTING.md or "Descriptive branch names recommended"]

---

## Current Work

**Active Issue:** None yet - find an issue to work on

**Branch:** N/A

**Files Modified:** None

**Next Step:** Browse issues at [repo-url]/issues

**Blockers:** None

---

## Sessions Log

### Session 1: Framework Setup
**Date:** [Current date]
**Duration:** ~20 minutes
**Completed:**
- ✅ Detected tech stack: [framework] + [language] + [styling]
- ✅ Analyzed codebase patterns
- ✅ Extracted contribution guidelines
- ✅ Generated framework standards
- ✅ Created contribution tracker

**Discoveries:**
- [Key pattern 1]
- [Key pattern 2]
- [Key pattern 3]

**Next Session:** Work on first issue

---

## Known Issues

_None yet - haven't started coding_

---

## Notes & Context

**Repository Info:**
- Stars: [if can detect from API]
- Primary Language: [from GitHub language bar]
- License: [from LICENSE file]
- Last Updated: [git log -1]

**Useful Commands:**
```bash
# Install dependencies
[package-manager] install

# Run development server
[package-manager] dev

# Run tests
[package-manager] test

# Run linter
[package-manager] lint

# Run type checker (if TypeScript)
[package-manager] type-check

# Build
[package-manager] build
```

**Documentation:**
- README: ./README.md
- Contributing: ./CONTRIBUTING.md (if exists)
- Docs: ./docs/ (if exists)

**Standards Files:**
- Stack Config: .claude/your-stack/stack-config.yaml
- Coding Standards: .claude/your-stack/coding-standards/
- Version Control: .claude/config/version-control.md
```

**Display:**
```markdown
✅ Contribution Tracker Created

File: PROJECT-STATE.md

This file tracks:
- Project overview and tech stack
- Their coding patterns and guidelines
- Your contribution progress
- Session history

Update it as you work on issues.
```

---

## Completion Summary

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **SETUP COMPLETE!**

Your framework is now configured for [Project Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **WHAT WAS CONFIGURED**

**Tech Stack:**
Framework: [framework]
Language: [language]
Styling: [styling]
Testing: [testing]
→ Saved to: stack-config.yaml

**Coding Patterns:**
✓ Component structure patterns
✓ File organization conventions
✓ Naming patterns
✓ Import conventions
✓ Testing patterns
→ Saved to: coding-standards/

**Contribution Guidelines:**
✓ Commit format: [format]
✓ PR requirements: [requirements]
✓ Code style: [style]
→ Saved to: version-control.md

**Framework Standards:**
✓ [Framework] best practices
✓ [Language] patterns
✓ [Testing] strategies
→ Saved to: coding-standards/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **NEXT STEPS**

**1. Find an issue to work on:**
Visit: [repo-url]/issues
Look for: `good first issue` or `help wanted` labels

**2. Claim the issue:**
Comment: "I'd like to work on this"
Wait for maintainer approval

**3. Start working:**
```bash
# Create branch
git checkout -b fix/[issue-number]-description

# Start new session and say:
"Work on issue #[number] - read PROJECT-STATE.md and [relevant-files]"
```

**4. When ready to submit:**
```bash
# Run quality checks
[package-manager] test
[package-manager] lint

# Commit (I'll use their format automatically)
# Push and create PR
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 **HELPFUL FILES**

Read these to understand the project:
- PROJECT-STATE.md (your contribution tracker)
- README.md (project overview)
- CONTRIBUTING.md (their guidelines) [if exists]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **TIPS**

✓ **Follow their patterns** - Your framework now matches their code style
✓ **Update PROJECT-STATE.md** - Track your progress as you work
✓ **Start small** - Pick a simple issue for your first contribution
✓ **Ask questions** - Comment on the issue if anything is unclear
✓ **Be patient** - Open source maintainers are often volunteers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your framework will now code using THEIR patterns.**

When you work on issues, I'll automatically:
- Use their component structure
- Follow their naming conventions
- Match their import style
- Use their testing patterns
- Format commits their way

Happy contributing! 🎉
```

---

## Error Handling

### If stack detection fails

```markdown
⚠️  **PARTIAL DETECTION**

Could not fully detect tech stack.

**Detected:**
[List what was found]

**Missing:**
[List what couldn't be detected]

**What to do:**
1. Check package.json for dependencies
2. Look at file structure
3. Read README.md
4. Manually update stack-config.yaml if needed

Continue anyway? (yes/no)
```

### If no patterns found

```markdown
⚠️  **LIMITED PATTERN DETECTION**

Could not find many code patterns.

**Possible reasons:**
- Small/new codebase
- Unusual file structure
- Non-standard organization

**I'll use framework defaults instead.**

The framework will still work, but may not match their exact style.

Continue? (yes/no)
```

### If research-stack fails

```markdown
⚠️  **STANDARDS GENERATION INCOMPLETE**

Could not generate all framework standards.

**Generated:**
[List successful standards]

**Failed:**
[List failures]

**Your framework will still work** but may lack some best practices.

You can run `/research-stack` manually later to retry.

Continue? (yes/no)
```

---

## Related Commands

- `/sync-stack` - Just detect and update tech stack
- `/analyze-standards` - Just analyze patterns
- `/research-stack` - Just generate framework standards

---

## Notes

**This command is a workflow orchestrator** - it runs multiple commands in sequence:
1. `/sync-stack` (detect tech)
2. `/analyze-standards codebase` (find patterns)
3. `/analyze-standards docs` (extract guidelines)
4. `/research-stack` (generate standards)
5. Creates PROJECT-STATE.md

**Each step can also be run individually** if you want more control.

**After this command, your `.claude/` directory will be customized for THIS project.** When you're done contributing and want to work on your own projects again, either:
- Copy `.claude/` somewhere as backup
- Re-run `/sync-stack` on your own project to reset
- Keep separate `.claude/` directories for different projects
