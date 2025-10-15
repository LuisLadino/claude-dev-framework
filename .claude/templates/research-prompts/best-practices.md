# Best Practices Research Prompt

> **Template Purpose:** This prompt guides the `/research-stack` command when researching industry best practices for a technology stack.

---

## Research Prompt Template

When researching best practices for `[TECHNOLOGY/FRAMEWORK]`, use this comprehensive approach:

---

## 1. Code Quality & Style

### A. Naming Conventions

**Search for:**
- "[TECH] naming conventions"
- "[TECH] code style guide"
- "Variable naming in [TECH]"

**Document:**
- Component naming (PascalCase, kebab-case, etc.)
- Function naming (camelCase, snake_case, etc.)
- File naming conventions
- Constant naming (UPPER_CASE, etc.)
- Private vs public conventions

**Example Questions:**
- How should components be named?
- How should utility functions be named?
- How should files be organized?
- How should constants be defined?

### B. Code Organization

**Search for:**
- "[TECH] project structure"
- "[TECH] folder organization"
- "[TECH] architecture patterns"
- "Scalable [TECH] architecture"

**Document:**
- Recommended folder structure
- File organization patterns
- Feature-based vs type-based organization
- Separation of concerns

### C. Code Formatting

**Search for:**
- "[TECH] prettier configuration"
- "[TECH] formatting standards"
- "[TECH] linting rules"

**Document:**
- Recommended formatters
- Standard configurations
- Linting rules
- Pre-commit hooks

---

## 2. Component Design

### A. Component Architecture

**Search for:**
- "[TECH] component patterns"
- "Reusable [TECH] components"
- "[TECH] component composition"
- "Smart vs dumb components [TECH]"

**Document:**
- Component types (presentational, container)
- Composition patterns
- Prop drilling solutions
- Component sizing guidelines

### B. Component Communication

**Search for:**
- "[TECH] component communication"
- "[TECH] props best practices"
- "[TECH] events patterns"

**Document:**
- Props patterns
- Event handling
- Callback patterns
- Context/provide-inject usage

### C. Component Reusability

**Search for:**
- "Building reusable [TECH] components"
- "[TECH] component library best practices"

**Document:**
- Reusability patterns
- Prop APIs design
- Flexibility vs simplicity
- Documentation requirements

---

## 3. State Management

### A. Local State

**Search for:**
- "[TECH] local state management"
- "When to use local state in [TECH]"

**Document:**
- When to use local state
- State initialization patterns
- State update patterns
- Derived state patterns

### B. Global State

**Search for:**
- "[TECH] global state management"
- "Best state management for [TECH]"
- "[TECH] state management comparison"

**Document:**
- When to use global state
- Recommended libraries
- State organization patterns
- Avoiding prop drilling

### C. Server State

**Search for:**
- "[TECH] data fetching"
- "[TECH] server state management"
- "React Query" or "[TECH] equivalent"

**Document:**
- Fetching patterns
- Caching strategies
- Optimistic updates
- Error handling

---

## 4. Performance Optimization

### A. Rendering Optimization

**Search for:**
- "[TECH] performance optimization"
- "[TECH] rendering performance"
- "Avoid re-renders in [TECH]"

**Document:**
- Memoization patterns
- Virtual scrolling
- Lazy loading
- Code splitting

### B. Bundle Size

**Search for:**
- "[TECH] bundle optimization"
- "Reduce [TECH] bundle size"
- "Tree shaking in [TECH]"

**Document:**
- Import strategies
- Dead code elimination
- Dynamic imports
- Bundle analysis tools

### C. Loading Performance

**Search for:**
- "[TECH] loading performance"
- "[TECH] Core Web Vitals"
- "Lazy loading in [TECH]"

**Document:**
- Critical path optimization
- Resource loading strategies
- Lazy loading patterns
- Prefetching/preloading

---

## 5. TypeScript Best Practices

### A. Type Safety

**Search for:**
- "[TECH] TypeScript best practices"
- "Type-safe [TECH]"
- "[TECH] TypeScript patterns"

**Document:**
- Strict mode recommendations
- Type vs interface usage
- Generic patterns
- Type guard patterns

### B. Type Organization

**Search for:**
- "[TECH] TypeScript project structure"
- "Organizing types in [TECH]"

**Document:**
- Where to define types
- Shared types organization
- Type imports/exports
- Declaration files

---

## 6. Testing Strategies

### A. Unit Testing

**Search for:**
- "[TECH] unit testing best practices"
- "Testing [TECH] components"
- "[TECH] test coverage"

**Document:**
- Testing philosophy
- What to test
- Testing patterns
- Mocking strategies

### B. Integration Testing

**Search for:**
- "[TECH] integration testing"
- "Testing [TECH] features"

**Document:**
- Integration test approach
- User flow testing
- API mocking
- Test data management

### C. E2E Testing

**Search for:**
- "[TECH] e2e testing"
- "Playwright with [TECH]"
- "Cypress with [TECH]"

**Document:**
- E2E framework recommendations
- Critical path testing
- Test stability patterns
- CI/CD integration

---

## 7. Accessibility (a11y)

### A. Core Accessibility

**Search for:**
- "[TECH] accessibility best practices"
- "WCAG compliance in [TECH]"
- "[TECH] a11y patterns"

