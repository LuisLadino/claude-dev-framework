# Astro + React Example Configuration

This example shows a complete Claude Development Framework setup for an **Astro 5 + React 19** project with TypeScript, Tailwind CSS, and Vitest.

---

## Project Overview

**Stack:**
- Astro 5.0 (SSG with Islands)
- React 19 (Interactive components)
- TypeScript (Strict mode)
- Tailwind CSS v4 + daisyUI v5
- Vitest (Testing)
- pnpm (Package manager)

**Project Type:** Portfolio website / Marketing site

---

## Directory Structure

```
your-astro-project/
├── .claude/
│   ├── CLAUDE.md                    # Framework core (from repo)
│   ├── commands/                    # Commands (from repo)
│   ├── workflows/                   # Workflows (from repo)
│   ├── templates/                   # Templates (from repo)
│   └── your-stack/                  # YOUR CUSTOMIZATIONS ⬇️
│       ├── stack-config.yaml
│       ├── coding-standards/
│       │   ├── react-standards.md
│       │   ├── astro-standards.md
│       │   ├── typescript-standards.md
│       │   └── styling-standards.md
│       ├── architecture/
│       │   ├── file-structure.md
│       │   └── component-patterns.md
│       └── documentation-standards/
│           └── component-docs.md
├── src/
│   ├── components/          # React components
│   ├── layouts/            # Astro layouts
│   ├── pages/              # Astro pages (routes)
│   └── styles/             # Global styles
├── public/
├── package.json
└── astro.config.mjs
```

---

## Configuration Files

### stack-config.yaml

```yaml
name: "My Astro Portfolio"
version: "1.0.0"

stack:
  framework: "Astro"
  ui_library: "React"
  language: "TypeScript"
  styling: "Tailwind CSS"
  css_framework: "daisyUI"
  testing: "Vitest"
  package_manager: "pnpm"

standards_active:
  - react-standards
  - astro-standards
  - typescript-standards
  - styling-standards

tools:
  mcp_servers: []

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  layouts_dir: "src/layouts"
  pages_dir: "src/pages"
  astro_version: "5.0"
  react_version: "19"
  
  # Astro-specific
  islands_architecture: true
  ssr_mode: false  # Static site
  
  # Styling
  tailwind_version: "4"
  utility_first: true
```

---

## Coding Standards

### react-standards.md

```markdown
# React Standards (Astro Islands)

## Component Style

Use functional components with named exports:

```typescript
// ✅ Correct
export function HeroSection({ title }: { title: string }) {
  return <section>{title}</section>;
}

// ❌ Wrong - no default exports
export default function HeroSection() { }

// ❌ Wrong - no arrow functions for components
export const HeroSection = () => { };
```

## Astro Integration

Components used in Astro pages need client directives:

```astro
---
import { HeroSection } from '@/components/HeroSection';
---

<!-- Static (no JS sent to browser) -->
<HeroSection title="Welcome" />

<!-- Interactive (hydrated with JS) -->
<HeroSection client:load title="Welcome" />
<HeroSection client:idle title="Welcome" />
<HeroSection client:visible title="Welcome" />
```

**Directive Guide:**
- `client:load` - Immediately on page load (critical interactivity)
- `client:idle` - When browser is idle (less critical)
- `client:visible` - When component enters viewport (below fold)
- No directive - Static HTML only (best for performance)

## TypeScript Props

Always type props with interfaces:

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, size = 'md', onClick, children }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## State Management

Use React hooks for component state:

```typescript
import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## File Organization

```
components/
├── home/
│   ├── HeroSection.tsx
│   ├── HeroSection.test.tsx
│   └── index.ts
├── shared/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
└── index.ts  # Barrel export
```
```

### astro-standards.md

```markdown
# Astro Standards

## Page Structure

Astro pages follow this structure:

```astro
---
// 1. Imports
import BaseLayout from '@/layouts/BaseLayout.astro';
import { HeroSection } from '@/components/home/HeroSection';

// 2. Data fetching / logic
const title = "My Page";
---

<!-- 3. Template -->
<BaseLayout title={title}>
  <HeroSection client:load title={title} />
</BaseLayout>
```

## When to Use .astro vs .tsx

**Use `.astro` for:**
- Pages (routing)
- Layouts
- Static content sections
- Server-only logic

**Use `.tsx` for:**
- Interactive components
- Components with state
- Components with event handlers
- Reusable UI components

## Layout Pattern

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Default description" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />  <!-- Page content goes here -->
  </body>
