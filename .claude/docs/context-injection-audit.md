# Context Injection Audit

**Issue:** #19 - Audit and document full context injection pipeline
**Created:** 2026-03-15
**Phase:** UNDERSTAND → DEFINE

---

## Executive Summary

Claude receives context from **8 distinct injection points** across the session lifecycle. Total injected context ranges from ~1,500 lines (minimal session) to ~3,000+ lines (active session with all features triggered).

**Key findings:**
- System prompt layer has highest primacy but is never visible to hooks
- UserPromptSubmit injects context on EVERY prompt (~200-500 tokens each time)
- Methodology enforcement fires in addition to command suggestions (redundant?)
- No token budget management - context piles up without limits

---

## 1. Injection Points by Timing

```
SESSION START
│
├─ [1] System Prompt Layer (always present)
│   └─ ~/.claude/system-rules.md (250 lines)
│   └─ Survives compaction: YES (in system prompt)
│
├─ [2] CLAUDE.md Files (always loaded by Claude Code)
│   └─ CLAUDE.md (326 lines) + .claude/CLAUDE.md (101 lines)
│   └─ Survives compaction: YES (reloaded from files)
│
├─ [3] SessionStart Hook (session-context.js)
│   └─ Identity, learnings, handoff, artifacts list
│   └─ Survives compaction: NO (but handoff persists in brain)
│
├─ [4] Context Agent (spawned by spawn-context-agent.cjs)
│   └─ Project-level strategic framing
│   └─ Survives compaction: NO
│
DURING SESSION
│
├─ [5] UserPromptSubmit (inject-context.cjs) - EVERY PROMPT
│   ├─ Command suggestions (1 of 12 patterns)
│   ├─ Workflow auto-loading (/commit, /handoff, /design-thinking)
│   ├─ Reasoning checkpoints (up to 2)
│   ├─ Methodology enforcement (1 of 13 patterns)
│   ├─ Voice profile (content writing)
│   ├─ Identity context (ideation)
│   ├─ Phase evaluation (from recent commit)
│   ├─ Spec files (6 keyword triggers)
│   └─ Mandatory framing reminder (ALWAYS)
│   └─ Survives compaction: NO (re-injected each prompt)
│
├─ [6] Skill/Command Loading (when invoked)
│   └─ Full command markdown with frontmatter
│   └─ Survives compaction: NO
│
├─ [7] Stop Hooks (response enforcement)
│   ├─ check-teaching-format.cjs - blocks if Lens/Refine/Phase/Teach missing
│   ├─ enforce-framing.cjs - blocks if TaskCreate/TaskUpdate missing
│   └─ verify-before-stop.cjs - warns about debug statements
│   └─ These DON'T inject context, they BLOCK responses
│
BEFORE COMPACTION
│
└─ [8] PreCompact Hook (pre-compact.js)
    └─ Writes handoff.md and session_state.json
    └─ This is PRESERVATION, not injection
```

---

## 2. Context Source Mapping

### What Gets Injected Where

| Context | Source File | Injected By | When | Survives Compaction |
|---------|-------------|-------------|------|---------------------|
| Core methodology | `~/.claude/system-rules.md` | `--append-system-prompt` | Always | YES |
| Design thinking phases | `~/.claude/system-rules.md` | `--append-system-prompt` | Always | YES |
| Lenses (PM, UX, etc.) | `~/.claude/system-rules.md` | `--append-system-prompt` | Always | YES |
| Response format (Lens/Refine/Phase/Teach) | `~/.claude/system-rules.md` | `--append-system-prompt` | Always | YES |
| Non-negotiables | `~/.claude/system-rules.md` | `--append-system-prompt` | Always | YES |
| Project architecture | `CLAUDE.md` | Claude Code native | Always | YES |
| Framework overview | `.claude/CLAUDE.md` | Claude Code native | Always | YES |
| Luis's identity | `my-brain/CLAUDE.md` | `session-context.js` | SessionStart | NO |
| Current work/goals | `my-brain/CLAUDE.md` | `session-context.js` | SessionStart | NO |
| Previous session state | `brain/{uuid}/session_state.json` | `session-context.js` | SessionStart | NO |
| Reference artifacts list | `brain/{uuid}/*.md` | `session-context.js` | SessionStart | NO |
| Persistent learnings | `brain/learnings.md` | `session-context.js` | SessionStart | NO |
| Framework issues | `brain/framework-issues.md` | `session-context.js` | SessionStart (framework only) | NO |
| Session handoff | `brain/{uuid}/handoff.md` | `session-context.js` | SessionStart | NO |
| Command suggestions | `inject-context.cjs` logic | `inject-context.cjs` | Every prompt | NO |
| Workflow content | `.claude/skills/*/SKILL.md` | `inject-context.cjs` | On trigger | NO |
| Reasoning checkpoints | `inject-context.cjs` logic | `inject-context.cjs` | Pattern match | NO |
| Methodology enforcement | `inject-context.cjs` logic | `inject-context.cjs` | Pattern match | NO |
| Voice profile | `brain/voice-profile.md` | `inject-context.cjs` | Content writing | NO |
| Identity for ideation | `my-brain/CLAUDE.md` | `inject-context.cjs` | Ideation patterns | NO |
| Phase evaluation | `.claude/phase-evaluation.json` | `inject-context.cjs` | After commits | NO |
| Spec files | `.claude/specs/*.md` | `inject-context.cjs` | Keyword triggers | NO |
| Framing reminder | `inject-context.cjs` logic | `inject-context.cjs` | ALWAYS | NO |

