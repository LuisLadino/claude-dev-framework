---
description: Save session context to brain files. Use before ending work or context compaction to preserve what was accomplished.
---

# /checkpoint - Create Context Checkpoint

Save session context to the Antigravity brain for future sessions.

## When to Use

- Before context compaction
- When switching to a different project
- At the end of a work session
- When you want to preserve session context for future reference

## Steps

1. Get from your session start context:
   - **Brain path** (look for "Brain:")
   - **Current workspace** (look for "Current workspace:")

2. Load session tracking data from the brain:
   ```bash
   ls -t ~/.gemini/antigravity/brain/*/sessions/*.json 2>/dev/null | head -5
   cat [path-to-session-file]
   ```

   Session tracking files contain:
   - `filesModified` - files edited
   - `filesCreated` - new files
   - `commands` - bash commands with stdout
   - `operations` - timestamped log

3. Review conversation for:
   - Tasks completed
   - Decisions made (with rationale)
   - Patterns discovered
   - Research findings
   - Open issues

4. Write to brain path:

### task.md (APPEND)

```markdown
## Task: [Main task]
- Status: [In Progress / Complete / Blocked]
- Summary: [What was done]
- Updated: [ISO timestamp]
```

### decisions.md (APPEND)

```markdown
## [Date]: [Decision title]

**Context:** [What problem or choice prompted this]

**Decision:** [What was decided]

**Rationale:** [Why this choice]

---
```

### patterns.md (APPEND)

```markdown
## [Category]

### [Pattern name]
- [Description]
- Discovered: [Date]

---
```

### research/ directory (CREATE as needed)

For ecosystem knowledge, tool research, architecture explorations:

```markdown
# [Topic] Research

*Researched: [Date]*

## What It Is
...

## How It Works
...

## Key Insights
...

## Sources
- [links]
```

**IMPORTANT:** If you researched something this session, create an artifact. Don't just note "research not persisted" and move on.

### session_state.json (REPLACE - current state only)

This is for resuming work, not history. Keep it focused:

```json
{
  "type": "context-checkpoint",
  "timestamp": "...",
  "workspace": "...",
  "current_task": "...",
  "open_issues": ["..."],
  "next_steps": ["..."]
}
```

### learnings.md (APPEND - global file)

**Path:** `~/.gemini/antigravity/brain/learnings.md`

For mistakes, corrections, behavioral insights:

```markdown
### [Date: YYYY-MM-DD]
- [What went wrong / what was learned]
- Root cause: [actual reason]
```

5. Trigger daemon to update overview:
   ```bash
   node ~/.gemini/antigravity/scripts/daemon.js --synthesize
   ```

6. Confirm all files were written

## What Goes Where

| Type | File | Action |
|------|------|--------|
| Task progress | task.md | Append |
| Design decisions | decisions.md | Append |
| Technical patterns | patterns.md | Append |
| Research/ecosystem | research/*.md | Create |
| Mistakes/corrections | learnings.md | Append |
| Resume state | session_state.json | Replace |

## Why This Matters

Knowledge should accumulate, not reset. Each checkpoint adds to the persistent record. Next session starts with everything you've learned.
