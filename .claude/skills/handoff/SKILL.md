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

**Output:** Write `handoff.md` to the brain folder from your session context.

---

## What to Capture

Answer these questions concisely:

1. **What were we doing?** - Task/issue, current state
2. **What did we discover?** - Decisions, problems solved, things that didn't work
3. **What's next?** - Clear action for resuming, any blockers

---

## Steps

### 1. Find Brain Path

Your session context (from SessionStart) includes:
```
Brain: ~/.gemini/antigravity/brain/{uuid}/
```

Use that exact path.

### 2. Write handoff.md

```bash
cat > ~/.gemini/antigravity/brain/{uuid}/handoff.md << 'EOF'
# Session Handoff - {Brief Title}

**Created:** {YYYY-MM-DD}
**Reason:** {Why handing off - end of day, context switch, etc.}

## What We Were Doing

{1-3 sentences: task/issue, where we are in the work}

## What We Discovered

{Bullet points: key decisions, problems solved, things that failed}

## Next Steps

{Clear actions for resuming}

## Related

{Links to issues, PRs, files if relevant}
EOF
```

### 3. Confirm

Tell the user what was captured.

---

## Guidelines

- **Keep it short.** Next session needs context, not documentation.
- **Focus on resumption.** What does the next session need to know?
- **Don't duplicate.** Task lists belong in GitHub issues, not here.
- **Overwrite is OK.** Each handoff replaces the previous (archived on read).
