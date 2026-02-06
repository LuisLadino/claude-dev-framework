# /start-task - Interactive Task Builder

## STEP 1: Load Stack Configuration

Read `.claude/your-stack/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework/version, language, styling, testing framework, package manager, active standards, project-specific settings. Store for entire workflow.

If `.claude/your-stack/init/project-guidelines.md` exists, read it for quality/testing/accessibility requirements.

---

## STEP 2: Understand the Task

Ask clarifying questions about what the user wants:
1. What exactly should this do? (if ambiguous)
2. Where should this go? (page/component/directory)
3. Specific requirements? (styling, data source, interactions, edge cases)
4. Existing code to modify or reference? (if refactoring/extending)

---

## STEP 3: Determine Scope & Read Standards

### Find and Load Standards

Use `Read` or `Grep` to find applicable standards from stack-config.yaml `standards` field.

**Always read:**
- Framework standards (from standards.coding-standards)
- Language standards (from standards.coding-standards)
- Documentation standards (from standards.documentation-standards)
- Architecture patterns (from standards.architecture)
- Version control standards (if committing - from .claude/your-stack/config/)

**Conditionally read based on task keywords:**
- Styling standards (if UI work)
- Testing standards (if tests needed)
- Design system standards (if component/design/brand work)
- API standards (if backend/api/endpoint work)
- Database standards (if data layer/schema/query work)
- Security standards (if auth/security work)
- Performance standards (if optimization work)
- Accessibility standards (if a11y/UI work)
- Any custom directories (from standards.[custom-directory])

**Smart detection:** Analyze task description for keywords, check stack-config.yaml `standards` section for matching directories, only load relevant standards.

---

## STEP 4: Show Complete Standards Check

**PAUSE FOR REVIEW** - Show the user a complete checklist covering:
- Stack details (framework, language, styling, testing, package manager)
- Task summary and approach
- All loaded standards files (coding, documentation, architecture, quality, operational)
- Key patterns being applied from each standard
- Files to create/modify
- Quality checks that will run (format, lint, type-check, build, test)

Ask user to approve: "yes" to proceed, "no" to revise, "explain [item]" for details.

**WAIT FOR USER RESPONSE**

### If user says "no" or has concerns:
Ask what to change, update the plan, re-show the checklist.

### If user says "explain [item]":
Explain the specific item, then re-show the checklist.

---

## STEP 5: Execute Task Following Standards

Once approved, implement following loaded standards:

1. **Framework patterns** - Use patterns from `[framework]-standards.md`, match existing code style
2. **Language rules** - Follow `[language]-standards.md` strictly, avoid listed anti-patterns
3. **Styling** - Follow `[styling]-standards.md`, match existing component styles
4. **Organization** - Follow `file-structure.md` for placement and naming
5. **Documentation** - Add comments per `code-comments.md`, document public APIs per `component-docs.md`
6. **Testing** - Write tests per `testing-standards.md` using configured test framework

---

## STEP 6: Verification Phase

Run all quality checks before marking complete:
- Format (`npm run format` or equivalent)
- Lint (`npm run lint` or equivalent)
- Type check (`npx tsc --noEmit` for TypeScript)
- Build (`npm run build`)
- Tests (`npm test`)

Report pass/fail results to user.

### If Any Check Fails
Show error details, analyze the issue, apply fix, re-run all checks. Only proceed when ALL checks pass.

---

## STEP 7: Completion

Show the user:
- What was built
- Files created/modified
- Verification results (format, lint, type-check, build, tests)

Ask: "Want to commit these changes? (yes/no)"

**If yes:** Read `.claude/your-stack/config/version-control.md`, generate commit message, stage and commit.

**If no:** Done. User can commit later.

---

## STEP 8: Next Steps

Suggest: `/learn` to understand the code, `/verify` for deeper check, or `/start-task` for another task.

---

## ENFORCEMENT

**CRITICAL RULES:**

1. **Always load stack-config.yaml first** - Cannot proceed without knowing the stack
2. **Must show Standards Check** - Show complete checklist, wait for user approval, never skip
3. **Cannot modify approach without approval** - If "no", revise and re-show checklist; only proceed on explicit "yes"
4. **All verification must pass** - Format, lint, type-check, build, test; fix failures and re-run
5. **Quality checklist before "done"** - Run all verification checks, no shortcuts

---

## Tool Usage

**Use Read or Grep for:** Loading stack-config.yaml, finding custom standards, locating framework-specific patterns, checking architectural decisions, finding existing similar code.

**Use web_search for:** Verifying current best practices, checking framework documentation, finding recent patterns.

---

## Troubleshooting

- **Can't find stack-config.yaml** - Run `/init-project` to create stack configuration
- **Standards don't match code** - Review `.claude/your-stack/`, update standards files, verify `standards_active` list in stack-config.yaml
- **Verification failing** - Fix the specific error shown; update configuration if rules don't match needs
- **Wrong framework patterns** - Verify framework name/version in stack-config.yaml, run `/research-stack` to regenerate if needed