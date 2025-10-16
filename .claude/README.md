# The `.claude/` Directory

**This directory contains the Claude Development Framework - a system that enforces quality standards when working with AI coding assistants.**

---

## What Is This?

The `.claude/` directory is a development framework that:

- **Enforces Standards** - AI assistants must follow your coding patterns
- **Provides Structure** - Clear workflows for building features
- **Ensures Quality** - Automated checks before every commit
- **Teaches While Building** - Explains code as it's created
- **Adapts to Your Stack** - Works with React, Vue, Next.js, or any framework

Think of it as a "system" that AI follows - like having a senior developer reviewing every change.

---

## Directory Structure

```
.claude/
├── CLAUDE.md                      # Master instructions for AI
├── README.md                      # This file
│
├── commands/                      # Slash commands you can use
│   ├── start-task.md             # /start-task - Quick feature building
│   ├── learn.md                  # /learn - Understand what was built
│   ├── create-prd.md             # /create-prd - Plan big features
│   └── [other commands]          # More workflows
│
├── templates/                     # Pre-made patterns for popular stacks
│   ├── coding-standards/         # React, Vue, TypeScript templates
│   ├── documentation-standards/  # Universal doc patterns
│   └── architecture/             # File structure templates
│
├── your-stack/                    # YOUR customized standards
│   ├── stack-config.yaml         # Your stack definition
│   ├── coding-standards/         # Your patterns
│   └── architecture/             # Your file structure
│
├── workflows/                     # Intelligent workflows
│   ├── initial-setup.md          # First-time setup
│   ├── company-adoption.md       # Import company standards
│   └── stack-research.md         # Research & generate standards
│
├── tools/                         # AI tool integration docs
│   ├── mcp-integration.md        # How to use MCP servers
│   ├── web-research.md           # Using web search effectively
│   └── tool-catalog.md           # Available tools
│
└── config/                        # Framework configuration
    ├── version-control.md        # Git workflow
    ├── deployment.md             # Deployment process
    └── environment.md            # Dev environment setup
```

---

## How It Works

### 1. You Define Your Stack

In `.claude/your-stack/stack-config.yaml`:

```yaml
stack:
  framework: "React"      # or Vue, Astro, Next.js, etc.
  language: "TypeScript"
  styling: "Tailwind CSS"
```

### 2. You Set Standards

Either:
- **Copy from templates** - Use pre-made patterns for popular stacks
- **Import from company** - Convert company docs to framework format
- **Research and generate** - AI researches best practices and creates standards

Standards go in `.claude/your-stack/coding-standards/`.

### 3. AI Reads Standards Before Coding

When you use commands like `/start-task`, the AI:
1. Reads your stack configuration
2. Searches for relevant standards
3. Shows you what it plans to do
4. **Waits for your approval**
5. Builds following your patterns
6. Verifies quality automatically

### 4. Quality is Enforced

Before any commit:
- Code matches your standards
- Tests pass (if applicable)
- Format and lint checks pass
- All requested features complete
- No debug code left behind

**If AI skips this, type "Standards?" and it restarts properly.**

---

## Commands You Can Use

The framework provides slash commands:

### Core Workflow

- **`/start-task`** - Build features with enforced standards
  ```
  /start-task
  "Create a user profile component"
  ```

- **`/learn`** - Understand what you built
  ```
  /learn
  [Explains the last task in detail]
  
  /learn "What is React hydration?"
  [Answers specific questions]
  ```

- **`/verify`** - Check code against standards
  ```
  /verify
  [Runs comprehensive quality check]
  ```

### Planning & Research

- **`/create-prd`** - Plan big features
- **`/generate-tasks`** - Break PRDs into tasks
- **`/process-tasks`** - Execute tasks step-by-step

### Setup & Configuration

- **`/research-stack`** - Research & generate standards (coming soon)
- **`/import-standards`** - Import company docs (coming soon)
- **`/update-framework`** - Update framework & company standards

**See `.claude/commands/` for detailed command documentation.**

---

## For Different Use Cases

### Personal Projects

**Setup:**
```bash
# Initialize for your stack
./scripts/init-stack.sh
> "React + TypeScript + Tailwind"
```

**Use:**
- `/start-task` for quick features
- `/learn` to understand code
- Build while learning

### Professional Work

**Setup:**
```bash
# Import company standards
./scripts/import-company-standards.sh
> Point to company handbook/repos
```

**Use:**
- Company patterns enforced automatically
- Consistent with team conventions
- Productive from Day 1

### Learning New Stacks

**Setup:**
```bash
# Research unfamiliar stack
/research-stack
> "Vue 3 Composition API + Pinia"
```

**Use:**
- AI researches best practices
- Generates standards automatically
- Build with confidence

---

## Customizing for Your Stack

### Option 1: Use Templates

Copy from `.claude/templates/`:

```bash
# Copy React template
cp .claude/templates/coding-standards/_react-standards.md \
   .claude/your-stack/coding-standards/react-standards.md

# Customize as needed
```

### Option 2: Research & Generate

Use AI to research and create standards:

```bash
/research-stack
"Next.js 15 App Router + TypeScript"

# AI will:
# - Search for best practices
# - Find official documentation
# - Generate standards files
# - Save to your-stack/
```

### Option 3: Import Company Standards

Import from company documentation:

```bash
/import-standards
> Point to company handbook, style guides, repos

# AI will:
# - Read company documentation
# - Convert to framework format
# - Save as your standards
```

