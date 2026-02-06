# /add-feature - Create Product Requirements Document

Use for features needing planning (multiple components, complex interactions, design decisions). For simple/single tasks, use `/start-task` instead.

---

## STEP 1: Load Stack Context

Read `.claude/your-stack/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework, language, styling, testing framework, key technologies.

If `.claude/your-stack/init/project-guidelines.md` exists, read it for quality/testing/accessibility requirements. These will be incorporated into PRD generation.

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
9. **Next Steps** - Run `/generate-tasks` to break into subtasks

---

## STEP 5: Save PRD

Save to `.claude/tasks/NNNN-prd-[feature-slug].md`. Auto-increment NNNN by checking existing PRD files. Feature slug is kebab-case from feature name.

---

## STEP 6: Review & Confirm

Show the user a summary: file path, feature name, goal type, primary user, estimated component/file counts.

Offer options:
1. Proceed - run `/generate-tasks` to create task breakdown
2. Need changes - edit the file manually or re-answer questions
3. Start over - run `/add-feature` again

---

## After Creating PRD

**Next steps:** Review PRD -> `/generate-tasks` -> Review task breakdown -> `/process-tasks` -> `/verify` -> `/learn`