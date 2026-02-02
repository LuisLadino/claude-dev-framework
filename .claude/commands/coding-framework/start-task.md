# /start-task - Interactive Task Builder

Build features correctly by following your standards, regardless of your tech stack.

**How to use:** Type `/start-task` then describe what you want to build/fix.

This command ensures:
1. Correct standards are followed
2. Complete checklist is shown
3. You approve before execution
4. Everything is verified
5. Proper commits

---

## STEP 1: Load Stack Configuration

**Before anything else, load your stack details:**

```
🔧 **LOADING STACK CONFIGURATION**

Reading: .claude/your-stack/stack-config.yaml
```

Use `Read` to find and read stack-config.yaml:
```
Path: ".claude/your-stack/stack-config.yaml"
```

**Extract:**
- Framework/library name and version
- Language (TypeScript/JavaScript/etc.)
- Styling solution
- Testing framework
- Package manager
- Active standards files
- Any project-specific settings

**Store this information for the entire workflow**

**If stack-config.yaml not found:**
```
⚠️  Stack configuration not found!

Options:
1. Run /init-stack to configure your stack
2. Run /research-stack to generate standards
3. Run /import-standards if you have company docs
4. Provide stack details manually

Which would you like to do?
```

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

Reading: .claude/your-stack/init/project-guidelines.md

Extracting project-specific requirements:
✓ Quality approach: [Balanced / Enterprise rigor / Speed first]
✓ Testing requirements: [Coverage % or level]
✓ Accessibility: [WCAG A/AA/AAA or Basic/Standard/Exceptional]
✓ Performance targets: [Load times, Lighthouse scores]
✓ Must-have integrations: [Salesforce, SSO, etc.]
✓ Team agreements: [Code review, deployment rules]
```

**Extract and store for later use:**
- Development approach (speed vs quality balance)
- Test coverage requirements (if any)
- Accessibility level required
- Performance targets
- Required integrations
- Deployment constraints

**Apply during execution:**
These requirements will be checked during standards check and verification.

**If not found:**
```
ℹ️  No project guidelines found (optional)

Using universal CLAUDE.md standards only.

To add project-specific requirements:
→ Run /init-project

