# Stack Research Workflow

Complete workflow for researching and generating standards for any technology stack.

---

## Overview

This workflow shows how to use the framework's tools to research a stack you're unfamiliar with and generate comprehensive, accurate standards.

**Time:** 15-30 minutes  
**Tools Used:** web_search, web_fetch, github (optional), filesystem (optional)  
**Output:** Complete standards files for your stack

---

## When to Use This Workflow

- 🆕 Starting a new project with unfamiliar technologies
- 🔄 Joining a team using a different stack
- 📚 Learning a new framework
- 🔍 Updating standards for new versions
- 🏢 Adopting a new technology at work

---

## Prerequisites

**Before starting:**
- [ ] You know your stack components (e.g., "Next.js + Prisma + tRPC")
- [ ] You have Claude Desktop with web_search enabled
- [ ] You have 20-30 minutes to focus
- [ ] Optional: GitHub MCP server configured

---

## The Research Process

### Phase 1: Stack Discovery (5 minutes)

**Goal:** Understand what you're working with

#### Step 1: List Your Stack Components

Write down each technology:
```
Framework: Next.js 14
Database ORM: Prisma
API: tRPC
Styling: Tailwind CSS
Testing: Vitest
Language: TypeScript
```

#### Step 2: Identify Knowledge Gaps

For each component, ask yourself:
- Am I familiar with this? (Yes/No/Somewhat)
- What version am I using?
- Are there recent major changes?

**Example:**
```
✅ Next.js - Know version 13, need to learn App Router (v14)
❌ tRPC - Never used, need full research
✅ Tailwind - Know basics, check for v4 updates
❌ Vitest - Used Jest, need to understand differences
```

#### Step 3: Prioritize Research

Focus on:
1. Technologies you don't know
2. Technologies with recent major versions
3. Technologies that integrate with each other

---

### Phase 2: Foundation Research (10 minutes)

**Goal:** Understand official patterns and core concepts

#### Step 1: Official Documentation

**For each technology, search:**

```
Query: "[Technology] [Version] official documentation"
Query: "[Technology] getting started guide"
```

**Example:**
```
"Next.js 14 app router documentation"
"tRPC getting started guide"
"Prisma TypeScript setup"
```

**What to look for:**
- Current version number
- Key concepts and terminology
- Official folder structure
- Recommended setup
- Core features and patterns

**Read carefully:**
- Getting Started guides
- Core Concepts pages
- Best Practices sections
- Migration guides (if updating)

#### Step 2: Fetch and Read Key Pages

After finding official docs, use `web_fetch` to read them completely:

```
Fetch: https://nextjs.org/docs/app
Fetch: https://trpc.io/docs/quickstart
Fetch: https://www.prisma.io/docs/getting-started
```

**Take notes on:**
- Folder structure conventions
- File naming patterns
- Import/export styles
- Configuration requirements
- Common gotchas

#### Step 3: Understand Integration Points

**Search for how technologies work together:**

```
Query: "[Tech A] with [Tech B] integration"
Query: "how to use [Tech A] in [Tech B]"
```

**Example:**
```
"Prisma with tRPC setup"
"Next.js 14 tRPC integration"
"Tailwind CSS with Next.js app router"
```

---

### Phase 3: Community Patterns (10 minutes)

**Goal:** Find real-world usage and best practices

#### Step 1: Search Best Practices

```
Query: "[Technology] best practices 2025"
Query: "[Technology] project structure"
Query: "[Technology] common patterns"
```

**Look for:**
- Multiple sources saying the same thing
- Recent content (last 6 months)
- Explanations of *why* not just *what*

#### Step 2: Find Production Examples (Optional)

**If you have GitHub MCP enabled:**

```
Search GitHub for:
- Popular repositories using your stack
- Projects with 1000+ stars
- Recently updated (active maintenance)
```

**Look at:**
- Folder structure
- Configuration files
- Component patterns
- Testing approaches
- Documentation style

**Example queries:**
```
"Next.js tRPC Prisma" (find example apps)
Filter: > 500 stars, updated in last 6 months
```

#### Step 3: Validate Patterns

**Cross-reference findings:**

1. Does this match official docs? ✅
2. Do multiple sources recommend this? ✅
3. Is this still current? (Check dates) ✅
4. Does this fit the project scale? ✅

**Red flags:**
- ❌ Contradicts official docs
- ❌ Only one source mentions it
- ❌ Last updated 2+ years ago
- ❌ Enterprise patterns for small projects

---

### Phase 4: Standards Generation (10 minutes)

**Goal:** Create clear, actionable standards

#### Step 1: Create Folder Structure Standard

Based on your research, document:

