# /checkpoint - Create Context Checkpoint

Write a context checkpoint for Gemini to convert into a Knowledge Item.

## When to Use

- Before context compaction
- When switching to a different project
- At the end of a work session
- When you want to preserve session context for future reference

## Steps

1. Determine current workspace from working directory
2. Review what was accomplished this session (git status, recent tool calls, conversation)
3. Call `ag_context_checkpoint` with:
   - workspace: current project path
   - accomplished: list of completed tasks
   - files_modified: key files created or changed
   - decisions: architectural decisions and rationale
   - open_issues: unresolved questions or next steps
   - patterns: reusable patterns worth persisting

4. Confirm checkpoint was written

## Example Call

```
ag_context_checkpoint(
  workspace="/Users/.../project -> ProjectName",
  accomplished=["Implemented feature X", "Fixed bug Y"],
  files_modified=["src/component.ts", "tests/component.test.ts"],
  decisions=[{decision: "Used pattern Z", rationale: "Better maintainability"}],
  open_issues=["Need to add error handling"],
  patterns=["Always use X pattern for Y situation"]
)
```

## What Happens Next

Gemini reads `session_state.json` from the brain directory on the next user message and converts it to a proper Knowledge Item through the backend KI pipeline. Future sessions (both Claude and Gemini) can reference this context.
