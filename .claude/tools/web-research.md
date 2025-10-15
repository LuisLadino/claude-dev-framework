# Web Research Guide

How the Claude Dev Framework uses `web_search` to discover current best practices, validate approaches, and generate accurate standards for any technology stack.

---

## When to Use Web Search

### ✅ Always Search For

1. **Unfamiliar stacks** - If you're working with technologies Claude doesn't know well
2. **Recent changes** - API updates, breaking changes, new patterns (post-2024)
3. **Best practices** - Current community standards and recommendations
4. **Library versions** - Latest stable versions and compatibility
5. **Configuration examples** - Real-world setups that work
6. **Breaking news** - Major deprecations or security issues

### ⚠️ Usually Don't Need to Search For

1. **Fundamental concepts** - JavaScript basics, HTTP methods, etc.
2. **Stable patterns** - Component composition, REST principles
3. **Your own standards** - Use `project_knowledge_search` instead
4. **Common libraries** - React, Vue, Express (unless checking very recent updates)

---

## Research Methodology

### Phase 1: Discovery (Broad Search)

**Goal:** Understand the landscape

```
Query: "React TypeScript best practices 2025"
```

**Look for:**
- Official documentation
- Popular blog posts from known authorities
- GitHub repos with high stars
- Recent conference talks
- Community discussions

**Quality indicators:**
- Recent publication date (last 6 months)
- Author credibility (known maintainers, official docs)
- Clear examples with working code
- Engagement (upvotes, stars, comments)

### Phase 2: Validation (Specific Search)

**Goal:** Verify specific approaches

```
Query: "Vite React TypeScript folder structure"
Query: "Next.js 14 app router data fetching"
```

**Look for:**
- Multiple sources confirming the same pattern
- Official documentation alignment
- Active maintenance (not abandoned)
- Real production usage examples

### Phase 3: Deep Dive (Technical Search)

**Goal:** Understand implementation details

```
Query: "shadcn/ui installation Vite"
Query: "Vitest setup with React Testing Library"
```

**Look for:**
- Step-by-step guides
- Common gotchas and solutions
- Version-specific instructions
- Integration examples

---

## Effective Search Queries

### ❌ Poor Queries

```
"best way to code" - Too vague
"react" - Too broad
"how to make website" - Not specific enough
"is vue good" - Opinion-based, not actionable
```

### ✅ Good Queries

```
"Next.js 14 app router file structure best practices"
"Astro React integration 2025"
"shadcn/ui Vite setup guide"
"Vitest React Testing Library configuration"
"Tailwind CSS typography plugin usage"
```

### Query Patterns That Work

**For Setup/Configuration:**
```
"[technology] [version] setup guide"
"[library] installation with [framework]"
"[tool] configuration best practices"
```

**For Patterns:**
```
"[framework] folder structure 2025"
"[framework] component patterns"
"[library] common use cases"
```

**For Integration:**
```
"[library A] with [library B] integration"
"how to use [tool] in [framework]"
"[framework] [library] example"
```

**For Troubleshooting:**
```
"[error message] [framework] fix"
"[library] compatibility with [version]"
"[tool] not working with [framework]"
```

---

## Evaluating Sources

### Trust Levels

**🟢 Highly Trustworthy:**
- Official documentation (docs.astro.build, react.dev, etc.)
- Official blogs (Vercel blog, Remix blog)
- Library maintainers' personal blogs
- GitHub repos by original authors

**🟡 Generally Trustworthy:**
- Major tech publications (Smashing Magazine, CSS-Tricks)
- Well-known developer blogs (Josh Comeau, Kent C. Dodds)
- Popular YouTube channels (Theo, Fireship)
- StackOverflow answers (high votes + recent)

**🟠 Use with Caution:**
- Medium articles (vary widely in quality)
- Random blog posts (verify against other sources)
- Old StackOverflow (check dates!)
- Reddit comments (good for opinions, verify technical details)

**🔴 Generally Avoid:**
- Content farms (GeeksforGeeks for recent frameworks)
- AI-generated tutorials (often outdated or wrong)
- Extremely old content (pre-2020 for modern frameworks)
- Single-source claims without verification

### Red Flags

- 🚩 No code examples
- 🚩 Last updated 3+ years ago (for modern frameworks)
- 🚩 Doesn't mention versions
- 🚩 Contradicts official docs
- 🚩 "This one weird trick..."
- 🚩 No attribution or sources
- 🚩 Broken code examples in comments

### Green Flags

- ✅ Recently updated
- ✅ Working demo links
- ✅ Version numbers specified
- ✅ Multiple confirmations
- ✅ Official stamp of approval
- ✅ Active maintenance
- ✅ Clear explanations with rationale

---

## Research Workflows

### Workflow 1: New Stack Research

**Scenario:** User says "I'm using SvelteKit with Drizzle ORM"

```
Step 1: Broad understanding
→ Search: "SvelteKit 2025 overview"
→ Read: Official docs, recent tutorials
→ Note: Current version, key features

Step 2: Setup patterns
→ Search: "SvelteKit project structure best practices"
→ Search: "SvelteKit folder organization"
→ Identify: Common patterns across multiple sources

Step 3: Integration specifics
→ Search: "Drizzle ORM SvelteKit integration"
→ Search: "SvelteKit database setup patterns"
→ Find: Working examples, official guides

Step 4: Tooling ecosystem
→ Search: "SvelteKit TypeScript configuration"
→ Search: "SvelteKit testing setup Vitest"
→ Compile: Full toolchain recommendations

Step 5: Validation
→ Cross-reference with official docs
→ Check GitHub repos (high stars)
→ Verify patterns are current
```

