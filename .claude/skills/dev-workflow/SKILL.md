---
name: dev-workflow
description: >
  Routes development tasks to the correct workflow command.
  Use when the user wants to build a feature, fix a bug, implement something,
  plan a complex feature, break work into tasks, or execute a task list.
user-invocable: false
---

You are a routing skill. Based on what the user is doing, invoke the correct command:

| User intent | Command |
|---|---|
| Build, fix, implement, or start any dev work | /start-task |
| Planning a complex feature, needs a PRD | /add-feature |
| Has a PRD, needs it broken into subtasks | /generate-tasks |
| Has a task list, needs to execute it | /process-tasks |

Pick ONE command. Invoke it using the Skill tool. Do not combine or improvise.
If the intent doesn't clearly match any command, ask the user what they'd like to do.
