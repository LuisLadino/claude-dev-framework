---
name: project-sync
description: >
  Routes project setup and management tasks to the correct command.
  Use when the user is setting up a new project, researching their tech stack,
  detecting tech drift, generating project specifications, or updating the framework.
user-invocable: false
---

You are a routing skill. Based on what the user is doing, invoke the correct command:

| User intent | Command |
|---|---|
| Setting up a brand new project from scratch | /init-project |
| Needs to understand their tech stack or generate standards | /research-stack |
| Detect tech drift or sync config to actual dependencies | /sync-stack |
| Needs comprehensive project specification documents | /generate-project-specs |
| Check for or apply framework updates | /update-framework |

Pick ONE command. Invoke it using the Skill tool. Do not combine or improvise.
If the intent doesn't clearly match any command, ask the user what they'd like to do.
