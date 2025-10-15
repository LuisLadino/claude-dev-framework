# Vue Coding Standards Template

> **⚠️ WARNING: This is a BASIC TEMPLATE**
>
> These are generic Vue patterns. For current, detailed standards:
> 1. Run `/research-stack` in Claude to generate AI-researched standards
> 2. OR manually customize this file for your specific needs
>
> `/research-stack` will research Vue's official docs and generate standards
> specific to your Vue version with current best practices (2024-2025).

---

## Component Structure

### Single File Components (SFC)

Use the standard SFC structure: `<script setup>`, `<template>`, `<style>`.

```vue
<!-- ✅ Correct order -->
<script setup lang="ts">
// Script first
</script>

<template>
  <!-- Template second -->
</template>

<style scoped>
/* Styles last */
</style>
```

---

## Script Setup

### Use Composition API with Script Setup

Always use `<script setup>` with Composition API.

```vue
<!-- ✅ Correct -->
<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<!-- ❌ Wrong: Options API -->
<script lang="ts">
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

---

## Props

### defineProps with TypeScript

Use `defineProps` with TypeScript interface.

```vue
<script setup lang="ts">
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  disabled: false,
});
</script>

<template>
  <button :disabled="props.disabled">
    {{ props.label }}
  </button>
</template>
```

### Default Values

Use `withDefaults` for optional props.

```vue
<script setup lang="ts">
interface Props {
  title: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  active: false,
});
</script>
```

---

## Emits

### defineEmits with TypeScript

Define emits with type information.

```vue
<script setup lang="ts">
interface Emits {
  (e: "update", value: string): void;
  (e: "close"): void;
}

const emit = defineEmits<Emits>();

function handleUpdate(value: string) {
  emit("update", value);
}

function handleClose() {
  emit("close");
}
</script>
```

---

## Reactivity

### ref for Primitives

Use `ref()` for primitive values.

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const message = ref("Hello");

function increment() {
  count.value++; // .value to access/mutate
}
</script>

<template>
  <!-- No .value in template -->
  <div>{{ count }}</div>
  <button @click="increment">+</button>
</template>
```

### reactive for Objects

Use `reactive()` for objects.

```vue
<script setup lang="ts">
import { reactive } from "vue";

interface User {
  name: string;
  age: number;
}

const user = reactive<User>({
  name: "John",
  age: 30,
});

function updateName(newName: string) {
  user.name = newName; // No .value needed
}
</script>
```

### computed for Derived State

Use `computed()` for derived values.

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>

<template>
  <div>{{ fullName }}</div>
</template>
```

---

## Lifecycle

### Lifecycle Hooks in Composition API

Use lifecycle hooks from vue.

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, onBeforeUpdate } from "vue";

onMounted(() => {
  console.log("Component mounted");
  // Setup side effects
});

onUnmounted(() => {
  console.log("Component unmounting");
  // Cleanup
});

onBeforeUpdate(() => {
  console.log("Before update");
});
</script>
```

---

## Watchers

### watch for Reactive Values

Use `watch` to react to changes.

```vue
<script setup lang="ts">
import { ref, watch } from "vue";

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Watch multiple sources
watch([count, anotherRef], ([newCount, newOther]) => {
  // React to either changing
});
</script>
```

### watchEffect for Auto-tracking

Use `watchEffect` for auto-dependency tracking.

```vue
<script setup lang="ts">
import { ref, watchEffect } from "vue";

const count = ref(0);

watchEffect(() => {
  // Automatically tracks count
  document.title = `Count: ${count.value}`;
});
</script>
```

---

## Template Syntax

### v-bind Shorthand

Use `:` shorthand for v-bind.

```vue
<!-- ✅ Correct -->
<img :src="imageSrc" :alt="imageAlt" />

<!-- ❌ Wrong -->
<img v-bind:src="imageSrc" v-bind:alt="imageAlt" />
```

### v-on Shorthand

Use `@` shorthand for v-on.

```vue
<!-- ✅ Correct -->
<button @click="handleClick">Click</button>

<!-- ❌ Wrong -->
<button v-on:click="handleClick">Click</button>
```

### v-if vs v-show

Use v-if for conditional rendering, v-show for toggling visibility.

