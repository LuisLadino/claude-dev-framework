# Svelte Coding Standards Template

> **⚠️ WARNING: This is a BASIC TEMPLATE**
>
> These are generic Svelte patterns. For current, detailed standards:
> 1. Run `/research-stack` in Claude to generate AI-researched standards
> 2. OR manually customize this file for your specific needs
>
> `/research-stack` will research Svelte's official docs and generate standards
> specific to your Svelte version with current best practices (2024-2025).

---

## Component Structure

### Standard Component Format

Use the standard structure: `<script>`, `<markup>`, `<style>`.

```svelte
<!-- ✅ Correct order -->
<script lang="ts">
  // Script first
</script>

<!-- Markup second (no wrapper tag needed) -->
<div>
  <h1>Hello</h1>
</div>

<style>
  /* Styles last */
</style>
```

---

## Script

### TypeScript

Always use TypeScript in scripts.

```svelte
<script lang="ts">
  let count: number = 0;
  
  function increment(): void {
    count++;
  }
</script>
```

---

## Props

### export let for Props

Use `export let` to define props.

```svelte
<script lang="ts">
  export let title: string;
  export let count: number = 0; // With default
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<div class={variant}>
  <h2>{title}</h2>
  <p>{count}</p>
</div>
```

---

## Reactivity

### Reactive Declarations

Use `$:` for reactive derived values.

```svelte
<script lang="ts">
  let count: number = 0;
  
  // Reactive declaration
  $: doubled = count * 2;
  
  // Reactive statement
  $: if (count > 10) {
    console.log('Count is high!');
  }
  
  // Reactive block
  $: {
    console.log(`Count is ${count}`);
    console.log(`Doubled is ${doubled}`);
  }
</script>

<div>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button on:click={() => count++}>Increment</button>
</div>
```

### Reactive Arrays and Objects

Trigger reactivity through assignment.

```svelte
<script lang="ts">
  let items: string[] = ['a', 'b', 'c'];
  
  // ✅ Correct: Assignment triggers reactivity
  function addItem() {
    items = [...items, 'new'];
  }
  
  // ❌ Wrong: Mutation doesn't trigger reactivity
  function addItemWrong() {
    items.push('new'); // Won't update UI
  }
</script>
```

---

## Stores

### Writable Stores

Use stores for shared state.

```typescript
// stores.ts
import { writable } from 'svelte/store';

export const count = writable(0);
export const user = writable<User | null>(null);
```

**Usage in component:**
```svelte
<script lang="ts">
  import { count } from './stores';
  
  // Auto-subscribe with $
  $: doubledCount = $count * 2;
  
  function increment() {
    count.update(n => n + 1);
  }
  
  function set() {
    count.set(10);
  }
</script>

<div>
  <p>Count: {$count}</p>
  <p>Doubled: {doubledCount}</p>
  <button on:click={increment}>+</button>
</div>
```

### Readable Stores

Use readable for read-only state.

```typescript
import { readable } from 'svelte/store';

export const time = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  return () => clearInterval(interval);
});
```

### Derived Stores

Use derived for computed values.

```typescript
import { derived } from 'svelte/store';
import { count } from './stores';

export const doubled = derived(count, $count => $count * 2);
```

### Custom Stores

Create custom stores with methods.

```typescript
function createCounter() {
  const { subscribe, set, update } = writable(0);
  
  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(0)
  };
}

export const counter = createCounter();
```

---

## Events

### Event Handlers

Use `on:` directive for events.

```svelte
<script lang="ts">
  function handleClick(event: MouseEvent) {
    console.log('Clicked!', event);
  }
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }
</script>

<button on:click={handleClick}>Click</button>
<input on:input={handleInput} />

<!-- Inline handlers -->
<button on:click={() => console.log('Clicked')}>Click</button>
```

### Event Modifiers

Use event modifiers for common patterns.

```svelte
<!-- preventDefault -->
<form on:submit|preventDefault={handleSubmit}>
  <!-- Form content -->
</form>

<!-- stopPropagation -->
<div on:click|stopPropagation={handleClick}>
  Click me
</div>

<!-- once -->
<button on:click|once={handleClick}>
  Click once
</button>
```

### Component Events

Dispatch custom events with createEventDispatcher.

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    close: void;
    select: { id: string };
  }>();
  
  function handleClose() {
    dispatch('close');
  }
  
  function handleSelect(id: string) {
    dispatch('select', { id });
  }
</script>

<button on:click={handleClose}>Close</button>

<!-- Parent listens -->
<!-- <Modal on:close={handleModalClose} on:select={handleSelect} /> -->
```

### Event Forwarding

Forward events to parent components.

```svelte
<!-- Button.svelte -->
<button on:click>
  <slot />
</button>

