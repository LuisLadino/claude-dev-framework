---
name: commit
description: >
  Commit and create PR. Use when: the user says "commit", "let's commit",
  "save this", "checkpoint", "done", "ready to merge", or indicates work
  is complete. Does the full flow: commit → push → PR.
allowed-tools: Read, Bash, Edit
---

# Commit

You're finishing work. This skill does the full flow:

```
Commit → Push → Create PR → Enable Auto-merge
```

GitHub merges automatically after CI checks pass.

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

Before committing, ensure docs reflect the changes.

**Check and update if needed:**
- `CHANGELOG.md` - Add entry for features or fixes
- `README.md` - Update if structure, API, or features changed
- Component/module docs - Update if interface changed

**Do not update:**
- `CLAUDE.md` - Only the user edits this

**Report what you did:**
```
CHANGELOG.md: added entry
README.md: still accurate
```

### 4. Stage and Commit

```bash
git add path/to/files
SKILL_ACTIVE=1 git commit -m "type(scope): description"
```

Prefer specific files over `git add -A`.

**Note:** `SKILL_ACTIVE=1` bypasses the enforce-skills hook. Only use within this skill.

### 5. Push

```bash
git push -u origin $(git branch --show-current)
```

### 6. Create PR with Auto-merge

Extract issue number from branch name if present:

```bash
git branch --show-current | grep -oE '[0-9]+' | head -1
```

Create PR with summary from commits:

```bash
gh pr create --title "title" --body "body"
```

**PR body format:**
```markdown
## Summary
- What changed
- Why it changed

Addresses #X

## Test Plan
- How to verify
- [ ] Tested locally
- [ ] Verified fix works
```

**Issue linking (commit ≠ close):**

| Keyword | When to use |
|---------|-------------|
| `Closes #X` | Fix is **tested and verified working**. Issue can close on merge. |
| `Addresses #X` | Code is written but **not yet verified**. Issue stays open. |
| `Related to #X` | Partial progress. More work needed. |

**Default to `Addresses`** - issues close when fixes are VERIFIED, not when code merges. Only use `Closes` when you've actually tested the fix works.

### 7. Enable Auto-merge

```bash
gh pr merge --auto --squash --delete-branch
```

This queues the PR to merge automatically after CI checks pass.

### 8. Done

Show the PR URL. GitHub handles the rest:
- CI runs checks
- If pass, squash-merges automatically
- Deletes branch after merge
- Closes linked issue

---

## Notes

- Each commit should be a logical unit
- Multiple commits get squashed on merge
- Branch auto-deletes after merge
- Requires: repo has branch protection rules allowing auto-merge
