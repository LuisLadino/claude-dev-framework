# /sync-stack

**Set up your project's specs so Claude enforces your patterns.**

The goal: Every `/start-task` loads your specs and follows YOUR patterns.

---

## Usage

```
/sync-stack              # Full setup (all spec types)
/sync-stack prisma       # Add specs for a specific dependency
```

---

## What Gets Generated

`/sync-stack` researches your stack via context7/web and generates specs with **real patterns from official docs**. Not empty templates.

| Category | What it contains | Source |
|----------|------------------|--------|
| `coding/` | Language and library patterns | Official docs (React, TS, etc.) |
| `architecture/` | File structure, project organization | Framework docs (Next.js, etc.) |
| `design/` | Design tokens, component styling | Styling framework + your config |
| `documentation/` | Code comments, docstrings | Language conventions (TSDoc, etc.) |
| `config/` | Git, testing, deployment, env | Detected from project files |

Only creates categories relevant to your stack. Skips categories with no detectable conventions.

---

## STEP 1: Read Existing Specs

First, read all existing spec files to understand current configuration.

```bash
# Find all spec files
find .claude/specs -name "*.md" -o -name "*.yaml" 2>/dev/null
```

**Read each file found.** This gives you:
- Current stack configuration (stack-config.yaml)
- Existing coding patterns (coding/*.md)
- Config settings (config/*.md)
- Any custom specs (architecture/, design/, documentation/, custom/)

**Note what exists** so you can update rather than overwrite, and preserve user customizations.

---

## STEP 2: Detect Stack

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

## STEP 3: Research Each Technology

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

### Extract from research (categorized by spec type):

**For coding specs:**
- Component/function patterns
- Import style
- Error handling patterns
- Common gotchas to avoid

**For architecture specs:**
- File/folder conventions
- Project structure requirements
- Module organization

**For design specs:**
- Design token patterns (if using Tailwind, styled-components, etc.)
- Component styling conventions
- Theme structure

**For documentation specs:**
- Code comment conventions
- Docstring formats
- README patterns

---

## STEP 4: Scan Existing Code

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

## STEP 5: Update Config Specs

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

## STEP 6: Generate All Specs

**Use the research from Step 3 to fill in actual content.** Don't create empty templates. Every spec should contain real patterns from official docs.

### 6a: Ask which categories to generate

```
SPEC CATEGORIES

Based on your stack, these specs can be generated:

[x] coding/        - React, TypeScript, Vitest patterns
[x] architecture/  - Next.js file structure conventions
[x] design/        - Tailwind design tokens
[ ] documentation/ - No specific conventions detected

Generate all? (yes / customize)
```

### 6b: Generate coding specs

For each technology with code patterns, create `[technology]-specs.md` with **actual patterns from research**:

```markdown
# React Specs

Source: https://react.dev/learn

## Patterns

### Component Declaration
Use function components with TypeScript.

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Hooks
- Call hooks at the top level, not inside conditions
- Custom hooks must start with "use"

## Anti-Patterns

- Don't use `any` type - use proper TypeScript types
- Don't mutate state directly - use setState

## Project-Specific

[Patterns found in existing code that differ from defaults]
```

### 6c: Generate architecture specs

If framework has file structure conventions, create `file-structure.md` with **actual conventions from docs**:

```markdown
# File Structure

Source: https://nextjs.org/docs/app/building-your-application/routing

## Directory Layout

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page
├── globals.css         # Global styles
├── api/                # API routes
│   └── route.ts
└── [slug]/             # Dynamic routes
    └── page.tsx
```

## Conventions

### Page files
- `page.tsx` - Publicly accessible page
- `layout.tsx` - Shared UI for segment and children
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI

### Component organization
- Colocate components with their routes when route-specific
- Shared components go in `components/` at project root

## Anti-Patterns

- Don't put API logic in page components - use route handlers
- Don't import server components into client components
```

### 6d: Generate design specs

If using a styling framework, create `design-system.md` with **actual tokens from config + docs**:

```markdown
# Design System

Source: tailwind.config.ts + https://tailwindcss.com/docs

## Tokens

### Colors (from tailwind.config)
- `primary` - #3b82f6 (blue-500)
- `secondary` - #6b7280 (gray-500)
- `destructive` - #ef4444 (red-500)

### Spacing
Use Tailwind's default scale: 1 = 0.25rem

### Typography
- Headings: font-bold
- Body: font-normal text-gray-900

## Component Styling

Use Tailwind classes directly. Avoid @apply except for base styles.

```tsx
// Good
<button className="px-4 py-2 bg-primary text-white rounded-md">

// Avoid
<button className={styles.button}>
```

## Anti-Patterns

- Don't use inline styles - use Tailwind classes
- Don't create custom CSS when Tailwind has a utility
```

### 6e: Generate documentation specs

If language/framework has doc conventions, create `code-comments.md` with **actual conventions**:

```markdown
# Code Comments

Source: https://tsdoc.org/

## When to Comment

- Public API functions - always
- Complex algorithms - explain the why
- Workarounds - link to issue/reason

## Docstring Format

Use TSDoc for TypeScript:

```tsx
/**
 * Fetches user data from the API.
 * @param userId - The unique identifier for the user
 * @returns The user object or null if not found
 * @throws {ApiError} When the API request fails
 */
export async function getUser(userId: string): Promise<User | null> {
```

## Anti-Patterns

- Don't comment obvious code (`// increment i` above `i++`)
- Don't leave TODO comments without issue links
```

### Only create what's needed

- Skip `architecture/` if no framework-specific structure (vanilla JS/TS)
- Skip `design/` if no styling framework (just plain CSS)
- Skip `documentation/` if no specific conventions found in docs
- **Never create empty templates** - only create specs with real content from research

---

## STEP 7: Update stack-config.yaml

Update `.claude/specs/stack-config.yaml` with:

1. **Stack details** - framework, language, styling, testing, package_manager
2. **Specs list** - all generated spec files across all categories

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
  architecture:
    - file-structure
  design:
    - design-system
  documentation:
    - code-comments
  config:
    - version-control
    - deployment
    - environment
    - testing
```

Only include categories that have specs. Don't add empty categories.

---

## STEP 8: Summary

Show what was created/updated:

```
SYNC COMPLETE

Stack: Next.js 14 + TypeScript + Tailwind + Vitest

Config specs (updated):
- config/version-control.md (conventional commits)
- config/testing.md (vitest, tests in __tests__/)
- config/deployment.md (Vercel)
- config/environment.md (12 env vars)

Coding specs (created):
- coding/nextjs-specs.md
- coding/typescript-specs.md
- coding/tailwind-specs.md
- coding/vitest-specs.md

Architecture specs (created):
- architecture/file-structure.md (Next.js App Router conventions)

Design specs (created):
- design/design-system.md (Tailwind tokens)

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
4. Generate/update the coding spec for that dependency
5. If the dependency has architecture implications (e.g., Prisma schema location), update architecture specs too
6. Add to stack-config.yaml specs list

**Note:** Single dependency mode focuses on coding specs. Run full `/sync-stack` to regenerate architecture/design/documentation specs.

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
