# Contributing to Claude Kit

Thank you for your interest in contributing.

---

## Ways to Contribute

### Report Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/LuisLadino/claude-kit/issues).

Include:
- Clear description of the problem
- Steps to reproduce (for bugs)
- Expected vs actual behavior

### Suggest Features

Open an issue with:
- **Use case** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternatives** - What other approaches did you consider?

### Improve Skills or Commands

Skills live in `.claude/skills/{skill-name}/SKILL.md`. Commands in `.claude/commands/`.

Current skills: research, define, ideate, build, test, review, commit, plan, handoff, contribute-to-opensource.

Current commands: init-project, sync-stack, learn, analyze, audit.

### Improve Hooks

Hooks live in `.claude/hooks/` organized by purpose:
- `safety/` - Security, enforcement
- `tracking/` - Observability
- `context/` - Context injection
- `quality/` - Quality checks
- `lifecycle/` - Phase evaluation

All hooks use `.cjs` extension (CommonJS, works regardless of package.json `type`).

---

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR-USERNAME/claude-kit.git
cd claude-kit
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

Key rules:
- **Everything must be project-agnostic.** This kit syncs to projects with different stacks. Don't hardcode paths, assume Node.js, or reference files that only exist in this repo.
- **Read the relevant spec before editing.** The enforce-specs hook will block you otherwise.
- **Use `/commit` to commit.** The enforce-skills hook blocks raw `git commit`.

### 4. Test

- Verify your changes work in this repo
- Consider: will this work in a Python project? A Swift project? A brand new project with no setup?
- Run the hook manually if you changed one: `echo '{"tool_name":"Bash","tool_input":{"command":"test"}}' | node .claude/hooks/your-hook.cjs`

---

## Structure

```
.claude/
├── CLAUDE.md              # Kit instructions (synced to all projects)
├── skills/                # Phase skills (SKILL.md format)
├── hooks/                 # Automation (.cjs files)
│   ├── safety/
│   ├── tracking/
│   ├── context/
│   ├── quality/
│   ├── lifecycle/
│   ├── lib/               # Shared utilities (session-utils.cjs)
│   └── config/            # security-patterns.json
├── commands/              # Slash commands (.md files)
├── agents/                # Agent definitions
└── specs/                 # Project rules and patterns
```

### Kit-owned vs Project-specific

**Kit-owned (synced from this repo):** skills/, hooks/, commands/, agents/, CLAUDE.md

**Project-specific (never overwrite):** specs/, docs/, research/, session-state.json, settings.local.json

---

## Commit Messages

Format: `type: description`

Types: feat, fix, docs, refactor, chore, test

```bash
feat: add Python debug pattern detection
fix: resolve yaml dependency crash in track-spec-reads
chore: update system map after hook changes
```

---

## Questions?

- [Open an issue](https://github.com/LuisLadino/claude-kit/issues)
- [Start a discussion](https://github.com/LuisLadino/claude-kit/discussions)
