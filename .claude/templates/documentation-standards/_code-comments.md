# Code Comment Standards

**Template Version:** 1.0.0  
**Last Updated:** 2025-01-09

> **Note:** This is a template file. When you run `init-stack.sh`, it gets copied to `.claude/your-stack/documentation-standards/code-comments.md` where you can customize it for your project.

---

## Core Principle

**Comments explain WHY, not WHAT.**

Code shows what it does. Comments explain the reasoning, context, and decisions behind the code.

---

## When to Comment

### ✅ DO Comment These

#### 1. Business Logic Reasoning

**Why this approach was chosen:**

```typescript
// Using debounce to prevent API spam during rapid typing.
// Backend has 100 req/min limit per user.
const debouncedSearch = debounce(searchAPI, 300);
```

```javascript
// Rounding to 2 decimals to match accounting standards.
// Financial regulations require this precision.
const total = Math.round(sum * 100) / 100;
```

#### 2. Non-Obvious Decisions

**Why the obvious approach wasn't used:**

```typescript
// Using ref instead of state to avoid re-renders during animation.
// GSAP performs better with direct DOM manipulation.
const animationRef = useRef<HTMLDivElement>(null);
```

```vue
// Using computed instead of watch for performance. // Computed caches and only
recalculates when dependencies change. const fullName = computed(() =>
`${first.value} ${last.value}`);
```

#### 3. Performance Optimizations

**Why optimization was necessary:**

```typescript
// Memoizing to prevent expensive recalculation on every render.
// Sorting 1000+ items is slow (~50ms), only recompute when data changes.
const sortedItems = useMemo(
  () => items.sort((a, b) => a.priority - b.priority),
  [items]
);
```

```javascript
// Lazy loading to improve initial page load.
// This component is below the fold and not immediately needed.
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

#### 4. Workarounds and Hacks

**Temporary fixes with context:**

```typescript
// HACK: Safari doesn't support backdrop-filter properly in v16.
// Using solid background as fallback until we drop Safari 16 support (Q3 2025).
if (isSafari && safariVersion < 17) {
  style.backgroundColor = "rgba(255, 255, 255, 0.95)";
}
```

```javascript
// WORKAROUND: Third-party library has memory leak in cleanup.
// Manually clearing event listeners. Remove when library updates to v3.
window.removeEventListener("resize", handleResize);
```

#### 5. Complex Algorithms

**High-level explanation of what algorithm does:**

```typescript
// Binary search to find insertion point in sorted array.
// O(log n) performance critical for 10k+ items.
let left = 0;
let right = arr.length;
while (left < right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] < value) left = mid + 1;
  else right = mid;
}
```

#### 6. External Constraints

**Requirements from outside the code:**

```typescript
// Client requires 30-day retention even for deleted items.
// Soft delete instead of hard delete to comply with contract.
item.deletedAt = new Date();
item.status = "archived";
```

```javascript
// API returns ISO 8601 strings, converting to Date objects
// for easier manipulation throughout application.
const dates = timestamps.map((ts) => new Date(ts));
```

#### 7. Magic Numbers

**What the number represents:**

```typescript
// Maximum retry attempts before giving up.
// Based on average server recovery time of 3 seconds.
const MAX_RETRIES = 3;

// Debounce delay in milliseconds.
// 300ms provides good UX without feeling laggy.
const DEBOUNCE_DELAY = 300;
```

---

## When NOT to Comment

### ❌ DON'T Comment These

#### 1. What Code Does (Code Shows This)

```typescript
// ❌ BAD: Obvious from code
// Create a variable called count and set it to 0
const count = 0;

// ❌ BAD: Function name explains it
// Function to get user by ID
function getUserById(id: string) { ... }

// ❌ BAD: Just paraphrasing code
// Loop through items and filter out inactive ones
const active = items.filter(item => item.active);
```

#### 2. Self-Documenting Code

```typescript
// ✅ GOOD: No comment needed, code is clear
const isUserAuthenticated = token !== null && !isExpired(token);

