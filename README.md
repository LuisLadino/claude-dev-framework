# Claude Development Framework

**A structured `.claude/` directory that makes Claude Code follow your standards consistently.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-brightgreen.svg)](CHANGELOG.md)

---

## What Is This?

A portable framework that lives in your project's `.claude/` directory and gives Claude Code:

- **Your coding specs** - enforced on every task
- **Smart routing** - skills auto-detect what you need and route to the right command
- **Stack awareness** - adapts to any technology via `/research-stack`
- **Self-updating** - pull framework improvements with `/update-framework`

Works with any stack: React, Vue, Svelte, Next.js, Python, Rust, Go, Swift, etc.

---

## Setup

### 1. Fork this repo

Fork [claude-dev-framework](https://github.com/LuisLadino/claude-dev-framework) to your own GitHub account.

### 2. Copy `.claude/` into your project

```bash
git clone https://github.com/YOUR-USERNAME/claude-dev-framework.git
cp -r claude-dev-framework/.claude your-project/.claude
```

Or use the fork directly as your project's starting point.

### 3. Generate standards for your stack

```
/research-stack          # Asks about your stack, researches docs, generates standards
```

### 4. Point `framework-source.txt` at your fork

In `.claude/framework-source.txt`:

```
https://github.com/YOUR-USERNAME/claude-dev-framework
```

This lets `/update-framework` pull updates from your fork across all your projects.

### 5. Start building

```
/start-task              # Every task enforces your standards
```

---

## Structure

```
your-project/.claude/
├── CLAUDE.md                    # Core instructions for Claude
├── framework-source.txt         # Update source URL
├── skills/                      # Auto-routing (Claude invokes these)
│   ├── dev-workflow/            # Routes to development commands
│   ├── project-sync/            # Routes to project management commands
│   ├── specs-sync/          # Routes to standards commands
│   ├── contribute-to-opensource/# Open source contribution setup
│   └── custom-commands/         # Routes to your custom commands
├── commands/
│   ├── development/             # Building features
│   │   ├── start-task.md
│   │   ├── add-feature.md
│   │   ├── generate-tasks.md
│   │   └── process-tasks.md
│   ├── project-management/      # Setup and maintenance
│   │   ├── init-project.md
│   │   ├── research-stack.md
│   │   ├── sync-stack.md
│   │   ├── generate-project-specs.md
│   │   └── update-framework.md
│   ├── specs/                   # Quality and patterns
│   │   ├── add-spec.md
│   │   └── verify.md
│   └── utilities/               # General tools
│       └── learn.md
└── specs/                  # YOUR customizations
    ├── stack-config.yaml        # Your stack definition
    ├── coding-standards/        # Your coding patterns
    ├── architecture/            # Your architecture docs
    ├── design-system/           # Your design tokens and standards
    └── documentation-standards/ # Your doc standards
```

---

## Skills

Skills auto-detect what you're trying to do and route to the right command. You don't invoke them directly - Claude uses them automatically.

| Skill | What It Detects | Routes To |
|-------|-----------------|-----------|
| **dev-workflow** | Building, fixing, implementing features | start-task, add-feature, generate-tasks, process-tasks |
| **project-sync** | Setting up projects, managing stack | init-project, research-stack, sync-stack, generate-project-specs, update-framework |
| **specs-sync** | Adding or checking standards | add-spec, verify |
| **contribute-to-opensource** | Contributing to open source projects | Multi-step workflow |
| **custom-commands** | Project-specific commands | Your custom commands |

**Example:** Say "I want to build a login form" and Claude automatically routes to `/start-task`.

---

## Commands

### Development Commands

Use these when building features and writing code.

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/start-task` | Any coding task | Loads your standards, shows checklist, implements with verification |
| `/add-feature` | Planning a complex feature | Asks key questions, generates a PRD document |
| `/generate-tasks` | Breaking down a PRD | Converts PRD into actionable task list |
| `/process-tasks` | Executing a task list | Works through tasks sequentially with standards |

**Typical flow:** `/add-feature` → `/generate-tasks` → `/process-tasks`

**Quick tasks:** Just use `/start-task` directly.

---

### Project Management Commands

Use these when setting up or maintaining projects.

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/init-project` | Starting a brand new project | Creates stack-config, design system, project docs |
| `/research-stack` | Need standards for your tech | Researches docs, generates coding specs |
| `/sync-stack` | Existing project or deps changed | Detects stack, analyzes code patterns, generates standards |
| `/generate-project-specs` | Need comprehensive specs | Creates PRDs, architecture docs, roadmap |
| `/update-framework` | Monthly maintenance | Pulls framework updates from source repo |

**New project flow:** `/init-project` → `/research-stack` → start building

**Existing project:** `/sync-stack` (does everything: detect stack + analyze patterns + generate standards)

---

### Specs Commands

Use these when managing coding specs and auditing code.

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/add-spec` | Need a custom standard | Creates a new standards file from your input |
| `/verify` | Before commits or releases | Audits code against all active standards |

**Before committing:** Run `/verify` to check for violations.

**Joining a team:** Run `/sync-stack` to detect patterns from the codebase.

---

### Utility Commands

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/learn` | Need something explained | Explains anything in plain English |

---

## How It Works

1. **Skills detect intent** - When you describe what you want, skills route to the right command
2. **Commands load standards** - Each command reads `stack-config.yaml` and relevant standards files
3. **Standards are enforced** - Claude shows you a checklist before implementing
4. **Quality is verified** - Format, lint, type-check, build, and test before completion

### The Standards Check

Every coding task shows you exactly what standards will be applied:

```
STANDARDS CHECK
Stack: Next.js 14 + TypeScript + Tailwind
Standards: nextjs-standards.md, typescript-standards.md, tailwind-standards.md

Key patterns:
- App Router with Server Components
- Strict TypeScript (no any)
- Tailwind utilities only (no custom CSS)

Proceed? (yes/no/explain)
```

You must approve before implementation begins.

---

## Adding Custom Commands

Create a `.md` file in any directory under `commands/`:

```
.claude/commands/deployment/deploy-staging.md
```

The file content becomes the command prompt. The `custom-commands` skill will automatically detect it and route users to it.

**File format:**

```markdown
# /deploy-staging

Deploy current branch to staging environment.

## Steps

1. Run tests
2. Build application
3. Deploy to staging
...
```

---

## Customization

Everything in `specs/` is yours to customize:

- **`stack-config.yaml`** - Define your technologies and active standards
- **`coding-standards/`** - Your coding patterns and conventions
- **`architecture/`** - Your project structure and patterns
- **`design-system/`** - Your design tokens and component standards
- **`documentation-standards/`** - Your documentation requirements

Framework updates never touch `specs/`.

---

## Updating

```
/update-framework
```

This pulls the latest commands, skills, and config from the framework source while preserving your customizations in `specs/`.

---

## What Changed in v2.1

v2.1 adds the skills system and reorganizes commands:

- **Skills system** - Auto-routing based on user intent
- **Commands reorganized** - development/, project-management/, standards/, utilities/
- **Commands trimmed** - 76% smaller for faster loading
- **`/standards` removed** - Redundant with `/verify`
- **`/contribute-to-opensource`** - Now a skill with expanded capabilities

See [CHANGELOG.md](CHANGELOG.md) for full details.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT License - See [LICENSE](LICENSE).

---

**[Report Bug](https://github.com/LuisLadino/claude-dev-framework/issues) | [Request Feature](https://github.com/LuisLadino/claude-dev-framework/issues)**
