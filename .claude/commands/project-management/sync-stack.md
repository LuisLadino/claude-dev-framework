# /sync-stack

**Set up your project's specs so Claude enforces your patterns and quality standards.**

The goal: Every time you run `/start-task`, Claude loads your specs and follows YOUR patterns. No more inconsistent code.

---

## What This Does

1. Detect your tech stack (or ask you)
2. Research official docs (context7 + web)
3. Scan your code for existing patterns
4. Generate specs that combine best practices with YOUR patterns
5. Update stack-config.yaml with active specs

---

## Usage

```
/sync-stack              # Full setup
/sync-stack prisma       # Add specs for a specific dependency
```

---

## Phase 1: Detect Stack

**Check for config files:**

| File | Detects |
|------|---------|
| package.json | Node.js project |
| tsconfig.json | TypeScript |
| next.config.* | Next.js |
| tailwind.config.* | Tailwind CSS |
| vitest.config.* | Vitest |
| prisma/schema.prisma | Prisma |

**If no code exists:** Ask what you're building and suggest a stack.

**Show detected stack, ask to confirm or modify.**

---

## Phase 2: Research

**Use context7 MCP first** for official documentation.

**Fallback to WebSearch** for best practices.

**For each technology, research:**
- Official patterns and conventions
- Common gotchas
- Integration patterns with your other tools

---

## Phase 3: Scan Your Code

**Discover YOUR existing patterns:**
- File structure and naming
- Component patterns
- Import styles
- Error handling
- Test structure

**These patterns are merged with researched best practices.**

---

## Phase 4: Generate Specs

**Dynamically discover all directories in `.claude/specs/`:**

Scan for subdirectories and create/update specs in each:
- `coding/` - Framework and language specs
- `architecture/` - File structure, patterns
- `design/` - Design tokens, system
- `documentation/` - Doc conventions
- `config/` - Git, deploy, env, testing
- Any custom directories you've created

**For each technology:**
1. Ask "Generate specs for [tech]? (yes/skip)"
2. Research official docs
3. Merge with patterns found in your code
4. Create `[tech]-specs.md`

---

## Phase 5: Update Config

**Update `stack-config.yaml`:**
- Stack details with versions
- List all discovered specs under `specs:`

**Report orphaned specs:** Files that don't match detected stack.

---

## How Specs Are Used

After running `/sync-stack`:

1. You run `/start-task`
2. Claude loads `stack-config.yaml`
3. Reads all files listed under `specs:`
4. Shows you what patterns will be enforced
5. You approve
6. Claude implements following YOUR specs
7. Runs quality gates before completion

**This is the enforcement loop.** Your specs become the rules.

---

## Dynamic Discovery

**New dependency?** Run `/sync-stack [dependency]`

**New directory?** Create it in `specs/`, add files, run `/sync-stack` to register.

**Custom patterns?** Edit any spec file. Your changes persist.

---

## Tools Used

- **context7 MCP** - Primary docs source
- **WebSearch** - Best practices
- **Grep/Read** - Scan your codebase

Always cite sources in generated specs.