---

## Key Concepts

### Stack-Agnostic Core

The framework's core (commands, workflows) works with **any** stack. It adapts by reading `.claude/your-stack/`.

### Standards Enforcement

AI **must** show you what standards it read and wait for approval. Can't skip this. If it does, say "Standards?"

### Quality Gates

Before every commit:
- Format check
- Lint check
- Type check (if applicable)
- Build check
- Test check (if applicable)

All must pass. No broken code gets committed.

### Learning System

The `/learn` command explains:
- What was built
- Why it was built that way
- How it works
- Concepts used

**Use this after every task to actually learn.**

---

## How This Helps You

### Consistency

- Same patterns everywhere
- Predictable code structure
- Easy to navigate codebase

### Quality

- Standards can't be skipped
- Automated quality checks
- Professional-level code

### Learning

- Understand code as you build
- Learn best practices
- No more copy-paste without understanding

### Productivity

- Clear workflows
- No decision fatigue
- AI does heavy lifting
- You maintain control

---

## Working with the Framework

### Daily Workflow

```
1. Start a task:
   /start-task "description"

2. Review standards check
   [Read what AI plans to do]
   
3. Approve or adjust
   "yes" or provide feedback
   
4. AI builds following standards
   [Automatic verification]
   
5. Learn what was built
   /learn
```

### When Standards Are Unclear

If you're unsure about standards:

1. Look in `.claude/your-stack/coding-standards/`
2. Check examples in your codebase
3. Use `/learn` to ask questions
4. Update standards as you learn

**Standards are living documents** - improve them over time.

### When AI Doesn't Follow Standards

**Type: `Standards?`**

This forces AI to:
1. Stop what it's doing
2. Show proper standards check
3. Wait for your approval
4. Restart correctly

**This is your emergency brake.**

---

## Integration with Tools

### MCP Servers

If configured, the framework can use:

- **context7** - Read external docs and company materials
- **filesystem** - Access project files
- **web_search** - Research best practices

See `.claude/tools/mcp-integration.md` for setup.

### Web Search

The framework can research:
- Best practices for your stack
- Official documentation
- Current ecosystem trends
- Solutions to specific problems

AI will cite sources when using web research.

---

## Files You Should Never Edit

**Don't edit these:**
- `.claude/CLAUDE.md` - Core instructions
- `.claude/commands/` - Command definitions
- `.claude/workflows/` - Workflow logic
- `.claude/config/` - Framework configuration

**These are the framework itself.** Changes here affect how the system works.

### Files You Should Edit

**Edit these:**
- `.claude/your-stack/stack-config.yaml` - Your stack definition
- `.claude/your-stack/coding-standards/` - Your patterns
- `.claude/your-stack/architecture/` - Your structure
- `.claude/your-stack/documentation-standards/` - Your doc requirements

**These are your customizations.** This is how you adapt the framework.

---

## Updating the Framework

To get framework AND company standards updates:

**In Claude Code:**
```
/update-framework
```

This shows you:
- 📦 Available framework updates (new features, bug fixes, commands)
- 📚 Available company standards updates (if standards_source configured)
- ✅ Interactive review with diffs
- ✅ Choose what to update
- ✅ Automatic backups

**Or run script directly:**
```bash
/update-framework
```

**Your customizations are always preserved:**
- ✅ `your-stack/` files never overwritten
- ✅ Automatic backups before updates
- ✅ Framework updates separate from your standards
- ✅ Choose which updates to apply

**For Teams:** Set up centrally-managed standards by configuring `standards_source` in `your-stack/stack-config.yaml`. See [Company Standards Management](../docs/company-standards-management.md) for details.

---

## Troubleshooting

### "Command not found"

Commands are slash commands for AI, not terminal commands. Use them when talking to Claude Code or similar AI assistants.

### "AI isn't following standards"

Say: **`Standards?`**

This forces the proper workflow.

### "Standards conflict with each other"

1. Check `.claude/your-stack/stack-config.yaml`
2. Verify correct standards are active
3. Resolve conflicts by editing your standards
4. Update configuration

### "How do I customize this?"

1. Copy from `.claude/templates/` to `.claude/your-stack/`
2. Edit the files in `your-stack/`
3. Update `stack-config.yaml` to reference them
4. Restart session with AI

---

## Learn More

**Documentation:**
- [Full docs](../../docs/) - Complete framework documentation
- [Getting Started](../../docs/getting-started.md) - First 15 minutes
- [Command Reference](../../docs/command-reference.md) - All commands
- [Customization Guide](../../docs/customization-guide.md) - Adapt to your stack

**Examples:**
- [Astro + React](../../docs/examples/astro-react/) - Full example
- [Next.js](../../docs/examples/nextjs/) - Next.js example
- [Vue](../../docs/examples/vue/) - Vue example

**Main README:**
- [Repository README](../../README.md) - Project overview

---

## Summary

The `.claude/` directory is a development framework that:

1. **Loads your stack** from `your-stack/stack-config.yaml`
2. **Reads your standards** from `your-stack/`
3. **Enforces quality** through automated checks
4. **Provides commands** for structured workflows
5. **Teaches while building** with `/learn`
6. **Adapts to any stack** through configuration

**Goal:** Professional, consistent code with AI assistance while actually learning and understanding what you're building.

---

**Questions?** See the [main documentation](../../docs/) or open an issue on GitHub.