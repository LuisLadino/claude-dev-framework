---
name: skills
description: >
  Configuration and behavior for Claude Code skills: SKILL.md format, frontmatter fields, invocation methods, triggering behavior, hook enforcement patterns, and skill vs command distinctions.
applies_to:
  - ".claude/skills/**/*.md"
category: claude-code
---

# Claude Code Skills Reference

Skills are reusable workflows invoked via the Skill tool or natural language triggers. This spec documents skill configuration and behavior.

---

## Skill Location

Skills are stored in `.claude/skills/{skill-name}/SKILL.md`.

```
.claude/
└── skills/
    ├── research/       # UNDERSTAND phase (entry point)
    ├── define/         # DEFINE phase
    ├── ideate/         # IDEATE phase
    ├── build/          # PROTOTYPE phase (commitment point)
    ├── test/           # TEST phase
    ├── review/         # Quality gate (multi-agent code review)
    ├── commit/         # Ship (docs check → commit → push → PR)
    ├── plan/           # Backlog management
    ├── handoff/        # Session continuity
    └── contribute-to-opensource/
```

---

## SKILL.md Format

```yaml
---
name: skill-name
description: >
  When this skill triggers. Include natural language patterns that should
  invoke it. This description is shown to Claude and used for routing.
allowed-tools: Tool1, Tool2, Tool3  # Optional
model: sonnet                        # Optional
context:                             # Optional
  - path/to/file1.md
  - path/to/file2.md
---

# Skill Title

Instructions for what the skill does...
```

### Required Fields

| Field | Purpose |
|-------|---------|
| `name` | Skill identifier (used with Skill tool) |
| `description` | When to trigger, natural language patterns |

### Optional Fields

| Field | Purpose | Default |
|-------|---------|---------|
| `allowed-tools` | Tools the skill can use | All tools |
| `model` | Model for skill execution | Inherits from parent |
| `context` | Additional files to load | None |

---

## Invocation

### Explicit (Slash Command)
```
/commit
```
User types slash command, skill loads.

### Skill Tool
```yaml
Skill(skill: "commit")
Skill(skill: "commit", args: "-m 'message'")
```
Claude invokes programmatically.

### Natural Language (Automatic)
User says: "let's commit this" or "save changes"
Claude recognizes pattern, invokes skill.

---

## Triggering Behavior

**Opus 4.6+ auto-surfaces all skill descriptions on every prompt** via system-reminder. This means Claude sees the full skill list and trigger phrases every message, significantly improving natural language routing.

For critical workflows, enforcement hooks add a hard guarantee:

1. **User-invoked:** `/skill-name`
2. **Claude-invoked:** `Skill(skill: "name")`
3. **Hook-enforced:** Block direct commands, require skill (e.g., enforce-skills blocks `git commit`)

### Hook Enforcement Pattern
```javascript
// PreToolUse hook blocks direct git commit
if (/\bgit\s+commit\b/i.test(command)) {
  if (!command.includes('SKILL_ACTIVE=1')) {
    console.error('[WORKFLOW REQUIRED] Use commit skill');
    process.exit(2);
  }
}
```

```bash
# Skill uses marker to bypass hook
SKILL_ACTIVE=1 git commit -m "message"
```

---

## Skill Description Guidelines

Good descriptions include:
- What the skill does
- Natural language phrases that should trigger it
- When to use vs not use

```yaml
description: >
  Commit and create PR. Use when: the user says "commit", "let's commit",
  "save this", "checkpoint", "done", "ready to merge", or indicates work
  is complete. Does the full flow: commit → push → PR.
```

Bad description:
```yaml
description: Commits code
```
(Too vague, no trigger phrases)

---

## Skill Content Guidelines

### Do
- Start with context/purpose
- Show the workflow steps
- Include exact commands to run
- Specify what to check/verify
- Handle edge cases

### Don't
- Assume context from previous conversation
- Include multiple unrelated workflows
- Leave decisions vague

### Example Structure
```markdown
# Skill Name

You're doing X. This skill handles:
- Step 1
- Step 2
- Step 3

---

## Step 1: What to Do

Explanation...

```bash
command to run
```

## Step 2: Next Step

...
```

---

## Skill vs Command

| Aspect | Skill (.claude/skills/) | Command (.claude/commands/) |
|--------|-------------------------|------------------------------|
| Invocation | Skill tool, natural language | Read tool, direct execution |
| Routing | Automatic (description match) | Explicit only |
| Structure | SKILL.md in directory | markdown file |
| Tool restrictions | `allowed-tools` field | None |

Use skills for workflows that should trigger from natural language.
Use commands for explicit-only operations or complex multi-file content.

---

## Common Issues

1. **Skill not triggering** - Description doesn't match user's phrasing
2. **Wrong skill triggers** - Overlapping descriptions
3. **Skill doesn't see context** - Add `context:` field for required files
4. **Missing frontmatter** - Skill won't load without YAML frontmatter

---

## This Framework's Skills

| Skill | Phase | Triggers On | Does |
|-------|-------|-------------|------|
| `research` | UNDERSTAND | "work on #X", "look into", "explore" | Research problem, load context, create design thinking tasks |
| `define` | DEFINE | "what are we solving", "root cause", "scope" | Problem statement, root cause, Definition of Done |
| `ideate` | IDEATE | "options", "approaches", "what if" | Generate 3+ approaches, trade-offs, recommend |
| `build` | PROTOTYPE | "build it", "implement", "code it" | Create branch, load specs, incremental work |
| `test` | TEST | "does it work", "verify", "test it" | Verify against DoD, iteration routing |
| `review` | Quality gate | "review this", "code review", "check the code" | Multi-agent diff review (security, performance, patterns, architecture) |
| `commit` | Ship | "commit", "save this", "done" | Docs check + Commit + Push + PR + Auto-merge |
| `plan` | Pre-work | "what's next", "add to backlog", "create issue" | Manage GitHub issues/milestones |
| `handoff` | Continuity | "handoff", "end session", "save context" | Capture context for next session |
| `contribute-to-opensource` | Setup | "contribute to", "OSS", "open source", "fork" | Clone repo, match patterns, set up contribution framework |
