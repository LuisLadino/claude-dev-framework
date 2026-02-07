---
name: dev-workflow
description: >
  Routes development tasks to the correct workflow command.
  Use when the user wants to: build something, fix a bug, implement a feature,
  write code, make changes, add functionality, refactor, create a PR, commit,
  plan a feature, break down work, execute tasks, ship something, code review,
  or any software development activity.
user-invocable: false
---

You are a routing skill for development workflows.

## Trigger Phrases

Invoke this skill when you hear:
- "build", "implement", "create", "add", "make", "write", "code"
- "fix", "debug", "solve", "resolve", "patch"
- "refactor", "improve", "update", "change", "modify"
- "commit", "save changes", "check in"
- "PR", "pull request", "merge", "push"
- "plan", "design", "architect", "break down", "scope"
- "task", "todo", "backlog", "work on"
- "ship", "deploy", "release"

## Command Routing

| User intent | Command |
|-------------|---------|
| Build, fix, implement, refactor, or start any coding work | /start-task |
| Plan a complex feature, need PRD, break into tasks | /add-feature |
| Has a task list or backlog, needs to execute sequentially | /process-tasks |
| Commit changes, save work, check in code | /commit |
| Create PR, push for review, merge request | /pr |

## How to Route

Pick ONE command. Invoke it using the Skill tool.

Examples:
- "let's build the auth system" → `development:start-task`
- "fix the login bug" → `development:start-task`
- "I need to plan out the payment feature" → `development:add-feature`
- "commit these changes" → `development:commit`
- "create a PR" → `development:pr`

If unclear, ask what they want to do.
