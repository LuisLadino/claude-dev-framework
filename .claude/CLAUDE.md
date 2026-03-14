# Claude Code Project Instructions

## Rules

- Verify edits by reading the file after editing
- Show proof: file path and line number for claims, command output for verifications
- Use slash commands when they exist for the task
- Check context7 before claiming library patterns

---

## Specs

Specs define how code should be written. They live in `.claude/specs/`.

Before writing code, read the specs listed in `stack-config.yaml`. The enforce-specs hook will block edits until you do.

To generate specs: `/sync-stack`
To add a library: `/sync-stack prisma`
To add custom rules: `/sync-stack --custom api-conventions`

---

## Hooks

Hooks enforce behavior. Don't fight them.

- **enforce-specs** blocks code edits until specs are read
- **block-dangerous** blocks rm -rf, force push, credential exposure
- **verify-before-stop** checks for debug statements before stopping
- **awareness** prompts for /analyze when issues accumulate

If a hook blocks you, there's a reason.

---

## Commands

Use `/start-task` when starting any coding task. It loads specs.

Use `/add-feature` for complex features needing planning. Then `/process-tasks` to implement.

Use `/commit` when ready to commit. Use `/pr` when ready to open a PR.

Use `/sync-stack` to set up a project or add dependencies.

Use `/audit` before major releases or PRs.

Use `/analyze` in a split pane to monitor framework health.
