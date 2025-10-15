# Initial Setup Workflow

**How to set up the Claude Development Framework for your project**

This guide walks you through configuring the framework for your specific tech stack.

---

## Overview

Setting up the framework involves:

1. **Define your stack** - Tell the framework what technologies you're using
2. **Choose your approach** - Templates, research, or import
3. **Configure standards** - Set up coding patterns
4. **Verify setup** - Make sure everything works
5. **Start building** - Use the framework

**Time required:** 15-30 minutes

---

## Prerequisites

Before starting:

- [ ] Framework cloned into your project
- [ ] You know your tech stack (React, Vue, Next.js, etc.)
- [ ] (Optional) MCP servers configured for advanced features

---

## Step 1: Define Your Stack

Edit `.claude/your-stack/stack-config.yaml`:

### Option A: Manual Configuration

```yaml
stack:
  framework: "React"              # Your framework
  framework_version: "19"
  language: "TypeScript"
  language_mode: "strict"
  styling: "Tailwind CSS"
  # ... etc
```

Fill in your specific technologies.

### Option B: Automated Setup (Coming Soon)

```bash
./scripts/init-stack.sh

> What framework? "React"
> TypeScript or JavaScript? "TypeScript"
> Styling approach? "Tailwind CSS"
# ... more questions
```

The script will generate `stack-config.yaml` for you.

---

## Step 2: Choose Your Standards Approach

You have three options for setting up coding standards:

### Option A: Use Templates (Fastest)

**Best for:** Popular stacks (React, Vue, Next.js, etc.)

Copy pre-made templates:

```bash
# Copy React template
cp .claude/templates/coding-standards/_react-standards.md \
   .claude/your-stack/coding-standards/react-standards.md

# Copy TypeScript template
cp .claude/templates/coding-standards/_typescript-standards.md \
   .claude/your-stack/coding-standards/typescript-standards.md

# Copy styling template
cp .claude/templates/coding-standards/_styling-standards.md \
   .claude/your-stack/coding-standards/styling-standards.md
```

Then customize as needed.

### Option B: Research & Generate (Intelligent)

**Best for:** Unfamiliar stacks or current best practices

Use AI to research and create standards:

```markdown
In Claude Code, use:

/research-stack
"Next.js 15 App Router with TypeScript and Tailwind"

AI will:
1. Search for official documentation
2. Find current best practices
3. Research common patterns
4. Generate standards files
5. Save to your-stack/coding-standards/
```

**Requirements:** MCP servers or web_search enabled

### Option C: Import Company Standards (Professional)

**Best for:** Working at a company with existing standards

Import from company documentation:

```markdown
In Claude Code, use:

/import-standards

> Where are company standards?
"company-handbook.pdf, internal-wiki/coding-standards, github.com/company/style-guide"

AI will:
1. Read company documentation
2. Extract coding patterns
3. Convert to framework format
4. Save as your standards
```

**Requirements:** MCP servers (context7 or filesystem)

---

## Step 3: Set Up File Structure

Create the directory structure in `.claude/your-stack/`:

```bash
mkdir -p .claude/your-stack/coding-standards
mkdir -p .claude/your-stack/architecture
mkdir -p .claude/your-stack/documentation-standards
```

### Required Files

At minimum, create these:

**1. `.claude/your-stack/coding-standards/[framework]-standards.md`**

Example: `react-standards.md`, `vue-standards.md`

Contains:
- Component patterns
- State management
- Naming conventions
- Best practices

**2. `.claude/your-stack/coding-standards/[language]-standards.md`**

Example: `typescript-standards.md`, `javascript-standards.md`

Contains:
- Type definitions
- Language features to use/avoid
- Code organization

**3. `.claude/your-stack/architecture/file-structure.md`**

Contains:
- Where files go
- Directory organization
- Naming conventions

**4. `.claude/your-stack/documentation-standards/code-comments.md`**

Contains:
- When to comment
- Comment style
- Documentation requirements

---

## Step 4: Configure Active Standards

Update `stack-config.yaml` to reference your standards:

```yaml
standards_active:
  - react-standards        # Matches: coding-standards/react-standards.md
  - typescript-standards   # Matches: coding-standards/typescript-standards.md
  - styling-standards      # Matches: coding-standards/styling-standards.md

architecture_patterns:
  - file-structure         # Matches: architecture/file-structure.md
  - component-patterns     # Matches: architecture/component-patterns.md

documentation_standards:
  - code-comments          # Matches: documentation-standards/code-comments.md
```

**Important:** File names in `standards_active` must match actual files in `your-stack/`.

---

## Step 5: Test the Setup

Verify everything works:

### Test with AI Assistant

In Claude Code:

```markdown
/start-task
"Create a simple hello world component"

You should see:
1. AI reads stack-config.yaml
2. AI reads your standards files
3. AI shows standards check
4. AI waits for approval
```

If AI doesn't show standards check, say: **`Standards?`**

### Verify Standards are Loading

Ask AI:

```markdown
What stack am I using?
What standards are active?
```

AI should correctly describe your stack and list your active standards.

---

## Step 6: Configure Tools (Optional)

### MCP Servers

If you want advanced features (research, import):

1. **Check if MCP is available:**
   - Claude Code has built-in MCP support
   - Other tools may vary

2. **Enable servers in stack-config.yaml:**

```yaml
tools:
  mcp_servers:
    - name: "context7"
      enabled: true
    - name: "web_search"
      enabled: true
```

3. **Test:**

```markdown
Can you use web_search to find React 19 best practices?
```

### Web Search

Enable in stack-config.yaml:

```yaml
tools:
  web_search:
    enabled: true
    prefer_official_docs: true
```

Test:

```markdown
/research-stack "Tailwind CSS v4"
```

---

## Step 7: Customize Standards (Ongoing)

Your standards will evolve. Update them as you learn:

### Adding New Patterns

When you discover a good pattern:

1. Add it to the relevant standards file
2. Include examples
3. Explain why this pattern is preferred

### Removing Bad Patterns

When you find a better way:

1. Update the standards file
2. Note why the old way was problematic
3. Provide migration guidance

### Standards are Living Documents

- Update them regularly
- Document lessons learned
- Keep examples current
- Remove outdated patterns

---

## Verification Checklist

Before considering setup complete:

- [ ] `stack-config.yaml` exists and is filled out
- [ ] At least one coding standards file exists
- [ ] At least one architecture file exists
- [ ] `standards_active` in config matches actual files
- [ ] AI can read and understand the stack
- [ ] `/start-task` shows proper standards check
- [ ] Quality gates are configured
- [ ] (Optional) MCP servers are working

---

## Troubleshooting

### AI doesn't show standards check

**Solution:** Say `Standards?` to force proper workflow

**Cause:** Standards check was skipped

### AI can't find standards files

**Check:**
1. Files exist in `.claude/your-stack/coding-standards/`
2. File names match entries in `standards_active`
3. No typos in config

### Standards seem generic, not stack-specific

**Solution:** Customize the template files

**Cause:** You copied templates but didn't customize them

### AI doesn't understand my stack

**Check:**
1. `stack-config.yaml` is filled out correctly
2. Framework name is clear (e.g., "React" not "react.js")
3. All required fields are present

### MCP tools aren't working

**Check:**
1. MCP servers are installed and configured
2. `enabled: true` in stack-config.yaml
3. AI has permission to use tools

---

## Next Steps

After setup is complete:

### Start Building

```markdown
/start-task
"Create [your first feature]"
```

### Learn the Commands

- `/start-task` - Build features
- `/learn` - Understand code
- `/create-prd` - Plan big features
- `/verify` - Check quality

See `.claude/commands/COMMANDS-README.md`

### Read the Documentation

- Main README in repo root
- Full docs in `docs/`
- Command references
- Examples

### Iterate on Standards

As you build:
1. Notice patterns that work well
2. Update standards to capture them
3. Remove patterns that don't work
4. Keep improving

---

## Tips for Success

### Start Simple

Don't try to create perfect standards immediately:
1. Start with basic patterns
2. Build something
3. Learn what works
4. Update standards
5. Repeat

### Use Examples

Include examples in your standards:
```markdown
## Good Pattern

\`\`\`typescript
export function MyComponent({ title }: Props) {
  // Clear, simple implementation
}
\`\`\`

## Why This Works

[Explain the reasoning]
```

### Explain the "Why"

Standards should explain:
- What the pattern is
- Why it's preferred
- When to use it
- When NOT to use it

### Keep Standards Updated

Set a reminder to review standards monthly:
- What patterns emerged?
- What caused problems?
- What needs updating?

---

## Common Setup Scenarios

### Scenario 1: Personal React Project

```yaml
stack:
  framework: "React"
  language: "TypeScript"
  styling: "Tailwind CSS"
  
standards_active:
  - react-standards
  - typescript-standards
  - styling-standards
```

Time: 15 minutes using templates

### Scenario 2: Company Next.js Project

```bash
# Import company standards
/import-standards
> company-handbook.pdf

# Then customize
```

Time: 30 minutes with import

### Scenario 3: Learning New Stack (Vue)

```bash
# Research and generate
/research-stack
"Vue 3 Composition API + Pinia"
```

Time: 20 minutes with research

---

## Summary

Setting up the framework:

1. **Define stack** in `stack-config.yaml`
2. **Choose approach** (templates, research, or import)
3. **Create standards** in `.claude/your-stack/`
4. **Configure** `standards_active`
5. **Test** with `/start-task`
6. **Iterate** as you build

**The framework adapts to YOUR stack and YOUR patterns.**

---

## Need Help?

- Check `docs/getting-started.md` for more details
- See `docs/troubleshooting/` for common issues
- Open an issue on GitHub
- Ask AI: `/learn "How do I [X]?"`

---

**You're ready to build!** 🚀

Use `/start-task` to create your first feature with enforced standards.