**Document:**
- Semantic HTML usage
- ARIA patterns
- Keyboard navigation
- Screen reader support

### B. Testing Accessibility

**Search for:**
- "[TECH] accessibility testing"
- "Automated a11y testing [TECH]"

**Document:**
- Testing tools (axe, Lighthouse)
- Manual testing checklist
- CI/CD a11y checks
- Common pitfalls

---

## 8. Error Handling

### A. Runtime Errors

**Search for:**
- "[TECH] error handling patterns"
- "[TECH] error boundaries"
- "Graceful error handling [TECH]"

**Document:**
- Error boundary patterns
- Try-catch patterns
- Error recovery strategies
- User-friendly error messages

### B. Async Errors

**Search for:**
- "[TECH] async error handling"
- "Promise error handling [TECH]"

**Document:**
- Async/await error patterns
- Error propagation
- Retry strategies
- Fallback mechanisms

---

## 9. Security Best Practices

### A. Common Vulnerabilities

**Search for:**
- "[TECH] security best practices"
- "XSS prevention in [TECH]"
- "[TECH] security vulnerabilities"

**Document:**
- XSS prevention
- CSRF protection
- Input sanitization
- Dependency vulnerabilities

### B. Authentication & Authorization

**Search for:**
- "[TECH] authentication patterns"
- "Secure [TECH] applications"

**Document:**
- Auth implementation patterns
- Token storage
- Protected routes
- Session management

---

## 10. Documentation Standards

### A. Code Documentation

**Search for:**
- "[TECH] documentation best practices"
- "JSDoc with [TECH]"
- "Self-documenting [TECH] code"

**Document:**
- Inline comment guidelines
- JSDoc patterns
- When to document
- What to document

### B. Component Documentation

**Search for:**
- "[TECH] component documentation"
- "Storybook with [TECH]"

**Document:**
- Component prop documentation
- Usage examples
- Documentation tools
- README patterns

---

## 11. Development Workflow

### A. Version Control

**Search for:**
- "[TECH] Git workflow"
- "Branch strategy for [TECH] projects"

**Document:**
- Branching strategy
- Commit message conventions
- PR requirements
- Code review guidelines

### B. CI/CD

**Search for:**
- "[TECH] CI/CD best practices"
- "Deploying [TECH] applications"

**Document:**
- Build pipeline
- Testing in CI
- Deployment strategies
- Environment management

---

## 12. Ecosystem Best Practices

### A. Package Management

**Search for:**
- "[TECH] package management"
- "npm vs pnpm vs yarn for [TECH]"

**Document:**
- Recommended package manager
- Dependency management
- Version pinning strategies
- Security auditing

### B. Tooling

**Search for:**
- "[TECH] developer tools"
- "Essential [TECH] extensions"

**Document:**
- Required VS Code extensions
- Browser dev tools
- Build tools
- Debugging tools

---

## Output Format

After research, create structured best practices document:

### 1. Quick Wins (Top 10)
```markdown
# Top 10 Best Practices for [TECH]

1. [Most impactful practice]
2. [Second most impactful]
...
```

### 2. Dos and Don'ts
```markdown
# Dos
✅ Do [practice 1]
✅ Do [practice 2]

# Don'ts
❌ Don't [anti-pattern 1]
❌ Don't [anti-pattern 2]
```

### 3. Code Examples
```markdown
# [Practice Name]

❌ Wrong:
[Bad example]

✅ Correct:
[Good example]
```

### 4. Checklist Format
```markdown
# Pre-Commit Checklist
- [ ] No console.log statements
- [ ] All tests pass
- [ ] TypeScript strict mode passes
...
```

---

## Quality Filters

When evaluating sources, prioritize:

1. **Official documentation** (highest authority)
2. **Maintainer blog posts** (core team insights)
3. **Well-known community resources** (css-tricks, Kent C. Dodds, etc.)
4. **Recent articles** (< 1 year old)
5. **High GitHub stars/engagement** (community validation)

**Avoid:**
- Outdated tutorials (> 2 years old)
- Personal blogs without authority
- Articles with obvious errors
- Content not version-specific

---

## Synthesis Guidelines

When creating standards from research:

1. **Prioritize official recommendations** first
2. **Look for consensus** across multiple sources
3. **Favor simplicity** over complexity
4. **Include reasoning** ("Why" not just "What")
5. **Provide examples** for every practice
6. **List anti-patterns** explicitly
7. **Consider team skill level** (beginners vs advanced)

---

## Example Research Query Sequence

**For React Performance Best Practices:**

1. "React 18 performance optimization official docs"
2. "React memo vs useMemo vs useCallback"
3. "React rendering optimization patterns"
4. "React bundle size optimization"
5. "React lazy loading best practices"
6. "Common React performance mistakes"
7. "Profiling React applications"

**Synthesize** into actionable guidelines with examples.

---

## Quality Checklist

Before finalizing best practices:

- [ ] Practices are version-specific
- [ ] Sources are authoritative
- [ ] Every practice has rationale
- [ ] Code examples provided
- [ ] Anti-patterns documented
- [ ] Checklist format included
- [ ] Realistic for team skill level
- [ ] Prioritized (most important first)
- [ ] Actionable (not vague)
- [ ] Measurable (where possible)

---

**Use this prompt to create comprehensive, actionable best practices documentation.**
