# Session Start Data Inventory

**Purpose:** Exact listing of EVERY piece of data Claude receives at session start, with sizes and duplication analysis.

**Last updated:** 2026-03-16
**Based on:** session-start-literal.md (actual capture from session)

---

## Summary

| Source | Lines | Est. Tokens | Contains |
|--------|-------|-------------|----------|
| session-context.js | 160 | ~1,500 | Identity, handoffs, learnings, issues |
| CLAUDE.md (root) | 350 | ~3,500 | Full project documentation |
| .claude/CLAUDE.md | 100 | ~1,000 | Project rules and workflow |
| Other hooks | 10 | ~50 | Success messages, triggers |
| **TOTAL** | **620** | **~6,000** | Before you say anything |

---

## Detailed Breakdown

### Source 1: session-context.js Output (Lines 1-160)

**Appears as:** `<system-reminder>SessionStart:startup hook success: [ANTIGRAVITY SESSION CONTEXT]`

| Section | Lines | Duplicated? | Notes |
|---------|-------|-------------|-------|
| User identity | 5 | No | Name, background |
| Current work | 3 | No | Contract work, applications |
| Projects list | 5 | Yes (also in CLAUDE.md) | Lists all projects |
| How Luis thinks | 6 | No | Approach, values, mindset |
| How to work with Luis | 5 | No | Preferences |
| System Architecture | 15 | Yes (fully in CLAUDE.md) | Exact same content |
| Current workspace | 2 | No | Path + brain UUID |
| Previous Session | 8 | No | Accomplishments, issues, patterns |
| Reference Artifacts | 14 | **WASTE** | Just lists file paths, doesn't read them |
| [LEARNINGS] | 45 | No | Pattern-matching fixes, session learnings |
| [FRAMEWORK ISSUES] | 15 | No | Known bugs and workarounds |
| [HANDOFF] | 35 | No | What previous session was doing |

**Problems identified:**
- System Architecture section is EXACT DUPLICATE of content in CLAUDE.md
- Reference Artifacts lists 14 file paths but doesn't read any - just noise
- Learnings section is long (45 lines) - should be condensed to top 5

### Source 2: Hook Success Messages (Lines 162-168)

**Appears as:** `<system-reminder>SessionStart:startup hook success: Success</system-reminder>`

| Section | Lines | Notes |
|---------|-------|-------|
| session-init success | 1 | Just "Success" |
| UserPromptSubmit success | 1 | Just "Success" |

**Problems identified:**
- These add no value - just confirmations that hooks ran
- Could be suppressed or combined

### Source 3: Context Agent Trigger (Lines 166-168)

**Appears as:** `<system-reminder>[CONTEXT AGENT] Spawn context-agent...`

| Section | Lines | Notes |
|---------|-------|-------|
| Agent trigger | 1 | Instruction to spawn context-agent |

**Status:** This is the new simplified hook output. Functional.

### Source 4: CLAUDE.md Content (Lines 170-611)

**Appears as:** `<system-reminder>As you answer the user's questions, you can use the following context:`

This is the BIG problem area.

#### Root CLAUDE.md (Lines 175-503)

| Section | Lines | Duplicated? | Actually Needed at Start? |
|---------|-------|-------------|---------------------------|
| Purpose | 10 | No | Maybe (motivation) |
| Architecture Overview | 40 | Yes (in session-context.js) | No |
| Three Layers | 20 | Yes | No |
| Data Flow | 5 | Yes | No |
| Feedback Loop | 5 | Yes | No |
| Brain Structure | 20 | Yes | No |
| System Documentation | 10 | No | No (on-demand) |
| What This Is | 10 | No | Maybe |
| Key Directories | 25 | No | No (on-demand) |
| Slash Commands table | 25 | Partial (in .claude/CLAUDE.md) | No |
| How Framework Works | 30 | Partial | No |
| Specs System | 20 | Partial | No |
| Command Frontmatter | 10 | No | No |
| Hooks System | 80 | Yes (documented elsewhere) | No |
| When Working Here | 30 | No | Maybe |
| Related Files | 15 | No | No |
| Downstream Projects | 10 | No | No |

**Problems identified:**
- 80 lines of hooks documentation that's duplicated in specs
- 40+ lines of architecture that's in session-context.js
- Most of this is REFERENCE DOCUMENTATION, not rules

