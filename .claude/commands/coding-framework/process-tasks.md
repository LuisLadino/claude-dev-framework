# /process-tasks - Execute Task List

**Build complex features step-by-step, adapted to your tech stack.**

Use after `/generate-tasks` to implement a feature one subtask at a time.

---

## Overview

This command:
- Reads your task list
- Loads your stack configuration  
- Executes ONE subtask at a time
- Runs `/start-task` workflow for each
- Verifies after each subtask
- Waits for your approval
- Commits after each parent task
- Can pause/resume anytime

---

## STEP 1: Load Stack Configuration

**Before starting, understand the tech stack:**

Use `Read` or `Grep`:
```
Path: ".claude/your-stack/stack-config.yaml"
```

**Extract:**
- Framework and version
- Language
- Styling solution
- Testing framework
- Package manager
- Active standards

**This ensures each subtask follows your stack's patterns**

---

## STEP 1.5: Check for Project Guidelines (Optional)

**Check if project has specific quality requirements:**

Use `Read` or `Grep`:
```
Path: ".claude/your-stack/init/project-guidelines.md"
```

**If found (.claude/your-stack/init/project-guidelines.md):**

```
📋 **PROJECT REQUIREMENTS DETECTED**

Extracting project-specific standards:
✓ Quality approach: [Speed First / Balanced / Quality First]
✓ Testing requirements: [Coverage % or approach]
✓ Accessibility: [WCAG A / AA / AAA or None]
✓ Performance targets: [Load times, Lighthouse scores]
✓ Must-have integrations: [List from project guidelines]

**These will be enforced during task execution:**
- Verification rigor adjusted for quality approach
- Test coverage measured against project guidelines requirements
- Accessibility validation at specified WCAG level
- Performance benchmarks checked against targets
```

**If not found:**

```
ℹ️  No project guidelines found (optional)

Using universal standards from CLAUDE.md.
Project-specific requirements can be added via `/init-project`.

This is optional - task execution will proceed normally.
```

---

## STEP 2: Select Task List

```
⚙️  **PROCESS TASKS FROM LIST**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking for task lists in .claude/tasks/...

Found task lists:
1. tasks-0001-prd-project-filtering.md (15 subtasks, 3 complete)
2. tasks-0002-prd-contact-form.md (12 subtasks, 0 complete)
3. tasks-0003-prd-dark-mode.md (18 subtasks, 0 complete)

Which task list should I use? (number or filename)
```

**Or specify directly:**
```
/process-tasks tasks-0003-prd-dark-mode.md
```

---

## STEP 3: Read Task List & Assess Progress

```
📖 **READING TASK LIST**

File: .claude/tasks/tasks-0003-prd-dark-mode.md

**Stack:** [Framework] + [Language] + [Styling] + [Testing]
**PRD:** 0003-prd-dark-mode.md

**Progress:**
- Total parent tasks: 6
- Total subtasks: 18
- Completed: 0
- Remaining: 18

**Next Up:**
- [ ] 1.0 Set up feature structure
  - [ ] 1.1 Create [framework] component directory
  - [ ] 1.2 Create [framework] component files
  - [ ] 1.3 Create test files per [test framework]
  - [ ] 1.4 Add barrel exports

Ready to start? (yes/no)
```

---

## STEP 4: Execute Subtasks (ONE AT A TIME)

### For Each Subtask:

```
🔨 **SUBTASK: [X.Y] [Title]**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What:** [Description from task list]

**Purpose:** [Why this subtask exists]

**Will create/modify:**
- [file 1]
- [file 2]

**Standards applying:**
- [framework]-standards.md
- [language]-standards.md
- file-structure.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Executing /start-task workflow for this subtask...**
```

### Apply /start-task Workflow

**For EACH subtask, run complete `/start-task` workflow:**

1. **Load standards** (already loaded from stack-config)
2. **Show Standards Check**:

```
📋 **STANDARDS CHECK FOR SUBTASK [X.Y]**

**Stack:** [Framework] + [Language] + [Styling]

**Subtask:** [X.Y] [Title]

**Approach:**
[How this will be implemented]

**Standards Loaded:**
[If project-guidelines.md exists:]
✓ project-guidelines.md - [Project requirements]
  - Quality: [Speed First / Balanced / Quality First]
  - Testing: [Coverage requirement]
  - Accessibility: [WCAG level]
  - Performance: [Targets]

✓ [framework]-standards.md - [Key patterns]
✓ [language]-standards.md - [Key rules]
✓ [styling]-standards.md - [Styling approach]
✓ file-structure.md - [Organization]
✓ testing-standards.md - [If tests involved]

**Files to create/modify:**
- [file 1] - [Purpose]
- [file 2] - [Purpose]

**Framework patterns:**
- [Pattern 1 specific to their framework]
- [Pattern 2 specific to their framework]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Should I proceed with this subtask? (yes/no)
```

