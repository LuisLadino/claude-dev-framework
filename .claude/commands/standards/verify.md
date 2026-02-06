# /verify - Standards Check

Verify code follows your standards. Use before commits or when reviewing work.

---

## STEP 1: Load Configuration

Read `.claude/your-stack/stack-config.yaml`.

If not found, tell the user to run `/init-project` or `/sync-stack` first.

---

## STEP 2: Load Standards

Read all applicable standards from `.claude/your-stack/` based on `standards_active` in stack-config.yaml:

- `coding-standards/` - Framework and language patterns
- `architecture/` - File structure and component patterns
- `documentation-standards/` - Comment and doc patterns
- `config/version-control.md` - Commit and git patterns

**Only check against standards that actually exist.** Don't assume patterns - read them from the files.

---

## STEP 3: Run Tooling Checks

Run available quality checks:

```bash
# Format (if configured)
npm run format --check 2>/dev/null || pnpm format --check 2>/dev/null

# Lint
npm run lint 2>/dev/null || pnpm lint 2>/dev/null

# Type check (if TypeScript)
npx tsc --noEmit 2>/dev/null

# Build
npm run build 2>/dev/null || pnpm build 2>/dev/null

# Tests
npm test 2>/dev/null || pnpm test 2>/dev/null
```

Report pass/fail for each.

---

## STEP 4: Code Review Against Standards

For each standards file loaded in STEP 2, check the codebase:

1. **Read the standard** - Extract the specific rules/patterns
2. **Search the code** - Use Grep/Read to find relevant code
3. **Compare** - Does the code follow the documented pattern?
4. **Report** - List violations with file:line, what's wrong, what the standard says

**Important:** Only check rules that are explicitly in the user's standards files. Don't invent rules.

---

## STEP 5: Report

### If all checks pass:
```
VERIFICATION PASSED

Stack: [framework] + [language]
Standards checked: [list files]
Tooling: format ✓, lint ✓, types ✓, build ✓, tests ✓

Ready for commit.
```

### If violations found:
```
VERIFICATION FAILED

[X] violations found:

1. [file:line] - [what's wrong]
   Standard: [which file, which rule]
   Fix: [how to fix]

...

Fix violations and run /verify again.
```

---

## Notes

- This command reads YOUR standards, not a hardcoded checklist
- If your standards are empty, there's nothing to verify beyond tooling
- Add standards with `/add-standard` or `/research-stack`
