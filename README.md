# Claude Development Framework

**A structured `.claude/` directory that makes Claude Code follow your specs consistently.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.3.0-brightgreen.svg)](CHANGELOG.md)

---

## What Is This?

A portable framework that lives in your project's `.claude/` directory. It gives Claude Code:

- **Your coding specs** - Enforced on every task
- **Stack awareness** - Adapts to any technology
- **Quality gates** - Format, lint, type-check, test before completion
- **Self-updating** - Pull improvements from your fork

Works with any stack: React, Vue, Svelte, Next.js, Python, Rust, Go, etc.

---

## Quick Start

```bash
# 1. Fork this repo, then clone your fork
git clone https://github.com/YOUR-USERNAME/claude-dev-framework.git

# 2. Copy .claude/ to your project
cp -r claude-dev-framework/.claude your-project/.claude

# 3. In your project, run
/sync-stack
```

That's it. Claude now follows your patterns.

---

## When to Use What

### Starting a New Project

```
/sync-stack              # Detects stack, generates specs
/start-task              # Build something
```

### Adding to an Existing Project

```
/sync-stack              # Reads your code, learns your patterns
/start-task              # Build following those patterns
```

### Planning a Complex Feature

```
/add-feature             # Creates PRD + task breakdown
/process-tasks           # Executes tasks one by one
```

### Adding a New Dependency

```
/sync-stack prisma       # Generate specs for just that dependency
```

### Committing and PRs

```
/commit                  # Commit with proper message format
/pr                      # Create pull request
```

### Checking Code Quality

```
/verify                  # Audit code against your specs
```

### Understanding Code

```
/learn                   # Explain anything in plain English
/learn react hooks       # Explain a specific topic
```

---

## Commands

### Development

| Command | Description |
|---------|-------------|
| `/start-task` | The main command for any coding work. Give it a task description, it loads your specs, asks clarifying questions, shows you what patterns will be enforced, waits for approval, implements the code, then runs all quality gates (format, lint, type-check, test) before marking complete. Use this for building features, fixing bugs, refactoring, or any code changes. |
| `/add-feature` | For complex features that need planning before coding. Asks you questions about what you're building, creates a PRD (product requirements doc), then breaks it down into a numbered task list. Use when you have a big feature that needs multiple steps. After this, run `/process-tasks` to execute the list. |
| `/process-tasks` | Executes a task list created by `/add-feature`. Goes through each task one by one, runs `/start-task` for each, verifies after each one, and commits after completing each parent task. You can pause anytime and resume later. |
| `/commit` | Commits all changes following your version-control spec. Checks status, updates any documentation that needs it (README, CHANGELOG, CONTRIBUTING), stages everything, generates a commit message from the diff, and commits. No questions asked. |
| `/pr` | Creates a pull request for your current branch. Shows commits and files changed, generates a PR title and description, then creates it via GitHub CLI. Use after you've committed and want to merge into main. |

### Project Setup

| Command | Description |
|---------|-------------|
| `/sync-stack` | **Start here for any project.** Reads all your existing spec files, detects your tech stack from config files (package.json, tsconfig, etc.), researches official documentation using context7 or web search, scans your existing code for patterns, then generates spec files that combine best practices with YOUR patterns. Also updates the config templates (version-control, testing, deployment, environment) based on your actual project setup. Run this first on any project, new or existing. |
| `/sync-stack [dep]` | Same as above but focused on a single dependency. Use when you add something new to your project (e.g., `/sync-stack prisma` after installing Prisma). Generates specs just for that dependency. |
| `/init-project` | Optional. For when you want to define product requirements before any code exists. Asks what you're building, who it's for, success criteria, etc. Creates a product brief and project guidelines. Most people skip this and just run `/sync-stack`. |
| `/generate-project-specs` | Optional. For enterprise projects that need formal documentation. Creates PRD, user stories, architecture docs, API specs, database schema docs. Overkill for solo projects or MVPs. |
| `/update-framework` | Checks your fork of this framework for updates. Shows what's new or changed, lets you pick what to apply. Run monthly or when you know there are updates. Won't touch your specs/ directory. |

### Quality

| Command | Description |
|---------|-------------|
| `/add-spec` | Creates a new spec file for patterns not covered by `/sync-stack`. Asks what type (coding, architecture, design, documentation, config, or custom), names it, creates a template, and registers it in stack-config.yaml. Use when you have project-specific patterns you want enforced. |
| `/verify` | Audits your code against your specs without making changes. Runs all quality gates, then checks your code against each spec file looking for violations. Reports what passed and what didn't. Use before commits or to check if code follows your patterns. |
| `/learn` | Explains anything in plain English. Give it a topic, code snippet, or concept and it breaks it down simply. Use when you want to understand something without jargon. Works on anything, not just your codebase. |

---

## How It Works

```
/sync-stack
    ↓
Reads existing specs → Detects stack → Researches docs → Scans your code
    ↓
Generates specs in .claude/specs/coding/
Updates stack-config.yaml
    ↓
/start-task
    ↓
Loads stack-config.yaml → Reads all listed specs → Shows what will be enforced
    ↓
You approve → Claude implements → Runs quality gates → Done
```

**Your specs become the rules.** Claude won't deviate from them.

---

## Structure

```
.claude/
├── CLAUDE.md              # Core instructions for Claude
├── commands/              # Slash commands
│   ├── development/       # start-task, add-feature, process-tasks, commit, pr
│   ├── project-management/# sync-stack, init-project, update-framework
│   ├── specs/             # add-spec, verify
│   └── utilities/         # learn
├── skills/                # Auto-routing (you don't call these directly)
└── specs/                 # YOUR project's specs
    ├── stack-config.yaml  # Stack + active specs list + quality gates
    ├── config/            # Git, deploy, env, testing templates
    └── coding/            # Created by /sync-stack for your dependencies
```

---

## Configuration

### stack-config.yaml

```yaml
stack:
  framework: "Next.js"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"
  package_manager: "pnpm"

specs:
  coding:
    - nextjs-specs
    - typescript-specs
  config:
    - version-control
    - testing

project:
  import_alias: "@/"
  components_dir: "src/components"

quality:
  - format
  - lint
  - type_check
  # - test    # Uncomment to require tests pass
  # - build   # Uncomment to require build pass
```

### Quality Gates

Listed under `quality:` in stack-config.yaml. Commands are detected from package.json scripts. Only enabled gates run.

---

## Customization

Everything in `specs/` is yours. Edit any file to match your patterns.

- **Framework updates never touch specs/** - Your customizations are safe
- **Add custom specs** with `/add-spec`
- **Create custom directories** - Just add them to specs/ and list in stack-config.yaml

---

## Updating the Framework

```
/update-framework
```

Checks your fork for updates, shows what changed, lets you choose what to apply.

---

## License

MIT - See [LICENSE](LICENSE).
