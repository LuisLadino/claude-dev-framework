# JavaScript Coding Standards Template

> **⚠️ WARNING: This is a BASIC TEMPLATE**
>
> These are generic JavaScript patterns. For current, detailed standards:
> 1. Run `/research-stack` in Claude to generate AI-researched standards
> 2. OR manually customize this file for your specific needs
>
> `/research-stack` will research modern JavaScript best practices and generate
> standards specific to your project with current patterns (2024-2025).

---

## Overview

These standards ensure clean, consistent, and maintainable JavaScript code using modern ES6+ features. Even without TypeScript, we can write reliable, well-structured code.

---

## ES6+ Features (Required)

### Use Modern JavaScript

All projects should use:
- ES6 modules (`import`/`export`)
- Arrow functions
- Template literals
- Destructuring
- Spread/rest operators
- `const`/`let` (never `var`)
- Async/await (not callback hell)
- Classes (when appropriate)

---

## Variables and Constants

### Use `const` by Default, `let` When Needed

**❌ Wrong:**
```javascript
var count = 0;
var user = { name: 'John' };
```

**✅ Correct:**
```javascript
const MAX_RETRIES = 3;
const user = { name: 'John' };

let count = 0;
count += 1;
```

**Rules:**
- Use `const` for values that won't be reassigned
- Use `let` for values that will change
- **Never use `var`**

---

## Functions

### Arrow Functions vs Function Declarations

**Use Arrow Functions For:**
- Callbacks
- Array methods
- Short, inline functions

**✅ Correct:**
```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);

const sum = numbers.reduce((acc, n) => acc + n, 0);

setTimeout(() => {
  console.log('Delayed action');
}, 1000);
```

**Use Function Declarations For:**
- Named functions
- Methods
- Functions that use `this`

**✅ Correct:**
```javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Function Parameters

**Use Destructuring and Defaults:**
```javascript
// ✅ Correct
function createUser({ name, email, age = 18 }) {
  return { name, email, age, createdAt: new Date() };
}

// ✅ With rest parameters
function sum(first, second, ...rest) {
  return [first, second, ...rest].reduce((a, b) => a + b, 0);
}
```

---

## Objects and Arrays

### Object Literals

**✅ Correct:**
```javascript
const name = 'John';
const age = 30;

// Shorthand properties
const user = {
  name,
  age,
  email: 'john@example.com'
};

// Shorthand methods
const calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  }
};

// Computed property names
const key = 'dynamicKey';
const obj = {
  [key]: 'value',
  [`${key}Count`]: 42
};
```

### Destructuring

**✅ Correct:**
```javascript
// Object destructuring
const { name, email } = user;
const { name: userName, email: userEmail } = user; // Rename

// Nested destructuring
const { address: { street, city } } = user;

// Array destructuring
const [first, second, ...rest] = numbers;

// Function parameters
function displayUser({ name, email }) {
  console.log(`${name} <${email}>`);
}
```

### Spread Operator

**✅ Correct:**
```javascript
// Array spread
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

// Object spread
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs };

// Cloning
const userCopy = { ...user };
const numbersCopy = [...numbers];
```

---

## Template Literals

### Use Template Literals for String Interpolation

**❌ Wrong:**
```javascript
const greeting = 'Hello, ' + user.name + '!';
const url = '/api/users/' + userId;
```

**✅ Correct:**
```javascript
const greeting = `Hello, ${user.name}!`;
const url = `/api/users/${userId}`;

// Multi-line strings
const html = `
  <div class="user-card">
    <h2>${user.name}</h2>
    <p>${user.email}</p>
  </div>
`;
```

---

## Array Methods

### Use Built-in Array Methods

**✅ Correct:**
```javascript
// Filter
const activeUsers = users.filter(user => user.status === 'active');

// Map
const userNames = users.map(user => user.name);

// Reduce
const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

// Find
const user = users.find(u => u.id === userId);

// Some/Every
const hasAdmin = users.some(user => user.role === 'admin');
const allActive = users.every(user => user.status === 'active');

// Chain methods
const result = users
  .filter(user => user.age >= 18)
  .map(user => user.name)
  .sort();
```

---

## Async/Await

### Use Async/Await for Asynchronous Code

**❌ Wrong (Callback Hell):**
```javascript
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    fetch(`/api/posts/${user.id}`)
      .then(response => response.json())
      .then(posts => {
        console.log(posts);
      });
  });
```

**✅ Correct:**
```javascript
async function fetchUserPosts(userId) {
  try {
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();
    
    const postsResponse = await fetch(`/api/posts/${user.id}`);
    const posts = await postsResponse.json();
    
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
}
```

### Parallel Async Operations

**✅ Correct:**
```javascript
// Wait for all promises
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);

