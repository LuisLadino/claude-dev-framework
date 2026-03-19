---
name: review
description: >
  Pre-commit code review using parallel agents. Use when: the user says
  "review this", "review the changes", "check the code", "code review",
  "review before commit", or when work is done and needs quality verification
  before committing. Focused on the diff, not the whole codebase.
  For full codebase audits, use /audit instead.
allowed-tools: Read, Bash, Grep, Glob, Agent
---

# Review

You're reviewing code changes before they get committed. This is a focused, diff-based review — not a full codebase audit.

**This skill spawns parallel review agents. Each agent focuses on one quality dimension. You synthesize their findings.**

---

## Step 1: Get the Diff

```bash
# What's staged?
git diff --staged --stat

# What's unstaged?
git diff --stat

# Full diff content
git diff --staged
git diff
```

If nothing is staged or changed, say so and stop.

**Assess scope:** Count files changed and lines modified. This determines how many agents to spawn.

---

## Step 2: Load Project Context

```bash
# Read stack config for tech context
cat .claude/specs/stack-config.yaml 2>/dev/null

# Read component specs for changed areas
ls .claude/specs/components/ 2>/dev/null
```

Read any component specs that apply to the files being changed.

---

## Step 3: Spawn Review Agents

Spawn agents **in parallel** (single message, multiple Agent tool calls).

**Scale to scope:**
- Small diff (1-3 files, < 100 lines): 2 agents (security + patterns)
- Medium diff (4-10 files, 100-500 lines): 3 agents (security + performance + patterns)
- Large diff (10+ files, 500+ lines): 4 agents (security + performance + patterns + architecture)

### Agent: Security Reviewer

```
Review this diff for security issues. Focus ONLY on production-risk findings.

[paste the diff]

Check for:
- Input validation gaps (user input reaching DB queries, file paths, commands)
- Authentication/authorization holes
- Secrets or credentials in code
- Injection vulnerabilities (SQL, XSS, command injection)
- Unsafe deserialization or file operations
- Exposed error details that leak internals

SKIP: theoretical concerns, best-practice suggestions, style issues.

Every finding MUST pass the "so what?" test — could this actually cause harm in production?

Report format:
SEVERITY: critical/high/medium
FILE: path:line
ISSUE: what's wrong
FIX: how to fix it
```

### Agent: Performance Reviewer

```
Review this diff for performance issues. Focus ONLY on measurable impact.

[paste the diff]

Check for:
- N+1 queries or unnecessary DB calls
- Blocking operations in async contexts
- Memory leaks (unclosed resources, growing collections)
- Unnecessary re-renders or re-computations
- Missing pagination on unbounded queries
- Large synchronous operations that should be async

SKIP: micro-optimizations (< 10% impact), theoretical bottlenecks, premature optimization.

Every finding MUST have measurable impact. "This could be slow" is not enough — explain WHY and WHEN.

Report format:
IMPACT: high/medium
FILE: path:line
ISSUE: what's wrong
FIX: how to fix it
```

### Agent: Patterns Reviewer

```
Review this diff against project conventions. Focus on consistency and correctness.

[paste the diff]

[include relevant spec content or spec file paths]

Check for:
- Violations of project specs (naming, structure, patterns)
- Error handling gaps (missing try/catch, unhandled promise rejections)
- Type safety issues (any types, missing null checks)
- Dead code or unused imports introduced
- Test coverage gaps for new logic
- Documentation gaps for public APIs

SKIP: style preferences not in specs, minor formatting, comments on obvious code.

Report format:
FILE: path:line
ISSUE: what's wrong
SPEC: which spec it violates (if applicable)
FIX: how to fix it
```

### Agent: Architecture Reviewer (large diffs only)

```
Review this diff for architectural concerns. Focus on design decisions.

[paste the diff]

Check for:
- New dependencies that should be evaluated
- Module boundary violations (importing from internals of another module)
- Circular dependencies introduced
- Responsibilities in the wrong layer (business logic in routes, UI logic in models)
- Changes that should have updated the system map

SKIP: philosophical disagreements, alternative approaches that aren't better.

Report format:
FILE: path:line
CONCERN: what's wrong
IMPACT: what breaks or degrades if this ships
FIX: how to fix it
```

---

## Step 4: Synthesize

Wait for all agents to complete. Then:

1. **Deduplicate** — remove findings that overlap across agents
2. **Filter** — drop anything that doesn't pass the "so what?" test
3. **Sort** — critical/high first, then medium
4. **Count** — tally findings by category

---

## Step 5: Report

```
REVIEW COMPLETE

Scope: [X files, Y lines changed]
Reviewers: [security, performance, patterns, architecture]

Findings: [N total] — [critical: X, high: X, medium: X]

---

CRITICAL/HIGH:
1. [FILE:LINE] [category] — [issue]
   Fix: [recommendation]

2. ...

MEDIUM:
1. ...

---

CLEAN AREAS:
- [category]: No issues found

VERDICT: [PASS — safe to commit / ISSUES — fix critical/high before committing]
```

---

## Step 6: Next Steps

If PASS: Proceed to `/commit`.

If ISSUES:
- Fix critical and high findings
- Run `/review` again after fixes to verify
- Medium findings can be addressed in follow-up commits

---

## Notes

- This reviews the DIFF, not the whole codebase. For full audits, use `/audit`.
- Each agent runs in a fresh context with project awareness (via subagent-context hook).
- Agents are told to skip noise. If a finding is theoretical or style-only, it shouldn't appear.
- The "so what?" test: every finding must answer "what happens in production if this ships?"
