# /verify - Comprehensive Standards Check

**Verify existing code follows your standards, regardless of your tech stack.**

Use this to audit code quality before commits or when reviewing existing work.

---

## STEP 1: Load Stack Configuration

**First, understand what stack we're verifying:**

Use `project_knowledge_search`:
```
Query: "stack-config.yaml configuration"
```

**Extract:**
- Framework/library name and version
- Language (TypeScript/JavaScript/etc.)
- Styling solution
- Testing framework
- Active standards files
- Project-specific settings

**If not found:**
```
⚠️  Stack configuration missing!

Run /research-stack to set up your stack first.
```

---

## STEP 2: Load Applicable Standards

Based on stack-config.yaml, use `project_knowledge_search` to load:

**Core Standards (always check):**
```
Query: "CLAUDE.md core instructions"
Query: "file structure organization"
Query: "version control standards"
Query: "code comments documentation"
```

**Framework Standards:**
```
Query: "[framework] coding standards"
Query: "component patterns [framework]"
```

**Language Standards:**
```
Query: "[language] standards rules"
```

**Styling Standards:**
```
Query: "[styling solution] standards"
```

**Testing Standards:**
```
Query: "testing standards requirements"
```

**Company Standards (if imported):**
```
Query: "company conventions"
```

---

## VERIFICATION CHECKLIST

### Core Compliance

#### CLAUDE.md Workflow

- [ ] **Prime Directive followed**: Root cause focus, not quick fixes?
- [ ] **Edit Protocol**: Focused edits, all features implemented?
- [ ] **Code verification**: Patterns verified before use?
- [ ] **Anti-patterns avoided**: No anti-patterns present?
- [ ] **Quality first**: Quality prioritized over speed?

**Check for:**
- Proper problem solving approach
- Complete implementations (not partial)
- Verified patterns against standards
- No shortcuts taken

---

### Quality Checklist (Universal)

**From your standards, verify:**

- [ ] **Code formatted**: Consistent formatting throughout?
- [ ] **Linting passing**: No linting errors or warnings?
- [ ] **Type checking**: All types correct (if TypeScript)?
- [ ] **Tests present**: Required tests exist?
- [ ] **Tests passing**: All tests pass?
- [ ] **Build successful**: Project builds without errors?
- [ ] **Documentation**: Public APIs documented?
- [ ] **Comments**: Complex logic explained?
- [ ] **Imports clean**: All imports used, none missing?
- [ ] **No console logs**: Debug code removed?
- [ ] **Error handling**: Errors handled appropriately?

---

### Framework-Specific Standards

**Detect framework from stack-config.yaml and check:**

#### React Projects

**From react-standards.md (if applicable):**

- [ ] **Functional components**: No class components?
- [ ] **Named exports**: No default exports?
- [ ] **Typed props**: All props have TypeScript interfaces?
- [ ] **Props destructured**: Props destructured in parameters?
- [ ] **Hook rules**: Hooks used correctly?
- [ ] **Key props**: Lists have proper keys?
- [ ] **Event handlers**: Proper event handler patterns?
- [ ] **Component naming**: PascalCase component names?

#### Vue Projects

**From vue-standards.md (if applicable):**

- [ ] **API style**: Composition API vs Options API per standards?
- [ ] **Script setup**: Using `<script setup>` if required?
- [ ] **Reactivity**: Proper use of ref/reactive?
- [ ] **Component naming**: Proper naming conventions?
- [ ] **Props**: Props defined with TypeScript?
- [ ] **Emits**: Events properly defined?
- [ ] **Template refs**: Template refs used correctly?

#### Svelte Projects

**From svelte-standards.md (if applicable):**

- [ ] **Reactive declarations**: Proper use of $:?
- [ ] **Stores**: Store patterns followed?
- [ ] **Component structure**: Script, template, style order?
- [ ] **Props**: Export let with types?
- [ ] **Events**: Event forwarding correct?
- [ ] **Slots**: Slot usage proper?

#### Next.js Projects

**From nextjs-standards.md (if applicable):**

- [ ] **Router type**: App Router vs Pages Router correct?
- [ ] **Server components**: Used where appropriate?
- [ ] **Client components**: "use client" where needed?
- [ ] **Data fetching**: Proper patterns for router type?
- [ ] **File structure**: Matches router conventions?
- [ ] **Metadata**: Metadata exports correct?

#### SvelteKit Projects

