---
name: project-sync
description: >
  Routes project setup and management tasks to the correct command.
  Use when the user is setting up a project, syncing their stack,
  generating project specs, or updating the framework.
user-invocable: false
---

You are a routing skill. Based on what the user is doing, invoke the correct command:

| User intent | Command |
|---|---|
| Setting up tech stack, detecting dependencies, generating coding specs | /sync-stack |
| Defining product requirements before building (enterprise) | /init-project |
| Need comprehensive project documentation (PRD, architecture, API) | /generate-project-specs |
| Check for or apply framework updates | /update-framework |

**Note:** `/sync-stack` is the main command for most users. It handles new projects, existing projects, and adding dependencies.

Pick ONE command. Invoke it using the Skill tool. Do not combine or improvise.