// First to resolve
const fastest = await Promise.race([
  fetchFromCache(),
  fetchFromApi()
]);
```

---

## Error Handling

### Always Handle Errors

**✅ Correct:**
```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    
    // Provide fallback or rethrow
    return null;
  }
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required');
  }
}
```

---

## Modules (Import/Export)

### Use Named Exports

**❌ Wrong:**
```javascript
export default function myFunction() { }
```

**✅ Correct:**
```javascript
// Named exports
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Or export at end
function helper1() { }
function helper2() { }

export { helper1, helper2 };
```

### Import Best Practices

**✅ Correct:**
```javascript
// Named imports
import { calculateTotal, validateEmail } from './utils.js';

// Import everything
import * as utils from './utils.js';

// Import with alias
import { calculateTotal as getTotal } from './utils.js';
```

---

## Classes

### Use Classes for Object-Oriented Code

**✅ Correct:**
```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
  
  getDisplayName() {
    return `${this.name} <${this.email}>`;
  }
  
  isRecentlyCreated() {
    const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 7;
  }
}

// Inheritance
class AdminUser extends User {
  constructor(name, email, permissions) {
    super(name, email);
    this.permissions = permissions;
  }
  
  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}

// Static methods
class MathUtils {
  static add(a, b) {
    return a + b;
  }
}
```

---

## Null/Undefined Checks

### Use Optional Chaining and Nullish Coalescing

**✅ Correct:**
```javascript
// Optional chaining
const street = user?.address?.street;
const firstUser = users?.[0];
const result = obj.method?.();

// Nullish coalescing
const displayName = user.name ?? 'Anonymous';
const port = config.port ?? 3000;

// Logical AND for truthy checks
const canEdit = user && user.isAdmin && user.hasPermission('edit');
```

---

## Object and Array Patterns

### Immutable Operations

**✅ Correct:**
```javascript
// Array operations (immutable)
const newArray = [...oldArray, newItem]; // Add
const filtered = array.filter(item => item.id !== removeId); // Remove
const updated = array.map(item => 
  item.id === targetId ? { ...item, name: 'New Name' } : item
); // Update

// Object operations (immutable)
const updated = { ...user, name: 'New Name' };
const removed = (() => {
  const { password, ...rest } = user;
  return rest;
})();
```

---

## JSDoc Comments

### Document Complex Functions

**✅ Correct:**
```javascript
/**
 * Calculate the total price of items including tax
 * @param {Array<{price: number, quantity: number}>} items - Array of items
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns {number} Total price with tax
 * @example
 * calculateTotalWithTax([{ price: 10, quantity: 2 }], 0.08)
 * // returns 21.60
 */
function calculateTotalWithTax(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return subtotal * (1 + taxRate);
}
```

---

## Common Patterns

### API Calls

```javascript
async function apiCall(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  try {
    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Usage
const users = await apiCall('/api/users');
const newUser = await apiCall('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John' })
});
```

### Debouncing

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);
```

---

## Anti-Patterns to Avoid

### ❌ Don't Use `var`
```javascript
// Never
var count = 0;
```

### ❌ Don't Mutate Parameters
```javascript
// Wrong
function addItem(array, item) {
  array.push(item); // Mutates original
  return array;
}

// Correct
function addItem(array, item) {
  return [...array, item];
}
```

### ❌ Don't Use String Concatenation
```javascript
// Wrong
const message = 'Hello, ' + name + '!';

// Correct
const message = `Hello, ${name}!`;
```

### ❌ Don't Use Callbacks (Use Async/Await)
```javascript
// Wrong
function getData(callback) {
  fetch('/api/data')
    .then(r => r.json())
    .then(data => callback(data));
}

// Correct
async function getData() {
  const response = await fetch('/api/data');
  return await response.json();
}
```

---

## Quality Checklist

Before committing JavaScript code:

- [ ] No `var` declarations
- [ ] `const` used by default, `let` only when necessary
- [ ] Arrow functions used for callbacks
- [ ] Template literals for strings with variables
- [ ] Async/await for asynchronous code
- [ ] Destructuring used where appropriate
- [ ] Spread operator for copying/merging
- [ ] Array methods (`map`, `filter`, `reduce`) used correctly
- [ ] Errors are properly handled (try/catch)
- [ ] Named exports used (no default exports)
- [ ] JSDoc comments on public functions
- [ ] No console.log statements left in code
- [ ] Code is properly formatted (Prettier)

---

## ESLint Configuration

```json
{
  "env": {
    "es2021": true,
    "browser": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "warn",
    "prefer-template": "warn",
    "no-console": "warn"
  }
}
```

---

## Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

**Remember:** Modern JavaScript is powerful and expressive. Use ES6+ features to write clean, readable code.
