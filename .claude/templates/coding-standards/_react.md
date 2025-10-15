# React Coding Standards Template

> **⚠️ WARNING: This is a BASIC TEMPLATE**
>
> These are generic React patterns. For current, detailed standards:
> 1. Run `/research-stack` in Claude to generate AI-researched standards
> 2. OR manually customize this file for your specific needs
>
> `/research-stack` will research React's official docs and generate standards
> specific to your React version with current best practices (2024-2025).

---

## Component Structure

### Functional Components Only

Use functional components with hooks. No class components.

```tsx
// ✅ Correct
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Wrong
export class Button extends React.Component {
  // Don't use class components
}
```

---

## Exports

### Named Exports

Always use named exports for components.

```tsx
// ✅ Correct
export function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}

// ❌ Wrong
export default function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}
```

**Why:** Named exports enable better tree-shaking and make refactoring easier.

---

## Props

### TypeScript Interfaces

Define props with TypeScript interfaces, not types.

```tsx
// ✅ Correct
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ❌ Wrong
type ButtonProps = {
  label: string;
  onClick: () => void;
};
```

### Destructure Props

Always destructure props in the function parameters.

```tsx
// ✅ Correct
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Wrong
export function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Default Values

Provide default values for optional props.

```tsx
export function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  size = 'medium' 
}: ButtonProps) {
  // Implementation
}
```

---

## Hooks

### Hook Rules

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Always include dependencies in useEffect

```tsx
// ✅ Correct
export function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]); // Dependencies included
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ Wrong
export function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }); // Missing dependencies
}
```

### Custom Hooks

Extract reusable logic into custom hooks.

```tsx
// ✅ Correct
function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored || initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  
  return [value, setValue] as const;
}

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  // Use the hook
}
```

---

## State Management

### useState for Local State

Use useState for component-local state.

```tsx
export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Lift State Up

Share state by lifting it to common ancestor.

```tsx
// Parent component
export function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <>
      <Header theme={theme} onThemeChange={setTheme} />
      <Content theme={theme} />
    </>
  );
}
```

### Context for Deep Props

Use Context to avoid prop drilling.

```tsx
// Create context
const ThemeContext = createContext<Theme>('light');

// Provider
export function App() {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// Consumer
export function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>{/*...*/}</button>;
}
```

---

## Event Handlers

### Naming Convention

Prefix event handlers with "handle".

```tsx
// ✅ Correct
function handleClick() {
  console.log('clicked');
}

function handleSubmit(event: FormEvent) {
  event.preventDefault();
  // Handle submit
}

// ❌ Wrong
function click() { }
function onSubmit() { }
```

### Inline vs Function

Use inline for simple handlers, functions for complex logic.

```tsx
// ✅ Simple: Inline
<button onClick={() => setCount(count + 1)}>Increment</button>

// ✅ Complex: Function
function handleSubmit(event: FormEvent) {
  event.preventDefault();
  // Multiple lines of logic
  validateForm();
  sendData();
}

<form onSubmit={handleSubmit}>
```

---

## Conditional Rendering

### Ternary for Simple Conditions

```tsx
// ✅ Correct
return (
  <div>
    {isLoading ? <Spinner /> : <Content />}
  </div>
);
```

### && for Single Branch

```tsx
// ✅ Correct
return (
  <div>
    {error && <ErrorMessage error={error} />}
  </div>
);
```

### Early Return for Complex Conditions

```tsx
// ✅ Correct
export function UserProfile({ user }: UserProfileProps) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  if (user.banned) {
    return <div>User banned</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      {/* Rest of profile */}
    </div>
  );
}
```

---

## Lists and Keys

### Unique Keys

Always provide unique keys for list items.

```tsx
// ✅ Correct
export function TodoList({ todos }: TodoListProps) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// ❌ Wrong
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>
))}
```

---

## Component Composition

### Children Prop

Use children for flexible composition.

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

### Render Props

Use render props for flexible rendering logic.

```tsx
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch logic...
  
  return <>{children(data, loading, error)}</>;
}

// Usage
<DataFetcher url="/api/users">
  {(data, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <Error error={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

---

## Performance

### Memo for Expensive Components

Use React.memo for components that render often with same props.

```tsx
// ✅ Correct for expensive renders
export const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // Expensive calculation or large list
  return <div>{/* Heavy render */}</div>;
});
```

### useCallback for Event Handlers

Use useCallback for callbacks passed to memoized children.

```tsx
export function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}
```

### useMemo for Expensive Calculations

Use useMemo for expensive calculations.

```tsx
export function DataTable({ data }: DataTableProps) {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);
  
  return <table>{/* Render sortedData */}</table>;
}
```

---

## File Organization

### One Component Per File

Each component should have its own file.

```
src/components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.module.css (if using CSS modules)
│   └── index.ts
└── Card/
    ├── Card.tsx
    ├── Card.test.tsx
    └── index.ts
```

### Barrel Exports

Use index.ts for clean imports.

```tsx
// components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Usage elsewhere
import { Button } from '@/components/Button';
```

---

## Testing

### Test File Location

Colocate tests with components.

```
Button/
├── Button.tsx
├── Button.test.tsx  ← Next to component
└── index.ts
```

### React Testing Library

Test behavior, not implementation.

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Anti-Patterns

### Don't

❌ Use class components
❌ Use default exports
❌ Mutate state directly
❌ Use index as key in lists
❌ Call hooks conditionally
❌ Use inline object/array literals in JSX props
❌ Over-optimize with memo/useCallback
❌ Create components inside other components

### Do

✅ Use functional components
✅ Use named exports
✅ Use setState functions
✅ Use unique IDs as keys
✅ Call hooks at top level
✅ Define objects/arrays outside render
✅ Only optimize when profiling shows need
✅ Define components at module level

---

**Note:** This template is customized by `/research-stack` based on web research of current React best practices.