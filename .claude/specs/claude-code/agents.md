---
name: agents
description: >
  Configuration and behavior for Claude Code agents: file format, frontmatter fields, triggering via hooks or Agent tool, model selection, tool permissions, and output patterns.
applies_to:
  - ".claude/agents/**/*.md"
category: claude-code
---

# Claude Code Agents Reference

Agents are specialized subprocesses that handle complex tasks. They are spawned via hooks that inject instructions for the main session to invoke the Agent tool.

---

## Agent Location

Agent definitions live in `.claude/agents/{agent-name}.md`.

```
.claude/
└── agents/
    ├── context-agent.md
    └── phase-evaluator.md
```

---

## Agent File Format

```yaml
---
name: agent-name
description: What this agent does and when to use it
tools: Tool1, Tool2, Tool3
model: haiku
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

### Via Command Hook + Agent Tool (Current Pattern)

Hooks inject an instruction telling the main session to spawn the agent via the Agent tool. This avoids the broken `type: "agent"` pattern.

```javascript
// Hook outputs instruction text
console.log(`IMPORTANT: Spawn the context agent in the background.

Use the Agent tool with these exact parameters:
- description: "Establish project context"
- subagent_type: "context-agent"
- model: "haiku"
- prompt: "Evaluate the current project state."
- run_in_background: true`);
```

### Via Agent Tool Directly

```javascript
Agent({
  description: "Establish project context",
  subagent_type: "context-agent",
  model: "haiku",
  prompt: "Evaluate the current project state.",
  run_in_background: true
})
```

### DO NOT use type: "agent" hooks

The `type: "agent"` hook pattern in settings.json is unreliable. Use command hooks that inject Agent tool instructions instead.

---

## Built-in Subagent Types

Available via the Agent tool:

| Type | Purpose | Tools |
|------|---------|-------|
| `Explore` | Codebase exploration | Read, Grep, Glob, etc. (no Edit/Write) |
| `Plan` | Implementation planning | Read, Grep, Glob, etc. (no Edit/Write) |
| `general-purpose` | Multi-step research | All tools |
| `context-agent` | Custom: project context at session start | Per agent definition |
| `phase-evaluator` | Custom: evaluate commits | Per agent definition |

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

Agents return their output as text to the main session. The main session receives the agent's final message directly.

**Context Agent:** Returns plain text evaluation (phase, GitHub state, gaps, focus recommendation). Under 500 words.

**Phase Evaluator:** Returns JSON with phase assessment, observations, issues to create, and reflection prompts. The spawn hook writes this to `.claude/phase-evaluation.json` for inject-context.cjs to pick up on the next prompt.

---

## Hook Events for Agents

| Event | When to Use | Example Agent |
|-------|-------------|---------------|
| `SessionStart` | Initialize context | Context Agent |
| `PostToolUse` | React to tool completion | Phase Evaluator (on git commit) |

---

## Common Issues

1. **Agent doesn't run** — Hook output not acted on (main session ignores the instruction)
2. **Agent can't use tool** — Tool not in `tools` list
3. **Output not visible** — Background agents return results asynchronously
4. **Wrong model** — Using opus for simple tasks wastes tokens

---

## This Framework's Agents

| Agent | Trigger | Purpose |
|-------|---------|---------|
| `context-agent` | SessionStart | Strategic advisor: GitHub state, phase assessment, gaps, focus recommendation |
| `phase-evaluator` | PostToolUse (git commit) | Strategic advisor: evaluate commits, create issues, flag system map staleness |
