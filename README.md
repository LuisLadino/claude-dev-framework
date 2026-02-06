# Claude Development Framework

**A structured `.claude/` directory that makes Claude Code follow your specs consistently.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.2.0-brightgreen.svg)](CHANGELOG.md)

---

## What Is This?

A portable framework that lives in your project's `.claude/` directory and gives Claude Code:

- **Your coding specs** - enforced on every task
- **Smart routing** - skills auto-detect what you need
- **Stack awareness** - adapts to any technology via `/sync-stack`
- **Self-updating** - pull improvements with `/update-framework`

Works with any stack: React, Vue, Svelte, Next.js, Python, Rust, Go, Swift, etc.

---

## Setup

### 1. Fork and copy

```bash
git clone https://github.com/YOUR-USERNAME/claude-dev-framework.git
cp -r claude-dev-framework/.claude your-project/.claude
```

### 2. Set up your stack

```
/sync-stack       # Detects stack, researches docs, generates specs
```

### 3. Point at your fork

In `.claude/framework-source.txt`:
```
https://github.com/YOUR-USERNAME/claude-dev-framework
```

### 4. Start building

```
/start-task       # Every task enforces your specs
```

---

## Commands

### Development

| Command | Purpose |
|---------|---------|
| `/start-task` | Any coding task. Loads specs, implements, verifies. |
| `/add-feature` | Plan complex features. Creates PRD + tasks. |
| `/process-tasks` | Execute a task list sequentially. |

### Project Setup

| Command | Purpose |
|---------|---------|
| `/sync-stack` | **Main setup command.** Detects stack, researches docs, generates specs. |
| `/init-project` | Optional. Define product requirements before coding. |
| `/generate-project-specs` | Optional. Enterprise PRD/architecture docs. |
| `/update-framework` | Pull framework updates from source. |

### Quality

| Command | Purpose |
|---------|---------|
| `/add-spec` | Create a custom spec file. |
| `/verify` | Audit code against your specs. |
| `/learn` | Explain anything in plain English. |

---

## Structure

```
.claude/
├── CLAUDE.md              # Core instructions
├── commands/              # Slash commands
├── skills/                # Auto-routing
└── specs/                 # YOUR customizations
    ├── stack-config.yaml  # Your stack
    ├── coding/            # Coding patterns
    ├── architecture/      # Project structure
    ├── design/            # Design tokens
    ├── documentation/     # Doc requirements
    └── config/            # Git, deploy, env, testing
```

---

## How It Works

1. Run `/sync-stack` to detect your tech and generate specs
2. Specs are saved in `.claude/specs/`
3. When you run `/start-task`, Claude loads your specs
4. Shows you what patterns will be applied
5. You approve, Claude implements
6. Verifies with format, lint, type-check, tests

---

## Customization

Everything in `specs/` is yours. Framework updates never touch it.

---

## License

MIT - See [LICENSE](LICENSE).
