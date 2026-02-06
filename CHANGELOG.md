# Changelog

All notable changes to the Claude Development Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.3.0] - 2026-02-06

### Changed

- **`/sync-stack` completely rewritten** with proper step-by-step instructions
  - STEP 1: Read all existing spec files first
  - STEP 2: Detect stack (expanded to 17 technologies)
  - STEP 3: Research using context7 MCP + WebSearch
  - STEP 4: Scan existing code for patterns
  - STEP 5: Update config template files based on project
  - STEP 6: Generate coding specs
  - STEP 7: Update stack-config.yaml
  - STEP 8: Summary
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
