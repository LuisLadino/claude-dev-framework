# Changelog

All notable changes to the Claude Development Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Per-prompt spec enforcement** - Enforcement now requires reading specs before EACH prompt's edits, not just once per session. Prevents context drift during long sessions:
  - `enforce-specs.cjs` - Maps file types to required specs (hooks→hooks.md, skills→skills.md, etc.)
  - `track-spec-reads.cjs` - Sets `pendingEdit` type when spec is read
  - `clear-pending.cjs` - Clears pending flags at UserPromptSubmit (start of each prompt)
  - Multiple edits allowed within same prompt after reading spec

- **Plan enforcement hook** - `enforce-plan.cjs` blocks `gh issue create` until plan skill is read. Ensures GitHub issues have proper context (Problem, Why It Matters sections) so future sessions understand WHY work was done.

- **Problem-first issue creation** - Updated plan skill requires understanding the problem before creating issues. Issues must document reasoning, not just tasks. Added Issue Lifecycle section showing how issues evolve from creation through PR/close.

- **Agent hook documentation** - Added `type: "agent"` hook format to hooks.md spec. Documents prompt, timeout, model fields and differences from command hooks.

- **Claude Code specs** - Self-referential specs that document Claude Code internals:
  - `claude-code/tools.md` - All available tools, parameters, capabilities
  - `claude-code/hooks.md` - Hook schemas, exit codes, matchers, events
  - `claude-code/skills.md` - Skill frontmatter, triggering behavior
  - `claude-code/agents.md` - Agent frontmatter, tool permissions, models
  - `claude-code/anti-patterns.md` - What doesn't work, behavioral issues to avoid
  - Addresses Issue #5: specs that help Claude understand its own capabilities

- **Skill enforcement hook** - `enforce-skills.cjs` blocks direct `git commit`, requiring Skill tool invocation instead. Workaround for known skill undertrigger problem (~20% activation rate). Ensures commit workflow includes proper checks (version-control.md, CHANGELOG updates, etc.).

- **Unified commit skill** - Merged commit and PR skills into one flow: commit → push → PR → auto-merge. Removed separate pr skill. Matches solo developer workflow where commit = done.

- **Auto-merge support** - Commit skill enables auto-merge with `gh pr merge --auto --squash --delete-branch`. PRs merge automatically after checks pass.

- **CI workflow generation in /sync-stack** - Generates `.github/workflows/ci.yml` based on detected stack. Templates for Node.js (build, lint, test), Python (pytest, ruff), and config projects (YAML/JSON validation). Enables auto-merge workflow.

- **Claude task system for design thinking stages** - Tasks persist across sessions and represent design thinking phases:
  - Context Agent and Task Agent now check task state via TaskList/TaskGet
  - Task Agent recommends task_actions (create, complete, start)
  - Injection hooks include task_state in context
  - Design thinking phases (understand, define, ideate, prototype, test) as tasks with dependencies
  - Enable with `CLAUDE_CODE_TASK_LIST_ID` env var in settings.json

- **Agent hooks for lifecycle management** - Design thinking agents that shape Claude's approach:
  - `context-agent.md` - SessionStart agent evaluates project phase, gaps, lenses, GitHub state
  - `task-agent.md` - UserPromptSubmit agent evaluates each task through design thinking micro-cycle
  - `phase-evaluator.md` - PostToolUse (commit) agent checks for phase transitions
  - `inject-context-from-file.cjs` - Injects Context Agent output as additionalContext
  - `inject-task-framing.cjs` - Injects Task Agent output as additionalContext
  - `apply-phase-update.cjs` - Applies Phase Evaluator recommendations to project-definition.yaml
- **Lifecycle directory** - New `.claude/hooks/lifecycle/` for phase management hooks
- **Agent hooks documentation** - README.md updated with agent hooks architecture and trade-offs

### Changed

- **Context Agent** - Rewritten to output JSON to `.claude/current-context.json` for hook injection
- **Task Agent** - Rewritten to output JSON to `.claude/current-task.json` for hook injection
- **settings.json** - Added agent hooks for SessionStart, UserPromptSubmit, and PostToolUse (commit)

### Previous

