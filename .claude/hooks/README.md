# Claude Code Hooks

Automation scripts that integrate with Claude Code's hook system.

## Directory Structure

```
hooks/
├── safety/              # Prevent dangerous actions
│   └── block-dangerous.js   # Block rm -rf, force push, etc.
├── tracking/            # Monitor what happens (observability)
│   ├── tool-tracker.js      # Universal tracker for ALL tools
│   ├── tool-failure.js      # Track failed tool calls
│   ├── track-changes.js     # Log file modifications
│   ├── command-log.js       # Log bash commands
│   ├── detect-pivot.js      # Detect dependency changes
│   ├── session-end.js       # Final session cleanup
│   ├── subagent-tracker.js  # Track subagent spawn/finish
│   └── awareness.js         # Detect when /reflect is needed
├── quality/             # Enforce standards
│   └── verify-before-stop.js    # Check for debug statements
└── context/             # Smart context injection
    ├── session-init.js      # Initialize session + check sync state
    └── inject-context.js    # Auto-load relevant specs
```

## Observability

The tracking system captures everything that happens for debugging and verification:

| What | Hook | File |
|------|------|------|
| All tool calls | tool-tracker.js | `tools[]` |
| Failed tools | tool-failure.js | `failures[]` |
| File changes | track-changes.js | `filesModified[]`, `filesCreated[]` |
| Bash commands | command-log.js | `commands[]` |
| Context injections | inject-context.js | `injections[]` |
| Subagents | subagent-tracker.js | `subagents[]` |
| Session end | session-end.js | `summary{}` |
| System health | awareness.js | prompts for /reflect |

**To verify the system is working:**
```bash
cat ~/.gemini/antigravity/brain/{workspace-uuid}/sessions/{session-id}.json | jq
```

## Configuration

Current `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {"hooks": [{"type": "command", "command": "node ~/.gemini/antigravity/scripts/session-context.js"}]},
      {"hooks": [{"type": "command", "command": "node .claude/hooks/context/session-init.js 2>/dev/null || true"}]}
    ],
    "SessionEnd": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/tracking/session-end.js 2>/dev/null || true"}]}
    ],
    "PreToolUse": [
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node .claude/hooks/safety/block-dangerous.js 2>/dev/null || true"}]}
    ],
    "PostToolUse": [
      {"matcher": "", "hooks": [{"type": "command", "command": "node .claude/hooks/tracking/tool-tracker.js 2>/dev/null || true"}]},
      {"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "node .claude/hooks/tracking/track-changes.js 2>/dev/null || true"}]},
      {"matcher": "Bash", "hooks": [
        {"type": "command", "command": "node .claude/hooks/tracking/command-log.js 2>/dev/null || true"},
        {"type": "command", "command": "node .claude/hooks/tracking/detect-pivot.js 2>/dev/null || true"}
      ]}
    ],
    "PostToolUseFailure": [
      {"matcher": "", "hooks": [{"type": "command", "command": "node .claude/hooks/tracking/tool-failure.js 2>/dev/null || true"}]}
    ],
    "UserPromptSubmit": [
      {"hooks": [
        {"type": "command", "command": "node .claude/hooks/context/inject-context.js 2>/dev/null || true"},
        {"type": "command", "command": "node .claude/hooks/tracking/awareness.js 2>/dev/null || true"}
      ]}
    ],
    "SubagentStart": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/tracking/subagent-tracker.js 2>/dev/null || true"}]}
    ],
    "SubagentStop": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/tracking/subagent-tracker.js 2>/dev/null || true"}]}
    ],
    "Stop": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/quality/verify-before-stop.js 2>/dev/null || true"}]}
    ],
    "PreCompact": [
      {"hooks": [{"type": "command", "command": "node ~/.gemini/antigravity/scripts/pre-compact.js"}]}
    ]
  }
}
```

## Hook Descriptions

### Safety Hooks

#### block-dangerous.js
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

#### tool-tracker.js (NEW)
**Event:** PostToolUse (all tools)
**Purpose:** Universal tracker for ALL tool calls

Captures:
- Skill invocations (which slash commands were used)
- MCP tool calls (context7, ag_browser_agent, etc.)
- Read/Glob/Grep operations
- Everything else

```json
{
  "tools": [
    {"timestamp": "...", "tool": "Skill", "skill": "/commit"},
    {"timestamp": "...", "tool": "mcp__context7__query-docs", "server": "context7", "libraryId": "/vercel/next.js"},
    {"timestamp": "...", "tool": "Read", "file": "src/app.ts"},
    {"timestamp": "...", "tool": "Task", "subagent": "Explore", "description": "Find auth files"}
  ]
}
```

#### tool-failure.js (NEW)
**Event:** PostToolUseFailure (all tools)
**Purpose:** Track failed tool calls

PostToolUse only fires on success. This catches failures for debugging.

```json
{
  "failures": [
    {"timestamp": "...", "tool": "Read", "file": "/nonexistent.txt", "error": "File not found"},
    {"timestamp": "...", "tool": "Bash", "command": "npm test", "error": "Exit code 1"}
  ]
}
```

#### track-changes.js
**Event:** PostToolUse (Edit|Write)
**Purpose:** Logs all file modifications during session

Uses Claude Code's native `session_id` for file tracking. One session file per Claude Code session.

#### command-log.js
**Event:** PostToolUse (Bash)
**Purpose:** Logs all bash commands executed

Note: PostToolUse only fires for successful commands. Failed commands go to tool-failure.js.

