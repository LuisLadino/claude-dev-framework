# /audit - Deep Parallel Code Review

Run a thorough code review with multiple perspectives using Agent Teams. Each reviewer focuses on a distinct domain so nothing gets overlooked.

---

## STEP 1: Determine Scope

Ask: "What should I audit?"

Options:
1. **Whole codebase** - Full review
2. **Recent changes** - Changes since last commit/PR
3. **Specific path** - User specifies directory or files

---

## STEP 2: Confirm Agent Teams

Explain: "This spawns 3 parallel reviewers (security, performance, test coverage). Uses ~3x tokens. Continue? (yes/no)"

If no, suggest `/verify` for single-agent specs check instead.

---

## STEP 3: Spawn Review Team

Spawn 3 reviewer teammates:

**Reviewer 1 - Security:**
"Review [scope] for security issues. Check: input validation, authentication/authorization,
data exposure, injection vulnerabilities (SQL, XSS, command), secrets in code,
dependency vulnerabilities. Report issues with file:line and severity (critical/high/medium/low)."

**Reviewer 2 - Performance:**
"Review [scope] for performance issues. Check: N+1 queries, unnecessary re-renders,
large bundle impacts, memory leaks, inefficient algorithms, missing caching opportunities,
blocking operations. Report issues with file:line and impact assessment."

**Reviewer 3 - Test Coverage:**
"Review [scope] for test gaps. Check: untested code paths, missing edge case tests,
brittle tests, inadequate mocking, missing integration tests, error path coverage.
Report gaps with file:line and recommended tests to add."

---

## STEP 4: Wait and Synthesize

Wait for all reviewers to complete.

Collect findings, deduplicate overlapping issues, sort by severity/impact.

---

## STEP 5: Report

```
AUDIT COMPLETE

Scope: [what was reviewed]

Security:    [X] issues ([critical], [high], [medium], [low])
Performance: [X] issues
Test Gaps:   [X] findings

---

CRITICAL/HIGH PRIORITY:
1. [file:line] - [issue]
   Category: [security/performance/tests]
   Fix: [recommendation]

...

MEDIUM/LOW PRIORITY:
...

---

Next steps:
- Fix critical/high issues before merging
- Consider medium issues for follow-up tasks
- Run /verify after fixes to check against your specs
```

---

## STEP 6: Offer Follow-up

Ask: "Create tasks for these issues? (yes/no)"

If yes, generate task list in `.claude/tasks/` with issues as subtasks, grouped by category.

---