- **Skills system** - Converted commands to skills that auto-trigger from natural language:
  - `start-task` - triggers on "let's work on", "implement", "build", issue references
  - `commit` - triggers on "let's commit", "save this", "checkpoint"
  - `pr` - triggers on "create PR", "ready for review", "let's merge"
  - `add-feature` - triggers on "plan", "design", "break down"
  - `plan` - NEW skill for GitHub issue management, backlog, milestones
- **Development workflow documentation** - Two-phase workflow (Setup + Development) documented in .claude/CLAUDE.md
- **Project management integration** - start-task moves issues to "In Progress", pr ensures "Closes #X" for auto-close

### Changed

- **`.claude/CLAUDE.md`** - Replaced Commands section with Skills section, added Development Workflow
- **commit skill** - Now includes documentation update step to prevent doc drift

### Previous

- **`/analyze` command** - Framework analyst agent that runs in split terminal. Does both technical analysis (hooks working, data flowing) AND qualitative analysis (goals aligned, teaching landing). Applies design thinking to iterate on the framework.
- **Full prompt capture** - `inject-context.js` now logs complete prompts (not just 80 chars) for analyst to evaluate hook trigger accuracy.
- **`/reflect` command** - Analyzes session data, patterns, and learnings to identify improvements. Reads tracking data, generates report with suggested changes, user approves before writing to brain files.
- **Awareness hook (`awareness.js`)** - Detects conditions warranting /reflect: large files (learnings.md >200 lines), failures accumulating (5+), long sessions without checkpoint (60+ min). Prompts gently with 30min cooldown per warning type.
- **Universal tracking hooks** - New observability layer:
  - `tool-tracker.js` - Logs ALL tool calls (Skills, MCP, Read, Edit, etc.)
  - `tool-failure.js` - Logs failed tool calls for debugging
  - `session-end.js` - Writes session summary and updates session_state.json
  - `subagent-tracker.js` - Tracks subagent spawn/finish with duration
- **Feedback loop** - System now has: Capture (tracking hooks) → Detect (awareness.js) → Decide (/reflect) → Act (write to brain)
- **SYSTEM-AUDIT.md** - Comprehensive audit of system components and their status
- **Architecture documentation** - Root CLAUDE.md now includes Purpose, Architecture Overview, Data Flow diagram, Feedback Loop diagram, Brain Structure

### Changed

- **`.claude/CLAUDE.md`** - Added "Why This System Exists" section explaining continuity, personalization, and self-improvement
- **`inject-context.js`** - Added /reflect to command routing patterns
- **`~/.gemini/GEMINI.md`** (global) - Updated with full Claude integration details: session lifecycle, tracking structure, feedback loop

### Removed

