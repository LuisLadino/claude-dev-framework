# /generate-tasks - Convert PRD to Task List

**Transform a PRD into actionable subtasks, adapted to your tech stack.**

Use after `/create-prd` to break down complex features into manageable steps.

---

## STEP 1: Load Stack Configuration

**First, understand the tech stack:**

Use `project_knowledge_search`:
```
Query: "stack-config.yaml configuration"
```

**Extract:**
- Framework and version
- Language
- Styling solution
- Testing framework
- File organization patterns
- Active standards

**This ensures tasks match your stack's patterns**

---

## STEP 2: Select PRD

```
📋 **GENERATE TASKS FROM PRD**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking for PRD files in .claude/tasks/...

Found PRDs:
1. 0001-prd-project-filtering.md (created 2 days ago)
2. 0002-prd-contact-form.md (created 1 day ago)
3. 0003-prd-dark-mode.md (created 3 hours ago)

Which PRD should I use? (number or filename)
```

**Or specify directly:**
```
/generate-tasks 0003-prd-dark-mode.md
```

---

## STEP 3: Read & Analyze PRD

```
📖 **READING PRD**

File: .claude/tasks/0003-prd-dark-mode.md

Extracting:
✓ Feature goal and type
✓ User stories
✓ Success criteria
✓ Technical requirements
✓ Stack information
✓ Feature location

Analyzing complexity...

**Complexity Assessment:**
- Scope: [Small / Medium / Large]
- Estimated components: [count]
- Estimated files: [count]
- Technical challenges: [list]
```

---

## STEP 4: Check Current Codebase

Use `project_knowledge_search` to understand existing code:

```
Query: "[feature area] existing components"
Query: "similar implementations"
Query: "architecture patterns [framework]"
```

```
🔍 **ANALYZING CODEBASE**

Stack detected: [Framework] + [Language] + [Styling]

Checking for:
✓ Similar existing components
✓ Current architecture patterns
✓ Reusable utilities
✓ Testing patterns

Found:
- [Similar component 1] - can be referenced
- [Similar pattern] - can be followed
- [Existing utility] - can be reused

Architecture style: [Based on file-structure.md]
```

---

## STEP 5: Generate Parent Tasks

```
🎯 **GENERATING PARENT TASKS**

Creating high-level task breakdown...

Based on:
- PRD requirements
- Your [framework] patterns
- Existing codebase structure
- Standards from stack-config.yaml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PARENT TASKS (High Level):**

- [ ] 1.0 Set up feature structure
  - Purpose: Create directories, base files
  - Est. time: 30 min
  - Dependencies: None

- [ ] 2.0 Create core components
  - Purpose: Build main [framework] components
  - Est. time: 2 hours
  - Dependencies: 1.0

- [ ] 3.0 Implement logic/functionality
  - Purpose: Add interactivity, state management
  - Est. time: 1.5 hours
  - Dependencies: 2.0

- [ ] 4.0 Add styling
  - Purpose: Style with [styling solution]
  - Est. time: 1 hour
  - Dependencies: 2.0

- [ ] 5.0 Write tests
  - Purpose: Test with [test framework]
  - Est. time: 1.5 hours
  - Dependencies: 2.0, 3.0

- [ ] 6.0 Integration & polish
  - Purpose: Integrate into app, final touches
  - Est. time: 1 hour
  - Dependencies: 2.0, 3.0, 4.0, 5.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Total Estimated Time:** [sum] hours

**Does this breakdown look right?**

Options:
- Type "Go" - Generate detailed subtasks
- Type "adjust [number]" - Modify a parent task
- Type "add task" - Add a parent task
- Type "cancel" - Start over

What would you like to do?
```

**⏸️ WAIT FOR USER APPROVAL**

---

## STEP 6: Generate Detailed Subtasks

Once user says "Go":

```
✏️  **GENERATING DETAILED SUBTASKS**

Breaking down each parent task into actionable steps...

Using patterns from:
- [framework]-standards.md
- file-structure.md  
- component-patterns.md
- testing-standards.md
```

### Task Breakdown Format