<!-- Parent can listen -->
<!-- <Button on:click={handleClick}>Click me</Button> -->
```

---

## Conditional Rendering

### {#if} Blocks

```svelte
{#if condition}
  <p>True branch</p>
{:else if otherCondition}
  <p>Else if branch</p>
{:else}
  <p>Else branch</p>
{/if}
```

---

## Lists

### {#each} Blocks

Always use keyed each blocks.

```svelte
<script lang="ts">
  interface Todo {
    id: string;
    text: string;
  }
  
  let todos: Todo[] = [
    { id: '1', text: 'Learn Svelte' },
    { id: '2', text: 'Build app' }
  ];
</script>

<!-- ✅ Correct: Keyed -->
<ul>
  {#each todos as todo (todo.id)}
    <li>{todo.text}</li>
  {/each}
</ul>

<!-- ❌ Wrong: Not keyed -->
<ul>
  {#each todos as todo}
    <li>{todo.text}</li>
  {/each}
</ul>

<!-- With index -->
{#each todos as todo, i (todo.id)}
  <li>{i + 1}. {todo.text}</li>
{/each}

<!-- With else -->
{#each todos as todo (todo.id)}
  <li>{todo.text}</li>
{:else}
  <p>No todos</p>
{/each}
```

---

## Lifecycle

### onMount

Run code when component mounts.

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  onMount(() => {
    console.log('Component mounted');
    
    // Return cleanup function
    return () => {
      console.log('Component unmounting');
    };
  });
</script>
```

### onDestroy

Run code when component destroys.

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);
  
  onDestroy(() => {
    clearInterval(interval);
  });
</script>
```

### beforeUpdate / afterUpdate

Run code before/after updates.

```svelte
<script lang="ts">
  import { beforeUpdate, afterUpdate } from 'svelte';
  
  beforeUpdate(() => {
    console.log('About to update');
  });
  
  afterUpdate(() => {
    console.log('Just updated');
  });
</script>
```

---

## Bindings

### Two-Way Binding

Use `bind:` for two-way data binding.

```svelte
<script lang="ts">
  let name: string = '';
  let checked: boolean = false;
  let selected: string = '';
</script>

<input bind:value={name} />
<input type="checkbox" bind:checked />

<select bind:value={selected}>
  <option value="a">A</option>
  <option value="b">B</option>
</select>

<p>Name: {name}</p>
<p>Checked: {checked}</p>
<p>Selected: {selected}</p>
```

### Component Bindings

Bind to component props.

```svelte
<!-- Child.svelte -->
<script lang="ts">
  export let value: string;
</script>

<!-- Parent.svelte -->
<script lang="ts">
  let text: string = '';
</script>

<Child bind:value={text} />
<p>Text: {text}</p>
```

---

## Slots

### Default Slot

```svelte
<!-- Card.svelte -->
<div class="card">
  <slot />
</div>

<!-- Usage -->
<Card>
  <p>Content</p>
</Card>
```

### Named Slots

```svelte
<!-- Card.svelte -->
<div class="card">
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot />
  </main>
  <footer>
    <slot name="footer" />
  </footer>
</div>

<!-- Usage -->
<Card>
  <svelte:fragment slot="header">
    <h2>Title</h2>
  </svelte:fragment>
  
  <p>Content</p>
  
  <svelte:fragment slot="footer">
    <button>Action</button>
  </svelte:fragment>
</Card>
```

### Slot Props

Pass data from child to parent.

```svelte
<!-- List.svelte -->
<script lang="ts">
  export let items: Array<{ id: string; name: string }>;
</script>

<ul>
  {#each items as item (item.id)}
    <li>
      <slot item={item} />
    </li>
  {/each}
</ul>

<!-- Usage -->
<List {items} let:item>
  <span>{item.name}</span>
</List>
```

---

## Styling

### Component Styles

Styles are scoped by default.

```svelte
<div class="button">Click me</div>

<style>
  .button {
    padding: 8px 16px;
    background: blue;
  }
</style>
```

### Global Styles

Use `:global()` for global styles.

```svelte
<style>
  :global(body) {
    margin: 0;
  }
  
  .card :global(.button) {
    margin: 0;
  }
</style>
```

---

## File Organization

### Component Structure

```
src/lib/components/
├── Button/
│   ├── Button.svelte
│   ├── Button.test.ts
│   └── index.ts
└── Card/
    ├── Card.svelte
    ├── Card.test.ts
    └── index.ts
```

### Barrel Exports

```typescript
// components/Button/index.ts
export { default as Button } from './Button.svelte';
```

---

## Testing

### Test with Svelte Testing Library

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
  it('calls onclick when clicked', async () => {
    const onClick = vi.fn();
    const { getByText } = render(Button, { props: { label: 'Click', onClick } });
    
    await fireEvent.click(getByText('Click'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Anti-Patterns

### Don't

❌ Forget keys in {#each} blocks
❌ Mutate arrays/objects without assignment
❌ Use bind: everywhere (use events)
❌ Create stores inside components
❌ Forget to unsubscribe from stores (use $ syntax)
❌ Over-use reactive declarations
❌ Put complex logic in templates

### Do

✅ Always use keys in lists
✅ Use assignment for reactivity
✅ Use events for one-way data flow
✅ Define stores at module level
✅ Use $ for auto-subscription
✅ Keep reactive declarations simple
✅ Extract complex logic to functions

---

**Note:** This template is customized by `/research-stack` based on web research of current Svelte best practices.