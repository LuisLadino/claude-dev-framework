# Framework Wiring

How the claude-dev-framework components connect and interact.

---

## Overview Diagram

```mermaid
graph TB
    subgraph "User Interaction"
        user[User Prompt]
        commands[/commands/]
        skills[/skills/]
    end

    subgraph "Hooks System"
        pre[PreToolUse Hooks]
        post[PostToolUse Hooks]
        session[SessionStart/End]
        prompt[UserPromptSubmit]
    end

    subgraph "Enforcement"
        enforce_specs[enforce-specs.cjs]
        enforce_plan[enforce-plan.cjs]
        enforce_skills[enforce-skills.cjs]
        block[block-dangerous.cjs]
    end

    subgraph "Tracking"
        tool_track[tool-tracker.cjs]
        changes[track-changes.cjs]
        spec_reads[track-spec-reads.cjs]
    end

    subgraph "State"
        session_state[session-state.json]
        brain[Brain Artifacts]
    end

    subgraph "Specs"
        stack[stack-config.yaml]
        claude_code[claude-code/*]
        config[config/*]
    end

    user --> prompt
    prompt --> skills
    commands --> pre

    pre --> enforce_specs
    pre --> enforce_plan
    pre --> enforce_skills
    pre --> block

    enforce_specs --> session_state
    enforce_plan --> session_state
    spec_reads --> session_state

    post --> tool_track
    post --> changes
    post --> spec_reads

    tool_track --> brain
    session --> brain

    enforce_specs -.-> stack
    enforce_specs -.-> claude_code
```

---

## Hook Event Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Claude
    participant H as Hooks
    participant S as State

    U->>H: UserPromptSubmit
    H->>S: clear-pending.cjs clears flags
    H->>C: inject-context.cjs adds context

    C->>H: PreToolUse (Edit)
    H->>S: Check pendingEdit
    alt Spec not read
        H-->>C: DENY - read spec first
    else Spec was read
        H-->>C: ALLOW
    end

    C->>H: PostToolUse (Read spec)
    H->>S: track-spec-reads.cjs sets pendingEdit

    C->>H: PostToolUse (Edit)
    H->>S: track-changes.cjs logs change
```

---

## State Management

| File | Purpose | Updated By |
|------|---------|------------|
| `.claude/session-state.json` | Per-prompt flags (pendingEdit, pendingIssue) | enforce-specs, track-spec-reads, clear-pending |
| `brain/{uuid}/session_state.json` | Cross-session state | pre-compact.js |
| `brain/learnings.md` | Persistent learnings | pre-compact.js |

---

## Enforcement Chain

```
Edit/Write Tool Call
       │
       ▼
enforce-specs.cjs
       │
       ├─ Check file type → Determine required spec
       │
       ├─ Check session-state.json → Is pendingEdit set for this type?
       │
       └─ Exit 0 (allow) or Exit 2 (deny)
```

---

## Spec Loading

```
/start-task invoked
       │
       ▼
Read stack-config.yaml
       │
       ├─ specs.claude-code → tools, hooks, skills, agents, anti-patterns
       │
       └─ specs.config → version-control
       │
       ▼
track-spec-reads.cjs sets pendingEdit
       │
       ▼
Edits allowed for this prompt
```

---

## Key Connections

| Component | Depends On | Used By |
|-----------|------------|---------|
| enforce-specs.cjs | session-state.json | PreToolUse (Edit\|Write) |
| track-spec-reads.cjs | FILE_TO_SPEC mapping | PostToolUse (Read) |
| clear-pending.cjs | session-state.json | UserPromptSubmit |
| session-init.cjs | session-utils.cjs | SessionStart |
| tool-tracker.cjs | brain/tracking/sessions/ | PostToolUse (*) |