**From sveltekit-standards.md (if applicable):**

- [ ] **Load functions**: +page.server.ts patterns?
- [ ] **Form actions**: Form action patterns?
- [ ] **File naming**: +page.svelte conventions?
- [ ] **$app imports**: Using $app modules correctly?
- [ ] **Server vs client**: Code in correct locations?

#### Astro Projects

**From astro-standards.md (if applicable):**

- [ ] **Islands**: Client directives used appropriately?
- [ ] **File types**: .astro vs framework components correct?
- [ ] **Content collections**: Proper collection patterns?
- [ ] **Frontmatter**: Page frontmatter correct?
- [ ] **Static generation**: Build-time data fetching?

---

### Language Standards

**Detect language and check:**

#### TypeScript Projects

**From typescript-standards.md (if applicable):**

- [ ] **Strict mode**: No `any` types used?
- [ ] **Explicit types**: All functions/variables typed?
- [ ] **Interfaces**: Props use interfaces not types?
- [ ] **Type imports**: Type imports separate?
- [ ] **Null checks**: Proper null/undefined handling?
- [ ] **Type assertions**: Minimal, only when necessary?
- [ ] **Generics**: Used appropriately?

#### JavaScript Projects

**From javascript-standards.md (if applicable):**

- [ ] **Modern syntax**: ES6+ features used?
- [ ] **Const/let**: No var usage?
- [ ] **Arrow functions**: Appropriate usage?
- [ ] **Destructuring**: Used where beneficial?
- [ ] **Template literals**: Used for strings?
- [ ] **JSDoc**: Comments for complex functions?

---

### Styling Standards

**Detect styling solution and check:**

#### Tailwind CSS

**From tailwind-standards.md (if applicable):**

- [ ] **Utility classes**: Using Tailwind utilities?
- [ ] **No inline styles**: Avoiding inline styles?
- [ ] **Semantic colors**: Using theme colors?
- [ ] **Responsive**: Proper breakpoint usage?
- [ ] **No @apply**: Avoiding @apply directive?
- [ ] **Custom classes**: Minimal custom CSS?

#### CSS Modules

**From css-modules-standards.md (if applicable):**

- [ ] **Scoped styles**: Styles properly scoped?
- [ ] **Naming**: camelCase class names?
- [ ] **Composition**: Using composes correctly?
- [ ] **No global**: Avoiding global styles?

#### styled-components

**From styled-components-standards.md (if applicable):**

- [ ] **Component styled**: Using styled syntax?
- [ ] **Theme**: Theme values used?
- [ ] **Props**: Styles adapt to props?
- [ ] **No inline**: Avoiding inline styles?

#### Plain CSS

**From css-standards.md (if applicable):**

- [ ] **BEM naming**: Proper BEM conventions?
- [ ] **CSS variables**: Using variables for values?
- [ ] **Specificity**: Low specificity selectors?
- [ ] **Organization**: Logical file organization?

---

### Documentation Standards

**From documentation-standards:**

#### Code Comments

- [ ] **Complex logic**: Explained with WHY?
- [ ] **No obvious**: No comments for obvious code?
- [ ] **Updated**: Comments match current code?
- [ ] **Proper format**: Comments properly formatted?

#### Component Documentation

**If public API:**

- [ ] **JSDoc present**: Components documented?
- [ ] **Props explained**: All props explained?
- [ ] **Examples**: Usage examples provided?
- [ ] **Return type**: Return type documented?

---

### Architecture Standards

**From architecture standards:**

#### File Structure

- [ ] **Organization**: Files in correct directories?
- [ ] **Naming**: File names follow conventions?
- [ ] **One per file**: One component per file?
- [ ] **Test collocation**: Tests next to source?
- [ ] **Barrel exports**: Using index.ts files?

#### Component Patterns

- [ ] **Size**: Components appropriately sized?
- [ ] **Reusability**: Reusable components generic?
- [ ] **Composition**: Proper component composition?
- [ ] **Props**: Props API well designed?
- [ ] **State**: State managed at right level?

---

### Testing Standards

**From testing-standards.md:**

- [ ] **Tests exist**: All required tests present?
- [ ] **Test naming**: Tests properly named?
- [ ] **Coverage**: Adequate test coverage?
- [ ] **Test quality**: Tests test behavior not implementation?
- [ ] **Accessibility**: A11y tests included?
- [ ] **Edge cases**: Edge cases tested?