### What Gets Written Where

| Data | Written By | When | Destination |
|------|------------|------|-------------|
| Tool calls | `tool-tracker.cjs` | PostToolUse | `brain/tracking/sessions/{id}.json` |
| File changes | `track-changes.cjs` | PostToolUse (Edit/Write) | `brain/tracking/sessions/{id}.json` |
| Commands | `command-log.cjs` | PostToolUse (Bash) | `brain/tracking/sessions/{id}.json` |
| Spec reads flag | `track-spec-reads.cjs` | PostToolUse (Read) | `.claude/session-state.json` |
| Subagent lifecycle | `subagent-tracker.cjs` | SubagentStart/Stop | `brain/tracking/sessions/{id}.json` |
| Session handoff | `pre-compact.js` | PreCompact | `brain/{uuid}/handoff.md` |
| Session state | `pre-compact.js` | PreCompact | `brain/{uuid}/session_state.json` |

---

## 3. Token Budget Analysis

### Estimated Token Counts

**Session Start (one-time):**

| Source | Lines | Est. Tokens |
|--------|-------|-------------|
| system-rules.md | 250 | ~2,000 |
| CLAUDE.md (root) | 326 | ~2,600 |
| .claude/CLAUDE.md | 101 | ~800 |
| session-context.js output | ~100 | ~800 |
| **Total SessionStart** | ~777 | **~6,200** |

**Per-Prompt (UserPromptSubmit):**

| Injection | Lines | Est. Tokens | Condition |
|-----------|-------|-------------|-----------|
| Command suggestion | ~10 | ~80 | 1 of 12 patterns match |
| Workflow auto-load | ~50-100 | ~400-800 | commit/handoff/design-thinking trigger |
| Reasoning checkpoints | ~5-10 | ~40-80 | Pattern match (max 2) |
| Methodology enforcement | ~20-30 | ~160-240 | 1 of 13 patterns match |
| Voice profile | ~30 | ~240 | Content writing detected |
| Identity context | ~20 | ~160 | Ideation detected |
| Framing reminder | ~30 | ~240 | ALWAYS |
| **Typical prompt** | ~60-100 | **~480-800** |
| **Heavy prompt** | ~200+ | **~1,600+** |

**Per-Skill Invocation:**

| Skill | Lines | Est. Tokens |
|-------|-------|-------------|
| /commit | ~80 | ~640 |
| /start-task | ~150 | ~1,200 |
| /add-feature | ~200 | ~1,600 |
| /plan | ~100 | ~800 |
| /handoff | ~60 | ~480 |

### Cumulative Context Growth

```
Session Start:      ~6,200 tokens
After 5 prompts:    ~6,200 + (5 × 600) = ~9,200 tokens
After 10 prompts:   ~6,200 + (10 × 600) = ~12,200 tokens
After 20 prompts:   ~6,200 + (20 × 600) = ~18,200 tokens
+ Skill invocations: +800 to +1,600 each
```

**Problem:** Context grows linearly with prompts. No mechanism to dedupe or summarize injected context.

---

## 4. What Survives Compaction

### Definitely Survives (System Prompt + Files)

| Context | Why |
|---------|-----|
| system-rules.md | In system prompt, not in conversation |
| CLAUDE.md files | Auto-loaded by Claude Code after compaction |

### Survives via Re-Injection (SessionStart)

| Context | How |
|---------|-----|
| Identity/goals | session-context.js re-runs |
| Handoff | session-context.js reads brain/{uuid}/handoff.md |
| Learnings | session-context.js reads brain/learnings.md |
| Previous session state | session-context.js reads brain/{uuid}/session_state.json |

### Does NOT Survive

| Context | Why |
|---------|-----|
| UserPromptSubmit injections | Conversation context, gets summarized |
| Skill content | Was in conversation, gets summarized |
| Reasoning checkpoints | Was in conversation, gets summarized |
| Per-prompt methodology reminders | Was in conversation, gets summarized |

### What Gets Preserved for Next Session

| Data | Written By | Read By |
|------|------------|---------|
| handoff.md | pre-compact.js | session-context.js |
| session_state.json | pre-compact.js | session-context.js |
| tracking/sessions/{id}.json | Various trackers | awareness.cjs, /analyze |

---

## 5. Redundancies and Issues

### Issue: Methodology Loaded Multiple Times

The design thinking methodology appears in:
1. `system-rules.md` (system prompt) - 250 lines
2. `session-context.js` output - via learnings
3. `inject-context.cjs` - methodology enforcement reminders
4. `/design-thinking` skill content - when auto-loaded

