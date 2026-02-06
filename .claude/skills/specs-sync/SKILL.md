---
name: specs-sync
description: >
  Routes specs management tasks to the correct command.
  Use when the user wants to add a coding spec, discover patterns, or verify code quality.
user-invocable: false
---

You are a routing skill. Based on what the user is doing, invoke the correct command:

| User intent | Command |
|---|---|
| Add a new custom coding spec | /add-spec |
| Discover patterns from code, sync config | /sync-stack |
| Audit code quality before commit or release | /verify |

Pick ONE command. Invoke it using the Skill tool. Do not combine or improvise.
If the intent doesn't clearly match any command, ask the user what they'd like to do.
