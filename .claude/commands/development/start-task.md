# /start-task - Interactive Task Builder

## STEP 1: Load Stack Configuration

Read `.claude/specs/stack-config.yaml`. If missing, ask user to run `/init-project` or `/sync-stack` first.

**Extract:** Framework/version, language, styling, testing framework, package manager, active specs.

If `.claude/specs/init/project-guidelines.md` exists, read it for quality/testing/accessibility requirements.

### Check for New Dependencies

Scan dependencies (package.json or equivalent). Compare against specs files in `.claude/specs/coding/`.

If a major dependency has no specs file (e.g., added Prisma but no `prisma-specs.md`), ask:

"[dependency] doesn't have a specs file. Create one? (yes/no/later)"

If yes, generate specs for that dependency before continuing.

---

## STEP 2: Understand the Task

Ask clarifying questions about what the user wants:
1. What exactly should this do? (if ambiguous)
2. Where should this go? (page/component/directory)
3. Specific requirements? (styling, data source, interactions, edge cases)
4. Existing code to modify or reference? (if refactoring/extending)

---

## STEP 3: Determine Scope & Read Specs

### Find and Load Specs

Use `Read` or `Grep` to find applicable specs from stack-config.yaml `specs` field.

**Always read:**
- Framework specs (from specs.coding)
- Language specs (from specs.coding)
- Documentation specs (from specs.documentation)
- Architecture patterns (from specs.architecture)
- Version control specs (if committing - from .claude/specs/config/)

**Conditionally read based on task keywords:**
- Styling specs (if UI work)
- Testing specs (if tests needed)
- Design system specs (if component/design/brand work)
- API specs (if backend/api/endpoint work)
- Database specs (if data layer/schema/query work)
- Security specs (if auth/security work)
- Performance specs (if optimization work)
- Accessibility specs (if a11y/UI work)
- Any custom directories (from specs.[custom-directory])

**Smart detection:** Analyze task description for keywords, check stack-config.yaml `specs` section for matching directories, only load relevant specs.

---

## STEP 4: Show Complete Specs Check

**PAUSE FOR REVIEW** - Show the user a complete checklist covering:
- Stack details (framework, language, styling, testing, package manager)
- Task summary and approach
- All loaded specs files (coding, documentation, architecture, quality, operational)
- Key patterns being applied from each spec
- Files to create/modify
- Quality checks that will run (format, lint, type-check, build, test)

Ask user to approve: "yes" to proceed, "no" to revise, "explain [item]" for details.

**WAIT FOR USER RESPONSE**

### If user says "no" or has concerns:
Ask what to change, update the plan, re-show the checklist.

### If user says "explain [item]":
Explain the specific item, then re-show the checklist.

---

## STEP 5: Execute Task Following Specs

Once approved, implement following loaded specs:

1. **Framework patterns** - Use patterns from `[framework]-specs.md`, match existing code style
2. **Language rules** - Follow `[language]-specs.md` strictly, avoid listed anti-patterns
3. **Styling** - Follow `[styling]-specs.md`, match existing component styles
4. **Organization** - Follow `file-structure.md` for placement and naming
5. **Documentation** - Add comments per `code-comments.md`, document public APIs per `component-docs.md`
6. **Testing** - Write tests per `testing-specs.md` using configured test framework

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

**If yes:** Read `.claude/specs/config/version-control.md`, generate commit message, stage and commit.

**If no:** Done. User can commit later.

---

## STEP 8: Next Steps

Suggest: `/learn` to understand the code, `/verify` for deeper check, or `/start-task` for another task.

---

## ENFORCEMENT

**CRITICAL RULES:**

1. **Always load stack-config.yaml first** - Cannot proceed without knowing the stack
2. **Must show Specs Check** - Show complete checklist, wait for user approval, never skip
3. **Cannot modify approach without approval** - If "no", revise and re-show checklist; only proceed on explicit "yes"
4. **All verification must pass** - Format, lint, type-check, build, test; fix failures and re-run
5. **Quality checklist before "done"** - Run all verification checks, no shortcuts

---

## Tool Usage

**Use Read or Grep for:** Loading stack-config.yaml, finding custom specs, locating framework-specific patterns, checking architectural decisions, finding existing similar code.

**Use web_search for:** Verifying current best practices, checking framework documentation, finding recent patterns.

---

## Troubleshooting

- **Can't find stack-config.yaml** - Run `/init-project` to create stack configuration
- **Specs don't match code** - Review `.claude/specs/`, update specs files, verify `specs_active` list in stack-config.yaml
- **Verification failing** - Fix the specific error shown; update configuration if rules don't match needs
- **Wrong framework patterns** - Verify framework name/version in stack-config.yaml, run `/sync-stack` to regenerate if needed