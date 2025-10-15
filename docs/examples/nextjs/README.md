# Next.js Example Configuration

This example shows a complete Claude Development Framework setup for a **Next.js 15** project with App Router, TypeScript, Tailwind CSS, and Vitest.

---

## Project Overview

**Stack:**
- Next.js 15 (App Router)
- React 19 (Server + Client Components)
- TypeScript (Strict mode)
- Tailwind CSS v4
- Vitest (Testing)
- pnpm (Package manager)

**Project Type:** Full-stack web application

---

## Directory Structure

```
your-nextjs-project/
├── .claude/
│   ├── CLAUDE.md                    # Framework core (from repo)
│   ├── commands/                    # Commands (from repo)
│   ├── workflows/                   # Workflows (from repo)
│   ├── templates/                   # Templates (from repo)
│   └── your-stack/                  # YOUR CUSTOMIZATIONS ⬇️
│       ├── stack-config.yaml
│       ├── coding-standards/
│       │   ├── react-standards.md
│       │   ├── nextjs-standards.md
│       │   ├── typescript-standards.md
│       │   └── api-standards.md
│       ├── architecture/
│       │   ├── file-structure.md
│       │   └── app-router-patterns.md
│       └── documentation-standards/
│           └── component-docs.md
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (routes)/      # Route groups
│   │   ├── api/           # API routes
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/         # React components
│   ├── lib/               # Utilities
│   └── styles/            # Global styles
├── public/
├── package.json
└── next.config.js
```

---

## Configuration Files

### stack-config.yaml

```yaml
name: "My Next.js App"
version: "1.0.0"

stack:
  framework: "Next.js"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"
  package_manager: "pnpm"
  database: "PostgreSQL"  # Optional
  orm: "Prisma"           # Optional

standards_active:
  - react-standards
  - nextjs-standards
  - typescript-standards
  - api-standards

tools:
  mcp_servers: []

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  app_dir: "src/app"
  api_dir: "src/app/api"
  lib_dir: "src/lib"
  
  # Next.js specific
  nextjs_version: "15"
  app_router: true
  server_actions: true
  
  # Features
  auth: true
  internationalization: false
  
  # API
  api_base_url: "/api"
  rest_api: true
```

---

## Coding Standards

### nextjs-standards.md

```markdown
# Next.js Standards (App Router)

## Server vs Client Components

**Default: Server Components** (no 'use client' directive)

```tsx
// ✅ Server Component (default)
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetch('https://api.example.com/data');
  return <div>Dashboard</div>;
}

// ✅ Client Component (needs interactivity)
// src/components/Counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Use Client Components only when you need:**
- State (useState, useReducer)
- Effects (useEffect)
- Event handlers (onClick, onChange)
- Browser APIs (window, localStorage)
- Custom hooks

## File-Based Routing

```
src/app/
├── page.tsx              # / (home)
├── about/
│   └── page.tsx          # /about
├── blog/
│   ├── page.tsx          # /blog
│   └── [slug]/
│       └── page.tsx      # /blog/[slug]
├── dashboard/
│   ├── layout.tsx        # Dashboard layout
│   ├── page.tsx          # /dashboard
│   └── settings/
│       └── page.tsx      # /dashboard/settings
└── api/
    └── users/
        └── route.ts      # /api/users
```

## Layouts

```tsx
// src/app/layout.tsx (Root Layout - Required)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// src/app/dashboard/layout.tsx (Nested Layout)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Loading States

```tsx
// src/app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

## Error Handling

```tsx
// src/app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Data Fetching

Server Components can fetch data directly:

```tsx
// Server Component
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache'
  });
  const json = await data.json();
  
  return <div>{json.title}</div>;
}
```

Client Components use hooks:

```tsx
'use client';

import { useEffect, useState } from 'react';

export function ClientData() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, []);
  
  return <div>{data?.title}</div>;
}
```

## Server Actions

```tsx
// src/app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  // Database operation
  return { success: true };
}

// src/components/UserForm.tsx
'use client';

import { createUser } from '@/app/actions';

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Metadata

```tsx
// Static metadata
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await fetch(`/api/data/${params.id}`);
  return {
    title: data.title,
  };
}
```
```

### api-standards.md

```markdown
# API Standards (Next.js Route Handlers)

## Route Handler Structure

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await db.user.create({ data: body });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## Dynamic Routes

```typescript
// src/app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}
```

## Type-Safe API Client

```typescript
// src/lib/api.ts
class ApiClient {
  private baseUrl = '/api';
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
}

export const api = new ApiClient();

// Usage
const users = await api.get<User[]>('/users');
```

## Error Responses

Consistent error format:

```typescript
interface ApiError {
  error: string;
  details?: Record<string, string>;
}

// Return errors consistently
return NextResponse.json<ApiError>(
  {
    error: 'Validation failed',
    details: { email: 'Invalid email format' }
  },
  { status: 400 }
);
```

## Authentication

```typescript
// src/lib/auth.ts
export async function getSession() {
  // Get session from cookies/headers
  return session;
}

// src/app/api/protected/route.ts
export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Protected logic
}
```
```

---

## Usage Examples

### Creating a New Page

```bash
/start-task "Create user profile page"
```

Claude generates:

**1. Page Component** (`src/app/profile/page.tsx`):
```tsx
import { Suspense } from 'react';
import { UserProfile } from '@/components/profile/UserProfile';
import { UserStats } from '@/components/profile/UserStats';

export const metadata = {
  title: 'User Profile',
  description: 'View and edit your user profile',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile />
      </Suspense>
      
      <div className="mt-8">
        <UserStats />
      </div>
    </div>
  );
}
```

**2. Client Component** (`src/components/profile/UserProfile.tsx`):
```tsx
'use client';

import { useState } from 'react';

interface User {
  name: string;
  email: string;
  bio: string;
}

export function UserProfile() {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    bio: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  function handleSave() {
    // API call
    setIsEditing(false);
  }
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {isEditing ? (
          <EditForm user={user} onSave={handleSave} />
        ) : (
          <ViewProfile user={user} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
}
```

### Creating an API Route

```bash
/start-task "Create API endpoint for user CRUD"
```

Claude generates:

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function GET() {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = userSchema.parse(body);
    
    const user = await db.user.create({ data });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

---

## Key Patterns

### 1. Server-First
- Default to Server Components
- Only use Client Components when needed
- Fetch data directly in Server Components

### 2. File-Based Routing
- Pages in `app/` directory
- Dynamic routes with `[param]`
- Layouts for shared UI
- Loading and error states

### 3. Type Safety
- TypeScript strict mode
- Zod for runtime validation
- Typed API responses

### 4. Performance
- Server Components reduce client JS
- Automatic code splitting
- Image optimization with next/image
- Font optimization with next/font

### 5. API Design
- RESTful route handlers
- Consistent error format
- Type-safe client
- Proper HTTP status codes

---

## Common Commands

```bash
# Start new feature
/start-task "Add authentication"

# Create API endpoint
/start-task "Create products API"

# Verify code quality
/verify

# Learn patterns
/learn "how we handle auth"
```

---

## Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

Access in code:
```typescript
const dbUrl = process.env.DATABASE_URL;
```

---

## Next Steps

- See [Getting Started Guide](../../getting-started.md) for setup
- See [Customization Guide](../../customization-guide.md) for modifications
- See [Astro + React Example](../astro-react/) for SSG approach
- See [Vue Example](../vue/) for alternative framework

---

**This configuration enables Claude to generate production-ready Next.js code following modern best practices!**