```json
{
  "commands": [
    {"timestamp": "...", "command": "npm test", "exitCode": 0, "success": true, "stdout": "All tests passed"}
  ]
}
```

#### detect-pivot.js
**Event:** PostToolUse (Bash)
**Purpose:** Detects dependency changes

Triggers on `npm install`, `yarn add`, `pnpm add`, `bun add`.
Notifies: "Dependencies changed. Consider running /sync-stack."

#### session-end.js (NEW)
**Event:** SessionEnd
**Purpose:** Final cleanup when session terminates

Records:
- Session duration
- Summary of what happened (files modified, tools used, failures)

#### subagent-tracker.js (NEW)
**Event:** SubagentStart, SubagentStop
**Purpose:** Track when subagents spawn and finish

Captures /audit parallel agents, Task tool subagents, background tasks.

```json
{
  "subagents": [
    {"id": "abc123", "type": "Explore", "description": "Find auth files", "startedAt": "...", "stoppedAt": "...", "durationSeconds": 5}
  ]
}
```

#### awareness.js (NEW)
**Event:** UserPromptSubmit
**Purpose:** Detect conditions that warrant running /reflect

Checks on every prompt (with 30min cooldown per warning type):
- **Large files**: learnings.md >200 lines, patterns.md >150 lines
- **Failures accumulating**: 5+ tool failures this session
- **Long session**: 60+ minutes without checkpoint
- **Overview bloat**: overview.txt >100 lines

When triggered, outputs a gentle reminder:
```
[AWARENESS] System check:
  - learnings.md is 215 lines (threshold: 200). May need consolidation.
Consider running /reflect to analyze and improve.
```

Works with `/reflect` command to close the decision-making loop.

### Quality Hooks

#### verify-before-stop.js
**Event:** Stop
**Purpose:** Ensures quality before Claude stops working

Checks modified files for:
- `console.log()` statements
- `debugger;` statements
- `TODO: REMOVE` comments

If found, blocks stopping and asks Claude to clean up.

### Context Hooks

#### session-init.js
**Event:** SessionStart
**Purpose:** Initialize session and detect project changes

Does:
1. Creates session tracking file in brain
2. Compares file hashes to last /sync-stack run
3. Notifies if configs changed (suggests /sync-stack)

#### inject-context.js
**Event:** UserPromptSubmit
**Purpose:** Auto-routes to commands, injects context, loads voice profile

**Now tracks what it does** in `injections[]`:
```json
{
  "injections": [
    {"timestamp": "...", "promptSnippet": "commit these changes", "commandSuggested": "/commit"},
    {"timestamp": "...", "promptSnippet": "write an article about...", "voiceProfileLoaded": true},
    {"timestamp": "...", "promptSnippet": "how does X work", "reasoningCheckpoints": 1}
  ]
}
```

**Command Routing:**
| You say... | Suggested Command |
|------------|-------------------|
| "build a python app", "let's create...", "help me fix..." | /start-task |
| "explain how...", "help me understand", "what is..." | /learn |
| "commit this", "done with these changes" | /commit |
| "look this over", "check my work", "before I push" | /audit |
| "does this look right?", "quick check" | /verify |
| "this is gonna be big", "need to plan this out" | /add-feature |
| "new project", "from scratch", "set this up" | /init-project |
| "wire this up", "install the deps" | /sync-stack |
| "save where we're at", "gonna take a break" | /checkpoint |
| "analyze sessions", "what patterns", "clean up learnings" | /reflect |

**Reasoning Checkpoints:**
| You say... | Reminder |
|------------|----------|
| "how does X work", "what's the best way" | LOOK IT UP: Check context7 or docs. |
| "should I use X or Y" | COMPARE OPTIONS: Look up both. |
| "I need to build a..." | EXISTING TOOLS FIRST: Check if a library does this. |
| "I think it works..." | VERIFY: Don't assume. Read code to confirm. |
| "not working", "getting an error" | ROOT CAUSE: Read the actual error. |

**Voice Profile:**
| You say... | What happens |
|------------|--------------|
| "write an article about...", "draft an email" | Loads voice-profile.md |
| "portfolio content", "case study", "bio" | Loads voice-profile.md |

## Session Tracking File Structure

Each session file in brain contains:

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

**Hook errors logged to:** `~/.gemini/antigravity/brain/hook-errors.log`

**Check if hooks are firing:**
```bash
# Watch session file for changes
tail -f ~/.gemini/antigravity/brain/{uuid}/sessions/{session-id}.json

# Check error log
tail ~/.gemini/antigravity/brain/hook-errors.log
```

## How Hooks Work Together

1. **Session starts** → session-init.js creates tracking file, session-context.js loads brain context
2. **You type a prompt** → inject-context.js suggests commands, injects voice profile, logs what it did. awareness.js checks system health, prompts for /reflect if needed.
3. **Claude uses any tool** → tool-tracker.js logs it (universal tracking)
4. **Claude runs bash** → block-dangerous.js validates, command-log.js logs, detect-pivot.js checks deps
5. **Claude edits files** → track-changes.js logs modifications
6. **Tool fails** → tool-failure.js logs the error
7. **Subagent spawns** → subagent-tracker.js logs start
8. **Subagent finishes** → subagent-tracker.js logs stop with duration
9. **Claude stops** → verify-before-stop.js checks for debug statements
10. **Session ends** → session-end.js writes summary
11. **Context compacts** → pre-compact.js writes persistent state