### Workflow 2: Specific Feature Research

**Scenario:** User asks "How should I handle forms?"

```
Step 1: Stack-specific approach
→ Search: "[their framework] form handling best practices"
→ Example: "SvelteKit form actions"

Step 2: Library recommendations
→ Search: "best form library for [framework] 2025"
→ Compare: Multiple recommendations

Step 3: Implementation details
→ Search: "[recommended library] [framework] setup"
→ Find: Complete examples

Step 4: Related concerns
→ Search: "[framework] form validation"
→ Search: "[framework] form error handling"
```

### Workflow 3: Standards Generation

**Scenario:** Creating coding standards for a stack

```
Step 1: Official guidelines
→ Search: "[framework] style guide official"
→ Search: "[framework] best practices documentation"

Step 2: Community consensus
→ Search: "[framework] coding conventions"
→ Search: "popular [framework] projects folder structure"
→ Review: Top GitHub repositories

Step 3: Linting/Formatting
→ Search: "[framework] ESLint configuration"
→ Search: "[framework] Prettier setup"

Step 4: Testing standards
→ Search: "[framework] testing best practices"
→ Search: "[framework] test file organization"

Step 5: Synthesis
→ Combine official + community patterns
→ Resolve conflicts (prefer official docs)
→ Create clear, actionable standards
```

---

## Real Examples

### Example 1: Researching Astro + React

**Query Sequence:**
```
1. "Astro 4.0 features" (understand current version)
2. "Astro React integration guide" (setup basics)
3. "Astro islands architecture" (core concept)
4. "Astro component file structure" (patterns)
5. "Astro content collections" (data handling)
```

**Sources Found:**
- docs.astro.build (official - high trust)
- Astro Discord discussions (community - verify)
- CSS-Tricks Astro guide (established blog - good)
- Random Medium post (verify against official docs)

**Result:**
→ Identified Astro's hybrid architecture
→ Understood island architecture pattern
→ Found official React integration method
→ Located best practices for content

### Example 2: Researching Testing Setup

**Query Sequence:**
```
1. "Vitest React Testing Library setup 2025"
2. "Vitest configuration for Vite React"
3. "React Testing Library best practices"
4. "Vitest coverage setup"
```

**Sources Found:**
- vitest.dev official docs (definitive)
- testing-library.com (official - high trust)
- Kent C. Dodds blog (author - high trust)
- GitHub examples from popular projects

**Result:**
→ Correct Vitest config for React
→ Best practices for writing tests
→ Common testing patterns
→ Coverage configuration

---

## Common Pitfalls

### 1. Outdated Information

**Problem:** Following tutorials from 2020 for frameworks that changed significantly

**Solution:**
- Always check publication date
- Prefer content from last 6-12 months
- Verify against current official docs
- Search with year: "React best practices 2025"

### 2. Framework Confusion

**Problem:** Applying Next.js patterns to Remix

**Solution:**
- Be explicit in searches: "[specific framework] pattern"
- Understand framework paradigms first
- Don't assume patterns transfer
- Check official migration guides

### 3. Over-Relying on Single Sources

**Problem:** One blog post becomes your entire standard

**Solution:**
- Cross-reference 3-5 sources minimum
- Prioritize official documentation
- Check community consensus
- Verify in production examples

### 4. Ignoring Context

**Problem:** Copying enterprise patterns for small projects

**Solution:**
- Consider project scale
- Read "why" not just "how"
- Adapt patterns to fit
- Start simple, add complexity when needed

---

## Quality Checklist

After research, ask yourself:

- [ ] Did I check official documentation?
- [ ] Did I find 3+ sources confirming this approach?
- [ ] Is the information recent (last 6-12 months)?
- [ ] Do the examples include versions?
- [ ] Does this match the user's stack and scale?
- [ ] Can I explain *why* this is best practice?
- [ ] Did I check for known issues or gotchas?
- [ ] Is this approach actively maintained?

---

## Framework Integration

### How /research-stack Uses This

When you run `/research-stack`, the framework:

1. **Searches official docs** for authoritative patterns
2. **Finds popular GitHub repos** to see real-world usage
3. **Checks recent articles** for current best practices
4. **Validates against multiple sources** to ensure accuracy
5. **Synthesizes findings** into clear standards
6. **Generates standards files** for your stack

### How Other Commands Use Research

- `/start-task` - Verifies approaches are current
- `/verify` - Checks against latest best practices
- `/learn` - Finds authoritative learning resources
- `/import-standards` - Validates imported standards against official docs

---

## Tips for Better Research

1. **Be specific:** "Vite React TypeScript" not just "React"
2. **Include versions:** Frameworks change, versions matter
3. **Check dates:** Prefer recent content
4. **Read critically:** Not every blog post is correct
5. **Trust official docs:** They're usually right
6. **Look for patterns:** Multiple sources = likely correct
7. **Understand, don't copy:** Know why, not just what
8. **Verify in production:** Check real repos, not just tutorials

---

## Resources

### Official Documentation Sites

- [React](https://react.dev)
- [Vue](https://vuejs.org)
- [Svelte](https://svelte.dev)
- [Next.js](https://nextjs.org)
- [Astro](https://docs.astro.build)
- [Vite](https://vitejs.dev)

### Trusted Learning Platforms

- [MDN Web Docs](https://developer.mozilla.org)
- [web.dev](https://web.dev)
- [Patterns.dev](https://patterns.dev)

### Community Sources

- Official Discord/Slack channels
- GitHub Discussions
- StackOverflow (recent, high-voted)

---

**Remember:** Research is about understanding, not just finding answers. Take time to read deeply, verify broadly, and apply thoughtfully.