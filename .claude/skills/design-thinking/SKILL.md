---
name: design-thinking
description: >
  Design thinking task orchestration. Use when: session starts, user says "let's start",
  "new problem", "new task", "what are we working on", or any substantive work begins.
  This is the operating system for all interactions - create 6 tasks and move through them.
allowed-tools: TaskCreate, TaskUpdate, TaskList, TaskGet, Bash, Read
---

# Design Thinking Flow

You're starting or continuing work using design thinking as the operating system.

**Design thinking is not a feature you toggle - it's always on.** Every substantive interaction moves through this rhythm.

---

## The 6 Tasks (Create These)

At session start or when beginning substantive work, create these 6 tasks:

```
1. UNDERSTAND - Research the problem. What's actually happening?
2. DEFINE - Name the problem precisely. Not symptoms, root causes.
3. IDEATE - Generate approaches. What are the options?
4. PROTOTYPE - Build something concrete. Make it real enough to test.
5. TEST - Does it work? What did we learn?
6. ITERATE - Back to any phase based on what you learned.
```

### How to Create Them

Use TaskCreate for each:

```
TaskCreate(
  subject: "UNDERSTAND - [brief problem description]",
  description: "Research and understand the problem space.",
  activeForm: "Understanding the problem"
)
```

Then repeat for DEFINE, IDEATE, PROTOTYPE, TEST, ITERATE.

Set UNDERSTAND to `in_progress` initially.

---

## The Rhythm (Not Linear)

**Movement is non-linear:**

- **Go back when:** Wrong problem discovered, new insight emerges, approach fails
- **Jump ahead when:** Need to build to think, obvious solution needs validation
- Iteration is NOT failure - it's the rhythm working

**The groan zone:** The uncomfortable space between diverging and converging. When multiple options exist without clear selection - this is normal and valuable. Don't escape it by removing requirements or making premature decisions.

---

## Moving Between Tasks

Use TaskUpdate to change status:

```
TaskUpdate(taskId: "1", status: "completed")
TaskUpdate(taskId: "2", status: "in_progress")
```

**Always have ONE task in_progress.** This grounds you in where we are.

**Going backward is normal:**
- In IDEATE but realize we don't understand the problem? → Back to UNDERSTAND
- In TEST and it fails? → Maybe back to IDEATE or PROTOTYPE

---

## If Working on a GitHub Issue

When working on a specific issue, note it in the task descriptions:

```
TaskUpdate(
  taskId: "1",
  description: "UNDERSTAND for Issue #13: Claude ignores task tracker. Research the problem and existing implementation attempts."
)
```

The GitHub issue is the **persistent record**. Tasks are **session working memory**.

**At key milestones, update the GitHub issue.** See plan skill's "Maintaining Issues During Work" for:
- When to update (decisions, discoveries, phase transitions)
- Comment templates (Decision Record, Discovery Log, Phase Transition)

---

## Trivial vs. Substantive

**Substantive work** (use tasks):
- Building/fixing something
- Researching a problem
- Planning a feature
- Debugging
- Any multi-step problem solving

**Trivial** (tasks exist but don't need updating):
- Quick questions
- Simple clarifications
- Yes/no answers

The tasks are always there. For trivial interactions, just answer without ceremony.

---

## Definition of Done

Each task has an implicit DoD:

| Task | Done When |
|------|-----------|
| UNDERSTAND | We know what's actually happening, have researched existing work |
| DEFINE | Problem is named precisely, root cause identified, scope clear |
| IDEATE | Multiple approaches generated, trade-offs identified |
| PROTOTYPE | Something concrete exists that can be tested |
| TEST | We know if it works and why/why not |
| ITERATE | Refinements made based on test results |

The overall work is done when the Definition of Done for the **issue/problem** is met - not just when all tasks are completed.

---

## Enforcement

This skill documents the flow. Enforcement comes from:
1. **Stop hook** - Checks if tasks were used for substantive work
2. **Task reminders** - System prompts about unused task tools
3. **This skill** - Natural language trigger to establish the flow

---

## Quick Start

If starting fresh:

1. Create 6 tasks (UNDERSTAND through ITERATE)
2. Mark UNDERSTAND as in_progress
3. Begin researching/understanding the problem
4. Move through tasks as work progresses
5. Update GitHub issue with discoveries/decisions (see plan skill's "Maintaining Issues During Work")

If resuming:
1. Check TaskList for existing tasks
2. Find which is in_progress
3. Continue from there
