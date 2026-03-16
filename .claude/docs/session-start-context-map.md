# Session Start Context Map

**Purpose:** Show exactly what Claude receives at session start and where each piece comes from.

---

## Overview

At session start, Claude receives context from **4 sources** in this order:

```
1. System Prompt Layer     → ~/.claude/system-rules.md (via --append-system-prompt)
2. CLAUDE.md Files         → CLAUDE.md + .claude/CLAUDE.md (Claude Code native)
3. SessionStart Hook       → ~/.gemini/antigravity/scripts/session-context.js
4. Context Agent           → .claude/hooks/context/spawn-context-agent.cjs (BROKEN)
```

---

## Source 1: System Prompt Layer

**Trigger:** `--append-system-prompt-file ~/.claude/system-rules.md` in your `cc` alias
**File:** `~/.claude/system-rules.md`
**When:** Always, before conversation starts
**Survives compaction:** YES (in system prompt, not conversation)

This is defined in your `.zshrc`:
```bash
alias cc="claude --dangerously-skip-permissions --append-system-prompt-file ~/.claude/system-rules.md"
```

**Contains:**
- Core methodology (design thinking as operating system)
- Lenses (PM, UX, Engineering, etc.)
- Teaching mode requirements
- Required response format (Lens/Refine/Phase/Teach)
- Non-negotiables
- Task management instructions

**You don't see this in `<system-reminder>` tags** - it's in the system prompt itself, which is invisible to hooks.

---

## Source 2: CLAUDE.md Files

**Trigger:** Claude Code automatically loads these
**Files:**
- `CLAUDE.md` (project root)
- `.claude/CLAUDE.md` (in .claude directory)
**When:** Always, at session start
**Survives compaction:** YES (reloaded from files)

**CRITICAL:** These are loaded as **USER MESSAGES**, not system prompt. This means they're context Claude reads, not enforced configuration. They have less "authority" than you might think.

**Appears as:**
```
<system-reminder>
As you answer the user's questions, you can use the following context:
# claudeMd
Contents of /path/to/CLAUDE.md (project instructions, checked into the codebase):
[content]
</system-reminder>
```

**Contains:**
- Project architecture and purpose (DUPLICATED in session-context.js)
- Framework overview
- Slash commands documentation
- Hooks system documentation (DUPLICATED in specs)
- Development workflow
- Rules for working in this project

**Problem:** ~350 lines of content, much of it duplicated or documentation that should be on-demand. See `session-start-inventory.md` for full analysis.

---

## Source 3: SessionStart Hook (ANTIGRAVITY SESSION CONTEXT)

**Trigger:** `SessionStart` event in `~/.claude/settings.json`
**Script:** `~/.gemini/antigravity/scripts/session-context.js`
**When:** Once at session start
**Survives compaction:** NO (but writes to brain for next session)

**Appears as:**
```
<system-reminder>
SessionStart:startup hook success: [ANTIGRAVITY SESSION CONTEXT]
...content...
</system-reminder>
```

### Where session-context.js Gets Its Data

| Section in Output | Source File | Path |
|-------------------|-------------|------|
| `User: Luis Ladino` | my-brain/CLAUDE.md | `~/Repositories/Personal/my-brain/CLAUDE.md` |
| `Background:` | my-brain/CLAUDE.md | Same file, "Background" section |
| `Current work:` | my-brain/CLAUDE.md | Same file, "Current work" section |
| `In progress:` | my-brain/CLAUDE.md | Same file |
| `Goal:` | my-brain/CLAUDE.md | Same file |
| `Projects:` | my-brain/CLAUDE.md | Same file, "Projects" section |
| `How Luis thinks:` | my-brain/CLAUDE.md | Same file |
| `How to work with Luis:` | my-brain/CLAUDE.md | Same file |
| `System Architecture:` | my-brain/CLAUDE.md | Same file |
| `Current workspace:` | Computed | `process.cwd()` |
| `Brain:` | Computed | Workspace UUID lookup |
| `Previous Session:` | session_state.json | `~/.gemini/antigravity/brain/{uuid}/session_state.json` |
| `Reference Artifacts:` | Directory listing | `~/.gemini/antigravity/brain/{uuid}/handoffs/*.md` |
| `[LEARNINGS]` | learnings.md | `~/.gemini/antigravity/brain/learnings.md` |
| `[FRAMEWORK ISSUES]` | framework-issues.md | `~/.gemini/antigravity/brain/framework-issues.md` |

### The Hook Registration

In `~/.claude/settings.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.gemini/antigravity/scripts/session-context.js"
          }
        ]
      }
    ]
  }
}
```

### The Script Logic (simplified)