// ❌ BAD: Comment just repeats code
// Check if user is authenticated by verifying token exists and isn't expired
const isUserAuthenticated = token !== null && !isExpired(token);
```

#### 3. Obvious Operations

```typescript
// ❌ BAD
// Increment counter
count++;

// ❌ BAD
// Return the user
return user;

// ❌ BAD
// Add item to array
items.push(item);
```

#### 4. Type Information

```typescript
// ❌ BAD: Types already show this
// Define interface for button props
interface ButtonProps {
  // The button label string
  label: string;
  // Click handler function
  onClick: () => void;
}

// ✅ GOOD: Types document themselves
interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

---

## Comment Style Guide

### Single-Line Comments

For brief explanations:

```typescript
// Use passive voice sparingly. Prefer active voice.
const result = calculateTotal(items);

// Not: "Calculate total" (obvious)
// Yes: "Using cached total to avoid recalculation"
```

### Multi-Line Comments

For longer explanations:

```typescript
/*
 * Using exponential backoff for retries to avoid overwhelming server.
 *
 * First retry: 1 second
 * Second retry: 2 seconds
 * Third retry: 4 seconds
 *
 * Based on server team's recommendation from incident post-mortem.
 */
const result = await retryWithBackoff(apiCall);
```

### TODO/FIXME/NOTE

With context and owner:

```typescript
// TODO(username): Add pagination when API supports it (planned Q2 2025)
const allItems = await fetchItems();

// FIXME: Intermittent race condition in Safari - investigation needed
// Occurs ~1% of the time, waiting for reproducible case
if (isSafari) { ... }

// NOTE: This threshold changed from 100 to 50 after user testing.
// Lower value feels more responsive according to 80% of test users.
const SCROLL_THRESHOLD = 50;
```

---

## Framework-Specific Examples

### React

```typescript
// Using useEffect cleanup to prevent memory leak.
// Component might unmount while async operation is in progress.
useEffect(() => {
  let cancelled = false;

  fetchData().then((data) => {
    if (!cancelled) setData(data);
  });

  return () => {
    cancelled = true;
  };
}, []);

// useCallback to prevent child re-renders.
// Child component is memoized and only re-renders if handler reference changes.
const handleClick = useCallback(() => {
  console.log(value);
}, [value]);
```

### Vue

```typescript
// Using computed instead of watch for derived state.
// Computed automatically tracks dependencies and caches result.
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Lifecycle hook runs after component is mounted to DOM.
// Refs are guaranteed to be available at this point.
onMounted(() => {
  animationRef.value?.play();
});
```

### Svelte

```svelte
<script>
// Using $: for reactive statement.
// Automatically re-runs when 'items' changes.
$: total = items.reduce((sum, item) => sum + item.price, 0);

// Bind creates two-way binding between input and variable.
// Updates variable when input changes, updates input when variable changes.
</script>

<input bind:value={searchQuery} />
```

---

## Bad Comment Examples

### Redundant Comments

```typescript
// ❌ Comments that repeat what code does

// Set loading to true
setLoading(true);

// Call the API
const data = await api.fetch();

// Set loading to false
setLoading(false);

// Return the data
return data;
```

### Vague Comments

```typescript
// ❌ Too vague to be helpful

// This is important
const TIMEOUT = 5000;

// Do the thing
processData(input);

// Magic number
if (count > 42) { ... }
```

### Outdated Comments

```typescript
// ❌ Code changed but comment didn't

// Using localStorage for persistence
// (Code actually uses sessionStorage now)
sessionStorage.setItem("key", value);
```

### Commented-Out Code

```typescript
// ❌ Delete it, it's in git history

// const oldApproach = () => {
//   return items.filter(item => {
//     return item.active && !item.deleted;
//   });
// };

const newApproach = () => items.filter((item) => item.active && !item.deleted);
```

---

## Good Comment Examples

### Explains Business Context

