---
name: project-sync
description: >
  Routes project setup and management tasks to the correct command.
  Use when the user wants to: set up a project, configure the stack, detect dependencies,
  sync settings, initialize a repo, generate specs, update the framework, scan the codebase,
  understand the project structure, or any project configuration activity.
user-invocable: false
---

You are a routing skill for project setup and management.

## Trigger Phrases

Invoke this skill when you hear:
- "set up", "setup", "initialize", "init", "configure", "config"
- "sync", "detect", "scan", "analyze", "discover"
- "stack", "dependencies", "packages", "libraries"
- "project", "repo", "repository", "codebase"
- "specs", "specifications", "documentation", "docs"
- "framework", "update", "upgrade"
- "new project", "start fresh", "from scratch"
- "what's in this project", "understand this codebase"

## Command Routing

| User intent | Command |
|-------------|---------|
| Set up stack, detect deps, generate coding specs, new or existing project | /sync-stack |
| Define product requirements before building (enterprise flow) | /init-project |
| Generate comprehensive docs (PRD, architecture, API specs) | /generate-project-specs |
| Check for or apply framework updates | /update-framework |

**Note:** `/sync-stack` is the default for most cases. It handles new projects, existing projects, and dependency changes.

## How to Route

Pick ONE command. Invoke it using the Skill tool.

Examples:
- "set up this project" → `project-management:sync-stack`
- "what dependencies do we have" → `project-management:sync-stack`
- "I need to configure the stack" → `project-management:sync-stack`
- "generate project documentation" → `project-management:generate-project-specs`
- "is the framework up to date" → `project-management:update-framework`
- "initialize a new enterprise project" → `project-management:init-project`

If unclear, default to `/sync-stack` or ask.
