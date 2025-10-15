# /research-stack

**Research a technology stack and generate comprehensive standards**

---

## Purpose

This command uses AI tools to research unfamiliar technology stacks and automatically generate accurate, current coding standards based on official documentation and community best practices.

**Use when:**
- Starting a project with a new stack
- Joining a team using unfamiliar technologies
- Updating standards for new framework versions
- Need quick onboarding to a technology

**Time:** 15-30 minutes for complete research

---

## Prerequisites

### Recommended Setup (Best Results)

**For optimal research quality, you need:**

✅ **context7 MCP server** - Fetches official documentation directly
- Install: See [MCP Integration Guide](../tools/mcp-integration.md)
- Setup: `~/.config/claude/claude_desktop_config.json` (Mac)
- Why: Gets full, accurate docs instead of summaries

⚠️ **Without context7:** Research falls back to web search (limited accuracy)

### Optional (Enhances Results)

- `github` MCP - Find real-world examples in popular repos
- `filesystem` MCP - Analyze your existing codebase patterns

---

## How It Works

This command follows the [Stack Research Workflow](../workflows/stack-research.md) and uses:

**With context7 (Recommended):**
- `context7` - Fetch official documentation pages directly
- `web_search` - Find best practices and current trends
- `web_fetch` - Read complete documentation
- `github` (optional) - Find real-world examples
- `filesystem` (optional) - Check existing code

**Without context7 (Fallback):**
- `web_search` - Find official docs and best practices (limited)
- ⚠️ Results may be less accurate without direct doc access

---

## Usage

### Basic Usage

```
/research-stack
```

Claude will ask you questions and guide you through the process.

### Quick Start

```
/research-stack Next.js 14 with Prisma and tRPC
```

Provide your stack upfront to skip the initial questions.

---

## Interactive Flow

### Step 0: Prerequisites Check (FIRST)

**Before starting, Claude MUST check for context7:**

```
🔍 CHECKING RESEARCH CAPABILITIES

Checking for MCP tools...

✅ web_search available (basic research)
✅ web_fetch available (documentation reading)
❌ context7 NOT available

⚠️  WARNING: Limited Research Quality

Without context7, I can only use web search for research.
This means:
- Generic summaries instead of full official docs
- Potentially outdated information
- Less accurate framework-specific details

RECOMMENDED: Install context7 MCP server for best results
See: .claude/tools/mcp-integration.md

Options:
1. Continue anyway (web search only)
2. Cancel and set up context7 first
3. Skip and use /import-standards instead

What would you like to do?
```

**If context7 IS available:**
```
🔍 CHECKING RESEARCH CAPABILITIES

✅ context7 available (fetch official docs)
✅ web_search available (best practices)
✅ web_fetch available (documentation)

Ready to research with full capabilities!
```

### Step 1: Stack Discovery

**Claude asks:**
```
What technology stack are you using?

Please include:
- Framework/library (e.g., Next.js, Astro, SvelteKit)
- Version if known (e.g., Next.js 14)
- Database/ORM (e.g., Prisma, Drizzle)
- Styling solution (e.g., Tailwind CSS)
- Testing framework (e.g., Vitest, Jest)
- Other key technologies
```

**You provide:**
```
Next.js 14 (app router)
Prisma with PostgreSQL
tRPC for API
Tailwind CSS
Vitest for testing
TypeScript
```

### Step 2: Knowledge Gap Assessment

**Claude asks:**
```
Which technologies are you familiar with?

Rate each:
- ✅ Know well
- 🟡 Somewhat familiar
- ❌ Need to learn

Next.js: [your rating]
Prisma: [your rating]
tRPC: [your rating]
etc.
```

**Purpose:** Focuses research on what you actually need to learn

### Step 3: Research Phase

**Claude performs research:**
```
🔍 Researching Next.js 14...
   ✓ Found official documentation
   ✓ Reading App Router guide
   ✓ Checking recent best practices

🔍 Researching tRPC...
   ✓ Found official docs
   ✓ Reading integration guides
   ✓ Checking Next.js + tRPC patterns

🔍 Researching integration patterns...
   ✓ Next.js + Prisma setup
   ✓ tRPC + Prisma integration
   ✓ Testing strategies for this stack
```

**You see:** Progress updates as Claude researches each component

### Step 4: Standards Generation

**Claude creates:**
```
📄 Generating standards files...

Created: .claude/your-stack/coding-standards/nextjs-standards.md
Created: .claude/your-stack/coding-standards/typescript-standards.md
Created: .claude/your-stack/architecture/folder-structure.md
Created: .claude/your-stack/architecture/component-patterns.md
Created: .claude/your-stack/testing-standards.md
Created: .claude/your-stack/stack-config.yaml
```

### Step 5: Review & Customize

