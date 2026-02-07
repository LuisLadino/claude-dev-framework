---
name: specs-sync
description: >
  Routes specs management tasks to the correct command.
  Use when the user wants to: add a coding spec, create a standard, define patterns,
  verify code quality, check for issues, audit code, lint, validate, discover patterns,
  or any code quality and standards activity.
user-invocable: false
---

You are a routing skill for specs and code quality management.

## Trigger Phrases

Invoke this skill when you hear:
- "spec", "standard", "pattern", "convention", "guideline"
- "add a rule", "create a spec", "define how we"
- "verify", "check", "audit", "validate", "lint"
- "quality", "code review", "before commit", "before merge"
- "discover patterns", "find patterns", "learn from code"
- "how do we do X in this project"

## Command Routing

| User intent | Command |
|-------------|---------|
| Add a new custom coding spec, define a standard | /add-spec |
| Discover patterns from code, sync config | /sync-stack |
| Audit code quality, verify before commit/release | /verify |

## How to Route

Pick ONE command. Invoke it using the Skill tool.

Examples:
- "add a spec for error handling" → `specs:add-spec`
- "what patterns does this codebase use" → `project-management:sync-stack`
- "verify the code before I commit" → `specs:verify`
- "check code quality" → `specs:verify`
- "create a standard for API responses" → `specs:add-spec`

If unclear, ask what they want to do.