```vue
<!-- Use v-if when condition rarely changes -->
<div v-if="isLoggedIn">
  Welcome back!
</div>

<!-- Use v-show when toggling frequently -->
<div v-show="isVisible">
  Toggle me often
</div>
```

### v-for with Key

Always use `:key` with v-for.

```vue
<!-- ✅ Correct -->
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>

<!-- ❌ Wrong -->
<li v-for="item in items">
  {{ item.name }}
</li>
```

---

## Composables

### Extract Reusable Logic

Create composables for reusable stateful logic.

```typescript
// composables/useCounter.ts
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    doubled,
    increment,
    decrement,
  };
}
```

**Usage:**

```vue
<script setup lang="ts">
import { useCounter } from "@/composables/useCounter";

const { count, doubled, increment, decrement } = useCounter(0);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

---

## Slots

### Named Slots

Use named slots for flexible composition.

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>

    <main>
      <slot />
      <!-- Default slot -->
    </main>

    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<!-- Usage -->
<Card>
  <template #header>
    <h2>Title</h2>
  </template>
  
  <p>Content goes here</p>
  
  <template #footer>
    <button>Action</button>
  </template>
</Card>
```

### Scoped Slots

Use scoped slots to pass data to parent.

```vue
<!-- List.vue -->
<script setup lang="ts">
interface Props {
  items: Array<{ id: string; name: string }>;
}

const props = defineProps<Props>();
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" />
    </li>
  </ul>
</template>

<!-- Usage -->
<List :items="users">
  <template #default="{ item }">
    <span>{{ item.name }}</span>
  </template>
</List>
```

---

## State Management (Pinia)

### Store Definition

Define stores with Pinia's setup syntax.

```typescript
// stores/counter.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
  // State
  const count = ref(0);

  // Getters
  const doubled = computed(() => count.value * 2);

  // Actions
  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return {
    count,
    doubled,
    increment,
    decrement,
  };
});
```

**Usage in component:**

```vue
<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
</script>

<template>
  <div>
    <p>{{ counter.count }}</p>
    <button @click="counter.increment">+</button>
  </div>
</template>
```

---

## File Organization

### Component Structure

```
src/components/
├── Button/
│   ├── Button.vue
│   ├── Button.test.ts
│   └── index.ts
└── Card/
    ├── Card.vue
    ├── Card.test.ts
    └── index.ts
```

### Barrel Exports

```typescript
// components/Button/index.ts
export { default as Button } from "./Button.vue";
```

---

## Styling

### Scoped Styles

Use `scoped` for component-specific styles.

```vue
<style scoped>
.button {
  padding: 8px 16px;
  border-radius: 4px;
}
</style>
```

### Deep Selectors

Use `:deep()` for styling child components.

```vue
<style scoped>
.card :deep(.button) {
  margin: 0;
}
</style>
```

### CSS Modules

For maximum encapsulation, use CSS Modules.

```vue
<template>
  <div :class="$style.button">Click me</div>
</template>

<style module>
.button {
  padding: 8px 16px;
}
</style>
```

---

## Testing

### Test File Location

Colocate tests with components.

```
Button/
├── Button.vue
├── Button.test.ts  ← Next to component
└── index.ts
```

### Vue Test Utils

Test component behavior.

```typescript
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  it("emits click event when clicked", async () => {
    const wrapper = mount(Button, {
      props: { label: "Click me" },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("is disabled when disabled prop is true", () => {
    const wrapper = mount(Button, {
      props: { label: "Click me", disabled: true },
    });

    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });
});
```

---

## Anti-Patterns

### Don't

❌ Use Options API (use Composition API)
❌ Access `this` (not available in script setup)
❌ Forget .value on refs in script
❌ Use .value on refs in template
❌ Mutate props directly
❌ Forget keys in v-for
❌ Use v-if with v-for on same element
❌ Create nested watchers

### Do

✅ Use Composition API with script setup
✅ Use refs and reactive appropriately
✅ Use computed for derived state
✅ Use composables for reusable logic
✅ Emit events to communicate with parent
✅ Always use keys in lists
✅ Separate v-if and v-for
✅ Clean up side effects in onUnmounted

---

**Note:** This template is customized by `/research-stack` based on web research of current Vue 3 best practices.
