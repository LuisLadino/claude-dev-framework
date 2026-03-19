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

### 3. Documentation Check (MANDATORY — do not skip)

Before committing, verify documentation reflects the changes.

**Step 3a: Determine what changed.**

From the diff, classify the change:
- Feature or fix → CHANGELOG.md MUST have an entry
- Structural change (new dirs, renamed modules) → README.md likely needs updating
- API/interface change → component specs may be stale
- New component/module → component spec may be needed (see /sync-stack Step 9)

**Step 3b: Read and check each file.**

MUST read each file that exists. Do not assume "still accurate" without reading.

```bash
# Check if these exist and read them
cat CHANGELOG.md 2>/dev/null | head -30
cat README.md 2>/dev/null | head -40
ls .claude/specs/components/ 2>/dev/null
```

**Step 3c: Update what's stale.**

Document current state only. NEVER describe what changed — only what IS.

**Do not update:** `CLAUDE.md` — only the user edits this.

**Step 3d: If a file should exist but doesn't** (e.g., no CHANGELOG.md in a project with features), create it.

**Step 3e: Report.** You MUST output a documentation check report before proceeding to Step 4:

```
DOCUMENTATION CHECK:
- CHANGELOG.md: [added entry / still accurate / created / N/A]
- README.md: [updated / still accurate / N/A]
- Component specs: [updated X / still accurate / N/A]
```

### 4. Stage and Commit

```bash
git add path/to/files
SKILL_ACTIVE=1 DOCS_CHECKED=1 git commit -m "type(scope): description"
```

Prefer specific files over `git add -A`.

**Note:** `SKILL_ACTIVE=1 DOCS_CHECKED=1` bypasses the enforce-skills hook. BOTH markers are required — the hook verifies you completed Step 3 (documentation check) before allowing the commit. Only use within this skill after completing Step 3.

### 5. Push

```bash
git push -u origin $(git branch --show-current)
```

### 6. Update Related Issues

If this work relates to a GitHub issue, comment on the issue with what was done.

Use `gh api` to avoid enforce-skills hook blocking:

```bash
gh api repos/{owner}/{repo}/issues/{number}/comments -f body="comment text"
```

**What to include:**
- What this commit accomplished toward the issue
- Discoveries or decisions made during the work
- What still needs doing or testing

This is how issues capture the design thinking journey. The commit message says WHAT changed. The issue comment says WHY and what we learned.

### 7. Create PR with Auto-merge

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

### 8. Enable Auto-merge

```bash
gh pr merge --auto --squash --delete-branch
```

This queues the PR to merge automatically after CI checks pass.

### 9. Done

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