```markdown
## TASK LIST: [Feature Name]

**PRD:** [PRD filename]
**Stack:** [Framework] + [Language] + [Styling] + [Testing]
**Generated:** [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TASKS:**

- [ ] 1.0 Set up feature structure
  - [ ] 1.1 Create [framework] component directory
  - [ ] 1.2 Create [framework] component files
  - [ ] 1.3 Create test files per [test framework]
  - [ ] 1.4 Add barrel exports (index file)

- [ ] 2.0 Create core components
  - [ ] 2.1 Build [Component1] ([framework] component)
  - [ ] 2.2 Build [Component2] ([framework] component)
  - [ ] 2.3 Build [Component3] ([framework] component)
  - [ ] 2.4 Add [language] types/interfaces

- [ ] 3.0 Implement logic/functionality
  - [ ] 3.1 Add state management ([framework] pattern)
  - [ ] 3.2 Implement event handlers
  - [ ] 3.3 Add form validation (if applicable)
  - [ ] 3.4 Handle edge cases

- [ ] 4.0 Add styling
  - [ ] 4.1 Style with [styling solution]
  - [ ] 4.2 Make responsive (breakpoints)
  - [ ] 4.3 Add transitions/animations (if needed)
  - [ ] 4.4 Ensure accessibility (ARIA, focus)

- [ ] 5.0 Write tests
  - [ ] 5.1 Unit tests for [Component1]
  - [ ] 5.2 Unit tests for [Component2]
  - [ ] 5.3 Integration tests
  - [ ] 5.4 Accessibility tests

- [ ] 6.0 Integration & polish
  - [ ] 6.1 Integrate into [page/route]
  - [ ] 6.2 Test full user flow
  - [ ] 6.3 Add documentation
  - [ ] 6.4 Final verification

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SUBTASK DETAILS:**

**1.1 Create [framework] component directory**
- Creates: [directory path based on architecture]
- Purpose: Organize feature components
- Standards: file-structure.md
- Pattern: [framework]-specific organization

**1.2 Create [framework] component files**
- Creates:
  - [Component1].[ext] (main component)
  - [Component2].[ext] (sub-component)
- Purpose: Base files for implementation
- Standards: [framework]-standards.md
- Pattern: [One component per file, PascalCase naming]

**1.3 Create test files per [test framework]**
- Creates:
  - [Component1].test.[ext]
  - [Component2].test.[ext]
- Purpose: Test scaffolding
- Standards: testing-standards.md
- Pattern: [Collocated with components]

[Continue for each subtask with framework-specific details]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**2.1 Build [Component1]**
- Creates: [path]/[Component1].[ext]
- Purpose: [Specific purpose]
- Standards: [framework]-standards.md, [language]-standards.md
- Framework patterns:
  - [Pattern 1 for their framework]
  - [Pattern 2 for their framework]
- Example structure:
```[language]
[Framework-specific component example]
```

[Continue for all subtasks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## STEP 7: Identify Relevant Files

```
📁 **RELEVANT FILES**

Based on tasks above, these files will be created or modified:

## Components

**[Framework] Components:**
- [path]/[Component1].[ext] - [Purpose]
- [path]/[Component2].[ext] - [Purpose]
- [path]/[Component3].[ext] - [Purpose]
- [path]/index.[ext] - Barrel exports

## Tests

**[Test Framework] Tests:**
- [path]/[Component1].test.[ext] - Unit tests
- [path]/[Component2].test.[ext] - Unit tests
- [path]/integration.test.[ext] - Integration tests

## Utilities (if needed)

**[Language] Utilities:**
- [path]/[utility].[ext] - [Purpose]
- [path]/[utility].test.[ext] - Tests

## Pages/Routes (if applicable)

**[Framework] Pages:**
- [page-path].[ext] - [Purpose]

## Styles (if separate files)

**[Styling Solution]:**
- [path]/[styles].[ext] - Component styles

## Types (if separate)

**[Language] Types:**
- [path]/types.[ext] - Type definitions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**File Organization:**
Per file-structure.md standards:
- Components: [Their organization pattern]
- Tests: [Their test colocation pattern]
- Barrel exports: [Their export pattern]
- Import paths: [Their alias configuration]
```

---

## STEP 8: Add Implementation Notes

```
📝 **IMPLEMENTATION NOTES**

**Standards to Follow:**

All code must follow standards in .claude/your-stack/:

**Framework Standards:**
- [framework]-standards.md - [Key patterns]
  - [Pattern 1]
  - [Pattern 2]
  - [Pattern 3]

**Language Standards:**
- [language]-standards.md - [Key rules]
  - [Rule 1]
  - [Rule 2]

**Styling Standards:**
- [styling]-standards.md - [Key approaches]
  - [Approach 1]
  - [Approach 2]

**Testing Standards:**
- testing-standards.md - [Requirements]
  - [Requirement 1]
  - [Requirement 2]

**Architecture:**
- file-structure.md - [Organization]
- component-patterns.md - [Patterns]

