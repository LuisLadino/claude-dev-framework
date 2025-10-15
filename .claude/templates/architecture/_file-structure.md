# File Structure Template

> **Template Purpose:** This file provides a starting point for project file structure standards. The `/research-stack` command uses this template to generate customized file organization patterns based on your framework and project size.

---

## Overview

A well-organized file structure makes the codebase easy to navigate, understand, and maintain. This template provides guidelines for organizing files based on features rather than file types.

---

## Core Principles

### 1. Feature-Based Organization

**Group by feature, not by file type.**

**❌ Wrong (Type-Based):**
```
src/
├── components/
│   ├── Button.tsx
│   ├── UserProfile.tsx
│   ├── Dashboard.tsx
│   └── ProductCard.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useProducts.ts
│   └── useDashboard.ts
├── utils/
│   ├── userUtils.ts
│   └── productUtils.ts
└── types/
    ├── user.ts
    └── product.ts
```

**✅ Correct (Feature-Based):**
```
src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   │   └── UserProfile.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   ├── utils/
│   │   │   └── userUtils.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   └── index.ts
│   └── products/
│       ├── components/
│       │   └── ProductCard.tsx
│       ├── hooks/
│       │   └── useProducts.ts
│       ├── types.ts
│       └── index.ts
└── shared/
    └── components/
        └── Button.tsx
```

**Why?** Related code stays together, making it easier to:
- Find all code related to a feature
- Delete/refactor entire features
- Understand dependencies
- Onboard new developers

### 2. One Component Per File

**Each component gets its own file.**

**✅ Correct:**
```
components/
├── Button.tsx
├── Input.tsx
└── Card.tsx
```

**❌ Wrong:**
```
// components.tsx
export function Button() { }
export function Input() { }
export function Card() { }
```

### 3. Colocate Tests and Styles

**Keep tests and styles next to the code they test/style.**

**✅ Correct:**
```
features/
└── user/
    └── components/
        ├── UserProfile.tsx
        ├── UserProfile.test.tsx
        └── UserProfile.module.css  (if using CSS modules)
```

---

## Standard Directory Structure

### Basic Structure (All Projects)

```
project-root/
├── src/
│   ├── features/          # Feature modules
│   ├── shared/            # Shared/common code
│   ├── lib/               # Third-party integrations
│   ├── config/            # Configuration files
│   └── types/             # Global type definitions
├── public/                # Static assets
├── tests/                 # Integration/E2E tests
├── .claude/               # Claude development framework
├── package.json
├── tsconfig.json
└── README.md
```

### Feature Module Structure

```
features/
└── [feature-name]/
    ├── components/        # Feature-specific components
    │   ├── [Component].tsx
    │   ├── [Component].test.tsx
    │   └── index.ts       # Barrel export
    ├── hooks/             # Feature-specific hooks
    │   ├── use[Hook].ts
    │   ├── use[Hook].test.ts
    │   └── index.ts
    ├── utils/             # Feature-specific utilities
    │   ├── [utility].ts
    │   ├── [utility].test.ts
    │   └── index.ts
    ├── api/               # API calls for this feature
    │   └── [feature]Api.ts
    ├── types.ts           # Feature-specific types
    ├── constants.ts       # Feature-specific constants
    └── index.ts           # Public API (barrel export)
```

### Shared/Common Structure

```
shared/
├── components/            # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/                 # Reusable hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── index.ts
├── utils/                 # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── index.ts
├── constants/             # Global constants
│   └── index.ts
└── types/                 # Shared types
    └── index.ts
```

---

## Naming Conventions

### Files

**Components:**
```
PascalCase.tsx
Button.tsx
UserProfile.tsx
ProductCard.tsx
```

**Hooks:**
```
camelCase.ts (with 'use' prefix)
useUser.ts
useLocalStorage.ts
useDebounce.ts
```

**Utilities:**
```
camelCase.ts
formatters.ts
validators.ts
apiClient.ts
```

**Types:**
```
types.ts (or PascalCase for named types)
User.types.ts
Product.types.ts
```

**Tests:**
```
[filename].test.[ext]
Button.test.tsx
useUser.test.ts
formatters.test.ts
```

### Directories

**Use lowercase with hyphens for multi-word directories:**
```
✅ user-profile/
✅ product-catalog/
❌ UserProfile/
❌ product_catalog/
```

**Exception:** Feature directories can match component names if they represent a single feature:
```
✅ Dashboard/
✅ UserProfile/
```

---

## Import Paths

### Use Path Aliases

**Configure in tsconfig.json or jsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

**✅ Correct:**
```typescript
import { Button } from '@shared/components';
import { useUser } from '@features/user';
import { formatDate } from '@shared/utils';
```

**❌ Wrong:**
```typescript
import { Button } from '../../../shared/components/Button';
import { useUser } from '../../user/hooks/useUser';
```

---

## Barrel Exports (index.ts)

### Use Barrel Exports for Clean Imports

**✅ Correct:**

