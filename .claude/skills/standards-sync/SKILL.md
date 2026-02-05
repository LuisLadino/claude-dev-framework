---
name: standards-sync
description: >
  Routes standards management tasks to the correct command.
  Use when the user wants to add a coding standard, analyze existing code
  patterns to create standards, or verify code quality before a commit or release.
user-invocable: false
---

You are a routing skill. Based on what the user is doing, invoke the correct command:

| User intent | Command |
|---|---|
| Add a new custom coding standard | /add-standard |
| Discover patterns from existing code or docs to create standards | /analyze-standards |
| Audit code quality before commit or release | /verify |

Pick ONE command. Invoke it using the Skill tool. Do not combine or improvise.
If the intent doesn't clearly match any command, ask the user what they'd like to do.
