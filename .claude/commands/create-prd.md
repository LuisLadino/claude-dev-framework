# /create-prd - Create Product Requirements Document

**Plan complex features with a structured PRD, adapted to your tech stack.**

Use this command when a feature needs thoughtful planning before implementation.

---

## When to Use This Command

**Use `/create-prd` for:**
- Features taking > 2 hours
- Multiple components/files needed
- Complex user interactions
- Features requiring design decisions
- Anything that needs planning

**Use `/start-task` instead for:**
- Single components
- Quick fixes
- Simple features
- Clear, straightforward tasks

---

## STEP 1: Load Stack Context

**Before asking questions, understand the tech stack:**

Use `project_knowledge_search`:
```
Query: "stack-config.yaml configuration"
```

**Extract:**
- Framework/library name
- Language
- Styling solution
- Testing framework
- Key technologies

**This informs technical questions later**

---

## STEP 2: Initial Description

```
📋 **CREATE PRODUCT REQUIREMENTS DOCUMENT**

Let's plan this feature properly before building.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What feature do you want to build?**

Describe it in your own words:
```

**User provides initial description**

---

## STEP 3: The 12 Questions

### Question 1: Problem & Goal

```
❓ **QUESTION 1 of 12: Problem & Goal**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What problem does this solve?**
**What's the main goal?**

Example answers:
- "Users can't filter projects by category - goal is to add filtering"
- "No way to contact me - goal is contact form"
- "Portfolio looks too simple - goal is to add visual interest"

Your answer:
```

---

### Question 2: Main Goal Type

```
❓ **QUESTION 2 of 12: Main Goal Type**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What type of goal is this?**

Pick the option that best matches:

A) 🎨 **Visual/UI** - Improve how something looks

B) ⚙️ **Functional** - Add capability or feature

C) 📊 **Content** - Display or manage content

D) 🔗 **Integration** - Connect to external service

E) 🐛 **Fix/Improve** - Fix issue or improve existing

F) 🎭 **Interactive** - Add user interaction

G) 📱 **Responsive** - Mobile/device adaptation

H) ⚡ **Performance** - Speed or optimization

I) ♿ **Accessibility** - Improve accessibility

Type the letter (A-I):
```

---

### Question 3: Primary User

```
❓ **QUESTION 3 of 12: Primary User**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Who will use this feature?**

Pick the primary user:

A) 👔 **Potential Employers** - Recruiters, hiring managers

B) 💼 **Clients** - People who might hire you

C) 👨‍💻 **Developers** - Technical peers

D) 📱 **General Visitors** - Anyone browsing

E) 🎯 **Specific Persona** - [describe who]

Type the letter (A-E) or describe:
```

---

### Question 4: Key Actions

```
❓ **QUESTION 4 of 12: Key Actions**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What actions will users take?**

List the main things users will DO:

Examples:
- "Click filter buttons to show/hide projects"
- "Fill out contact form and submit"
- "Click project cards to see details"

Your list (one per line):
```

---

### Question 5: User Stories

```
❓ **QUESTION 5 of 12: User Stories**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**User Stories**

Write 2-3 stories in this format:
"As a [user], I want [action], so that [benefit]"

Examples:
- "As a recruiter, I want to filter projects by technology, so that I can quickly find relevant work"
- "As a visitor, I want to contact the developer, so that I can discuss a project"

Your stories:
1.
2.
3.
```

---

### Question 6: Success Criteria

```
❓ **QUESTION 6 of 12: Success Criteria**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How will we know this is successful?**

What must be true when it's done?

Examples:
- "Users can filter by at least 3 categories"
- "Form submission sends email"
- "Page loads in under 2 seconds"
- "Works on mobile devices"

Your criteria:
```

---

### Question 7: Non-Goals

```
❓ **QUESTION 7 of 12: Non-Goals**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What is explicitly OUT of scope?**

What are we NOT doing (at least not now)?

Examples:
- "Not adding user authentication"
- "Not including search functionality"
- "Not adding animations (keep it simple)"

Your non-goals:
```

---

### Question 8: Design Preferences

```
❓ **QUESTION 8 of 12: Design Preferences**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Any design preferences or requirements?**

Examples:
- "Match existing design system"
- "Use primary color for CTA button"
- "Minimalist, clean design"
- "No preference, use best practices"

Your preferences:
```

