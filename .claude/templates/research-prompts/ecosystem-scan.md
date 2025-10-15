# Ecosystem Scan Research Prompt

> **Template Purpose:** This prompt guides the `/research-stack` command when researching the ecosystem and tooling around a technology stack.

---

## Research Prompt Template

When researching the ecosystem for `[FRAMEWORK/STACK]`, systematically explore these areas:

---

## 1. Core Framework & Versions

### A. Current State

**Search for:**
- "[FRAMEWORK] latest version"
- "[FRAMEWORK] release notes"
- "[FRAMEWORK] roadmap"
- "[FRAMEWORK] changelog"

**Document:**
- Current stable version
- Latest features
- Breaking changes
- Deprecations
- Migration guides
- Future roadmap

**Key Questions:**
- What's the current version?
- When was it released?
- Is it production-ready?
- Are there major versions coming?
- Is the framework actively maintained?

### B. Version Support

**Search for:**
- "[FRAMEWORK] version support"
- "[FRAMEWORK] LTS versions"
- "[FRAMEWORK] migration guide"

**Document:**
- Supported versions
- LTS (Long-term support) status
- End-of-life dates
- Upgrade paths

---

## 2. Meta-Frameworks & Build Tools

### A. Meta-Frameworks

**Search for:**
- "[FRAMEWORK] meta-frameworks"
- "Best [FRAMEWORK] framework"
- "[FRAMEWORK] full-stack framework"

**For React:** Next.js, Remix, Gatsby
**For Vue:** Nuxt
**For Svelte:** SvelteKit
**For solid:** SolidStart

**Document:**
- Available meta-frameworks
- Use cases for each
- Community adoption
- Active development
- Documentation quality

### B. Build Tools

**Search for:**
- "[FRAMEWORK] build tools"
- "Vite vs Webpack for [FRAMEWORK]"
- "[FRAMEWORK] bundler"

**Document:**
- Recommended bundlers (Vite, Webpack, esbuild, Turbopack)
- Configuration complexity
- Build performance
- Development experience
- Plugin ecosystem

---

## 3. State Management Solutions

### A. Built-in State

**Search for:**
- "[FRAMEWORK] state management"
- "[FRAMEWORK] built-in state"

**Document:**
- Built-in options (useState, reactive, stores)
- When built-in is sufficient
- Limitations

### B. External State Libraries

**Search for:**
- "State management libraries for [FRAMEWORK]"
- "[FRAMEWORK] Redux vs Zustand vs Jotai"
- "Best state management for [FRAMEWORK] 2024"

**React:** Redux, Zustand, Jotai, Recoil, MobX, XState
**Vue:** Pinia, Vuex
**Svelte:** Svelte stores
**Others:** Check framework-specific

**Document:**
- Popular libraries
- Use cases (simple vs complex)
- Learning curve
- Bundle size
- TypeScript support
- DevTools availability

### C. Server State

**Search for:**
- "[FRAMEWORK] data fetching"
- "TanStack Query with [FRAMEWORK]"
- "[FRAMEWORK] SWR"

**Document:**
- React Query / TanStack Query
- SWR
- Apollo Client (for GraphQL)
- tRPC
- Framework-specific solutions

---

## 4. Routing Solutions

### A. Client-Side Routing

**Search for:**
- "[FRAMEWORK] routing"
- "[FRAMEWORK] router libraries"

**Document:**
- Official router
- Third-party routers
- Features (nested routes, guards, etc.)
- File-based vs config-based

### B. File-Based Routing

**Search for:**
- "[FRAMEWORK] file-based routing"
- "File-based routing in [META-FRAMEWORK]"

**Document:**
- Meta-frameworks with file-based routing
- Route conventions
- Dynamic routes
- Nested layouts

---

## 5. Styling Solutions

### A. CSS Frameworks

**Search for:**
- "CSS frameworks for [FRAMEWORK]"
- "Tailwind CSS with [FRAMEWORK]"
- "[FRAMEWORK] UI libraries"

**Document:**
- Tailwind CSS integration
- Bootstrap / Material UI
- DaisyUI / Chakra UI / Mantine
- shadcn/ui
- Setup complexity

### B. CSS-in-JS

**Search for:**
- "CSS-in-JS for [FRAMEWORK]"
- "[FRAMEWORK] styled-components"
- "[FRAMEWORK] emotion"

**Document:**
- styled-components
- Emotion
- Styled-JSX
- Vanilla Extract
- Panda CSS
- Performance implications

### C. CSS Modules & Preprocessors

**Search for:**
- "[FRAMEWORK] CSS modules"
- "Sass with [FRAMEWORK]"