**Recommendation:** Trust the system prompt layer. Remove methodology reminders from inject-context.cjs.

### Issue: Framing Reminder ALWAYS Fires

`inject-context.cjs` injects a 30-line framing reminder on EVERY prompt, even simple ones.

```javascript
const interactionReminder = `[MANDATORY FRAMING]

**Before responding to ANY non-trivial request:**

1. **Launch Context Agent**...
2. **Launch Task Agent:**...
3. **Then respond**...
```

**Problem:**
- This is ~240 tokens per prompt, regardless of need
- The Stop hooks (check-teaching-format.cjs, enforce-framing.cjs) already enforce this
- Redundant with system-rules.md methodology

**Recommendation:** Remove the mandatory framing reminder from inject-context.cjs. The Stop hooks enforce behavior; the system prompt defines methodology.

### Issue: No Escape Hatches Creates Overhead

`check-teaching-format.cjs` blocks ALL responses without Lens/Refine/Phase/Teach format. This includes:
- Simple "yes" or "no" answers
- Quick clarifications
- Error messages

**Trade-off:** Consistency vs. overhead. Current decision is "no escape hatches" per Luis's feedback.

### Issue: inject-context.cjs is 1,239 Lines

This single file handles:
- 12 command routing patterns
- 7 reasoning checkpoint patterns
- 13 methodology enforcement patterns
- Content writing detection
- Ideation detection
- Capture trigger detection
- Voice profile loading
- Identity context loading
- Phase evaluation consumption
- 6 spec file triggers
- Session tracking

**Recommendation:** Consider splitting into focused modules:
- `route-commands.cjs` - Command suggestions
- `inject-methodology.cjs` - Methodology reminders (or remove)
- `inject-voice.cjs` - Voice/identity for writing
- `inject-specs.cjs` - Spec file triggers

---

## 6. Recommendations

### Short-term Fixes

1. **Remove mandatory framing reminder** from inject-context.cjs
   - Already enforced by Stop hooks
   - Saves ~240 tokens per prompt

2. **Reduce methodology enforcement** in inject-context.cjs
   - System prompt already has full methodology
   - Keep only CPMAI-specific reminders (domain expertise)

3. **Add deduplication** for spec injections
   - Don't inject same spec twice in session
   - Track in session-state.json

### Medium-term Improvements

4. **Split inject-context.cjs** into focused modules
   - Easier to maintain and debug
   - Clear responsibility per file

5. **Add token budget tracking**
   - Log estimated tokens per injection
   - Alert when cumulative context exceeds threshold

6. **Optimize handoff.md content**
   - PreCompact writes minimal context
   - Make it more useful for session resumption

### Long-term Architecture

7. **Tiered context system**
   - Tier 1: System prompt (always present, highest primacy)
   - Tier 2: Session start (identity, state)
   - Tier 3: On-demand (skills, specs, when invoked)
   - Remove Tier 3 from automatic injection

8. **Context window management**
   - Track cumulative context size
   - Implement sliding window for per-prompt injections
   - Summarize older injections rather than repeat

---

## 7. Diagram: Context Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLAUDE SESSION                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SYSTEM PROMPT LAYER (Highest Primacy)                                   │
│ ~/.claude/system-rules.md                                               │
│ - Methodology, lenses, teaching mode, non-negotiables                   │
│ - Response format (Lens/Refine/Phase/Teach)                            │
│ Tokens: ~2,000 | Survives: YES                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CLAUDE.md FILES (Auto-loaded)                                           │
│ CLAUDE.md + .claude/CLAUDE.md                                          │
│ - Project context, architecture, workflows                              │
│ Tokens: ~3,400 | Survives: YES                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SESSIONSTART HOOK                                                        │
│ session-context.js                                                       │
│ - Identity, goals, learnings, handoff, artifacts                        │
│ Tokens: ~800 | Survives: NO (but handoff persists)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ USERPROMPTSUBMIT HOOK (Every Prompt)                                    │
│ inject-context.cjs                                                       │
│ - Command suggestions, methodology, voice profile, framing reminder     │
│ Tokens: ~480-800 per prompt | Survives: NO                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ TOOL USE                                                                 │
│ PreToolUse: enforce-specs, enforce-skills, block-dangerous              │
│ PostToolUse: tracking, phase-evaluator spawn                            │
│ Mostly blocking/tracking, minimal context injection                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STOP HOOKS (Enforcement)                                                 │
│ check-teaching-format.cjs, enforce-framing.cjs                          │
│ - Block responses that don't meet requirements                          │
│ No injection, only blocking                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PRECOMPACT HOOK (Before Compaction)                                      │
│ pre-compact.js                                                           │
│ - Writes handoff.md, session_state.json                                 │
│ Preservation for next session, not injection                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Next Steps

1. [ ] Review with Luis - validate findings, agree on priorities
2. [ ] Implement short-term fixes (remove redundant injections)
3. [ ] Track actual token usage for a few sessions
4. [ ] Consider splitting inject-context.cjs
5. [ ] Design tiered context architecture
