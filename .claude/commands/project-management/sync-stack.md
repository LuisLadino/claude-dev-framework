# /sync-stack - Detect Tech Drift and Sync Configuration

**Command:** `/sync-stack`
**Purpose:** Detect technology drift in existing projects and sync stack-config.yaml with reality

**Use this when:** You have an existing codebase and want to auto-detect its stack and patterns.

**Don't use this when:** Starting a brand new project → use `/init-project` instead

---

## What This Does

1. Detect technologies from config files and dependencies
2. Compare against stack-config.yaml
3. Update config to match reality
4. Analyze code patterns and generate/update standards
5. Clean up orphaned standards files

**Use when:** Dependencies changed, inherited a project, or want to sync everything.

---

## How It Works

### Phase 1: Scan Project

**Detect project type first:**

| File | Project Type |
|------|--------------|
| package.json | Node.js / JavaScript |
| requirements.txt, pyproject.toml, setup.py | Python |
| go.mod | Go |
| Cargo.toml | Rust |
| Gemfile | Ruby |
| composer.json | PHP |
| pom.xml, build.gradle | Java |
| *.csproj, *.sln | .NET |

**Then scan for frameworks and tools based on project type.**

For Node.js projects, check: next.config, vite.config, astro.config, nuxt.config, svelte.config, tailwind.config, tsconfig.json, vitest/jest/playwright configs, prisma/drizzle schemas.

For other project types, detect the equivalent framework configs and dependencies.

**Detection logic (what to scan for):**

- **Framework:** Detect by config file presence (next.config -> Next.js, astro.config -> Astro, svelte.config + src/routes -> SvelteKit, nuxt.config -> Nuxt, vite.config without framework -> plain Vite). Extract version from package.json. For Next.js, check app/ vs pages/ for router type. For plain Vite, check for react/vue in dependencies.
- **Language:** tsconfig.json exists -> TypeScript (check strict mode via compilerOptions.strict), otherwise JavaScript.
- **Styling:** tailwind.config -> Tailwind CSS, styled-components/emotion in package.json, *.module.css files -> CSS Modules.
- **Database/ORM:** prisma/schema.prisma -> Prisma (extract DB provider from schema), drizzle.config -> Drizzle, mongoose in package.json -> MongoDB.
- **Testing:** vitest.config -> Vitest, jest.config -> Jest, playwright.config -> Playwright, cypress.config -> Cypress.

---

### Phase 2: Compare Against stack-config.yaml

**If stack-config.yaml exists:** Load current config and compare each field (framework, language, styling, database, testing, etc.) against detected values. Identify:
- **Mismatches** - Config value differs from detected value
- **Missing in config** - Detected in project but not in config
- **Extra in config** - Listed in config but not found in project

**If stack-config.yaml does NOT exist:** Create it from detected technologies.

---

### Phase 3: Report Findings

Display a drift report showing:
- **Detected technologies** with versions
- **Mismatches** table (config value vs actual value)
- **Missing in config** (found in project but not listed)
- **Extra in config** (listed but not found)
- **Orphaned standards files** in `.claude/specs/` that don't match detected stack

Then ask the user to choose:
1. **Auto-fix** - Update stack-config.yaml to match project reality
2. **Manual review** - Show each change for approval
3. **Keep current** - No changes
4. **Create new config** - Generate fresh stack-config.yaml from detected stack

---

### Phase 4: Apply Fixes

**If user chooses "Auto-fix":**

1. Update stack-config.yaml with all detected values.
2. List orphaned standards files and ask if user wants to delete them.

---

### Phase 5: Generate/Update Standards

For each detected technology:

1. **If no standards file exists:** Ask "Create standards for [tech]? (yes/no)"
   - If yes: Research official docs + scan codebase for patterns → generate standards file

2. **If standards file exists:** Scan codebase to check if patterns match
   - If mismatch found: Show what standard says vs what code does
   - Ask: "Update standard to match code? (yes/no/skip)"

**Pattern detection:** Scan actual code for naming conventions, file structure, component patterns, import styles, error handling, etc. Use these discovered patterns when generating or updating standards.

---

### Phase 6: Handle Manual Review

**If user chooses "Manual review":**

Go through each drift item one by one. Show current vs detected, offer to update or skip.

---

### Phase 7: Create New Config (If Missing)

**If stack-config.yaml doesn't exist:**

1. Show detected technologies
2. Ask for project name (auto-detect from package.json if possible)
3. Create stack-config.yaml
4. Proceed to Phase 5 (generate standards)

---

## Drift Detection Details

### Severity Classification
- **Critical:** Framework or language change
- **High:** Major version change
- **Medium:** Minor/patch version change, styling or testing tool change
- **Low:** Other fields

### Orphaned File Detection
Scan all `.md` files in `.claude/specs/` (excluding `.archived/`). A file is orphaned if its name doesn't match any detected technology. Generic files (file-structure, code-comments, version-control) are always considered relevant.

### Version Extraction
Read version from package.json dependencies/devDependencies, stripping `^` or `~` prefix. For Prisma database provider, parse `prisma/schema.prisma` for the `provider = "..."` value in the datasource block.

---

## Error Handling

- **No package.json found:** Inform user that auto-detection supports Node.js, Python, Ruby, Go, Rust. Offer to create stack-config.yaml manually.
- **stack-config.yaml corrupted:** Show parse error. Offer to backup and recreate, help fix, or cancel.
- **Multiple frameworks detected:** List detected frameworks. Ask user to specify which is primary, or indicate this is a monorepo.

---

## Integration with Other Commands

**Workflow:** `/sync-stack` (detect stack + generate standards) -> `/start-task` (develop)

**Don't use when:** Starting a brand new project with no code (use `/init-project` instead).

---

## Output

Updates `stack-config.yaml` with detected values.
