---
name: contribute-to-opensource
description: >
  Set up the framework to contribute to an open source project.
  Use when the user wants to contribute to an open source project, is working
  with open source code they might contribute to, or wants to match an external
  project's coding patterns and contribution guidelines.
---

# /contribute-to-opensource

**Set up your framework to match an open source project's patterns and contribution guidelines**

---

## Purpose

Configure your coding framework to match an open source project's tech stack, coding patterns, and contribution guidelines so your contributions look like they were written by someone on the team.

**Use when:**
- You want to contribute to an open source project
- You've cloned a repo and want to understand their codebase
- You have an open source dependency in your project and want to contribute back to it
- You need to match their coding standards before submitting a PR

---

## Step 1: Identify the Target Project

Ask the user:

```
Which open source project do you want to contribute to?

1. I'm currently inside the project's repo
2. The project lives inside my repo (vendored dependency, submodule, etc.)
3. I need to clone it first
```

**If option 1:** Verify we're in a git repo. Get the remote URL and project name.

**If option 2:** Ask where the project code lives (directory path). Verify the path exists and contains source code. All analysis in later steps targets that directory, not the root project.

**If option 3:** Ask for the repo URL. Clone it. cd into it. Ask the user to copy their `.claude/` directory in, then re-run the command. Stop here.

---

## Step 2: Project Overview

Show what was detected:

```
OPEN SOURCE PROJECT DETECTED

Repository: [org/repo-name]
URL: [repo-url or local path]
Location: [root repo / subdirectory at path/to/project]

Package Manager: [detected from lock files]
Project Type: [detected from package.json or file structure]

I'm going to configure your framework to match this project's:
- Tech stack (framework, language, tools)
- Coding patterns (component structure, naming, imports)
- Contribution guidelines (commit format, PR process)
- Testing conventions (file structure, naming patterns)

Ready to proceed? (yes/no)
```

WAIT for user approval.

---

## Step 3: Detect Tech Stack

Run `/sync-stack` targeting the project directory.

- Detect framework from dependencies and file structure
- Detect language from file extensions and config
- Detect styling approach
- Detect testing framework
- Detect package manager
- Create/update `stack-config.yaml`

Display what was detected.

---

## Step 4: Analyze Codebase Patterns

Run `/sync-stack` to analyze the project.

- Detect stack from config files
- Scan code for patterns (structure, naming, imports, state, testing)
- Create standards files matching their patterns

Display discovered patterns.

---

## Step 5: Check Contribution Documentation

Search the project for:
- `CONTRIBUTING.md`
- `DEVELOPMENT.md`
- `CODE_OF_CONDUCT.md`
- `docs/` directory
- `README.md` (contributing section)
- `.github/PULL_REQUEST_TEMPLATE.md`

If found, extract:
- Commit message format
- PR requirements (tests, linting, descriptions)
- Code style rules
- Branch naming conventions
- Review process
- Any CLA or sign-off requirements

Update `.claude/specs/config/version-control.md` with their specific conventions.

If no contribution docs found, note this and use standard open source best practices.

---

## Step 6: Generate Framework Standards

Run `/research-stack` to generate best practices for their specific tech stack.

- Research each technology they use
- Generate comprehensive standards
- Align generated standards with the patterns discovered in Step 4

---

## Step 7: Create Contribution Tracker

Create `PROJECT-STATE.md` with:

- Project overview and tech stack
- Their coding patterns summary
- Their contribution guidelines
- Useful commands (install, dev, test, lint, build)
- Next steps checklist (find issue, claim it, create branch, etc.)
- Session log for tracking progress

---

## Step 8: Completion Summary

Show:
- What was configured (tech stack, patterns, guidelines, standards)
- Where files were saved
- Next steps for making a contribution
- Reminder that the framework will now use THEIR patterns

---

## Error Handling

### If stack detection fails
Show what was detected and what's missing. Offer to continue with partial detection or let the user fill in gaps manually.

### If no patterns found
Note the limitation. Use framework defaults. The framework will still work but may not match their exact style.

### If research-stack fails
List what succeeded and what failed. Suggest running `/research-stack` manually later to retry.

---

## Notes

This skill orchestrates multiple commands in sequence:
1. `/sync-stack` (detect tech + find patterns + generate standards)
2. Contribution docs extraction
3. PROJECT-STATE.md creation

Each step can also be run individually for more control.

When targeting a subdirectory (option 2), all analysis is scoped to that directory. The generated standards and config still live in your project's `.claude/specs/` but reflect the target project's patterns.
