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

2. Review what was accomplished this session:
   - Run `git status` and `git diff --stat` to see changes
   - Review conversation for tasks completed, decisions made, issues found

3. Write the following files to the brain path:

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

4. Confirm all files were written

## Why This Matters

These files are read at the next session start. Richer artifacts = better context = more effective Claude.
