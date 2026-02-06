# Specs

Your project's coding specs. Claude reads these before every task.

---

## Structure

```
specs/
├── stack-config.yaml    # Your tech stack
├── coding/              # Framework/language patterns
├── architecture/        # File structure, patterns
├── design/              # Design tokens
├── documentation/       # Doc requirements
└── config/              # Git, deploy, environment, testing
```

---

## Quick Start

```
/sync-stack              # Detects stack, generates specs
/start-task              # Uses specs when coding
```

---

## How It Works

1. `/sync-stack` detects your tech and researches best practices
2. Specs are saved here in `coding/`, `architecture/`, etc.
3. `/start-task` loads relevant specs before implementing
4. Claude shows you what patterns will be applied
5. You approve, Claude builds following your specs

---

## Customization

Edit any file to match your team's patterns. Add new specs with `/add-spec`.

Framework updates never touch this directory.

---

## Files

| Directory | Purpose |
|-----------|---------|
| `coding/` | Language and framework patterns (e.g., `typescript-specs.md`) |
| `architecture/` | File structure, component patterns |
| `design/` | Design tokens, design system |
| `documentation/` | Comment style, doc requirements |
| `config/` | Git, deploy, environment, testing |
