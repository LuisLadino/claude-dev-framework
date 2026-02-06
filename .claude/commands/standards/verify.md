# /verify - Comprehensive Standards Check

Verify existing code follows your standards, regardless of tech stack. Use before commits or when reviewing existing work.

---

## STEP 1: Load Stack Configuration

Read `.claude/your-stack/stack-config.yaml` using the Read tool.

Extract: framework/library name and version, language, styling solution, testing framework, active standards files, project-specific settings.

If not found, tell the user to run `/research-stack` first.

---

## STEP 2: Load Applicable Standards

Based on stack-config.yaml, read applicable standards files from `.claude/your-stack/`:

- **Core** (always): `.claude/CLAUDE.md`, `.claude/your-stack/config/version-control.md`
- **Framework**: Files listed in `standards_active` from stack-config.yaml (in `coding-standards/` and `architecture/`)
- **Language**: Language-specific standards
- **Styling**: Styling solution standards
- **Testing**: Testing standards
- **Company** (if imported): Company conventions

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

For each violation found, report:
- The standard violated (file, section, specific rule)
- The current problematic code snippet
- The correct implementation
- Steps to fix
- Impact (maintainability, performance, accessibility, etc.)

---

## FINAL STATUS

**If all checks pass:** Report the stack, list all standards verified against, total checks passed, and confirm ready for commit/deployment.

**If violations found:** Report the stack, violations broken down by category with counts, total violation count. Instruct the user to fix all violations and run `/verify` again. Do NOT approve for commit until all violations are fixed.

---

## ENFORCEMENT

Per CLAUDE.md:

- Violations found = code is NOT done
- Must fix ALL violations before proceeding
- This is NON-NEGOTIABLE

Workflow: Code -> /verify -> Fix violations -> /verify -> All pass -> Commit

Run before every commit and after major refactoring. Do not commit with violations. Do not ignore minor issues.