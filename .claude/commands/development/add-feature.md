# /add-feature - Plan a Complex Feature

Use for features needing planning (multiple components, complex interactions, design decisions). Creates PRD and generates task breakdown in one flow.

For simple/single tasks, use `/start-task` instead.

---

## STEP 1: Load Stack Context

Read `.claude/specs/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework, language, styling, testing framework, key technologies.

If `.claude/specs/init/project-guidelines.md` exists, read it for quality/testing/accessibility requirements.

---

## STEP 2: Initial Description

Ask: "What feature do you want to build? Describe it in your own words."

Wait for user's initial description.

---

## STEP 3: Gather Requirements

Ask these questions (skip any the user already answered):

### 1. Goal
What should this feature do? What problem does it solve?

### 2. User Actions
What will users do with this feature? (main interactions)

### 3. Success Criteria
How will you know it's done? What must be true?

### 4. Non-Goals (optional)
Anything explicitly out of scope?

### 5. Location
Where does this live? (page, component, section, etc.)

### 6. Technical Needs (optional)
Any specific requirements? (API, database, auth, etc.)
Show stack from config. Ask only for ADDITIONAL needs beyond what's already configured.

---

## STEP 4: Generate PRD

Generate a markdown PRD file with:

1. **Header** - Feature name, date, stack, status (Draft)
2. **Goal** - What it does, problem it solves
3. **User Actions** - What users will do
4. **Success Criteria** - How to know it's done
5. **Non-Goals** - What's out of scope (if specified)
6. **Technical Stack** - From stack-config.yaml
7. **Location** - Where it lives, files to create
8. **Implementation Notes** - Suggested approach, components needed

Create `.claude/tasks/` directory if it doesn't exist. Save to `.claude/tasks/NNNN-prd-[feature-slug].md`. Auto-increment NNNN.

---

## STEP 5: Review PRD

Show summary: feature name, goal, success criteria, location.

Ask: "Proceed with task breakdown?" Options:
1. **Yes** - Continue to task generation
2. **Edit** - Let user modify PRD first

**Default: Yes**

---

## STEP 6: Check Codebase

Use `Read` or `Grep` to find: similar existing components, current architecture patterns, reusable utilities, testing patterns. Note anything that can be referenced or reused.

---

## STEP 7: Generate Parent Tasks

Create high-level parent tasks based on PRD requirements and framework patterns:

- 1.0 Set up feature structure (directories, base files)
- 2.0 Create core components
- 3.0 Implement logic/functionality
- 4.0 Add styling
- 5.0 Write tests
- 6.0 Integration & polish

Show breakdown and ask: "Go" to generate subtasks, "adjust [number]" to modify, "add task" to add.

**WAIT FOR USER APPROVAL**

---

## STEP 8: Generate Subtasks

Break down each parent task into actionable subtasks using patterns from specs files.

### Task List Format

Generate markdown with:
- Header: feature name, PRD filename, stack, date
- Checkbox list: `- [ ] 1.0`, `- [ ] 1.1`, etc.
- Subtask details: what it creates, purpose, applicable specs

---

## STEP 9: Add Implementation Notes

Include in task list:

**Specs references:** List applicable specs from `.claude/specs/` with key patterns.

**Framework-specific notes:** Component patterns, state management, test utilities based on stack-config.yaml.

**Files to create/modify:** Organized by type (components, tests, utilities, pages, styles, types).

---

## STEP 10: Save Task List

Save to `.claude/tasks/tasks-NNNN-prd-[feature-slug].md` (matching PRD filename).

Show summary: PRD location, task list location, parent task count, subtask count.

---

## STEP 11: Next Steps

Suggest:
1. Review task list file
2. Run `/process-tasks` to start implementation
3. Or edit task list if adjustments needed