**Document:**
- CSS Modules support
- Sass/SCSS integration
- PostCSS plugins
- CSS bundling

---

## 6. Form Handling

**Search for:**
- "[FRAMEWORK] form libraries"
- "Best form handling for [FRAMEWORK]"

**React:** React Hook Form, Formik, React Final Form
**Vue:** VeeValidate, Vuelidate
**Svelte:** Svelte Forms
**Others:** Check framework-specific

**Document:**
- Popular form libraries
- Validation libraries
- Type safety
- Bundle size
- Learning curve

---

## 7. Data Fetching & API Integration

### A. Fetch Libraries

**Search for:**
- "[FRAMEWORK] API calls"
- "Axios vs fetch in [FRAMEWORK]"

**Document:**
- Native fetch
- Axios
- ky
- Framework-specific utilities

### B. GraphQL

**Search for:**
- "[FRAMEWORK] GraphQL"
- "Apollo Client with [FRAMEWORK]"

**Document:**
- Apollo Client
- URQL
- Relay (for React)
- GraphQL Code Generator

### C. Real-time

**Search for:**
- "[FRAMEWORK] WebSockets"
- "[FRAMEWORK] real-time data"

**Document:**
- WebSocket libraries
- Socket.io integration
- Server-Sent Events
- Real-time frameworks

---

## 8. Testing Ecosystem

### A. Unit Testing

**Search for:**
- "[FRAMEWORK] testing libraries"
- "[FRAMEWORK] unit testing"

**Document:**
- Vitest
- Jest
- Framework-specific testing utilities
- Test runners
- Coverage tools

### B. Component Testing

**Search for:**
- "Testing [FRAMEWORK] components"
- "[FRAMEWORK] Testing Library"

**React:** React Testing Library
**Vue:** Vue Testing Library
**Svelte:** Svelte Testing Library

**Document:**
- Testing library
- Testing best practices
- Mocking strategies
- Snapshot testing

### C. E2E Testing

**Search for:**
- "[FRAMEWORK] e2e testing"
- "Playwright vs Cypress for [FRAMEWORK]"

**Document:**
- Playwright
- Cypress
- Puppeteer
- Framework integration
- CI/CD support

---

## 9. Developer Tools & Extensions

### A. Browser DevTools

**Search for:**
- "[FRAMEWORK] devtools"
- "[FRAMEWORK] browser extension"

**Document:**
- Official devtools
- Chrome/Firefox extensions
- Features available
- Debugging capabilities

### B. IDE Extensions

**Search for:**
- "VS Code extensions for [FRAMEWORK]"
- "[FRAMEWORK] IDE support"

**Document:**
- Essential VS Code extensions
- IntelliSense support
- Snippets
- Refactoring tools

### C. Linting & Formatting

**Search for:**
- "[FRAMEWORK] ESLint config"
- "[FRAMEWORK] linting rules"

**Document:**
- ESLint configurations
- Prettier integration
- Framework-specific rules
- Recommended plugins

---

## 10. UI Component Libraries

**Search for:**
- "[FRAMEWORK] component libraries"
- "Best UI library for [FRAMEWORK]"
- "[FRAMEWORK] design systems"

**React:**
- Material-UI (MUI)
- Chakra UI
- Ant Design
- shadcn/ui
- Radix UI
- Mantine

**Vue:**
- Vuetify
- Quasar
- Element Plus
- PrimeVue

**Svelte:**
- Carbon Components Svelte
- Svelte Material UI
- Skeleton

**Document:**
- Popular libraries
- Design system approach
- Customization options
- Bundle size
- TypeScript support
- Accessibility
- Component coverage

---

## 11. Animation Libraries

**Search for:**
- "[FRAMEWORK] animation libraries"
- "GSAP with [FRAMEWORK]"
- "[FRAMEWORK] motion"

**Document:**
- Framer Motion (React)
- GSAP
- Anime.js
- React Spring
- Framework-specific solutions

---

## 12. Internationalization (i18n)

**Search for:**
- "[FRAMEWORK] internationalization"
- "[FRAMEWORK] i18n libraries"

**Document:**
- i18next
- react-intl / vue-i18n
- Framework-specific solutions
- Translation management
- Date/number formatting

---

## 13. Authentication Solutions

**Search for:**
- "[FRAMEWORK] authentication"
- "Auth providers for [FRAMEWORK]"

**Document:**
- NextAuth.js / Auth.js
- Supabase Auth
- Firebase Auth
- Clerk
- Auth0 integration
- JWT handling

---

## 14. Backend/Database Integration

