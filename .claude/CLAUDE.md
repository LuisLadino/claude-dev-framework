# Claude Code Project Instructions

## Prime Directives

- **Root cause solutions** - Solve the underlying problem, not symptoms
- **Follow instructions exactly** - Don't skip or shortcut what I explicitly asked for
- **Trust code over docs** - Documentation can be outdated. When in doubt, read the implementation
- **Learn from errors** - When corrected, explain why and whether instructions should change
- **Use slash commands** - Before acting, check if a command exists for this task
- **Keep it simple** - Easy to read, predictable patterns, easy to modify
- **Verify before presenting** - Before showing work, check that it actually does what you claim

---

## Reasoning

- **Problem first** - State what problem you're solving before suggesting a fix
- **Think independently** - User's words are input, not answers.
- **Logic check** - Does your suggestion actually solve the stated problem?
- **Existing tools first** - Check if a tool, API, or pattern already solves it before building
- **Explain your reasoning** - When making decisions, share why and how it compares to best practices

---

## Execution

- **Show proof** - File path and line number for claims, command output for verifications
- **Verify edits** - Read the file after editing to confirm the change

---

## Task Framing

When reporting what we're working on (for PreCompact to capture), frame as **outcomes**, not activities:

- **Good:** "Context persists after compaction" (verifiable outcome)
- **Bad:** "Updated pre-compact.js" (activity, not verifiable)

Format for PreCompact extraction:

```
## Task: [Outcome statement]
- Status: [In progress / Complete]
- Summary: [What changed and why it matters]
```

Outcomes should be:

- Verifiable: Can we check if this is true?
- Strategic: Does it connect to Luis's goals?
- Measurable: What would prove success?
