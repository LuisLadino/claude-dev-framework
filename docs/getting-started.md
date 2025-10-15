# Getting Started with Claude Development Framework

Welcome! This guide will get you up and running with the Claude Development Framework in less than 10 minutes.

---

## What is This?

The Claude Development Framework is a structured system that helps Claude (the AI assistant) maintain consistent, high-quality code standards across any technology stack. It's like having a senior developer's expertise built into every conversation.

**Think of it as:**
- A set of instructions that Claude follows automatically
- A knowledge base of your project's standards
- A quality enforcement system
- A workflow manager

---

## Choose Your Path

### 🆕 Starting Fresh (New Project)
Skip to [Quick Start (5 Minutes)](#quick-start-5-minutes)

### 🔄 Already Using Claude Code (Migration)
You have custom `.claud` files, project instructions, or your own standards? **Jump to [Migrating from Existing Setup](#migrating-from-existing-setup)** ⭐

---

## Migrating from Existing Setup

**Already using Claude Code with your own system?** Great! Here's how to adopt the framework without losing your work.

### Scenario 1: You Have Custom Instructions

**What you have:**
- Project instructions in `.claud/` or `.claude/`
- Custom prompts or guidelines
- Your own standards documented somewhere

**How to migrate:**

```bash
# 1. Backup your existing setup first
cd your-project
mv .claude .claude-backup  # or .claud if that's what you use

# 2. Install framework (it will merge automatically)
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash

# Select option 2: "Merge with existing" when prompted
# This keeps your custom files
```

**Option A: Let Claude analyze and merge**
```bash
# In Claude Code:
/import-standards analyze codebase

# Claude will:
# - Discover patterns from your code
# - Find your existing instructions
# - Merge with framework structure
# - Keep all your custom standards
```

**Option B: Manual merge**
```bash
# Copy your existing standards into framework structure
cp .claude-backup/instructions.md .claude/your-stack/coding-standards/custom-standards.md
cp .claude-backup/patterns.md .claude/your-stack/architecture/patterns.md

# Edit stack-config.yaml to register them
nano .claude/your-stack/stack-config.yaml
```

Add to `standards_active`:
```yaml
standards_active:
  - custom-standards  # Your existing instructions
  - patterns          # Your existing patterns
```

### Scenario 2: You Have Structured Standards

**What you have:**
- Organized `.claude/` directory with multiple files
- Coding standards, architecture docs, etc.
- Already following a system

**How to migrate:**

```bash
# 1. Clone framework to temp location
git clone https://github.com/LuisLadino/claude-dev-framework.git /tmp/claude-framework

# 2. Copy ONLY the parts you need:

# Get the command system
cp -r /tmp/claude-framework/.claude/commands .claude/

# Get the workflows (optional)
cp -r /tmp/claude-framework/.claude/workflows .claude/

# Get the main CLAUDE.md file
cp /tmp/claude-framework/.claude/CLAUDE.md .claude/

# 3. Keep your existing standards
# Your files stay in .claude/your-stack/ or wherever they are

# 4. Create stack-config.yaml to register your standards
cp /tmp/claude-framework/.claude/your-stack/stack-config.yaml .claude/your-stack/
```

Edit `.claude/your-stack/stack-config.yaml` to point to your existing files:
```yaml
standards_active:
  - my-react-standards      # Your existing file
  - my-typescript-standards # Your existing file
  - my-custom-patterns      # Your existing file
```

### Scenario 3: You Use Project Knowledge Only

**What you have:**
- No `.claude/` directory
- Everything in Claude's Project Knowledge
- Relying on uploaded docs

**How to migrate:**

```bash
# 1. Add the framework
cd your-project
git clone https://github.com/LuisLadino/claude-dev-framework.git .claude-temp
cp -r .claude-temp/.claude ./
rm -rf .claude-temp

# 2. Extract your knowledge into standards
# In Claude Code:
/import-standards

# Choose Option 2: Analyze codebase
# Claude will discover all patterns from your code
# and create standards files automatically
```

**Your Project Knowledge stays intact!** The framework adds structure, but Claude still uses uploaded docs.

### Scenario 4: You Have Company Standards Docs

**What you have:**
- Company handbook (PDF, Google Drive, Confluence, etc.)
- Engineering standards documentation
- Style guides

**How to migrate:**

```bash
# 1. Add the framework
cd your-project
git clone https://github.com/LuisLadino/claude-dev-framework.git .claude-temp
cp -r .claude-temp/.claude ./
rm -rf .claude-temp

# 2. Import your company docs
# In Claude Code:
/import-standards from Google Drive "Engineering Standards"

# Or use shell script for local files:
./scripts/import-company-standards.sh
```

Claude will convert your existing docs into the framework format automatically.

---

### What Gets Preserved

**✅ Keeps:**
- All your existing standards
- Your custom patterns
- Your naming conventions
- Your team's preferences
- Your project-specific rules

**✅ Adds:**
- Command system (`/start-task`, `/verify`, etc.)
- Workflow automation
- Quality checklists
- Stack-aware intelligence
- Update system

**❌ Doesn't Touch:**
- Your code
- Your git history
- Your existing docs (unless you want to merge)
- Claude's Project Knowledge

---

### Verification After Migration

```bash
# In Claude Code, ask:
/standards

# Claude will show:
# ✓ Framework standards (from .claude/templates/)
# ✓ Your custom standards (from .claude/your-stack/)
# ✓ All commands available
# ✓ Stack configuration

# Test it:
/start-task "Add a button component"

# Claude should follow YOUR standards, not generic ones
```

---

### Rollback if Needed

```bash
# If you want to go back:
rm -rf .claude
mv .claude-backup .claude

# Or keep both:
# - .claude/ (new framework)
# - .claude-backup/ (your old system)
# Try framework for a week, then decide
```

---

## Quick Start (5 Minutes)

### Step 1: Install the Framework

**Recommended: One-line install**

```bash
cd your-project
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash
```

This installs only the framework files you need (no templates, docs, or GitHub bloat).

**Alternative: Manual install**

```bash
# Clone to temporary directory
git clone https://github.com/LuisLadino/claude-dev-framework.git .claude-temp

# Run installer
cd .claude-temp && ./scripts/install.sh

# Cleanup
cd .. && rm -rf .claude-temp
```

**Your project structure after install:**
```
your-project/
├── .claude/              # Framework core (clean install)
│   ├── CLAUDE.md         # Main instructions
│   ├── commands/         # All slash commands
│   ├── workflows/        # Multi-step workflows
│   ├── tools/            # Tool configurations
│   ├── config/           # Environment configs
│   └── your-stack/       # Your custom standards (empty)
├── scripts/              # Helper scripts (optional)
├── src/                  # Your code
└── ...
```

**What got installed:**
- ✅ Core framework files
- ✅ Command system
- ✅ Empty your-stack/ structure
- ✅ Helper scripts (optional)

**What didn't get installed (stays in GitHub only):**
- ❌ Templates
- ❌ Documentation
- ❌ Examples
- ❌ CHANGELOG, multiple READMEs

### Step 2: Generate Standards for Your Stack

```bash
# In Claude Code:
/research-stack
```

Claude will ask what stack you're using, then:
- 🔍 Research official documentation
- 🔍 Find current best practices
- 📝 Generate detailed standards
- ✅ Create stack-config.yaml

**Works with ANY stack:** React, Python, Rust, Go, Django, Rails, etc.

### Step 3: Start Coding

```
/start-task "Add user profile page"
```

Claude will now:
- ✅ Check your stack configuration
- ✅ Read your coding standards
- ✅ Follow your architecture patterns
- ✅ Enforce quality checklist
- ✅ Generate properly structured code

**That's it!** You're now using the framework.

---

## Initial Setup (Detailed)

### Prerequisites

- A Claude Code account (any tier)
- A code project (any stack)
- Git installed (recommended)

### 1. Install Framework

Use the install script for a clean, minimal installation:

```bash
cd your-project
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash
```

The installer will:
- Check for existing `.claude/` directory
- Offer to backup or merge with your current setup
- Install only essential framework files
- Create empty `your-stack/` structure

**What gets installed vs what stays on GitHub:**

| Installed in Your Project | Stays on GitHub Only |
|---------------------------|----------------------|
| `.claude/CLAUDE.md` | `README.md` |
| `.claude/commands/` | `docs/` |
| `.claude/workflows/` | `templates/` |
| `.claude/tools/` | `CHANGELOG.md` |
| `.claude/config/` | Examples |
| `.claude/your-stack/` (empty) | |
| `scripts/` (optional helpers) | |

### 2. Configure for Your Stack

#### Option A: Use /research-stack (Recommended)

If you're using a common stack, let Claude research and generate your standards:

```
/research-stack
```

Claude will:
1. Ask what stack you're using
2. Research best practices online
3. Generate appropriate standards files
4. Save them to `.claude/your-stack/`
5. Update `stack-config.yaml`

**Example interaction:**
```
You: /research-stack

Claude: What technology stack are you using?

You: Next.js 14 with TypeScript, Tailwind CSS, and Vitest

Claude: [Researches Next.js best practices...]
       [Generates standards files...]
       ✅ Created:
       - .claude/your-stack/coding-standards/react-standards.md
       - .claude/your-stack/coding-standards/typescript-standards.md
       - .claude/your-stack/architecture/nextjs-architecture.md
       - .claude/your-stack/stack-config.yaml
```

#### Option B: Manual Configuration

Create `.claude/your-stack/stack-config.yaml`:

```yaml
name: "My Awesome Project"
version: "1.0.0"

stack:
  framework: "Next.js"      # Your framework
  language: "TypeScript"    # Your language
  styling: "Tailwind CSS"   # Your styling solution
  testing: "Vitest"         # Your test framework
  package_manager: "pnpm"   # Your package manager

standards_active:
  - react-standards
  - typescript-standards
  - nextjs-standards
  - tailwind-standards

tools:
  mcp_servers: []           # Add if you use MCP servers

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  pages_dir: "src/app"
```

Then create standards files in `.claude/your-stack/coding-standards/` (or copy from templates).

### 3. Verify Setup

Ask Claude:

```
Can you verify my framework setup?
```

Claude will:
- ✅ Check `.claude/CLAUDE.md` exists
- ✅ Check `stack-config.yaml` exists
- ✅ List active standards files
- ✅ Confirm everything is ready

---

## Understanding the Structure

### Key Directories

```
.claude/
├── CLAUDE.md                    # Master instructions (READ-ONLY)
├── README.md                    # Framework overview
│
├── commands/                    # Command system (READ-ONLY)
│   ├── start-task.md
│   ├── verify.md
│   ├── create-prd.md
│   ├── generate-tasks.md
│   └── ...
│
├── workflows/                   # Process guides (READ-ONLY)
│   ├── initial-setup.md
│   ├── stack-research.md
│   └── ...
│
├── templates/                   # Generation templates (READ-ONLY)
│   ├── coding-standards/
│   ├── architecture/
│   └── research-prompts/
│
└── your-stack/                  # YOUR CUSTOMIZATIONS
    ├── stack-config.yaml        # Your stack definition
    ├── coding-standards/        # Your coding rules
    ├── architecture/            # Your architecture patterns
    └── documentation-standards/ # Your doc requirements
```

**Important:**
- **READ-ONLY files:** Don't modify (they update from GitHub)
- **YOUR CUSTOMIZATIONS:** Modify freely (never overwritten)

### How It Works

1. **You issue a command:** `/start-task "Build login form"`
2. **Claude reads:**
   - `.claude/CLAUDE.md` - Master instructions
   - `.claude/your-stack/stack-config.yaml` - Your stack
   - `.claude/your-stack/coding-standards/` - Your rules
3. **Claude generates code** following your standards
4. **Claude verifies** against quality checklist
5. **Claude commits** with proper message

---

## Essential Commands

### Development Commands

**`/start-task "description"`**
Start a new development task with full context
```
/start-task "Add dark mode toggle to header"
```

**`/verify`**
Check code against all standards
```
/verify
```

**`/standards`**
Show which standards are active
```
/standards
```

**`/learn "topic"`**
Learn project patterns by example
```
/learn "how we handle forms"
```

### Planning Commands

**`/create-prd`**
Generate a Product Requirements Document
```
/create-prd
```

**`/generate-tasks`**
Break PRD into subtasks
```
/generate-tasks
```

**`/process-tasks`**
Execute all subtasks automatically
```
/process-tasks
```

### Setup Commands

**`/research-stack`**
Research and generate standards for your stack
```
/research-stack
```

**`/import-standards`**
Import your company's existing standards
```
/import-standards
```

**`/update-framework`**
Update framework to latest version
```
/update-framework
```

---

## Your First Task

Let's do a complete workflow:

### 1. Start a Task

```
/start-task "Create a reusable Button component"
```

Claude will:
- Show standards check
- Read your React/Vue/Svelte standards
- Generate component following your patterns
- Include tests
- Add documentation

### 2. Verify Quality

```
/verify
```

Claude checks:
- ✅ Follows coding standards
- ✅ TypeScript types correct
- ✅ Tests included
- ✅ Documentation present
- ✅ No anti-patterns
- ✅ Accessible

### 3. Review and Commit

Review Claude's code, then:
```
Yes, looks good. Commit this.
```

Claude creates commit with proper message:
```
feat(components): add reusable Button component

- Implements Button with variants (primary, secondary, danger)
- Includes TypeScript props interface
- Adds comprehensive tests
- Follows React standards
- Fully accessible (ARIA, keyboard nav)
```

**Done!** You just completed your first framework-powered task.

---

## Common Workflows

### Building a New Feature

```
1. /create-prd                    # Define the feature
2. /generate-tasks                # Break into subtasks
3. Review subtasks
4. /process-tasks                 # Auto-execute all tasks
```

### Learning Project Patterns

```
/learn "how we structure components"
/learn "our testing patterns"
/learn "API call conventions"
```

### Quick Task

```
/start-task "Fix mobile menu not closing"
[Claude implements fix following standards]
/verify
Commit it
```

---

## Customization Basics

### Adding Your Own Standards

Create files in `.claude/your-stack/coding-standards/`:

**Example: `.claude/your-stack/coding-standards/api-standards.md`**
```markdown
# API Standards

## Fetch Wrapper

Always use our centralized fetch wrapper:

```typescript
import { api } from '@/lib/api';

const users = await api.get('/users');
```

## Error Handling

Handle errors with toast notifications:

```typescript
try {
  await api.post('/users', data);
  toast.success('User created');
} catch (error) {
  toast.error('Failed to create user');
}
```
```

Claude will now follow these patterns automatically.

### Updating Stack Configuration

Edit `.claude/your-stack/stack-config.yaml` anytime:

```yaml
# Add new standards
standards_active:
  - react-standards
  - typescript-standards
  - api-standards        # ← Your new standard

# Update project specifics
project_specifics:
  api_base_url: "https://api.example.com"
  import_alias: "@/"
```

---

## Troubleshooting

### Scripts Don't Work / Errors

**Problem:** `./scripts/init-stack.sh` fails or doesn't support your stack

**Best Solution: Skip scripts, use `/research-stack` instead**

```bash
# In Claude Code (no scripts needed):
/research-stack

# Tell Claude your stack:
"I'm using Python with FastAPI, PostgreSQL, and pytest"

# Claude will:
# ✓ Research FastAPI best practices
# ✓ Generate Python standards
# ✓ Create pytest patterns
# ✓ Set up stack-config.yaml
# ✓ Everything just works
```

**Why this works better:**
- Scripts have limited presets (30+ frameworks)
- `/research-stack` works with **ANY** stack
- Gets current best practices (2024-2025)
- No shell script issues

**Alternative: Manual setup**
```bash
# 1. Create directories
mkdir -p .claude/your-stack/{coding-standards,architecture,documentation-standards}

# 2. Copy framework
cp -r /path/to/claude-dev-framework/.claude ./

# 3. Use /research-stack to generate standards
```

---

### Claude Isn't Following Standards

**Solution:** Tell Claude to re-read:
```
Please read .claude/CLAUDE.md and my stack configuration again.
```

### Standards Not Being Applied

**Check:**
1. Is the standard file in `.claude/your-stack/coding-standards/`?
2. Is it listed in `stack-config.yaml` under `standards_active`?
3. Ask Claude: `/standards` to see what's active

### Wrong Framework Patterns

**Solution:** Update `stack-config.yaml`:
```yaml
stack:
  framework: "React"  # ← Make sure this is correct
```

Or just use `/research-stack` to regenerate correct standards.

### Need Different Patterns

**Solution:** Override by creating standards files in `.claude/your-stack/`
Your files always take precedence.

---

### Commands Not Working

**Problem:** `/start-task` doesn't do anything

**Fallback: Just ask directly**
```
# Instead of:
/start-task "Add user authentication"

# Just ask:
Please add user authentication following the standards in .claude/your-stack/

# Claude will do the same thing
```

**Why this works:** Commands are just convenience wrappers. Claude can follow standards without them.

---

## Uninstalling the Framework

Need to remove the framework? We've made it safe and flexible:

```bash
./scripts/uninstall.sh
```

**You'll get three options:**

### Option 1: Backup and Remove Everything
```bash
# Backs up your-stack/ to .claude-standards-backup-[date]/
# Removes .claude/ directory
# Optionally removes scripts/
```

**Choose this when:** Starting over or switching to a different system

### Option 2: Keep Standards, Remove Framework
```bash
# Keeps .claude/your-stack/ (your custom standards)
# Removes framework files (CLAUDE.md, commands/, etc.)
# Optionally removes scripts/
```

**Choose this when:** You want to keep your standards but not the framework

### Option 3: Remove Everything
```bash
# Removes .claude/ completely
# No backup (asks for confirmation)
# Optionally removes scripts/
```

**Choose this when:** Complete cleanup needed

**No lock-in:** Your standards are just markdown files. Take them with you, use them elsewhere, or delete them. The framework doesn't hold your work hostage.

---

## Next Steps

Now that you're up and running:

1. **Customize:** Read [Customization Guide](./customization-guide.md)
2. **Understand:** Read [Framework Philosophy](./philosophy.md)
3. **Advanced:** Set up [MCP Integration](./mcp-setup.md)
4. **Questions:** Check the [FAQ](./faq.md)

---

## Pro Tips

### 1. Use Project Knowledge

Upload your existing codebase to Claude's project knowledge. Claude will learn your patterns automatically.

### 2. Iterate on Standards

Start with basic standards, then refine as you go. The framework grows with your project.

### 3. Document Decisions

Add architectural decision records (ADRs) to `.claude/your-stack/architecture/decisions/`

### 4. Share With Team

Commit `.claude/` to git. Your whole team benefits from consistent standards.

### 5. Keep Framework Updated

Run `/update-framework` occasionally to get latest improvements.

---

## Getting Help

- **Documentation:** Browse `/docs` folder
- **Examples:** See `/docs/examples` for real configurations
- **Issues:** Report bugs on [GitHub Issues](https://github.com/LuisLadino/claude-dev-framework/issues)
- **Community:** Share your experience and ask questions

---

**Happy coding! The framework is now your AI pair programmer with perfect memory of your standards.** 🚀
