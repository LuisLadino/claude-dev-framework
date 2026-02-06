# /research-stack

**Research a technology stack and generate comprehensive standards**

---

## Purpose

Generate coding standards for a known tech stack. Researches official docs and best practices.

**Use this when:** You already know your stack (or ran /init-project or /sync-stack) and need coding standards generated.

**Don't use this when:**
- Starting a brand new project → use `/init-project` first
- Need to detect stack from existing code → use `/sync-stack` first

**Typical flow:**
1. `/init-project` (new project) OR `/sync-stack` (existing project)
2. `/research-stack` (this command) - generates standards

---

## Tools Used

- **WebSearch** - Find official documentation and best practices
- **WebFetch** - Read documentation pages
- **Read/Grep** - Analyze existing codebase patterns

---

## Usage

```
/research-stack                    # Generate standards for entire stack
/research-stack prisma             # Generate standards for one dependency
/research-stack tailwind zustand   # Generate standards for specific dependencies
```

---

## Interactive Flow

### Step 1: Stack Discovery

**If stack-config.yaml exists:** Load it and confirm the stack with user. Ask if they want to research all technologies or specific ones.

**If stack-config.yaml doesn't exist:** Ask user for their stack.

### Step 2: Knowledge Gap Assessment

Ask user to rate familiarity with each technology (know well / somewhat familiar / need to learn). Focus research on gaps.

### Step 3: Research Phase

Research each technology using available tools. Show progress updates. Cover:
- Official documentation
- Integration patterns between stack components
- Testing strategies for the stack

### Step 4: Standards Generation

Create standards files in `.claude/your-stack/`:
- `coding-standards/` - One file per technology
- `architecture/` - Folder structure, component patterns
- `testing-standards.md`
- Update `stack-config.yaml`

### Step 5: Review & Customize

Show summary of generated standards and key findings. Offer to:
1. Explain any standards
2. Modify something
3. Generate example code
4. Proceed with /start-task

---

## Generated Files

### 1. stack-config.yaml
`.claude/your-stack/stack-config.yaml` - Project name, research date, full stack config, standards_active list, MCP tool settings, project_specifics (directories, aliases).

### 2. Coding Standards Files
`.claude/your-stack/coding-standards/` - One file per technology (e.g., nextjs-standards.md, typescript-standards.md). Each includes official best practices, community conventions, examples, common gotchas, and integration notes.

### 3. Architecture Files
`.claude/your-stack/architecture/` - folder-structure.md, component-patterns.md, data-fetching.md, api-structure.md.

### 4. Testing Standards
`.claude/your-stack/testing-standards.md` - Test file organization, testing patterns, coverage requirements, example tests.

---

## Research Quality

For each technology, research: official documentation, current version, best practices, integration points, common patterns, testing approaches.

**Verify standards against:** official docs, 3+ independent sources, recent content (last 6 months), production examples (if GitHub MCP enabled), version compatibility.

---

## Customization

Edit any file in `.claude/your-stack/coding-standards/` to add team-specific patterns. Framework commands will use your customized version.

**To update for new versions:** Run `/research-stack` with the new version. Claude will compare old vs new, show changes, and ask whether to update or merge.

---

## Advanced Options

- `--quick` - Official docs only, basic patterns, essential setup
- `--deep` - Multiple sources, production examples, edge cases, performance patterns
- `--focus [areas]` - Research only specific areas (e.g., `--focus authentication,forms`)
- `compare: [A] vs [B]` - Generate comparison document between stacks

---

## Research Process

1. **Discovery** - Identify stack components, determine versions, assess knowledge gaps, prioritize research
2. **Foundation Research** - Search and read official documentation, understand core concepts, research integrations between technologies
3. **Community Patterns** - Search best practices, find production examples (if GitHub MCP enabled), validate patterns against multiple sources
4. **Standards Generation** - Create folder structure, coding conventions, testing approach, configuration guide, integration notes, examples
5. **Validation** - Verify sources, check for conflicts, ensure completeness, present to user

**Quality checks before generating:** Official docs consulted, 3+ sources confirm patterns, information is recent, version compatibility checked, integration points understood, examples are practical, standards are actionable.

---

## Troubleshooting

- **Can't find information:** Technology may be new, uncommon, or proprietary. Provide more context or share doc links.
- **Standards seem outdated:** Verify version numbers in stack-config.yaml. Re-run with explicit versions or `--force-refresh`.
- **Patterns don't match needs:** Edit files in `.claude/your-stack/` to customize. Framework respects your customizations.
- **Too much/too little info:** Use `--quick` or `--deep` flags.

---

## After Research

1. Review all generated files in `.claude/your-stack/`
2. Customize any standards that don't match your needs
3. Commit to version control
4. Start building with `/start-task`

**Integration:** Once complete, `/start-task` creates code matching your standards, `/verify` checks against them, `/learn` teaches based on your stack, `/add-feature` uses your patterns.

---

## Related

- `/sync-stack` - Detect stack and discover patterns from code
- `/add-standard` - Add custom standards manually