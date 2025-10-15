# Your Stack Customizations

This directory contains YOUR project's customized standards and configurations.

---

## What Goes Here?

After forking/cloning the Claude Development Framework, customize these files for YOUR project:

### 1. `stack-config.yaml` (Required)

**What it is:** Defines your tech stack (framework, language, styling, testing, etc.)

**How to customize:**
```bash
# Edit this file to match YOUR stack
stack-config.yaml
```

Update the `stack` section with your actual technologies:
```yaml
stack:
  framework: "Your Framework"    # React, Vue, Svelte, etc.
  language: "Your Language"      # TypeScript, JavaScript
  styling: "Your Styling"        # Tailwind, CSS Modules, etc.
  testing: "Your Testing"        # Vitest, Jest, etc.
```

---

### 2. `coding-standards/` (Recommended)

**What it is:** Your project-specific coding patterns and conventions

**How to customize:**
1. Copy templates from `.claude/templates/coding-standards/`
2. Paste into this `coding-standards/` directory
3. Customize for your project's needs

**Example:**
```bash
# Copy React template
cp .claude/templates/coding-standards/_react.md \
   .claude/your-stack/coding-standards/react-standards.md

# Edit to match your preferences
```

**Common files:**
- `react-standards.md` or `vue-standards.md` or `svelte-standards.md`
- `typescript-standards.md` or `javascript-standards.md`
- `styling-standards.md`
- `testing-standards.md`

---

### 3. `architecture/` (Recommended)

**What it is:** Your project's file structure and component patterns

**How to customize:**
1. Copy templates from `.claude/templates/architecture/`
2. Paste into this `architecture/` directory
3. Document YOUR project's structure

**Example:**
```bash
# Copy architecture templates
cp .claude/templates/architecture/_file-structure.md \
   .claude/your-stack/architecture/file-structure.md

cp .claude/templates/architecture/_component-patterns.md \
   .claude/your-stack/architecture/component-patterns.md
```

**Common files:**
- `file-structure.md` - Your directory organization
- `component-patterns.md` - Your component design patterns

---

### 4. `documentation-standards/` (Optional)

**What it is:** How you want code documented in your project

**How to customize:**
Create markdown files explaining:
- Code comment requirements
- Component documentation format
- API documentation standards

---

## Quick Setup

### Option 1: Use Helper Scripts (Recommended)

```bash
# Initialize with AI assistance
./scripts/init-stack.sh

# This will:
# - Ask about your stack
# - Copy relevant templates
# - Customize stack-config.yaml
# - Set up your-stack/ directory
```

### Option 2: Manual Setup

```bash
# 1. Edit stack config
nano .claude/your-stack/stack-config.yaml

# 2. Copy templates you need
cp .claude/templates/coding-standards/_react.md \
   .claude/your-stack/coding-standards/react-standards.md

# 3. Customize the copied files
```

---

## After Customization

Once you've customized `your-stack/`:

### Commit Everything

```bash
# This entire directory should be committed to YOUR project
git add .claude/
git commit -m "chore: configure Claude Development Framework for project"
```

### Start Using Commands

```bash
# Now AI commands will use YOUR standards
/start-task "Build a feature"
# → Uses YOUR stack config
# → Follows YOUR coding standards
# → Matches YOUR architecture patterns
```

---

## Directory Structure

After setup, your structure should look like:

```
.claude/your-stack/
├── README.md                       # This file
├── stack-config.yaml               # YOUR stack definition
│
├── coding-standards/               # YOUR coding patterns
│   ├── [framework]-standards.md   # React, Vue, Svelte, etc.
│   ├── [language]-standards.md    # TypeScript, JavaScript
│   ├── styling-standards.md       # CSS approach
│   └── testing-standards.md       # Test patterns
│
├── architecture/                   # YOUR architecture
│   ├── file-structure.md          # Directory organization
│   └── component-patterns.md      # Component design
│
└── documentation-standards/        # YOUR doc requirements (optional)
    ├── code-comments.md
    └── component-docs.md
```

---

## Template vs Your-Stack

### `.claude/templates/` (Don't Edit)
- Generic patterns for popular stacks
- Starting points to copy from
- Maintained by the framework
- **Copy from here, don't edit directly**

### `.claude/your-stack/` (Edit Freely)
- YOUR project's specific patterns
- Customized for YOUR team
- Committed to YOUR repository
- **This is where YOUR customizations live**

---

## Examples

See complete configurations in `docs/examples/`:
- [Astro + React Example](../../docs/examples/astro-react/)
- [Next.js Example](../../docs/examples/nextjs/)
- [Vue 3 Example](../../docs/examples/vue/)

---

## Need Help?

- **Documentation:** [docs/customization-guide.md](../../docs/customization-guide.md)
- **FAQ:** [docs/faq.md](../../docs/faq.md)
- **Issues:** [GitHub Issues](https://github.com/LuisLadino/claude-dev-framework/issues)

---

## Important Notes

### This Directory is for YOUR Project

Unlike the rest of `.claude/`, which is the framework itself, **this directory is for YOUR customizations**.

### Commit to Your Repo

After forking the framework and customizing `your-stack/`, commit everything to YOUR project repository. The AI assistant will read these files to understand YOUR project's standards.

### Update as You Evolve

Your standards can change! Update these files as your project evolves and the AI will adapt.

---

**Ready to customize? Edit `stack-config.yaml` and copy templates from `.claude/templates/`!**
