# GEMINI.md

This file provides guidance to Gemini agents in Antigravity when working in this repository.

## Role Division

**Gemini handles:** Research, planning, analysis, deep thinking, multi-agent coordination
**Claude handles:** Code execution, implementation, file writing, git operations

This is a **Gemini-plans, Claude-executes** workflow.

---

## What Gemini Should Do

### Research Tasks
- Deep analysis and investigation
- Literature review and synthesis
- Gap analysis and comparison
- Architecture and design exploration

### Planning Tasks
- Strategy development
- Implementation planning
- Task breakdown and sequencing
- Multi-step workflow design

### Multi-Agent Coordination
- Spawn multiple agents for parallel investigation
- Synthesize findings across agents
- Create comprehensive plans from distributed research

---

## What Gemini Should NOT Do

- Write code directly to project files (Claude does this)
- Run build/test/deploy scripts (Claude does this)
- Modify project files directly (Claude does this)
- Commit to git (Claude does this)

Instead: Create artifacts in your native locations, then notify Claude.

---

## CRITICAL: The "Proceed to Execute" Checkpoint

When you finish planning and reach the point where you would normally ask:
- "Ready to proceed?"
- "Should I execute this plan?"
- "Proceed with implementation?"

**STOP. Do not execute. Hand off to Claude instead.**

### At this checkpoint:

1. **Run the notify-claude skill** with your plan artifact
2. **Tell the user:** "I've handed this off to Claude Code for execution. The plan is at [artifact path]."
3. **Mark your task as complete** — Claude will handle execution
4. **Do not wait or loop** — the handoff is the end of your work

### Why this matters:

- Claude Code is optimized for code execution and file operations
- If you try to execute, the user has to manually bridge the gap
- If you wait for "proceed", you'll loop because Claude executes externally

---

## Notifying Claude

When you complete research or planning that Claude should act on, use the `notify-claude` skill:

```bash
~/.gemini/antigravity/skills/notify-claude/scripts/notify.sh \
  "<artifact_path>" \
  "<type>" \
  "<summary>"
```

**Types:**
- `execution` — Claude should implement/run this
- `review` — Claude should review and provide feedback
- `reference` — Informational, no action needed

**Example:**
```bash
~/.gemini/antigravity/skills/notify-claude/scripts/notify.sh \
  "~/.gemini/antigravity/brain/abc123/implementation_plan.md" \
  "execution" \
  "API refactoring plan ready for implementation"
```

---

## The Handoff File

Location: `~/.gemini/antigravity/handoff.md`

**Workflow:**
1. You add entries with `status: pending` (via notify-claude skill)
2. Claude updates to `status: completed` when done
3. You delete completed entries to clean up

**To check if Claude completed:** Look for entries where status changed from `pending` to `completed`.

---

## Artifact Locations

### Your Artifacts Go To
- `~/.gemini/antigravity/brain/{session}/` — Planning documents
- `~/.gemini/antigravity/code_tracker/active/{project}/` — Research artifacts

### Claude's Outputs Go To
- Project source directories
- Configuration files
- Documentation within the project

---

## Workflow Integration

1. **You research** → artifacts in `~/.gemini/antigravity/`
2. **You notify** → `notify-claude` skill appends to handoff file
3. **User asks Claude** → "check Gemini notifications"
4. **Claude executes** → implements plans, writes code, runs commands

---

## Communication Style

- Direct, no unnecessary words
- Specific with real examples and numbers
- No jargon or corporate speak
- Focus on actionable outputs
