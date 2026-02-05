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

## STEP 3: The 12 Questions

Ask these questions one at a time or in logical groups. Wait for answers before proceeding.

### Question 1: Problem & Goal
What problem does this solve? What's the main goal?

### Question 2: Main Goal Type
What type of goal? Options: A) Visual/UI, B) Functional, C) Content, D) Integration, E) Fix/Improve, F) Interactive, G) Responsive, H) Performance, I) Accessibility

### Question 3: Primary User
Who will use this? Options: A) Potential Employers, B) Clients, C) Developers, D) General Visitors, E) Specific Persona (describe)

### Question 4: Key Actions
What actions will users take? List main interactions.

### Question 5: User Stories
Write 2-3 stories: "As a [user], I want [action], so that [benefit]"

### Question 6: Success Criteria
What must be true when it's done? Measurable outcomes.

### Question 7: Non-Goals
What is explicitly OUT of scope?

### Question 8: Design Preferences
Any design preferences or requirements?

### Question 9: Technical Requirements
Show user their stack from config. If project-guidelines.md exists, show already-included requirements (accessibility, performance, testing, integrations). Ask for ADDITIONAL technical needs from: form validation, API integration, database/storage, state management, authentication, real-time updates, file uploads, animations, accessibility, SEO, performance, browser compatibility, other.

### Question 10: Feature Location
Where will this feature live? (page, component, section, modal, etc.)

### Question 11: Open Questions
Any uncertainties or decisions needed?

### Question 12: Additional Details
Anything else to consider?

---

## STEP 4: Generate PRD

Generate a markdown PRD file with these sections (populated from question answers and stack config):

1. **Header** - PRD number, date, stack, status (Draft)
2. **Overview** - Problem (Q1), Goal (Q1), Goal Type (Q2), Primary User (Q3)
3. **User Stories** - From Q5
4. **Key Actions** - From Q4 as checklist
5. **Success Criteria** - From Q6, all must be met
6. **Non-Goals** - From Q7
7. **Technical Stack** - From stack-config.yaml + project-guidelines.md if exists (quality approach, accessibility, performance, testing, integrations) + additional tech from Q9
8. **Design Considerations** - From Q8 + design principles (existing patterns, consistency, responsive, accessible)
9. **Feature Location** - From Q10 + file structure based on architecture standards
10. **Open Questions & Decisions** - From Q11 + recommendations based on stack
11. **Implementation Notes** - Architecture suggestion, estimated components, files to create, testing strategy
12. **Additional Context** - From Q12
13. **Standards to Follow** - Active standards from stack-config.yaml + key patterns
14. **Next Steps** - Review PRD, run `/generate-tasks`, review tasks, run `/process-tasks`
15. **Revision History** - v1.0 with date

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