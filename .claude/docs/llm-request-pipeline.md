# How the LLM Request Pipeline Works

**Purpose:** Reference for understanding what gets sent to Claude, where it goes, and what it costs. Written for someone who doesn't have a deep technical background.

**Last updated:** 2026-03-16

---

## The Big Picture

Claude is stateless. Every time you send a message, Claude Code (the app on your Mac) builds a **single JSON package** and sends it over the internet to Anthropic's servers. Claude processes it, responds, then **forgets everything**. Next message, Claude Code sends the whole package again with the new message added.

```
Your Mac (Claude Code)  →→→  Internet  →→→  Anthropic's Servers (Claude)
                                                     │ responds
Your Mac (Claude Code)  ←←←  Internet  ←←←  Anthropic's Servers
```

---

## The Package: Three Fields

Every request is one JSON object with three fields:

```json
{
  "system":   "instructions for Claude (one big string)",
  "messages": [ the full conversation history ],
  "tools":    [ what Claude is allowed to do ]
}
```

That's it. There is nothing else. Everything you send to Claude must fit into one of these three fields.

---

## Field 1: `system` — The Instructions

A single string containing all behavioral instructions. Sent identically on every turn.

**What's in it:**
- Anthropic's built-in Claude Code instructions (~50k tokens)
- Your `system-prompt.md` (appended at the end via `--append-system-prompt`)

**What's NOT in it (common misconception):**
- CLAUDE.md files — these go in `messages`, not `system`
- Hook outputs — these also go in `messages`

**Cost type:** Fixed. Same size every turn. Optimizing this saves tokens on every single message.

**Your content here:** `~/.claude/system-prompt.md` (~2k tokens) — methodology, lenses, design thinking, teaching format.

---

## Field 2: `messages` — The Conversation

An array of alternating `user` and `assistant` messages. This is where the conversation lives, AND where most of your framework content gets injected.

### How it grows over a session

**Turn 1 — you say "hello":**
```json
"messages": [
  { "role": "user", "content": "[hook outputs] [CLAUDE.md content] hello" }
]
```

**Turn 2 — you say "what files?":**
```json
"messages": [
  { "role": "user",      "content": "[hook outputs] [CLAUDE.md] hello" },
  { "role": "assistant",  "content": "Hi! What are we working on?" },
  { "role": "user",      "content": "[per-prompt hook outputs] what files?" }
]
```

**Turn 10:**
```json
"messages": [
  { "role": "user",      "content": "[hooks] [CLAUDE.md] hello" },
  { "role": "assistant",  "content": "Hi! What are we working on?" },
  { "role": "user",      "content": "[hooks] what files?" },
  { "role": "assistant",  "content": "[Read tool call] [file contents]" },
  { "role": "user",      "content": "[tool result: 500 lines of code]" },
  { "role": "assistant",  "content": "Here's what I found..." },
  ... 8 more turns, each adding to the array ...
]
```

**Key insight:** The entire conversation is sent every time. It only grows, never shrinks — until compaction happens.

### What goes into messages (and when)

**Once, at session start (first message only):**

| Source | What it injects | Size |
|--------|----------------|------|
| `session-context.js` | Identity, learnings, handoff | ~1,500-3,500 tokens |
| `session-init.cjs` | Project context, sync warnings | ~50-300 tokens |
| `spawn-context-agent.cjs` | Trigger instruction | ~50 tokens |
| Root `CLAUDE.md` | Project architecture, hooks docs | ~3,500 tokens |
| `.claude/CLAUDE.md` | Project rules, workflow | ~1,000 tokens |

**Every turn (attached to each of your messages):**

| Source | What it injects | When | Size |
|--------|----------------|------|------|
| `inject-context.cjs` | Command suggestions, voice profile, spec triggers, methodology | When patterns match your message | 0-2,000 tokens |
| `awareness.cjs` | System health warnings | When thresholds exceeded | 0-200 tokens |
| `capture-corrections.cjs` | Correction confirmation | When correction detected | ~20 tokens |

**As conversation grows (tool results):**

This is the one most people miss. When Claude uses a tool, the result goes into the messages array:

