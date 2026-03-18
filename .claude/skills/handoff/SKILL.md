---
name: handoff
description: >
  Capture session context for continuity. Use when: the user says "handoff",
  "let's handoff", "end session", "save context", "I'm done for now",
  "wrapping up", "switching context", or indicates they're ending work.
allowed-tools: Read, Write, Bash
---

# Handoff

You are capturing session context so the next session can resume seamlessly.

**Output:** Write a project memory to `.claude/projects/` memory directory.

---

## What to Capture

Answer these questions concisely:

1. **What were we doing?** - Task/issue, current state
2. **What did we discover?** - Decisions, problems solved, things that didn't work
3. **What's next?** - Clear action for resuming, any blockers

---

## Steps

### 1. Find Memory Path

The memory directory for this project lives at:
```
~/.claude/projects/{workspace-key}/memory/
```

To get the workspace key, convert the git root path: replace `/` with `-` and prefix with `-`.

Example: `/Users/luisladino/Repositories/Personal/my-project` becomes `-Users-luisladino-Repositories-Personal-my-project`

### 2. Write handoff as project memory

Use the Write tool to create/overwrite the handoff file:

**File:** `~/.claude/projects/{workspace-key}/memory/project_handoff.md`

```markdown
---
name: session-handoff
description: Handoff context from {date} session — {brief description}
type: project
---

# Session Handoff - {Brief Title}

**Created:** {YYYY-MM-DD}
**Reason:** {Why handing off - end of day, context switch, etc.}

## What We Were Doing

{1-3 sentences: task/issue, where we are in the work}

## What We Discovered

{Bullet points: key decisions, problems solved, things that failed}

## What Needs Testing in New Session

{Things that can only be verified in a fresh session}

## Still Open

{Issues, blockers, unfinished items}

## Related

{Commits, issues, PRs, files if relevant}
```

### 3. Update MEMORY.md

Add or update the handoff entry in `~/.claude/projects/{workspace-key}/memory/MEMORY.md`:

```markdown
- [Session handoff](project_handoff.md) — {brief description of what was done}
```

### 4. Confirm

Tell the user what was captured.

---

## Guidelines

- **Keep it short.** Next session needs context, not documentation.
- **Focus on resumption.** What does the next session need to know?
- **Don't duplicate.** Task lists belong in GitHub issues, not here.
- **Overwrite is OK.** Each handoff replaces the previous.
- **Use the memory frontmatter.** The `description` field helps future sessions decide if this memory is relevant.
