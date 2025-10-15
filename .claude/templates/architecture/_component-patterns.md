# Component Patterns Template

> **Template Purpose:** This file provides a starting point for component architecture patterns. The `/research-stack` command uses this template to generate framework-specific component patterns and best practices.

---

## Overview

Component patterns help create maintainable, reusable, and testable UI components. This template covers common patterns applicable across modern frameworks (React, Vue, Svelte).

---

## Core Principles

### 1. Single Responsibility

**Each component should do one thing well.**

**❌ Wrong:**
```typescript
// UserDashboard does too much
function UserDashboard() {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [notifications, setNotifications] = useState();
  
  // ... 200 lines of logic
  
  return (
    <div>
      {/* Profile section */}
      {/* Posts section */}
      {/* Comments section */}
      {/* Notifications section */}
    </div>
  );
}
```

**✅ Correct:**
```typescript
function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <UserPosts />
      <UserComments />
      <UserNotifications />
    </div>
  );
}

// Each component handles its own concern
function UserProfile() { }
function UserPosts() { }
function UserComments() { }
function UserNotifications() { }
```

### 2. Composition Over Inheritance

**Build complex UIs by composing simple components.**

**✅ Correct:**
```typescript
// Flexible Card component
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

// Usage - compose as needed
function UserCard() {
  return (
    <Card>
      <CardHeader>
        <h2>User Profile</h2>
      </CardHeader>
      <CardBody>
        <p>User details...</p>
      </CardBody>
    </Card>
  );
}
```

### 3. Props Down, Events Up

**Data flows down via props, changes flow up via callbacks.**

**✅ Correct:**
```typescript
// Parent
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  function handleAdd(text) {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  }
  
  function handleToggle(id) {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }
  
  return (
    <div>
      <AddTodoForm onAdd={handleAdd} />
      <TodoItems todos={todos} onToggle={handleToggle} />
    </div>
  );
}

// Children receive data and callbacks
function AddTodoForm({ onAdd }) { }
function TodoItems({ todos, onToggle }) { }
```

---

## Component Types

### 1. Presentational Components (Dumb/Stateless)

**Purpose:** Display data, no business logic

**Characteristics:**
- Receive data via props
- No state management
- No side effects
- Pure functions
- Easy to test

**✅ Example:**
```typescript
interface UserCardProps {
  name: string;
  email: string;
  avatar: string;
}

export function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}
```

### 2. Container Components (Smart/Stateful)

**Purpose:** Manage state and logic

**Characteristics:**
- Fetch data
- Manage state
- Handle business logic
- Pass data to presentational components

**✅ Example:**
```typescript
export function UserCardContainer({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUser() {
      const data = await api.getUser(userId);
      setUser(data);
      setLoading(false);
    }
    fetchUser();
  }, [userId]);
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;
  
  return <UserCard {...user} />;
}
```

### 3. Layout Components

**Purpose:** Structure and position child components

**✅ Example:**
```typescript
export function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function TwoColumnLayout({ sidebar, children }) {
  return (
    <div className="two-column">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
```

---

## Common Patterns

### 1. Compound Components

**Pattern:** Components that work together

**✅ Example:**
```typescript
// Accordion compound component
export function Accordion({ children }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  
  function toggle(id: string) {
    const newSet = new Set(openItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setOpenItems(newSet);
  }
  
  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ id, title, children }) {
  const { openItems, toggle } = useAccordion();
  const isOpen = openItems.has(id);
  
  return (
    <div className="accordion-item">
      <button onClick={() => toggle(id)}>
        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// Usage
<Accordion>
  <AccordionItem id="1" title="Section 1">Content 1</AccordionItem>
  <AccordionItem id="2" title="Section 2">Content 2</AccordionItem>
</Accordion>
```

### 2. Render Props

**Pattern:** Share code using a prop whose value is a function

**✅ Example:**
```typescript
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => JSX.Element;
}

export function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return render(position);
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse at: {x}, {y}</div>
  )}
/>
```