| Action | What gets added | Size |
|--------|----------------|------|
| Read a file | Entire file content | Varies (could be 5k+ tokens) |
| Run a bash command | Full command output | Varies |
| Edit a file | Confirmation + diff | ~200-500 tokens |
| Search (Grep/Glob) | All matching results | Varies |
| Web fetch | Fetched page content | Can be very large |

**This is why long sessions get expensive.** Every file read, every bash output, every search result — it all stays in the conversation forever (until compaction).

### What does NOT add tokens to messages

These hooks write to files or block actions only — they don't inject context:

| Hook | What it does | Token cost |
|------|-------------|------------|
| `block-dangerous.cjs` | Blocks dangerous commands | 0 (stderr only) |
| `enforce-skills.cjs` | Blocks raw git commit | 0 (stderr only) |
| `enforce-specs.cjs` | Blocks edits until specs read | 0 (stderr only) |
| `enforce-plan.cjs` | Blocks issue creation | 0 (stderr only) |
| `tool-tracker.cjs` | Writes to tracking files | 0 (silent) |
| `track-changes.cjs` | Writes to tracking files | 0 (silent) |
| `command-log.cjs` | Writes to tracking files | 0 (silent) |
| `subagent-tracker.cjs` | Writes to tracking files | 0 (silent) |
| `tool-failure.cjs` | Writes to tracking files | 0 (silent) |

**Note on blocking hooks:** When a hook blocks an action (exit code 2), the error message appears in the conversation as a tool error. So blocking hooks have a small token cost when they fire, but zero cost when they don't.

---

## Field 3: `tools` — What Claude Can Do

An array of tool definitions. Each tool has a name, description, and parameter schema.

**What's in it:**
- Built-in tools (Read, Write, Edit, Bash, Glob, Grep, Agent, etc.)
- MCP server tools (context7, antigravity, etc.)
- Skill definitions

**Cost type:** Fixed. Same every turn. Each MCP server you connect adds more tool definitions.

**Optimization note:** MCP servers you rarely use still cost tokens every turn just by being connected. Disconnect servers you don't actively need.

---

## The Full Cost Breakdown

### At session start (Turn 1)

```
system field:
  Anthropic instructions ........... ~50,000 tokens (fixed, can't change)
  Your system-prompt.md ............. ~2,000 tokens (yours to optimize)

messages field:
  session-context.js output ........ ~1,500-3,500 tokens (once)
  session-init.cjs output .......... ~50-300 tokens (once)
  CLAUDE.md (root) ................. ~3,500 tokens (once)
  .claude/CLAUDE.md ................ ~1,000 tokens (once)
  Your first message ............... varies

tools field:
  Built-in tools ................... ~2,000 tokens (fixed)
  MCP tools ........................ varies per server (fixed)

TOTAL AT START: ~60,000-63,000 tokens before you say anything
```

### Per turn (Turn N)

```
system field:  same ~52,000 tokens (always)
tools field:   same (always)
messages field: all previous turns + new hook injections + your new message

Growing costs per turn:
  Your message ..................... varies
  inject-context.cjs output ....... 0-2,000 tokens (conditional)
  Claude's response ............... varies
  Tool results (file reads, etc.).. varies (can be very large)
```

### When compaction happens

At ~75% of context window (750k tokens at 1M), Claude Code summarizes older messages. The conversation gets compressed:

```
Before compaction:
  messages: [100 detailed turns taking 600k tokens]

After compaction:
  messages: [summary of older turns (~5k tokens)] + [recent turns kept intact]
```

Details can be lost. Claude Code natively reloads system-prompt.md, CLAUDE.md, and memory/ after compaction. Use /handoff before long breaks to capture richer context.

---

## Where to Optimize (Priority Order)

### 1. `system-prompt.md` (saves every turn)
Every token you cut here is saved on every single message. This is the highest-leverage optimization. Keep only what drifts in long sessions — everything else can go in CLAUDE.md.

### 2. UserPromptSubmit hooks (saves every turn)
`inject-context.cjs` runs on every prompt. Make sure its conditional logic is tight — only inject when actually relevant.

### 3. MCP server connections (saves every turn)
Disconnect MCP servers you're not actively using. Each one adds tool definitions to every request.

### 4. CLAUDE.md files (saves on session start)
These are one-time costs, so less critical with 1M context. But keeping them lean means more room for actual work.

