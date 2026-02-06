# /process-tasks - Execute Task List

Use after `/generate-tasks` to implement a feature one subtask at a time. Executes ONE subtask at a time, runs `/start-task` workflow for each, verifies after each, waits for approval, commits after each parent task, and can pause/resume anytime.

---

## STEP 1: Load Stack Configuration

Read `.claude/your-stack/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework/version, language, styling, testing framework, package manager, active standards.

If `.claude/your-stack/init/project-guidelines.md` exists, read it for quality/testing/accessibility requirements.

---

## STEP 2: Select Task List

Search `.claude/tasks/` for task list files. Show available lists with subtask counts and progress. Ask user which to use, or accept a filename argument directly.

---

## STEP 3: Read Task List & Assess Progress

Read the selected task list file. Show user: stack info, PRD reference, progress (completed/remaining subtasks), and next subtask up. Ask "Ready to start? (yes/no)".

---

## STEP 4: Execute Subtasks (ONE AT A TIME)

### For Each Subtask, run the complete `/start-task` workflow:

1. **Show subtask details** - What, purpose, files to create/modify, applicable standards
2. **Show Standards Check** - Stack, approach, loaded standards (including project-guidelines.md if exists), files to create/modify, framework patterns. Ask "Should I proceed? (yes/no)"
3. **WAIT FOR APPROVAL**
4. **Execute subtask** following framework patterns
5. **Verify changes** - Run format, lint, type-check, build, tests. If project-guidelines.md specifies "Quality First", also run accessibility, performance, and coverage checks.
6. **Mark subtask complete** - Update task list, show progress (parent task and overall), show next subtask. Ask "Ready to continue? (yes/no/pause)"
7. **WAIT FOR APPROVAL**

---

## STEP 5: After Parent Task Complete

When ALL subtasks in a parent task are done:

1. Show completed parent task with all subtasks checked off
2. Run full test suite, report results
3. Show files to commit and suggested commit message (following `.claude/your-stack/config/version-control.md` format)
4. Ask "Ready to commit? (yes/no/edit)"
5. **WAIT FOR APPROVAL**
6. If approved, stage and commit
7. Show progress (completed/remaining parent tasks), next parent task
8. Ask "Ready to continue? (yes/no/pause)"
9. **WAIT FOR APPROVAL**

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

## Enforcement

**CRITICAL RULES:**

1. **ONE subtask at a time** - Complete, verify, mark [x], STOP and wait for approval. Never continue without "yes".
2. **Standards on every subtask** - Execute /start-task workflow, show standards check, wait for approval, follow framework patterns exactly.
3. **Verify before marking complete** - Run all checks (format, lint, type-check, build, test). Fix failures. Only mark [x] when all pass.
4. **Commit after each parent task** - When all subtasks are [x], run full test suite, stage and commit, mark parent [x].
5. **Never skip verification** - Every subtask and every parent task must pass all checks.

---

## Workflow Summary

```
For each subtask:
  1. Show standards check
  2. Wait for approval
  3. Execute subtask (following stack patterns)
  4. Verify (format, lint, type-check, build, test)
  5. Mark subtask [x]
  6. Show progress
  7. STOP - Wait for "yes"
  8. If "yes": Continue to next subtask

When all subtasks in parent task complete:
  1. Run full test suite
  2. Stage changes (git add .)
  3. Generate commit message (framework-aware)
  4. Wait for approval
  5. Execute commit
  6. Mark parent task [x]
  7. Show commit summary
  8. STOP - Wait for "yes"
  9. If "yes": Continue to next parent task

When all parent tasks complete:
  Show feature complete summary
```

**Follow this workflow exactly.**