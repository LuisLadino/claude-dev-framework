---
name: spec-format
description: >
  How to write spec files. Required reading before creating or editing any file
  in .claude/specs/. Defines the frontmatter format that enables enforcement.
applies_to:
  - ".claude/specs/**/*.md"
  - ".claude/specs/**/*.yaml"
category: meta
---

# Spec File Format

Specs are reference documents that Claude must read before taking certain actions. This document defines the standard format for spec files.

---

## Why Frontmatter Matters

The enforce-specs hook uses frontmatter to determine:
1. What files or actions this spec governs (`applies_to`)
2. What the spec is about (`description`)
3. Whether Claude has read the required spec before editing

Without frontmatter, the hook can't dynamically route file edits to the correct spec.

---

## Frontmatter Schema

```yaml
---
name: spec-name
description: >
  What this spec covers. One or two sentences explaining the content and
  when Claude should read this.
applies_to:
  - "pattern1"
  - "pattern2"
category: coding | config | architecture | design | documentation | claude-code | meta
source: optional-url-or-reference
---
```

### Required Fields

| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Unique identifier for this spec |
| `description` | string | What the spec covers, when to read it |
| `applies_to` | array | File glob patterns this spec governs |
| `category` | string | Which specs directory this belongs in |

### Optional Fields

| Field | Type | Purpose |
|-------|------|---------|
| `source` | string | Where patterns came from (docs URL, etc.) |
| `version` | string | Library version these patterns apply to |
| `related` | array | Other specs that should be read together |

---

## applies_to Patterns

The `applies_to` field uses glob patterns to match files. When Claude tries to edit a file matching any pattern, the spec must be read first.

### Examples

```yaml
# Matches all JavaScript files
applies_to:
  - "**/*.js"
  - "**/*.cjs"
  - "**/*.mjs"

# Matches hook files specifically
applies_to:
  - ".claude/hooks/**/*.cjs"

# Matches multiple specific directories
applies_to:
  - "src/components/**/*.tsx"
  - "src/pages/**/*.tsx"

# Matches by naming convention
applies_to:
  - "**/*.test.ts"
  - "**/*.spec.ts"
```

### Pattern Syntax

| Pattern | Matches |
|---------|---------|
| `*` | Any single path segment |
| `**` | Any number of path segments |
| `*.ext` | Any file with extension |
| `dir/**` | Anything under directory |

---

## Categories

Specs are organized by category:

| Category | Directory | Contains |
|----------|-----------|----------|
| `coding` | `specs/coding/` | Language/library patterns (React, TypeScript) |
| `config` | `specs/config/` | Git, testing, deployment, environment |
| `architecture` | `specs/architecture/` | File structure, project organization |
| `design` | `specs/design/` | Design tokens, styling conventions |
| `documentation` | `specs/documentation/` | Code comments, docstrings |
| `claude-code` | `specs/claude-code/` | Claude Code internals (this framework) |
| `meta` | `specs/` | Specs about specs (this file) |

---

## Example Spec File

```markdown
---
name: react-specs
description: >
  React component patterns and conventions. Required reading before creating
  or modifying React components (.tsx files in src/components/).
applies_to:
  - "src/components/**/*.tsx"
  - "src/pages/**/*.tsx"
  - "**/*.jsx"
category: coding
source: https://react.dev
version: "18"
---

# React Specs

Patterns for React components in this project.

---

## Component Structure

All components use function syntax with TypeScript:

\`\`\`tsx
interface Props {
  title: string;
  onClick?: () => void;
}

export function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}
\`\`\`

## Anti-Patterns

- Never use `any` type
- Never mutate state directly
- Never call hooks inside conditions

---

## Project-Specific

[Additions specific to this project]
```

---

## How Enforcement Works

1. **Claude attempts Edit/Write** on a file
2. **enforce-specs.cjs** runs as PreToolUse hook
3. Hook reads all spec frontmatter to find matching `applies_to` pattern
4. If match found, checks if spec was read this prompt
5. If not read → **DENY** with instruction to read spec first
6. If read → **ALLOW** the edit

---

## Adding a New Spec

1. Create file in appropriate `specs/{category}/` directory
2. Add frontmatter with name, description, applies_to, category
3. Write the spec content
4. Done — enforce-specs scans spec files directly, no registration needed

---

## Spec Content Structure

After the frontmatter, use this structure:

```markdown
# Spec Title

Brief overview of what this spec covers.

---

## Patterns

### Pattern Name
Explanation with code example.

\`\`\`language
code example
\`\`\`

---

## Anti-Patterns

- What NOT to do - why
- Another anti-pattern - why

---

## Project-Specific

[Customizations for this specific project]
```

---

## Migration

Existing specs without frontmatter need to be updated. Add frontmatter to the top:

```yaml
---
name: version-control
description: >
  Git conventions for this project. Required reading before any git commits.
applies_to: []  # Config specs may not map to file patterns
category: config
---
```

For specs that govern actions (not file edits), `applies_to` can be empty. The hook uses stack-config.yaml to determine which specs to load for `/start-task`.