**features/user/components/index.ts:**
```typescript
export { UserProfile } from './UserProfile';
export { UserAvatar } from './UserAvatar';
export { UserSettings } from './UserSettings';
```

**features/user/index.ts:**
```typescript
export * from './components';
export * from './hooks';
export { type User, type UserRole } from './types';
```

**Usage:**
```typescript
import { UserProfile, useUser } from '@features/user';
```

**Benefits:**
- Clean import statements
- Easy to refactor internal structure
- Clear public API

---

## Framework-Specific Structures

### React (Create React App / Vite)

```
src/
├── features/
├── shared/
├── lib/
├── App.tsx
├── main.tsx
└── index.css
```

### Next.js (App Router)

```
src/
├── app/                   # Next.js app router
│   ├── (routes)/
│   ├── layout.tsx
│   └── page.tsx
├── features/
├── shared/
└── lib/
```

### Next.js (Pages Router)

```
src/
├── pages/                 # Next.js pages
│   ├── api/
│   ├── _app.tsx
│   └── index.tsx
├── features/
├── shared/
└── lib/
```

### Vue (Vite)

```
src/
├── features/
├── shared/
│   └── components/        # .vue files
├── App.vue
└── main.ts
```

### Svelte (SvelteKit)

```
src/
├── routes/                # SvelteKit routes
├── features/
│   └── [feature]/
│       └── components/    # .svelte files
├── lib/                   # Shared code
└── app.html
```

### Astro

```
src/
├── pages/                 # .astro pages
├── layouts/               # .astro layouts
├── components/            # .astro components
├── features/              # Feature modules (.tsx, .vue, .svelte)
└── shared/
```

---

## Large Project Considerations

### Monorepo Structure

```
packages/
├── web/                   # Main web app
│   └── src/
├── mobile/                # Mobile app
│   └── src/
├── shared/                # Shared code
│   ├── ui/                # Shared components
│   ├── utils/             # Shared utilities
│   └── types/             # Shared types
└── api/                   # Backend API
```

### Domain-Driven Structure

```
src/
├── domains/
│   ├── users/
│   │   ├── application/   # Use cases
│   │   ├── domain/        # Business logic
│   │   ├── infrastructure/# Data access
│   │   └── presentation/  # UI components
│   └── products/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       └── presentation/
└── shared/
```

---

## Configuration Files Location

### Root Level Configuration

```
project-root/
├── .eslintrc.json         # ESLint
├── .prettierrc            # Prettier
├── tsconfig.json          # TypeScript
├── vite.config.ts         # Vite
├── next.config.js         # Next.js
├── svelte.config.js       # SvelteKit
├── astro.config.mjs       # Astro
└── package.json
```

### Source Configuration

```
src/
├── config/
│   ├── api.ts             # API configuration
│   ├── constants.ts       # App constants
│   └── env.ts             # Environment variables
```

---

## Public Assets

### Organization

```
public/
├── images/
│   ├── logos/
│   ├── icons/
│   └── hero/
├── fonts/
└── favicon.ico
```

**Import Static Assets:**
```typescript
// ✅ In Vite/Next.js
import logo from '@/assets/logo.svg';

// ✅ In public folder
<img src="/images/logo.svg" />
```

---

## Testing Structure

### Colocated Tests (Preferred)

```
features/
└── user/
    └── components/
        ├── UserProfile.tsx
        └── UserProfile.test.tsx
```

### Separate Test Directory (Alternative)

```
project-root/
├── src/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## Anti-Patterns to Avoid

### ❌ Don't Organize by File Type
```
// Wrong
src/
├── components/  (100+ files)
├── hooks/       (50+ files)
└── utils/       (30+ files)
```

### ❌ Don't Use Generic Names
```
// Wrong
components/common/
components/shared/
components/misc/
utils/helpers/
```

### ❌ Don't Deeply Nest
```
// Wrong (too deep)
features/user/components/profile/personal/details/name/FirstName.tsx
```

### ❌ Don't Mix Concerns in One Directory
```
// Wrong
features/user/
├── UserProfile.tsx
├── ProductCard.tsx  // Wrong feature!
└── useCart.ts       // Wrong feature!
```

---

## Quality Checklist

- [ ] Files organized by feature, not type
- [ ] One component per file
- [ ] Tests colocated with code
- [ ] Path aliases configured
- [ ] Barrel exports (`index.ts`) used
- [ ] Naming conventions followed
- [ ] No deeply nested directories (max 3-4 levels)
- [ ] Shared code in dedicated `shared/` directory
- [ ] Feature boundaries clear and enforced

---

## Migration Guide

**Moving from type-based to feature-based:**

1. **Identify features:** Group related components
2. **Create feature directories:** `features/[feature-name]/`
3. **Move files:** Component + hook + utils → feature directory
4. **Add barrel exports:** Create `index.ts` files
5. **Update imports:** Use path aliases
6. **Test:** Ensure everything still works

---

**Remember:** Good file structure scales with your project and makes navigation intuitive for any developer.
