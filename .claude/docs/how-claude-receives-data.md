# How Claude Receives Data

**Purpose:** Explain the fundamental architecture of how data flows from your system to Claude's context window. This is the ground truth for understanding and improving the framework.

**Last updated:** 2026-03-16
**Sources:** Anthropic API docs, Claude Code docs, agent research

---

## The Simple Truth

Claude is stateless. Every single request is a fresh start.

```
┌──────────────────────────────────────────────────────────────┐
│                    EACH API REQUEST                          │
├──────────────────────────────────────────────────────────────┤
│  You send:                                                   │
│  {                                                           │
│    "system": "instructions for Claude",                      │
│    "messages": [ full conversation history ],                │
│    "tools": [ all tool definitions ]                         │
│  }                                                           │
│                                                              │
│  Claude returns:                                             │
│  {                                                           │
│    "content": "response"                                     │
│  }                                                           │
│                                                              │
│  Then Claude forgets everything.                             │
│  Next request must send everything again.                    │
└──────────────────────────────────────────────────────────────┘
```

Claude Code handles this for you - it maintains the conversation and sends the full history each time.

---

## The Three Parts of Every Request

### Part 1: System Prompt

The `system` field. Instructions that shape Claude's behavior.

**What goes here:**
- Anthropic's built-in Claude Code instructions (~110 conditional fragments)
- Your `--append-system-prompt` content (system-rules.md)
- Tool policies and behavioral rules

**Key fact:** This is the ONLY part that has "authority" over Claude's behavior. Everything else is just context Claude reads.

### Part 2: Messages Array

The `messages` field. The conversation history.

**Structure:**
```json
{
  "messages": [
    {"role": "user", "content": "hook output + CLAUDE.md content"},
    {"role": "assistant", "content": "Claude's response"},
    {"role": "user", "content": "your next prompt"},
    ...
  ]
}
```

**Critical insight:** CLAUDE.md files are injected as USER MESSAGES, not system prompt. They're context Claude reads, not enforced configuration.

### Part 3: Tools Array

The `tools` field. Definitions of what Claude can do.

**Includes:**
- Built-in tools (Read, Write, Edit, Bash, Glob, Grep, etc.)
- MCP server tools (context7, antigravity, etc.)
- Skill definitions

---

## Mermaid Diagrams

### Diagram 1: API Request Structure

```mermaid
flowchart TB
    subgraph Request["API REQUEST TO ANTHROPIC"]
        direction TB

        subgraph System["system (string)"]
            S1["Claude Code base prompt<br/>~110 conditional fragments"]
            S2["--append-system-prompt<br/>system-rules.md"]
        end

        subgraph Messages["messages (array)"]
            M1["role: user<br/>SessionStart hook output"]
            M2["role: user<br/>CLAUDE.md content"]
            M3["role: user<br/>Your actual prompt"]
            M4["role: assistant<br/>Claude's response"]
            M5["...continues..."]
        end

        subgraph Tools["tools (array)"]
            T1["Built-in: Read, Write, Edit, Bash..."]
            T2["MCP: context7, antigravity..."]
            T3["Skills: commit, plan..."]
        end
    end

    Request --> Claude["CLAUDE<br/>(processes everything as one blob)"]
    Claude --> Response["Response"]
```

### Diagram 2: Session Start Sequence

```mermaid
sequenceDiagram
    participant You as You (terminal)
    participant CC as Claude Code
    participant Hooks as Your Hooks
    participant API as Anthropic API
    participant Claude as Claude (LLM)

    You->>CC: Run `cc` (your alias)

    Note over CC: Load settings
    CC->>CC: Read ~/.claude/settings.json
    CC->>CC: Read .claude/settings.json
    CC->>CC: Merge settings (managed > user > project)

    Note over CC: Build system prompt
    CC->>CC: Assemble 110+ fragments
    CC->>CC: Append system-rules.md

    Note over CC: Fire SessionStart hooks
    CC->>Hooks: session-context.js
    Hooks-->>CC: additionalContext JSON
    CC->>Hooks: session-init.cjs
    Hooks-->>CC: additionalContext JSON
    CC->>Hooks: spawn-context-agent.cjs
    Hooks-->>CC: additionalContext JSON (trigger)

    Note over CC: Load CLAUDE.md files
    CC->>CC: Walk up directory tree
    CC->>CC: Load each CLAUDE.md found
    CC->>CC: Load .claude/rules/*.md

    Note over CC: Build tools array
    CC->>CC: Add built-in tools
    CC->>CC: Add MCP server tools
    CC->>CC: Add skill definitions

    Note over CC: Assemble final request
    CC->>API: POST /v1/messages
    API->>Claude: Full request (system + messages + tools)
    Claude-->>API: Response
    API-->>CC: Response
    CC-->>You: Display response
```

