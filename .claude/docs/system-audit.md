# System Audit: Context Injection & Data Flow

> **OUTDATED:** This document predates the persistence migration (2026-03-18). Key changes: all persistence moved from `~/.gemini/antigravity/brain/` to `~/.claude/projects/{workspace-key}/`. Brain UUIDs eliminated. Tracking writes to `tracking/`, memories to `memory/`. Session-context.js no longer reads brain. See #36 and `pipeline-decisions.md` for current state.

**Purpose:** Map what files exist, when they're read, when they're written, and what triggers what.

**Last updated:** 2026-03-15

---

## Executive Summary

### What Gets Loaded at Session Start
1. **Native Claude Code:** CLAUDE.md files, conversation summary (after compact)
2. **session-context.js:** Identity from my-brain, workspace state, learnings, framework-issues (if in framework repo)
3. **session-init.cjs:** Resets session-state.json, checks for project changes
4. **spawn-context-agent.cjs:** Spawns Context Agent (claude -p) for project evaluation
5. **post-compact-recovery.js (compact only):** Full methodology, learnings, handoff, decisions, patterns

### What Gets Loaded During Session
- **UserPromptSubmit:** Command suggestions, voice profile (for writing), CPMAI context
- **PreToolUse:** Spec enforcement, skill enforcement, dangerous command blocking
- **PostToolUse:** Tracking updates, pivot detection, Phase Evaluator spawn (on commits)

### What Gets Written Pre-Compact
- `handoff.md`: Basic context (files changed, task if found)
- `session_state.json`: Updated with lastSessionFiles

### Key Data Stores
| Store | Location | Purpose |
|-------|----------|---------|
| Identity | `my-brain/CLAUDE.md` | Who Luis is |
| Methodology | `my-brain/personal/methodology.md` | How to think/work |
| Learnings | `brain/learnings.md` | Mistakes to avoid |
| Per-Workspace State | `brain/{uuid}/` | Handoffs, decisions, patterns |
| Session Tracking | `brain/tracking/sessions/{id}.json` | Tool calls, files, commands |

---

## 1. Hook Registry (~/.claude/settings.json)

### SessionStart Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `session-context.js` | Loads identity, workspace state, learnings | `my-brain/CLAUDE.md`, `brain/{uuid}/session_state.json`, `brain/learnings.md`, `brain/framework-issues.md` | stdout (injected to Claude) |
| 2 | `session-init.cjs` | Initializes session state, checks for project changes, cleans old sessions | `.claude/specs/.sync-state.json`, `package.json`, config files | `.claude/session-state.json`, stdout (project change warnings) |
| 3 | `spawn-context-agent.cjs` | Spawns `claude -p` with Context Agent instructions to evaluate project state | `.claude/agents/context-agent.md` | stdout (additionalContext JSON) |
| 4 (compact only) | `post-compact-recovery.js` | Restores full context after compaction | `my-brain/personal/methodology.md`, `brain/learnings.md`, `brain/{uuid}/handoff.md`, `brain/{uuid}/session_state.json`, `brain/{uuid}/decisions.md`, `brain/{uuid}/patterns.md` | stdout (injected to Claude) |

### SessionEnd Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `session-end.cjs` | Records session end (unreliable - doesn't fire on trash/close) | - | `brain/tracking/sessions/{id}.json` |

### PreToolUse Hooks (Bash)
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `block-dangerous.cjs` | Blocks rm -rf, force push, credentials | stdin (command) | exit 2 to block |
| 2 | `enforce-skills.cjs` | Blocks git commit/gh pr without skill | stdin (command) | exit 2 to block |
| 3 | `enforce-plan.cjs` | Blocks gh issue create without plan skill | stdin (command) | exit 2 to block |

### PreToolUse Hooks (Edit|Write)
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `enforce-specs.cjs` | Blocks code edits until specs read | `.claude/session-state.json` | exit 2 to block |

