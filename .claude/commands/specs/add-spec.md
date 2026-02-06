# /add-spec

**Add custom project-specific rules that aren't covered by library documentation.**

`/sync-stack` generates specs from external docs (React patterns, Next.js conventions, etc.). Use `/add-spec` for your own internal rules.

---

## When to Use

Use `/add-spec` for rules that are specific to your project or organization:

- **Internal API conventions** - Your REST/GraphQL patterns, not a library's
- **Company naming standards** - Variable naming, file naming conventions
- **Security requirements** - Auth rules, data handling, input validation
- **Accessibility standards** - Your a11y requirements
- **Business logic rules** - Domain-specific patterns
- **Custom categories** - Anything unique to your project

**Don't use for:** Library patterns (React, Prisma, Tailwind). Use `/sync-stack` instead.

---

## Usage

```
/add-spec                    # Interactive flow
/add-spec api-conventions    # Create spec with name
```

---

## Interactive Flow

### Step 1: Spec Type

Ask the user which type of spec to add:

1. **Coding** - Internal coding standards (`.claude/specs/coding/`)
2. **Architecture** - System design rules (`.claude/specs/architecture/`)
3. **Documentation** - Doc standards (`.claude/specs/documentation/`)
4. **Design** - Design rules (`.claude/specs/design/`)
5. **Config** - Operational rules (`.claude/specs/config/`)
6. **Custom** - User specifies directory name

### Step 2: Spec Name

Ask for the spec name. Use kebab-case (lowercase with hyphens).

### Step 3: Confirm

Show summary: type, name, file path. Ask for confirmation.

### Step 4: Create File

Create the spec file with a template:

```markdown
# [Spec Name]

## Overview

[What this spec covers]

## Patterns

### [Pattern Name]
[Description with code example]

## Anti-Patterns

- [What NOT to do] - [Why]
```

### Step 5: Update stack-config.yaml

Add the spec filename (without .md) to the appropriate list:

```yaml
specs:
  coding:
    - api-conventions    # Custom spec added here
  config:
    - version-control
```

### Step 6: Generate Content (Optional)

Ask if they want help filling in the spec:

1. **Research** - Research general best practices to scaffold the spec
2. **Manual** - Keep template for manual editing

**Research sources for /add-spec** (different from /sync-stack):
- REST/GraphQL API design guidelines
- OWASP security best practices
- WCAG accessibility standards
- Language-agnostic patterns (error handling, logging, etc.)

**Not for:** Library-specific patterns (React, Prisma). Use `/sync-stack` for those.

### Step 7: Done

Confirm the spec was created. Suggest reviewing and customizing to match project needs.

---

## Examples

| Spec | Type | Purpose |
|------|------|---------|
| `api-conventions` | coding | Internal REST API design rules |
| `error-handling` | coding | How errors should be handled in this project |
| `module-boundaries` | architecture | Which modules can import from which |
| `security-rules` | config | Auth, data handling, secrets management |
| `accessibility` | design | WCAG compliance rules for this project |

---

## Related Commands

- `/sync-stack` - Auto-generates specs from library docs. Run this first.
- `/verify` - Check code against all specs
