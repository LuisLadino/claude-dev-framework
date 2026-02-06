# /pr

Create a pull request for the current branch.

A pull request (PR) asks to merge your branch into main. Used for code review or just to have a record of changes.

---

## STEP 1: Check Prerequisites

```bash
# Check we're not on main
git branch --show-current

# Check gh CLI is available
gh --version
```

If on main, ask user to create a branch first or explain they can just push directly.

If gh not installed, explain they need to install GitHub CLI: `brew install gh` or https://cli.github.com

---

## STEP 2: Load Specs

Read `.claude/specs/config/version-control.md` for PR format and conventions.

If not found, use standard format.

---

## STEP 3: Show What Will Be Included

```bash
# Get base branch (usually main)
git remote show origin | grep "HEAD branch"

# Show commits that will be in PR
git log main..HEAD --oneline

# Show files changed
git diff main..HEAD --stat
```

Show user:
- Current branch name
- Base branch (main)
- Number of commits
- Files changed

---

## STEP 4: Generate PR Content

Based on commits and diff, generate:

**Title:** Short description (from branch name or commit messages)

**Description:**
- What changed
- Why it changed
- How to test (if applicable)

Show and ask:

```
Title: [generated title]

Description:
[generated description]

Create PR? (yes / edit / cancel)
```

---

## STEP 5: Create PR

```bash
gh pr create --title "title" --body "description"
```

Show the PR URL when done.

---

## Notes

- Requires GitHub CLI (`gh`) to be installed and authenticated
- Works with GitHub. For GitLab/Bitbucket, different CLI needed.
- If you just push to main directly, you don't need this command