---

### Question 9: Technical Requirements

```
❓ **QUESTION 9 of 12: Technical Requirements**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Technical Requirements**

**Your Stack:** [Framework] + [Language] + [Styling]

Any specific technical needs? Select all that apply from the list below:

**Options:**
- Form validation
- API integration
- Database/storage
- State management
- Authentication
- Real-time updates
- File uploads
- Animations
- Accessibility (WCAG AA)
- SEO optimization
- Performance requirements
- Browser compatibility
- Other: [specify]

**List your selections (comma-separated or one per line):**
```

---

### Question 10: Feature Location

```
❓ **QUESTION 10 of 12: Feature Location**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Where will this feature live?**

Examples:
- "New page at /contact"
- "Component on home page"
- "Section on about page"
- "Modal/dialog triggered by button"
- "Navigation menu"

Your answer:
```

---

### Question 11: Open Questions

```
❓ **QUESTION 11 of 12: Open Questions**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Any uncertainties or decisions needed?**

What are you unsure about?

Examples:
- "Should filters be checkboxes or buttons?"
- "Where should form errors display?"
- "How many items per page?"
- "None - everything is clear"

Your questions/concerns:
```

---

### Question 12: Additional Details

```
❓ **QUESTION 12 of 12: Additional Details**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Anything else to consider?**

Examples:
- "Inspired by [website]"
- "Must work offline"
- "Needs to be fast"
- "No budget for external services"
- "Timeline: need it in 2 weeks"

Your additional context:
```

---

## STEP 4: Generate PRD

```
📝 **GENERATING PRD**

Creating comprehensive document...
```

### PRD Structure

```markdown
# PRD: [Feature Name]

**Created:** [Date]
**Stack:** [Framework + Language + Styling + Testing]
**Status:** Draft
**PRD Number:** NNNN

---

## Overview

**Problem:** [From Q1]

**Goal:** [From Q1]

**Goal Type:** [From Q2]

**Primary User:** [From Q3]

---

## User Stories

[From Q5 - all stories]

---

## Key Actions

User will be able to:

[From Q4 - all actions as checklist]

---

## Success Criteria

✓ [Criterion 1 from Q6]
✓ [Criterion 2 from Q6]
✓ [Criterion 3 from Q6]

Feature is successful when ALL criteria are met.

---

## Non-Goals

Explicitly out of scope:

- [Non-goal 1 from Q7]
- [Non-goal 2 from Q7]

These may be considered in future iterations.

---

## Technical Stack

**Framework:** [Framework + version]
**Language:** [Language]
**Styling:** [Styling solution]
**Testing:** [Test framework]

**Additional Tech:**
[From Q9 - list all selected requirements]

---

## Design Considerations

[From Q8 - design preferences]

**Design Principles:**
- Follow existing [styling solution] patterns
- Maintain consistency with current design
- Use semantic [framework] components
- Ensure responsive design
- Meet accessibility standards

---

## Feature Location

[From Q10 - where feature lives]

**File Structure:**
[Based on their framework and architecture standards]

---

## Open Questions & Decisions

[From Q11 - list questions]

**Recommendations:**
[Suggest solutions to open questions based on their stack]

---

## Implementation Notes

**Architecture:**
[Based on their framework - suggest component structure]

**Components Needed:** (estimate)
- [Component 1]
- [Component 2]
- [Component 3]

**Files to Create:** (estimate)
- [file paths based on their architecture]

**Testing Strategy:**
[Based on their test framework]

---

## Additional Context

[From Q12 - additional details]

---

## Standards to Follow

**Active Standards:**
[List from their stack-config.yaml]

**Key Patterns:**
- [Framework pattern from their standards]
- [Language pattern from their standards]
- [Styling pattern from their standards]

---

## Next Steps

1. Review this PRD
2. Make any needed adjustments
3. Run `/generate-tasks` to create task list
4. Review task breakdown
5. Run `/process-tasks` to implement

---

## Revision History

- v1.0 ([Date]) - Initial PRD created

---

**END OF PRD**
```

---

## STEP 5: Save PRD