**⏸️ WAIT FOR APPROVAL**

3. **Execute subtask** (following their framework patterns)
4. **Verify changes**:

```
🔍 **VERIFYING SUBTASK [X.Y]**

Running checks:
- Format: [formatter command]
- Lint: [linter command]
- Type check: [if TypeScript]
- Build: [build command]
- Tests: [test command if tests exist]

[If project-guidelines.md exists and quality approach is "Quality First":]
- Accessibility: [WCAG validator if UI work]
- Performance: [Lighthouse if UI work]
- Test Coverage: [Coverage tool]

Results:
✓ Format: Pass
✓ Lint: Pass
✓ Type check: Pass
✓ Build: Pass
✓ Tests: Pass
[If project guidelines requirements checked:]
✓ Accessibility: [WCAG level] compliant
✓ Performance: Meets [targets]
✓ Coverage: [%] (minimum: [% from project guidelines])

All checks passed!
```

5. **Mark subtask complete**:

```
✅ **SUBTASK [X.Y] COMPLETE**

[x] [X.Y] [Title]

**Created:**
- [file 1]
- [file 2]

**Verified:** All checks passed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Progress:**
Parent Task [X.0]: [completed]/[total] subtasks done
Overall: [completed]/[total] subtasks done

Next subtask: [X.Y+1] [Title]

Ready to continue? (yes/no/pause)
```

**⏸️ WAIT FOR APPROVAL**

---

## STEP 5: After Parent Task Complete

When ALL subtasks in a parent task are done:

```
🎉 **PARENT TASK [X.0] COMPLETE**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [X.0] [Parent task name]
  ✓ [X.1] [Subtask]
  ✓ [X.2] [Subtask]
  ✓ [X.3] [Subtask]
  ✓ [X.4] [Subtask]

**Running full test suite...**

[Run complete test suite]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Test Results:**
✓ Unit tests: [X] passed
✓ Integration tests: [Y] passed
✓ Total: [X+Y] tests passed

All tests passing!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Ready to commit parent task [X.0]**

**Files to commit:**
- [file 1]
- [file 2]
- [file 3]
- [test file 1]
- [test file 2]

**Suggested commit message:**

[type]([scope]): [parent task description]

[Details about what was implemented]
[Reference to PRD if helpful]

Example for their stack:
feat(theme): add dark mode toggle component

Implement ThemeToggle [framework] component with:
- Theme state management
- localStorage persistence
- Accessibility support
- [Test framework] tests

Closes #[PRD number]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to commit? (yes/no/edit)
```

**⏸️ WAIT FOR APPROVAL**

### If approved:

```bash
git add .
git commit -m "[commit message]"
```

```
✅ **COMMITTED**

Commit: [hash]
Parent task [X.0]: Complete and committed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Progress:**
Completed parent tasks: [count]/[total]
Remaining parent tasks: [count]

Next parent task: [X+1.0] [Title]

Ready to continue? (yes/no/pause)
```

**⏸️ WAIT FOR APPROVAL**

---

## STEP 6: Feature Complete

When ALL parent tasks are done:

```
🎊 **FEATURE COMPLETE!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feature:** [Feature name from PRD]
**Stack:** [Framework] + [Language] + [Styling]

**Completed:**
✅ [1.0] [Parent task]
✅ [2.0] [Parent task]
✅ [3.0] [Parent task]
✅ [4.0] [Parent task]
✅ [5.0] [Parent task]
✅ [6.0] [Parent task]

**Statistics:**
- Total subtasks: [count]
- Total files created: [count]
- Total commits: [parent task count]
- Tests written: [count]
- All tests passing: ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What Was Built:**

[Summary of feature based on PRD]

**Files Created:**
[List all created files organized by type]

**Stack Patterns Used:**
- [Framework pattern 1]
- [Framework pattern 2]
- [Language best practice 1]
- [Styling approach]
- [Testing strategy]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**

1. **Test the feature**
   - Try it in the browser/app
   - Test all user flows
   - Verify on different devices

2. **Verify quality**
   - Run: `/verify`
   - Check standards compliance
   - Fix any issues found

3. **Learn what you built**
   - Run: `/learn`
   - Understand the implementation
   - Ask questions about patterns

4. **Deploy (optional)**
   - Follow deployment standards
   - Test in staging
   - Deploy to production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The feature is complete! 🎉

What would you like to do next?
```

---

## Pause & Resume

### Pausing

At any approval point:

```
You: pause

⏸️  **PAUSED**

Saving progress...

**Current Status:**
- Task list: tasks-0003-prd-dark-mode.md
- Last completed: [X.Y] [Title]
- Next up: [X.Y+1] [Title]
- Parent tasks complete: [count]/[total]

Progress saved to task list file.

To resume:
1. Run: `/process-tasks`
2. Select same task list
3. Continue from where you left off

You can safely close this conversation.
```

### Resuming

```
/process-tasks tasks-0003-prd-dark-mode.md

🔄 **RESUMING PREVIOUS WORK**

Task List: tasks-0003-prd-dark-mode.md

**Progress So Far:**
✅ Completed: [X] subtasks
⏳ Remaining: [Y] subtasks

**Last Completed:**
[X.Y] [Last completed subtask]

**Next Up:**
[X.Z] [Next incomplete subtask]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to continue from [X.Z]? (yes/no)
```

---

## Error Handling

### If Subtask Fails Verification

```
❌ **VERIFICATION FAILED**

Subtask [X.Y] checks failed:

[Error details]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Analysis:**
[What went wrong]

**Fix:**
[What needs to change]

Fixing the issue...

[Apply fix]

Re-running all checks...

✓ All checks now passing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Subtask [X.Y] now complete

Continue? (yes/no)
```

### If Tests Fail

```
❌ **TESTS FAILED**

After completing subtask [X.Y], tests are failing:

[Test output]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Failed Tests:**
- [test 1] - [reason]
- [test 2] - [reason]

**Analysis:**
[What's wrong]

**Fix:**
[Corrective action]

Fixing tests...

[Apply fixes]

Re-running test suite...

✓ All tests now passing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Tests fixed, subtask complete

Continue? (yes/no)
```

---

## Enforcement

**CRITICAL RULES (VIOLATION = UNACCEPTABLE):**

1. **ONE subtask at a time**
   - Complete subtask
   - Verify it works
   - Mark it [x]
   - STOP and wait for approval
   - Never continue without "yes"

2. **Standards on every subtask**
   - Execute /start-task workflow for each
   - Show standards check
   - Wait for approval
   - Follow framework patterns exactly

3. **Verify before marking complete**
   - Run all checks (format, lint, type-check, build, test)
   - Fix any failures
   - Only mark [x] when all checks pass

4. **Commit after each parent task**
   - When all subtasks in parent are [x]
   - Run full test suite
   - If tests pass: stage, clean, commit
   - Mark parent task [x]
   - Continue to next parent task

5. **Never skip verification**
   - Every subtask: verify checks pass
   - Every parent task: verify full test suite passes
   - No shortcuts

**If user says "Standards?":**
- Stop immediately
- Execute `/standards` command
- Restart current subtask from beginning
- Show complete standards check

---

## Stack-Adaptive Examples

### React Project

**Subtask execution:**
```
[2.1] Build ThemeToggle component

Standards Check:
✓ React functional component
✓ Named export
✓ TypeScript interface for props
✓ useState for state
✓ Tailwind for styling

Creates: src/components/theme/ThemeToggle.tsx
Pattern: Standard React component per react-standards.md

[Shows implementation]
[Verifies: format, lint, type-check, build]
✓ Complete
```

---

### Vue Project

**Subtask execution:**
```
[2.1] Build ThemeToggle component

Standards Check:
✓ Vue SFC with script setup
✓ Composition API
✓ TypeScript with defineProps
✓ ref() for state
✓ CSS Modules for styling

Creates: src/components/theme/ThemeToggle.vue
Pattern: Standard Vue SFC per vue-standards.md

[Shows implementation]
[Verifies: format, lint, type-check, build]
✓ Complete
```

---

### Svelte Project

**Subtask execution:**
```
[2.1] Build ThemeToggle component

Standards Check:
✓ Svelte component structure
✓ TypeScript in script tag
✓ export let for props
✓ Reactive declarations
✓ Tailwind for styling

Creates: src/lib/components/theme/ThemeToggle.svelte
Pattern: Standard Svelte component per svelte-standards.md

[Shows implementation]
[Verifies: format, lint, type-check, build]
✓ Complete
```

---

## Tips for Success

### DO:
✅ Review standards check for each subtask
✅ Let verification run completely
✅ Fix failures immediately
✅ Pause when needed
✅ Read what was built

### DON'T:
❌ Skip approval checkpoints
❌ Continue with failed checks
❌ Rush through subtasks
❌ Ignore test failures
❌ Commit broken code

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

**This is the complete workflow. Follow it exactly.**

---

**This command adapts to YOUR stack, building each subtask with YOUR framework's patterns, YOUR language's conventions, and YOUR styling approach. Patient, methodical, and always producing quality code.**