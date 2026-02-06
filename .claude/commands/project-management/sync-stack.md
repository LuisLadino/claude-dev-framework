# /sync-stack

**Set up your project's specs so Claude enforces your patterns.**

The goal: Every `/start-task` loads your specs and follows YOUR patterns.

---

## Usage

```
/sync-stack              # Full setup
/sync-stack prisma       # Add specs for a specific dependency
```

---

## STEP 1: Detect Stack

Check for config files to detect the tech stack:

| File | Detects |
|------|---------|
| package.json | Node.js + dependencies (React, Vue, Svelte, etc.) |
| tsconfig.json | TypeScript |
| next.config.* | Next.js |
| nuxt.config.* | Nuxt |
| svelte.config.* | SvelteKit |
| astro.config.* | Astro |
| vite.config.* | Vite (check plugins for framework) |
| tailwind.config.* | Tailwind CSS |
| vitest.config.* / jest.config.* | Testing framework |
| .eslintrc.* / eslint.config.* | ESLint |
| .prettierrc.* | Prettier |
| prisma/schema.prisma | Prisma |
| drizzle.config.* | Drizzle |
| pyproject.toml / requirements.txt | Python |
| Cargo.toml | Rust |
| go.mod | Go |
| Gemfile | Ruby |

**If argument provided** (e.g., `/sync-stack prisma`): Skip detection, focus on that dependency.

**If no code exists:** Ask what they're building, suggest a stack.

**Show detected stack and ask to confirm:**

```
DETECTED STACK

Framework: Next.js 14
Language: TypeScript
Styling: Tailwind CSS
Testing: Vitest
Package Manager: pnpm

Dependencies to generate specs for:
- next
- typescript
- tailwind
- vitest

Confirm? (yes / modify)
```

**WAIT FOR USER RESPONSE**

---

## STEP 2: Research Each Technology

For each confirmed technology, research official patterns.

### Use context7 MCP first

```
Use the context7 MCP tool to fetch documentation for [technology].
Look for: project structure, naming conventions, common patterns, anti-patterns.
```

### Fallback to WebSearch

If context7 doesn't have docs, use WebSearch:
- "[technology] best practices 2024"
- "[technology] official documentation patterns"
- "[technology] + [other tech in stack] integration"

### Extract from research:
- File/folder conventions
- Component/function patterns
- Import style
- Error handling patterns
- Testing patterns
- Common gotchas to avoid

---

## STEP 3: Scan Existing Code

If the project has existing code, scan for patterns to preserve.

### What to scan:

**File structure:**
```bash
find src -type f -name "*.tsx" -o -name "*.ts" | head -20
```

**Component patterns:**
```bash
grep -r "export default function\|export const\|export function" src --include="*.tsx" | head -10
```

**Import style:**
```bash
grep -r "^import" src --include="*.ts" --include="*.tsx" | head -10
```

**Test structure:**
```bash
find . -name "*.test.*" -o -name "*.spec.*" | head -10
```

### Compare with research:
- If existing patterns match best practices: document them as-is
- If existing patterns differ: note the project's convention (consistency > best practice)
- If no existing code: use researched best practices

---

## STEP 4: Update Config Specs

Read and update the config template files based on detected project settings.

### Read existing templates

```bash
ls .claude/specs/config/
```

Read each file: version-control.md, deployment.md, environment.md, testing.md

### Update version-control.md

Detect from project:
```bash
# Check recent commits for format
git log --oneline -10

# Check branch naming
git branch -a | head -10

# Check for hooks
ls .husky 2>/dev/null || ls .git/hooks 2>/dev/null
```

Update the template with:
- Actual commit message format used
- Branch naming convention
- Any pre-commit hooks configured

### Update testing.md

Detect from project:
```bash
# Check package.json for test scripts
grep -A5 '"scripts"' package.json | grep test

# Check test directory structure
find . -name "*.test.*" -o -name "*.spec.*" | head -5

# Check test config
ls vitest.config.* jest.config.* 2>/dev/null
```

