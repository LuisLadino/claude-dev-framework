# /init-project

**Define what you're building before you build it.**

Optional. Use for complex projects where you need to document the product before coding.

For simple projects, skip this and run `/sync-stack` directly.

---

## What This Creates

Creates directories as needed:

- `.claude/specs/project-brief.md` - What you're building and why
- `.claude/specs/project-guidelines.md` - Quality requirements
- `.claude/specs/architecture/project-structure.md` - Where files go (based on solution type)
- `.github/workflows/security.yml` - Secret scanning CI
- `README.md` - Project overview (if doesn't exist)

Optional (if design foundation chosen):
- `.claude/specs/design/design-tokens.json` - Colors, spacing, typography

---

## Questions

### 1. What problem are you solving?

### 2. Who is this for?
- General public
- Specific professional group
- Internal tool
- Other

### 3. What type of solution?
- Website / web app
- Mobile app
- Desktop app
- CLI tool
- API / backend service
- Library

### 4. What's the main thing users will do?

### 5. How will you know it's successful?

### 6. Project name?

---

## Quality Approach

Choose one:

1. **Speed First** - MVP, prototype. Basic testing.
2. **Balanced** - Production app. Good test coverage, WCAG AA.
3. **Quality First** - Enterprise/regulated. High coverage, WCAG AAA.

---

## Design Foundation

What's the primary feel?
1. Professional & Corporate
2. Creative & Vibrant
3. Minimal & Modern
4. Warm & Friendly
5. Technical

Generates design tokens and basic design system file.

---

## Project Structure Templates

Based on **Question 3** (solution type), generate `.claude/specs/architecture/project-structure.md` with:

### Website / Web App

```markdown
# Project Structure

## Directory Layout

src/
├── components/     # Reusable UI components
├── pages/          # Page components / routes
├── hooks/          # Custom React/Vue hooks
├── lib/            # Utilities and helpers
├── types/          # TypeScript types
└── styles/         # Global styles

public/             # Static assets
tests/              # Test files

## File Placement

- Shared components: src/components/
- Page-specific components: colocate with page
- API calls: src/lib/api/
- Types: colocate or src/types/ for shared

## Naming

- Components: PascalCase (Button.tsx)
- Utilities: camelCase (formatDate.ts)
- Directories: lowercase-hyphenated
```

### CLI Tool

```markdown
# Project Structure

## Directory Layout

src/
├── commands/       # CLI command handlers
├── lib/            # Core logic (no CLI dependencies)
├── utils/          # Helper functions
└── types/          # TypeScript types

bin/                # Entry point scripts
tests/              # Test files

## File Placement

- One file per command in src/commands/
- Business logic in src/lib/ (testable without CLI)
- Keep commands thin: parse args, call lib, format output

## Naming

- Commands: lowercase (init.ts, build.ts)
- Libs: camelCase (configLoader.ts)
```

### API / Backend Service

```markdown
# Project Structure

## Directory Layout

src/
├── routes/         # Route handlers
├── services/       # Business logic
├── models/         # Data models / schemas
├── middleware/     # Request middleware
├── lib/            # Shared utilities
└── types/          # TypeScript types

tests/              # Test files
scripts/            # Database migrations, seeds

## File Placement

- Route handlers: src/routes/
- Business logic: src/services/ (not in routes)
- Database queries: src/models/ or src/services/
- Validation: src/middleware/ or colocate with routes

## Naming

- Routes: resource-based (users.ts, orders.ts)
- Services: domain-based (authService.ts)
```

### Library

```markdown
# Project Structure

## Directory Layout

src/
├── index.ts        # Public API exports
├── core/           # Core functionality
├── utils/          # Internal helpers
└── types/          # TypeScript types

tests/              # Test files
docs/               # Documentation
examples/           # Usage examples

## File Placement

- Public API: export from src/index.ts only
- Internal code: never import from outside src/
- Keep public surface small

## Naming

- Exports: camelCase for functions, PascalCase for classes/types
- Internal: prefix with underscore if needed
```

### Mobile App / Desktop App

```markdown
# Project Structure

## Directory Layout

src/
├── screens/        # Screen components
├── components/     # Reusable UI components
├── navigation/     # Navigation config
├── services/       # API and business logic
├── hooks/          # Custom hooks
├── lib/            # Utilities
├── types/          # TypeScript types
└── assets/         # Images, fonts

tests/              # Test files

## File Placement

- Screen-specific components: colocate with screen
- Shared components: src/components/
- Navigation: src/navigation/
- State management: src/services/ or src/store/

## Naming

- Screens: PascalCase + Screen suffix (HomeScreen.tsx)
- Components: PascalCase (Button.tsx)
```

---

## After Generating

Update `stack-config.yaml` to register the new spec:

```yaml
specs:
  architecture:
    - project-structure
```

---

## Security Setup

Copy the security workflow from the framework:

```bash
mkdir -p .github/workflows
cp ~/.claude-dev-framework/.github/workflows/security.yml .github/workflows/
```

Or create `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  gitleaks:
    name: Secret Detection
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Note: Global pre-commit hook with gitleaks runs automatically (configured in `~/.git-hooks/`).

---

## After This

Run `/sync-stack` to set up your tech stack and coding specs.