### PostToolUse Hooks
| Matcher | Script | What It Does | What It Reads | What It Writes |
|---------|--------|--------------|---------------|----------------|
| * | `tool-tracker.cjs` | Tracks all tool calls | stdin (tool result) | `brain/tracking/sessions/{id}.json` |
| Edit\|Write | `track-changes.cjs` | Logs file modifications | stdin (tool result) | `brain/tracking/sessions/{id}.json` |
| Read | `track-spec-reads.cjs` | Updates specsRead flag | stdin (tool result) | `.claude/session-state.json` |
| Bash | `command-log.cjs` | Logs commands | stdin (tool result) | `brain/tracking/sessions/{id}.json` |
| Bash | `detect-pivot.cjs` | Prompts /sync-stack on npm install | stdin (tool result) | stdout |
| Bash(*git commit*) | `spawn-phase-evaluator.cjs` | Spawns Phase Evaluator agent | - | spawns subagent |

### PostToolUseFailure Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `tool-failure.cjs` | Tracks tool failures | stdin | `brain/tracking/sessions/{id}.json` |

### UserPromptSubmit Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `clear-pending.cjs` | Clears pendingEdit/pendingIssue/lastSkillRead flags (per-prompt enforcement) | `.claude/session-state.json` | `.claude/session-state.json` |
| 2 | `inject-context.cjs` | Suggests skills based on prompt, injects voice profile for writing tasks | `brain/voice-profile.md` | stdout |
| 3 | `awareness.cjs` | Checks system health, prompts /analyze | `brain/tracking/sessions/` | stdout |

### SubagentStart/Stop Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `subagent-tracker.cjs` | Records subagent id, type, description, start/stop times, duration | stdin (subagent_id, subagent_type, description) | `brain/tracking/sessions/{id}.json` (subagents array) |

### Stop Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `verify-before-stop.cjs` | Checks for debug statements (console.log, debugger) in modified files | files modified this session | stdout warning |
| 2 | `check-teaching-format.cjs` | Checks last response for [Design Thinking:] and [Concept:] markers | transcript file | stdout warning (if missing) |
| 3 | `enforce-framing.cjs` | Checks if Context/Task agents were launched (currently warning-only) | transcript (last 5 messages) | stdout reminder |

### PreCompact Hooks
| Hook | Script | What It Does | What It Reads | What It Writes |
|------|--------|--------------|---------------|----------------|
| 1 | `pre-compact.js` | Saves context before compaction | `brain/tracking/sessions/{id}.json` | `brain/{uuid}/handoff.md`, `brain/{uuid}/session_state.json` |

---

## 2. Brain Structure (~/.gemini/antigravity/brain/)

### Global Files
| File | Read By | Written By | Purpose |
|------|---------|------------|---------|
| `learnings.md` | `session-context.js`, `post-compact-recovery.js` | Manual (during /checkpoint or corrections) | Persistent learnings across all sessions |
| `voice-profile.md` | `inject-context.cjs` | Manual | Voice rules for content writing |
| `framework-issues.md` | `session-context.js` (only for claude-dev-framework) | Manual | Framework bugs/gaps |
| `tracking/sessions/{id}.json` | `pre-compact.js`, `awareness.cjs` | `tool-tracker.cjs`, `track-changes.cjs`, `command-log.cjs`, `tool-failure.cjs` | Per-session tracking data |

### Per-Workspace Files (brain/{uuid}/)
| File | Read By | Written By | Purpose |
|------|---------|------------|---------|
| `session_state.json` | `session-context.js`, `post-compact-recovery.js` | `pre-compact.js`, `session-init.cjs` | Current workspace state |
| `handoff.md` | `session-context.js`, `post-compact-recovery.js` | `pre-compact.js`, `/handoff` skill | Session handoff context |
| `handoffs/` | - | `session-context.js` (archives) | Archived handoffs |
| `task.md` | (DEPRECATED - use handoff.md) | - | Old task history |
| `decisions.md` | `post-compact-recovery.js` | Manual | Design decisions |
| `patterns.md` | `post-compact-recovery.js` | Manual | Technical patterns |
| `research/` | Manual | Manual | Research findings |