**Claude shows summary:**
```
✅ Research Complete!

Generated standards for:
- Next.js 14 App Router patterns
- Prisma schema and migrations
- tRPC router structure
- Tailwind CSS configuration
- Vitest setup with React Testing Library

📋 Key Findings:
- Use Server Components by default
- tRPC routers in src/server/trpc/
- Prisma schema in prisma/schema.prisma
- Collocate tests with source files

Would you like me to:
1. Explain any of these standards
2. Modify something
3. Generate example code
4. Proceed with /start-task
```

---

## Generated Files

### 1. stack-config.yaml

**Location:** `.claude/your-stack/stack-config.yaml`

**Content:**
```yaml
name: "Your Project"
version: "1.0.0"
research_date: "2025-10-14"

stack:
  framework: "Next.js"
  version: "14"
  routing: "App Router"
  language: "TypeScript"
  database: "PostgreSQL"
  orm: "Prisma"
  api: "tRPC"
  styling: "Tailwind CSS"
  testing: "Vitest"
  package_manager: "pnpm"

standards_active:
  - nextjs-standards
  - typescript-standards
  - prisma-standards
  - trpc-standards
  - tailwind-standards
  - testing-standards

tools:
  mcp_servers:
    - name: "filesystem"
      enabled: false
    - name: "github"
      enabled: false

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  app_dir: "app"
  server_dir: "src/server"
```

### 2. Coding Standards Files

**Created in:** `.claude/your-stack/coding-standards/`

Files created based on your stack:
- `nextjs-standards.md` - Next.js specific patterns
- `typescript-standards.md` - TypeScript conventions
- `prisma-standards.md` - Database patterns
- `trpc-standards.md` - API patterns
- `tailwind-standards.md` - Styling conventions

**Each file includes:**
- Official best practices
- Community conventions
- Real-world examples
- Common gotchas
- Integration notes

### 3. Architecture Files

**Created in:** `.claude/your-stack/architecture/`

- `folder-structure.md` - Project organization
- `component-patterns.md` - Component architecture
- `data-fetching.md` - Data loading patterns
- `api-structure.md` - API organization

### 4. Testing Standards

**Created in:** `.claude/your-stack/testing-standards.md`

- Test file organization
- Testing patterns for your stack
- Coverage requirements
- Example tests

---

## Research Quality

### What Gets Researched

**For each technology:**
1. **Official Documentation** - Primary source of truth
2. **Current Version** - Ensures up-to-date patterns
3. **Best Practices** - Community consensus
4. **Integration Points** - How pieces work together
5. **Common Patterns** - Real-world usage
6. **Testing Approaches** - How to test this stack

### Verification Process

**Standards are verified against:**
- ✅ Official documentation
- ✅ 3+ independent sources
- ✅ Recent content (last 6 months)
- ✅ Production examples (if GitHub MCP enabled)
- ✅ Version compatibility

---

## Customization

### After Research

You can customize any generated standards:

**To modify a standard:**
```
Edit the file in .claude/your-stack/coding-standards/

Example:
.claude/your-stack/coding-standards/nextjs-standards.md

Add your preferences:
- Custom component structure
- Specific naming conventions
- Team-specific patterns
```

**Framework commands will use your customized version**

### Updating Standards

**To update for new versions:**
```
/research-stack [same stack but new version]
```

Claude will:
- Compare old vs new standards
- Show what changed
- Ask if you want to update or merge

---

## Advanced Options

### Research Depth

**Quick research (10 min):**
```
/research-stack Next.js --quick
```
- Official docs only
- Basic patterns
- Essential setup

**Deep research (30+ min):**
```
/research-stack Next.js --deep
```
- Multiple sources
- Production examples
- Edge cases
- Performance patterns

### Specific Focus

**Focus on specific areas:**
```
/research-stack Next.js --focus authentication,forms
```

Researches only those aspects in detail

### Compare Stacks

**Research multiple options:**
```
/research-stack compare: Next.js vs Remix
```

Generates comparison document to help you choose

---

## Examples

### Example 1: SvelteKit Project

**Command:**
```
/research-stack SvelteKit 2.0 with Supabase
```

**Claude researches:**
- SvelteKit 2.0 file-based routing
- Supabase client setup
- Authentication patterns
- Form actions
- Server/client split

**Generates:**
- sveltekit-standards.md
- supabase-standards.md
- folder-structure.md (SvelteKit specific)
- auth-patterns.md
- testing-standards.md (Playwright + Vitest)

**Result:** Ready to build SvelteKit + Supabase app with clear standards

### Example 2: Vue 3 Project

**Command:**
```
/research-stack Vue 3 Composition API with Vite and Pinia
```

**Claude researches:**
- Vue 3 Composition API patterns
- Vite configuration
- Pinia state management
- Component organization
- Testing with Vitest

