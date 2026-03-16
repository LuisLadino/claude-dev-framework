# Enforcement Patterns

How behavior enforcement works in this framework. Reference this when adding new enforced behaviors.

---

## The Core Problem

Claude doesn't reliably follow instructions. Soft enforcement (reminders, suggestions) fails. Hard enforcement (gates that block) works.

**Principle:** Instructions without gates are wishful thinking.

---

## Two Enforcement Types

### Type 1: Marker-Based (Stateless)

**How it works:**
- Gate checks for a marker in the action (e.g., `SKILL_ACTIVE=1` in command)
- No state tracking needed
- Marker proves the proper workflow was followed

**When to use:**
- The "proper way" embeds the marker automatically
- No per-prompt refresh needed
- Binary: did you use the workflow or not?

**Examples:**
| Hook | Blocks | Marker |
|------|--------|--------|
| `enforce-skills.cjs` | `git commit` | `SKILL_ACTIVE=1` in command |
| `block-dangerous.cjs` | `rm -rf /`, force push | None (no bypass) |

**Constraint this solves:** Skills undertrigger ~80% of the time. Blocking the raw action forces skill invocation.

---

### Type 2: State-Based (Per-Prompt)

**How it works:**
- Gate checks session-state.json for a flag
- Reading the required content sets the flag
- Flag cleared at each new prompt (cleanup)

**When to use:**
- Content must be re-read each prompt (context drift prevention)
- Multiple valid sources can set the flag
- Need to track WHAT was read, not just IF something was read

**Examples:**
| Hook | Blocks | State Key | Set By |
|------|--------|-----------|--------|
| `enforce-specs.cjs` | Edit\|Write | `pendingEdit[]` | `track-spec-reads.cjs` |
| `enforce-plan.cjs` | `gh issue create` | `pendingIssue` | `track-spec-reads.cjs` |

**Constraint this solves:** Specs must be fresh in context before editing. Re-reading each prompt prevents drift.

**Cleanup:** `clear-pending.cjs` runs at UserPromptSubmit, clears all flags.

---

## Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **Gate** | Blocks action until condition met | `.claude/hooks/safety/` or `.claude/hooks/context/` |
| **Tracker** | Sets state when condition is met | `.claude/hooks/tracking/` |
| **Cleanup** | Resets state per-prompt | `.claude/hooks/context/clear-pending.cjs` |
| **State** | Stores flags | `.claude/session-state.json` |
| **Instructions** | Documents the proper workflow | `.claude/skills/` or `.claude/commands/` |

---

## Adding New Enforcement

### Step 1: Identify the Constraint

What problem are you solving? Document it.

Examples:
- "Skills undertrigger" → marker-based
- "Context drifts across prompts" → state-based with cleanup
- "Dangerous actions should never happen" → marker-based, no bypass

### Step 2: Choose Type

| If... | Use |
|-------|-----|
| Binary check (did workflow run?) | Marker-based |
| Need to track what was read | State-based |
| Per-prompt refresh needed | State-based + cleanup |
| No bypass allowed | Marker-based, no marker check |

### Step 3: Implement

**Marker-based:**
1. Create gate hook (PreToolUse or Stop)
2. Check for marker in action
3. EXIT 2 if missing, EXIT 0 if present
4. Ensure proper workflow embeds marker

**State-based:**
1. Create gate hook (PreToolUse or Stop)
2. Create tracker hook (PostToolUse on Read)
3. Add state key to session-state.json
4. Add cleanup to clear-pending.cjs
5. EXIT 2 if state missing, EXIT 0 if present

### Step 4: Document

Update this file with the new pattern.

---

## Exit Codes

| Code | Meaning | Effect |
|------|---------|--------|
| 0 | Allow | Action proceeds |
| 2 | Deny | Action blocked, error shown |

**Warning:** Don't use `|| true` in settings.json for blocking hooks - it converts EXIT 2 to EXIT 0.

---

## State File Structure

`.claude/session-state.json`:
```json
{
  "sessionStart": "ISO timestamp",
  "pendingEdit": ["spec-name-1", "spec-name-2"],
  "pendingIssue": true,
  "lastSkillRead": "plan",
  "lastSpecRead": "/path/to/spec.md",
  "specReadAt": "ISO timestamp"
}
```

---

## Existing Enforcement

| Behavior | Type | Gate | Constraint |
|----------|------|------|------------|
| Read specs before editing | State-based | `enforce-specs.cjs` | Context drift prevention |
| Use commit skill | Marker-based | `enforce-skills.cjs` | Skills undertrigger 80% |
| Read plan before issues | State-based | `enforce-plan.cjs` | Issues need proper context |
| Block dangerous commands | Marker-based (no bypass) | `block-dangerous.cjs` | Safety |
| Teaching format in responses | Marker-based | `check-teaching-format.cjs` | Claude ignores format instructions |

### Teaching Format Enforcement

**Type:** Marker-based (checks response content at Stop)
**Gate:** `check-teaching-format.cjs`
**Event:** Stop
**Constraint:** Claude doesn't reliably follow the Lens/Refine/Phase/Teach format

**Required markers:**
- `**Lens:**`
- `**Refine:**`
- `**Phase:**`
- `**Teach:**`

**No escape hatches.** Every response needs the format. The format keeps Claude grounded in design thinking framing at all times - there are no "trivial" responses when we're always working on something.

**Exit codes:**
- EXIT 0 if all markers present
- EXIT 2 if any marker missing (blocks response)

---

## References

- Research: `.claude/research/design-thinking-operating-system.md`
- Hook spec: `.claude/specs/claude-code/hooks.md`
- Stack config: `.claude/specs/stack-config.yaml` (drives enforce-specs patterns)