---

## 3. Project Files (.claude/)

### Commands (.claude/commands/)
| Path | Invoked By | Purpose |
|------|------------|---------|
| `development/commit.md` | `/commit`, Skill tool | Commit workflow |
| `development/pr.md` | `/pr`, Skill tool | PR creation |
| `development/start-task.md` | `/start-task`, Skill tool | Task initialization |
| `development/add-feature.md` | `/add-feature`, Skill tool | Feature planning |
| `project-management/init-project.md` | `/init-project` | Project setup |
| `project-management/sync-stack.md` | `/sync-stack` | Stack detection |
| `utilities/learn.md` | `/learn` | ELI5 explanations |
| `utilities/analyze.md` | `/analyze` | Framework analysis |
| `utilities/audit.md` | `/audit` | Code review |

### Skills (.claude/skills/)
| Skill | Triggers | Purpose |
|-------|----------|---------|
| `commit/SKILL.md` | "commit", "save this", "done" | Commit + push + PR |
| `start-task/SKILL.md` | "work on issue", "implement" | Load specs, gather requirements |
| `plan/SKILL.md` | "what's next", "add to backlog" | Manage GitHub issues |
| `add-feature/SKILL.md` | "plan feature", "break down" | Create PRD, subtasks |
| `handoff/SKILL.md` | "handoff", "end session" | Capture session context |
| `contribute-to-opensource/SKILL.md` | "contribute to open source" | OSS contribution setup |

### Hooks (.claude/hooks/)
See Hook Registry above for full details.

### Specs (.claude/specs/)
| Path | Read By | Purpose |
|------|---------|---------|
| `stack-config.yaml` | `/start-task` | Lists specs to load |
| `coding/*.md` | `/start-task`, `enforce-specs.cjs` | Coding patterns |
| `config/*.md` | `/start-task` | Config patterns (version-control, testing) |
| `architecture/*.md` | `/start-task` | Architecture patterns |
| `design/*.md` | `/start-task` | Design patterns |
| `claude-code/*.md` | Various | Framework reference docs |

---

## 4. External Files

| File | Read By | Written By | Purpose |
|------|---------|------------|---------|
| `~/Repositories/Personal/my-brain/CLAUDE.md` | `session-context.js` | Manual | Luis's identity |
| `~/Repositories/Personal/my-brain/personal/methodology.md` | `post-compact-recovery.js` | Manual | Operating methodology |
| `~/.claude/system-prompt.md` | Claude Code (via `--append-system-prompt`) | Manual | System prompt layer |

---

## 5. Lifecycle Flow

### Session Start (Normal)
```
1. session-context.js → Loads identity, workspace state, learnings → stdout
2. session-init.cjs → Creates/updates .claude/session-state.json
3. spawn-context-agent.cjs → Spawns Context Agent
4. CLAUDE.md files auto-loaded by Claude Code
```

### Session Start (After Compact)
```
1. Native Claude Code summary generated
2. session-context.js → Loads identity, workspace state, learnings → stdout
3. session-init.cjs → Creates/updates .claude/session-state.json
4. spawn-context-agent.cjs → Spawns Context Agent
5. post-compact-recovery.js → Loads methodology, learnings, handoff, decisions, patterns → stdout
6. CLAUDE.md files auto-loaded by Claude Code
```

