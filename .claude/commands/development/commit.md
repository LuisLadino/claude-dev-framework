# /commit

Commit all changes following your version-control specs.

---

## STEP 1: Load Specs

Read `.claude/specs/config/version-control.md` for commit format.

If not found, use conventional commits: `type(scope): description`

---

## STEP 2: Check Status

```bash
git status
git diff --staged
git diff
```

If nothing to commit, say so and stop.

---

## STEP 3: Documentation Check

Before committing, check if documentation needs updating. The goal is to keep the repo understandable for Claude and human users.

### What to Check

For each directory or file you changed, ask:

1. **Is there a README in or near that directory?** If yes, does it still accurately describe the contents?
2. **Did you add new files?** Are they listed/explained in the relevant README?
3. **Did you change the structure?** Does the README reflect the new structure?
4. **Did you add new features or commands?** Are they documented?

### Common Documentation Files

| If you changed... | Check/update... |
|-------------------|-----------------|
| Any directory with a README | That directory's README.md |
| `.claude/commands/` | README.md, CONTRIBUTING.md |
| `.claude/skills/` | README.md |
| `.claude/specs/` | README.md |
| Source code | Relevant docs/, README files |
| Configuration | README or docs explaining config |
| New feature | CHANGELOG.md (if exists) |
| Bug fix | CHANGELOG.md (if exists) |

### What NOT to Update

- `CLAUDE.md` (system instructions) — only the user should edit this
- Documentation for unchanged code
- Files outside the current repo

### Process

1. List the directories/files you changed
2. For each, find the nearest README or documentation file
3. Read it and check if it's still accurate
4. If outdated, update it before committing
5. If no README exists and one would help, consider creating one

---

## STEP 4: Stage and Commit

```bash
git add -A
git commit -m "generated message"
```

Show result.
