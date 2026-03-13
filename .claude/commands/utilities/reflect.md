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

#### Tactical Analysis (is the system running?)

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

#### Strategic Analysis (is the system achieving its purpose?)

**Methodology Adherence**
- Are we following the design thinking cycle? (Understand → Define → Ideate → Prototype → Test)
- Is teaching mode being applied? Are discipline concepts named and explained?
- Are we explaining HOW things work, not just WHAT they do?

**Goals Alignment**
- What progress toward stated goals? (CPMAI mastery, CMU application, contract work)
- Any drift from priorities?
- Are outcomes in task.md connecting to these goals?

**Outcomes Evaluation**
- Review outcomes in task.md: Were they achieved?
- Are outcomes verifiable? Can we prove they worked?
- Any outcomes that should be revisited?

**System Effectiveness**
- Is context persistence working? (Does Claude know who Luis is after compaction?)
- Are learnings preventing repeat mistakes? (Check if same corrections appear)
- Is the feedback loop closing? (Capture → Detect → Evaluate → Apply)

**Decisions Review**
- Are decisions in decisions.md still valid?
- Any that should be revisited given new information?
- Any undocumented decisions that should be captured?

#### Pattern Learning (improving triggers)

The inject-context.js hook uses regex patterns to detect context and inject reminders. These patterns are only as good as the keywords they match. To improve them, analyze how Luis actually phrases things.

**Analyze Transcripts**

Read the session transcripts (`.jsonl` files in `~/.claude/projects/`) to find:

1. **Unmatched phrases** - What did Luis say that SHOULD have triggered a pattern but didn't?
   - Look for AI discussions without CPMAI triggers firing
   - Look for learning questions without /learn suggestion
   - Look for content writing without voice profile loading

2. **Exact phrasing** - How does Luis actually ask questions?
   - Does he use "how does X work" or "explain X to me" or something else?
   - Does he say "commit this" or "let's save these changes"?
   - What idioms or shortcuts does he use?

3. **False positives** - Did patterns fire when they shouldn't?
   - Were reminders shown that weren't relevant?
   - Were commands suggested that didn't fit?

**Output Pattern Improvements**

In the report, include a section:

```markdown
#### Trigger Pattern Improvements
- **Missed triggers:** [phrases that should have matched but didn't]
- **Suggested new patterns:** [regex patterns to add to inject-context.js]
- **False positives to fix:** [patterns that matched incorrectly]
```

Example:
```markdown
#### Trigger Pattern Improvements
- **Missed trigger:** "walk me through how this works" - should trigger AI Technical Fluency
- **Suggested pattern:** `/\bwalk me through\b.*\b(how|what|why)\b/i`
- **False positive:** "build" triggered /start-task when Luis meant "npm run build"
```

### 3. Generate Report

Output a report with sections:

```markdown
## /reflect Report - [Date]

### Tactical Observations
- [What the session data shows - failures, patterns, usage]

### Strategic Observations
- [Methodology adherence, goals progress, outcomes achieved]

### Suggested Changes

#### Learnings to Add/Update
[Specific additions or consolidations for learnings.md]

#### Patterns to Document
[Technical patterns to add to patterns.md]

#### Decisions to Revisit
[Decisions that may need updating given new information]

#### Outcomes to Verify
[Outcomes claimed in task.md that should be tested]

#### System Improvements
[Hooks, commands, or configs that should change]

#### Files to Clean Up
[Files that are too large or have redundant content]

#### Trigger Pattern Improvements
[Based on transcript analysis - new patterns, missed triggers, false positives]

### Goals Progress
- [Status toward CPMAI, CMU, contract work, other stated goals]

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

### Tactical Observations
- 3 Read failures this session (files not found)
- inject-context.js suggested /learn 4 times, was used 1 time
- learnings.md is 180 lines (approaching threshold)
- No corrections detected this session

### Strategic Observations
- Teaching mode applied: 8 instances of concept naming with discipline framing
- Methodology followed: Started with understanding, defined problem before solving
- Outcome achieved: "Context persists after compaction" - verified working
- Gap: No CPMAI concepts taught this session (opportunity missed on AI project discussion)

### Suggested Changes

#### Learnings to Add/Update
None new. Existing learnings still relevant.

#### Patterns to Document
- **Session ID usage**: Claude Code provides session_id, use it instead of generating UUIDs
- **PostToolUse vs PostToolUseFailure**: PostToolUse only fires on success

#### Decisions to Revisit
- None. Recent decisions still valid.

#### Outcomes to Verify
- "Learnings auto-capture on PreCompact" - test by triggering compaction

#### System Improvements
- detect-pivot.js could also detect tsconfig changes
- Consider adding "files not found" count to awareness

#### Files to Clean Up
- learnings.md: 2 items about "hallucinations" could merge into 1

#### Trigger Pattern Improvements
- **Missed trigger:** "break this down for me" didn't suggest /learn
- **Suggested pattern:** `/\bbreak (this|it) down\b/i` for /learn command
- **Missed trigger:** "is this how it's supposed to work" didn't fire reasoning checkpoint
- **No false positives detected**

### Goals Progress
- CPMAI mastery: On track. Domains integrated into tutorship, inject-context reminders active.
- CMU application: No activity this session.
- Contract work: Portfolio site updated.

### No Action Needed
- Session tracking working correctly
- Command logging working correctly
- Voice profile injection working correctly
```

## Why This Matters

Data capture without analysis is just logging. This command turns observations into improvements. It's how the system learns and adapts over time.
