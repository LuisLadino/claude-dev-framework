---
name: add-feature
description: >
  Plan a complex feature before building. Use when: the user says "plan",
  "design", "break down", "complex feature", "needs planning", "figure out
  how to build", "architect", or describes something that needs multiple
  components, design decisions, or would benefit from thinking before coding.
allowed-tools: Read, Grep, Glob, Bash
---

# Add Feature (Planning)

You're planning a feature before building it. This is a PLANNING step, not execution.

Use this when a feature is complex enough that jumping straight to code would be a mistake.

---

## When to Use This vs Start Task

**Use add-feature when:**
- Multiple components needed
- Design decisions to make
- Unclear how pieces fit together
- Would benefit from breaking down first

**Use start-task when:**
- Clear what needs to be built
- Single component or well-defined change
- Requirements are understood

---

## What to Do

### 1. Understand What They Want

Ask: "Describe the feature you want to build."

Listen for:
- What problem it solves
- Who uses it
- What success looks like

### 2. Load Context

Read `.claude/specs/stack-config.yaml` to understand the tech stack.

Search the codebase for related patterns:
```bash
# Find similar components
# Find related functionality
```

### 3. Break It Down

Identify the pieces:
- What components are needed?
- What's the data flow?
- What are the dependencies between pieces?
- What should be built first?

### 4. Present the Plan

Show:
- The pieces identified
- Suggested order of implementation
- Key decisions to make
- Risks or unknowns

Ask: "Does this breakdown make sense? Anything to add or change?"

### 5. Create GitHub Issues (Optional)

If the user wants to track in GitHub:

```bash
gh issue create --title "Part 1: description" --body "Details..."
```

Create one issue per logical piece, or one parent issue with a checklist.

### 6. Hand Off to Execution

Once the plan is approved:

"Ready to start building? Pick which piece to work on first."

Then follow the start-task workflow for each piece.

---

## Output

This skill produces:
- A clear breakdown of what needs to be built
- Optionally: GitHub issues for tracking
- Understanding of the approach before coding starts

It does NOT produce:
- Actual code
- PRD documents (unless specifically requested)
- Task files in `.claude/tasks/`

Keep it simple. Plan, then build.
