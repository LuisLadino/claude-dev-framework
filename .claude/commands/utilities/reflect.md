---
description: Analyze session data, patterns, and learnings to identify improvements. Use periodically or when prompted by awareness hooks.
---

# /reflect - Analyze and Improve

Deliberate analysis of accumulated data to identify what should change.

## When to Use

- When awareness hook prompts "Consider running /reflect"
- After a long work session
- When failures are accumulating
- When learnings.md is getting large and may need cleanup
- Periodically to evaluate the system itself

## What This Does

1. **Reads** session tracking, failures, patterns, learnings
2. **Analyzes** for actionable insights
3. **Outputs** a report with suggested changes
4. **You approve** what gets written to brain files

This is the decision-making step that closes the loop on data capture.

## Steps

### 1. Load Context Files

Get brain path from session start context (look for "Brain:").

Read these files:

```bash
# Global learnings
cat ~/.gemini/antigravity/brain/learnings.md

# Workspace-specific
cat [brain-path]/patterns.md
cat [brain-path]/decisions.md
cat [brain-path]/task.md

# Recent session tracking (last 5 sessions)
ls -t [brain-path]/sessions/*.json | head -5 | xargs -I {} cat {}

# Overview synthesized by daemon
cat [brain-path]/overview.txt
```

### 2. Analyze for Patterns

Look for:

**Repeated Failures**
- Same tool failing multiple times?
- Same type of error recurring?
- Pattern in what's breaking?

**Unused Features**
- Commands never invoked?
- MCP tools ignored?
- Voice profile loaded but not effective?

**Corrections**
- What did Luis correct?
- Is the root cause addressed?
- Should learnings.md be updated?

**Successful Patterns**
- What's working well?
- Should it be documented in patterns.md?
- Can it be made automatic?

**File Size Issues**
- Is learnings.md over 200 lines? Needs consolidation.
- Is patterns.md duplicating learnings? Needs cleanup.
- Are session files accumulating? Auto-cleanup handles this after 7 days.

### 3. Generate Report

Output a report with sections:

```markdown
## /reflect Report - [Date]

### Observations
- [What the data shows]

### Suggested Changes

#### Learnings to Add/Update
[Specific additions or consolidations for learnings.md]

#### Patterns to Document
[Technical patterns to add to patterns.md]

#### System Improvements
[Hooks, commands, or configs that should change]

#### Files to Clean Up
[Files that are too large or have redundant content]

### No Action Needed
[Areas that are working fine]
```

### 4. Get Approval

Present the report. Wait for Luis to approve which changes to make.

**Do not auto-commit changes to brain files.** This is a decision point, not automation.

### 5. Apply Approved Changes

For approved items, write to the appropriate brain files:
- `learnings.md` for behavioral corrections (APPEND or consolidate)
- `patterns.md` for technical patterns (APPEND)
- `decisions.md` for system decisions (APPEND)

If consolidating learnings.md (removing duplicates, merging related items):
1. Show the proposed consolidated version
2. Get explicit approval before replacing

## Size Thresholds

| File | Warning | Action |
|------|---------|--------|
| learnings.md | >200 lines | Consolidate related items |
| patterns.md | >150 lines | Split by category |
| session files | >50 files | Auto-cleanup handles this |
| overview.txt | >100 lines | Daemon should summarize better |

## What Goes Where

| Insight Type | Destination |
|--------------|-------------|
| "I keep doing X wrong" | learnings.md |
| "This technical approach works" | patterns.md |
| "We decided to use X because Y" | decisions.md |
| "The system should change to..." | This becomes a task |

## Example Output

```markdown
## /reflect Report - March 12, 2026

### Observations
- 3 Read failures this session (files not found)
- inject-context.js suggested /learn 4 times, was used 1 time
- learnings.md is 180 lines (approaching threshold)
- No corrections detected this session

### Suggested Changes

#### Learnings to Add/Update
None new. Existing learnings still relevant.

#### Patterns to Document
- **Session ID usage**: Claude Code provides session_id, use it instead of generating UUIDs
- **PostToolUse vs PostToolUseFailure**: PostToolUse only fires on success

#### System Improvements
- detect-pivot.js could also detect tsconfig changes
- Consider adding "files not found" count to awareness

#### Files to Clean Up
- learnings.md: 2 items about "hallucinations" could merge into 1

### No Action Needed
- Session tracking working correctly
- Command logging working correctly
- Voice profile injection working correctly
```

## Why This Matters

Data capture without analysis is just logging. This command turns observations into improvements. It's how the system learns and adapts over time.