---

### Version Control

**From version-control.md:**

- [ ] **No temp files**: No .tmp, .log files?
- [ ] **No debug**: No debugger statements?
- [ ] **No console**: No console.log (except intentional)?
- [ ] **Commit message**: Proper format if committing?
- [ ] **No secrets**: No hardcoded secrets?
- [ ] **Gitignore**: Appropriate .gitignore?

---

## VERIFICATION REPORT

**For EACH violation found:**

```
❌ VIOLATION: [Title]

**Standard Violated:**
File: [standards file]
Section: [section name]
Rule: [specific rule]

**Current Code:**
[Show problematic code snippet]

**Should Be:**
[Show correct implementation]

**How to Fix:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Why It Matters:**
[Explain impact - maintainability, performance, accessibility, etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## FINAL STATUS

### If ALL ✅:

```
✅ **ALL STANDARDS VERIFIED**

**Stack:** [Framework + Language + Styling]

**Verified Against:**
✓ CLAUDE.md - Core workflow
✓ [Framework]-standards.md - Framework patterns
✓ [Language]-standards.md - Language rules
✓ [Styling]-standards.md - Styling approach
✓ testing-standards.md - Test requirements
✓ architecture standards - File organization
✓ documentation standards - Code documentation
✓ version-control.md - Git readiness
[✓ company-conventions.md - if imported]

**Quality Checklist:** All items ✓

**Summary:**
- Total checks: [count]
- Passed: [count]
- Failed: 0

Code follows all standards for your [stack] project.
Ready for commit/deployment.
```

### If ANY ❌:

```
❌ **STANDARDS VIOLATIONS FOUND**

**Stack:** [Framework + Language + Styling]

**Violations by Category:**
- Core Compliance: [count] issues
- [Framework] Standards: [count] issues
- [Language] Standards: [count] issues
- [Styling] Standards: [count] issues
- Testing: [count] issues
- Documentation: [count] issues
- Architecture: [count] issues
- Version Control: [count] issues

**Total Violations:** [count]

**Action Required:**
1. Review detailed report above
2. Fix each violation
3. Run /verify again
4. Repeat until all ✅

Do NOT commit until all violations are fixed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

See detailed violations above for specific fixes.
```

---

## ENFORCEMENT

Per CLAUDE.md:

- Violations found = code is NOT done
- Must fix ALL violations before proceeding
- Quality Checklist must be ALL ✅
- This is NON-NEGOTIABLE

**Workflow:**
```
Code → /verify → Violations found → Fix → /verify → All ✅ → Commit
```

---

## Stack-Specific Examples

### Example 1: React + TypeScript + Tailwind

```
/verify

🔧 Loading: React 18 + TypeScript + Tailwind stack

✓ Core compliance
✓ React standards (functional components, named exports)
✓ TypeScript standards (strict mode, no any)
✓ Tailwind standards (utility classes, semantic colors)
✓ Testing standards (React Testing Library)
✓ Architecture (proper file organization)

✅ All standards verified for React stack
```

### Example 2: Vue + JavaScript + CSS Modules

```
/verify

🔧 Loading: Vue 3 + JavaScript + CSS Modules stack

✓ Core compliance
✓ Vue standards (Composition API, script setup)
✓ JavaScript standards (ES6+, JSDoc)
✓ CSS Modules standards (scoped, camelCase)
✓ Testing standards (Vue Test Utils)
✓ Architecture (SFC organization)

✅ All standards verified for Vue stack
```

### Example 3: Svelte + TypeScript

```
/verify

🔧 Loading: SvelteKit + TypeScript stack

✓ Core compliance
✓ Svelte standards (reactive declarations, stores)
✓ TypeScript standards (strict mode, explicit types)
✓ Testing standards (Svelte Testing Library)
✓ Architecture (proper file structure)
✓ SvelteKit patterns (load functions, form actions)

✅ All standards verified for SvelteKit stack
```

---

## Tips for Using /verify

### DO:
✅ Run before every commit
✅ Run after major refactoring
✅ Run when reviewing code
✅ Fix violations immediately
✅ Re-run after fixes

### DON'T:
❌ Skip verification
❌ Commit with violations
❌ Ignore "minor" issues
❌ Assume code is correct
❌ Rush through fixes

---

**This command adapts to YOUR stack and enforces YOUR standards. Run it regularly to maintain code quality.**