```markdown
## Folder Structure

project/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   └── trpc/         # tRPC router
│   └── (routes)/         # Page routes
├── src/
│   ├── components/       # React components
│   ├── server/          # Server-side code
│   │   └── trpc/       # tRPC routers
│   └── utils/          # Shared utilities
├── prisma/
│   └── schema.prisma   # Database schema
└── tests/              # Test files
```

**Why this structure:**
- Next.js 14 prefers app/ directory for App Router
- tRPC server code separate from client
- Prisma schema in dedicated directory
- Clear separation of concerns

#### Step 2: Create Coding Standards

Document patterns found:

```markdown
## React Components

- Use "use client" directive for interactive components
- Server components by default
- Async components for data fetching
- Co-locate styles with components

## TypeScript

- Strict mode enabled
- Prisma types for database models
- tRPC types for API contracts
- No `any` types

## File Naming

- Components: PascalCase (Button.tsx)
- Utilities: camelCase (formatDate.ts)
- Routes: kebab-case (/user-profile)
```

#### Step 3: Create Configuration Guide

Document setup requirements:

```markdown
## Required Configuration

### next.config.js
- TypeScript support
- Tailwind CSS
- tRPC integration

### tsconfig.json
- Strict mode
- Path aliases (@/)
- App directory types

### .env.example
- DATABASE_URL
- NEXTAUTH_SECRET (if using)
```

#### Step 4: Create Testing Standards

Document testing approach:

```markdown
## Testing

### Tools
- Vitest for unit/integration
- Playwright for e2e (if needed)

### Patterns
- Test files next to source (Button.test.tsx)
- Test tRPC routes with mock Prisma
- Test React components with Testing Library

### Coverage
- Aim for 80% coverage
- All API routes tested
- Critical user flows tested
```

---

## Phase 5: Validation (5 minutes)

**Goal:** Verify standards are accurate and complete

### Quality Checklist

- [ ] All official docs checked
- [ ] Patterns verified by 3+ sources
- [ ] Recent information (last 6 months)
- [ ] Integration points understood
- [ ] Folder structure makes sense
- [ ] Coding standards are clear
- [ ] Configuration is complete
- [ ] Testing approach is defined
- [ ] Examples are included
- [ ] "Why" is explained, not just "what"

### Common Issues

**If something doesn't make sense:**
1. Re-search with more specific query
2. Check official docs again
3. Look for updated information
4. Ask in community channels

**If patterns conflict:**
1. Prefer official documentation
2. Choose more recent information
3. Consider project scale
4. Document the tradeoff

---

## Real Example: SvelteKit + Supabase

Let me walk through a complete example.

### Phase 1: Discovery

**Stack:**
- Framework: SvelteKit 2.0
- Database: Supabase (Postgres + Auth)
- Styling: Tailwind CSS
- Language: TypeScript

**Knowledge gaps:**
- ❌ Never used SvelteKit
- ❌ Never used Supabase
- ✅ Know Tailwind and TypeScript

### Phase 2: Foundation Research

**Searches:**
```
1. "SvelteKit 2.0 documentation"
   → Found: Official docs with file-based routing
   
2. "Supabase documentation TypeScript"
   → Found: Official client library and setup
   
3. "SvelteKit Supabase integration"
   → Found: Official Supabase guide for SvelteKit
```

**Key findings:**
- SvelteKit uses `+page.svelte` and `+page.server.ts` pattern
- Supabase client initialized in `src/hooks.server.ts`
- Server-side auth with `locals` object
- Form actions for mutations

### Phase 3: Community Patterns

**Searches:**
```
4. "SvelteKit project structure best practices"
   → Found: Common patterns from community
   
5. "SvelteKit Supabase authentication"
   → Found: Multiple implementations
```

**GitHub research:**
```
Found: "awesome-sveltekit" with example apps
Reviewed: 3 popular SvelteKit + Supabase repos
Identified: Common patterns across all three
```

**Validated:**
- ✅ `src/routes/` for file-based routing
- ✅ `src/lib/` for shared code
- ✅ Server hooks for auth
- ✅ Form actions over API routes

### Phase 4: Standards Generation

**Created files:**

**1. folder-structure.md**
```markdown
project/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +layout.server.ts
│   │   └── (authed)/         # Protected routes
│   ├── lib/
│   │   ├── components/       # Shared components
│   │   ├── server/          # Server-only code
│   │   └── supabase.ts      # Supabase client
│   └── hooks.server.ts       # Auth hooks
```

**2. coding-standards.md**
```markdown
## Components
- Use .svelte extension
- Script tags with TypeScript
- Reactive statements with $:

## Data Loading
- +page.server.ts for server data
- Load function returns { data }
- Form actions for mutations

## Authentication
- Check locals.user in load functions
- Redirect to /login if unauthorized
- Use form actions for sign in/out
```

