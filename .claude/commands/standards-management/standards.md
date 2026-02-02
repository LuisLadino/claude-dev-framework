# /standards - Standards Enforcement

**You skipped required workflow steps.**

This command stops all work and forces proper standards compliance, regardless of your tech stack.

---

## What You Must Do Now

### 1. Stop All Work Immediately

Do not write any more code. Do not create any files. Do not proceed with the task.

### 2. Load Stack Configuration

Use `project_knowledge_search` to find stack-config.yaml:
```
Query: "stack-config.yaml configuration"
```

**Extract:**
- Framework/library name
- Language  
- Active standards files
- Project-specific settings

**You need this to know which standards apply.**

---

### 3. Read Core Instructions and Acknowledge Violations

**Read .claude/CLAUDE.md RIGHT NOW and answer:**

**Required Reading Section:**
- What files MUST you read before coding?
- Did you read them? (Yes/No)
- If No, which ones did you skip?

**MANDATORY Workflow Section:**
- What checklist must you show?
- Did you show it? (Yes/No)
- Did you wait for user approval? (Yes/No)

**Prime Directive Section:**
- What must you focus on? (root cause vs symptoms)
- Did you focus on root cause? (Yes/No)

**Enforcement Section:**
- What happens when you violate standards?
- What does "VIOLATION = UNACCEPTABLE" mean?
- What must you do now?

---

### 4. Identify What You Violated

Check each requirement:

**Did you skip:**
- [ ] Reading CLAUDE.md completely?
- [ ] Loading stack-config.yaml?
- [ ] Using project_knowledge_search for standards?
- [ ] Reading required standards files for your stack?
- [ ] Showing the Standards Check to user?
- [ ] Waiting for user approval before proceeding?
- [ ] Following the specified workflow?
- [ ] Running verification checks before saying "done"?
- [ ] Running the Quality Checklist?

**Did you do (framework-agnostic anti-patterns):**
- [ ] Write code without showing it first?
- [ ] Skip testing?
- [ ] Use patterns not in your standards?
- [ ] Create files without checking organization standards?
- [ ] Hard-code values that should be configurable?
- [ ] Skip documentation?
- [ ] Ignore linting/formatting?
- [ ] Use anti-patterns listed in your standards?
- [ ] Mix standards from wrong framework/scope?
- [ ] Assume patterns without verifying?

**Language-specific violations (if applicable):**

**TypeScript:**
- [ ] Use `any` type?
- [ ] Skip explicit types?
- [ ] Ignore type errors?

**JavaScript:**
- [ ] Ignore linting errors?
- [ ] Use var instead of let/const?
- [ ] Skip error handling?

---

### 5. Explain What You Should Have Done

Write out:

```
I violated: [specific requirement]

From: [file name - CLAUDE.md, stack-config.yaml, or specific standards file]

What I did: [what you actually did wrong]

What I should have done: [correct approach following standards]

Why it matters: [impact of the violation on code quality, maintainability, or user experience]
```

**Example for React project:**
```
I violated: Showing Standards Check before coding

From: CLAUDE.md - MANDATORY Workflow section

What I did: Started writing component code immediately

What I should have done: 
1. Load stack-config.yaml
2. Use project_knowledge_search for React standards
3. Show complete Standards Check with all files I read
4. Wait for user approval with "yes"
5. Then proceed with implementation

Why it matters: User needs to verify I'm following the right patterns for their React project. Skipping this could result in code that doesn't match their conventions.
```

---

### 6. Execute Correct Workflow

Now run `/start-task` correctly and follow EVERY step:

```
STEP 1: Load Stack Configuration
→ Use project_knowledge_search
→ Read stack-config.yaml
→ Extract framework, language, standards files

STEP 2: Understand the Task
→ Ask clarifying questions
→ Confirm requirements
→ Verify scope

STEP 3: Determine Scope & Read Standards
→ Use project_knowledge_search for each standard
→ Read framework-specific standards
→ Read language standards
→ Read architecture standards
→ Read testing standards
→ Read any company standards

STEP 4: Show Complete Standards Check
→ Display all files read
→ Show key patterns being applied
→ List files to create/modify
→ Show approach
→ ⏸️ WAIT FOR USER APPROVAL

STEP 5: Execute Task Following Standards
→ Implement according to loaded standards
→ Reference standards explicitly in code/comments
→ Follow patterns exactly

STEP 6: Verification Phase
→ Run format check
→ Run linter
→ Run type checker (if applicable)
→ Run build
→ Run tests
→ Fix any failures
→ Re-run until all pass

STEP 7: Commit Changes
→ Stage files
→ Generate commit message
→ ⏸️ WAIT FOR APPROVAL
→ Execute commit

STEP 8: Completion Report
→ Summarize what was built
→ List standards followed
→ Show verification results
→ Confirm commit
```

**Do not skip ANY step this time.**

---

## Common Violations by Framework

### React Projects

**Common mistakes:**
- Using class components instead of functional
- Default exports instead of named exports
- Inline arrow functions in props
- Missing prop type interfaces
- Not destructuring props
- Skipping React Testing Library tests

**Should be:**
- Functional components with named exports
- Typed props with interfaces
- Proper component patterns per React standards
- Tests with user-centric queries

### Vue Projects

**Common mistakes:**
- Using Options API when Composition API expected
- Missing TypeScript in script setup
- Not using reactive/ref correctly
- Improper component naming
- Skipping Vue Test Utils tests

