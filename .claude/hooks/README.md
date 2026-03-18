# Claude Code Hooks

Automation scripts that integrate with Claude Code's hook system.

## Directory Structure

```
hooks/
├── safety/              # Prevent dangerous actions
│   └── block-dangerous.cjs   # Block rm -rf, force push, etc.
├── tracking/            # Monitor what happens (observability)
│   ├── tool-tracker.cjs      # Universal tracker for ALL tools
│   ├── tool-failure.cjs      # Track failed tool calls
│   ├── track-changes.cjs     # Log file modifications
│   ├── command-log.cjs       # Log bash commands
│   ├── detect-pivot.cjs      # Detect dependency changes
│   ├── session-end.cjs       # Final session cleanup
│   ├── subagent-tracker.cjs  # Track subagent spawn/finish
│   └── awareness.cjs         # Detect when /analyze is needed
├── quality/             # Enforce standards
│   └── verify-before-stop.cjs    # Check for debug statements
├── context/             # Smart context injection
│   ├── session-init.cjs      # Initialize session + check sync state
│   ├── inject-context.cjs    # Auto-load relevant specs
│   ├── inject-context-from-file.cjs  # Inject Context Agent output
│   └── inject-task-framing.cjs       # Inject Task Agent output
├── lifecycle/           # Project lifecycle management
│   └── apply-phase-update.cjs # Apply Phase Evaluator recommendations
└── lib/                 # Shared utilities
    └── session-utils.cjs     # Session ID, tracking, project path helpers
```

## Persistence

All tracking data lives in Claude Code's native per-project directory:

```
~/.claude/projects/{workspace-key}/
├── memory/          # Persistent memories (auto-loaded via MEMORY.md)
├── tracking/        # Session tracking files (our hooks write here)
│   ├── {session-id}.json   # Per-session tracking data
│   ├── .active-session     # Current session marker
│   └── pre-compact-handoff.md  # Auto-captured context before compaction
├── overview.txt     # Daemon-generated synthesis of tracking data
└── hook-errors.log  # Debug log for hook failures
```

The workspace key is deterministic from the git root path (e.g., `-Users-luisladino-Repositories-Personal-my-project`).

## Observability

The tracking system captures everything that happens for debugging and verification:

| What | Hook | File |
|------|------|------|
| All tool calls | tool-tracker.cjs | `tools[]` |
| Failed tools | tool-failure.cjs | `failures[]` |
| File changes | track-changes.cjs | `filesModified[]`, `filesCreated[]` |
| Bash commands | command-log.cjs | `commands[]` |
| Context injections | inject-context.cjs | `injections[]` |
| Subagents | subagent-tracker.cjs | `subagents[]` |
| Session end | session-end.cjs | `summary{}` |
| System health | awareness.cjs | prompts for /analyze |

**To verify the system is working:**
```bash
cat ~/.claude/projects/{workspace-key}/tracking/{session-id}.json | jq
```

## Hook Descriptions

### Safety Hooks

#### block-dangerous.cjs
**Event:** PreToolUse (Bash)
**Purpose:** Prevents execution of dangerous commands

Blocks:
- `rm -rf /` or `rm -rf ~` (root/home deletion)
- `git push --force` to main/master
- `git reset --hard origin/main`
- `DROP DATABASE`, `TRUNCATE TABLE`
- Credential exposure (`cat .env`, echo secrets)
- Fork bombs, filesystem formats

### Tracking Hooks

#### tool-tracker.cjs
**Event:** PostToolUse (all tools)
**Purpose:** Universal tracker for ALL tool calls

Captures:
- Skill invocations (which slash commands were used)
- MCP tool calls (context7, ag_browser_agent, etc.)
- Read/Glob/Grep operations
- Everything else

#### tool-failure.cjs
**Event:** PostToolUseFailure (all tools)
**Purpose:** Track failed tool calls

PostToolUse only fires on success. This catches failures for debugging.

