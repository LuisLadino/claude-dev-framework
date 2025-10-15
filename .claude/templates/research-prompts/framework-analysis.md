# Framework Analysis Research Prompt

> **Template Purpose:** This prompt guides the `/research-stack` command when analyzing a specific framework to generate appropriate coding standards.

---

## Research Prompt Template

When researching `[FRAMEWORK_NAME]` (version `[VERSION]`), use this structured approach:

---

## 1. Core Framework Analysis

### A. Framework Fundamentals

**Search for:**
- Official documentation homepage
- "Getting started with [FRAMEWORK]"
- "[FRAMEWORK] architecture overview"
- "[FRAMEWORK] core concepts"

**Key Questions to Answer:**
- What type of framework is it? (library, meta-framework, full-stack)
- What problem does it solve?
- What is its core philosophy/approach?
- What are the fundamental concepts?
- What is the mental model developers need?

**Example Output:**
```
Framework: React
Type: UI Library
Philosophy: Declarative, component-based UI
Core Concepts: Components, JSX, Props, State, Hooks, Virtual DOM
Mental Model: UI as a function of state
```

### B. Component Model

**Search for:**
- "[FRAMEWORK] component syntax"
- "[FRAMEWORK] component patterns"
- "How to create components in [FRAMEWORK]"

**Key Questions:**
- How are components defined?
- What's the file extension? (.tsx, .vue, .svelte, .astro)
- What's the component structure/syntax?
- Class-based, functional, or both?
- Single-file components or separate files?

**Example Patterns to Identify:**
- React: Functional components with hooks
- Vue: Single-file components (.vue) with <template>, <script>, <style>
- Svelte: Single-file components (.svelte) with <script>, markup, <style>
- Astro: .astro files with frontmatter and template

### C. State Management

**Search for:**
- "[FRAMEWORK] state management"
- "[FRAMEWORK] built-in state"
- "Best practices for state in [FRAMEWORK]"

**Key Questions:**
- Built-in state management? (useState, reactive, stores)
- External state libraries commonly used?
- Global vs local state patterns?
- When to use what approach?

### D. Reactivity Model

**Search for:**
- "[FRAMEWORK] reactivity system"
- "How [FRAMEWORK] updates the UI"

**Key Questions:**
- How does reactivity work?
- Automatic or manual updates?
- Performance considerations?
- Common pitfalls?

---

## 2. Syntax and Patterns

### A. Component Structure

**Search for:**
- "[FRAMEWORK] component best practices"
- "[FRAMEWORK] component naming conventions"
- "[FRAMEWORK] folder structure"

**Identify:**
- Naming conventions (PascalCase, kebab-case)
- File organization patterns
- Import/export patterns
- Props/attributes patterns

### B. Lifecycle and Side Effects

**Search for:**
- "[FRAMEWORK] lifecycle methods"
- "[FRAMEWORK] side effects"
- "[FRAMEWORK] hooks" (or equivalent)

**Document:**
- Lifecycle methods/hooks available
- When to use each
- Common patterns
- Cleanup patterns

### C. Event Handling

**Search for:**
- "[FRAMEWORK] event handling"
- "How to handle events in [FRAMEWORK]"

**Document:**
- Event syntax
- Event modifiers (if any)
- Custom events
- Event binding patterns

### D. Conditional Rendering & Lists

**Search for:**
- "[FRAMEWORK] conditional rendering"
- "[FRAMEWORK] list rendering"
- "[FRAMEWORK] loops"

**Document:**
- Conditional rendering syntax
- List/loop syntax
- Key requirements
- Common patterns

---

## 3. TypeScript Integration

**Search for:**
- "[FRAMEWORK] TypeScript support"
- "[FRAMEWORK] TypeScript best practices"
- "Type-safe [FRAMEWORK] components"

**Key Questions:**
- First-class TypeScript support?
- How to type components?
- How to type props?
- How to type events?
- Common TypeScript patterns?

**Document:**
- Setup requirements
- Type definition patterns
- Interface vs type usage
- Generic component patterns

---

## 4. Styling Approaches

**Search for:**
- "[FRAMEWORK] styling options"
- "CSS in [FRAMEWORK]"
- "[FRAMEWORK] CSS-in-JS"