### During Session
```
UserPromptSubmit:
  - clear-pending.cjs → Clears pending suggestions
  - inject-context.cjs → Suggests skills based on prompt, injects voice profile
  - awareness.cjs → Checks health, prompts /analyze if issues accumulate

PreToolUse (Bash):
  - block-dangerous.cjs → Blocks dangerous commands
  - enforce-skills.cjs → Requires Skill tool for git commit/gh pr
  - enforce-plan.cjs → Requires plan skill for gh issue create

PreToolUse (Edit|Write):
  - enforce-specs.cjs → Blocks until specs read

PostToolUse:
  - tool-tracker.cjs → Logs tool call
  - track-changes.cjs → Logs file changes (Edit|Write)
  - track-spec-reads.cjs → Updates specsRead flag (Read)
  - command-log.cjs → Logs commands (Bash)
  - detect-pivot.cjs → Prompts /sync-stack (Bash)
  - spawn-phase-evaluator.cjs → Spawns Phase Evaluator (git commit)
```

### Pre-Compact
```
pre-compact.js:
  - Reads tracking/sessions/{id}.json for file changes
  - Writes handoff.md with basic context
  - Updates session_state.json
```

### Session End
```
session-end.cjs → Records session end (unreliable - doesn't fire on trash/close)
```

---

## 6. Known Issues

1. **SessionEnd unreliable** - Doesn't fire when clicking trash or closing terminal
2. **enforce-framing.cjs** - Needs fixing to ensure task/issue structure
3. **Documentation drift** - README descriptions can drift from command frontmatter
4. **No forcing function for /start-task** - Code can be written without specs loaded
5. **check-teaching-format.cjs outdated** - Looks for [Design Thinking:] and [Concept:] but we use Lens/Refine/Phase/Teach now

## 6a. Fixed Issues (This Session)

1. **Context Agent deadlock** - `claude -p` hangs when spawned from same directory as parent Claude session
   - **Root cause:** Session resource conflict
   - **Fix:** Run from `/tmp`, pass workspace path in prompt
   - **Files fixed:** `spawn-context-agent.cjs`, `spawn-phase-evaluator.cjs`

---

## 7. Agent Files (.claude/agents/)

| File | Spawned By | Purpose |
|------|------------|---------|
| `context-agent.md` | `spawn-context-agent.cjs` at SessionStart | Evaluates project state, design thinking phase, GitHub state, success criteria |
| `phase-evaluator.md` | `spawn-phase-evaluator.cjs` at git commit | Observes work and provides design thinking rhythm guidance |

---

## 8. Questions Answered

- [x] What exactly does `session-init.cjs` write? → `.claude/session-state.json` with sessionStart timestamp
- [x] What does `spawn-context-agent.cjs` actually do? → Spawns `claude -p` with context-agent.md instructions
- [x] What does `clear-pending.cjs` do? → Clears pendingEdit/pendingIssue/lastSkillRead flags per prompt
- [x] What does `subagent-tracker.cjs` track? → Subagent id, type, description, start/stop times in tracking
- [x] What does `check-teaching-format.cjs` check? → [Design Thinking:] and [Concept:] markers in response
- [x] What does `enforce-framing.cjs` enforce? → Context/Task agent usage (warning-only currently)
- [x] Is `daemon.js` being used? How is it started? → **Manual process**, run via `node daemon.js --daemon`. Watches tracking files, synthesizes to overview.txt
- [x] What triggers voice-profile.md injection? → `inject-context.cjs` when prompt contains content-writing patterns (resume, linkedin, bio, writing content, etc.)
- [x] Is capture-corrections.cjs still active? → **NO - ORPHANED**. File exists but not in settings.json

---

## 9. Orphaned/Unused Files

| File | Status | Notes |
|------|--------|-------|
| `capture-corrections.cjs` | ORPHANED | Exists but not in settings.json - was disabled |
| `test-agent-spawn.cjs` | Test file | Not meant for production |
| `session-utils.cjs` | Library | Not a hook, imported by other hooks |
| `task.md` | DEPRECATED | Replaced by handoff.md |

---

## 10. Daemon (Separate Process)

| File | How Started | What It Does |
|------|-------------|--------------|
| `daemon.js` | Manual: `node daemon.js --daemon` | Watches `tracking/sessions/*.json`, synthesizes to `overview.txt` in brain folder |

The daemon is NOT triggered by hooks. It must be manually started and runs continuously in background.
