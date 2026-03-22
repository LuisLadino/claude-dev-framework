# Claude Kit

**Make Claude a better work partner through persistent context, pattern enforcement, and self-improvement.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What Is This?

A toolkit that makes Claude Code:

1. **Remember across sessions** - Memory persists. What Claude learns today carries forward.
2. **Work your way** - Your preferences, patterns, and voice are enforced consistently.
3. **Follow design thinking** - Skills map to phases: research, define, ideate, build, test, commit.
4. **Stay safe** - Hooks block dangerous commands, enforce specs, and scan for secrets.

Without this, every Claude session starts blank. With it, Claude has continuity, awareness, and structure.

### How It Works

```
SessionStart
  ├── session-context.js loads project definition
  ├── session-init.cjs creates session tracking, detects config changes
  ├── spawn-context-agent.cjs evaluates project state in background
  └── MEMORY.md auto-loaded (persistent memories)
       │
       ▼
During Session
  ├── inject-context.cjs (phase reminders, spec triggers, voice)
  ├── enforce-specs.cjs BLOCKS edits until specs are read
  ├── enforce-skills.cjs BLOCKS git commit (must use /commit)
  ├── enforce-voice.cjs BLOCKS pbcopy until voice guidelines reviewed
  ├── block-dangerous.cjs blocks destructive commands + secrets
  └── tracking hooks log tool calls, file changes, commands
       │
       ▼
Handoff
  └── /handoff captures context to memory/ for next session
```

### Three Layers

**System Prompt Layer** (`~/.claude/system-prompt.md`):
- Identity, methodology, lenses, teaching mode
- Appended to system prompt for primacy effect

**Global Layer** (`~/.claude/projects/` + `~/.gemini/antigravity/scripts/`):
- Per-project persistence (memory/, tracking/)
- SessionStart script loads project definition

**Kit Layer** (this repo, synced to all projects):
- Skills, commands, hooks, specs, agents

Works with any stack: JavaScript, Python, Rust, Go, Swift, Ruby, and more.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/LuisLadino/claude-kit.git

# 2. Sync kit to your project
./claude-kit/sync-kit.sh /path/to/your-project

# 3. In your project, open Claude Code and run:
/init-project    # Define what you're building
/sync-stack      # Detect stack, generate specs
```

### Updating

When the kit changes, re-run the sync script. It handles adds, updates, and deletions. Project-specific files (specs, docs, custom commands) are never touched.

```bash
# Update all downstream projects at once
./sync-kit.sh

# Update a single project
./sync-kit.sh /path/to/project

