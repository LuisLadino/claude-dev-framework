# Vue Example Configuration

This example shows a complete Claude Development Framework setup for a **Vue 3** project with Composition API, TypeScript, Tailwind CSS, and Vitest.

---

## Project Overview

**Stack:**
- Vue 3 (Composition API)
- TypeScript (Strict mode)
- Tailwind CSS v4
- Vite (Build tool)
- Vitest (Testing)
- Pinia (State management)
- pnpm (Package manager)

**Project Type:** Single Page Application (SPA)

---

## Directory Structure

```
your-vue-project/
├── .claude/
│   ├── CLAUDE.md                    # Framework core (from repo)
│   ├── commands/                    # Commands (from repo)
│   ├── workflows/                   # Workflows (from repo)
│   ├── templates/                   # Templates (from repo)
│   └── your-stack/                  # YOUR CUSTOMIZATIONS ⬇️
│       ├── stack-config.yaml
│       ├── coding-standards/
│       │   ├── vue-standards.md
│       │   ├── typescript-standards.md
│       │   ├── composables-standards.md
│       │   └── pinia-standards.md
│       ├── architecture/
│       │   ├── file-structure.md
│       │   └── component-patterns.md
│       └── documentation-standards/
│           └── component-docs.md
├── src/
│   ├── components/         # Vue components
│   ├── composables/        # Composition API logic
│   ├── stores/            # Pinia stores
│   ├── views/             # Route views
│   ├── router/            # Vue Router
│   └── App.vue            # Root component
├── public/
├── package.json
└── vite.config.ts
```

---

## Configuration Files

### stack-config.yaml

```yaml
name: "My Vue App"
version: "1.0.0"

stack:
  framework: "Vue"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"
  state_management: "Pinia"
  router: "Vue Router"
  package_manager: "pnpm"

standards_active:
  - vue-standards
  - typescript-standards
  - composables-standards
  - pinia-standards

tools:
  mcp_servers: []

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  views_dir: "src/views"
  composables_dir: "src/composables"
  stores_dir: "src/stores"
  
  # Vue specific
  vue_version: "3"
  composition_api: true
  script_setup: true
  
  # Features
  router: true
  state_management: true
  ssr: false
```

---

## Coding Standards

### vue-standards.md

```markdown
# Vue 3 Standards (Composition API)

## Component Structure

Use `<script setup>` with Composition API:

```vue
<!-- ✅ Correct - Single File Component with <script setup> -->
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

const emit = defineEmits<{
  increment: [value: number];
}>();

const localCount = ref(props.count);

const doubleCount = computed(() => localCount.value * 2);

function increment() {
  localCount.value++;
  emit('increment', localCount.value);
}
</script>

<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>Count: {{ localCount }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow p-6;
}
</style>
```

## Props and Emits

Type props and emits properly:

```vue
<script setup lang="ts">
// Props with interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  disabled: false
});

// Typed emits
const emit = defineEmits<{
  click: [event: MouseEvent];
  submit: [data: FormData];
}>();

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<template>
  <button
    :class="[`btn-${variant}`, `btn-${size}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
```

## Reactivity

Use correct reactivity patterns:

```vue
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

// ✅ Primitive values - use ref
const count = ref(0);
const name = ref('John');

// ✅ Objects - use reactive
const user = reactive({
  name: 'John',
  age: 30
});

// ✅ Computed values
const displayName = computed(() => user.name.toUpperCase());

// ✅ Access ref values with .value
function increment() {
  count.value++;
}

// ✅ Reactive objects accessed directly
function updateUser() {
  user.age++;
}
</script>
```

## Lifecycle Hooks

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

// On component mount
onMounted(() => {
  console.log('Component mounted');
  // Setup code
});

// On component unmount
onUnmounted(() => {
  console.log('Component unmounted');
  // Cleanup code
});

// Watch for changes
watch(() => props.userId, (newId) => {
  fetchUser(newId);
});
</script>
```

## Template Syntax

```vue
<template>
  <!-- Conditional rendering -->
  <div v-if="isLoggedIn">Welcome back!</div>
  <div v-else>Please log in</div>
  
  <!-- List rendering -->
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
  
  <!-- Event handling -->
  <button @click="handleClick">Click</button>
  <input v-model="text" @input="handleInput">
  
  <!-- Class binding -->
  <div :class="{ active: isActive, 'text-bold': isBold }">
    Content
  </div>
  
  <!-- Style binding -->
  <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
    Text
  </div>
</template>
```

## Component Naming

```
✅ PascalCase for component files
UserProfile.vue
ProductCard.vue
NavigationMenu.vue

✅ Multi-word names (avoid single words)
TheHeader.vue (not Header.vue)
BaseButton.vue (not Button.vue)
AppFooter.vue (not Footer.vue)
```

## File Organization

```
components/
├── user/
│   ├── UserProfile.vue
│   ├── UserProfile.test.ts
│   ├── UserAvatar.vue
│   └── index.ts
├── shared/
│   ├── BaseButton.vue
│   ├── BaseButton.test.ts
│   └── index.ts
└── index.ts
```
```

### composables-standards.md

```markdown
# Composables Standards

## Composable Structure

Composables are reusable Composition API logic:

```typescript
// src/composables/useUser.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useUser(userId: Ref<string>) {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  const isLoaded = computed(() => user.value !== null);
  
  async function fetchUser() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`/api/users/${userId.value}`);
      user.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }
  
  // Auto-fetch when userId changes
  watch(userId, fetchUser, { immediate: true });
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isLoaded,
    refetch: fetchUser
  };
}
```

## Naming Convention

```
✅ Prefix with 'use'
useUser.ts
useAuth.ts
useFetch.ts
useLocalStorage.ts
```

## Usage in Components

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '@/composables/useUser';

const userId = ref('123');
const { user, loading, error, refetch } = useUser(userId);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="user">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="refetch">Refresh</button>
  </div>
</template>
```

## Common Patterns

### State Management

```typescript
// src/composables/useCounter.ts
import { ref } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  function reset() {
    count.value = initial;
  }
  
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  };
}
```

### Local Storage

```typescript
// src/composables/useLocalStorage.ts
import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue);
  
  // Load from localStorage
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      data.value = JSON.parse(stored);
    } catch {
      data.value = defaultValue;
    }
  }
  
  // Watch for changes and save
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });
  
  return data;
}
```
```

### pinia-standards.md

```markdown
# Pinia Standards (State Management)

## Store Structure

```typescript
// src/stores/userStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const users = ref<User[]>([]);
  const loading = ref(false);
  
  // Getters (computed)
  const isAuthenticated = computed(() => currentUser.value !== null);
  const userCount = computed(() => users.value.length);
  
  // Actions
  async function fetchUsers() {
    loading.value = true;
    try {
      const response = await fetch('/api/users');
      users.value = await response.json();
    } finally {
      loading.value = false;
    }
  }
  
  function setCurrentUser(user: User) {
    currentUser.value = user;
  }
  
  function logout() {
    currentUser.value = null;
  }
  
  return {
    // State
    currentUser,
    users,
    loading,
    // Getters
    isAuthenticated,
    userCount,
    // Actions
    fetchUsers,
    setCurrentUser,
    logout
  };
});
```

## Using Stores in Components

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

// Destructure reactive state with storeToRefs
const { currentUser, isAuthenticated } = storeToRefs(userStore);

// Actions can be destructured directly
const { logout } = userStore;
</script>

<template>
  <div v-if="isAuthenticated">
    Welcome, {{ currentUser?.name }}!
    <button @click="logout">Logout</button>
  </div>
</template>
```

## Store Organization

```
stores/
├── userStore.ts       # User state
├── cartStore.ts       # Shopping cart
├── appStore.ts        # Global app state
└── index.ts           # Export all stores
```
```

---

## Usage Examples

### Creating a Component

```bash
/start-task "Create user profile card component"
```

Claude generates:

```vue
<!-- src/components/user/UserProfileCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Props {
  user: User;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
});

const emit = defineEmits<{
  edit: [userId: string];
  delete: [userId: string];
}>();

const initials = computed(() => {
  return props.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div v-if="user.avatar" class="avatar">
          <div class="w-16 rounded-full">
            <img :src="user.avatar" :alt="user.name">
          </div>
        </div>
        <div v-else class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-16">
            <span class="text-xl">{{ initials }}</span>
          </div>
        </div>
        
        <!-- Info -->
        <div class="flex-1">
          <h3 class="card-title">{{ user.name }}</h3>
          <p class="text-sm text-base-content/70">{{ user.email }}</p>
        </div>
        
        <!-- Actions -->
        <div v-if="editable" class="card-actions">
          <button 
            class="btn btn-ghost btn-sm"
            @click="emit('edit', user.id)"
          >
            Edit
          </button>
          <button 
            class="btn btn-ghost btn-sm text-error"
            @click="emit('delete', user.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Creating a View with Store

```vue
<!-- src/views/UsersView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import UserProfileCard from '@/components/user/UserProfileCard.vue';

const userStore = useUserStore();
const { users, loading } = storeToRefs(userStore);

onMounted(() => {
  userStore.fetchUsers();
});

function handleEdit(userId: string) {
  // Navigate to edit page
}

function handleDelete(userId: string) {
  // Show confirmation dialog
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Users</h1>
    
    <div v-if="loading" class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <div v-else class="grid gap-4">
      <UserProfileCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        :editable="true"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
```

---

## Key Patterns

### 1. Composition API
- Use `<script setup>` for cleaner syntax
- Composables for reusable logic
- Type-safe props and emits

### 2. Reactivity
- `ref()` for primitives
- `reactive()` for objects
- `computed()` for derived state
- Proper unwrapping in templates

### 3. State Management
- Pinia for global state
- Composables for shared logic
- Props for component data

### 4. Type Safety
- TypeScript interfaces for all data
- Typed props, emits, and stores
- Generic composables

### 5. Component Structure
- Single File Components (.vue)
- Scoped styles
- Feature-based organization

---

## Common Commands

```bash
# Create component
/start-task "Create product list component"

# Create composable
/start-task "Create useApi composable"

# Create store
/start-task "Create products Pinia store"

# Verify code
/verify
```

---

## Router Configuration

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue')
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('@/views/UserDetailView.vue')
    }
  ]
});

export default router;
```

---

## Next Steps

- See [Getting Started Guide](../../getting-started.md) for setup
- See [Customization Guide](../../customization-guide.md) for modifications
- See [Astro + React Example](../astro-react/) for SSG approach
- See [Next.js Example](../nextjs/) for full-stack framework

---

**This configuration enables Claude to generate clean, modern Vue 3 code following the Composition API!**