**Documentation:**
- code-comments.md - [Comment style]
- component-docs.md - [Public API docs]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Framework-Specific Notes:**

[For React projects:]
- Use functional components with named exports
- Props via TypeScript interfaces
- Hooks for state and effects
- React Testing Library for tests

[For Vue projects:]
- Use Composition API with script setup
- Props via defineProps with types
- Composables for shared logic
- Vue Test Utils for tests

[For Svelte projects:]
- Use reactive declarations ($:)
- Props via export let with types
- Stores for shared state
- Svelte Testing Library for tests

[Adapt based on detected stack]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Task Execution:**

When ready to implement:
1. Use `/process-tasks` command
2. Tasks executed ONE subtask at a time
3. After each subtask: review and approve
4. After parent task complete: tests run → commit
5. Repeat for each parent task

**Estimated Complexity:** [Assessment]

Total parent tasks: [count]
Total subtasks: [count]
Estimated time: [hours] hours
```

---

## STEP 9: Show Complete Task List

```
📋 **COMPLETE TASK LIST - REVIEW BEFORE SAVING**

[Display complete task list with all sections]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 **REVIEW THE TASK LIST ABOVE**

Does this breakdown make sense?
Are subtasks clear and actionable?
Anything missing or should anything change?

Options:
- Type "yes" - Save this task list
- Type "revise [task number]" - Adjust specific task
  Example: "revise 2.3" or "add subtask to 1.0"
- Type "cancel" - Start over

What would you like to do?
```

**⏸️ WAIT FOR USER RESPONSE**

---

## STEP 10: Save Task List

```
💾 **SAVING TASK LIST**

PRD File: 0003-prd-dark-mode.md
Task List: tasks-0003-prd-dark-mode.md

Saving to: .claude/tasks/tasks-0003-prd-dark-mode.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Task list saved successfully!

File location: .claude/tasks/tasks-0003-prd-dark-mode.md
```

---

## STEP 11: Next Steps

```
✅ **TASK LIST GENERATED SUCCESSFULLY**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Task List Details:**
- File: .claude/tasks/tasks-0003-prd-dark-mode.md
- Stack: [Framework] + [Language] + [Styling]
- Parent Tasks: [count]
- Total Subtasks: [count]
- Estimated Files: [count]
- Estimated Time: [hours] hours

**What You Have:**
✓ High-level parent tasks
✓ Detailed subtasks for each parent
✓ Framework-specific implementation notes
✓ File organization plan
✓ Standards references

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**NEXT STEPS:**

1. **Review task list**
   - Read through .claude/tasks/tasks-[filename].md
   - Verify breakdown makes sense
   - Note any questions

2. **Start implementation**
   - Run: `/process-tasks`
   - Follow prompts
   - One subtask at a time

3. **Or make adjustments**
   - Edit task list manually if needed
   - Re-generate if major changes needed

Ready to start building?
→ Type `/process-tasks` to begin implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Stack-Adaptive Examples

### React Project

**Subtasks include:**
```
- [ ] 2.1 Build ThemeToggle (React functional component)
  - Typed props with interface
  - useState for theme state
  - useEffect for persistence
  - Named export
```

**File structure:**
```
src/components/theme/
├── ThemeToggle.tsx
├── ThemeToggle.test.tsx
└── index.ts
```

---

### Vue Project

**Subtasks include:**
```
- [ ] 2.1 Build ThemeToggle (Vue SFC with script setup)
  - Props via defineProps
  - ref() for theme state
  - watchEffect for persistence
  - Composition API patterns
```

**File structure:**
```
src/components/theme/
├── ThemeToggle.vue
├── ThemeToggle.test.ts
└── index.ts
```

---

### Svelte Project

**Subtasks include:**
```
- [ ] 2.1 Build ThemeToggle (Svelte component)
  - export let for props
  - let for reactive state
  - $: for reactive updates
  - Store for global theme
```

**File structure:**
```
src/lib/components/theme/
├── ThemeToggle.svelte
├── ThemeToggle.test.ts
└── index.ts
```

---

## Tips for Better Task Lists

### DO:
✅ Review parent tasks before generating subtasks
✅ Check subtask details match your stack
✅ Verify file paths match your architecture
✅ Ensure patterns follow your standards
✅ Make adjustments if something seems off

### DON'T:
❌ Skip the review step
❌ Ignore framework mismatches
❌ Accept incomplete subtasks
❌ Proceed without understanding
❌ Forget to check time estimates

---

**This command adapts to YOUR stack, creating tasks that follow YOUR framework patterns, YOUR file organization, and YOUR coding standards.**