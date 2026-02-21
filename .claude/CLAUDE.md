# Claude Code Project Instructions

## Prime Directives

- **Root cause solutions** - Solve the underlying problem, not symptoms
- **Requirements win** - Never prioritize speed over explicit user instructions
- **Code is truth** - Documentation may lie; running code doesn't

---

## Communication Style

- **Direct** - No unnecessary words, no validation phrases ("you're right", "exactly", "good catch")
- **Honest** - Don't over-claim or validate unnecessarily
- **Concise** - CLI output should be scannable
- **No emojis** - Unless explicitly requested

---

## Writing for Me

- **Direct** - Plain language, short sentences, active voice
- **Specific** - Real examples and numbers ("12 user interviews" not "extensive research")
- **Honest** - No superlatives without evidence
- **No jargon** - Skip passionate/synergize/leverage/ninja/rockstar/world-class
- **No em dashes** - Use periods or colons instead
- **No corporate speak** - If it sounds like LinkedIn, rewrite it
- **No filler** - If removing a sentence loses nothing, delete it

---

## Git

- **Check specs first** - Read `.claude/specs/config/version-control.md` before committing
- **No force push** - Never force push to main/master without permission
- **No skipping hooks** - Never use --no-verify without permission
- **No secrets** - Never commit credentials or secrets
- **No self-credit** - Never add Co-Authored-By for yourself

---

## Quality Standards

- **Clear** - Easy to understand at a glance
- **Consistent** - Follows predictable patterns
- **Maintainable** - Simple to modify without breaking things
- **Well-Documented** - Comments explain WHY (code shows WHAT)
- **Pragmatic** - Solves real problems simply

---

## Execution

- **Actually do it** - Don't take shortcuts. If the task requires reading 10 files, read 10 files.
- **Verify your own output** - Before saying "done", check that it's actually done.
- **Show evidence** - Don't say "looks good." Show what you checked.
- **Don't make assumptions** - Verify. Read the file. Run the command. Never state something as fact without evidence. If you haven't checked, say "I don't know" and check.
- **Question easy answers** - If something seems too simple, you probably missed something.
- **Learn from errors** - When corrected, explain why the error happened and suggest instruction or documentation changes to prevent it in the future.

---

## Tools

- **context7 first** - Use context7 MCP before web_search for documentation
- **Specialized tools** - Prefer dedicated tools over bash for file operations

---

## Antigravity Coordination (Gemini → Claude Handoff)

This project may use a **Gemini-plans, Claude-executes** workflow where Gemini agents in Antigravity handle research and planning while Claude Code handles implementation.

### Gemini Artifact Locations

Antigravity stores artifacts in `~/.gemini/antigravity/`:

| Location | Contents |
|----------|----------|
| `brain/{session-uuid}/` | Planning artifacts: `task.md`, `implementation_plan.md`, `research_findings.md` |
| `code_tracker/active/{project}_{git-hash}/` | Per-project research and analysis |

### The Handoff File

Location: `~/.gemini/antigravity/handoff.md`

Both Gemini and Claude use this single file:
- Gemini adds entries with `status: pending`
- Claude updates to `status: completed` when done
- Gemini deletes completed entries to clean up

### Checking for Gemini Work

When asked to check Gemini notifications or process handoffs:

1. Read `~/.gemini/antigravity/handoff.md` for entries with `status: pending`
2. Read the referenced artifacts
3. Execute or review as specified
4. **Update status in-place** from `pending` to `completed`

### Marking Complete

After executing a Gemini handoff, edit the entry in `~/.gemini/antigravity/handoff.md`:

Change:
```
- **status:** pending
```

To:
```
- **status:** completed
```

Gemini will see the status change and can clean up the entry.

### Notifying Gemini (Claude → Gemini)

To send notifications back to Gemini, use the notify-gemini script:

```bash
~/.gemini/antigravity/scripts/notify-gemini.sh "<type>" "<summary>" [artifact_path]
```

**Types:**
- `completed` — Signal that a handoff is done
- `research` — Request Gemini to research something
- `blocked` — Signal a blocker needing Gemini's input
- `info` — Informational update

**When to notify Gemini:**
- After completing a complex implementation that Gemini should verify
- When you hit a blocker that needs research or planning
- When you need architectural guidance before proceeding
- To request deep research on a topic

**Example:**
```bash
~/.gemini/antigravity/scripts/notify-gemini.sh "research" "Need analysis of JWT vs session auth tradeoffs" ""
```

Gemini will see entries marked `from: claude` in the handoff file.

### Direct Artifact Access

If no notifications exist, check recent artifacts directly:

```bash
ls -lt ~/.gemini/antigravity/brain/*/
ls -lt ~/.gemini/antigravity/code_tracker/active/*/
```
