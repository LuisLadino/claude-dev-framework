# Specs

Your project's coding specs. Claude reads these before every task.

---

## Structure

```
specs/
├── stack-config.yaml    # Your tech stack + active specs list
├── config/              # Git, deploy, environment, testing (included)
└── coding/              # Created by /sync-stack based on your stack
```

Other directories (`architecture/`, `design/`, `documentation/`) are created as needed.

---

## Quick Start

```
/sync-stack              # Detects stack, generates specs
/start-task              # Uses specs when coding
```

---

## How It Works

1. `/sync-stack` detects your tech and researches best practices
2. Creates spec files in `coding/` (or other directories as needed)
3. Updates `stack-config.yaml` with active specs
4. `/start-task` loads specs listed in config
5. Claude shows you what patterns will be applied
6. You approve, Claude builds following your specs

---

## Customization

Edit any file to match your team's patterns. Add new specs with `/add-spec`.

Framework updates never touch this directory.