```typescript
// ✅ Provides business reasoning

// Client contract requires 30-day soft delete for legal compliance.
// Hard delete only after 30 days, triggered by scheduled job.
item.deletedAt = new Date();
item.deletedBy = currentUser.id;
```

### Explains Why Alternative Wasn't Used

```typescript
// ✅ Documents decision reasoning

// Considered using useReducer but state is simple enough for useState.
// Only 3 fields and no complex state transitions. Reducer would add
// unnecessary indirection without providing benefits.
const [formData, setFormData] = useState(initialData);
```

### Explains Performance Trade-Off

```typescript
// ✅ Justifies performance decision

// Loading entire dataset at once instead of pagination.
// Dataset is small (<100 items) and users need instant filtering
// across all items. Network round-trips would make filtering sluggish.
const allItems = await fetchAllItems();
```

### Explains External Constraint

```typescript
// ✅ Documents requirement from outside

// ISO 8601 format required by accounting system integration.
// Don't change format without coordinating with finance team.
const timestamp = date.toISOString();
```

---

## Documentation vs Comments

### JSDoc (Public API)

For functions/components others will use:

````typescript
/**
 * Fetches user data with automatic retry and caching.
 *
 * @param userId - Unique identifier for user
 * @param options - Optional configuration
 * @returns Promise resolving to User object
 * @throws {NetworkError} If all retry attempts fail
 *
 * @example
 * ```typescript
 * const user = await getUser('123');
 * console.log(user.name);
 * ```
 */
export async function getUser(
  userId: string,
  options?: RequestOptions
): Promise<User> {
  // Implementation...
}
````

### Inline Comments (Implementation)

For explaining non-obvious implementation details:

```typescript
export async function getUser(userId: string): Promise<User> {
  // Retry 3 times with exponential backoff.
  // API is sometimes slow but usually recovers quickly.
  // Backoff prevents hammering server during issues.
  return retry(() => api.get(`/users/${userId}`), {
    attempts: 3,
    backoff: "exponential",
  });
}
```

---

## Comment Maintenance

### Update Comments with Code

```typescript
// ❌ BAD: Code changed, comment didn't
// Returns array of active users
function getUsers() {
  return users.filter((u) => u.deleted === false);
}

// ✅ GOOD: Comment matches current code
// Returns array of non-deleted users (includes inactive)
function getUsers() {
  return users.filter((u) => u.deleted === false);
}
```

### Remove Obsolete Comments

```typescript
// ❌ BAD: Feature is implemented, remove TODO
// TODO: Add error handling
try {
  await saveData();
} catch (error) {
  handleError(error);
}

// ✅ GOOD: TODO removed since it's done
try {
  await saveData();
} catch (error) {
  handleError(error);
}
```

---

## Quality Checklist

Before committing, review your comments:

- [ ] Every comment explains WHY, not WHAT
- [ ] No commented-out code
- [ ] No TODO without context/date/owner
- [ ] No outdated comments
- [ ] No obvious comments
- [ ] All comments add value
- [ ] Complex logic has high-level explanation
- [ ] Business decisions are documented
- [ ] Performance trade-offs explained
- [ ] External constraints noted

---

## Remember

### Good Code Needs Few Comments

If you need many comments, consider:

1. **Better variable names** - Can code be more self-explanatory?
2. **Smaller functions** - Can you extract and name logical chunks?
3. **Better structure** - Can organization make intent clearer?

### Comments Are for Humans

When you feel the need to comment, ask:

1. Can I make the code clearer instead?
2. Is this explaining WHAT (bad) or WHY (good)?
3. Will this help someone 6 months from now?
4. Would I want this comment if I were new to the codebase?

### Code is the Source of Truth

Comments can become outdated.  
Code is always up-to-date.  
Write clear code, comment the reasoning.

---

**Customize this file for your team's commenting style!**

Common customizations:

- Comment format preferences (single-line vs multi-line)
- Team-specific TODO/FIXME formats
- Required context for certain comment types
- Framework-specific commenting patterns
- Examples from your actual codebase
