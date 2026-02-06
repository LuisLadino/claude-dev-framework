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

Before committing, check if documentation needs updating:

| If you changed... | Consider updating... |
|-------------------|----------------------|
| Commands (`.claude/commands/`) | README.md, CONTRIBUTING.md, CHANGELOG.md |
| Skills (`.claude/skills/`) | README.md, CHANGELOG.md |
| Specs structure (`.claude/specs/`) | README.md, CHANGELOG.md |
| Any new feature | CHANGELOG.md |
| Any bug fix | CHANGELOG.md |

If docs need updating, update them now before committing.

---

## STEP 4: Stage and Commit

```bash
git add -A
git commit -m "generated message"
```

Show result.