### 3. Higher-Order Components (HOCs)

**Pattern:** Function that takes a component and returns a new component

**✅ Example:**
```typescript
function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

### 4. Custom Hooks

**Pattern:** Extract and reuse stateful logic

**✅ Example:**
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <ThemeSelector value={theme} onChange={setTheme} />;
}
```

### 5. Provider Pattern

**Pattern:** Share data across component tree

**✅ Example:**
```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

function Dashboard() {
  const { theme, setTheme } = useTheme();
  // ...
}
```

---

## Component Sizing Guidelines

### When to Break Down Components

**Break into smaller components when:**
- Component exceeds 200 lines
- Logic is duplicated
- Component has multiple responsibilities
- Difficult to test
- Difficult to understand

**✅ Example (Breaking Down):**
```typescript
// Too large
function UserProfile() {
  // 300 lines of JSX and logic
}

// Broken down
function UserProfile() {
  return (
    <>
      <UserAvatar />
      <UserInfo />
      <UserStats />
      <UserActions />
    </>
  );
}
```

---

## Props Patterns

### 1. Typed Props (TypeScript)

**✅ Correct:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ 
  variant, 
  size = 'md', 
  disabled = false,
  onClick,
  children 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### 2. Default Props

**✅ Correct:**
```typescript
interface CardProps {
  title?: string;
  elevation?: number;
  children: React.ReactNode;
}

export function Card({ 
  title, 
  elevation = 1,
  children 
}: CardProps) {
  return (
    <div className={`card elevation-${elevation}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
```

### 3. Spread Props (Pass-Through)

**✅ Correct:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      <label>{label}</label>
      <input {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Usage
<Input 
  label="Email" 
  type="email"
  placeholder="you@example.com"
  required
/>
```

---

## Conditional Rendering Patterns

### 1. Early Returns

**✅ Correct:**
```typescript
export function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return (
    <div>
      <h1>{user.name}</h1>
      {/* ... */}
    </div>
  );
}
```

### 2. Logical AND

**✅ Correct:**
```typescript
{isLoggedIn && <DashboardLink />}
{hasNotifications && <NotificationBadge count={count} />}
```

### 3. Ternary Operator

**✅ Correct:**
```typescript
{isLoading ? <Spinner /> : <Content />}
{user ? <UserGreeting name={user.name} /> : <LoginPrompt />}
```

---

## Performance Patterns

### 1. Memoization

**✅ Correct:**
```typescript
// Memoize expensive component
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});

// Memoize expensive calculation
function DataTable({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  
  return <Table items={sortedItems} />;
}

// Memoize callbacks
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const handleAdd = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }, []);
  
  return <TodoForm onSubmit={handleAdd} />;
}
```

### 2. Lazy Loading

**✅ Correct:**
```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

---

## Error Handling

### Error Boundaries

**✅ Correct:**
```typescript
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Anti-Patterns to Avoid

### ❌ Don't Use Index as Key
```typescript
// Wrong
{items.map((item, index) => <Item key={index} {...item} />)}

// Correct
{items.map(item => <Item key={item.id} {...item} />)}
```

### ❌ Don't Mutate State Directly
```typescript
// Wrong
state.items.push(newItem);
setState(state);

// Correct
setState({ items: [...state.items, newItem] });
```

### ❌ Don't Define Components Inside Components
```typescript
// Wrong
function Parent() {
  function Child() { }
  return <Child />;
}

// Correct
function Child() { }
function Parent() {
  return <Child />;
}
```

---

## Quality Checklist

- [ ] Single responsibility - one concern per component
- [ ] Proper component type (presentational/container/layout)
- [ ] Props properly typed
- [ ] No prop drilling (use context/state management)
- [ ] Memoization for expensive operations
- [ ] Error boundaries in place
- [ ] Accessible (ARIA, keyboard nav)
- [ ] Tested (unit + integration)
- [ ] Components < 200 lines
- [ ] Reusable and composable

---

**Remember:** Great components are small, focused, and composable. Build complex UIs from simple building blocks.