#### track-changes.cjs
**Event:** PostToolUse (Edit|Write)
**Purpose:** Logs all file modifications during session

#### command-log.cjs
**Event:** PostToolUse (Bash)
**Purpose:** Logs all bash commands executed

Note: PostToolUse only fires for successful commands. Failed commands go to tool-failure.cjs.

#### detect-pivot.cjs
**Event:** PostToolUse (Bash)
**Purpose:** Detects dependency changes

Triggers on `npm install`, `yarn add`, `pnpm add`, `bun add`.
Notifies: "Dependencies changed. Consider running /sync-stack."

#### session-end.cjs
**Event:** SessionEnd
**Purpose:** Final cleanup when session terminates

Records:
- Session duration
- Summary of what happened (files modified, tools used, failures)

Note: SessionEnd is unreliable (doesn't fire on terminal close).

#### subagent-tracker.cjs
**Event:** SubagentStart, SubagentStop
**Purpose:** Track when subagents spawn and finish

#### awareness.cjs
**Event:** UserPromptSubmit
**Purpose:** Detect conditions that warrant running /analyze

Checks on every prompt (with 30min cooldown per warning type):
- **Failures accumulating**: 5+ tool failures this session

### Quality Hooks

#### verify-before-stop.cjs
**Event:** Stop
**Purpose:** Ensures quality before Claude stops working

Checks modified files for:
- `console.log()` statements
- `debugger;` statements
- `TODO: REMOVE` comments

If found, blocks stopping and asks Claude to clean up.

### Context Hooks

#### session-init.cjs
**Event:** SessionStart
**Purpose:** Initialize session tracking and detect project changes

Does:
1. Creates session tracking file
2. Compares file hashes to last /sync-stack run
3. Notifies if configs changed (suggests /sync-stack)

#### inject-context.cjs
**Event:** UserPromptSubmit
**Purpose:** Per-prompt context injection — reasoning checkpoints, voice reminders, capture, spec auto-loading

**Modules:**
- `reasoning-checkpoints.cjs` — reminders to research, verify, diagnose (max 2 per prompt)
- `voice-identity.cjs` — short voice reminder when writing content for Luis (full rules in CLAUDE.md)
- `capture.cjs` — "remember this" / "capture that" → saves to Claude memory system
- `spec-triggers.cjs` — auto-loads spec files based on keywords

## Session Tracking File Structure

Each session tracking file contains:

```json
{
  "sessionId": "305e3325-275a-4a94-8a72-65a4d14a1d40",
  "sessionStart": "2024-01-15T10:00:00Z",
  "sessionEnd": "2024-01-15T11:30:00Z",
  "durationMinutes": 90,
  "workspace": "/Users/.../project",

  "filesModified": ["src/app.ts"],
  "filesCreated": ["src/new.ts"],
  "operations": [{"timestamp": "...", "tool": "Edit", "file": "...", "type": "modify"}],

  "commands": [{"timestamp": "...", "command": "npm test", "exitCode": 0, "success": true, "stdout": "..."}],

  "tools": [{"timestamp": "...", "tool": "Skill", "skill": "/commit"}],

  "failures": [{"timestamp": "...", "tool": "Read", "error": "File not found"}],

  "injections": [{"timestamp": "...", "commandSuggested": "/commit"}],

  "subagents": [{"id": "...", "type": "Explore", "durationSeconds": 5}],

  "summary": {
    "filesModified": 3,
    "filesCreated": 1,
    "commandsRun": 5,
    "toolsUsed": 42,
    "failures": 2,
    "injections": 8
  }
}
```

## Debugging

**Hook errors logged to:** `~/.claude/projects/{workspace-key}/hook-errors.log`

**Check if hooks are firing:**
```bash
# Watch tracking file for changes
tail -f ~/.claude/projects/{workspace-key}/tracking/{session-id}.json

# Check error log
tail ~/.claude/projects/{workspace-key}/hook-errors.log
```
