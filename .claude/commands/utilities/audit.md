---
description: Deep codebase audit using parallel agents. Security, performance, tests, architecture, and spec compliance reviewed simultaneously. For pre-commit diff review, use /review instead.
---

# /audit - Deep Parallel Codebase Audit

Run a thorough codebase audit with multiple specialist agents. Each reviewer focuses on a distinct domain. Findings are filtered to production-risk only.

**This is a DEEP review.** It examines the codebase holistically, not just a diff. Use `/review` for pre-commit diff review. Use `/audit` before releases, after major refactors, or when onboarding to a new codebase.

---

## STEP 1: Determine Scope

Ask: "What should I audit?"

Options:
1. **Whole codebase** — full review of all source code
2. **Recent changes** — everything since last release/tag or last N commits
3. **Specific module** — user specifies directory or component
4. **Specific concern** — user wants to focus on one area (security only, performance only, etc.)

---

## STEP 2: Load Project Context

Before spawning agents, gather project-specific context they'll need.

```bash
# Tech stack
cat .claude/specs/stack-config.yaml 2>/dev/null

# Component specs
ls .claude/specs/components/ 2>/dev/null

# All available specs
find .claude/specs -name "*.md" -not -path "*/archive/*" 2>/dev/null

# System map
cat .claude/specs/architecture/system-map.yaml 2>/dev/null | head -50

# Project structure
find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.swift" -o -name "*.py" -o -name "*.go" -o -name "*.rs" 2>/dev/null | head -40
```

Read relevant specs so you can include spec content in agent prompts.

---

## STEP 3: Confirm and Spawn

Explain: "This spawns 4 parallel reviewers (security, performance, test coverage, architecture). Each will review [scope]. Continue? (yes/no)"

If no, offer single-agent review focused on their primary concern.

Spawn 4 agents **in parallel** (single message, multiple Agent tool calls).

### Agent 1: Security Auditor

```
You are a security auditor reviewing a codebase for vulnerabilities.

PROJECT CONTEXT:
[include stack, framework, relevant specs]

SCOPE: [what to review]

REVIEW CHECKLIST:
- Input validation: Is all user input validated before use? Check form inputs, URL params, API request bodies, file uploads.
- Authentication/authorization: Are protected routes actually protected? Can users access resources they shouldn't?
- Injection: SQL injection (raw queries, string concatenation in queries), XSS (unsanitized HTML output, dangerouslySetInnerHTML), command injection (user input in shell commands).
- Secrets: Hardcoded API keys, tokens, passwords, connection strings in source code. Check .env handling.
- Data exposure: Are error messages leaking stack traces or internal details? Are API responses returning more data than needed?
- Dependency security: Known vulnerable packages? Outdated dependencies with CVEs?
- File operations: Path traversal risks? Unsafe file reads/writes based on user input?
- Cryptography: Weak hashing (MD5, SHA1 for passwords)? Missing HTTPS enforcement?

SKIP: Theoretical concerns without a concrete attack vector. Style preferences. Things already handled by the framework.

FORMAT each finding as:
SEVERITY: critical / high / medium
FILE: path:line
VULNERABILITY: what's exploitable
ATTACK: how an attacker would exploit it
FIX: specific code change to remediate

End with a summary count by severity.
```

### Agent 2: Performance Auditor

```
You are a performance auditor reviewing a codebase for bottlenecks and inefficiencies.

PROJECT CONTEXT:
[include stack, framework, relevant specs]

SCOPE: [what to review]

REVIEW CHECKLIST:
- Database: N+1 queries, missing indexes (queries without WHERE on indexed columns), unbounded queries (SELECT * without LIMIT), connection pool exhaustion.
- Memory: Unclosed resources (file handles, DB connections, event listeners), growing collections never cleaned, large objects held in closures.
- Rendering (frontend): Unnecessary re-renders, missing memoization on expensive computations, large component trees re-rendering on unrelated state changes, blocking renders.
- Network: Redundant API calls, missing caching, sequential requests that could be parallel, large payloads without pagination.
- Algorithms: O(n²) or worse in hot paths, repeated work that could be cached, synchronous operations blocking the event loop.
- Bundle size (frontend): Large dependencies imported for small features, missing tree shaking, dynamic imports not used for heavy routes.

SKIP: Micro-optimizations with < 10% measurable impact. Premature optimization. Things that only matter at scale we haven't reached.

FORMAT each finding as:
IMPACT: high / medium
FILE: path:line
ISSUE: what's inefficient
MEASUREMENT: how you'd confirm this is actually slow (benchmark, profiler, etc.)
FIX: specific optimization

End with a summary count by impact.
```

### Agent 3: Test Coverage Auditor

