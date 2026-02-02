# Sync Stack Configuration

**Command:** `/sync-stack`
**Purpose:** Detect technology drift in existing projects and sync stack-config.yaml with reality

---

## What This Does

Scans your existing project to:

1. **Detect actual technologies being used** (framework, database, styling, etc.)
2. **Compare against stack-config.yaml** (if it exists)
3. **Identify drift and mismatches** between config and reality
4. **Auto-update or suggest fixes** to keep config synchronized
5. **Discover orphaned standards** (files in `.claude/your-stack/` not listed in config)

**Use this when:**
- You've added new dependencies without updating stack-config.yaml
- You've switched frameworks/tools and config is stale
- You inherited a project without stack-config.yaml
- You want to verify config matches actual codebase

**Duration:** 5-10 minutes

---

## How It Works

### Phase 1: Scan Project

**Scan these locations for technology detection:**

```bash
# Package managers
- package.json (dependencies, devDependencies)
- pnpm-lock.yaml / package-lock.json / yarn.lock
- requirements.txt (Python)
- Gemfile (Ruby)
- go.mod (Go)
- Cargo.toml (Rust)

# Configuration files
- next.config.js / next.config.mjs
- vite.config.ts / vite.config.js
- astro.config.mjs
- nuxt.config.ts
- svelte.config.js
- tailwind.config.js / tailwind.config.ts
- tsconfig.json / jsconfig.json
- vitest.config.ts / jest.config.js
- playwright.config.ts / cypress.config.js
- prisma/schema.prisma
- drizzle.config.ts

# Framework indicators
- app/ directory (Next.js App Router)
- pages/ directory (Next.js Pages Router or Astro)
- src/routes/ (SvelteKit)
- src/pages/ (Astro)
- .astro files (Astro)
- .vue files (Vue)
- .svelte files (Svelte)
```

**Detection Logic:**

```typescript
// Framework Detection
if (exists('next.config.js') || exists('next.config.mjs')) {
  framework = 'Next.js'
  version = extractVersionFrom('package.json', 'next')

  if (exists('app/')) {
    router = 'App Router'
  } else if (exists('pages/')) {
    router = 'Pages Router'
  }
}

if (exists('astro.config.mjs')) {
  framework = 'Astro'
  version = extractVersionFrom('package.json', 'astro')
}

if (exists('svelte.config.js') && exists('src/routes/')) {
  framework = 'SvelteKit'
  version = extractVersionFrom('package.json', '@sveltejs/kit')
}

if (exists('nuxt.config.ts')) {
  framework = 'Nuxt'
  version = extractVersionFrom('package.json', 'nuxt')
}

if (exists('vite.config.ts') && !framework) {
  // Plain Vite project (React/Vue/Vanilla)
  framework = 'Vite'

  if (packageJsonHas('react')) {
    library = 'React'
  } else if (packageJsonHas('vue')) {
    library = 'Vue'
  }
}

// Language Detection
if (exists('tsconfig.json')) {
  language = 'TypeScript'

  const tsconfig = readJSON('tsconfig.json')
  if (tsconfig.compilerOptions?.strict === true) {
    language_mode = 'strict'
  } else {
    language_mode = 'standard'
  }
} else {
  language = 'JavaScript'
}

// Styling Detection
if (exists('tailwind.config.js') || exists('tailwind.config.ts')) {
  styling = 'Tailwind CSS'
  version = extractVersionFrom('package.json', 'tailwindcss')
}

if (packageJsonHas('styled-components')) {
  styling = 'Styled Components'
}

if (packageJsonHas('@emotion/react')) {
  styling = 'Emotion'
}

if (exists('src/**/*.module.css')) {
  styling = 'CSS Modules'
}

// Database/ORM Detection
if (exists('prisma/schema.prisma')) {
  orm = 'Prisma'
  database = extractDatabaseFrom('prisma/schema.prisma') // PostgreSQL, MySQL, SQLite, etc.
}

if (exists('drizzle.config.ts')) {
  orm = 'Drizzle'
}

if (packageJsonHas('mongoose')) {
  database = 'MongoDB'
  orm = 'Mongoose'
}

// Testing Detection
if (exists('vitest.config.ts')) {
  testing = 'Vitest'
}

if (exists('jest.config.js')) {
  testing = 'Jest'
}

if (exists('playwright.config.ts')) {
  e2e_testing = 'Playwright'
}

if (exists('cypress.config.js')) {
  e2e_testing = 'Cypress'
}
```

