# /process-tasks - Execute Task List

Use after `/add-feature` to implement a feature one subtask at a time. Executes ONE subtask at a time, runs `/start-task` workflow for each, verifies after each, waits for approval, commits after each parent task, and can pause/resume anytime.

---

## STEP 1: Load Stack Configuration

Read `.claude/specs/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework/version, language, styling, testing framework, package manager, active specs.

If `.claude/specs/project-guidelines.md` exists, read it for quality/testing/accessibility requirements.

---

## STEP 2: Select Task List

Search `.claude/tasks/` for task list files. Show available lists with subtask counts and progress. Ask user which to use, or accept a filename argument directly.

---

## STEP 3: Read Task List & Assess Progress

Read the selected task list file. Show user: stack info, PRD reference, progress (completed/remaining subtasks), and next subtask up. Ask "Ready to start? (yes/no)".

---

## STEP 4: Execute Subtasks

Task lists use markdown checkboxes: `- [ ]` (pending) and `- [x]` (complete).

For each subtask:

1. **Show what's next** - Subtask name, what it does, files to create/modify
2. **Execute** - Follow framework patterns from specs
3. **Verify** - Run quality gates from stack-config.yaml
4. **Mark complete** - Change `- [ ]` to `- [x]` in task list file
5. **Show progress** - "Completed X/Y subtasks"

**Continue automatically** unless verification fails. If failure, stop, show error, fix, and ask to continue.

**To pause:** User can say "pause" at any time. Progress is saved to the task list file.

---

## STEP 5: After Parent Task Complete

When all subtasks in a parent task are done:

1. Show completed parent task
2. Run full test suite
3. Ask "Commit this parent task? (yes/no)"
4. If yes, commit using `.claude/specs/config/version-control.md` format
5. Continue to next parent task

---

## STEP 6: Feature Complete

When ALL parent tasks are done, show completion summary:
- Feature name and stack
- All completed parent tasks
- Statistics (subtasks, files created, commits, tests)
- Summary of what was built (from PRD)
- All created files organized by type
- Stack patterns used

Suggest next steps: test the feature manually, run `/verify`, run `/learn`, deploy if ready.

---

## Pause & Resume

### Pausing
At any approval point, if user says "pause": save progress to task list file, show current status (task list, last completed, next up, parent task progress). User can close conversation safely.

### Resuming
When `/process-tasks` is run on a task list with existing progress: detect completed subtasks, show progress summary, ask to continue from next incomplete subtask.

---

## Error Handling

### If Subtask Fails Verification
Show error details, analyze what went wrong, apply fix, re-run all checks. Only mark complete when all checks pass. Ask "Continue? (yes/no)".

### If Tests Fail
Show failed tests with reasons, analyze root cause, apply fixes, re-run test suite. Only proceed when all tests pass. Ask "Continue? (yes/no)".

---

## Rules

1. **Verify before marking complete** - All checks must pass
2. **Stop on failure** - Don't continue if verification fails
3. **Commit after parent tasks** - Not after every subtask