# Preview changes without applying
./sync-kit.sh --dry-run
```

---

## Workflow

### Setup (once per project)
```
Create repo → ./sync-kit.sh /path/to/project → /init-project → /sync-stack → /plan
```

### Development (repeatable)
```
GitHub Issue → /research → /define → /ideate → /build → /test → /commit → Merge
```

Skills trigger from natural language:
- "Let's work on issue #12" → /research
- "What are our options?" → /ideate
- "Build it" → /build
- "Commit" → /commit (push + PR)

### Planning
```
"Add this to backlog"    → /plan (creates issue)
"What's next?"           → /plan (reviews backlog)
```

---

## Skills

Skills auto-trigger from natural language. They map to design thinking phases.

| Skill | Phase | Triggers On |
|-------|-------|-------------|
| `research` | UNDERSTAND | "work on #X", "look into", "investigate" |
| `define` | DEFINE | "what are we solving", "root cause", "scope" |
| `ideate` | IDEATE | "options", "approaches", "what if" |
| `build` | PROTOTYPE | "build it", "implement", "code it" |
| `test` | TEST | "does it work", "verify", "test it" |
| `review` | Quality | "review this", "code review" |
| `commit` | Ship | "commit", "save this", "done" |
| `plan` | Pre-work | "what's next", "create issue", "backlog" |
| `handoff` | Continuity | "handoff", "end session" |
| `contribute-to-opensource` | Setup | "contribute to", "open source" |

### Commands (explicit only)

| Command | What It Does |
|---------|--------------|
| `/init-project` | Define product requirements |
| `/sync-stack` | Detect stack, generate specs |
| `/audit` | Deep codebase review (4 parallel agents) |
| `/learn` | Explain any topic ELI5 style |
| `/analyze` | Kit health analysis (run in split pane) |

---

## Structure

```
.claude/
├── CLAUDE.md              # Project instructions (synced to all projects)
├── skills/                # Design thinking phase skills
│   ├── research/          # UNDERSTAND
│   ├── define/            # DEFINE
│   ├── ideate/            # IDEATE
│   ├── build/             # PROTOTYPE
│   ├── test/              # TEST
│   ├── review/            # Quality gate
│   ├── commit/            # Ship
│   ├── plan/              # Backlog
│   ├── handoff/           # Continuity
│   └── contribute-to-opensource/
├── hooks/
│   ├── safety/            # block-dangerous.cjs, enforce-specs.cjs, enforce-skills.cjs, mcp-security-scan.cjs
│   ├── tracking/          # tool-tracker, track-changes, command-log, awareness
│   ├── context/           # inject-context, session-init, spawn-context-agent, subagent-context, enforce-voice
│   ├── quality/           # verify-before-stop.cjs
│   └── lifecycle/         # spawn-phase-evaluator.cjs
├── commands/
│   ├── project-management/# init-project, sync-stack
│   └── utilities/         # learn, analyze, audit
├── agents/                # context-agent, phase-evaluator
├── specs/                 # Project rules and patterns
│   ├── stack-config.yaml  # Stack + active specs + quality gates
│   ├── claude-code/       # Hooks, skills, agents, tools specs
│   ├── architecture/      # System map
│   └── config/            # Git, deploy, env, testing
└── hooks/config/          # security-patterns.json
```

---

## Hooks

Hooks fire automatically. They enforce behavior without manual reminders.

### Safety
- **block-dangerous.cjs** - Blocks `rm -rf /`, force push to main, credential exposure. Reads patterns from `security-patterns.json`.
- **enforce-specs.cjs** - Blocks edits until relevant spec is read
- **enforce-skills.cjs** - Blocks `git commit` (must use /commit skill)
- **enforce-plan.cjs** - Blocks `gh issue create` (must read plan skill)
- **mcp-security-scan.cjs** - Scans outbound MCP calls for secrets and sensitive files

### Tracking
- **tool-tracker.cjs** - Logs all tool calls
- **track-changes.cjs** - Logs file modifications
- **track-spec-reads.cjs** - Records which specs were read (enables enforce-specs)
- **command-log.cjs** - Logs bash commands
- **awareness.cjs** - Detects accumulating issues, prompts for /analyze

### Context
- **inject-context.cjs** - Phase reminders, spec auto-loading, voice profile
- **session-init.cjs** - Session tracking, config change detection
- **spawn-context-agent.cjs** - Background project evaluation at session start
- **subagent-context.cjs** - Injects project context into sub-agents
- **enforce-voice.cjs** - Blocks pbcopy until voice guidelines are reviewed (marker-based: `VOICE_CHECKED=1`)
- **detect-pivot.cjs** - Prompts for /sync-stack when dependencies change

### Quality
- **verify-before-stop.cjs** - Checks for debug statements (multi-language: JS, Python, Swift, Go, Rust, Ruby)

---

## Specs

Specs define project rules and patterns. Claude reads them before editing relevant files.

Generated by `/sync-stack`. Custom rules via `/sync-stack --custom api-conventions`.

Kit updates never overwrite specs. Your customizations are safe.

---

## Downstream Projects

This is the source repo. Changes sync to downstream projects:

| Project | Path |
|---------|------|
| my-brain | `~/Repositories/Personal/my-brain/` |
| voir | `~/Repositories/Personal/voir/` |
| airedteaming-site | `~/Repositories/Personal/airedteaming-site/` |
| adversarial-design-thinking | `~/Repositories/Personal/adversarial-design-thinking/` |
| PortfolioSite | `~/Repositories/Personal/design/PortfolioSite/site/` |

---

## License

MIT - See [LICENSE](LICENSE).
