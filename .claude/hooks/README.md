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
    └── session-utils.cjs     # Session ID and tracking helpers
```

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
cat ~/.gemini/antigravity/brain/{workspace-uuid}/sessions/{session-id}.json | jq
```

## Configuration

Current `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {"hooks": [{"type": "command", "command": "node ~/.gemini/antigravity/scripts/session-context.js"}]},
      {"hooks": [{"type": "command", "command": "node .claude/hooks/context/session-init.cjs 2>/dev/null || true"}]}
    ],
    "SessionEnd": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/tracking/session-end.cjs 2>/dev/null || true"}]}
    ],
    "PreToolUse": [
      {"matcher": "Bash", "hooks": [{"type": "command", "command": "node .claude/hooks/safety/block-dangerous.cjs 2>/dev/null || true"}]}
    ],
    "PostToolUse": [
      {"matcher": "", "hooks": [{"type": "command", "command": "node .claude/hooks/tracking/tool-tracker.cjs 2>/dev/null || true"}]},
      {"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "node .claude/hooks/tracking/track-changes.cjs 2>/dev/null || true"}]},
      {"matcher": "Bash", "hooks": [
        {"type": "command", "command": "node .claude/hooks/tracking/command-log.cjs 2>/dev/null || true"},
        {"type": "command", "command": "node .claude/hooks/tracking/detect-pivot.cjs 2>/dev/null || true"}
      ]}
    ],
    "PostToolUseFailure": [
      {"matcher": "", "hooks": [{"type": "command", "command": "node .claude/hooks/tracking/tool-failure.cjs 2>/dev/null || true"}]}
    ],
    "UserPromptSubmit": [
      {"hooks": [
        {"type": "command", "command": "node .claude/hooks/context/inject-context.cjs 2>/dev/null || true"},
        {"type": "command", "command": "node .claude/hooks/tracking/awareness.cjs 2>/dev/null || true"}
      ]}
    ],
    "SubagentStart": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/tracking/subagent-tracker.cjs 2>/dev/null || true"}]}
    ],
    "SubagentStop": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/tracking/subagent-tracker.cjs 2>/dev/null || true"}]}
    ],
    "Stop": [
      {"hooks": [{"type": "command", "command": "node .claude/hooks/quality/verify-before-stop.cjs 2>/dev/null || true"}]}
    ],
    "PreCompact": [
      {"hooks": [{"type": "command", "command": "node ~/.gemini/antigravity/scripts/pre-compact.js"}]}
    ]
  }
}
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

#### tool-tracker.cjs (NEW)
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

#### tool-failure.cjs (NEW)
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

#### track-changes.cjs
**Event:** PostToolUse (Edit|Write)
**Purpose:** Logs all file modifications during session

Uses Claude Code's native `session_id` for file tracking. One session file per Claude Code session.

#### command-log.cjs
**Event:** PostToolUse (Bash)
**Purpose:** Logs all bash commands executed

Note: PostToolUse only fires for successful commands. Failed commands go to tool-failure.cjs.

```json
{
  "commands": [
    {"timestamp": "...", "command": "npm test", "exitCode": 0, "success": true, "stdout": "All tests passed"}
  ]
}
```

#### detect-pivot.cjs
**Event:** PostToolUse (Bash)
**Purpose:** Detects dependency changes

Triggers on `npm install`, `yarn add`, `pnpm add`, `bun add`.
Notifies: "Dependencies changed. Consider running /sync-stack."

#### session-end.cjs (NEW)
**Event:** SessionEnd
**Purpose:** Final cleanup when session terminates

Records:
- Session duration
- Summary of what happened (files modified, tools used, failures)

#### subagent-tracker.cjs (NEW)
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

#### awareness.cjs (NEW)
**Event:** UserPromptSubmit
**Purpose:** Detect conditions that warrant running /analyze

Checks on every prompt (with 30min cooldown per warning type):
- **Large files**: learnings.md >200 lines, patterns.md >150 lines
- **Failures accumulating**: 5+ tool failures this session
- **Long session**: 60+ minutes without checkpoint
- **Overview bloat**: overview.txt >100 lines

When triggered, outputs a gentle reminder:
```
[AWARENESS] System check:
  - learnings.md is 215 lines (threshold: 200). May need consolidation.
