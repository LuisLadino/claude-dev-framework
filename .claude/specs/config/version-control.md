---
name: version-control
description: >
  Project-specific git configuration. Covers branch strategy, commit format, pull request conventions, and protected branch rules. Loaded by the commit skill.
applies_to: []
triggers: [commit, git, branch, push, merge]
category: config
---

# Version Control

Project-specific git configuration.

---

## Branch Strategy

```
main              # Production
develop           # Integration (optional)
feature/*         # New features
fix/*             # Bug fixes
```

---

## Commit Format

```
type: description

Types: feat, fix, docs, style, refactor, test, chore
```

**Co-Authored-By:** Claude Code's built-in commit behavior adds `Co-Authored-By: Claude`. This is expected and acceptable.

Examples:
- `feat: add user authentication`
- `fix: resolve login redirect issue`
- `docs: update API documentation`

---

## Pull Requests

- Branch from: `main`
- Merge to: `main`
- Require: passing CI, code review

---

## Protected Branches

- `main` - no direct push, require PR

---

## Notes

_Add team-specific conventions here_