```
💾 **SAVING PRD**

Generating filename...

Pattern: NNNN-prd-[feature-slug].md

Examples:
- 0001-prd-project-filtering.md
- 0002-prd-contact-form.md
- 0003-prd-dark-mode.md

Checking for existing PRDs...
[Count existing: 0000, 0001, 0002, etc.]

Next number: [NNNN]
Feature slug: [kebab-case from feature name]

Filename: .claude/tasks/[NNNN]-prd-[feature-slug].md

Saving...
```

---

## STEP 6: Review & Confirm

```
✅ **PRD CREATED SUCCESSFULLY**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**File:** .claude/tasks/[NNNN]-prd-[feature-slug].md

**Summary:**
- Feature: [Name]
- Type: [Goal type]
- User: [Primary user]
- Components: ~[count] estimated
- Files: ~[count] estimated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PRD includes:**
✓ Clear problem statement
✓ User stories
✓ Success criteria
✓ Technical stack details
✓ [Framework]-specific patterns
✓ Open questions addressed
✓ Implementation guidance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Review Options:**

1. **Look good? Proceed:**
   → Run `/generate-tasks` to create task breakdown

2. **Need changes?**
   → Edit .claude/tasks/[filename].md manually
   → Or answer questions again with different responses

3. **Want to start over?**
   → Run `/create-prd` again
   → Will create new numbered PRD

What would you like to do?
```

---

## Stack-Adaptive Features

### React PRD Example

**Technical Stack section includes:**
```markdown
**Framework:** React 18.2 (functional components)
**Language:** TypeScript (strict mode)
**Styling:** Tailwind CSS + daisyUI
**Testing:** Vitest + React Testing Library

**Additional Tech:**
- React Hook Form (form validation)
- Zod (schema validation)
```

**Architecture suggests:**
```markdown
**Components Needed:**
- FilterButton.tsx (button component)
- ProjectGrid.tsx (grid layout)
- ProjectCard.tsx (individual cards)

**File Structure:**
src/components/projects/
├── FilterButton.tsx
├── FilterButton.test.tsx
├── ProjectGrid.tsx
├── ProjectGrid.test.tsx
└── index.ts
```

---

### Vue PRD Example

**Technical Stack section includes:**
```markdown
**Framework:** Vue 3.3 (Composition API)
**Language:** TypeScript
**Styling:** CSS Modules
**Testing:** Vitest + Vue Test Utils

**Additional Tech:**
- Vuelidate (form validation)
- Pinia (state management)
```

**Architecture suggests:**
```markdown
**Components Needed:**
- FilterButton.vue (button component)
- ProjectGrid.vue (grid layout)
- ProjectCard.vue (individual cards)

**File Structure:**
src/components/projects/
├── FilterButton.vue
├── FilterButton.test.ts
├── ProjectGrid.vue
├── ProjectGrid.test.ts
└── index.ts
```

---

### SvelteKit PRD Example

**Technical Stack section includes:**
```markdown
**Framework:** SvelteKit 2.0
**Language:** TypeScript
**Styling:** Tailwind CSS
**Testing:** Vitest + Svelte Testing Library

**Additional Tech:**
- Zod (validation)
- Form actions (server-side)
```

**Architecture suggests:**
```markdown
**Components Needed:**
- FilterButton.svelte
- ProjectGrid.svelte
- ProjectCard.svelte

**File Structure:**
src/lib/components/projects/
├── FilterButton.svelte
├── FilterButton.test.ts
├── ProjectGrid.svelte
└── ProjectGrid.test.ts

src/routes/projects/
├── +page.svelte
└── +page.server.ts
```

---

## Tips for Better PRDs

### DO:
✅ Be specific about success criteria
✅ Think through user actions
✅ List non-goals explicitly
✅ Identify open questions
✅ Consider technical requirements

### DON'T:
❌ Be vague ("make it nice")
❌ Skip success criteria
❌ Forget about testing
❌ Ignore edge cases
❌ Rush through questions

---

## After Creating PRD

**Next steps workflow:**

```
1. Review PRD
   .claude/tasks/NNNN-prd-[feature].md

2. Generate tasks
   /generate-tasks

3. Review task breakdown
   [Approve or adjust]

4. Implement feature
   /process-tasks

5. Verify quality
   /verify

6. Learn what you built
   /learn
```

---

**This command adapts to YOUR stack, suggesting architecture and patterns that match YOUR framework, language, and styling solution.**