---
name: pr
description: >
  Create a pull request. Use when: the user says "create PR", "open PR",
  "pull request", "ready for review", "let's merge", "push and PR",
  "open a pull request", or indicates the feature is complete and ready
  to be merged into main.
allowed-tools: Read, Bash
---

# Pull Request

You're creating a PR. This is step 5 of the development workflow:

```
1. Pick Issue (GitHub)
2. Create Branch
3. Start Task → build with tests
4. Commit → save work (can be multiple commits)
5. Push + PR (YOU ARE HERE) → propose merge to main
6. Merge (GitHub) → squash and merge, delete branch
```

---

## What is a Pull Request?

A PR asks to merge your branch into main. It:
- Shows what changed (the diff)
- Links to the issue it addresses
- Provides a place for review (even self-review)
- Creates a record of why changes were made

For solo work, PRs are still valuable: they force you to review your own changes and create clear history.

---

## What to Do

### 1. Check Prerequisites

```bash
git branch --show-current
gh --version
```

If on main: "You're on main. Create a feature branch first, or push directly to main?"

If gh not available: "Install GitHub CLI: brew install gh"

### 2. Check Remote Status

```bash
git status
git log origin/main..HEAD --oneline 2>/dev/null || git log main..HEAD --oneline
```

If commits exist locally that aren't pushed, push first:

```bash
git push -u origin $(git branch --show-current)
```

### 3. Show What Will Be in the PR

```bash
git log main..HEAD --oneline
git diff main..HEAD --stat
```

Show:
- Branch name
- Number of commits
- Files changed

### 4. Identify Linked Issue

Extract issue number from branch name (e.g., `feature/12-pillar-types` → issue #12):

```bash
git branch --show-current | grep -oE '[0-9]+' | head -1
```

If found, this PR will close that issue.

### 5. Generate PR Content

**Title:** Short description from branch name or commits

**Body:**
```markdown
## Summary
- What changed
- Why it changed

Closes #X

## Test Plan
- How to verify this works
```

**Important:** Always include `Closes #X` (not in a subsection) so GitHub auto-closes the issue on merge.

### 6. Create the PR

```bash
gh pr create --title "title" --body "body"
```

Show the PR URL.

### 7. What Happens Next

- CI runs automatically (if configured)
- Review the PR yourself or have others review
- When ready: Squash and merge
- Delete the branch after merge

The issue closes automatically if you used "Closes #X" in the PR body.
