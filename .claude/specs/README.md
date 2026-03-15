# Specs

Your project's coding specs. Claude reads these before every task.

---

## Structure

```
specs/
├── stack-config.yaml    # Your tech stack + active specs list
├── config/              # Git, deploy, environment, testing
├── coding/              # Language and library patterns
├── architecture/        # File structure, project organization
├── design/              # Design tokens, styling conventions
├── documentation/       # Code comments, docstrings
└── claude-code/         # Claude Code internals (framework-specific)
```

Directories are created as needed based on your stack.

The `claude-code/` directory is specific to claude-dev-framework. It contains specs about Claude Code itself - tools, hooks, skills, agents, and anti-patterns.

---

## Quick Start

```
/sync-stack              # Detects stack, generates all specs
/start-task              # Uses specs when coding
```

---

## How It Works

1. `/sync-stack` detects your tech stack
2. Researches official docs for each technology
3. Generates specs across all relevant categories
4. Updates `stack-config.yaml` with active specs
5. `/start-task` loads specs and enforces patterns

---

## Commands

| Command | Purpose |
|---------|---------|
| `/sync-stack` | Auto-generate specs from library docs (React, Next.js, etc.) |
| `/sync-stack prisma` | Add specs for a specific dependency |
| `/sync-stack --custom api-conventions` | Add custom project-specific rules |


---

## Customization

- Edit any generated file to match your team's patterns
- Use `/sync-stack --custom` for internal rules not covered by library docs
- Framework updates never touch this directory
