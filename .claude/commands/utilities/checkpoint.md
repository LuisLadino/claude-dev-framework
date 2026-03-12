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
   # Find the most recent session file for this workspace
   ls -t ~/.gemini/antigravity/brain/*/sessions/*.json 2>/dev/null | head -5
   # Read the most recent one (or the one matching your session start time)
   cat [path-to-session-file]
   ```

   Session tracking files (maintained by hooks) contain:
   - `filesModified` - exact list of files edited
   - `filesCreated` - new files created
   - `commands` - bash commands run
   - `operations` - timestamped log of all changes
   - `sessionStart` - when this session started

   **Use this data instead of guessing from git or conversation.**

3. Supplement with conversation review:
   - Tasks completed, decisions made, issues found
   - Patterns learned, blockers encountered

4. Write the following files to the brain path:

### task.md (append)

```markdown
## Task: [Main task this session]
- Status: [In Progress / Complete / Blocked]
- Summary: [What was done, key outcomes]
- Updated: [ISO timestamp]
```

### session_state.json (replace)

```json
{
  "type": "context-checkpoint",
  "timestamp": "2024-01-15T10:30:00Z",
  "workspace": "/Users/.../project",
  "accomplished": [
    "Implemented feature X",
    "Fixed bug Y"
  ],
  "files_modified": [
    "src/component.ts",
    "tests/component.test.ts"
  ],
  "decisions": [
    {"decision": "Used pattern Z", "rationale": "Better maintainability"}
  ],
  "open_issues": [
    "Need to add error handling"
  ],
  "patterns": [
    "Always use X pattern for Y situation"
  ]
}
```

### Optional: {topic}_summary.md (if significant work completed)

```markdown
# [Feature/Topic] Summary

## What was built
- ...

## Key decisions
- ...

## Files changed
- ...

## Next steps
- ...
```

4. Update persistent learnings (if applicable)

If there were mistakes, corrections, or insights this session, append to the persistent learnings file:

**Path:** `~/.gemini/antigravity/brain/learnings.md`

### What to capture:

**Mistakes made:**
- What went wrong? Not surface level - the real reason.
- Example: "Pattern-matched to expected answer instead of verifying"

**Corrections received:**
- What did Luis correct? What does it reveal about the gap?

**Patterns noticed:**
- About Claude's behavior, Luis's preferences, the work

**Format:**
```markdown
### [Date: YYYY-MM-DD]
- [Mistake/correction/insight]
- Root cause: [actual reason, not surface]
```

Append to the Session Log section at the bottom of the file.

5. Confirm all files were written

## Why This Matters

These files are read at the next session start. Richer artifacts = better context = more effective Claude.

The learnings file is PERSISTENT across all sessions. It's how Claude actually improves over time instead of just saying "I'll do better."