---

### Phase 2: Compare Against stack-config.yaml

**If stack-config.yaml exists:**

Load current configuration and compare:

```typescript
const currentConfig = readYAML('.claude/your-stack/stack-config.yaml')
const detectedStack = scanProject()

const drift = {
  framework: currentConfig.stack.framework !== detectedStack.framework,
  language: currentConfig.stack.language !== detectedStack.language,
  styling: currentConfig.stack.styling !== detectedStack.styling,
  database: currentConfig.stack.database !== detectedStack.database,
  testing: currentConfig.stack.testing !== detectedStack.testing,
  // ... other comparisons
}

const missingInConfig = Object.keys(detectedStack).filter(
  key => !currentConfig.stack[key]
)

const extraInConfig = Object.keys(currentConfig.stack).filter(
  key => !detectedStack[key]
)
```

**If stack-config.yaml does NOT exist:**

Create it from detected technologies.

---

### Phase 3: Report Findings

**Display drift report to user:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STACK DRIFT DETECTION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Project:** [name from package.json or directory name]
**Scanned:** [timestamp]

---

## ✅ Detected Technologies

**Framework:** Next.js 14.2.5 (App Router)
**Language:** TypeScript (strict mode)
**Styling:** Tailwind CSS 4.0
**Database:** PostgreSQL (via Prisma)
**ORM:** Prisma 5.18.0
**Testing:** Vitest 2.0.5
**E2E Testing:** Playwright 1.46.0
**Package Manager:** pnpm 9.7.0

---

## 🔄 Drift Analysis

### ⚠️ Mismatches Found (Config vs Reality)

| Technology | stack-config.yaml | Actual Project | Status |
|-----------|-------------------|----------------|---------|
| Framework Version | Next.js 14.0.0 | Next.js 14.2.5 | DRIFT |
| Styling | CSS Modules | Tailwind CSS 4.0 | DRIFT |
| Testing | Jest | Vitest | DRIFT |

### ➕ Missing in Config (Found in project but not in stack-config.yaml)

- E2E Testing: Playwright 1.46.0
- Package Manager: pnpm
- Deployment: Vercel (detected from vercel.json)

### ➖ Extra in Config (Listed in stack-config.yaml but not found in project)

- Database: MongoDB (no Mongoose found, but Prisma + PostgreSQL detected)
- Styling: CSS Modules (no *.module.css files found)

---

## 📂 Orphaned Standards Files

**These files exist in `.claude/your-stack/` but aren't listed in stack-config.yaml:**

- `.claude/your-stack/coding-standards/vue-standards.md` (Vue not detected)
- `.claude/your-stack/coding-standards/jest-standards.md` (Jest not used, Vitest is)
- `.claude/your-stack/architecture/mongodb-patterns.md` (MongoDB not detected)

**Recommendation:** Archive or delete these files as they don't match current stack.

---

## 🔧 Recommended Actions

**Option 1: Auto-Fix (Recommended)**
Update stack-config.yaml to match detected technologies.

**Option 2: Manual Review**
Review each drift item and decide whether to update config or change project.

**Option 3: Keep Current Config**
No changes (if drift is intentional or temporary).

---

**What would you like to do?**

