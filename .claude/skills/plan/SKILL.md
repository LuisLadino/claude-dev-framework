---
name: plan
description: >
  Organize and plan work using GitHub. Use when: the user says "let's plan",
  "what's next", "prioritize", "add to backlog", "create an issue", "new idea",
  "future feature", "we should", "organize", "what's in the backlog", "milestone",
  or wants to capture something for later without building it now.
allowed-tools: Bash, Read
---

# Plan

You're organizing work using GitHub Issues as the system of record.

GitHub Issues aren't just for bugs. They're for:
- Ideas to explore
- Features to build
- Technical debt to address
- Things to remember
- Anything that should be tracked

---

## Modes

This skill handles several planning activities. Detect what the user wants:

### "Create an issue" / "Add to backlog" / "New idea"
→ Go to **Create Issue**

### "What's next" / "What should I work on"
→ Go to **Review Backlog**

### "Let's plan" / "Prioritize" / "Organize"
→ Go to **Organize Backlog**

### "Create a milestone" / "Plan the release"
→ Go to **Manage Milestones**

---

## Create Issue

Capture something for tracking. **Issues are the system of record for WHY work happens.**

### 0. Check Issue Scope First

Before creating a new issue, ask: **Does this have a different Definition of Done than what we're currently working on?**

**Create NEW issue when:**
- Different Definition of Done than current work
- Could be solved independently
- Different component/domain
- Would significantly expand current scope

