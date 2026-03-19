---
name: start-task
description: >
  Start working on a task. Use when: the user mentions an issue number,
  says "let's work on", "implement", "build", "start", "begin", references a
  GitHub issue, or indicates they're ready to work on something. This is the entry
  point to the project workflow.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Start Task

You're beginning work on a task. This is step 3 of the project workflow:

```
1. Pick Issue (GitHub)
2. Create Branch (git checkout -b type/issue-number-description)
3. Start Task (YOU ARE HERE) → load specs, understand task, execute
4. Commit (when units of work complete)
5. Push + PR (when work complete)
6. Merge (GitHub)
```

---

## What to Do

### 1. Identify the Issue

If user referenced a GitHub issue number:
```bash
gh issue view {number}
```

If user described work without an issue number, ask: "Should we create an issue for this first? (/plan)"

Load the issue body as task context — it contains the problem, rationale, and any prior decisions.

### 2. Create Branch and Move to In Progress

```bash
# Check current branch
git branch --show-current

# If on main, create a branch from the issue
# Use type from issue labels: feat/, fix/, chore/, docs/
git checkout -b {type}/{issue-number}-short-description

# Mark issue as in progress
gh issue edit {number} --remove-label "status/backlog" --remove-label "status/ready" --add-label "status/in-progress"
```

Branch naming: `feat/31-dynamic-spec-triggers`, `fix/34-phase-evaluator`, `chore/33-downstream-sync`

If a branch for this issue already exists, check it out instead of creating a new one.

### 3. Load Specs

Read the spec files in `.claude/specs/` — their frontmatter defines what rules apply to which files.

### 4. Understand the Task

The issue body should have the context. Ask clarifying questions only if genuinely ambiguous:
- What exactly should this do?
- Where should it go?
- Any specific requirements?

### 4. Execute

Work incrementally. If the project has tests, write them as you go.

For each unit of work:
1. Make the changes
2. Verify they work (tests, manual check, or review — whatever applies)
3. Move to next unit

Verification is part of the work, not an afterthought.

### 5. Verify

Run any quality checks defined in the project (lint, type-check, test, build — whatever applies).

Fix any failures before considering the work complete.

### 6. Offer to Commit

When a meaningful unit of work is complete and verified:

"Ready to commit? Or continue working?"

If yes, follow the commit workflow.

---

## Key Principles

- **Verify as you go.** Don't skip verification steps.
- **Incremental progress.** Small working pieces, not big bang.
- **Specs define patterns.** Follow what's in `.claude/specs/`.
- **Verify before claiming done.** Run the checks.
