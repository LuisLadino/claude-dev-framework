# /checkpoint - Create Context Checkpoint

Save session context to the Antigravity brain for future sessions.

## When to Use

- Before context compaction
- When switching to a different project
- At the end of a work session
- When you want to preserve session context for future reference

## Steps

1. Get the session UUID from session start context (look for "Session UUID:" in your context)
2. Review what was accomplished (git status, conversation, tool calls)
3. Write directly to `~/.gemini/antigravity/brain/{uuid}/session_state.json`:

```json
{
  "type": "context-checkpoint",
  "timestamp": "2024-01-15T10:30:00Z",
  "workspace": "/path/to/project -> ProjectName",
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

4. Confirm the file was written

## Direct File Access

No MCP tools needed. Just write the JSON file directly using the Write tool. Future Claude sessions will read this at startup via the SessionStart hook.
