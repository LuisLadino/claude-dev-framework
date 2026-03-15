# Claude Code Agents Reference

Agents are specialized subprocesses that handle complex tasks. They can be invoked via hooks or the Task tool. This spec documents agent configuration and behavior.

---

## Agent Location

Agent hooks are defined in `.claude/agents/{agent-name}.md`.

```
.claude/
└── agents/
    ├── context-agent.md
    ├── task-agent.md
    └── phase-evaluator.md
```

---

## Agent File Format

```yaml
---
name: agent-name
description: What this agent does and when to use it
tools: Tool1, Tool2, Tool3
model: sonnet
---

# Agent Title

Instructions for the agent...
```

### Required Fields

| Field | Purpose |
|-------|---------|
| `name` | Agent identifier |
| `description` | Purpose and trigger conditions |
| `tools` | Comma-separated list of allowed tools |
| `model` | Model to use (sonnet, opus, haiku) |

**CRITICAL:** All four fields are required. Missing frontmatter = agent won't load.

---

## Triggering Agents

### Via Settings.json Hook
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "agent": ".claude/agents/context-agent.md"
          }
        ]
      }
    ]
  }
}
```

### Via Task Tool
```yaml
Task(
  prompt: "Analyze project structure",
  description: "Explore codebase",
  subagent_type: "Explore"
)
```

Note: Task tool uses built-in subagent types, not custom agent files.

---

## Built-in Subagent Types

Available via the Task tool:

| Type | Purpose | Tools |
|------|---------|-------|
| `Bash` | Command execution | Bash |
| `Explore` | Codebase exploration | Read, Grep, Glob, etc. (no Edit/Write) |
| `Plan` | Implementation planning | Read, Grep, Glob, etc. (no Edit/Write) |
| `general-purpose` | Multi-step research | All tools |

---

## Tool Permissions

Agents only have access to tools listed in their `tools` field.

```yaml
tools: Read, Bash, Grep, Glob
```

Common tool sets:
- **Read-only exploration:** Read, Grep, Glob
- **With shell access:** Read, Bash, Grep, Glob
- **Task tracking:** Read, Grep, Glob, TaskList, TaskGet
- **Full access:** All tools

---

## Model Selection

Choose based on task complexity:

| Model | Use For |
|-------|---------|
| `haiku` | Quick, simple tasks (faster, cheaper) |
| `sonnet` | Standard complexity |
| `opus` | Complex reasoning, important decisions |

---

## Agent Output

Agents typically write to files rather than returning text:

```markdown
## Output

Write to `.claude/current-context.json`:

```json
{
  "timestamp": "2026-03-14T12:00:00Z",
  "phase": "prototype",
  ...
}
```

Then return: `{ "ok": true }`
```

This pattern allows other agents/hooks to read the output.

---

## Hook Events for Agents

| Event | When to Use | Example Agent |
|-------|-------------|---------------|
| `SessionStart` | Initialize context | Context Agent |
| `UserPromptSubmit` | Evaluate each request | Task Agent |
| `PostToolUse` | React to tool completion | Phase Evaluator |
| `PreCompact` | Save state before compaction | State Saver |

---

## Common Issues

1. **Agent doesn't run** - Missing frontmatter fields
2. **Agent can't use tool** - Tool not in `tools` list
3. **Output not visible** - Agent results go to calling context, not user
4. **Wrong model** - Using opus for simple tasks wastes tokens

---

## Example: Minimal Agent

```yaml
---
name: simple-checker
description: Checks for TODO comments in codebase
tools: Grep
model: haiku
---

# Simple Checker

Find all TODO comments:

```bash
grep -r "TODO" --include="*.ts" --include="*.js"
```

Return count and locations.
```

---

## Example: Complex Agent

```yaml
---
name: context-agent
description: Establishes project context and design thinking phase at session start
tools: Read, Bash, Grep, Glob, TaskList, TaskGet
model: sonnet
---

# Context Agent

You are the Context Agent. Your job is to establish the big picture before any work begins.

## Trigger

SessionStart - runs once when a new session begins.

## Your Purpose

Read the project state and determine:
1. Where are we in the project lifecycle?
2. What's been accomplished?
3. What's the current focus?
4. Are there gaps that need attention?

## Tools Available

- Read (project-definition.yaml, session state, brain files)
- Bash (gh commands for GitHub state)
- Grep, Glob (for codebase state)
- TaskList, TaskGet (for design thinking task state)

## Evaluation Steps

### Step 1: Load Project Definition
...

## Output

Write to `.claude/current-context.json`:
...
```

---

## This Framework's Agents

| Agent | Trigger | Purpose |
|-------|---------|---------|
| `context-agent` | SessionStart | Establish project context and phase |
| `task-agent` | UserPromptSubmit | Evaluate task through design thinking |
| `phase-evaluator` | PostToolUse (git commit) | Check if phase should transition |