**3. supabase-setup.md**
```markdown
## Setup
1. Install @supabase/supabase-js
2. Create src/lib/supabase.ts
3. Initialize in hooks.server.ts
4. Add env variables

## Patterns
- Server client in +page.server.ts
- Row Level Security enabled
- TypeScript types generated from schema
```

### Phase 5: Validation

**Checked:**
- ✅ Matches official SvelteKit docs
- ✅ Matches official Supabase integration guide
- ✅ Verified by 3 production examples
- ✅ All patterns are current (2024+)
- ✅ Tested in a small project

**Result:** Complete, accurate standards ready to use!

---

## Tips for Success

### DO

✅ **Start with official docs** - They're the source of truth
✅ **Cross-reference multiple sources** - Verify patterns
✅ **Check dates** - Use recent information
✅ **Understand integrations** - How pieces fit together
✅ **Document "why"** - Explain reasoning
✅ **Keep it simple** - Start basic, add complexity later
✅ **Test patterns** - Try them in a small project

### DON'T

❌ **Rely on single sources** - One blog isn't enough
❌ **Copy without understanding** - Know why it works
❌ **Use outdated info** - Check publication dates
❌ **Over-engineer** - Match patterns to project size
❌ **Skip official docs** - They're usually best
❌ **Ignore versions** - Frameworks change significantly
❌ **Rush** - Take time to research properly

---

## Common Mistakes

### Mistake 1: Skipping Official Documentation

**Problem:** Using only blog posts and tutorials

**Why it's bad:**
- Blogs may be outdated
- May not reflect best practices
- Could miss important features

**Solution:** Always start with and verify against official docs

### Mistake 2: Not Checking Dates

**Problem:** Following 2020 tutorial for 2025 framework

**Why it's bad:**
- Frameworks evolve significantly
- Old patterns may be deprecated
- New features are better

**Solution:** Prefer content from last 6-12 months

### Mistake 3: Not Understanding Integration

**Problem:** Using Tech A and Tech B but not how they work together

**Why it's bad:**
- Inefficient patterns
- Duplicate code
- Conflicts and bugs

**Solution:** Explicitly research "[Tech A] with [Tech B]"

### Mistake 4: Over-Engineering

**Problem:** Copying enterprise patterns to small projects

**Why it's bad:**
- Unnecessary complexity
- Slower development
- Harder to maintain

**Solution:** Match patterns to project scale

---

## After Research

### Save Your Standards

Create these files in `.claude/your-stack/`:
- `folder-structure.md`
- `coding-standards.md`
- `setup-guide.md`
- `testing-standards.md`

### Update stack-config.yaml

```yaml
stack:
  framework: "SvelteKit"
  version: "2.0"
  database: "Supabase"
  styling: "Tailwind CSS"
  
standards_active:
  - folder-structure
  - coding-standards
  - testing-standards

research_date: "2025-01-15"
```

### Test Your Standards

Try them in a small project:
1. Create new project
2. Follow your standards
3. Note what works and what doesn't
4. Refine standards based on experience

---

## Iterating Standards

Standards should evolve:

**After 1 week:**
- Fix obvious issues
- Add missing patterns
- Clarify confusing parts

**After 1 month:**
- Add patterns you discovered
- Remove patterns you don't use
- Update for new versions

**After 3 months:**
- Major review
- Research new best practices
- Update deprecated patterns

---

## Resources

### Related Guides
- [Web Research Guide](../tools/web-research.md) - Research methodology
- [Tool Catalog](../tools/tool-catalog.md) - Available tools
- [MCP Integration](../tools/mcp-integration.md) - Using MCP servers

### Research Checklist

Save this for quick reference:
```
Phase 1: Discovery (5 min)
□ List stack components
□ Identify knowledge gaps
□ Prioritize research

Phase 2: Foundation (10 min)
□ Read official documentation
□ Understand core concepts
□ Document integration points

Phase 3: Community (10 min)
□ Find best practices
□ Review production examples
□ Validate patterns

Phase 4: Standards (10 min)
□ Document folder structure
□ Write coding standards
□ Create setup guide
□ Define testing approach

Phase 5: Validation (5 min)
□ Quality checklist
□ Cross-reference sources
□ Test in small project
```

---

## Next Steps

After completing research:

1. **Use the standards** - Start building with them
2. **Run /start-task** - Framework will use your standards
3. **Iterate** - Refine as you learn
4. **Share** - Help teammates adopt same patterns
5. **Update** - Keep standards current

---

**Remember:** Good research takes time. Don't rush it. The 30 minutes you spend now will save hours later when you're building with clear, accurate standards.