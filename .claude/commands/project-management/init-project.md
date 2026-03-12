---
description: Define product requirements before coding. Creates project-brief, architecture decisions, design system. For complex projects needing upfront planning.
---

# /init-project

**Define WHAT you're building before you build it.**

This command establishes the product vision, architecture decisions, and design system. Run `/sync-stack` after to handle the technical wiring (HOW).

---

## What This Creates

```
.claude/specs/
├── project-brief.md              # What you're building and why
├── architecture/
│   ├── decisions.md              # Key technical choices (ADRs)
│   └── project-structure.md      # Where files go
└── design/
    └── design-system.md          # Visual decisions (UI projects only)
```

Also creates `README.md` if it doesn't exist.

---

## STEP 1: Product Definition

### 1.1 Problem Statement

Ask and document:
- What problem are you solving?
- Who experiences this problem?
- What happens if it's not solved?

### 1.2 Target Users

- General public
- Specific professional group (which?)
- Internal tool (for whom?)
- Developers (library/API consumers)

### 1.3 Solution Type

- Website / web app
- Mobile app
- Desktop app
- CLI tool
- API / backend service
- Library / SDK

### 1.4 Core User Journey

What's the ONE main thing users will do? Describe the happy path:
1. User arrives/opens...
2. User does...
3. User achieves...

### 1.5 Success Criteria

How will you know it's working?
- Metrics (if applicable)
- User outcomes
- Technical requirements (performance, scale)

### 1.6 Project Name

---

## STEP 2: Architecture Decisions

**Document key technical choices upfront.** These become the source of truth.

### 2.1 Tech Stack Direction

Ask about preferences or constraints:
- Language preference? (TypeScript, Python, Go, etc.)
- Framework preference? (React, Vue, Astro, etc.)
- Any required integrations? (specific APIs, databases, services)
- Deployment target? (Vercel, AWS, self-hosted, etc.)

**Don't finalize exact versions yet** - /sync-stack handles that. Just capture intent.

### 2.2 Architecture Pattern

Based on solution type, propose and confirm:
- **Web app**: SSR, SSG, SPA, or hybrid?
- **API**: REST, GraphQL, or RPC?
- **CLI**: Single command or subcommands?
- **Library**: Sync, async, or both?

### 2.3 Key Decisions

For each significant choice, document:

```markdown
## Decision: [Title]

**Context:** Why this decision matters
**Options considered:** What alternatives exist
**Decision:** What we chose
**Rationale:** Why this option
**Consequences:** What this enables/limits
```

Common decisions to capture:
- State management approach
- Authentication strategy
- Data fetching pattern
- Error handling strategy
- Testing approach

---

## STEP 3: Quality Approach

Choose one:

1. **Speed First** - MVP, prototype. Basic testing, manual QA.
2. **Balanced** - Production app. Good test coverage, WCAG AA, CI/CD.
3. **Quality First** - Enterprise/regulated. High coverage, WCAG AAA, security audits.

---

## STEP 4: Design System (Required for UI Projects)

**If solution type is Website/Web App, Mobile App, or Desktop App, design system must be defined before building.**

### Visual Direction

What's the primary feel?
1. Professional & Corporate
2. Creative & Vibrant
3. Minimal & Modern
4. Warm & Friendly
5. Technical
6. Other (describe)

### Color Palette

Ask for or propose based on visual direction:
- **Primary** - Main brand/action color
- **Secondary** - Supporting color
- **Accent** - Highlights, calls to action
- **Neutrals** - Background, text, borders (typically a gray scale)
- **Semantic** - Success, warning, error states

### Typography

- **Headings** - Font family, weights
- **Body** - Font family, base size
- **Code/Mono** - If applicable

### Component Patterns

Establish baseline decisions:
- **Buttons** - Rounded, square, pill? Solid, outline, ghost?
- **Cards** - Border, shadow, padding rhythm?
- **Spacing** - Tight, comfortable, spacious?
- **Borders** - Sharp, slightly rounded, very rounded?

### Motion (if applicable)

- Transitions: subtle, moderate, expressive?
- Page transitions: none, fade, slide?

---

## Design System Output

Generate `.claude/specs/design/design-system.md`:

```markdown
# Design System

## Visual Direction
[Selected feel + any additional context]

## Colors

### Brand
- Primary: [hex] - [usage]
- Secondary: [hex] - [usage]
- Accent: [hex] - [usage]

### Neutrals
- Background: [hex]
- Surface: [hex]
- Border: [hex]
- Text: [hex]
- Text Muted: [hex]

### Semantic
- Success: [hex]
- Warning: [hex]
- Error: [hex]

## Typography

### Fonts
- Headings: [font family]
- Body: [font family]
- Mono: [font family]

### Scale
- Use [tight/default/relaxed] line heights
- Base size: [px/rem]

## Components

### Buttons
[Describe button style: rounded corners, padding, hover states]

### Cards
[Describe card style: borders, shadows, padding]

### Spacing
[Describe spacing rhythm: tight/comfortable/spacious, base unit]

### Borders
[Describe border style: radius values, border widths]

## Motion

[Describe transition approach]
```

Update stack-config.yaml:

```yaml
specs:
  design:
    - design-system
```

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

## STEP 5: Generate Outputs

### 5.1 Project Brief

Generate `.claude/specs/project-brief.md`:

```markdown
# [Project Name]

## Problem
[From 1.1]

## Users
[From 1.2]

## Solution
[Solution type + core journey from 1.3-1.4]

## Success Criteria
[From 1.5]

## Quality Approach
[From Step 3]
```

### 5.2 Architecture Decisions

Generate `.claude/specs/architecture/decisions.md`:

```markdown
# Architecture Decisions

## Tech Stack Direction
- Language: [preference]
- Framework: [preference]
- Deployment: [target]

## Architecture Pattern
[From 2.2]

## Key Decisions

### Decision 1: [Title]
**Context:** ...
**Decision:** ...
**Rationale:** ...

[Continue for each decision from 2.3]
```

### 5.3 Project Structure

Generate `.claude/specs/architecture/project-structure.md` based on solution type (use templates below).

### 5.4 Design System (UI projects)

Generate `.claude/specs/design/design-system.md` (see Step 4 output format).

### 5.5 Update stack-config.yaml

```yaml
specs:
  architecture:
    - decisions
    - project-structure
  design:        # Only if UI project
    - design-system
```

---

## After This

Run `/sync-stack` to:
1. Install dependencies based on your tech direction
2. Wire configs together properly
3. Generate coding specs from official docs
4. Create wiring diagram showing how everything connects