This is optional - the task will proceed normally.
```

**Continue normally - project guidelines are optional enhancement**

---

## STEP 2: Understand the Task

Ask clarifying questions about what the user wants:

```
📋 **UNDERSTANDING YOUR REQUEST**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You want to: [user's description]

Let me clarify a few things:

**1. What exactly should this do?**
[If ambiguous, ask for specifics]

**2. Where should this go?**
[Ask about location: which page/component/directory]

**3. Any specific requirements?**
- Styling preferences?
- Data source?
- User interactions?
- Edge cases to handle?

**4. Any existing code to modify or reference?**
[If refactoring or extending]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## STEP 3: Determine Scope & Read Standards

### Find Your Standards

Use `Read` or `Grep` to find applicable standards:

```
Pattern: "coding standards [framework]"
Pattern: "architecture patterns"
Pattern: "testing standards"
Pattern: "[specific feature] standards"
```

**Search for:**
- Framework-specific standards
- Language standards (TypeScript/JavaScript/etc.)
- Styling standards
- Testing requirements
- Documentation requirements
- Architecture patterns

### Read CLAUDE.md Core Instructions

Read `.claude/CLAUDE.md` (the master file) and acknowledge:

**Core Sections to Read:**
- Stack definition & Prime Directive
- Required Reading section
- MANDATORY Workflow
- Edit Protocol
- Code Verification requirements
- Anti-Patterns to avoid
- Enforcement rules

**Verify understanding:**
```
✓ Tech stack: [From stack-config.yaml]
✓ Prime Directive: [Root cause focus, quality over speed]
✓ Required workflow: [Must show checklist, wait for approval]
✓ Edit protocol: [Focused edits, implement ALL features]
```

### Load Active Standards Files

Based on stack-config.yaml `standards` field (NEW DYNAMIC SCHEMA), load:

**Always read:**
```
□ Framework standards (from standards.coding-standards)
□ Language standards (from standards.coding-standards)
□ Documentation standards (from standards.documentation-standards)
□ Architecture patterns (from standards.architecture)
□ Version control standards (if committing - from .claude/config/)
```

**Conditionally read based on task keywords:**
```
□ Styling standards (if UI work - from standards.coding-standards)
□ Testing standards (if tests needed - from standards.coding-standards)
□ Design system standards (if component/design/brand work - from standards.design-system)
□ API standards (if backend/api/endpoint work - from standards.api-standards)
□ Database standards (if data layer/schema/query work - from standards.database-standards)
□ Security standards (if auth/security work - from standards.security-standards)
□ Performance standards (if optimization work - from standards.performance-standards)
□ Accessibility standards (if a11y/UI work - from standards.accessibility-standards)
□ Any custom directories (from standards.[custom-directory])
```

**Smart detection logic:**
- Analyze task description for keywords (component, api, database, auth, etc.)
- Check stack-config.yaml `standards` section for matching directories
- Only load standards that are relevant to the task
- Use `Read` or `Grep` to find files in those directories

**Use Read or Grep for each relevant category:**
```
Pattern: "[framework] coding standards"
Pattern: "[language] standards"
Pattern: "component patterns"
Pattern: "design system standards" (if design work detected)
Pattern: "api standards" (if API work detected)
Pattern: "database standards" (if database work detected)
```

---

## STEP 4: Show Complete Standards Check

**⏸️ PAUSE FOR REVIEW**

Show complete checklist for user approval:

```
📋 **STANDARDS CHECK - PLEASE REVIEW**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Stack:**
- Framework: [name + version]
- Language: [TypeScript/JavaScript/etc.]
- Styling: [Tailwind/CSS/styled-components/etc.]
- Testing: [Vitest/Jest/etc.]
- Package Manager: [pnpm/npm/yarn]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Task Summary:**
[Clear description of what will be built]

**Approach:**
[Explain the approach/strategy]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Standards Loaded:**

✓ Core Instructions:
  - .claude/CLAUDE.md (workflow, prime directive, enforcement)

✓ Coding Standards:
  - [framework]-standards.md (component patterns, best practices)
  - [language]-standards.md (typing, conventions, rules)
  - [styling]-standards.md (styling approach, class usage)

✓ Documentation Standards:
  - code-comments.md (inline documentation)
  - component-docs.md (public API documentation)

✓ Architecture:
  - file-structure.md (organization, naming conventions)
  - component-patterns.md (architectural patterns)

✓ Quality Standards:
  - testing-standards.md (test requirements, coverage)
  - [any company-specific standards]

✓ Operational Standards:
  - version-control.md (will read before committing - commit format, pre-commit checks)
  - [environment.md if environment work needed]
  - [deployment.md if deployment needed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Key Standards Being Applied:**

From [framework]-standards.md:
- [Key pattern 1]
- [Key pattern 2]
- [Key pattern 3]

From [language]-standards.md:
- [Key rule 1]
- [Key rule 2]

From architecture:
- [Organizational principle]
- [Naming convention]

From testing:
- [Test requirement]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Files to Create/Modify:**
- [path/to/file1] - [Purpose]
- [path/to/file2] - [Purpose]
- [path/to/test-file] - [Tests]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quality Checks That Will Run:**
✓ Code formatting (Prettier/formatter)
✓ Linting (ESLint/linter)
✓ Type checking ([language] compiler)
✓ Build verification
✓ Test suite (if tests exist)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 **REVIEW THE CHECKLIST ABOVE**

Does this approach look correct?
Are the right standards being applied?
Should I proceed?

Options:
- Type "yes" or "y" - Proceed with this plan
- Type "no" or "n" - Let me know what to change
- Type "explain [item]" - Get more details about something
- Type "standards?" - If something seems wrong

What would you like to do?
```

**⏸️ WAIT FOR USER RESPONSE**

### If user says "no" or has concerns:

```
🤔 **ADJUSTING APPROACH**

What would you like to change?

Options:
- "Use different pattern" - Explain preferred approach
- "Missing standard" - Point out what's missing
- "Wrong framework" - Verify stack-config.yaml
- "Different file location" - Specify where
- Other concerns - Just describe the issue

I'll update the plan based on your feedback.
```

Update the plan and show the checklist again.

### If user says "explain [item]":

Explain the specific item they're asking about, then re-show the checklist.

---

## STEP 5: Execute Task Following Standards

Once approved, execute the task:

```
🚀 **EXECUTING TASK**

Working according to loaded standards...
```

**Implementation guidelines:**

1. **Follow framework patterns:**
   - Use patterns from `[framework]-standards.md`
   - Match existing code style in project
   - Reference specific standards by name

2. **Apply language rules:**
   - Follow `[language]-standards.md` strictly
   - Use proper typing/conventions
   - Avoid anti-patterns listed in standards

3. **Use styling approach:**
   - Follow `[styling]-standards.md`
   - Use configured styling solution correctly
   - Match existing component styles

4. **Organization:**
   - Follow `file-structure.md` for placement
   - Use correct naming conventions
   - Organize imports per standards

5. **Documentation:**
   - Add comments per `code-comments.md`
   - Document public APIs per `component-docs.md`
   - Explain WHY not WHAT

6. **Testing:**
   - Write tests per `testing-standards.md`
   - Cover requirements
   - Use configured test framework

**Reference standards explicitly:**
```
// Following [framework]-standards.md: [specific pattern]
```

---

## STEP 6: Verification Phase

Before marking complete, verify everything works:

```
🔍 **VERIFICATION PHASE**

Running all checks...
```

### Run Quality Checks

**Format:**
```bash
npm run format
# or: pnpm format, yarn format, etc.
```

**Lint:**
```bash
npm run lint
# or: equivalent in your package.json
```

**Type Check:**
```bash
# For TypeScript projects:
npx tsc --noEmit
# or: npm run type-check
```

**Build:**
```bash
npm run build
# Ensures project builds without errors
```

**Tests:**
```bash
npm test
# or: npm run test
```

### Report Results

```
✅ **VERIFICATION RESULTS**

Format: ✓ Pass
Lint: ✓ Pass
Type Check: ✓ Pass
Build: ✓ Pass
Tests: ✓ Pass (X tests, Y assertions)

All checks passed!
```

### If Any Check Fails

```
❌ **VERIFICATION FAILED**

[Check name] failed:

[Show error details]

**Analysis:**
[Explain what's wrong]

**Fix:**
[Describe what needs to change]

Fixing the issue...

[Apply fix]

Re-running all checks...
```

**Only proceed when ALL checks pass**

---

## STEP 7: Commit Changes

**First, load version control standards:**

Use `Read` to read version-control.md:
```
Path: ".claude/config/version-control.md"
```

**Extract from version-control.md:**
- Commit message format (type, scope, structure)
- Allowed commit types (feat, fix, refactor, etc.)
- Pre-commit checklist requirements
- Message formatting rules

Then prepare for commit:

```
📦 **PREPARING COMMIT**

**Version Control Standards Loaded:**
✓ Read: .claude/config/version-control.md
  - Commit format: [format from standards file]
  - Types: [allowed types from standards]
  - Pre-commit checks: [checklist items from standards]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Changes to commit:**
- [file1] (new/modified)
- [file2] (modified)
- [test-file] (new)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Suggested Commit Message:**
(Following format from version-control.md)

[type]([scope]): [description]

[body explaining what and why]

Example:
feat(components): add ThemeToggle component

Implement theme switching with light/dark modes.
Persists user preference to localStorage.
Includes keyboard accessibility.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to commit? (yes/no)

Or type custom message if you prefer different wording.
```

**⏸️ WAIT FOR APPROVAL**

### If approved:

```bash
git add .
git commit -m "[commit message]"
```

```
✅ Committed: [commit hash]
```

---

## STEP 8: Completion Report

```
✅ **TASK COMPLETE**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What was built:**
[Clear description of what was created/modified]

**Stack used:**
- [Framework + version]
- [Language]
- [Other key technologies]

**Standards followed:**
✓ CLAUDE.md - [Workflow adherence, task-to-standards mapping]
✓ [framework]-standards.md - [Key patterns used]
✓ [language]-standards.md - [Key rules followed]
✓ [styling]-standards.md - [Styling approach]
✓ testing-standards.md - [Test coverage]
✓ file-structure.md - [Organization]
✓ version-control.md - [Commit format, pre-commit checks]

**Files created/modified:**
- [file1] - [Purpose]
- [file2] - [Purpose]
- [test-file] - [Test coverage]

**Quality verification:**
✓ All code formatted
✓ No linting errors
✓ Type checking passed
✓ Build successful
✓ All tests passing

**Committed:**
[commit hash] - [commit message]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next steps:**

Want to understand what was built?
→ Use /learn to get a detailed explanation

Need to verify standards compliance?
→ Use /verify for a complete audit

Ready for another task?
→ Use /start-task with your next requirement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ENFORCEMENT

**CRITICAL RULES (VIOLATION = UNACCEPTABLE):**

1. **Always load stack-config.yaml first**
   - Cannot proceed without knowing the stack
   - Use Read to find it
   - Extract all relevant configuration

2. **Must show Standards Check**
   - Show complete checklist
   - Wait for user approval
   - Never skip this step

3. **Cannot modify approach without approval**
   - If user says "no", revise the plan
   - Re-show checklist after changes
   - Only proceed with explicit "yes"

4. **All verification must pass**
   - Format, lint, type-check, build, test
   - Fix any failures before proceeding
   - Re-run all checks after fixes

5. **Quality checklist before "done"**
   - Run all verification checks
   - Ensure standards compliance
   - No shortcuts

**If user says "Standards?":**
- Stop immediately
- Execute `/standards` command
- Restart from STEP 1
- Show what was violated

---

## Tool Usage

### Use Read or Grep for:
- Loading stack-config.yaml
- Finding user's custom standards
- Locating framework-specific patterns
- Checking architectural decisions
- Finding existing similar code

### Example usage:
```
Read file_path:".claude/your-stack/stack-config.yaml"
Grep pattern:"[framework] coding standards" path:".claude/your-stack"
Grep pattern:"component architecture" path:".claude"
Grep pattern:"testing requirements"
Grep pattern:"[feature] implementation"
```

### Use web_search for:
- Verifying current best practices (if unsure)
- Checking framework documentation
- Finding recent patterns (post-2024)
- Validating approaches

### Use filesystem (if MCP enabled):
- Reading existing code for patterns
- Finding similar components
- Checking project structure
- Locating configuration files

---

## Stack-Agnostic Examples

### Example 1: React with TypeScript

```
Stack: React 18 + TypeScript + Tailwind + Vitest
Task: "Add a button component"

Standards applied:
- React: Functional components, named exports, typed props
- TypeScript: Strict mode, explicit interfaces
- Tailwind: Utility classes, no inline styles
- Testing: Unit tests with React Testing Library

Result: Button.tsx + Button.test.tsx following all standards
```

### Example 2: Vue with JavaScript

```
Stack: Vue 3 + JavaScript + CSS Modules + Vitest
Task: "Add a button component"

Standards applied:
- Vue: Composition API, script setup
- JavaScript: ESLint rules, JSDoc comments
- CSS Modules: Scoped styles, BEM naming
- Testing: Unit tests with Vue Test Utils

Result: Button.vue + Button.test.js following all standards
```

### Example 3: Svelte

```
Stack: SvelteKit + TypeScript + Tailwind
Task: "Add a button component"

Standards applied:
- Svelte: Component structure, props typing
- TypeScript: Strict mode, explicit types
- Tailwind: Utility classes
- SvelteKit: File-based routing, load functions

Result: Button.svelte + Button.test.ts following all standards
```

---

## Troubleshooting

### "Can't find stack-config.yaml"

**Run initial setup:**
```
/research-stack
```

This will create your stack configuration.

### "Standards don't match my code"

**Your standards may need updating:**
1. Review `.claude/your-stack/` directory
2. Update standards files to match your preferences
3. Ensure stack-config.yaml has correct `standards_active` list

### "Verification failing"

**Common causes:**
- Linting rules too strict
- Type errors in existing code
- Test configuration issues
- Build configuration problems

**Solutions:**
1. Fix the specific error shown
2. Update configuration if rules don't match needs
3. Ask for help understanding the error

### "Wrong framework patterns applied"

**Check stack-config.yaml:**
1. Verify framework name and version are correct
2. Ensure standards_active lists correct files
3. Run `/research-stack` to regenerate if needed

---

## Tips for Success

### DO:
✅ Read the standards check carefully
✅ Verify framework/stack is correct
✅ Ask questions if anything is unclear
✅ Review verification results
✅ Use `/learn` after to understand what was built

### DON'T:
❌ Skip the standards check review
❌ Proceed without approval
❌ Ignore verification failures
❌ Commit without running checks
❌ Assume patterns without checking standards

---

**This command works with ANY stack. It adapts to YOUR configuration and enforces YOUR standards.**