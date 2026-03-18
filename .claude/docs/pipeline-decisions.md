# Pipeline Audit Decisions

Tracking what stays, moves, or gets cut as we walk the pipeline in order.

## Destinations

| Destination | Scope | How it arrives |
|---|---|---|
| `system-rules.md` | Universal — all projects, all contexts | System prompt via --append-system-prompt |
| `.claude/CLAUDE.md` | All framework projects — synced from claude-dev-framework | Auto-loaded in user message |
| Conditional injection | Specific situations only | Hook fires on trigger |
| Deleted | Not needed | — |

---

## Source 1-4: Claude Code native (tool defs, base instructions, auto memory, environment)
**Status:** Can't control. No action.

## Source 5: system-rules.md
**Status:** Draft v2 in progress at `.claude/docs/system-rules-v2-draft.md`

| Content | Decision | Destination |
|---|---|---|
| Identity / who Luis is | KEEP — rewritten, passes "changes behavior" test | system-rules.md |
| "Why this matters" + don't assume knowledge | KEEP — added back, calibrates teaching level | system-rules.md |
| How to work with Luis | KEEP — from my-brain/CLAUDE.md | system-rules.md |
| Response format (Lens/Refine/Phase/Teach) | KEEP — consolidated to one spec with `<example>` tag | system-rules.md |
| 12 lenses with CPMAI folded in | KEEP — enriched with CPMAI domain questions | system-rules.md |
| Design thinking rhythm | KEEP — expanded, now behavioral constraint not just reference | system-rules.md |
| Non-negotiables | KEEP | system-rules.md |
| Teaching mode | KEEP | system-rules.md |
| Task management (TaskCreate/TaskUpdate specifics) | CUT — needs separate design work | TBD |
| Issue scope rules (when to create vs continue GitHub issues) | MOVE | .claude/CLAUDE.md |
| Agents as Strategic Advisors section | CUT — orphaned, agents need redesign | Deleted |
| Co-Authored-By prohibition | CUT — conflicts with Claude Code native behavior | Deleted |
| Duplicate response format (appeared twice) | CUT — consolidated into one | Deleted |
| CPMAI as standalone lens | CUT — folded into Business, Data Science, AI/ML | Deleted |

## Source 6: session-context.js (SessionStart hook)
**Status:** Audited. Needs rewrite.

**Principle:** Brain data stays on disk for observability (VOIR). We're only deciding what gets *injected*, not what gets *saved*.

| Content | Decision | Destination |
|---|---|---|
| Identity (name, background, values, approach) | STOP INJECTING — now in system-rules.md permanently | system-rules.md |
| "How to work with Luis" | STOP INJECTING — now in system-rules.md | system-rules.md |
| Projects list | STOP INJECTING — now in system-rules.md | system-rules.md |
| System architecture description | STOP INJECTING — project-specific, goes in CLAUDE.md or project-definition | .claude/CLAUDE.md |
| Project-definition.yaml content | INJECT — session-context.js reads `.claude/specs/project-definition.yaml` from workspace and injects the content at session start | session-context.js |
| Handoff.md | INJECT — critical for session continuity | session-context.js |
| Brain path | INJECT — Claude needs to know where to write | session-context.js |
| Learnings (staging area) | INJECT — but small, entries get promoted to system-rules.md then removed | session-context.js |
| Artifacts list with triggers | STOP INJECTING — not providing real value | stays on disk |
| Previous session state (accomplished, open_issues) | STOP INJECTING — garbled data, not useful | stays on disk for observability |
| Framework issues | STOP INJECTING — use GitHub issues directly | stays on disk |
| "[ANTIGRAVITY SESSION CONTEXT]" label | RENAME — meaningless to Claude, use descriptive label | session-context.js |

**Learnings promotion pipeline:**
1. Observation captured in learnings.md during session
2. Over time, evaluate if it's a confirmed pattern
3. If confirmed → add a line to system-rules.md addressing it permanently
4. Remove from learnings.md (keeps it small)

## Source 7: session-init.cjs (SessionStart hook)
**Status:** Audited. Fixed.

| Content | Decision | Destination |
|---|---|---|
| Session tracking init (brain) | KEEP — runs globally, observability plumbing | session-init.cjs |
| Change detection (config hash comparison) | KEEP — only runs inside framework projects now | session-init.cjs |
| Session state reset (spec enforcement flags) | KEEP — only runs inside framework projects now | session-init.cjs |
| Project context loading (project-brief, stack-config) | CUT — context agent reads project-definition.yaml | Deleted |

**Fix applied:** Added `.claude/` directory guard — project-specific work only runs inside framework projects. Addresses issue #30.

## Source 8: spawn-context-agent.cjs (SessionStart hook)
**Status:** Audited. Rewritten.

Replaced generic one-liner with structured instruction using Claude's native patterns (IMPORTANT:, Do NOT). Now tells Claude exactly what Agent tool parameters to use.

## Source 9: Root CLAUDE.md (auto-loaded) — PROJECT-SPECIFIC
**Status:** Audited. Needs rewrite but lower priority.

This file is specific to claude-dev-framework only. It does NOT go to other projects. 327 lines, mostly reference documentation (architecture, hooks reference, brain structure). Should be trimmed to just what changes behavior when working in this repo. Deferred — focus on shared CLAUDE.md first.

## Source 10: .claude/CLAUDE.md (auto-loaded) — SHARED ACROSS ALL PROJECTS
**Status:** Audited. Adding content.

| Content | Decision | Destination |
|---|---|---|
| Rules (verify edits, show proof, check context7) | KEEP | .claude/CLAUDE.md |
| Framework vs Project files | KEEP | .claude/CLAUDE.md |
| Development workflow | KEEP | .claude/CLAUDE.md |
| Specs | KEEP | .claude/CLAUDE.md |
| Hooks | KEEP | .claude/CLAUDE.md |
| Skills list | CUT — already auto-loaded by Claude Code | Deleted |
| GitHub issues as design thinking records | ADD — rich qualitative documentation requirement | .claude/CLAUDE.md |
| Issue scope rules (when to create new vs continue) | ADD — moved from system-rules.md | .claude/CLAUDE.md |
| Voice/writing rules for content | ADD — from voice-profile.md, always available | .claude/CLAUDE.md |

**Also added to system-rules.md draft:**
- Encoding rule for discussing own XML tags (use «» not <>)

## Source 11: Skills list (auto-loaded)
**Status:** Audited. No action needed.

Claude Code auto-loads this. Can't control. Skills section in CLAUDE.md is redundant and being removed.

## Source 12: inject-context.cjs + 7 modules (per-prompt)
**Status:** Not yet audited
- methodology.cjs — CPMAI domains folded into lenses. Career context to evaluate.
- route-commands.cjs — design thinking fallback content redundant with system-rules.md
- voice-identity.cjs — voice rules moving to CLAUDE.md, injection may become unnecessary
- capture.cjs — TBD
- reasoning-checkpoints.cjs — TBD
- spec-triggers.cjs — TBD
