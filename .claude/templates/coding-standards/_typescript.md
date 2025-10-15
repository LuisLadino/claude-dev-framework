# TypeScript Coding Standards Template

> **⚠️ WARNING: This is a BASIC TEMPLATE**
>
> These are generic TypeScript patterns. For current, detailed standards:
> 1. Run `/research-stack` in Claude to generate AI-researched standards
> 2. OR manually customize this file for your specific needs
>
> `/research-stack` will research TypeScript's official docs and generate standards
> specific to your TypeScript version with current best practices (2024-2025).

---

## Overview

TypeScript adds static typing to JavaScript, catching errors at compile time and improving code maintainability. These standards ensure type safety and consistency across the codebase.

---

## TypeScript Configuration

### Compiler Options

**Strict Mode (Required):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Additional Recommended Options:**
```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

---

## Type Definitions

### Never Use `any`

**❌ Wrong:**
```typescript
function processData(data: any) {
  return data.value;
}
```

**✅ Correct:**
```typescript
interface DataShape {
  value: string;
}

function processData(data: DataShape): string {
  return data.value;
}

// Or use unknown for truly unknown data
function processUnknown(data: unknown): string {
  if (isDataShape(data)) {
    return data.value;
  }
  throw new Error('Invalid data shape');
}

function isDataShape(data: unknown): data is DataShape {
  return (
    typeof data === 'object' &&
    data !== null &&
    'value' in data &&
    typeof data.value === 'string'
  );
}
```

### Interfaces vs Types

**Use `interface` for:**
- Object shapes
- Public APIs
- Component props
- Extending/implementing

**Use `type` for:**
- Unions and intersections
- Mapped types
- Conditional types
- Utility types

**Example:**
```typescript
// ✅ Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type for unions
type Status = 'pending' | 'active' | 'inactive';

// ✅ Type for complex combinations
type UserWithStatus = User & {
  status: Status;
};

// ✅ Interface can be extended
interface AdminUser extends User {
  permissions: string[];
}
```

---

## Function Signatures

### Always Type Function Parameters and Return Types

**❌ Wrong:**
```typescript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**✅ Correct:**
```typescript
interface Item {
  price: number;
  quantity: number;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Arrow Functions

**✅ Correct:**
```typescript
const filterActive = (users: User[]): User[] => {
  return users.filter(user => user.status === 'active');
};

// Inline types for simple callbacks
const userNames = users.map((user: User): string => user.name);
```

---

## Type Guards and Narrowing

### Use Type Guards for Runtime Checks

**✅ Correct:**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: string | number) {
  if (typeof value === 'string') {
    // TypeScript knows value is string here
    return value.toUpperCase();
  }
  // TypeScript knows value is number here
  return value.toFixed(2);
}
```

### Discriminated Unions

**✅ Correct:**
```typescript
type Success = {
  type: 'success';
  data: string;
};

type Error = {
  type: 'error';
  message: string;
};

type Result = Success | Error;

function handleResult(result: Result) {
  if (result.type === 'success') {
    // TypeScript knows result.data exists
    console.log(result.data);
  } else {
    // TypeScript knows result.message exists
    console.error(result.message);
  }
}
```

---

## Utility Types

### Common TypeScript Utility Types

```typescript
// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Required - makes all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record - create object type with specific keys
type UserRecord = Record<string, User>;

// ReturnType - extract return type of function
type UserResult = ReturnType<typeof getUser>;
```

---

## Generics

### Use Generics for Reusable Components

**✅ Correct:**
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// Usage
const userResponse = await fetchData<User>('/api/users/1');
// userResponse.data is typed as User
```

### Constrained Generics

**✅ Correct:**
```typescript
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

---

## Async/Await and Promises

### Always Type Promise Returns

**❌ Wrong:**
```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

**✅ Correct:**
```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data as User; // Or validate with type guard
}

// Better with error handling
async function fetchUserSafe(id: string): Promise<Result> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { type: 'success', data };
  } catch (error) {
    return { type: 'error', message: error.message };
  }
}
```

---

## Enums vs Union Types

### Prefer String Literal Union Types

**❌ Avoid Enums (when possible):**
```typescript
enum Status {
  Pending = 'PENDING',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}
```

**✅ Prefer Union Types:**
```typescript
type Status = 'pending' | 'active' | 'inactive';

// With constants for autocomplete
const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```

**Why?** Union types are simpler, more flexible, and compile away entirely.

---

## Null and Undefined Handling

### Be Explicit About Nullable Values

**✅ Correct:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Optional property
}

function getDisplayName(user: User | null): string {
  if (user === null) {
    return 'Anonymous';
  }
  return user.name;
}

// Nullish coalescing
const avatarUrl = user.avatar ?? '/default-avatar.png';

// Optional chaining
const streetName = user?.address?.street?.name;
```

---

## Type Assertions

### Use Type Assertions Sparingly

**❌ Wrong (Unsafe):**
```typescript
const user = data as User; // Assumes data is User without checking
```

**✅ Better (With Validation):**
```typescript
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof data.id === 'string' &&
    'name' in data &&
    typeof data.name === 'string'
  );
}

const data = await fetchData();
if (isUser(data)) {
  const user = data; // Safely typed as User
}
```

---

## Imports and Exports

### Use Named Exports

**❌ Wrong:**
```typescript
export default function MyComponent() { }
```

**✅ Correct:**
```typescript
export function MyComponent() { }

// Or for types
export type { User, Status };
export { calculateTotal, filterActive };
```

### Import Types

**✅ Correct:**
```typescript
import type { User } from './types';
import { fetchUser } from './api';

// Or inline type imports
import { type User, fetchUser } from './api';
```

---

## Common Patterns

### API Response Handling

```typescript
interface ApiError {
  code: string;
  message: string;
}

type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

async function apiCall<T>(url: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
        error: {
          code: response.status.toString(),
          message: response.statusText
        }
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}
```

### Event Handlers

```typescript
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  // ...
}

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value;
  // ...
}
```

---

## Testing

### Type Your Tests

```typescript
import { describe, it, expect } from 'vitest';
import type { User } from './types';

describe('calculateTotal', () => {
  it('should calculate total price', () => {
    const items: Item[] = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 }
    ];
    
    const result: number = calculateTotal(items);
    expect(result).toBe(35);
  });
});
```

---

## Anti-Patterns to Avoid

### ❌ Don't Use `any`
```typescript
// Never
function process(data: any) { }
```

### ❌ Don't Disable Strict Checks
```typescript
// @ts-ignore
// @ts-nocheck
```

### ❌ Don't Use Type Assertions Without Validation
```typescript
const user = data as User; // Dangerous!
```

### ❌ Don't Over-Use Optional Chaining
```typescript
// Too defensive
const name = user?.profile?.data?.name?.value;

// Better - structure your types properly
interface User {
  profile: {
    name: string;
  };
}
```

---

## Quality Checklist

Before committing TypeScript code:

- [ ] No `any` types used
- [ ] All function parameters and returns are typed
- [ ] Interfaces used for object shapes
- [ ] Type guards used for runtime checks
- [ ] Proper error handling with typed errors
- [ ] Tests are typed
- [ ] `npm run type-check` passes with no errors
- [ ] No `@ts-ignore` or `@ts-nocheck` comments

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)

---

**Remember:** TypeScript is your friend. Embrace the types, and they'll catch bugs before your users do.
