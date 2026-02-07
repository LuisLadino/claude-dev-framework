---
name: custom-commands
description: >
  Manages project-specific slash commands and their routing skills.
  Use when the user wants to run a custom workflow, asks what commands are available,
  or when you need to check if custom command directories have proper routing skills.
user-invocable: false
---

You manage project-specific custom commands and ensure they have routing skills.

## When This Triggers

- User mentions a command not in the standard set (development, project-management, specs, utilities)
- User asks "what commands are available" or similar
- User wants to do something project-specific that doesn't fit standard workflows
- At the start of a session to check if custom commands need routing skills

## How to Route

### Step 1: Scan for Custom Commands

Use `Glob` to find all command files:
```
.claude/commands/**/*.md
```

### Step 2: Identify Custom Directories

Standard directories (skip these - they have dedicated routing skills):
- `development/`
- `project-management/`
- `specs/`
- `utilities/`

Any other directory contains custom project-specific commands.

### Step 3: Check for Missing Routing Skills

For each custom command directory found:

1. Check if `.claude/skills/[directory-name]/SKILL.md` exists
2. If it doesn't exist, this directory needs a routing skill

### Step 4: Create Missing Routing Skills

For each directory missing a routing skill, create one:

**File:** `.claude/skills/[directory-name]/SKILL.md`

**Template:**
```markdown
---
name: [directory-name]
description: >
  Routes [directory-name] tasks to the appropriate command.
  Use when the user wants to [inferred purpose from command names].
user-invocable: false
---

You are a routing skill for [directory-name] commands.

## Available Commands

| User intent | Command |
|-------------|---------|
[table mapping intents to commands, inferred from reading each command's header and first paragraph]

## How to Route

Pick ONE command based on user intent. Invoke it using the Skill tool.
If the intent doesn't clearly match, list the available commands and ask.
```

To build the intent-to-command table:
1. Read the first 20 lines of each command file in the directory
2. Extract the command name from the `# /command-name` header
3. Extract the purpose from the description or first paragraph
4. Infer what user intent would trigger each command

### Step 5: Route or List

**If user has a specific intent:** Match their intent to a custom command and invoke it using the Skill tool with the format `[directory]:[command]` (e.g., `red-team-pipeline:persona`).

**If user asks what's available:** List all custom commands with their purposes. Let the user choose which to run.

**If routing skills were created:** Inform the user that routing skills were created for their custom commands and explain how they'll now auto-trigger.

## Example

If the project has `.claude/commands/red-team-pipeline/` with persona.md, ideate.md, plan.md but no `.claude/skills/red-team-pipeline/`:

1. Create `.claude/skills/red-team-pipeline/SKILL.md` with:
   - Intent mappings for "create persona" → /persona, "brainstorm attacks" → /ideate, etc.

2. Inform user:
   ```
   Created routing skill for red-team-pipeline commands.

   Now when you say things like "create an attacker persona" or
   "let's brainstorm attack approaches", I'll automatically invoke
   the right command.
   ```
