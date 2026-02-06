---
name: custom-commands
description: >
  Routes to project-specific slash commands not covered by the standard skills.
  Use when the user wants to run a custom workflow, mentions a command you don't
  recognize, or asks what commands are available in this project.
user-invocable: false
---

You are a routing skill for project-specific custom commands.

## When This Triggers

- User mentions a command not in the standard set (development, project-management, specs, utilities)
- User asks "what commands are available" or similar
- User wants to do something project-specific that doesn't fit standard workflows

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

### Step 3: Read Custom Command Headers

For each custom command file found, read the first 10 lines to extract:
- Command name (from `# /command-name` header)
- Purpose/description (from subtitle or first paragraph)

### Step 4: Route or List

**If user has a specific intent:** Match their intent to a custom command and invoke it using the Skill tool.

**If user asks what's available:** List all custom commands with their purposes. Let the user choose which to run.

**If no custom commands exist:** Inform the user this project has no custom commands beyond the standard set. Suggest they can create custom commands in `.claude/commands/[category]/`.

## Example

If the project has `.claude/commands/deployment/deploy-staging.md`:

```
Custom commands found:
- /deploy-staging - Deploy current branch to staging environment

Which would you like to run?
```
