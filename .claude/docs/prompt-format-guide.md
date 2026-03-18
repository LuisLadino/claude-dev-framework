# Claude Code Input Format Guide

**Purpose:** Understand how Claude receives information so you can write instructions in the optimal format.

---

## Overview: What Claude Receives

Claude Code sends input to the Claude API in this structure:

```
┌─────────────────────────────────────────────────────────┐
│ SYSTEM MESSAGE                                          │
│    - Tool definitions (JSON Schema in XML tags)         │
│    - Base behavioral instructions (Markdown)            │
│    - Your appended content (system-rules.md)            │
├─────────────────────────────────────────────────────────┤
│ CONVERSATION (array of messages)                        │
│    - Previous user messages                             │
│    - Previous assistant messages                        │
│    - Tool calls and results                             │
├─────────────────────────────────────────────────────────┤
│ CURRENT USER MESSAGE                                    │
│    - <system-reminder> blocks (from hooks)              │
│    - <system-reminder> with CLAUDE.md content           │
│    - Your actual prompt text                            │
└─────────────────────────────────────────────────────────┘
```

---

## System Message: Tool Definitions

Tools are defined using XML tags containing JSON:

```xml
<functions>
<function>{"description": "...", "name": "Read", "parameters": {...}}</function>
<function>{"description": "...", "name": "Write", "parameters": {...}}</function>
</functions>
```

### JSON Schema Structure

```json
{
  "description": "Reads a file from the local filesystem.\n\nUsage:\n- The file_path must be absolute",
  "name": "Read",
  "parameters": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
      "file_path": {
        "description": "The absolute path to the file",
        "type": "string"
      }
    },
    "required": ["file_path"]
  }
}
```

**Key elements:**
- `"description"` - What the tool does (can include `\n` for newlines)
- `"name"` - Tool identifier
- `"parameters"` - JSON Schema defining valid inputs
- `"type"` - Data type: string, number, boolean, object, array
- `"required"` - Array of mandatory parameter names

### Escape Sequences in JSON Strings

| You See | Renders As |
|---------|------------|
| `\n` | Line break |
| `\t` | Tab |
| `\"` | Quote character |
| `\\` | Backslash |

These only appear in JSON. In Markdown files, write normally.

---

## System Message: Behavioral Instructions

After tool definitions, the system prompt contains plain Markdown:

```markdown
You are Claude Code, Anthropic's official CLI for Claude.

# Tone and style
- Only use emojis if the user explicitly requests it.
- Your output will be displayed on a command line interface.

# Doing tasks
The user will primarily request you perform software engineering tasks...
```

**Your `system-rules.md` gets appended here** via `--append-system-prompt`. It becomes part of the system message, not wrapped in any tags.

---

## User Message: Hook Injections

Hooks output to stdout. Claude Code wraps this in `<system-reminder>` tags:

```xml
<system-reminder>
SessionStart hook success: [YOUR HOOK OUTPUT HERE]

User: Luis Ladino
Background: Design thinker...
</system-reminder>
```

The content inside is plain text or Markdown.

---

## User Message: CLAUDE.md Files

Claude Code auto-loads CLAUDE.md files and wraps them:

```xml
<system-reminder>
As you answer the user's questions, you can use the following context:
# claudeMd
Codebase and user instructions are shown below...

Contents of /path/to/CLAUDE.md (project instructions, checked into the codebase):

[Your CLAUDE.md content]

      IMPORTANT: this context may or may not be relevant to your tasks...
</system-reminder>
```

---

## XML Tags Reference

| Tag | Contains | Where |
|-----|----------|-------|
| `<functions>` | All tool definitions | System message |
| `<function>` | Single tool (JSON) | Inside `<functions>` |
| `<system-reminder>` | Hook output or CLAUDE.md | User message |
| `<example>` | Behavioral examples | System message |
| `<env>` | Environment info | System message |

**Note:** When Claude calls tools, it uses `<function_calls>` and `<invoke>` (with namespace prefix), not the plain versions shown in examples.

---

## Writing Style That Works

Looking at Claude Code's own system prompt, these patterns are used:

### Voice

**Imperative, not suggestive:**
```
Good: "Use absolute paths."
Bad: "You might want to consider using absolute paths."
```

**Direct, not hedged:**
```
Good: "NEVER run destructive commands unless explicitly requested."
Bad: "It's generally a good idea to avoid running destructive commands."
```

