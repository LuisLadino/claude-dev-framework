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

| Command | When to Use |
|---------|-------------|
| `/start-task` | Any coding task. Loads your specs, implements, runs quality gates. |
| `/add-feature` | Planning something complex. Creates PRD and task list. |
| `/process-tasks` | You have a task list from /add-feature. Executes them sequentially. |
| `/commit` | Commit changes following your version-control specs. |

### Project Setup

| Command | When to Use |
|---------|-------------|
| `/sync-stack` | **Start here.** Detects your stack, researches docs, generates specs. |
| `/sync-stack [dep]` | Add specs for a specific dependency (e.g., `/sync-stack prisma`). |
| `/init-project` | Optional. Define product requirements before any code exists. |
| `/generate-project-specs` | Optional. Enterprise docs (PRD, architecture, API specs). |
| `/update-framework` | Monthly. Pull framework updates from your fork. |

### Quality

| Command | When to Use |
|---------|-------------|
| `/add-spec` | Create a custom spec file for patterns not covered by /sync-stack. |
| `/verify` | Before commits. Audits code against your specs. |
| `/learn` | Understand code or concepts. Works on anything. |

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
├── CLAUDE.md              # Core instructions
├── commands/              # Slash commands
│   ├── development/       # start-task, add-feature, process-tasks
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