#### .claude/CLAUDE.md (Lines 505-611)

| Section | Lines | Duplicated? | Actually Needed at Start? |
|---------|-------|-------------|---------------------------|
| Rules | 5 | No | **YES** |
| Framework vs Project Files | 20 | Partial | **YES** |
| Development Workflow | 15 | Partial | **YES** |
| Specs | 10 | Partial | Maybe |
| Hooks | 15 | Yes (everywhere) | No |
| Skills | 20 | No | **YES** |

**Problems identified:**
- This file is better - more rules, less documentation
- Still has 15 lines of hooks info that's elsewhere

---

## Duplication Analysis

### Content That Appears Multiple Times

| Content | Appears In | Times | Action |
|---------|------------|-------|--------|
| System Architecture diagram | session-context.js, CLAUDE.md | 2 | Remove from session-context.js |
| Three Layers explanation | session-context.js, CLAUDE.md | 2 | Remove from session-context.js |
| Hooks documentation | CLAUDE.md, .claude/CLAUDE.md, specs | 3 | Keep only in specs |
| Commands list | CLAUDE.md, .claude/CLAUDE.md | 2 | Keep only in .claude/CLAUDE.md |
| Brain structure | session-context.js, CLAUDE.md | 2 | Remove from session-context.js |
| Data flow | session-context.js, CLAUDE.md | 2 | Remove from session-context.js |

### Estimated Waste

| Type | Est. Lines | Est. Tokens |
|------|------------|-------------|
| Duplicated architecture | 60 | 600 |
| Duplicated hooks docs | 80 | 800 |
| Reference artifacts (unread) | 14 | 140 |
| Hook success messages | 3 | 30 |
| Documentation (not rules) | 200 | 2000 |
| **TOTAL WASTE** | **~357** | **~3,570** |

That's **over 50% waste**.

---

## Order of Injection

```
1. session-context.js runs
   └── Outputs: [ANTIGRAVITY SESSION CONTEXT] block
       └── Contains: identity, previous session, learnings, issues, handoff

2. session-init.cjs runs
   └── Outputs: "Success" (useless)

3. spawn-context-agent.cjs runs
   └── Outputs: "[CONTEXT AGENT] Spawn..." trigger

4. Claude Code loads CLAUDE.md files
   └── Wraps in: <system-reminder>As you answer the user's questions...
   └── Loads: CLAUDE.md (root) first
   └── Loads: .claude/CLAUDE.md second

5. User's first prompt added

ALL OF THIS before Claude sees your actual question.
```

---

## What's Actually Needed at Session Start

### Must Have (Every Session)
- Who Luis is (2-3 lines)
- Current task/project (if any)
- Top 3-5 learnings
- Critical blockers (if any)
- Rules (from .claude/CLAUDE.md)

### Nice to Have (Contextual)
- Previous session handoff (if resuming work)
- Framework issues (if working on framework)

### Load On-Demand (Not at Start)
- Full architecture documentation
- Hooks system details
- Commands reference
- Specs documentation
- Full learnings history
- All handoff file contents

---

## Proposed Lean Session Context

**Target:** ~100 lines, ~1000 tokens

```
[SESSION CONTEXT]

User: Luis Ladino
Goal: AI product roles
Current: Framework development (claude-dev-framework)

RULES:
- Verify edits by reading file after
- Show proof: file path and line for claims
- Check context7 before claiming patterns

TOP LEARNINGS:
1. Pattern-matching vs thinking - verify, don't guess
2. Diagnostic avoidance - diagnose before removing
3. Research before claiming limitations

CURRENT TASK: [from GitHub issue or handoff]

BLOCKERS: [if any]

For detailed context, spawn context-agent or read relevant files.
```

That's ~30 lines vs ~620 lines. **95% reduction**.

---

## Files to Modify

| File | Change |
|------|--------|
| `session-context.js` | Remove architecture, summarize handoffs, condense learnings |
| `CLAUDE.md` (root) | Move documentation to separate file, keep only essential |
| `.claude/CLAUDE.md` | Keep - this is already rules-focused |
| Issue #28 | Track this cleanup work |

---

*This is the audit. Use it to guide cleanup in issue #28.*