Consider running /analyze to analyze and improve.
```

Works with `/analyze` command to close the decision-making loop.

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
**Purpose:** Initialize session and detect project changes

Does:
1. Creates session tracking file in brain
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

**Removed modules:**
- `route-commands.cjs` — skills system + gating hooks handle command routing natively
- `methodology.cjs` — CPMAI domains folded into lenses in system-prompt.md

**Reasoning Checkpoints:**
| You say... | Reminder |
|------------|----------|
| "how does X work", "what's the best way" | LOOK IT UP: Check context7 or docs. |
| "should I use X or Y" | COMPARE OPTIONS: Look up both. |
| "I need to build a..." | EXISTING TOOLS FIRST: Check if a library does this. |
| "I think it works..." | VERIFY: Don't assume. Read code to confirm. |
| "not working", "getting an error" | ROOT CAUSE: Read the actual error. |

**Voice Reminder:**
| You say... | What happens |
|------------|--------------|
| "write an article about...", "draft an email" | Short reminder to follow Writing for Luis rules in CLAUDE.md |
| "portfolio content", "case study", "bio" | Same — points to CLAUDE.md voice rules |

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

## Agent Hooks (Lifecycle Management)

Agent hooks spawn a mini Claude agent with tool access for multi-turn evaluation. They're more powerful than command hooks but add latency.

### Architecture

```
SessionStart
├── Context Agent (agent hook) → evaluates project state
│   └── Writes: .claude/current-context.json
├── inject-context-from-file.cjs → reads JSON, injects as additionalContext
└── Claude receives: project phase, gaps, lens, success criteria

UserPromptSubmit
├── Task Agent (agent hook) → evaluates this specific prompt
│   └── Writes: .claude/current-task.json
├── inject-task-framing.cjs → reads JSON, injects as additionalContext
└── Claude receives: design cycle position, research needed, teaching focus

PostToolUse (git commit)
├── Phase Evaluator (agent hook) → checks for phase transitions
│   └── Writes: .claude/phase-evaluation.json
├── apply-phase-update.cjs → applies updates to project-definition.yaml
└── Project phase stays current automatically
```

### Agent Files

Located in `.claude/agents/`:

| Agent | Trigger | Purpose |
|-------|---------|---------|
| context-agent.md | SessionStart | Evaluate project lifecycle, gaps, lenses |
| task-agent.md | UserPromptSubmit | Evaluate each task through design thinking |
| phase-evaluator.md | PostToolUse (commit) | Check for phase transitions after commits |

### Configuration

See `agent-hooks-config.json` for the full configuration. Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "agent",
        "prompt": "You are the Context Agent. Read .claude/agents/context-agent.md...",
        "timeout": 45000
      },
      {
        "type": "command",
        "command": "node .claude/hooks/context/inject-context-from-file.cjs"
      }
    ]
  }
}
```

### Trade-offs

| Aspect | Command Hooks | Agent Hooks |
|--------|---------------|-------------|
| Speed | Fast (ms) | Slower (seconds) |
| Capability | Pattern match, file read | Multi-turn reasoning, tool use |
| Use case | Validation, logging | Semantic evaluation, complex decisions |

Use agent hooks for:
- Project lifecycle management (phase transitions)
- Design thinking evaluation (requires reasoning)
- Semantic validation (understanding intent, not just patterns)

Use command hooks for:
- Tracking and logging
- Simple pattern-based validation
- Context injection from files

---

## How Hooks Work Together

1. **Session starts** → Context Agent evaluates project state, writes .claude/current-context.json
2. **Context injected** → inject-context-from-file.cjs reads JSON, injects as additionalContext
3. **You type a prompt** → Task Agent evaluates through design thinking, writes .claude/current-task.json
4. **Task framing injected** → inject-task-framing.cjs reads JSON, injects teaching focus and approach
5. **Also on prompt** → inject-context.cjs suggests commands, injects voice profile. awareness.cjs checks health.
6. **Claude uses any tool** → tool-tracker.cjs logs it (universal tracking)
7. **Claude runs bash** → block-dangerous.cjs validates, command-log.cjs logs, detect-pivot.cjs checks deps
8. **Claude commits** → Phase Evaluator checks for phase transitions, apply-phase-update.cjs updates project-definition.yaml
9. **Claude edits files** → track-changes.cjs logs modifications
10. **Tool fails** → tool-failure.cjs logs the error
11. **Subagent spawns/finishes** → subagent-tracker.cjs logs lifecycle
12. **Claude stops** → verify-before-stop.cjs checks for debug statements
13. **Session ends** → session-end.cjs writes summary
14. **Context compacts** → pre-compact.js writes persistent state
