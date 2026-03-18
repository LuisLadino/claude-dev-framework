# Opus 4.5 → 4.6 System Prompt Changes

**Date:** 2026-03-16
**Claude Code version:** 2.1.19+

---

## Tool Changes

### Renamed: Task → Agent

The "Task" tool was renamed to "Agent". Same core purpose (launch subprocesses) but significantly expanded.

**New parameters:**
| Parameter | Type | Purpose |
|-----------|------|---------|
| `subagent_type` | string | Select specialized agent type (was implicit) |
| `isolation` | enum: "worktree" | Run in isolated git worktree |
| `model` | enum: sonnet/opus/haiku | Override model for this agent |
| `name` | string | Make agent addressable via SendMessage |
| `resume` | string | Resume agent from previous ID |
| `run_in_background` | boolean | Non-blocking execution |
| `mode` | enum | Permission mode (acceptEdits, bypassPermissions, default, dontAsk, plan, auto) |
| `team_name` | string | Team context for spawning |

**Removed agent types:**
- `Bash` — command execution specialist (removed)

**New agent types:**
- `Plan` — software architect for implementation plans
- `claude-code-guide` — answers questions about Claude Code, Agent SDK, Claude API
- `context-agent` — project context and design thinking phase (custom)
- `phase-evaluator` — strategic advisor for commits (custom)

**Key behavioral changes:**
- Foreground vs background guidance added
- Agent resume capability (continue previous context)
- Worktree isolation for safe parallel work
- Named agents addressable via SendMessage

### New Tool: Skill

Executes "skills" — slash commands that expand into full prompts. Replaces direct command file loading.

- Skills listed in `<system-reminder>` tags in user message
- Blocking requirement: must invoke Skill tool BEFORE responding about the task
- Recognizes `/name` shorthand from users

### New Tool: ToolSearch

Fetches schemas for "deferred tools" — tools listed by name but without schemas until requested.

- Query forms: `select:Name`, keyword search, `+required term`
- Returns full JSONSchema definitions making tools callable
- Enables lazy-loading of tool definitions (reduces prompt size)

### New Section: Available Deferred Tools

`<available-deferred-tools>` block in user message lists tools by name only:
- AskUserQuestion, CronCreate/Delete/List, EnterPlanMode, EnterWorktree, ExitPlanMode, ExitWorktree
- NotebookEdit, SendMessage
- TaskCreate/Get/List/Output/Stop/Update (note: these are NOT the old "Task" tool — these are task management)
- TeamCreate/Delete
- WebFetch, WebSearch
- MCP tools (mcp__antigravity__*, mcp__context7__*)

### Bash Tool Updates

**New parameters:**
- `dangerouslyDisableSandbox` — override sandbox mode
- `run_in_background` — non-blocking execution with notification

**New guidance:**
- Sleep avoidance instructions (don't poll, use run_in_background instead)
- `run_in_background` pattern replaces sleep loops
- Description field now has explicit formatting guidance (brief for simple, detailed for complex)

### Grep Tool Updates

**New parameters:**
- `multiline` — cross-line pattern matching (rg -U --multiline-dotall)
- `offset` — skip first N entries before head_limit
- `head_limit` — limit output entries (replaces piping to head)
- `-n` — show line numbers (defaults to true)
- `-C` — alias for context

**New guidance:**
- Pattern syntax note: uses ripgrep, literal braces need escaping
- Multiline matching explanation

### Read Tool Updates

**New parameters:**
- `pages` — page range for PDF files (e.g., "1-5")

**New capabilities:**
- PDF reading (max 20 pages per request, MUST specify pages for large PDFs)
- Jupyter notebook reading (.ipynb)
- Image reading (multimodal — PNG, JPG, etc.)
- Empty file warning

### Edit Tool Updates

**New parameters:**
- `replace_all` — replace all occurrences (default false), useful for variable renaming

---

## Behavioral Instruction Changes

### New Section: Auto Memory

Persistent file-based memory system at project-specific path. Types:
- `user` — role, goals, preferences
- `feedback` — corrections and guidance
- `project` — ongoing work context
- `reference` — pointers to external systems

Memory files use frontmatter format. Index maintained in `MEMORY.md`.

### New Section: Fast Mode Info

`<fast_mode_info>` tag explains fast mode uses same model with faster output, toggled with /fast.

### New Section: MCP Server Instructions

MCP servers can provide usage instructions. In our case, context7 provides its instructions here.

### Model Information Updates

- Model ID: `claude-opus-4-6[1m]` (was `claude-opus-4-5-20250514`)
- Context: 1M explicitly stated
- Model family: Claude 4.5/4.6 (was 4/4.5)
- New model IDs: claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5-20251001
- Knowledge cutoff: May 2025 (same)

### Security Section Updates

New paragraph on dual-use security tools (C2 frameworks, credential testing, exploit development) — requires clear authorization context.

### Over-engineering Section (New)

Expanded guidance on avoiding over-engineering:
- Don't add features beyond what was asked
- Don't add error handling for impossible scenarios
- Don't create abstractions for one-time operations
- Three similar lines better than premature abstraction

### Executing Actions with Care (Expanded)

More detailed guidance on risky actions:
- Explicit examples (destructive, hard-to-reverse, visible to others)
- "Measure twice, cut once" principle
- Don't use destructive actions as shortcuts
- Investigate unexpected state before overwriting

### Co-Authored-By Update

Changed from `Claude <noreply@anthropic.com>` to `Claude Opus 4.6 (1M context) <noreply@anthropic.com>`.

---

## Structure Changes

### User Message Format

The first user message now contains these sections in order:
1. `<available-deferred-tools>` — tool names for lazy loading
2. `<system-reminder>` blocks — hook outputs (SessionStart, skills list, CLAUDE.md)
3. `gitStatus:` — git state snapshot
4. JSON tool call format example
5. Tool call instructions paragraph
6. User's actual prompt

### Skills System

Skills are now listed in a dedicated `<system-reminder>` block with trigger descriptions. Previously, slash commands were just files — now they're routed through the Skill tool with auto-detection from natural language.

---

## What Stayed the Same

- Core system message structure (tools → instructions → user message)
- `<system-reminder>` tag for hook output and CLAUDE.md
- `<functions>` / `<function>` tags for tool definitions
- JSON Schema format for tool parameters
- Markdown for behavioral instructions
- Git commit workflow (HEREDOC pattern, safety protocol)
- PR creation workflow
- File operation preferences (Read before Edit/Write)
- Glob, Write tool definitions (mostly unchanged)
