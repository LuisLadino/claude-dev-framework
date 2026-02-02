# Claude Development Framework

**A structured `.claude/` directory that makes Claude Code follow your standards consistently.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.1-brightgreen.svg)](CHANGELOG.md)

---

## What Is This?

A portable framework that lives in your project's `.claude/` directory and gives Claude Code:

- **Your coding standards** - enforced on every task
- **Organized commands** - structured workflows for common development tasks
- **Stack awareness** - adapts to any technology via `/research-stack`
- **Self-updating** - pull framework improvements with `/update-framework`

Works with any stack: React, Vue, Python, Rust, Go, Swift, etc.

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
├── CLAUDE.md                              # Framework instructions
├── framework-source.txt                   # Update source URL
├── commands/
│   ├── coding-framework/                  # Development workflow
│   │   ├── init-project.md                # /init-project
│   │   ├── start-task.md                  # /start-task
│   │   ├── research-stack.md              # /research-stack
│   │   ├── sync-stack.md                  # /sync-stack
│   │   ├── add-feature.md                 # /add-feature (create-prd)
│   │   ├── generate-project-specs.md      # /generate-project-specs
│   │   ├── generate-tasks.md              # /generate-tasks
│   │   └── process-tasks.md               # /process-tasks
│   ├── standards-management/              # Standards enforcement
│   │   ├── standards.md                   # /standards
│   │   ├── add-standard.md                # /add-standard
│   │   ├── analyze-standards.md           # /analyze-standards
│   │   └── update-framework.md            # /update-framework
│   └── utilities/                         # Helpers
│       ├── learn.md                       # /learn
│       ├── verify.md                      # /verify
│       └── contribute-to-opensource.md    # /contribute-to-opensource
├── config/
│   ├── version-control.md                 # Git workflow standards
│   ├── deployment.md                      # Deployment process
│   └── environment.md                     # Dev environment setup
└── your-stack/                            # YOUR customizations
    ├── stack-config.yaml                  # Your stack definition
    ├── README.md                          # Customization guide
    ├── coding-standards/                  # Your coding patterns
    ├── architecture/                      # Your architecture docs
    ├── design-standards/                  # Your design standards
    └── documentation-standards/           # Your doc standards
```

---

## Commands

### Coding Framework

| Command | Purpose |
|---------|---------|
| `/init-project` | Initialize a new project with framework structure |
| `/start-task` | Begin any coding task with standards enforcement |
| `/research-stack` | Generate AI-researched standards for your stack |
| `/sync-stack` | Sync stack configuration with current project |
| `/add-feature` | Create a PRD for a new feature |
| `/generate-project-specs` | Generate project specifications |
| `/generate-tasks` | Convert PRD into task list |
| `/process-tasks` | Execute tasks sequentially |

### Standards Management

| Command | Purpose |
|---------|---------|
| `/standards` | Enforce standards on current work |
| `/add-standard` | Add a custom standard |
| `/analyze-standards` | Analyze codebase to discover patterns |
| `/update-framework` | Pull framework updates from source |

### Utilities

| Command | Purpose |
|---------|---------|
| `/learn` | Explain concepts in your stack's context |
| `/verify` | Check code against standards |
| `/contribute-to-opensource` | Guide for contributing to open source |

---

## How It Works

1. **You define your stack** in `your-stack/stack-config.yaml`
2. **You generate standards** via `/research-stack` (AI researches your stack's best practices)
3. **Claude reads standards before every task** and shows you a standards check
4. **Quality is enforced** - standards can't be skipped

### Adding Your Own Commands

Create a `.md` file in the appropriate command category:

```
.claude/commands/utilities/my-command.md
```

The file content becomes the command prompt. Claude Code will recognize it as `/my-command`.

---

## Customization

Everything in `your-stack/` is yours to customize:

- **`stack-config.yaml`** - Define your technologies
- **`coding-standards/`** - Your coding patterns and conventions
- **`architecture/`** - Your project structure and patterns
- **`design-standards/`** - Your design system standards
- **`documentation-standards/`** - Your documentation requirements

Framework updates never touch `your-stack/`.

---

## Updating

```
/update-framework
```

This pulls the latest commands and config from the framework source while preserving your customizations in `your-stack/`.

---

## What Changed in v2.0

v2.0 is a structural simplification:

- **Organized commands into categories** (coding-framework, standards-management, utilities)
- **Removed `.claude/tools/`** - Claude Code has native tool integration
- **Removed `.claude/workflows/`** - Redundant with command files
- **Removed `.claude/templates/`** - `/research-stack` generates standards dynamically
- **Moved config out of templates** - `config/` is now a top-level directory
- **Added `framework-source.txt`** - Enables `/update-framework` to find the source repo
- **Removed install/uninstall scripts** - Fork-based setup is simpler and how people actually use it

See [CHANGELOG.md](CHANGELOG.md) for full details.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT License - See [LICENSE](LICENSE).

---

**[Report Bug](https://github.com/LuisLadino/claude-dev-framework/issues) | [Request Feature](https://github.com/LuisLadino/claude-dev-framework/issues)**
