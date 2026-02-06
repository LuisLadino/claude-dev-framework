# Testing

Project-specific testing configuration.

---

## Framework

Test runner: _Vitest/Jest/Playwright/Cypress_

---

## Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

Or colocated: `src/components/Button.test.tsx`

---

## Commands

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:e2e      # E2E tests
npm run coverage      # Coverage report
```

---

## Coverage

Target: _e.g., 80%_

Focus on:
- Business logic
- API handlers
- Critical user flows

Skip:
- Config files
- Type definitions
- Generated code

---

## What to Test

| Type | What | Tools |
|------|------|-------|
| Unit | Functions, utils, hooks | Vitest/Jest |
| Integration | Components with deps | Testing Library |
| E2E | User flows | Playwright/Cypress |

---

## Patterns

```typescript
describe('Component', () => {
  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

---

## Notes

_Add project-specific testing conventions here_
