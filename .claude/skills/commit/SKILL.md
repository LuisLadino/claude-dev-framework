---
name: commit
description: >
  Commit code changes. Use when: the user says "commit", "let's commit",
  "save this", "checkpoint", "commit these changes", "ready to commit",
  or indicates a unit of work is complete and should be saved.
allowed-tools: Read, Bash, Edit
---

# Commit

You're committing changes. This is step 4 of the development workflow:

```
1. Pick Issue (GitHub)
2. Create Branch
3. Start Task → build with tests
4. Commit (YOU ARE HERE) → save completed work
5. Push + PR (when feature complete)
6. Merge (GitHub)
```

---

## What to Do

### 1. Check What Changed

```bash
git status
git diff --staged
git diff
```

If nothing to commit, say so and stop.

### 2. Load Commit Format

Read `.claude/specs/config/version-control.md` if it exists.

If not found, use conventional commits: `type(scope): description`

Types: feat, fix, refactor, test, docs, chore

### 3. Update Documentation

Before committing code, ensure docs reflect the changes. Documentation that doesn't match the code is worse than no documentation.

**For each changed file:**
1. Check for .md files in the same directory and parent directories
2. Read any found (README, CHANGELOG, etc.)
3. Update if they reference changed functionality

**Common updates:**
- `CHANGELOG.md` - Add entry for features or fixes
- `README.md` - Update if structure, API, or features changed
- Component/module docs - Update if interface changed

**Do not update:**
- `CLAUDE.md` - Only the user edits this
- Docs for unchanged code

**Report what you did:**
```
docs/api.md: updated - added new endpoint
README.md: still accurate
CHANGELOG.md: added entry for feature
```

### 4. Stage Changes

Stage the relevant files:

```bash
git add path/to/files
```

Prefer specific files over `git add -A` to avoid accidentally staging unrelated changes.

### 5. Generate Commit Message

Based on the diff, write a commit message that:
- Starts with the type (feat, fix, etc.)
- Describes WHAT changed in imperative mood
- Optionally explains WHY in the body

### 6. Commit

```bash
git commit -m "type(scope): description"
```

Show the result.

### 7. Continue or Push?

Ask: "Continue working, or push and create PR?"

- If continue: Done for now, user keeps working
- If push/PR: Guide them to the PR workflow

---

## Multiple Commits

It's normal to have multiple commits during development. Each commit should be a logical unit:
- "feat: add user validation"
- "test: add validation tests"
- "fix: handle empty email case"

These get squashed into one commit when the PR is merged.