**Should be:**
- Follow Vue standards for API style
- Proper reactivity patterns
- Component naming per standards
- Tests per Vue standards

### Svelte Projects

**Common mistakes:**
- Not using reactive declarations ($:)
- Improper store usage
- Missing TypeScript annotations
- Component structure not per standards

**Should be:**
- Follow Svelte standards
- Proper reactivity patterns
- Store patterns per standards
- Tests per Svelte Testing Library

### Next.js Projects

**Common mistakes:**
- Using Pages Router patterns in App Router project (or vice versa)
- Client components when Server components appropriate
- Improper data fetching patterns
- File structure not matching router type

**Should be:**
- Follow Next.js standards for correct router
- Proper component type (Server vs Client)
- Correct data fetching patterns
- File structure per Next.js conventions

### Universal Violations (Any Stack)

**Common mistakes:**
- Skipping the standards check
- Not waiting for approval
- Writing code before showing plan
- Skipping verification
- Not running tests
- Ignoring linting errors
- Hard-coding configuration
- Poor commit messages
- Missing documentation
- Assuming patterns without checking

**Should be:**
- Follow complete workflow
- Show standards check and wait
- Verify before committing
- Run all checks
- Write tests
- Fix all linting/type errors
- Use configuration files
- Follow commit message format
- Document public APIs
- Check standards explicitly

---

## Language-Specific Violations

### TypeScript

**Violations:**
```typescript
// ❌ Using any
const data: any = fetchData();

// ❌ No explicit return type
function process(input) {
  return input.map(x => x * 2);
}

// ❌ Ignoring type errors
// @ts-ignore
const result = dangerousOperation();
```

**Correct:**
```typescript
// ✅ Explicit types
interface Data {
  id: string;
  value: number;
}
const data: Data[] = fetchData();

// ✅ Explicit return type
function process(input: number[]): number[] {
  return input.map(x => x * 2);
}

// ✅ Handle types properly
const result = dangerousOperation(); // Fix the type issue
```

### JavaScript

**Violations:**
```javascript
// ❌ Using var
var count = 0;

// ❌ Missing error handling
function loadData() {
  return fetch('/api/data').then(r => r.json());
}

// ❌ Ignoring linting errors
```

**Correct:**
```javascript
// ✅ Using const/let
let count = 0;

// ✅ Proper error handling
async function loadData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Failed to load data:', error);
    throw error;
  }
}

// ✅ Fix linting errors
```

---

## Standards Files Reference

**Check which standards apply to your stack:**

Use `project_knowledge_search` to find:
```
Query: "active standards [your framework]"
Query: "[your framework] coding standards"
Query: "[your language] standards"
```

**Core standards (all projects):**
- CLAUDE.md - Core workflow
- file-structure.md - Organization
- version-control.md - Git workflow
- code-comments.md - Documentation

**Framework standards (framework-specific):**
- [framework]-standards.md - Framework patterns
- component-patterns.md - Component organization
- testing-standards.md - Test requirements

**Language standards:**
- [language]-standards.md - Language rules
- linting configuration - Code quality

**Styling standards (if applicable):**
- [styling-solution]-standards.md - Styling approach

**Company standards (if imported):**
- company-conventions.md - Company-specific rules
- [any other imported standards]

---

## Restart Protocol

Per CLAUDE.md enforcement section:

> If you skip Standards Check, user will say: "Standards?"
> If you skip Quality Checklist, code is NOT done
> Standards files are the source of truth
> This is non-negotiable
> **VIOLATION = UNACCEPTABLE**

**Now:**

1. Acknowledge what you violated
2. Explain what you should have done
3. Execute `/start-task` properly
4. Follow EVERY step
5. Show complete Standards Check
6. Wait for approval
7. Only proceed with explicit "yes"

---

## If You're Unsure

**About which standards apply:**
```
Use project_knowledge_search:
"stack configuration"
"active standards"
"[framework] standards"
```

**About specific patterns:**
```
Use project_knowledge_search:
"[feature] implementation pattern"
"[component] architecture"
"[framework] best practices"
```

**About user preferences:**
```
Check .claude/your-stack/ directory
Look for customized standards
Read company-specific standards if imported
```

---

## Prevention

**To avoid triggering this command again:**

✅ **Always start with stack-config.yaml**
→ Know your framework, language, tools

✅ **Always use project_knowledge_search**
→ Find applicable standards files
→ Don't assume what standards exist

✅ **Always show Standards Check**
→ Display all files you read
→ List key patterns
→ Show approach

✅ **Always wait for approval**
→ Don't proceed without "yes"
→ Accept feedback gracefully
→ Revise plan if needed

✅ **Always verify before "done"**
→ Run all checks
→ Fix all errors
→ Don't commit broken code

✅ **Always follow your stack's patterns**
→ React uses React patterns
→ Vue uses Vue patterns
→ Don't mix frameworks

---

## Remember

**This framework adapts to YOUR stack.**

Whether you're using:
- React, Vue, Svelte, Angular, or something else
- TypeScript or JavaScript
- Tailwind, CSS Modules, styled-components, or plain CSS
- Vitest, Jest, or another test framework

**The workflow is the same:**
1. Load configuration
2. Find standards
3. Show checklist
4. Wait for approval
5. Follow standards
6. Verify everything
7. Commit properly

**The patterns adapt to your stack.**

**But the discipline stays constant.**

---

**Now execute `/start-task` correctly and follow the complete workflow.**