Update the template with:
- Actual test framework and version
- Test file location pattern
- Test commands

### Update deployment.md

Detect from project:
```bash
# Check for deployment configs
ls vercel.json netlify.toml fly.toml render.yaml Dockerfile docker-compose.yml 2>/dev/null
```

Update the template with:
- Detected deployment platform
- Build commands from config
- Environment setup

### Update environment.md

Detect from project:
```bash
# Check for env examples
cat .env.example 2>/dev/null || cat .env.sample 2>/dev/null
```

Update the template with:
- Required environment variables
- Variable naming conventions

---

## STEP 5: Generate Coding Specs

For each technology, ask before generating:

```
Generate specs for [technology]? (yes/skip)
```

### Create directory if needed

Specs go in `.claude/specs/coding/` for most technologies.

```bash
mkdir -p .claude/specs/coding
```

### Spec file template

Create `[technology]-specs.md`:

```markdown
# [Technology] Specs

Source: [context7/official docs URL]

## Patterns

### [Pattern Name]
[Description]

```[language]
// Example code
```

### [Pattern Name]
...

## Anti-Patterns

- [What NOT to do] - [Why]
- ...

## Project-Specific

[Any patterns discovered from existing code that differ from defaults]
```

### What goes where:

| Type | Directory | Examples |
|------|-----------|----------|
| Framework/language patterns | `coding/` | react-specs.md, typescript-specs.md |
| File structure rules | `architecture/` | file-structure.md |
| Design system/tokens | `design/` | design-tokens.md |
| Doc conventions | `documentation/` | code-comments.md |
| Operational | `config/` | Already exists (version-control, deployment, etc.) |

**Only create directories that are needed.** Don't create empty directories.

---

## STEP 6: Update stack-config.yaml

Update `.claude/specs/stack-config.yaml` with:

1. **Stack details** - framework, language, styling, testing, package_manager
2. **Specs list** - all generated spec files

Example update:

```yaml
stack:
  framework: "Next.js"
  framework_version: "14"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"
  package_manager: "pnpm"

specs:
  coding:
    - nextjs-specs
    - typescript-specs
    - tailwind-specs
    - vitest-specs
  config:
    - version-control
    - deployment
    - environment
    - testing
```

---

## STEP 7: Summary

Show what was created/updated:

```
SYNC COMPLETE

Stack: Next.js 14 + TypeScript + Tailwind + Vitest

Updated config specs:
- config/version-control.md (commit format: conventional commits)
- config/testing.md (vitest, tests in __tests__/)
- config/deployment.md (Vercel detected)
- config/environment.md (12 env vars from .env.example)

Created coding specs:
- coding/nextjs-specs.md (from Next.js docs)
- coding/typescript-specs.md (from TS handbook)
- coding/tailwind-specs.md (from Tailwind docs)
- coding/vitest-specs.md (from Vitest docs)

Updated: stack-config.yaml

Next steps:
- Review specs in .claude/specs/
- Edit any patterns that don't match your preferences
- Run /start-task to build with these specs enforced
```

---

## Error Handling

### context7 has no docs for [tech]
Use WebSearch. Note in spec file that source is web research.

### Can't detect stack
Ask user directly: "What framework/language are you using?"

### Conflicting patterns in existing code
Note the inconsistency. Ask user which pattern to standardize on.

### Spec already exists
Ask: "Update existing [tech]-specs.md? (yes/skip)"

---

## Adding a Single Dependency

When run as `/sync-stack [dependency]`:

1. Skip full stack detection
2. Research just that dependency
3. Check for existing patterns using it
4. Generate/update just that spec file
5. Add to stack-config.yaml specs list

---

## How Specs Are Used

After running `/sync-stack`:

1. User runs `/start-task`
2. Claude loads `stack-config.yaml`
3. Reads all files listed under `specs:`
4. Shows patterns that will be enforced
5. User approves
6. Claude implements following specs
7. Runs quality gates

**Your specs become the rules.**
