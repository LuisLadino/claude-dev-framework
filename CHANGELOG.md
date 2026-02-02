# Changelog

All notable changes to the Claude Development Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.0.0]: https://github.com/LuisLadino/claude-dev-framework/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/LuisLadino/claude-dev-framework/releases/tag/v1.0.0
