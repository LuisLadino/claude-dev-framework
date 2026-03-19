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
│  PreCompact → Saves state to brain                          │
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
   │           │          └─► /analyze investigates, suggests changes
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

**Framework Layer** (this repo - copied to projects):
- Slash commands for workflows
- Hooks for safety, tracking, context injection
- Specs for pattern enforcement

Works with any stack: React, Vue, Svelte, Next.js, Python, Rust, Go, etc.

---

## Quick Start

```bash
# 1. Fork this repo, then clone your fork
git clone https://github.com/YOUR-USERNAME/claude-kit.git

# 2. Copy .claude/ to your project
cp -r claude-kit/.claude your-project/.claude

# 3. In your project, run
/sync-stack
```

That's it. Claude now follows your patterns.

---

## Development Workflow

Skills trigger automatically from natural language. You can also invoke explicitly.

### Setup (once per project)

```
Discuss → Document → Create repo → Copy framework → /init-project → /sync-stack → Set up GitHub
```

### Development (repeatable)

```
GitHub Issue → Branch → "let's build" → Build + Test → "commit" → Push → "create PR" → Merge
```

Just talk naturally:
- "Let's work on issue #12" → loads specs, starts work
- "Let's commit" → updates docs, commits
- "Create a PR" → creates PR linked to issue

### Planning

```
"Add this to backlog"    # Creates GitHub issue
"What's next?"           # Reviews backlog, recommends
"Let's plan"             # Organize and prioritize
```

---

## Skills

Skills auto-trigger from natural language. Source of truth in `.claude/skills/`.

### Development

| Skill | Triggers On | What It Does |
|-------|-------------|--------------|
| `start-task` | "work on issue #X", "implement", "build" | Load specs, execute with tests |
| `commit` | "commit", "save this", "checkpoint" | Update docs, commit changes |
| `pr` | "create PR", "ready for review" | Create PR linked to issue |
| `add-feature` | "plan", "design", "break down" | Plan complex features |

### Planning

| Skill | Triggers On | What It Does |
|-------|-------------|--------------|
| `plan` | "add to backlog", "what's next", "prioritize" | Manage GitHub issues, milestones |

### Setup (explicit only)

| Command | What It Does |
|---------|--------------|
| `/init-project` | Define product requirements |
| `/sync-stack` | Detect stack, generate specs |

### Quality

| Command | Description |
|---------|-------------|
| `/audit` | Deep code review using parallel agents. Security, performance, tests, architecture reviewed simultaneously. |

### Utilities

| Command | Description |
|---------|-------------|
| `/learn` | Explain any topic using ELI5 style. Analogies, foundations first, no jargon. Use for ALL explanations. |
| `/analyze` | Run as framework analyst. Evaluates framework health, analyzes session data, iterates on the system. Run in a split terminal pane alongside your working session. |

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
│   ├── development/       # start-task, add-feature, commit, pr
│   ├── project-management/# sync-stack, init-project
│   └── utilities/         # learn, analyze, audit
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
├── framework-issues.md       # Framework bugs/gaps (loaded in claude-kit)
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
- **Add custom specs** with `/sync-stack --custom`
- **Create custom directories** - Just add them to specs/ and list in stack-config.yaml

---

## License

MIT - See [LICENSE](LICENSE).