- **`checkpoint-on-complete.js`** - Deleted (TaskCompleted hook doesn't exist in Claude Code)

### Previous

- **Append-only knowledge files** - `/checkpoint` now writes to `decisions.md`, `patterns.md`, `research/` in brain for persistent knowledge accumulation
- **Hooks system** - `.claude/hooks/` with safety, tracking, quality, and context injection hooks
  - `safety/block-dangerous.js` - Blocks rm -rf, force push, credential exposure
  - `tracking/track-changes.js` - Logs file modifications to session-changes.json
  - `tracking/command-log.js` - Logs bash commands
  - `tracking/detect-pivot.js` - Prompts for /sync-stack on dependency changes
  - `quality/verify-before-stop.js` - Checks for debug statements before stopping
  - `context/session-init.js` - Resets session tracking on start
  - `context/inject-context.js` - Command routing, reasoning checkpoints, voice injection
- **Persistent learnings system** - `~/.gemini/antigravity/brain/learnings.md` loaded at SessionStart, captures mistakes and corrections
- **Voice profile injection** - `~/.gemini/antigravity/brain/voice-profile.md` injected when writing content
- **Session tracking** - `.claude/session-changes.json` tracks files modified, created, commands run (used by /checkpoint)
- **Pre-compact learnings detection** - Detects corrections in conversation and prompts for learnings capture
- **Command frontmatter descriptions** - All 14 commands now have YAML frontmatter with descriptions explaining when to use each command.
- **CLAUDE.md "Look it up" directive** - Added with emphasis: "IMPORTANT: Look it up - When unsure, use WebSearch or context7 to verify. Don't guess."
- **Root CLAUDE.md for project context** - Each project should have a root CLAUDE.md describing what the project IS (gitignored in framework since it's project-specific).

### Changed

- **`/init-project` rewritten** - Now focuses on WHAT: product definition, architecture decisions (ADRs), design system (required for UI projects). Creates project-brief.md, decisions.md, design-system.md.
- **`/sync-stack` rewritten** - Now focuses on HOW: project setup, wiring verification, spec generation, mermaid wiring diagram. Installs deps if needed, verifies configs are connected, detects design system requirement for UI projects.
- **`/checkpoint` updated** - Now reads session-changes.json for accurate tracking, includes learnings capture step, writes to append-only knowledge files (decisions.md, patterns.md, research/)
- **CLAUDE.md restructured** - Added Hooks section documenting global and project hooks, brain files, MCP tools. Specs section expanded to cover all decision types.
- **Root CLAUDE.md updated** - Documents hooks system with global/project hook details, brain files, session tracking
- **CLAUDE.md Prime Directives rewritten** - Clearer wording throughout: "Code is truth" → "Trust code over docs", "Requirements win" → "Follow instructions exactly", "Prove it or say you don't know" → "No guessing", "Simple over clever" → "Keep it simple", "Don't parrot" → "Think independently".
- **version-control.md** - Added "No Co-Authored-By for Claude. Never add yourself as a contributor."

### Removed

- **Routing skills deleted** - dev-workflow, project-sync, specs-sync, custom-commands. These weren't activating and commands are already exposed directly in the Skill tool. contribute-to-opensource skill remains.

### Previous Unreleased

- **CLAUDE.md Reasoning section** - Three rules to counter pattern-matching behavior: "Problem first" (articulate what you're solving), "Don't parrot" (user's words are input, not solutions), "Logic check" (verify suggestion solves stated problem).
- **CLAUDE.md "Existing tools first"** - Fourth reasoning rule: before building something complex, ask if an existing tool, API, or pattern already solves it.
- **MCP bridge for Antigravity** - Claude can call `ag_get_session_info` for context, `ag_browser_agent` and `ag_generate_image` for handoffs to Gemini. Identity context parsed from `my-brain/CLAUDE.md` at session start.

### Changed

- **Antigravity architecture** - Gemini is the observer. It watches Claude's terminal and creates context (artifacts, tasks, knowledge) from observation. Claude executes; Gemini captures. Handoffs only for browser/image capabilities Claude lacks.
- **CLAUDE.md Antigravity section** - Simplified to explain observer model: Gemini watches and creates context, Claude uses handoffs for browser/image.

### Removed

- **GEMINI.md** - Moved to global `~/.gemini/GEMINI.md`. Project-specific Gemini instructions no longer needed since MCP bridge handles coordination.

- **`/update-framework` rewritten** - Now uses GitHub API (`gh api`) instead of downloading tarballs and local diffing. Fetches remote file contents directly, compares with `diff -u`, shows recent commits for context. Simpler, more reliable, no temp directories or shell compatibility issues.
- **CLAUDE.md Execution section** - Replaced "No rushing" (abstract) with "Check before presenting" (actionable): verify work against applicable instructions before presenting it.

- **`/commit` command** - Documentation check is now a forcing function. For each changed file: finds all .md files in same and parent directories, reads each one, states determination ("still accurate" or "needs update: reason"). Cannot proceed to commit until visible verification is shown. Prevents false claims of having checked documentation.
- **CLAUDE.md restructured** - Added "Evidence or silence" and "Learn from errors" to Prime Directives. Simplified Execution to 3 rules: show proof, verify edits, no rushing. Removed abstract instructions that didn't change behavior.
- **`/learn` command** - Renamed to "Explain Like I'm 5". Added explicit "This is NOT code-specific" section to prevent refusals on non-code topics. Expanded examples to include non-code topics (vaccines, history).

---

## [2.3.0] - 2026-02-06

### Added

- **`/commit` command** - Commits all changes following your version-control specs. Checks status, updates documentation if needed, stages everything, generates commit message from diff, and commits. No questions asked.
- **`/pr` command** - Creates a pull request for the current branch. Shows commits and files changed, generates PR title and description, creates via GitHub CLI.

### Changed

- **`/sync-stack` now generates ALL spec types** - Not just coding + config, but also architecture, design, and documentation specs based on your stack
  - STEP 1: Read all existing spec files first
  - STEP 2: Detect stack (expanded to 17 technologies)
  - STEP 3: Research using context7 MCP + WebSearch (categorized by spec type)
  - STEP 4: Scan existing code for patterns
  - STEP 5: Update config template files based on project
  - STEP 6: Generate ALL specs (coding, architecture, design, documentation) with real content from research
  - STEP 7: Update stack-config.yaml with all categories
  - STEP 8: Summary
- **`/add-spec` clarified** - Now specifically for custom project-specific rules (API conventions, security, accessibility)
  - Research option generates from general best practices (REST guidelines, OWASP, WCAG)
  - Library-specific patterns should use `/sync-stack` instead
- **Clear distinction between commands:**
  - `/sync-stack` = auto-generate from library/framework docs
  - `/add-spec` = custom internal rules + general best practices
- **Quality gates now read from stack-config.yaml** instead of hardcoded commands
  - `/start-task`, `/verify`, `/process-tasks` all detect commands from package.json
- **Project settings in stack-config.yaml now used** (import_alias, components_dir, tests_dir)
- **README.md rewritten** with "When to Use What" section and clearer guidance

### Fixed

- **`/init-project`** - Fixed file paths, design tokens now optional
- **`/add-feature`** - Creates `.claude/tasks/` directory if needed
- **`/add-spec`** - Added yaml format example for stack-config.yaml updates
- **All commands** - Fixed stale `specs/init/` paths to `specs/`
- **All commands** - Fixed `specs_active` references to `specs:`
- **`/generate-project-specs`** - Fixed stale path reference

### Removed

- **Empty placeholder directories** (architecture/, coding/, design/, documentation/)
  - Now created dynamically by `/sync-stack` as needed
  - Only `config/` included by default (has useful templates)

---

## [2.2.0] - 2026-02-05

### Changed

- **Terminology: "standards" → "specs"** throughout the framework
  - `commands/standards/` → `commands/specs/`
  - `skills/standards-sync/` → `skills/specs-sync/`
  - `/add-standard` → `/add-spec`
  - All file content updated to use "specs" terminology
- **Directory names simplified:**
  - `specs/coding-standards/` → `specs/coding/`
  - `specs/documentation-standards/` → `specs/documentation/`
  - `specs/design-standards/` → `specs/design/`
- **`/sync-stack` is now THE main command** for stack setup (research + detection + spec generation in one)
- **Config specs enabled by default** in stack-config.yaml template
- **Files trimmed significantly:**
  - Config files: 2,315 → 252 lines (89% reduction)
  - README.md: 289 → 119 lines
  - specs/README.md: 486 → 56 lines
  - stack-config.yaml: 381 → 50 lines

### Added

- **`specs/config/testing.md`** for test framework configuration

### Removed

- **`/research-stack` command** (merged into `/sync-stack`)
- **`/generate-tasks` command** (merged into `/add-feature`)
- **`/analyze-standards` command** (redundant)

---

## [2.1.0] - 2026-02-05

### Added

- **Skills system** - Auto-routing skills that detect user intent and route to appropriate commands
  - `dev-workflow` - Routes to development commands (start-task, add-feature, generate-tasks, process-tasks)
  - `project-sync` - Routes to project management commands (init-project, research-stack, sync-stack, generate-project-specs, update-framework)
  - `standards-sync` - Routes to standards commands (add-standard, analyze-standards, verify)
  - `custom-commands` - Routes to project-specific custom commands
  - `contribute-to-opensource` - Migrated from command to skill with expanded capabilities (supports both "in their repo" and "their code in my repo" scenarios)

### Changed

- **Commands reorganized into new categories:**
  - `commands/development/` - start-task, add-feature, generate-tasks, process-tasks
  - `commands/project-management/` - init-project, research-stack, sync-stack, generate-project-specs, update-framework
  - `commands/standards/` - add-standard, analyze-standards, verify
  - `commands/utilities/` - learn
- **All command files trimmed** - 76% total reduction (~9,200 → 2,174 lines) for faster context loading
  - Removed decorative elements (box drawing, emoji)
  - Removed prescriptive output templates
  - Removed redundant framework-specific examples
  - Preserved all behavioral logic, decision trees, and workflow steps
- **`/verify` moved** - From utilities/ to standards/ (where it belongs)
- **`/add-feature` renamed** - Header changed from `/create-prd` to `/add-feature` (matches filename)
- **CLAUDE.md updated** - Documents skills and command routing

### Removed

- **`/standards` command** - Redundant with `/verify`
- **`/contribute-to-opensource` command** - Migrated to skill
- **Old command directories** - `coding-framework/`, `standards-management/` replaced by new structure

### Fixed

- All cross-references updated (`/create-prd` → `/add-feature`, `/import-standards` → `/analyze-standards`, `/init-stack` → `/init-project` or `/sync-stack`)
- Command headers now match filenames

---

## [2.0.1] - 2026-02-02

### Removed

- **scripts/** directory -- `install.sh` and `uninstall.sh` removed
- Install/uninstall scripts added complexity without matching how people actually use the framework

### Changed

- **README.md** -- Setup instructions now use fork-based workflow (fork repo, copy `.claude/`, run `/research-stack`)
- Cleaned up remaining script references in CONTRIBUTING.md and .gitignore

---

## [2.0.0] - 2025-02-02

### Breaking Changes

This is a major structural simplification. The framework is leaner and relies on Claude Code's native capabilities instead of duplicating them.

### Changed

- **Commands reorganized into categories:**
  - `commands/coding-framework/` - init-project, start-task, research-stack, sync-stack, add-feature, generate-project-specs, generate-tasks, process-tasks
  - `commands/standards-management/` - standards, add-standard, analyze-standards, update-framework
  - `commands/utilities/` - learn, verify, contribute-to-opensource
- **`config/` moved to top-level** - Previously nested inside `templates/config/`
- **CLAUDE.md simplified** - Minimal project instructions; detailed framework logic lives in command files
- **Install script updated** - Handles new directory structure, no longer installs tools/workflows/templates
- **README.md rewritten** - Reflects actual v2.0 structure and commands

### Added

- **`framework-source.txt`** - Stores the framework repo URL for `/update-framework`
- **`design-standards/`** in `your-stack/` - Dedicated space for design system standards
- **New commands:** init-project, sync-stack, generate-project-specs, analyze-standards, contribute-to-opensource

### Removed

- **`.claude/tools/`** - Claude Code provides native tool integration (MCP, web search, file system). Documenting tools in the framework was redundant.
- **`.claude/workflows/`** - Workflow logic was duplicated between workflow files and command files. Commands are the single source of truth now.
- **`.claude/templates/`** - Static templates were inferior to `/research-stack` which generates current, stack-specific standards dynamically.
- **`.claude/README.md`** - Stale internal documentation removed.
- **`.claude/MIGRATION-GUIDE.md`** - One-time migration helper no longer needed.
- **`.claude/tasks/`** - Task management handled by Claude Code's native task system.
- **`docs/` directory** - Extensive documentation that referenced removed structure. The root README now serves as primary documentation.
- **`scripts/init-stack.sh`** - Replaced by `/init-project` and `/research-stack` commands.
- **`scripts/import-company-standards.sh`** - Replaced by `/analyze-standards` command.
- **`scripts/validate-setup.sh`** - Checked for old structure; validation now handled by `/verify` command.
- **`scripts/QUICKREF.md`** and **`scripts/README.md`** - Referenced removed scripts.

---

## [1.0.0] - 2025-01-09

### Initial Release

The Claude Development Framework v1.0.0 with:

- 11 flat command files in `.claude/commands/`
- `.claude/tools/` - MCP integration, web research, tool catalog
- `.claude/workflows/` - Initial setup, stack research, company adoption
- `.claude/templates/` - Coding standards (React, Vue, Svelte, TypeScript, JavaScript), architecture, documentation
- `.claude/config/` (inside templates) - Version control, deployment, environment
- 4 helper scripts: init-stack.sh, import-company-standards.sh, validate-setup.sh, install.sh
- Comprehensive docs/ directory with getting-started, customization, MCP setup, philosophy, FAQ
- Example configurations for Astro+React, Next.js, Vue 3

---

[2.3.0]: https://github.com/LuisLadino/claude-dev-framework/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/LuisLadino/claude-dev-framework/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/LuisLadino/claude-dev-framework/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/LuisLadino/claude-dev-framework/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/LuisLadino/claude-dev-framework/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/LuisLadino/claude-dev-framework/releases/tag/v1.0.0