```
You are a test coverage auditor reviewing a codebase for testing gaps.

PROJECT CONTEXT:
[include stack, testing framework, relevant specs]

SCOPE: [what to review]

REVIEW CHECKLIST:
- Untested code paths: Functions or modules with no test file. Critical business logic without assertions.
- Edge cases: Null/undefined handling, empty arrays, boundary values, concurrent access, error states.
- Error paths: Are catch blocks tested? Do error handlers work? Are error messages correct?
- Integration gaps: Are components tested in isolation but not together? Are API contracts tested?
- Brittle tests: Tests coupled to implementation details (mocking internals). Tests that pass for wrong reasons. Tests that break on unrelated changes.
- Missing assertions: Tests that call functions but don't assert results. Tests that only check happy path.
- Security-relevant tests: Are auth flows tested? Are input validation rules tested? Are permission checks tested?

SKIP: 100% coverage for its own sake. Testing trivial getters/setters. Testing framework-provided functionality.

FORMAT each finding as:
PRIORITY: high / medium
FILE: path:line (or "missing test for path:line")
GAP: what's not tested
RISK: what breaks if this code has a bug and there's no test
RECOMMENDED TEST: description of what test to write

End with a summary: estimated coverage gaps by module.
```

### Agent 4: Architecture Auditor

```
You are an architecture auditor reviewing a codebase for structural issues.

PROJECT CONTEXT:
[include stack, system map, component specs, project structure]

SCOPE: [what to review]

REVIEW CHECKLIST:
- Module boundaries: Are imports crossing module boundaries inappropriately? Is one module reaching into another's internals?
- Dependency direction: Do dependencies flow in one direction (e.g., routes → services → repositories)? Any circular dependencies?
- Separation of concerns: Is business logic in the right layer? UI logic in models? Database queries in route handlers?
- Dead code: Unused exports, unreachable functions, commented-out blocks, unused dependencies in package.json.
- Consistency: Are similar things done the same way? Different error handling patterns in different modules? Multiple ways to do the same thing?
- Scalability concerns: Hardcoded limits, single points of failure, tightly coupled components that can't be independently deployed or tested.
- Documentation gaps: Are public APIs documented? Are architecture decisions recorded? Does the system map reflect current reality?
- Spec compliance: Does the code follow the patterns defined in project specs? Check against each relevant spec.

SKIP: Philosophical preferences about architecture style. Refactoring suggestions that don't solve a concrete problem.

FORMAT each finding as:
CONCERN: what's wrong structurally
FILE(S): affected paths
IMPACT: what goes wrong as the project grows or changes
FIX: specific restructuring recommendation
SPEC VIOLATION: which spec it violates (if applicable, "none" if not)

End with an architecture health summary: strengths and weaknesses.
```

---

## STEP 4: Synthesize

Wait for all 4 agents to complete. Then:

1. **Deduplicate** — same issue found by multiple reviewers (e.g., security and test coverage both flag unvalidated input)
2. **Cross-reference** — security finding + missing test for that code = higher priority
3. **Filter** — every finding must pass the "so what?" test. Remove theoretical concerns.
4. **Sort** — critical first, then high, then medium
5. **Group** — by module/component if the project has distinct components

---

## STEP 5: Report

```
AUDIT COMPLETE

Project: [name]
Scope: [what was reviewed]
Stack: [tech stack]
Reviewers: security, performance, test coverage, architecture

SUMMARY
  Security:     [X] findings (critical: X, high: X, medium: X)
  Performance:  [X] findings (high: X, medium: X)
  Test Gaps:    [X] findings (high: X, medium: X)
  Architecture: [X] findings

  Total: [N] findings — [critical: X, high: X, medium: X]

===

CRITICAL (fix immediately):

1. [SECURITY] [file:line] — [issue]
   Attack: [how it's exploited]
   Fix: [recommendation]

...

HIGH PRIORITY (fix before release):

1. [CATEGORY] [file:line] — [issue]
   Fix: [recommendation]

...

MEDIUM (address in follow-up):

1. ...

===

ARCHITECTURE HEALTH:
Strengths: [what's well-structured]
Weaknesses: [structural concerns]

SPEC COMPLIANCE:
[spec name]: [compliant / X violations found]
...

===

VERDICT: [PASS — ready for release / ISSUES — fix critical/high before release]
```

---

## STEP 6: Create Follow-up Issues

Ask: "Create GitHub issues for these findings? (yes / no / only critical+high)"

If yes, create issues using the plan skill's format:

```bash
SKILL_ACTIVE=1 gh issue create --title "fix: [finding summary]" --body "[details from audit]" --label "type/fix,priority/[severity]"
```

Group related findings into single issues where it makes sense (e.g., "3 input validation gaps in API routes" is one issue, not three).

---

## Difference from /review

| Aspect | /review | /audit |
|--------|---------|--------|
| Scope | Diff only (staged/unstaged changes) | Whole codebase or module |
| When | Before every commit | Before releases, after refactors, onboarding |
| Depth | Quick pass, 2-4 agents | Deep review, 4 agents |
| Specs | Checks against specs | Checks against specs + verifies spec compliance |
| Output | PASS/ISSUES verdict | Full report + GitHub issues |
| Token cost | Low-medium | High |
