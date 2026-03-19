# Specs

Reference documents Claude reads before taking actions. Specs prevent context drift by ensuring guidelines are fresh before each edit.

---

## Source of Truth: stack-config.yaml

`stack-config.yaml` defines everything:
- Which specs exist
- What files each spec governs (`applies_to` patterns)
- Related specs that should be read together

```yaml
specs:
  claude-code:
    - name: hooks
      file: claude-code/hooks.md
      applies_to:
        - ".claude/hooks/**/*.cjs"
      description: "Hook configuration and behavior"
```

The enforce-specs hook reads stack-config.yaml to determine which spec to require before edits.

---

## Structure

```
specs/
├── stack-config.yaml    # Source of truth for specs and enforcement
├── config/              # Git, deploy, environment, testing
├── coding/              # Language and library patterns
├── architecture/        # File structure, project organization
├── design/              # Design tokens, styling conventions
├── documentation/       # Code comments, docstrings
└── claude-code/         # Claude Code internals (this framework)
```

Directories are created as needed based on your stack.

---

## How It Works

1. `/sync-stack` detects your tech stack
2. Researches official docs for each technology
3. Generates spec files with content
4. Updates `stack-config.yaml` with specs and their applies_to patterns
5. `enforce-specs.cjs` reads stack-config.yaml and blocks edits until spec is read
6. `/build` loads relevant specs before implementation

---

## Commands

| Command | Purpose |
|---------|---------|
| `/sync-stack` | Auto-generate specs from library docs |
| `/sync-stack prisma` | Add specs for a specific dependency |
| `/sync-stack --custom api-conventions` | Add custom project-specific rules |

---

## Customization

- Edit any generated file to match your team's patterns
- Update `applies_to` patterns in stack-config.yaml to change enforcement
- Use `/sync-stack --custom` for internal rules not covered by library docs
