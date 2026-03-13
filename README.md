# Claude Development Framework

**Make Claude a better work partner through context persistence and pattern enforcement.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.4.0-brightgreen.svg)](CHANGELOG.md)

---

## What Is This?

A framework that makes Claude Code:

1. **Remember across sessions** - Context persists. What Claude learns today carries forward.
2. **Work your way** - Your preferences, patterns, and voice are enforced consistently.
3. **Improve over time** - Feedback loop captures data, detects issues, reflects on what to change.

Without this, every Claude session starts blank. With it, Claude has history, learnings, and awareness.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION LIFECYCLE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SessionStart → Loads identity, task, learnings from brain  │
│       ↓                                                      │
│  During Session → Hooks track everything (tools, files,     │
│                   commands, failures)                        │
│       ↓                                                      │
│  /checkpoint or PreCompact → Saves state to brain           │
│       ↓                                                      │
│  SessionEnd → Writes summary for next session               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### The Feedback Loop

```
CAPTURE ──► DETECT ──► DECIDE ──► ACT
   │           │          │        │
   │           │          │        └─► Write to brain files
   │           │          │
   │           │          └─► /reflect analyzes, suggests changes
   │           │
   │           └─► awareness.js notices issues (large files,
   │               failures, long sessions)
   │
   └─► Tracking hooks log everything
```

### Two Layers

**Global Layer** (Antigravity - `~/.gemini/antigravity/`):
- Brain storage for persistent context (learnings, patterns, decisions)
- SessionStart/PreCompact scripts that load and save state
- Shared with Gemini for cross-agent context

**Framework Layer** (this repo - copied to projects via `/update-framework`):
- Slash commands for workflows
- Hooks for safety, tracking, context injection
- Specs for pattern enforcement

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
/verify                  # Check code against your specs
/audit                   # Deep parallel review (security, performance, tests)
```

### Understanding Code

```
/learn                   # Explain anything in plain English
/learn react hooks       # Explain a specific topic
```

### Managing Context

```
/checkpoint              # Save session context before ending work
/reflect                 # Analyze patterns, identify improvements
```

---

## Commands

Descriptions match command frontmatter (source of truth in `.claude/commands/`).

### Development

| Command | Description |
|---------|-------------|
| `/start-task` | Start any coding task. Loads stack config and specs, gathers requirements interactively, then executes. |
| `/add-feature` | Plan a complex feature before building. Creates PRD, breaks into tasks. Use when feature needs multiple components or design decisions. |
| `/process-tasks` | Execute a task list one at a time. Use after /add-feature to implement each subtask with verification and commits. |
| `/commit` | Commit changes using project specs. Loads version-control.md, updates docs to reflect changes, then commits. |
| `/pr` | Create a pull request. Checks branch status, generates summary from commits, creates PR with gh cli. |

### Project Setup

| Command | Description |
|---------|-------------|
| `/sync-stack` | Wire project together, verify setup, generate coding specs. Handles the HOW after /init-project defines the WHAT. |
| `/init-project` | Define product requirements before coding. Creates project-brief, architecture decisions, design system. For complex projects needing upfront planning. |
| `/generate-project-specs` | Generate comprehensive project docs (PRD, architecture, API specs). For enterprise/team projects needing full documentation. |
| `/update-framework` | Pull latest framework changes from source repo. Compares files, shows diffs, lets you selectively apply updates. |

### Quality

| Command | Description |
|---------|-------------|
| `/add-spec` | Add a custom coding rule specific to this project. Use for internal conventions not covered by library docs. |
| `/verify` | Check code against project specs before committing. Quick validation that code follows established patterns. |
| `/audit` | Deep code review using parallel agents. Security, performance, tests, architecture reviewed simultaneously. |

### Utilities

| Command | Description |
|---------|-------------|
| `/learn` | Explain any topic using ELI5 style. Analogies, foundations first, no jargon. Use for ALL explanations. |
| `/reflect` | Analyze session data, patterns, and learnings to identify improvements. Use periodically or when prompted by awareness hooks. |
| `/checkpoint` | Save session context to brain files. Use before ending work or context compaction to preserve what was accomplished. |

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

### Framework (copied to each project)

```
.claude/
├── CLAUDE.md              # Core instructions for Claude
├── commands/              # Slash commands
│   ├── development/       # start-task, add-feature, process-tasks, commit, pr
│   ├── project-management/# sync-stack, init-project, update-framework
│   ├── specs/             # add-spec, verify, audit
│   └── utilities/         # learn, checkpoint, reflect
├── hooks/                 # Automation hooks
│   ├── safety/            # block-dangerous.js
│   ├── tracking/          # tool-tracker, track-changes, command-log, awareness
│   ├── quality/           # verify-before-stop.js
│   └── context/           # inject-context.js (command routing, voice profile)
├── skills/                # Auto-routing (you don't call these directly)
└── specs/                 # YOUR project's specs
    ├── stack-config.yaml  # Stack + active specs list + quality gates
    ├── config/            # Git, deploy, env, testing templates
    └── coding/            # Created by /sync-stack for your dependencies
```

### Brain (global, persistent across all projects)

```
~/.gemini/antigravity/brain/
├── learnings.md              # What Claude has learned (loaded every session)
├── voice-profile.md          # Writing style rules
├── framework-issues.md       # Framework bugs/gaps (loaded in claude-dev-framework)
├── tracking/sessions/        # Global session tracking (framework telemetry)
└── {workspace-uuid}/         # Per-project context
    ├── task.md               # Task history
    ├── session_state.json    # Current state for resuming
    ├── decisions.md          # Design decisions
    ├── patterns.md           # Technical patterns
    ├── research/             # Research findings
    └── overview.txt          # Daemon-generated summary
```

---

## Hooks

Hooks automate safety, tracking, and context injection. They fire automatically.

### Safety
- **block-dangerous.js** - Blocks `rm -rf /`, force push to main, credential exposure

### Tracking
- **tool-tracker.js** - Logs ALL tool calls (universal tracking)
- **track-changes.js** - Logs file modifications to brain
- **command-log.js** - Logs bash commands
- **tool-failure.js** - Logs failed tool calls
- **session-end.js** - Writes session summary
- **awareness.js** - Detects issues (large files, failures, long sessions), prompts for /reflect

### Context
- **inject-context.js** - Suggests commands from natural language, loads voice profile for writing
- **detect-pivot.js** - Prompts for /sync-stack when dependencies change

### Global (in ~/.claude/settings.json)
- **SessionStart** - Loads identity, task, learnings from brain
- **PreCompact** - Saves state before context compaction

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
