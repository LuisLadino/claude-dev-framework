---
name: start-task
description: >
  Start working on a coding task. Use when: the user mentions an issue number,
  says "let's work on", "implement", "build", "start", "begin", references a
  GitHub issue, or indicates they're ready to code something. This is the entry
  point to the development workflow.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Start Task

You're beginning work on a coding task. This is step 3 of the development workflow:

```
1. Pick Issue (GitHub)
2. Create Branch (git checkout -b type/issue-number-description)
3. Start Task (YOU ARE HERE) → load specs, understand task, execute with tests
4. Commit (when units of work complete)
5. Push + PR (when feature complete)
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

Read `.claude/specs/stack-config.yaml` to understand the tech stack.

If it exists, read all specs listed under the `specs:` field. These define how code should be written in this project.

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

### 4. Execute with Tests

Build incrementally. Write tests as you go, not as a separate phase.

For each unit of functionality:
1. Write the code
2. Write tests that verify it works
3. Run tests to confirm
4. Move to next unit

This is how professional development works. Tests are part of building, not an afterthought.

### 5. Verify

Run quality checks from stack-config.yaml (lint, type-check, test, build).

Fix any failures before considering the work complete.

### 6. Offer to Commit

When a meaningful unit of work is complete and tests pass:

"Ready to commit? Or continue working?"

If yes, follow the commit workflow.

---

## Key Principles

- **Tests are not optional.** Write them as you build.
- **Incremental progress.** Small working pieces, not big bang.
- **Specs define patterns.** Follow what's in `.claude/specs/`.
- **Verify before claiming done.** Run the checks.