```javascript
// session-context.js pseudocode

// 1. Find workspace UUID
const workspaceId = getWorkspaceUUID(process.cwd());

// 2. Load identity from my-brain
const identity = readFile('~/Repositories/Personal/my-brain/CLAUDE.md');

// 3. Load previous session state
const sessionState = readJSON(`~/.gemini/antigravity/brain/${workspaceId}/session_state.json`);

// 4. Load persistent learnings
const learnings = readFile('~/.gemini/antigravity/brain/learnings.md');

// 5. Load framework issues (if in framework project)
const issues = readFile('~/.gemini/antigravity/brain/framework-issues.md');

// 6. List reference artifacts
const artifacts = listFiles(`~/.gemini/antigravity/brain/${workspaceId}/handoffs/`);

// 7. Format and output
console.log(JSON.stringify({
  additionalContext: formatAllContext(identity, sessionState, learnings, issues, artifacts)
}));
```

---

## Source 4: Context Agent (SIMPLIFIED)

**Trigger:** `SessionStart` event, after session-context.js
**Script:** `.claude/hooks/context/spawn-context-agent.cjs`
**When:** Session start
**Status:** FIXED - Now just outputs a trigger instruction

**Appears as:**
```
<system-reminder>
[CONTEXT AGENT] Spawn context-agent via Task tool to evaluate project state and design thinking phase. Use model haiku for speed.
</system-reminder>
```

**How it works now:**
1. Hook outputs simple trigger instruction (~1 line)
2. Claude sees instruction and spawns context-agent via Task tool
3. Context Agent uses normal tool infrastructure (not subprocess)
4. Same result, simpler mechanism

**Previous approach (complex, broken):**
The old hook tried to spawn `claude -p` subprocess, parse JSON, format output. Too many failure points.

**Commit:** d814315 (refactor to trigger instruction)

---

## Visual: The Full Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ YOU RUN: cc (alias for claude --append-system-prompt-file ...)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ SOURCE 1: System Prompt (INVISIBLE TO HOOKS)                    │
│ File: ~/.claude/system-rules.md                                 │
│ Loaded via: --append-system-prompt-file flag                    │
│ Part of: "system" field in API request                          │
│ Contains: Methodology, lenses, teaching mode, format            │
│ Authority: HIGH - this is enforced configuration                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ SOURCE 2: SessionStart Hooks (run in parallel)                  │
│ Triggered by: SessionStart event in settings.json               │
│                                                                 │
│ session-context.js:                                             │
│ ├── Reads identity from my-brain/CLAUDE.md                      │
│ ├── Reads learnings.md, framework-issues.md                     │
│ ├── Reads previous handoff                                      │
│ └── Outputs: [ANTIGRAVITY SESSION CONTEXT] (~160 lines)         │
│                                                                 │
│ spawn-context-agent.cjs:                                        │
│ └── Outputs: Trigger to spawn context-agent (~1 line)           │
│                                                                 │
│ Part of: "messages" array as user messages                      │
│ Authority: LOW - context Claude reads, not rules                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ SOURCE 3: CLAUDE.md Files (USER MESSAGES, NOT SYSTEM PROMPT)    │
│ Files: CLAUDE.md, .claude/CLAUDE.md                             │
│ Loaded via: Claude Code walks up directory tree                 │
│ Part of: "messages" array as user messages                      │
│ Contains: Project context, workflows, hooks docs (~450 lines)   │
│ Authority: LOW - context Claude reads, not rules                │
│                                                                 │
│ PROBLEM: ~50% of this is duplicated or documentation            │
│ that should be loaded on-demand. See session-start-inventory.md │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ SESSION READY                                                   │
│ Claude has: system prompt + hooks output + CLAUDE.md            │
│ Total: ~620 lines, ~6000 tokens before user says anything       │
│ Waste: ~50% duplicated or on-demand documentation               │
│                                                                 │
│ For cleanup plan, see Issue #28                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Locations Summary

| What | Where |
|------|-------|
| System rules (methodology) | `~/.claude/system-rules.md` |
| Global hooks config | `~/.claude/settings.json` |
| Session context script | `~/.gemini/antigravity/scripts/session-context.js` |
| Your identity | `~/Repositories/Personal/my-brain/CLAUDE.md` |
| Persistent learnings | `~/.gemini/antigravity/brain/learnings.md` |
| Framework issues | `~/.gemini/antigravity/brain/framework-issues.md` |
| Per-workspace state | `~/.gemini/antigravity/brain/{uuid}/session_state.json` |
| Per-workspace handoffs | `~/.gemini/antigravity/brain/{uuid}/handoffs/` |
| Context Agent hook | `.claude/hooks/context/spawn-context-agent.cjs` |
| Context Agent instructions | `.claude/agents/context-agent.md` |

---

## How to Modify Each Source

| Source | To Change | Edit This File |
|--------|-----------|----------------|
| Methodology/lenses | What Claude knows about design thinking | `~/.claude/system-rules.md` |
| Project context | What Claude knows about this project | `CLAUDE.md` or `.claude/CLAUDE.md` |
| Your identity | Who you are, how you work | `~/Repositories/Personal/my-brain/CLAUDE.md` |
| Learnings | What Claude should remember | `~/.gemini/antigravity/brain/learnings.md` |
| What gets loaded | Hook behavior | `~/.gemini/antigravity/scripts/session-context.js` |
| Hook triggers | When hooks fire | `~/.claude/settings.json` |

---

*Created: 2026-03-16*
*Issue: Prompted by Luis asking "where is this coming from?"*