**Active, not passive:**
```
Good: "Claude processes this as documentation."
Bad: "This is processed by Claude as documentation."
```

### Emphasis

**CAPS for critical rules:**
```
IMPORTANT: This tool is for terminal operations.
NEVER use git commands with the -i flag.
CRITICAL: Always create NEW commits rather than amending.
```

### Structure

**Bullets over paragraphs:**
```
Good:
- Verify edits by reading the file
- Show proof with file path and line number
- Check context7 before claiming patterns

Bad:
When working on this project, you should verify edits by reading
the file after you make changes. You should also show proof by
including the file path and line number. Additionally, check context7
before claiming any library patterns.
```

**Conditionals are explicit:**
```
Good: "If the commit fails due to pre-commit hook: fix the issue and create a NEW commit"
Bad: "Pre-commit hooks might fail sometimes, in which case you'd want to fix things"
```

**Examples inline:**
```
Good: "fix(auth): resolve token refresh race condition"
Bad: "fixed stuff"
```

### Word Choice

| Avoid | Use Instead |
|-------|-------------|
| "You might want to" | Direct imperative |
| "Consider doing" | "Do" |
| "It's recommended" | Just state the rule |
| "Generally" / "Usually" | Be specific or omit |
| "Should" (weak) | "Must" or direct imperative |

---

## How to Write Instructions

### For system-rules.md

Plain Markdown. Appended directly to system message (no wrapper).

```markdown
# Required Response Format

Start every response with:
**Lens:** Which perspective you're adopting
**Phase:** Current design thinking phase
```

### For CLAUDE.md

Plain Markdown. Gets wrapped in `<system-reminder>` in user message.

```markdown
# Project Instructions

## Rules
- Verify edits by reading the file after editing
- Show proof: file path and line number for claims
```

### For Hook Output

Plain text or Markdown via stdout. Gets wrapped in `<system-reminder>`.

```javascript
console.log(`[SESSION CONTEXT]

User: ${user.name}
Current task: ${task.description}`);
```

---

## Where to Put What

| Content | Put In | Arrives As |
|---------|--------|------------|
| High-priority rules | system-rules.md | Raw text in system message |
| Project-specific rules | CLAUDE.md | `<system-reminder>` in user message |
| Session context | Hook stdout | `<system-reminder>` in user message |

**Practical implication:** If something is critical and you want it in the system prompt itself, put it in `system-rules.md`. CLAUDE.md content arrives in the user message.

---

## Don't Do This

### Don't write JSON for instructions

```json
{"instruction": "Always verify edits", "priority": "high"}
```

Just write Markdown:

```markdown
## Rules
- Always verify edits
```

### Don't over-abbreviate

```
cfg: dt_mode=on, lens=pm
lrn: no_skip_steps
```

Claude has to guess what these mean. Write it out:

```
Apply design thinking methodology.
Adopt the PM lens when giving advice.
Never skip steps the user explicitly asks for.
```

### Don't use custom terminology without explanation

```
[ANTIGRAVITY SESSION CONTEXT]
```

Claude doesn't know what "Antigravity" means. Either:
- Use a descriptive name: `[SESSION CONTEXT]`
- Or explain it: `The following context comes from the Antigravity session management system:`

---

## Token Efficiency

### Hierarchical headers are compact

```markdown
# Category
## Subcategory
- Rule
```

Better than verbose prose explaining the same structure.

### Examples over explanations

```markdown
## Commit Messages
Good: "fix(auth): resolve token refresh race condition"
Bad: "fixed stuff"
```

Clearer than paragraphs describing the format.

### Avoid redundancy

Don't repeat the same instruction in system-rules.md, CLAUDE.md, and hook output.

---

## Future: VOIR Integration

This understanding supports VOIR's Input Transparency vision:

1. **See what AI receives** - The raw dump (`session-start-decoded.md`)
2. **Understand the format** - This guide
3. **Optimize for comprehension** - Writing style and semantic clarity

Potential System Prompt Editor features:
- **Format validation** - Is the syntax correct?
- **Semantic linting** - Are custom labels explained?
- **Redundancy detection** - Is this duplicated elsewhere?
- **Arrival visualization** - Show what's in system message vs user message
- **Token counting** - Per-section and total

---

## See Also

- `session-start-decoded.md` - Raw dump of what Claude receives at session start
- `system-audit.md` - What files exist and when they're read/written
- `system-diagram.md` - Visual diagrams of the data flow