### 5. SessionStart hooks (saves on session start)
`session-context.js` is one-time. Worth keeping lean but lower priority than per-turn costs.

### 6. During session — be mindful of tool results
Reading large files, running verbose commands, fetching web pages — these all stay in the conversation. Not something to "optimize" exactly, but good to be aware that each tool use has a token cost that persists.

---

## Quick Reference

**Q: Does the system prompt get repeated in every message?**
No. It's in its own field, sent alongside messages. Sent once per request, not duplicated into each message.

**Q: Does the whole conversation really get sent every time?**
Yes. Every turn you've said, every response Claude gave, every tool result — all of it, every time.

**Q: Where does CLAUDE.md go?**
Into the `messages` field as a user message, NOT into the `system` field. It looks like context, not enforced rules.

**Q: Where do hook outputs go?**
Into the `messages` field, wrapped in `<system-reminder>` tags. They look like user messages to the API.

**Q: What costs the most?**
Anthropic's base system prompt (~50k tokens). You can't change this. Of the things you CAN change, `system-prompt.md` and per-turn hooks have the most impact because they repeat every turn.

---

## What's Universal vs. Claude-Specific

Most of this guide applies to any LLM API. The core pattern — stateless requests with system instructions, conversation history, and tool definitions — is an industry standard used by OpenAI (GPT), Google (Gemini), Mistral, Cohere, and others. If you understand this for Claude, you understand it for all of them.

### Universal (applies to all LLM APIs)

- **Stateless** — every request sends the full conversation. The model forgets after every response.
- **Three parts** — system instructions, conversation history, and tool definitions. Every major API has these.
- **Conversation grows** — each turn adds to the history. More turns = more tokens.
- **Tool results stay in conversation** — file reads, command output, search results all persist in the history.
- **Context window limit** — every provider has a maximum. When you hit it, older content must be summarized or dropped.
- **Token cost structure** — system instructions are fixed per turn, conversation grows, tool definitions are fixed per turn.

### Varies by provider (same concept, different packaging)

**Where the system prompt lives:**

Anthropic puts it in its own dedicated field:
```json
{
  "system": "You are a helpful assistant...",
  "messages": [
    { "role": "user", "content": "hello" }
  ]
}
```

OpenAI puts it inside the messages array as the first message:
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant..." },
    { "role": "user", "content": "hello" }
  ]
}
```

Same idea — the model gets instructions + conversation. Just packaged differently.

**Other differences by provider:**

| What | Anthropic (Claude) | OpenAI (GPT) | Google (Gemini) |
|------|-------------------|--------------|-----------------|
| System prompt location | Separate `system` field | Message with `role: "system"` | `systemInstruction` field |
| Tool call format | `tool_use` content block | `function_call` in assistant message | `functionCall` in parts |
| Image handling | Base64 in message content | Base64 or URL in message content | Inline or file reference |
| Context window | Up to 1M tokens | Up to 128k-1M tokens (varies by model) | Up to 1M-2M tokens |

### Claude Code specific (does NOT apply to other setups)

These are features of Claude Code (the app on your Mac), not the LLM API itself:

- **Hooks** (SessionStart, UserPromptSubmit, PreToolUse, etc.) — Claude Code's automation system
- **CLAUDE.md auto-loading** — Claude Code reads these files and injects them into messages
- **`<system-reminder>` tags** — how Claude Code wraps injected content
- **`--append-system-prompt`** — Claude Code's mechanism for adding to the system field
- **Built-in tools** (Read, Edit, Glob, Grep, Agent) — Claude Code's tool definitions
- **Compaction at ~75%** — Claude Code's specific strategy for managing context

Other AI coding tools (Cursor, Windsurf, Copilot) have their own equivalents of these features, but the mechanisms are different. For example, Cursor uses `.cursor/rules/` files instead of CLAUDE.md, and Windsurf uses `~/.codeium/windsurf/memories/`.

**For VOIR:** The pipeline concepts are universal, but the injection and capture mechanisms are tool-specific. This is why VOIR uses the adapter pattern — same data model, different per-tool implementations for how to read and write context.

---

*This is a reference document. See `prompt-format-guide.md` for the technical input format details.*
