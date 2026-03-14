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

Capture something for tracking.

### 1. Understand What to Capture

Ask if not clear:
- What's the idea/task/feature?
- Any context or details?
- Is this urgent or future?

### 2. Determine Labels

Standard labels:
- **Type:** `type/feature`, `type/bug`, `type/chore`, `type/idea`, `type/tech-debt`
- **Priority:** `priority/high`, `priority/medium`, `priority/low`
- **Status:** `status/backlog`, `status/ready`, `status/in-progress`

### 3. Create the Issue

```bash
gh issue create \
  --title "Short descriptive title" \
  --body "## Context
What this is and why it matters.

## Details
Any specific requirements or notes.

## Acceptance Criteria
- [ ] What done looks like" \
  --label "type/feature,priority/medium,status/backlog"
```

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
gh issue create --title "Idea: X" --label "type/idea,status/backlog" --body "Captured from conversation. Needs refinement."
```

Then continue with whatever else was happening.

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
