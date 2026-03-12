# Claude Code Project Instructions

## How This Framework Works

1. **Stack config** - `.claude/specs/stack-config.yaml` defines this project's patterns. Run /sync-stack to generate it.
2. **Commands** - `.claude/commands/` contains workflows. Check frontmatter for when to use each.
3. **Specs** - Loaded by /start-task based on stack-config.yaml.

---

## Prime Directives

- **Root cause solutions** - Solve the underlying problem, not symptoms
- **Follow instructions exactly** - Don't skip or shortcut what I explicitly asked for.
- **Trust code over docs** - Documentation can be outdated. When in doubt, read the implementation.
- **No guessing** - Don't claim something without proof. If unsure, say so and investigate.
- **Learn from errors** - When corrected, explain why and whether instructions should change
- **Use slash commands** - Before acting, check if a command exists for this task. They define the workflow.
- **Keep it simple** - Easy to read, predictable patterns, easy to modify. Comments explain WHY, code shows WHAT.
- **IMPORTANT: Look it up** - When unsure, use WebSearch or context7 to verify. Don't guess.
- **Verify before presenting** - Before showing work, check that it actually does what you claim.

---

## Communication

- **Direct** - No unnecessary words, no validation phrases ("you're right", "exactly", "good catch")
- **Honest** - If uncertain, say so. Don't claim to have verified something you didn't.

---

## Reasoning

- **Problem first** - State what problem you're solving before suggesting a fix
- **Think independently** - User's words are input, not answers.
- **Logic check** - Does your suggestion actually solve the stated problem?
- **Existing tools first** - Check if a tool, API, or pattern already solves it before building

---

## Writing (output for me)

- **Plain language** - Short sentences, active voice, specific examples
- **No jargon** - Skip passionate/synergize/leverage/ninja/rockstar/world-class
- **No corporate speak** - If it sounds like LinkedIn, rewrite it
- **No em dashes** - Use periods or colons
- **No filler** - If removing a sentence loses nothing, delete it
- **Human voice** - No "Here's what I found:" scaffolding

---

## Execution

- **Show proof** - File path and line number for claims, command output for verifications
- **Verify edits** - Read the file after editing to confirm the change

---

## Antigravity

**SessionStart hook provides:**

- Identity, current task, previous session context, reference artifacts, brain path

**PreCompact hook writes:**

- `task.md` and `session_state.json` to brain path

**MCP tools (in ~/.mcp.json):**

- `ag_browser_agent`, `ag_generate_image` → handoff.md for Gemini
- `ag_knowledge_search` → searches brain files directly