**Generates:**
- vue3-standards.md
- composition-api-patterns.md
- pinia-standards.md
- folder-structure.md (Vue 3 specific)
- testing-standards.md

### Example 3: Astro Project

**Command:**
```
/research-stack Astro 4 with React islands
```

**Claude researches:**
- Astro 4 features
- Island architecture
- React integration
- Content collections
- Deployment patterns

**Generates:**
- astro-standards.md
- island-architecture.md
- react-integration.md
- content-collections.md
- deployment-guide.md

---

## What Claude Does

### Research Process

**Phase 1: Discovery (5 min)**
```
1. Identify stack components
2. Determine versions
3. Assess knowledge gaps
4. Prioritize research areas
```

**Phase 2: Foundation Research (10 min)**
```
1. Search official documentation
   web_search "[technology] official documentation"
   
2. Fetch and read key pages
   web_fetch [official docs URL]
   
3. Understand core concepts
   - Terminology
   - Key features
   - Core patterns
   
4. Research integrations
   web_search "[tech A] with [tech B] setup"
```

**Phase 3: Community Patterns (10 min)**
```
1. Search best practices
   web_search "[technology] best practices 2025"
   
2. Find production examples (if GitHub MCP enabled)
   github search: popular repos using stack
   
3. Validate patterns
   - Cross-reference sources
   - Check dates
   - Verify against official docs
```

**Phase 4: Standards Generation (10 min)**
```
1. Create folder structure standard
2. Document coding conventions
3. Define testing approach
4. Generate configuration guide
5. Add integration notes
6. Include examples
```

**Phase 5: Validation (5 min)**
```
1. Verify all sources
2. Check for conflicts
3. Ensure completeness
4. Review quality
5. Present to user
```

### Quality Checks

**Before generating standards, Claude verifies:**
- [ ] Official docs consulted
- [ ] 3+ sources confirm patterns
- [ ] Information is recent (6-12 months)
- [ ] Version compatibility checked
- [ ] Integration points understood
- [ ] Examples are practical
- [ ] Standards are actionable

---

## Troubleshooting

### "Can't find information about X"

**Possible causes:**
- Technology is very new (pre-release)
- Uncommon combination
- Proprietary/internal tool

**Solutions:**
1. Provide more context about the technology
2. Share documentation links
3. Upload company docs if internal
4. Use /import-standards for proprietary tools

### "Standards seem outdated"

**Check:**
- Verify version numbers in stack-config.yaml
- Re-run with explicit versions: `/research-stack Next.js 15`
- Check research_date in stack-config.yaml

**Solution:**
```
/research-stack [stack] --force-refresh
```

### "Generated patterns don't match our needs"

**Remember:** These are starting points based on community standards

**Customize:**
1. Edit files in `.claude/your-stack/`
2. Add your team's preferences
3. Override any patterns
4. Document your reasoning

Framework will respect your customizations

### "Too much/too little information"

**Adjust depth:**
```
/research-stack [stack] --quick    # Less detail
/research-stack [stack] --deep     # More detail
```

---

## Tips for Best Results

### DO

✅ **Be specific about versions** - "Next.js 14" not just "Next.js"
✅ **List all important technologies** - Don't leave out testing, styling, etc.
✅ **Review generated standards** - Make sure they match your needs
✅ **Customize as needed** - Override anything that doesn't fit
✅ **Update periodically** - Re-research when major versions change

### DON'T

❌ **Rush through the questions** - Take time to provide complete info
❌ **Skip the review** - Always check what was generated
❌ **Treat as gospel** - Standards are starting points, adapt them
❌ **Forget to commit** - Save standards to version control
❌ **Never update** - Refresh standards when stack evolves

---

## After Research

### Next Steps

1. **Review all generated files** in `.claude/your-stack/`
2. **Customize any standards** that don't match your needs
3. **Commit to version control**
   ```bash
   git add .claude/your-stack/
   git commit -m "feat: add stack standards via /research-stack"
   ```
4. **Start building** with `/start-task`
5. **Share with team** so everyone uses same standards

### Integration with Other Commands

Once research is complete, other commands use these standards:

**`/start-task`** - Creates code matching your standards
**`/verify`** - Checks against your standards
**`/learn`** - Teaches based on your stack
**`/create-prd`** - Generates PRDs using your patterns

---

## Related

- [Stack Research Workflow](../workflows/stack-research.md) - Detailed research process
- [Web Research Guide](../tools/web-research.md) - Research methodology
- [Tool Catalog](../tools/tool-catalog.md) - Available tools
- [/import-standards](./import-standards.md) - Import company standards

---

**Pro Tip:** Run this command at the start of any new project or when joining a new team. The 30 minutes of research will save hours of confusion later!