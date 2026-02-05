# /generate-tasks - Convert PRD to Task List

Use after `/add-feature` to break down complex features into manageable steps.

---

## STEP 1: Load Stack Configuration

Read `.claude/your-stack/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework/version, language, styling, testing framework, file organization patterns, active standards.

If `.claude/your-stack/init/project-guidelines.md` exists, read it for quality/testing/accessibility requirements. These affect testing task scope, accessibility subtasks, performance optimization subtasks, and verification rigor.

---

## STEP 2: Select PRD

Search `.claude/tasks/` for PRD files. Show available PRDs with creation dates. Ask user which to use, or accept a filename argument directly.

---

## STEP 3: Read & Analyze PRD

Read the selected PRD file. Extract: feature goal/type, user stories, success criteria, technical requirements, stack info, feature location. Assess complexity (scope, estimated components/files, technical challenges).

---

## STEP 4: Check Current Codebase

Use `Read` or `Grep` to find: similar existing components, current architecture patterns, reusable utilities, testing patterns. Note anything that can be referenced or reused.

---

## STEP 5: Generate Parent Tasks

Create high-level parent tasks based on PRD requirements, framework patterns, codebase structure, and standards. Typical structure:

- 1.0 Set up feature structure (directories, base files)
- 2.0 Create core components
- 3.0 Implement logic/functionality (interactivity, state management)
- 4.0 Add styling
- 5.0 Write tests (if project-guidelines.md exists, include coverage/accessibility targets)
- 6.0 Integration & polish

For each parent task, show: purpose and dependencies.

Show the breakdown and ask: "Go" to generate subtasks, "adjust [number]" to modify, "add task" to add, "cancel" to start over.

**WAIT FOR USER APPROVAL**

---

## STEP 6: Generate Detailed Subtasks

Once user says "Go", break down each parent task into actionable subtasks using patterns from framework-standards.md, file-structure.md, component-patterns.md, and testing-standards.md.

### Task List Format

Generate a markdown task list with:
- Header: feature name, PRD filename, stack, date
- Checkbox list of all parent tasks and subtasks (e.g., `- [ ] 1.0`, `- [ ] 1.1`)
- Subtask details for each: what it creates, purpose, applicable standards, framework-specific patterns

---

## STEP 7: Identify Relevant Files

List all files to be created or modified, organized by type: components, tests, utilities, pages/routes, styles, types. Include file paths based on file-structure.md standards (organization pattern, test colocation, barrel exports, import paths).

---

## STEP 8: Add Implementation Notes

Include in the task list file:

**Standards references:** List all applicable standards from `.claude/your-stack/` with key patterns for each (framework, language, styling, testing, architecture, documentation). If project-guidelines.md exists, include project requirements (quality approach, coverage, accessibility, performance, integrations).

**Framework-specific notes:** Add notes specific to the detected framework (component patterns, props typing, state management, test utilities). Adapt based on stack-config.yaml.

**Task execution instructions:** Use `/process-tasks`, one subtask at a time, review/approve after each, tests and commit after each parent task.

---

## STEP 9: Show Complete Task List

Display the complete task list for review. Ask user: "yes" to save, "revise [task number]" to adjust, "cancel" to start over.

**WAIT FOR USER RESPONSE**

---

## STEP 10: Save Task List

Save to `.claude/tasks/tasks-NNNN-prd-[feature-slug].md` (matching the PRD filename pattern). Confirm file location to user.

---

## STEP 11: Next Steps

Show summary: file location, stack, parent task count, subtask count, estimated file count.

Suggest next steps:
1. Review the task list file
2. Run `/process-tasks` to start implementation
3. Or edit task list manually if adjustments needed