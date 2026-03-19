---
name: instruction-format
description: >
  How to write instructions that Claude follows reliably. Covers formatting patterns, emphasis words, positioning for context retention, and structure templates for agents, skills, and system prompts.
applies_to:
  - ".claude/skills/**/*.md"
  - ".claude/agents/**/*.md"
  - ".claude/specs/**/*.md"
category: claude-code
---

# Instruction Format Guide

How to write instructions that Claude follows reliably. Use this when writing agents, skills, system prompts, or any text meant to direct Claude's behavior.

**Source:** Extracted from Claude Code system prompts (Piebald-AI/claude-code-system-prompts, version 2.1.71-2.1.75) + Anthropic documentation + research on LLM context processing.

---

## Why Format Matters

Claude is trained to follow instructions formatted in specific patterns. Using the same patterns as official system prompts increases adherence.

Position also matters - the "lost in the middle" phenomenon means models attend most to beginning and end of context, least to middle. Instructions that must never drift need system prompt placement.

---

## Format Patterns

### 1. Identity Statement (First Line)

Always start with who/what the agent is:

```
You are [role]. Your primary responsibility is [what you do].
```

**Example:**
```
You are a file search specialist for Claude Code. You excel at thoroughly navigating and exploring codebases.
```

### 2. Critical Sections

For absolute non-negotiable rules, use triple equals and caps:

```
=== CRITICAL: [SECTION NAME] ===
You are STRICTLY PROHIBITED from:
- [specific thing with example]
- [specific thing with example]
```

**Example:**
```
=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Using redirect operators (>, >>, |) to write to files
```

### 3. Bold Section Headers

Use `**bold**` for section organization:

```
**Your expertise spans three domains:**

**Approach:**

**Guidelines:**
```

### 4. Numbered Lists

For sequential procedures or prioritized items:

```
1. First do this
2. Then do this
3. Finally do this
```

### 5. Bullet Points

For specific rules within sections:

```
- Always prioritize X over Y
- NEVER do Z
- Use A when B
```

### 6. Emphasis Words

Use these specific words for different levels of requirement:

| Word | Meaning | Use For |
|------|---------|---------|
| `STRICTLY PROHIBITED` | Absolute no | Hard safety boundaries |
| `EXCLUSIVELY` | Only this, nothing else | Restricting scope |
| `NEVER` | Hard rule | Things that must not happen |
| `ONLY` | Restricted use | Limiting when something applies |
| `MUST` | Required action | Non-optional steps |
| `ALWAYS` | Every time | Consistent behaviors |

### 7. Closing Directive

End with clear instruction:

```
Complete the user's request by [how to complete it].
```

---

## What Makes Instructions Stick

### Specific over vague

**Bad:** "Be careful with files"
**Good:** "You are STRICTLY PROHIBITED from creating new files (no Write, touch, or file creation of any kind)"

### Examples of what NOT to do

```
NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit
```

### Explain WHY when helpful

```
You do NOT have access to file editing tools - attempting to edit files will fail.
```

### Concrete actions, not abstract values

**Bad:** "Research thoroughly"
**Good:** "Use WebFetch to fetch the appropriate docs map"

### Conditional guidance

```
Use Read when you know the specific file path.
Use WebSearch if docs don't cover the topic.
```

---

## Structure Template

```markdown
You are [identity]. Your primary responsibility is [core function].

=== CRITICAL: [NON-NEGOTIABLE SECTION] ===
You are STRICTLY PROHIBITED from:
- [specific prohibition with example]
- [specific prohibition with example]

**[Section Name]:**
- [guideline]
- [guideline]

**Approach:**
1. [first step]
2. [second step]
3. [third step]

**Guidelines:**
- Always [do this]
- NEVER [do that]
- When [condition], [action]

Complete [task description] by [how to do it].
```

---

## Where Instructions Go

Different types of instructions go in different places based on how reliably they need to be followed:

| Location | What Goes Here | Why |
|----------|----------------|-----|
| System prompt (`--append-system-prompt`) | Non-negotiable behaviors, core identity | Primacy effect - beginning of context gets most attention |
| CLAUDE.md | Project-specific patterns, coding conventions | Loaded per-project, can vary |
| Hook injection | Dynamic context, current task, voice profile | Changes per-session or per-prompt |
| Skills/Agents | Task-specific procedures | Loaded on demand |

**The "Lost in the Middle" pattern:**
- Beginning: 80-90% accuracy
- Middle: 40-60% accuracy
- End: 75-85% accuracy

Put critical instructions at the beginning (system prompt) or end (closing directive), not buried in the middle.

---

## Anti-Patterns

### Using documentation format instead of instruction format

**Bad:**
```markdown
## Non-Negotiable Behaviors
The following behaviors are expected...
```

**Good:**
```markdown
=== CRITICAL: NON-NEGOTIABLE BEHAVIORS ===
You are STRICTLY PROHIBITED from:
```

### Abstract values without actions

**Bad:** "Be ethical"
**Good:** "Don't provide instructions for illegal activities like hacking, theft, or fraud"

### Assuming context will be remembered

In long conversations, instructions in the middle get "lost." If something keeps drifting, move it to system prompt level.

---

## Examples from Claude Code

### Explore Agent

```markdown
You are a file search specialist for Claude Code. You excel at thoroughly navigating and exploring codebases.

=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Running ANY commands that change system state

Your strengths:
- Rapidly finding files using glob patterns
- Searching code with powerful regex patterns
- Reading and analyzing file contents

Guidelines:
- Use Read when you know the specific file path
- Use Bash ONLY for read-only operations (ls, git status, git log)
- NEVER use Bash for: mkdir, touch, rm, cp, mv, git add, git commit
- Return file paths as absolute paths in your final response

Complete the user's search request efficiently and report your findings clearly.
```

### Claude Guide Agent

```markdown
You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers.
2. **Claude Agent SDK**: Framework for building custom AI agents.
3. **Claude API**: Direct model interaction, tool use, integrations.

**Approach:**
1. Determine which domain the user's question falls into
2. Use WebFetch to fetch the appropriate docs map
3. Identify the most relevant documentation URLs
4. Provide clear, actionable guidance based on official documentation

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples when helpful
- Reference exact documentation URLs

Complete the user's request by providing accurate, documentation-based guidance.
```
