# Claude Code Hooks

Automation scripts that integrate with Claude Code's hook system.

## Directory Structure

```
hooks/
├── safety/              # Prevent dangerous actions
│   └── block-dangerous.js   # Block rm -rf, force push, etc.
├── tracking/            # Monitor what happens
│   ├── track-changes.js     # Log file modifications
│   ├── command-log.js       # Log bash commands
│   └── detect-pivot.js      # Detect dependency changes
├── quality/             # Enforce standards
│   ├── verify-before-stop.js    # Check for debug statements
│   └── checkpoint-on-complete.js # Auto-save on task complete
└── context/             # Smart context injection
    ├── session-init.js      # Initialize session + check sync state
    └── inject-context.js    # Auto-load relevant specs
```

## Configuration

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/context/session-init.js"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/safety/block-dangerous.js"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/tracking/track-changes.js"
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/tracking/command-log.js"
          },
          {
            "type": "command",
            "command": "node .claude/hooks/tracking/detect-pivot.js"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/context/inject-context.js"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/quality/verify-before-stop.js"
          }
        ]
      }
    ],
    "TaskCompleted": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/quality/checkpoint-on-complete.js"
          }
        ]
      }
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

#### track-changes.js
**Event:** PostToolUse (Edit|Write)
**Purpose:** Logs all file modifications during session

Writes to brain: `~/.gemini/antigravity/brain/{workspace-uuid}/sessions/{session-id}.json`

```json
{
  "sessionId": "1710123456789-abc123",
  "sessionStart": "2024-01-15T10:00:00Z",
  "workspace": "/Users/.../project",
  "filesModified": ["src/app.ts", "README.md"],
  "filesCreated": ["src/new-feature.ts"],
  "operations": [
    {"timestamp": "...", "tool": "Edit", "file": "src/app.ts", "type": "modify"}
  ]
}
```

Used by:
- /checkpoint for accurate summaries
- Brain artifacts for session history

**Concurrency:** Each Claude session gets its own tracking file (unique session ID), so multiple sessions in the same workspace don't conflict.

#### command-log.js
**Event:** PostToolUse (Bash)
**Purpose:** Logs all bash commands executed

Adds to the session tracking file in brain:
```json
{
  "commands": [
    {"timestamp": "...", "command": "npm test", "exitCode": 0, "success": true}
  ]
}
```

#### detect-pivot.js
**Event:** PostToolUse (Bash)
**Purpose:** Detects dependency changes

Triggers on:
- `npm install`, `yarn add`, `pnpm add`, `bun add`

Notifies: "Dependencies changed. Consider running /sync-stack."

### Quality Hooks

#### verify-before-stop.js
**Event:** Stop
**Purpose:** Ensures quality before Claude stops working

Checks modified files for:
- `console.log()` statements
- `debugger;` statements
- `TODO: REMOVE` comments

If found, blocks stopping and asks Claude to clean up.

#### checkpoint-on-complete.js
**Event:** TaskCompleted
**Purpose:** Auto-saves context when tasks complete

Writes to brain files:
- Task completion record
- Files changed summary
- Checkpoint for session continuity

### Context Hooks

#### session-init.js
**Event:** SessionStart
**Purpose:** Initialize session and detect project changes

Does:
1. Resets session-changes.json for fresh tracking
2. Compares file hashes to last /sync-stack run
3. Notifies if configs changed (suggests /sync-stack)
4. Loads brief project context

#### inject-context.js
**Event:** UserPromptSubmit
**Purpose:** Auto-routes to commands and loads relevant specs

**Command Routing:**
Suggests the right slash command based on how you naturally talk:

| You say... | Suggested Command |
|------------|-------------------|
| "build a python app", "let's create...", "help me fix...", "work on..." | /start-task |
| "explain how...", "help me understand", "what is...", "I don't get..." | /learn |
| "commit this", "done with these changes", "push this up" | /commit |
| "look this over", "check my work", "is this good?", "before I push" | /audit |
| "does this look right?", "am I doing this right?", "quick check" | /verify |
| "this is gonna be big", "need to plan this out", "break this down" | /add-feature |
| "new project", "from scratch", "set this up", "starting fresh" | /init-project |
| "wire this up", "install the deps", "get everything connected" | /sync-stack |
| "save where we're at", "gonna take a break", "wrap up", "that's all for now" | /checkpoint |

**Reasoning Checkpoints:**
When no command is suggested, injects reminders about how to approach the task:

| You say... | Reminder |
|------------|----------|
| "how does X work", "what's the best way" | LOOK IT UP: Check context7 or docs. Don't guess. |
| "should I use X or Y", "which approach" | COMPARE OPTIONS: Look up both. Check official recommendations. |
| "I need to build a..." | EXISTING TOOLS FIRST: Check if a library already does this. |
| "I think it works...", "probably does..." | VERIFY: Don't assume. Read code or docs to confirm. |
| "not working", "getting an error" | ROOT CAUSE: Read the actual error. Don't guess at fixes. |
| "how do I use/configure..." | CHECK DOCS: Use context7 for current documentation. |

**Voice Profile (Content Writing):**
When writing content for Luis, injects his voice profile:

| You say... | What happens |
|------------|--------------|
| "write an article about...", "draft an email" | Loads voice-profile.md |
| "portfolio content", "case study", "bio" | Loads voice-profile.md |
| "cover letter", "resume", "LinkedIn" | Loads voice-profile.md |
| "blog post", "homepage copy" | Loads voice-profile.md |

The voice profile enforces Luis's actual voice: no em dashes, no corporate speak, contractions, short sentences, human tone.

**Context Loading:**
Also loads relevant specs:
- "style", "design", "color" → loads design-system.md
- "test", "jest", "vitest" → loads testing.md
- "structure", "folder" → loads project-structure.md
- "commit", "git" → loads version-control.md
- "what changed" → loads session-changes.json

## Session Tracking in Brain

Session tracking is stored in the brain, not in project directories:

```
~/.gemini/antigravity/brain/
├── {workspace-uuid}/
│   └── sessions/
│       ├── .active-session          # Current session ID
│       ├── 1710123456789-abc123.json  # Session 1
│       ├── 1710123456790-def456.json  # Session 2
│       └── ...
```

Each session file contains:
```json
{
  "sessionId": "1710123456789-abc123",
  "sessionStart": "2024-01-15T10:00:00Z",
  "workspace": "/Users/.../project",
  "filesModified": ["src/app.ts"],
  "filesCreated": ["src/new.ts"],
  "operations": [
    {"timestamp": "...", "tool": "Edit", "file": "src/app.ts", "type": "modify"}
  ],
  "commands": [
    {"timestamp": "...", "command": "npm test", "exitCode": 0, "success": true}
  ]
}
```

**Why brain instead of project?**
- Multiple concurrent sessions don't conflict (each gets unique session ID)
- No project files to manage or gitignore
- All session data in one place
- Sessions older than 7 days auto-cleanup

## How Hooks Work Together

1. **Session starts** → session-init.js creates session tracking file in brain, checks for project changes
2. **You type a prompt** → inject-context.js suggests commands, adds reasoning checkpoints, injects voice profile
3. **Claude runs bash** → block-dangerous.js validates, command-log.js logs to brain, detect-pivot.js checks for installs
4. **Claude edits files** → track-changes.js logs modifications to brain
5. **Claude stops** → verify-before-stop.js checks for debug statements
6. **Context compacts** → pre-compact.js writes persistent state, detects corrections