### Diagram 3: What Claude Actually Sees

```mermaid
flowchart TD
    subgraph Invisible["INVISIBLE TO HOOKS (System Prompt)"]
        SP1["Claude Code base instructions"]
        SP2["Tool usage policies"]
        SP3["Your system-rules.md<br/>(methodology, lenses, format)"]
    end

    subgraph Visible["VISIBLE (User Messages)"]
        direction TB

        subgraph Hook1["<system-reminder> #1"]
            H1A["SessionStart:startup hook success"]
            H1B["[ANTIGRAVITY SESSION CONTEXT]"]
            H1C["User: Luis Ladino"]
            H1D["Previous Session: ..."]
            H1E["[LEARNINGS - READ AND APPLY]"]
            H1F["[FRAMEWORK ISSUES]"]
            H1G["[HANDOFF FROM PREVIOUS SESSION]"]
        end

        subgraph Hook2["<system-reminder> #2"]
            H2A["SessionStart:startup hook success: Success"]
        end

        subgraph Hook3["<system-reminder> #3"]
            H3A["[CONTEXT AGENT] Spawn context-agent..."]
        end

        subgraph CLAUDE["<system-reminder> #4 - CLAUDE.md"]
            C1["Contents of CLAUDE.md"]
            C2["Project architecture"]
            C3["Framework overview"]
            C4["Slash commands"]
            C5["Hooks documentation"]
            C6["---"]
            C7["Contents of .claude/CLAUDE.md"]
            C8["Rules"]
            C9["Workflow"]
            C10["Specs"]
        end

        UP["Your actual prompt"]
    end

    Invisible --> Claude["Claude processes all as ONE input"]
    Visible --> Claude
```

### Diagram 4: Hook Output Injection

```mermaid
flowchart LR
    subgraph Hooks["YOUR HOOKS"]
        H1["session-context.js"]
        H2["session-init.cjs"]
        H3["spawn-context-agent.cjs"]
        H4["inject-context.cjs"]
    end

    subgraph Output["HOOK OUTPUT"]
        O1["stdout: JSON with<br/>additionalContext field"]
        O2["OR plain text<br/>(SessionStart only)"]
        O3["OR exit code 2<br/>+ stderr (blocks)"]
    end

    subgraph ClaudeCode["CLAUDE CODE"]
        CC1["Parses JSON output"]
        CC2["Wraps in<br/>&lt;system-reminder&gt; tags"]
        CC3["Adds to messages array"]
    end

    subgraph API["API REQUEST"]
        API1["messages: [<br/>  {role: 'user', content: '...'},<br/>  ...<br/>]"]
    end

    H1 --> O1
    H2 --> O1
    H3 --> O1
    H4 --> O1

    O1 --> CC1
    O2 --> CC2
    CC1 --> CC2
    CC2 --> CC3
    CC3 --> API1
```

### Diagram 5: Your Current Session Start (The Problem)

```mermaid
flowchart TD
    subgraph Sources["WHAT GETS LOADED"]
        S1["session-context.js<br/>~160 lines"]
        S2["CLAUDE.md (root)<br/>~400 lines"]
        S3[".claude/CLAUDE.md<br/>~100 lines"]
        S4["Other hooks<br/>~10 lines"]
    end

    subgraph Content["WHAT THEY CONTAIN"]
        C1["Identity<br/>Background<br/>Goals<br/>Projects"]
        C2["Architecture<br/>Hooks docs<br/>Commands<br/>Workflow"]
        C3["Architecture<br/>Hooks docs<br/>Commands<br/>Workflow"]
        C4["Session init<br/>Context agent trigger"]
    end

    subgraph Problem["THE PROBLEM"]
        P1["Architecture: DUPLICATED"]
        P2["Hooks docs: DUPLICATED"]
        P3["Commands: DUPLICATED"]
        P4["14 handoff files: LISTED BUT NOT READ"]
        P5["No priority ordering"]
    end

    S1 --> C1
    S2 --> C2
    S3 --> C3
    S4 --> C4

    C2 --> P1
    C3 --> P1
    C2 --> P2
    C3 --> P2
    C2 --> P3
    C3 --> P3
    C1 --> P4

    Sources --> Total["~670 lines before you even say anything"]
```

### Diagram 6: Context Window Budget

```mermaid
pie title Token Budget at Session Start (Estimated)
    "System prompt (Claude Code)" : 5000
    "System prompt (your rules)" : 2000
    "session-context.js output" : 3000
    "CLAUDE.md (root)" : 4000
    "CLAUDE.md (.claude)" : 1500
    "Tool definitions" : 2000
    "Available for actual work" : 182500
```

