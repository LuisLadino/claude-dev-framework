---
name: self-documentation
description: >
  Formatting and content rules for documents Claude writes for its own consumption.
  Required reading before creating or editing CLAUDE.md, specs, agents, skills,
  commands, docs, or memory files.
applies_to:
  - "CLAUDE.md"
  - ".claude/CLAUDE.md"
  - ".claude/docs/**/*.md"
  - ".claude/specs/**/*.md"
  - ".claude/agents/**/*.md"
  - ".claude/skills/**/*.md"
  - ".claude/commands/**/*.md"
category: claude-code
related: [instruction-format, prompt-format-guide]
---

# Self-Documentation Rules

You are both the author and the audience. Your default is to produce human-readable formatting. Override that default when writing documents you will later read.

## Format

**No tables for linear data.** Tables are for cross-referencing — looking up a value at the intersection of a row and column. If information flows top-to-bottom or is key-value pairs, use bullet lists with bold labels.

Bad:
```
| Project | Path |
|---------|------|
| voir | ~/Repositories/Personal/voir/ |
| my-brain | ~/Repositories/Personal/my-brain/ |
```

Good:
```
- **voir** — `~/Repositories/Personal/voir/`
- **my-brain** — `~/Repositories/Personal/my-brain/`
```

Tables are justified only when both row and column headers matter for lookup, like a compatibility matrix.

**No decorative separators.** `---` between sections adds tokens with no semantic value. Headers already create section breaks. Use blank lines for breathing room.

**No ASCII art or box drawings.** `┌─┐`, `│`, `└─┘` cost tokens and add no information that structured lists cannot convey.

**Minimal header depth.** H1 for document title. H2 for major sections. H3 sparingly. At H4 depth, flatten to **bold labels** within a section instead.

**No parenthetical asides.** Integrate the information or make it a separate bullet.

Bad: `SessionEnd is unreliable (doesn't fire on terminal close or trash icon)`
Good: `SessionEnd is unreliable. It doesn't fire on terminal close or trash icon.`

**Examples over prose.** Show the pattern with before/after. One concrete example teaches more than a paragraph describing the format.

## Information

**Every sentence must change behavior.** Test: if you delete this sentence, would Claude do anything differently? If no, delete it. No introductory preamble. No "this section covers..." openers. No "see also" sections listing files Glob can find.

**State each rule once.** One canonical location. If the same rule appears in multiple files, state it fully in one place and reference from others. Duplication wastes tokens and creates staleness.

**Don't document what's derivable.** File paths, directory structure, architecture layout are discoverable by reading the codebase. Document decisions and rules, not current state that will go stale.

**Concrete over abstract.** Every rule needs at least one example of what TO do or what NOT to do. "Be careful with files" is not actionable. "Read before editing" is.

## Token Efficiency

**Bullet lists for rules.** One rule per bullet. Nest to 2 levels maximum.

**Bold labels for key-value data.** `**name** — description` replaces a table row at lower token cost.

**Frontmatter is metadata, not prose.** Keep `description` to 1-2 sentences.

**No redundant structure markers.** Don't restate the document title in the opening paragraph. Don't add "Overview" sections that preview what the sections below already say.

## Scope

These rules apply to every document Claude writes for its own consumption:
- CLAUDE.md files, root and `.claude/`
- Spec files in `.claude/specs/`
- Agent definitions in `.claude/agents/`
- Skill definitions in `.claude/skills/`
- Command definitions in `.claude/commands/`
- Documentation files in `.claude/docs/`
- Memory files in `memory/`
- System prompt content

These rules do NOT apply to:
- Content written for human audiences on Luis's behalf. Voice rules govern that.
- Code files. Language-specific specs govern those.
- Git messages, PR descriptions, issue content. Those have their own conventions.

## Self-Check

Before finalizing any self-consumed document, verify:
- No tables used for linear or sequential data
- No `---` decorative separators
- No sentences that don't change behavior
- No rules duplicated across the document set
- No information derivable from reading the codebase
- The document follows its own rules
