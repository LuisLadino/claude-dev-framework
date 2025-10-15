# Component Documentation Standards

**Template Version:** 1.0.0  
**Last Updated:** 2025-01-09

> **Note:** This is a template file. When you run `init-stack.sh`, it gets copied to `.claude/your-stack/documentation-standards/component-docs.md` where you can customize it for your project.

---

## Core Principle

**Document the PUBLIC API, not the implementation.**

Users need to know HOW to use your component, not HOW it works internally.

---

## When to Document

### ✅ DO Document These

#### 1. Public/Exported Components

Components that others will import and use:

```typescript
/**
 * Primary button component with multiple variants and sizes.
 * 
 * Supports loading states, icons, and accessibility features.
 * Automatically handles focus management and keyboard navigation.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleSubmit}>
 *   Submit Form
 * </Button>
 * ```
 * 
 * @example
 * With loading state:
 * ```tsx
 * <Button variant="primary" isLoading disabled>
 *   Submitting...
 * </Button>
 * ```
 */
export function Button(props: ButtonProps) {
  // Implementation...
}
```

#### 2. Complex Prop Interfaces

Props that aren't self-explanatory:

```typescript
interface DataTableProps {
  /**
   * Data to display in the table.
   * Each item must include unique `id` field for row identification.
   */
  data: Array<Record<string, any>>;
  
  /**
   * Column definitions for table headers and data access.
   * 
   * @example
   * ```typescript
   * columns={[
   *   { key: 'name', header: 'Full Name', sortable: true },
   *   { key: 'email', header: 'Email Address' }
   * ]}
   * ```
   */
  columns: ColumnDef[];
  
  /**
   * Callback fired when row is clicked.
   * Receives the full row data object.
   */
  onRowClick?: (row: Record<string, any>) => void;
}
```

#### 3. Non-Obvious Behavior

Important behaviors that aren't obvious from the code:

```typescript
/**
 * Modal component with built-in accessibility features.
 * 
 * Features:
 * - Traps focus inside modal when open
 * - Closes on Escape key press
 * - Returns focus to trigger element on close
 * - Disables body scroll when open
 * - Announces to screen readers
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to continue?</p>
 *   <Button onClick={handleConfirm}>Yes</Button>
 * </Modal>
 * ```
 */
export function Modal(props: ModalProps) {
  // Implementation...
}
```

#### 4. Usage Constraints

Important requirements or limitations:

```typescript
/**
 * Infinite scroll container for loading data progressively.
 * 
 * Requirements:
 * - Container must have fixed height or be inside flex/grid container
 * - `loadMore` callback must be async
 * - Initial data must not be empty
 * 
 * @example
 * ```tsx
 * <div style={{ height: '500px' }}>
 *   <InfiniteScroll
 *     data={items}
 *     loadMore={async () => {
 *       const more = await fetchMore();
 *       setItems([...items, ...more]);
 *     }}
 *     hasMore={hasMore}
 *   />
 * </div>
 * ```
 */
export function InfiniteScroll(props: InfiniteScrollProps) {
  // Implementation...
}
```

---

## When NOT to Document

### ❌ DON'T Document These

#### 1. Internal/Private Components

Components not exported, only used internally:

```typescript
// ❌ DON'T: Internal helper, not exported
function InternalLoadingSpinner() {
  return <div className="spinner" />;
}

// ✅ DO: Public component, exported
/**
 * Loading spinner with customizable size and color.
 */
export function LoadingSpinner(props: SpinnerProps) {
  return <InternalLoadingSpinner />;
}
```

#### 2. Trivial Wrappers

Simple components where usage is obvious:

```typescript
// ❌ DON'T: Obvious from code
/**
 * Container component that wraps children in a div.
 * @param children - Child elements
 */
