# Claude Code Hooks

Automation scripts that integrate with Claude Code's hook system.

## Directory Structure

```
hooks/
├── safety/              # Prevent dangerous actions
│   ├── block-dangerous.cjs   # Block rm -rf, force push, etc.
│   ├── enforce-skills.cjs    # Block git commit (must use /commit skill)
│   └── enforce-plan.cjs      # Block gh issue create (must read plan skill)
├── tracking/            # Monitor what happens (observability)
│   ├── tool-tracker.cjs      # Universal tracker for ALL tools
│   ├── tool-failure.cjs      # Track failed tool calls
│   ├── track-changes.cjs     # Log file modifications
│   ├── track-spec-reads.cjs  # Record which specs were read
│   ├── command-log.cjs       # Log bash commands
│   ├── detect-pivot.cjs      # Detect dependency changes
│   ├── subagent-tracker.cjs  # Track subagent spawn/finish
│   ├── awareness.cjs         # Detect when /analyze is needed
│   └── capture-corrections.cjs # Detect user corrections → prompt for feedback memory
├── quality/             # Enforce standards
│   └── verify-before-stop.cjs    # Check for debug statements
├── context/             # Smart context injection
│   ├── session-init.cjs      # Initialize session + check sync state
│   ├── inject-context.cjs    # Per-prompt orchestrator (phase reminder, reasoning, voice, capture, spec-triggers)
│   ├── inject-utils.cjs      # Shared utilities for inject-context modules
│   ├── reasoning-checkpoints.cjs  # LOOK IT UP, VERIFY, ROOT CAUSE reminders
│   ├── voice-identity.cjs    # Voice reminder when writing content for Luis
│   ├── capture.cjs           # "Remember this" → Claude memory system
│   ├── spec-triggers.cjs     # Dynamic spec auto-loading from frontmatter triggers
│   ├── enforce-specs.cjs     # DENY edits until required spec is read
│   └── spawn-context-agent.cjs   # Spawn context agent at session start
├── lifecycle/           # Project lifecycle management
│   └── spawn-phase-evaluator.cjs  # Spawn phase evaluator after commits
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
│   └── .active-session     # Current session marker
├── overview.txt     # Daemon-generated synthesis of tracking data
└── hook-errors.log  # Debug log for hook failures
```

The workspace key is deterministic from the git root path (e.g., `-Users-username-projects-my-project`).

## Observability

The tracking system captures everything that happens for debugging and verification:

| What | Hook | Data |
|------|------|------|
| All tool calls | tool-tracker.cjs | `tools[]` |
| Failed tools | tool-failure.cjs | `failures[]` |
| File changes | track-changes.cjs | `filesModified[]`, `filesCreated[]` |
| Spec reads | track-spec-reads.cjs | `session-state.json → specsRead` |
| Bash commands | command-log.cjs | `commands[]` |
| Context injections | inject-context.cjs | `injections[]` |
| Subagents | subagent-tracker.cjs | `subagents[]` |
| System health | awareness.cjs | prompts for /analyze |
| User corrections | capture-corrections.cjs | prompts for feedback memory |

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

#### enforce-skills.cjs
**Event:** PreToolUse (Bash)
**Purpose:** Blocks `git commit` — must use /commit skill

Bypass: `SKILL_ACTIVE=1` prefix in command (set by commit skill).

#### enforce-plan.cjs
**Event:** PreToolUse (Bash)
**Purpose:** Blocks `gh issue create` — must read plan skill first

### Tracking Hooks

#### tool-tracker.cjs
**Event:** PostToolUse (all tools)
**Purpose:** Universal tracker for ALL tool calls

#### tool-failure.cjs
**Event:** PostToolUseFailure (all tools)
**Purpose:** Track failed tool calls

#### track-changes.cjs
**Event:** PostToolUse (Edit|Write)
**Purpose:** Logs all file modifications during session

#### track-spec-reads.cjs
**Event:** PostToolUse (Read)
**Purpose:** Records which specs were read (for enforce-specs enforcement cycle)

#### command-log.cjs
**Event:** PostToolUse (Bash)
**Purpose:** Logs all bash commands executed

#### detect-pivot.cjs
**Event:** PostToolUse (Bash)
**Purpose:** Detects dependency changes (`npm install`, `yarn add`, etc.)

Notifies: "Dependencies changed. Consider running /sync-stack."

#### subagent-tracker.cjs
**Event:** SubagentStart, SubagentStop
**Purpose:** Track when subagents spawn and finish

#### awareness.cjs
**Event:** UserPromptSubmit
**Purpose:** Detect conditions that warrant running /analyze

Checks on every prompt (with 30min cooldown per warning type):
- **Failures accumulating**: 5+ tool failures this session

#### capture-corrections.cjs
**Event:** UserPromptSubmit
**Purpose:** Detect when user is correcting Claude, prompt to save as feedback memory

Detects patterns like "you didn't follow", "that's wrong", "stop guessing", "I already told you".

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

#### inject-context.cjs
**Event:** UserPromptSubmit
**Purpose:** Per-prompt context injection orchestrator

**Modules:**
- `reasoning-checkpoints.cjs` — reminders to research, verify, diagnose (max 2 per prompt)
- `voice-identity.cjs` — short voice reminder when writing content for Luis
- `capture.cjs` — "remember this" / "capture that" → saves to Claude memory system
- `spec-triggers.cjs` — dynamic spec auto-loading from frontmatter `triggers` field
- **Phase reminder** — always fires, names design thinking phases and points to phase skills

#### enforce-specs.cjs
**Event:** PreToolUse (Edit|Write)
**Purpose:** DENY edits until required spec is read. Scans spec frontmatter for `applies_to` patterns dynamically.

#### spawn-context-agent.cjs
**Event:** SessionStart
**Purpose:** Injects instruction to spawn context-agent for background project evaluation

### Lifecycle Hooks

#### spawn-phase-evaluator.cjs
**Event:** UserPromptSubmit
**Purpose:** Detects new commits and spawns phase-evaluator agent for project health evaluation

## Debugging

**Hook errors logged to:** `~/.claude/projects/{workspace-key}/hook-errors.log`

**Check if hooks are firing:**
```bash
# Watch tracking file for changes
tail -f ~/.claude/projects/{workspace-key}/tracking/{session-id}.json

# Check error log
tail ~/.claude/projects/{workspace-key}/hook-errors.log
```
