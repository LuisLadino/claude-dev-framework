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

### 1. Check Branch Status

```bash
git branch --show-current
git status
```

If on main, ask: "Create a branch first? What issue are you working on?"

If user mentioned an issue number, suggest: `git checkout -b feature/{issue-number}-short-description`

### 2. Load Specs

Read `.claude/specs/stack-config.yaml` to understand the project configuration.

If it exists, read all specs listed under the `specs:` field. These define the rules and patterns for this project.

If no stack-config exists, note this and proceed with general best practices.

### 3. Understand the Task

If user referenced a GitHub issue:
```bash
gh issue view {number}
```

Move the issue to "In Progress" on the project board:
```bash
# Get project number first if needed
gh project item-list --owner @me --format json | head -20

# Move issue to In Progress (adjust project number as needed)
gh issue edit {number} --add-label "status/in-progress"
```

Ask clarifying questions only if genuinely ambiguous:
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