**Identify:**
- Scoped styles support
- CSS modules support
- CSS-in-JS options
- Styling recommendations
- Class binding patterns

---

## 5. Routing (if applicable)

**Search for:**
- "[FRAMEWORK] routing"
- "File-based routing in [FRAMEWORK]"
- "[FRAMEWORK] router"

**Document:**
- Built-in router?
- File-based or configured?
- Route parameters
- Nested routes
- Route guards/middleware

---

## 6. Data Fetching

**Search for:**
- "[FRAMEWORK] data fetching"
- "[FRAMEWORK] API calls"
- "Async data in [FRAMEWORK]"

**Document:**
- Recommended patterns
- Built-in utilities
- Loading states
- Error handling
- Caching strategies

---

## 7. Performance Best Practices

**Search for:**
- "[FRAMEWORK] performance optimization"
- "[FRAMEWORK] performance best practices"
- "Common [FRAMEWORK] performance issues"

**Document:**
- Memoization patterns
- Lazy loading
- Code splitting
- Bundle optimization
- Common performance pitfalls

---

## 8. Testing

**Search for:**
- "[FRAMEWORK] testing"
- "How to test [FRAMEWORK] components"
- "[FRAMEWORK] testing library"

**Document:**
- Recommended testing tools
- Component testing patterns
- Integration testing approach
- E2E testing recommendations

---

## 9. Common Patterns & Anti-Patterns

**Search for:**
- "[FRAMEWORK] best practices 2024"
- "[FRAMEWORK] common mistakes"
- "[FRAMEWORK] patterns to avoid"
- "Advanced [FRAMEWORK] patterns"

**Document:**
- Recommended patterns
- Patterns to avoid
- Common gotchas
- Advanced techniques

---

## 10. Ecosystem & Tools

**Search for:**
- "[FRAMEWORK] ecosystem"
- "Popular [FRAMEWORK] libraries"
- "[FRAMEWORK] developer tools"

**Document:**
- Essential libraries
- Dev tools available
- Build tools used
- Linting/formatting setup

---

## Output Format

After research, synthesize findings into:

### 1. Quick Reference Card
```markdown
# [FRAMEWORK] Quick Reference

**Type:** [Library/Framework/Meta-framework]
**Current Version:** [X.Y.Z]
**Component Syntax:** [File extension and structure]
**State Management:** [Built-in approach]
**TypeScript:** [Support level]
**Styling:** [Common approaches]
```

### 2. Component Template
```markdown
# Standard [FRAMEWORK] Component

[Minimal working example]
```

### 3. Best Practices List
```markdown
# [FRAMEWORK] Best Practices

1. [Practice 1]
2. [Practice 2]
...
```

### 4. Anti-Patterns List
```markdown
# [FRAMEWORK] Anti-Patterns to Avoid

1. [Anti-pattern 1]
2. [Anti-pattern 2]
...
```

### 5. Configuration Examples
```markdown
# Recommended [FRAMEWORK] Configuration

[tsconfig.json, vite.config, etc.]
```

---

## Example Research Process

**For React 18:**

1. **Search:** "React 18 official documentation"
2. **Search:** "React functional components best practices"
3. **Search:** "React hooks patterns"
4. **Search:** "React TypeScript components"
5. **Search:** "React performance optimization"
6. **Search:** "React testing library examples"
7. **Search:** "React anti-patterns to avoid"

**Synthesize** findings into actionable coding standards.

---

## Quality Checks

Before completing framework analysis:

- [ ] Found official documentation
- [ ] Identified component structure
- [ ] Documented state management
- [ ] Covered TypeScript integration
- [ ] Listed common patterns
- [ ] Listed anti-patterns
- [ ] Identified testing approach
- [ ] Documented performance tips
- [ ] Found code examples
- [ ] Version-specific information included

---

## Version Considerations

**Important:** Always specify version when researching:
- "React 18" (not just "React")
- "Vue 3 Composition API" (not just "Vue")
- "Svelte 5" (not just "Svelte")

Different versions may have significant syntax/pattern differences!

---

**Use this prompt systematically to ensure comprehensive framework analysis.**