### Diagram 7: Ideal vs Current Architecture

```mermaid
flowchart LR
    subgraph Current["CURRENT (Wasteful)"]
        direction TB
        CU1["session-context.js<br/>Everything at once"]
        CU2["CLAUDE.md #1<br/>Full docs"]
        CU3["CLAUDE.md #2<br/>Overlapping docs"]
        CU4["No signal priority"]
    end

    subgraph Ideal["IDEAL (Lean)"]
        direction TB
        ID1["Identity + Current task<br/>(what matters NOW)"]
        ID2["Project rules<br/>(just the rules)"]
        ID3["Learnings<br/>(top 5 most relevant)"]
        ID4["Everything else<br/>on-demand via agents"]
    end

    Current --> |"~670 lines"| Start1["Session Start"]
    Ideal --> |"~100 lines"| Start2["Session Start"]
```

---

## The Order of Operations

### At Session Start

| Order | What Happens | Source | Output |
|-------|--------------|--------|--------|
| 1 | Load managed settings | MDM/registry | Config |
| 2 | Load user settings | ~/.claude/settings.json | Config |
| 3 | Load project settings | .claude/settings.json | Config |
| 4 | Build system prompt | 110+ fragments + system-rules.md | System field |
| 5 | Fire SessionStart hooks | Your hooks run in parallel | additionalContext |
| 6 | Load CLAUDE.md files | Walk up directory tree | User messages |
| 7 | Load rules | .claude/rules/*.md | User messages |
| 8 | Build tools array | Built-in + MCP + skills | Tools field |
| 9 | Assemble request | Combine all above | API request |
| 10 | Send to API | POST /v1/messages | Response |

### On Each User Prompt

| Order | What Happens | Source | Output |
|-------|--------------|--------|--------|
| 1 | Fire UserPromptSubmit hooks | Your hooks | additionalContext |
| 2 | Add to conversation history | Your prompt | Messages array |
| 3 | Send full conversation | System + all messages + tools | API request |
| 4 | Receive response | Claude's output | Display to you |
| 5 | Fire PostToolUse hooks | If tools were used | Tracking/injection |

---

## Key Insights

### 1. CLAUDE.md Has Less Authority Than You Think

It's loaded as a user message, not system prompt. Claude reads it as context, not as enforced rules. If you want something enforced, it needs to be in:
- The system prompt (system-rules.md)
- A hook that blocks actions (exit code 2)

### 2. Everything Is Text

There's no magic injection mechanism. Hooks output text, Claude Code wraps it in tags, it becomes part of the messages array. Claude sees one big text input.

### 3. Hooks Run in Parallel

Multiple hooks for the same event run simultaneously, not sequentially. They all get the same input and their outputs are combined.

### 4. The API Is Stateless

Every request sends the FULL conversation. Claude Code manages this, but it means your context grows with each turn until compaction happens.

### 5. Compaction Is Lossy

When context gets too big (~75%), Claude Code summarizes older parts. Details can be lost. Important things should be in files that can be re-read, not just conversation history.

---

## Files That Matter

| File | What It Does | When Loaded |
|------|--------------|-------------|
| `~/.claude/settings.json` | Hook configuration | Session start |
| `~/.claude/system-rules.md` | Your methodology/rules | Session start (system prompt) |
| `~/.gemini/antigravity/scripts/session-context.js` | Identity, learnings, handoff | Session start (hook) |
| `CLAUDE.md` | Project context | Session start (user message) |
| `.claude/CLAUDE.md` | Project rules | Session start (user message) |
| `~/.gemini/antigravity/brain/learnings.md` | Persistent learnings | Read by session-context.js |
| `~/.gemini/antigravity/brain/{uuid}/handoff.md` | Previous session context | Read by session-context.js |

---

## Recommendations

### Immediate Fixes (Issue #28)

1. **Deduplicate CLAUDE.md** - Don't have two files with overlapping content
2. **Summarize handoffs** - Show count + most recent, not all 14 paths
3. **Priority order** - Most important info first (current task, blockers)
4. **Token budget** - Target max 2000 tokens for session context

### Architecture Improvements

1. **Move docs to on-demand** - Don't load hooks documentation at session start. Load when editing hooks.
2. **Lean CLAUDE.md** - Just rules. No documentation.
3. **Use agents** - Context Agent can fetch detailed context when needed, not upfront
4. **Rules directory** - Use .claude/rules/*.md with file pattern scoping to load only relevant rules

---

*This document is the ground truth. Update it when architecture changes.*
