# /checkpoint - Create Context Checkpoint

Save session context to the Antigravity brain for future sessions.

## When to Use

- Before context compaction
- When switching to a different project
- At the end of a work session
- When you want to preserve session context for future reference

## Steps

1. Get from your session start context:
   - **Session UUID** (look for "Session UUID:")
   - **Current workspace** (look for "Current workspace:")

2. Review what was accomplished (git status, conversation, tool calls)

3. Write directly to `~/.gemini/antigravity/brain/{uuid}/session_state.json`:

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

4. Confirm the file was written

## How It Works

- Write the JSON file directly using the Write tool
- The `workspace` field must match the project directory path
- Future Claude sessions scan all brain folders for matching workspace
- The most recent checkpoint for each workspace is loaded at session start

No MCP tools needed. Context persists per-workspace across Antigravity sessions.