</html>
```

## Import Aliases

Always use `@/` alias:

```astro
// ✅ Correct
import { Button } from '@/components/shared/Button';
import BaseLayout from '@/layouts/BaseLayout.astro';

// ❌ Wrong - relative paths
import { Button } from '../../components/shared/Button';
```

## Client Directives Strategy

Minimize JavaScript sent to browser:

```astro
---
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Footer } from '@/components/layout/Footer';
---

<!-- Header needs interactivity (mobile menu) -->
<Header client:load />

<!-- Hero can wait until page is idle -->
<Hero client:idle />

<!-- Features don't need JS at all -->
<Features />

<!-- Footer needs interactivity (newsletter form) -->
<Footer client:load />
```
```

### styling-standards.md

```markdown
# Styling Standards (Tailwind + daisyUI)

## Utility-First Approach

Use Tailwind utility classes directly:

```tsx
// ✅ Correct
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card bg-base-200 shadow-xl p-6">
      {children}
    </div>
  );
}

// ❌ Wrong - don't use @apply
// Create component classes instead
```

## daisyUI Components

Use semantic daisyUI classes:

```tsx
// Buttons
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-outline">Outline</button>

// Cards
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
    <p>Content</p>
  </div>
</div>

// Alerts
<div className="alert alert-success">
  <span>Success message!</span>
</div>
```

## Responsive Design

Mobile-first with Tailwind breakpoints:

```tsx
<div className="
  flex flex-col        
  md:flex-row          
  lg:gap-8            
  xl:container xl:mx-auto
">
  {/* Content */}
</div>
```

**Breakpoints:**
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

## Dynamic Classes

Build classes programmatically:

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'accent';
  size: 'sm' | 'md' | 'lg';
}

export function Button({ variant, size }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}`}>
      Click me
    </button>
  );
}
```

## Theme Colors

Use daisyUI semantic colors:

```tsx
// ✅ Correct - semantic colors
<div className="bg-primary text-primary-content">Primary</div>
<div className="bg-secondary text-secondary-content">Secondary</div>
<div className="bg-base-100">Background</div>

// ❌ Wrong - hardcoded colors
<div className="bg-blue-500 text-white">Primary</div>
```
```

---

## Usage Examples

### Starting a New Feature

```bash
/start-task "Create contact form component"
```

Claude will:
1. Read stack-config.yaml (knows it's Astro + React)
2. Read react-standards.md (functional components, named exports)
3. Read astro-standards.md (knows to use .tsx for interactive)
4. Read styling-standards.md (knows to use daisyUI form classes)
5. Generate properly structured component:

```tsx
// src/components/contact/ContactForm.tsx
import { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          className="input input-bordered"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Message</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Send Message
      </button>
    </form>
  );
}
```

6. Generate test file
7. Add to barrel export
8. Show usage in Astro page

### Using in Astro Page

```astro
---
// src/pages/contact.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { ContactForm } from '@/components/contact/ContactForm';

const title = "Contact Us";
---

<BaseLayout title={title}>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-8">{title}</h1>
    
    <!-- Needs client directive for interactivity -->
    <ContactForm 
      client:load 
      onSubmit={(data) => console.log(data)} 
    />
  </div>
</BaseLayout>
```

---

## Key Patterns

### 1. Islands Architecture
- Most content is static HTML
- Only interactive components get JavaScript
- Choose appropriate client directive

### 2. Type Safety
- All props typed with TypeScript interfaces
- Strict mode enabled
- No `any` types

### 3. Component Organization
- Feature-based folders
- Colocated tests
- Barrel exports

### 4. Styling
- Tailwind utilities for layout
- daisyUI components for UI
- Semantic color classes
- Mobile-first responsive

### 5. Performance
- Minimize client-side JavaScript
- Use `client:idle` and `client:visible` when possible
- Static HTML when no interactivity needed

---

## Common Commands

```bash
# Start new task
/start-task "Create blog post card component"

# Verify quality
/verify

# Learn project patterns
/learn "how we handle forms"

# Check active standards
/standards
```

---

## Customization

To customize for your project:

1. **Update stack-config.yaml** with your specifics
2. **Add custom standards** to `.claude/your-stack/coding-standards/`
3. **Document architecture decisions** in `.claude/your-stack/architecture/`
4. **Commit to git** so team uses same standards

---

## Next Steps

- See [Getting Started Guide](../../getting-started.md) for setup
- See [Customization Guide](../../customization-guide.md) for modifications
- See [Next.js Example](../nextjs/) for alternative stack
- See [Vue Example](../vue/) for another framework

---

**This configuration enables Claude to generate consistent, high-quality Astro + React code automatically!**