### A. Backend-as-a-Service

**Search for:**
- "[FRAMEWORK] BaaS integration"
- "Firebase with [FRAMEWORK]"

**Document:**
- Firebase
- Supabase
- Appwrite
- PocketBase
- Integration complexity

### B. ORMs & Database Clients

**Search for:**
- "[FRAMEWORK] database libraries"
- "Prisma with [FRAMEWORK]"

**Document:**
- Prisma
- Drizzle ORM
- TypeORM
- Kysely
- Database clients

---

## 15. Deployment Platforms

**Search for:**
- "Where to deploy [FRAMEWORK] apps"
- "Best hosting for [FRAMEWORK]"

**Document:**
- Vercel
- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway
- Render
- Framework-specific hosting

---

## 16. Performance Monitoring

**Search for:**
- "[FRAMEWORK] performance monitoring"
- "APM for [FRAMEWORK]"

**Document:**
- Sentry
- LogRocket
- Datadog
- New Relic
- Web Vitals monitoring

---

## 17. Documentation Tools

**Search for:**
- "[FRAMEWORK] documentation tools"
- "Storybook with [FRAMEWORK]"

**Document:**
- Storybook
- Docusaurus
- VitePress
- Nextra
- Component documentation

---

## 18. Accessibility Tools

**Search for:**
- "[FRAMEWORK] accessibility tools"
- "a11y testing for [FRAMEWORK]"

**Document:**
- axe DevTools
- Pa11y
- Accessibility insights
- ARIA patterns libraries

---

## Output Format

### 1. Ecosystem Overview

```markdown
# [FRAMEWORK] Ecosystem Overview

## Core Framework
- Version: [X.Y.Z]
- Status: [Stable/Beta/Active Development]
- Maintainer: [Company/Community]

## Meta-Frameworks
1. [Framework 1] - [Use case]
2. [Framework 2] - [Use case]

## Build Tools
- Primary: [Vite/Webpack/etc]
- Alternative: [Options]

[Continue for all categories...]
```

### 2. Recommended Stack

```markdown
# Recommended [FRAMEWORK] Stack

## Essential
- Framework: [FRAMEWORK] [version]
- Build Tool: [Tool]
- Language: TypeScript
- Package Manager: [npm/pnpm/yarn]

## State Management
- Local: [Built-in solution]
- Global: [Zustand/Pinia/etc] (if needed)
- Server: TanStack Query

## Styling
- Primary: Tailwind CSS
- Components: [shadcn-ui/DaisyUI/etc]

## Testing
- Unit: Vitest
- Component: [Framework] Testing Library
- E2E: Playwright

[Continue...]
```

### 3. Tool Comparison Matrix

```markdown
| Category | Option 1 | Option 2 | Option 3 | Recommendation |
|----------|----------|----------|----------|----------------|
| State Mgmt | Redux | Zustand | Jotai | Zustand (simpler) |
| Styling | Tailwind | MUI | Chakra | Tailwind (utility-first) |
[...]
```

### 4. Migration Paths

```markdown
# Common Migration Paths

## From [Old Tool] to [New Tool]
- Why: [Reason]
- Difficulty: [Easy/Medium/Hard]
- Guide: [Link]
```

---

## Quality Checks

Before completing ecosystem scan:

- [ ] Current versions documented
- [ ] Popular tools in each category identified
- [ ] Use cases for each tool clarified
- [ ] Bundle sizes compared (where relevant)
- [ ] TypeScript support verified
- [ ] Active maintenance confirmed
- [ ] Community size assessed
- [ ] Documentation quality reviewed
- [ ] Migration guides found
- [ ] Recommended stack assembled

---

## Evaluation Criteria

When comparing tools, consider:

1. **Active Development** - Last commit, release frequency
2. **Community Size** - GitHub stars, npm downloads
3. **Documentation** - Quality and completeness
4. **TypeScript Support** - First-class or addon
5. **Bundle Size** - Impact on application size
6. **Learning Curve** - Complexity for beginners
7. **Ecosystem Integration** - Works well with stack
8. **Performance** - Runtime/build performance
9. **Maintenance** - Bus factor, funding
10. **Migration Path** - Easy to switch if needed

---

## Synthesis Guidelines

When creating ecosystem recommendations:

1. **Start with official recommendations**
2. **Look for community consensus** (what most use)
3. **Consider project size** (overkill for small projects?)
4. **Balance features vs complexity**
5. **Favor maintained libraries** over abandoned
6. **Consider team familiarity**
7. **Provide alternatives** for different use cases

---

**Use this prompt to create comprehensive ecosystem documentation for any stack.**
