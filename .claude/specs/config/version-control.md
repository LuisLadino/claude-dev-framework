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
