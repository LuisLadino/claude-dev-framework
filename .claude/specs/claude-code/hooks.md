---
name: hooks
description: >
  Hook configuration and behavior. Required reading before creating or editing
  hook scripts (.cjs files in .claude/hooks/).
applies_to:
  - ".claude/hooks/**/*.cjs"
category: claude-code
---

# Claude Code Hooks Reference

Hooks execute code in response to Claude Code events. This spec documents hook configuration and behavior.

---

## Configuration

Hooks are defined in `~/.claude/settings.json` (global) or `.claude/settings.json` (project).

```json
{
  "hooks": {
    "EventType": [
      {
        "matcher": "pattern",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/script.cjs"
          }
        ]
      }
    ]
  }
}
```

---

## Event Types

| Event | When It Fires | Use For |
|-------|---------------|---------|
| `SessionStart` | New session begins | Load context, initialize state |
| `SessionEnd` | Session ends gracefully | **Unreliable** - doesn't fire on trash/close |
| `PreToolUse` | Before tool executes | Block dangerous operations, enforce rules |
| `PostToolUse` | After tool succeeds | Track operations, trigger follow-ups |
| `PostToolUseFailure` | After tool fails | Log errors, suggest fixes |
| `UserPromptSubmit` | User sends message | Inject context, suggest commands |
| `SubagentStart` | Subagent launches | Track agent activity |
| `SubagentStop` | Subagent completes | Aggregate results |
| `PreCompact` | Before context compaction | Save state before memory loss |
| `Stop` | Before Claude stops | Verify work, final checks |

---

## Matchers

Matchers filter which tool calls trigger hooks.

### String Pattern (Recommended)
```json
"matcher": "Edit(*.ts)"
```

Pattern syntax: `ToolName(glob_pattern)`

Examples:
- `"Edit"` - All Edit calls
- `"Bash(*git commit*)"` - Bash with git commit anywhere in command
- `"Edit|Write"` - Edit or Write calls
- `"Read(*.md)"` - Read calls on markdown files

### No Matcher (All Calls)
```json
"matcher": ""
```
Omit or empty string matches all tool calls for that event type.

### INVALID Patterns
```json
// DON'T DO THIS - No longer supported
"matcher": {"tool": "Bash", "command": "git commit"}
```
Object matchers cause errors. Use string patterns only.

---

## Exit Codes

Hook scripts communicate via exit codes:

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| 0 | Allow | Tool proceeds normally |
| 2 | Deny | Tool blocked, error shown to Claude |
| Other | Error | Treated as hook failure |

**CRITICAL:** Don't use `|| true` in settings.json - it converts exit code 2 to 0:

```json
// WRONG - Swallows denial
"command": "/path/to/hook.cjs || true"

// CORRECT - Preserves exit code
"command": "/path/to/hook.cjs"
```

---

## Hook Input

Hooks receive JSON on stdin:

```json
{
  "session_id": "abc123",
  "tool_name": "Bash",
  "tool_input": {
    "command": "git commit -m 'message'"
  }
}
```

### Reading Input (Node.js)
```javascript
#!/usr/bin/env node
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const input = JSON.parse(data);
  // Process input
  process.exit(0); // Allow
});
```

---

## Hook Output

Hooks can output to stderr (shown to Claude) or stdout (varies by event).

### PreToolUse Denial
```javascript
console.error('[BLOCKED] Reason for blocking');
process.exit(2);
```

### UserPromptSubmit Injection
```javascript
// Output becomes context for Claude's response
console.log('[CONTEXT] Additional information...');
process.exit(0);
```

---

## Hook Types

### Command Hooks (type: "command")

Execute a script. Most common type.

```json
{
  "type": "command",
  "command": "/path/to/script.cjs"
}
```

### Agent Hooks (type: "agent")

Spawn a subagent to handle complex tasks.

```json
{
  "type": "agent",
  "prompt": "Instructions for the agent. $ARGUMENTS available for context.",
  "timeout": 60
}
```

**Required fields:**
- `type`: Must be `"agent"`
- `prompt`: Instructions for the subagent (string)

**Optional fields:**
- `timeout`: Seconds before canceling (default: 60, max: 600)
- `model`: Model to use (defaults to Haiku)
- `statusMessage`: Custom spinner text while running

**Agent hook pattern for external instructions:**
```json
{
  "type": "agent",
  "prompt": "You are the Context Agent. Read .claude/agents/context-agent.md for full instructions. Execute the steps there. Write output to .claude/current-context.json.",
  "timeout": 45
}
```

**Agent return format:**
```json
{"ok": true}
```
or
```json
{"ok": false, "reason": "explanation"}
```

**Differences from command hooks:**
- Run as subagents with tool access (up to 50 turns)
- Can read files, run commands, call tools
- Longer timeout allowance
- Return JSON status, not exit codes

---

## File Extensions

**Use `.cjs` for hooks, not `.js`**

Projects with `"type": "module"` in package.json treat `.js` as ES modules. This breaks `require()` calls. The `.cjs` extension forces CommonJS regardless of package.json.

```javascript
// In .cjs files
const fs = require('fs');              // Works
const path = require('path');          // Works
const { helper } = require('./lib/helper.cjs'); // Also use .cjs
```

---

## Common Patterns

### Block Dangerous Commands
```javascript
#!/usr/bin/env node
const BLOCKED = [
  /rm\s+-rf\s+\/$/,
  /git\s+push.*--force.*main/
];

let data = '';
process.stdin.on('data', c => data += c);
process.stdin.on('end', () => {
  const { tool_input } = JSON.parse(data);
  const cmd = tool_input?.command || '';

  for (const pattern of BLOCKED) {
    if (pattern.test(cmd)) {
      console.error(`[BLOCKED] ${cmd}`);
      process.exit(2);
    }
  }
  process.exit(0);
});
```

### Require Skill for Workflow
```javascript
#!/usr/bin/env node
let data = '';
process.stdin.on('data', c => data += c);
process.stdin.on('end', () => {
  const { tool_input } = JSON.parse(data);
  const cmd = tool_input?.command || '';

  // Allow if SKILL_ACTIVE marker present
  if (cmd.includes('SKILL_ACTIVE=1')) {
    process.exit(0);
  }

  // Block direct git commit
  if (/\bgit\s+commit\b/i.test(cmd)) {
    console.error('[WORKFLOW REQUIRED] Use commit skill');
    process.exit(2);
  }

  process.exit(0);
});
```

### Track Tool Calls
```javascript
#!/usr/bin/env node
const fs = require('fs');

let data = '';
process.stdin.on('data', c => data += c);
process.stdin.on('end', () => {
  const input = JSON.parse(data);

  // Append to log
  const log = { timestamp: new Date().toISOString(), ...input };
  fs.appendFileSync('/tmp/tool-log.jsonl', JSON.stringify(log) + '\n');

  process.exit(0);
});
```

---

## Known Issues

1. **SessionEnd unreliable** - Doesn't fire on terminal close or trash icon
2. **PostToolUse only fires on success** - Failed commands don't trigger
3. **No exit_code in tool_response** - Can't check command exit status in PostToolUse
4. **Object matchers deprecated** - Must use string patterns

---

## Debugging

1. **Test hooks manually:**
   ```bash
   echo '{"tool_name":"Bash","tool_input":{"command":"git commit"}}' | node hook.cjs
   echo $?  # Check exit code
   ```

2. **Check stderr output:**
   ```bash
   echo '...' | node hook.cjs 2>&1
   ```

3. **Verify settings.json is valid JSON:**
   ```bash
   cat ~/.claude/settings.json | jq .
   ```