1. **Auto-fix** - Update stack-config.yaml to match project reality
2. **Manual review** - I'll show you each change for approval
3. **Keep current** - No changes to config
4. **Create new config** - Generate fresh stack-config.yaml from detected stack

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Phase 4: Apply Fixes

**If user chooses "Auto-fix":**

Update stack-config.yaml with detected values:

```yaml
# Updated by /sync-stack on 2025-01-23

name: "Your Project Name"
version: "1.0.0"
description: "Auto-detected from project scan"
project_type: "web-app-interactive"  # or detected type

stack:
  framework: "Next.js"
  framework_version: "14.2.5"
  router: "App Router"
  language: "TypeScript"
  language_mode: "strict"
  styling: "Tailwind CSS"
  styling_version: "4.0"
  database: "PostgreSQL"
  orm: "Prisma"
  orm_version: "5.18.0"
  testing: "Vitest"
  testing_version: "2.0.5"
  e2e_testing: "Playwright"
  e2e_testing_version: "1.46.0"
  package_manager: "pnpm"
  deployment: "Vercel"

standards_active:
  - "coding-standards/nextjs-standards.md"
  - "coding-standards/typescript-standards.md"
  - "coding-standards/tailwind-standards.md"
  - "architecture/file-structure.md"
  - "testing-standards.md"

design_system:
  theme: "technical-dev-focused"  # or previously set theme
  tokens_file: ".claude/your-stack/design-system/design-tokens.json"
  standards_file: ".claude/your-stack/design-system/design-system-standards.md"

last_synced: "2025-01-23T14:32:00Z"
sync_status: "clean"  # or "drift-detected"
```

**Archive orphaned standards files:**

```bash
# Create archive directory if it doesn't exist
mkdir -p .claude/your-stack/.archived/

# Move orphaned files
mv .claude/your-stack/coding-standards/vue-standards.md \
   .claude/your-stack/.archived/vue-standards.md.bak

mv .claude/your-stack/coding-standards/jest-standards.md \
   .claude/your-stack/.archived/jest-standards.md.bak
```

**Display success:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STACK CONFIG UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Changes Applied:**
✓ Updated framework version: Next.js 14.0.0 → 14.2.5
✓ Changed styling: CSS Modules → Tailwind CSS 4.0
✓ Changed testing: Jest → Vitest
✓ Added e2e_testing: Playwright 1.46.0
✓ Added package_manager: pnpm
✓ Removed database: MongoDB (not detected)

**Orphaned Files Archived:**
✓ vue-standards.md → .archived/
✓ jest-standards.md → .archived/
✓ mongodb-patterns.md → .archived/

**Next Steps:**
1. Run `/research-stack` to generate standards for new technologies
2. Review and update any custom standards
3. Verify `.claude/your-stack/` matches your current stack

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Phase 5: Handle Manual Review

**If user chooses "Manual review":**