export function Container({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}

// ✅ DO: Just write clear code
export function Container({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>;
}
```

#### 3. Self-Explanatory Props

Props that are obvious from their type:

```typescript
// ❌ DON'T: Over-documenting obvious props
interface ButtonProps {
  /** The text displayed inside the button */
  children: ReactNode;
  /** Function called when button is clicked */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
}

// ✅ DO: Only document non-obvious ones
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /**
   * Loading state that disables button and shows spinner.
   * Useful during async operations to prevent double-clicks.
   */
  isLoading?: boolean;
}
```

---

## JSDoc Format

### Basic Template

```typescript
/**
 * Brief one-line description of the component.
 * 
 * Optional longer description explaining:
 * - What problem it solves
 * - Key features or behaviors
 * - Important constraints
 * 
 * @example
 * ```tsx
 * <ComponentName prop="value">
 *   Content
 * </ComponentName>
 * ```
 */
export function ComponentName(props: Props) {
  // Implementation...
}
```

### Full Template

```typescript
/**
 * Brief description (one sentence, ends with period).
 * 
 * Detailed description explaining:
 * - Purpose and primary use case
 * - Key features and behaviors
 * - Important constraints or requirements
 * - Accessibility features (if applicable)
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <Component
 *   prop="value"
 *   onEvent={handler}
 * />
 * ```
 * 
 * @example
 * Advanced usage:
 * ```tsx
 * <Component
 *   prop="value"
 *   onEvent={handler}
 *   optionalProp={customValue}
 * >
 *   <ChildComponent />
 * </Component>
 * ```
 * 
 * @see RelatedComponent For similar functionality
 * @see https://docs.example.com/component External documentation
 */
export function Component(props: ComponentProps) {
  // Implementation...
}
```

---

## Framework-Specific Examples

### React Component

```typescript
/**
 * Dropdown menu with keyboard navigation and accessibility.
 * 
 * Features:
 * - Arrow key navigation through items
 * - Type-ahead search (press letters to jump to items)
 * - ARIA labels for screen readers
 * - Automatic positioning (flips when near viewport edge)
 * - Click-outside to close
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<button>Open Menu</button>}
 *   items={[
 *     { label: 'Profile', value: 'profile', icon: UserIcon },
 *     { label: 'Settings', value: 'settings', icon: SettingsIcon },
 *     { label: 'Logout', value: 'logout', icon: LogoutIcon }
 *   ]}
 *   onSelect={(item) => navigate(item.value)}
 * />
 * ```
 */
export function Dropdown(props: DropdownProps) {
  // Implementation...
}

interface DropdownProps {
  /**
   * Element that triggers the dropdown when clicked.
   * Can be any React element (button, link, custom component).
   */
  trigger: ReactElement;
  
  /**
   * Menu items to display in dropdown.
   * Each item must have unique `value` for keyboard navigation.
   */
  items: Array<{
    label: string;
    value: string;
    icon?: ComponentType;
    disabled?: boolean;
  }>;
  
  /**
   * Callback when item is selected via click or Enter key.
   * Not called for disabled items.
   */
  onSelect: (item: { label: string; value: string }) => void;
  
  /**
   * Position of dropdown relative to trigger.
   * Automatically flips if there's no space.
   * @default 'bottom-start'
   */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}
```

### Vue Component

```vue
<script setup lang="ts">
/**
 * Tabs component with automatic URL synchronization.
 * 
 * Features:
 * - Syncs active tab with URL query parameter
 * - Supports keyboard navigation (Arrow keys, Home, End)
 * - Lazy loads tab content (only renders active tab)
 * - Accessible with proper ARIA roles
 * 
 * @example
 * ```vue
 * <Tabs defaultTab="overview" queryParam="section">
 *   <TabPanel label="Overview" value="overview">
 *     <p>Overview content here</p>
 *   </TabPanel>
 *   <TabPanel label="Settings" value="settings">
 *     <p>Settings content here</p>
 *   </TabPanel>
 * </Tabs>
 * ```
 */

interface Props {
  /**
   * Initially active tab value.
   * Overridden by URL query parameter if present.
   * @default First tab
   */
  defaultTab?: string;
  
  /**
   * URL query parameter name for tab synchronization.
   * Tab changes update URL, URL changes update tab.
   * @default 'tab'
   */
  queryParam?: string;
  
  /**
   * Callback when active tab changes.
   * Receives the new tab value.
   */
  onTabChange?: (tab: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  queryParam: 'tab'
});
</script>
```

### Svelte Component

```svelte
<script lang="ts">
/**
 * Toast notification with auto-dismiss and queue management.
 * 
 * Features:
 * - Automatic dismissal after configurable timeout
 * - Queue multiple toasts (shows one at a time)
 * - Pause timeout on hover
 * - Accessible announcements (screen readers)
 * - Slide-in animation
 * 
 * @example
 * ```svelte
 * <Toast
 *   message="File uploaded successfully"
 *   type="success"
 *   duration={3000}
 * />
 * ```
 * 
 * @example
 * Without auto-dismiss:
 * ```svelte
 * <Toast
 *   message="Critical error occurred"
 *   type="error"
 *   duration={0}
 *   onClose={handleClose}
 * />
 * ```
 */

/**
 * Message to display in toast.
 */
export let message: string;

/**
 * Toast type determines color scheme and icon.
 */
export let type: 'success' | 'error' | 'warning' | 'info' = 'info';

/**
 * Auto-dismiss after this many milliseconds.
 * Set to 0 to disable auto-dismiss (must close manually).
 * @default 5000
 */
export let duration = 5000;

/**
 * Callback when toast is closed (auto or manual).
 * Use this to update external state.
 */
export let onClose: (() => void) | undefined = undefined;
</script>
```

---

## Prop Documentation Patterns

### Simple Props

```typescript
interface SimpleProps {
  /** User's full name for display */
  name: string;
  
  /** Whether component is in loading state */
  isLoading?: boolean;
  
  /** Maximum number of items to show */
  limit?: number;
}
```

### Complex Props

```typescript
interface ComplexProps {
  /**
   * Callback when user submits the form.
   * 
   * Receives validated form data. Will not be called if
   * validation fails. Should handle errors internally and
   * return boolean indicating success.
   * 
   * @param data - Form values that passed validation
   * @returns Promise resolving to true if submit succeeded
   * 
   * @example
   * ```typescript
   * onSubmit={async (data) => {
   *   try {
   *     await api.submit(data);
   *     return true;
   *   } catch (error) {
   *     showError(error);
   *     return false;
   *   }
   * }}
   * ```
   */
  onSubmit: (data: FormData) => Promise<boolean>;
}
```

### Props with Constraints

```typescript
interface ConstrainedProps {
  /**
   * Number of items to display per page.
   * 
   * Must be between 10 and 100. Values outside this range
   * will be clamped to nearest valid value.
   * 
   * @default 20
   * @minimum 10
   * @maximum 100
   */
  pageSize?: number;
  
  /**
   * Unique identifier for the resource.
   * 
   * Must match format: `usr_` followed by 20 alphanumeric characters.
   * Example: `usr_a1b2c3d4e5f6g7h8i9j0`
   */
  userId: string;
}
```

### Union Type Props

```typescript
interface UnionProps {
  /**
   * Size variant for component.
   * 
   * - `sm`: 32px height, compact spacing
   * - `md`: 40px height, default spacing (recommended)
   * - `lg`: 48px height, generous spacing
   * 
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}
```

---

## Documentation Quality Checklist

Before considering component documented:

- [ ] One-line summary is clear and concise
- [ ] Key features/behaviors are explained
- [ ] At least one `@example` is provided
- [ ] Example shows realistic usage (not just `<Component />`)
- [ ] Non-obvious props are documented
- [ ] Default values are specified
- [ ] Complex types have explanations
- [ ] Constraints or requirements are noted
- [ ] Related components are linked
- [ ] No documentation of obvious props
- [ ] No documentation of internal functions
- [ ] Examples compile without errors

---

## Common Patterns

### Render Props

```typescript
/**
 * List component with customizable item rendering.
 * 
 * @example
 * ```tsx
 * <List
 *   items={users}
 *   renderItem={(user) => (
 *     <div>
 *       <h3>{user.name}</h3>
 *       <p>{user.email}</p>
 *     </div>
 *   )}
 * />
 * ```
 */
interface ListProps<T> {
  /**
   * Array of items to render.
   */
  items: T[];
  
  /**
   * Function to render each item.
   * Receives item and index, returns React element.
   */
  renderItem: (item: T, index: number) => ReactNode;
}
```

### Compound Components

```typescript
/**
 * Accordion component with collapsible sections.
 * 
 * Use AccordionItem children to define sections.
 * Only one section can be open at a time (controlled by Accordion).
 * 
 * @example
 * ```tsx
 * <Accordion defaultOpen="section1">
 *   <AccordionItem value="section1" title="First Section">
 *     <p>Content for first section</p>
 *   </AccordionItem>
 *   <AccordionItem value="section2" title="Second Section">
 *     <p>Content for second section</p>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion(props: AccordionProps) {
  // Implementation...
}

/**
 * Individual section within an Accordion.
 * Must be direct child of Accordion component.
 */
export function AccordionItem(props: AccordionItemProps) {
  // Implementation...
}
```

### Controlled vs Uncontrolled

```typescript
/**
 * Input component that can be controlled or uncontrolled.
 * 
 * @example
 * Controlled (you manage state):
 * ```tsx
 * const [value, setValue] = useState('');
 * 
 * <Input
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * />
 * ```
 * 
 * @example
 * Uncontrolled (component manages state):
 * ```tsx
 * <Input
 *   defaultValue="initial"
 *   onChange={(e) => console.log(e.target.value)}
 * />
 * ```
 */
interface InputProps {
  /**
   * Controlled value. When provided, component is controlled.
   * Must be used with onChange to update value.
   */
  value?: string;
  
  /**
   * Default value for uncontrolled mode.
   * Ignored if `value` prop is provided.
   */
  defaultValue?: string;
  
  /**
   * Callback when input value changes.
   * Required for controlled mode, optional for uncontrolled.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
```

---

## Remember

### Users Need to Know:

**HOW to use it:**
- What props to pass
- What the component does
- When to use it

**WHAT to expect:**
- Component behavior
- Side effects
- Event callbacks

**WHEN to use it:**
- Appropriate use cases
- When NOT to use it
- Alternatives if any

### Users DON'T Need to Know:

**HOW it's implemented:**
- Internal state management
- Helper functions
- Implementation details

**WHY (that's for code comments):**
- Why specific algorithm chosen
- Why this approach vs alternatives
- Performance optimizations

---

## Quick Reference

```typescript
// ✅ Good Documentation
/**
 * Fetches and displays user profile with loading and error states.
 * 
 * Automatically refetches when userId prop changes.
 * Shows skeleton loader during initial load.
 * Handles errors gracefully with retry option.
 * 
 * @example
 * <UserProfile userId="123" onUpdate={handleUpdate} />
 */

// ❌ Bad Documentation
/**
 * UserProfile component
 * @param props - The props
 * @returns React element
 */

// ❌ No Documentation (for public component)
export function UserProfile(props: Props) {
  // Implementation...
}

// ✅ No Documentation Needed (private component)
function InternalHelper() {
  // Implementation...
}
```

---

**Customize this file for your team's documentation standards!**

Common customizations:
- JSDoc format preferences (@param vs inline)
- Required @tags for documentation
- Example code style
- Framework-specific patterns
- Your team's component patterns
- Links to design system or storybook