**DON'T create new issue when:**
- Same root problem (iterate on current issue)
- Bug found while testing (that's TEST → ITERATE)
- Refinement of approach
- DoD not yet met on current issue

If working on an issue and something comes up, default to **documenting in current issue** unless it clearly has a separate DoD.

### 1. Understand the Problem

Before creating an issue, understand:
- **What problem are we solving?** Not what to build, but what's wrong or missing.
- **Why does it matter?** What's the impact of not solving it?
- **What's the context?** How did we discover this? What's the background?

If the user just says "add X feature", ask: "What problem does X solve?"

### 2. Determine Issue Type and Labels

Standard labels:
- **Type:** `type/feature`, `type/bug`, `type/chore`, `type/idea`, `type/tech-debt`
- **Priority:** `priority/high`, `priority/medium`, `priority/low`
- **Status:** `status/backlog`, `status/ready`, `status/in-progress`

### 3. Create the Issue with Full Context

**The issue body must explain the problem clearly enough that someone reading it later (including Claude in a future session) understands WHY this work matters.**

**Important:** Prefix `gh issue create` with `SKILL_ACTIVE=1` to signal that the proper workflow was followed:

```bash
SKILL_ACTIVE=1 gh issue create \
  --title "type: Short description of what changes" \
  --body "## Problem

What's wrong or missing? What triggered this?
Be specific. Include error messages, user feedback, or observations.

## Why It Matters

What's the impact? What happens if we don't fix this?
Connect to user value or system health.

## Proposed Solution

How might we solve this? (Not required for ideas/exploration)
Include trade-offs if multiple approaches exist.

## Design Thinking Phase

Starting in **Understand** / **Define** / etc.

## Tasks

- [ ] First step
- [ ] Second step" \
  --label "type/feature,priority/medium,status/backlog"
```

**Required sections:**
- **Problem** - The actual issue, not a solution masquerading as a problem
- **Why It Matters** - Stakes and impact

**Optional sections:**
- **Proposed Solution** - If approach is known
- **Design Thinking Phase** - Where this work starts in the cycle
- **Tasks** - Breakdown if scope is clear
- **Definition of Done** - What does success look like? (Should be explicit by end of DEFINE phase)

### 4. Add to Milestone (Optional)

If there's an active milestone:
```bash
gh issue edit {number} --milestone "v0.1"
```

---

## Review Backlog

Help decide what to work on next.

### 1. Show Current State

```bash
# Open issues by priority
gh issue list --label "priority/high" --state open
gh issue list --label "priority/medium" --state open

# What's in progress?
gh issue list --label "status/in-progress" --state open

# Current milestone progress
gh issue list --milestone "v0.1" --state all
```

### 2. Recommend Next Steps

Based on:
- What's high priority and ready
- What's blocking other work
- What fits the current milestone

Suggest 1-3 issues to work on next.

---

## Organize Backlog

Clean up and prioritize.

### 1. Review All Open Issues

```bash
gh issue list --state open --limit 50
```

### 2. For Each Issue, Consider

- Is the priority still accurate?
- Does it belong in a milestone?
- Is it still relevant?
- Should it be closed?

### 3. Make Updates

```bash
# Update priority
gh issue edit {number} --add-label "priority/high" --remove-label "priority/low"

# Add to milestone
gh issue edit {number} --milestone "v0.1"

# Close if no longer relevant
gh issue close {number} --reason "not planned"
```

### 4. Summarize Changes

Report what was updated.

---

## Manage Milestones

Plan releases and group work.

### 1. View Current Milestones

```bash
gh api repos/:owner/:repo/milestones --jq '.[] | "\(.title): \(.open_issues) open, \(.closed_issues) closed"'
```

### 2. Create New Milestone

```bash
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="v0.2" \
  --field description="Description of this release" \
  --field due_on="2024-04-01T00:00:00Z"
```

### 3. Move Issues to Milestone

```bash
gh issue edit {number} --milestone "v0.2"
```

---

## Quick Capture

If the user just mentions something in passing ("we should add X eventually"), quickly capture it:

```bash
SKILL_ACTIVE=1 gh issue create --title "Idea: X" --label "type/idea,status/backlog" --body "Captured from conversation. Needs refinement."
```

Then continue with whatever else was happening.

---

## Task Management (Design Thinking Tracking)

**GitHub Issues** are the system of record (persistent, survive sessions).
**Tasks** are in-session tracking of design thinking phases.

Every task should tie to a GitHub Issue. This creates traceability:
- Issue = WHY (the problem)
- Tasks = HOW (phase by phase journey)
- Changes = WHAT (the implementation)

### When Starting Work on an Issue

Create tasks for design thinking phases:

```
TaskCreate: "UNDERSTAND - Research [issue topic]"
TaskCreate: "DEFINE - Clarify requirements for #X"
TaskCreate: "IDEATE - Explore approaches for #X"
TaskCreate: "PROTOTYPE - Implement [approach]"
TaskCreate: "TEST - Verify implementation"
TaskCreate: "ITERATE - Refine based on findings"
```

### Task Flow

1. **Start with UNDERSTAND** - Create task, research the problem
2. **Move through phases** - TaskUpdate to mark complete, create next phase
3. **Go backward when needed** - Discovery in PROTOTYPE might need more UNDERSTAND
4. **Update the issue** - Document findings, decisions, discoveries

### Why This Matters

The enforce-framing hook blocks any tool use without task tracking. This isn't punishment - it's ensuring that every change is tied to a decision trail. When you look back at an issue, you can see:
- What phases we went through
- What we learned in each phase
- Why we made the choices we made

---

## Issue Lifecycle

Issues track work from idea to completion. The issue body evolves:

### When Created
- Problem and context documented
- May not have solution yet

### When Work Starts (/start-task)
- Issue moved to "In Progress"
- Branch created referencing issue number
- Issue content loaded as task context
- **Tasks created for design thinking phases**

### When PR Created
- PR body includes "Closes #X"
- PR summarizes the implementation approach

### When Merged/Closed
- **PR description becomes the implementation record**
- Future readers can see: Problem (issue) → Solution (PR)
- If closing without PR, add comment explaining resolution

**The goal:** Anyone reading a closed issue understands both the problem AND how it was solved.

---

## Maintaining Issues During Work

**Issues are the persistent record of the design thinking journey.** Conversation context gets compacted; issue comments survive.

### When to Update the Issue

Write to the issue at these trigger points:

| Trigger | What Happened | What to Write |
|---------|--------------|---------------|
| **Decision made** | Chose between options | Decision record (see template) |
| **Discovery** | Learned something significant | What we found + implications |
| **Phase transition** | Moving UNDERSTAND → DEFINE, etc. | Phase change + rationale |
| **Blocked** | Can't proceed | What's blocking + what we tried |
| **Going backward** | Need to revisit earlier phase | Why we're iterating + new questions |

### Comment Templates

**Use these formats for structured comments that future sessions can parse.**

#### Decision Record

When you make a non-obvious choice:

```markdown
## Decision: [Short title]

**Context:** What situation required a decision?
**Options considered:**
1. Option A - [brief description]
2. Option B - [brief description]
3. Option C - [brief description]

**Chosen:** Option [X]
**Rationale:** Why this option?
**Trade-offs:** What we're giving up or accepting
```

#### Discovery Log

When you learn something important:

```markdown
## Discovery: [What we found]

**Source:** Where did this come from? (code, docs, testing, conversation)
**Implication:** How does this affect our approach?
**Action:** What we're doing about it (or "No action needed - informational")
```

#### Phase Transition

When moving between design thinking phases:

```markdown
## Phase: [DEFINE] → [IDEATE]

**Completed in [DEFINE]:**
- [What we accomplished]
- [Key outputs/artifacts]

**Moving to [IDEATE] because:**
- [Why we're ready to transition]

**Questions for [IDEATE]:**
- [What we need to explore]
```

#### Iteration (Going Backward)

When returning to an earlier phase:

```markdown
## Iteration: [PROTOTYPE] → [UNDERSTAND]

**Trigger:** What caused us to go back?
**Discovery:** What we learned that invalidated assumptions
**Questions to re-examine:**
- [Question 1]
- [Question 2]
```

### Command to Add Comments

```bash
gh issue comment {number} --body "## Decision: ...

**Context:** ...
..."
```

### Why This Matters

1. **Session continuity** - Context compaction loses conversation details. Issues persist.
2. **Decision traceability** - Future you (or Claude) can see WHY choices were made.
3. **Iteration support** - When going backward, the trigger is documented.
4. **Self-correction** - Inconsistencies between issue context and code become visible.

### Example: Good vs Bad Issue Updates

**Bad (vague):**
```
Updated the hook to fix the issue.
```

**Good (actionable context):**
```
## Decision: Make Phase Evaluator async

**Context:** Phase Evaluator was blocking commits for 120+ seconds when doing research.
**Options considered:**
1. Increase timeout to 5 minutes
2. Reduce research scope
3. Make async with background worker

**Chosen:** Option 3 - async with background worker
**Rationale:** User asked "why can't we just run it in the background?" - valid point. The evaluation doesn't need to block the commit; results can be injected on next prompt.
**Trade-offs:** Results appear on next prompt instead of immediately after commit.
```

---

## Standard Labels Reference

Create these labels on new projects:

**Type:**
- `type/feature` - New functionality
- `type/bug` - Something broken
- `type/chore` - Maintenance, refactoring
- `type/idea` - Explore later
- `type/tech-debt` - Cleanup needed

**Priority:**
- `priority/high` - Do soon
- `priority/medium` - Normal
- `priority/low` - When time permits

**Status:**
- `status/backlog` - Not started
- `status/ready` - Ready to pick up
- `status/in-progress` - Being worked on
- `status/blocked` - Waiting on something