Go through each drift item one by one:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 MANUAL DRIFT REVIEW (1 of 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Item:** Framework Version

**Current Config:** Next.js 14.0.0
**Detected in Project:** Next.js 14.2.5

**Analysis:**
- package.json shows: "next": "^14.2.5"
- This is a minor version update
- App Router still in use (no breaking changes)

**Recommendation:** Update config to match project

**What would you like to do?**
1. Update config to 14.2.5
2. Downgrade project to 14.0.0
3. Skip this item
4. Stop review and keep current config

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Process user's choice for each item, then apply changes at the end.

---

### Phase 6: Create New Config (If Missing)

**If stack-config.yaml doesn't exist:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NO CONFIG FOUND - CREATING FROM DETECTED STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Detected Technologies:**
- Framework: Next.js 14.2.5 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS 4.0
- Database: PostgreSQL (Prisma)
- Testing: Vitest
- E2E: Playwright

**I'll create `.claude/your-stack/stack-config.yaml` with these technologies.**

**Additional Questions:**

1. **Project Name?** [auto-detected from package.json: "my-app"]
2. **Project Type?**
   - web-app-interactive (default for Next.js)
   - web-app-marketing
   - mobile-app
   - desktop-app
   - browser-extension
   - library
   - cli-tool
3. **Design System Theme?**
   - technical-dev-focused (dark, code-centric)
   - modern-saas (clean, professional)
   - creative-agency (bold, expressive)
   - minimal-elegant (simple, refined)
   - skip (don't create design system)

**Creating config...**

✓ Created `.claude/your-stack/stack-config.yaml`
✓ Created `.claude/your-stack/design-system/design-tokens.json`
✓ Created `.claude/your-stack/design-system/design-system-standards.md`

**Next Steps:**
1. Run `/research-stack` to generate coding standards
2. Review stack-config.yaml and customize as needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Technical Implementation

### File Scanning Utilities

```typescript
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

function exists(filepath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), filepath))
}

function readJSON(filepath: string): any {
  const content = fs.readFileSync(path.join(process.cwd(), filepath), 'utf-8')
  return JSON.parse(content)
}

function readYAML(filepath: string): any {
  // Use yaml parser
  const content = fs.readFileSync(path.join(process.cwd(), filepath), 'utf-8')
  return parseYAML(content)
}

function extractVersionFrom(packageJsonPath: string, packageName: string): string {
  const pkg = readJSON(packageJsonPath)
  const version = pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName]

  if (!version) return 'unknown'

  // Remove ^ or ~ prefix
  return version.replace(/^[\^~]/, '')
}

function packageJsonHas(packageName: string): boolean {
  const pkg = readJSON('package.json')
  return !!(pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName])
}

function extractDatabaseFrom(prismaSchemaPath: string): string {
  const schema = fs.readFileSync(prismaSchemaPath, 'utf-8')

  // Look for datasource db { provider = "..." }
  const match = schema.match(/provider\s*=\s*"(\w+)"/)

  if (match) {
    const provider = match[1].toLowerCase()

    if (provider === 'postgresql') return 'PostgreSQL'
    if (provider === 'mysql') return 'MySQL'
    if (provider === 'sqlite') return 'SQLite'
    if (provider === 'mongodb') return 'MongoDB'
    if (provider === 'sqlserver') return 'SQL Server'
  }

  return 'unknown'
}
```

### Drift Detection Algorithm

```typescript
interface StackConfig {
  stack: {
    framework?: string
    framework_version?: string
    language?: string
    styling?: string
    database?: string
    testing?: string
    // ... other fields
  }
  standards_active?: string[]
}

interface DriftReport {
  mismatches: Array<{
    field: string
    configValue: string | undefined
    detectedValue: string | undefined
    severity: 'critical' | 'high' | 'medium' | 'low'
  }>
  missingInConfig: Array<{
    field: string
    detectedValue: string
  }>
  extraInConfig: Array<{
    field: string
    configValue: string
  }>
  orphanedFiles: string[]
}

function detectDrift(
  config: StackConfig | null,
  detected: StackConfig
): DriftReport {
  if (!config) {
    return {
      mismatches: [],
      missingInConfig: Object.keys(detected.stack).map(field => ({
        field,
        detectedValue: detected.stack[field]
      })),
      extraInConfig: [],
      orphanedFiles: []
    }
  }

  const mismatches = []
  const missingInConfig = []
  const extraInConfig = []

  // Compare each field
  for (const field of Object.keys(detected.stack)) {
    const detectedValue = detected.stack[field]
    const configValue = config.stack[field]

    if (!configValue) {
      missingInConfig.push({ field, detectedValue })
    } else if (configValue !== detectedValue) {
      mismatches.push({
        field,
        configValue,
        detectedValue,
        severity: determineSeverity(field, configValue, detectedValue)
      })
    }
  }

  // Find extras
  for (const field of Object.keys(config.stack)) {
    if (!detected.stack[field]) {
      extraInConfig.push({ field, configValue: config.stack[field] })
    }
  }

  // Find orphaned standards files
  const orphanedFiles = findOrphanedStandards(config, detected)

  return { mismatches, missingInConfig, extraInConfig, orphanedFiles }
}

function determineSeverity(
  field: string,
  configValue: string,
  detectedValue: string
): 'critical' | 'high' | 'medium' | 'low' {
  // Framework change is critical
  if (field === 'framework' && configValue !== detectedValue) {
    return 'critical'
  }

  // Major version change is high
  if (field.includes('version')) {
    const [configMajor] = configValue.split('.')
    const [detectedMajor] = detectedValue.split('.')

    if (configMajor !== detectedMajor) {
      return 'high'
    }

    return 'medium' // Minor/patch version change
  }

  // Language change is critical
  if (field === 'language') {
    return 'critical'
  }

  // Styling/testing changes are medium
  if (field === 'styling' || field === 'testing') {
    return 'medium'
  }

  return 'low'
}

function findOrphanedStandards(
  config: StackConfig,
  detected: StackConfig
): string[] {
  const orphaned: string[] = []

  // Get all files in .claude/your-stack/
  const standardsFiles = glob.sync('.claude/your-stack/**/*.md', {
    ignore: ['.claude/your-stack/.archived/**']
  })

  for (const file of standardsFiles) {
    const filename = path.basename(file)

    // Check if file is relevant to detected stack
    const isRelevant = isFileRelevantToStack(filename, detected)

    if (!isRelevant) {
      orphaned.push(file)
    }
  }

  return orphaned
}

function isFileRelevantToStack(filename: string, stack: StackConfig): boolean {
  const lower = filename.toLowerCase()

  // Check against detected technologies
  if (stack.stack.framework?.toLowerCase().includes('next') && lower.includes('next')) {
    return true
  }

  if (stack.stack.framework?.toLowerCase().includes('astro') && lower.includes('astro')) {
    return true
  }

  if (stack.stack.language?.toLowerCase() === 'typescript' && lower.includes('typescript')) {
    return true
  }

  if (stack.stack.styling?.toLowerCase().includes('tailwind') && lower.includes('tailwind')) {
    return true
  }

  if (stack.stack.testing?.toLowerCase().includes('vitest') && lower.includes('vitest')) {
    return true
  }

  // Generic files (always relevant)
  if (lower.includes('file-structure') || lower.includes('code-comments') || lower.includes('version-control')) {
    return true
  }

  return false
}
```

---

## Error Handling

### Common Issues

**Issue 1: No package.json found**
```
❌ ERROR: No package.json found

This doesn't appear to be a Node.js/npm project.

/sync-stack currently supports:
- Node.js projects (npm, pnpm, yarn)
- Python projects (requirements.txt)
- Ruby projects (Gemfile)
- Go projects (go.mod)
- Rust projects (Cargo.toml)

If this is a different type of project, /sync-stack cannot auto-detect your stack.

Would you like to create stack-config.yaml manually?
```

**Issue 2: stack-config.yaml is corrupted**
```
❌ ERROR: Cannot parse stack-config.yaml

The file exists but appears to be corrupted or invalid YAML.

Error: Unexpected token at line 15, column 3

Would you like to:
1. Backup and recreate config from detected stack
2. Show me the file so I can help fix it
3. Cancel sync
```

**Issue 3: Conflicting detection**
```
⚠️ WARNING: Multiple frameworks detected

I found indicators for multiple frameworks:
- Next.js (next.config.js)
- Astro (astro.config.mjs)
- Vite (vite.config.ts)

This could be:
- Monorepo with multiple apps
- Migration in progress
- Nested project structure

Please specify which framework is primary:
1. Next.js
2. Astro
3. Vite
4. This is a monorepo (I'll handle differently)
```

---

## When to Use

**Use `/sync-stack` when:**
- ✅ You've upgraded dependencies (framework, language, tools)
- ✅ You've switched technologies (e.g., Jest → Vitest, CSS Modules → Tailwind)
- ✅ You've inherited a project without config
- ✅ You suspect config is out of date
- ✅ You want to verify config matches reality
- ✅ You've added new tools (Playwright, Prisma, etc.)

**Don't use `/sync-stack` when:**
- ❌ Starting a new project (use `/init-project` instead)
- ❌ No changes to technologies (config should be accurate)
- ❌ You know config is correct (no need to verify)

---

## Integration with Other Commands

**Workflow:**

```bash
# If config is out of date:
/sync-stack                    # Detect drift, update config

# After config is synced:
/research-stack                # Generate/update standards for new technologies

# Then continue development:
/add-feature                   # Add new features
/start-task                    # Start coding
```

**The sync-stack → research-stack flow ensures:**
1. Config matches reality (sync-stack)
2. Standards match config (research-stack)
3. Development uses correct standards (any coding command)

---

## Output Files

### Updated stack-config.yaml

```yaml
# .claude/your-stack/stack-config.yaml

name: "Your Project"
version: "1.0.0"
description: "Auto-synced from project scan"
project_type: "web-app-interactive"

stack:
  framework: "Next.js"
  framework_version: "14.2.5"
  router: "App Router"
  language: "TypeScript"
  language_mode: "strict"
  styling: "Tailwind CSS"
  styling_version: "4.0"
  database: "PostgreSQL"
  orm: "Prisma"
  orm_version: "5.18.0"
  testing: "Vitest"
  e2e_testing: "Playwright"

standards_active:
  - "coding-standards/nextjs-standards.md"
  - "coding-standards/typescript-standards.md"
  - "coding-standards/tailwind-standards.md"

last_synced: "2025-01-23T14:32:00Z"
sync_status: "clean"
```

### Sync Report

A detailed markdown report saved to `.claude/your-stack/.sync-reports/`:

```markdown
# Stack Sync Report

**Date:** 2025-01-23 14:32:00
**Project:** Your Project Name

## Summary

- ✅ 5 technologies matched
- ⚠️ 3 mismatches found and fixed
- ➕ 2 new technologies added
- ➖ 1 technology removed
- 📂 3 orphaned files archived

## Detailed Changes

### Mismatches Fixed

1. **Framework Version**
   - Before: Next.js 14.0.0
   - After: Next.js 14.2.5
   - Severity: Medium (minor version update)

2. **Styling**
   - Before: CSS Modules
   - After: Tailwind CSS 4.0
   - Severity: High (complete change)

3. **Testing**
   - Before: Jest
   - After: Vitest
   - Severity: Medium (tool change)

### Added Technologies

- E2E Testing: Playwright 1.46.0
- Package Manager: pnpm

### Removed Technologies

- Database: MongoDB (no longer detected)

### Archived Files

- `.claude/your-stack/.archived/vue-standards.md.bak`
- `.claude/your-stack/.archived/jest-standards.md.bak`
- `.claude/your-stack/.archived/mongodb-patterns.md.bak`

## Recommendations

1. Run `/research-stack` to generate standards for:
   - Vitest (testing framework)
   - Playwright (e2e testing)

2. Review any custom modifications to archived files and migrate to new standards if needed.

3. Update documentation to reflect new stack.

---

*Report generated by /sync-stack*
```

---

## Summary

`/sync-stack` keeps your stack-config.yaml synchronized with your actual project:

1. **Scans** project files to detect technologies
2. **Compares** against stack-config.yaml (if exists)
3. **Reports** drift and mismatches
4. **Fixes** config automatically or with manual review
5. **Archives** orphaned standards files
6. **Creates** new config if missing

**This ensures the framework always knows what stack you're actually using, enabling accurate standards application.**

**Next command after sync:** `/research-stack` to generate standards for new technologies.
