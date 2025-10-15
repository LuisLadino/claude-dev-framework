# Migration Guide - For Claude

**Purpose**: This file helps Claude Code assist users in organizing their existing `.claude/` files into the framework structure after a merge installation.

**When you see this file**: The user just installed the framework over an existing `.claude/` directory. Help them organize their files.

---

## ⚠️ CRITICAL: Framework CLAUDE.md is Required

**READ THIS FIRST BEFORE DOING ANYTHING:**

The framework `CLAUDE.md` file MUST remain as the primary instructions file. It is NOT negotiable.

**Why**: It contains the entire framework engine:
- Standards Check workflow (mandatory before any coding)
- Quality enforcement mechanisms
- Stack configuration system
- All slash commands and workflows integration

**What this means:**
- ✅ Framework CLAUDE.md stays as `.claude/CLAUDE.md`
- ✅ User's old instructions get renamed to `PROJECT-INSTRUCTIONS.md`
- ✅ Add reference to user's instructions at end of framework file
- ❌ NEVER replace or delete framework CLAUDE.md
- ❌ NEVER merge user's old file into framework file

**Got it? Good. Now proceed with migration steps below.**

---

## Your Role

When the user asks for help organizing their `.claude/` directory, follow these steps:

### Step 1: Analyze Current Structure

Read the `.claude/` directory structure:

```bash
# Use Glob or Read tools to examine structure
```

**Look for:**
- Loose files in root (standards, instructions, configs)
- Files in wrong locations
- Duplicate or outdated files
- Custom user content that should be preserved

### Step 2: Categorize Files

**Framework Files** (already in correct locations):
- `CLAUDE.md` - Framework instructions
- `commands/` - Slash commands
- `workflows/` - Multi-step workflows
- `tools/` - Tool configurations
- `config/` - Environment configs
- `your-stack/` - Custom standards
- `tasks/` - PRDs and task lists

**User Files** (need to be organized):
- Standards files (`*-standards.md`, `*-guide.md`, `*-patterns.md`)
  → Move to `your-stack/coding-standards/`

- Architecture docs (`architecture.md`, `file-structure.md`)
  → Move to `your-stack/architecture/`

- Documentation standards
  → Move to `your-stack/documentation-standards/`

- Custom instructions (existing `CLAUDE.md`, `README.md`)
  → Needs special handling (see Step 3)

- Environment/deployment configs
  → Move to `config/`

### Step 3: Handle Custom Instructions (CRITICAL)

⚠️ **CRITICAL REQUIREMENT**: The framework `CLAUDE.md` MUST be used. It's not optional.

**Why**: The framework `CLAUDE.md` contains the engine that makes everything work:
- Standards Check workflow (mandatory before coding)
- Quality checklist enforcement
- Stack configuration loading
- All framework commands and workflows
- Integration with your-stack/ directory

**If the user has an existing CLAUDE.md or instructions:**

**You MUST:**
1. **Keep the framework CLAUDE.md as the primary file** (already in `.claude/CLAUDE.md`)
2. **Rename user's old instructions** to something else
3. **Preserve their content** in a separate file

**DO NOT:**
- ❌ Delete the framework CLAUDE.md
- ❌ Replace the framework CLAUDE.md with user's old file
- ❌ Try to merge the two files together
- ❌ Skip the framework CLAUDE.md

**Correct approach:**

**Note**: The installer automatically backs up user's CLAUDE.md to `CLAUDE-OLD.md` in merge mode.

If user has existing instructions (like `main-instructions.md`, `CLAUDE-OLD.md`, etc.):

```bash
# Rename their old instructions to PROJECT-INSTRUCTIONS.md
mv .claude/main-instructions.md .claude/PROJECT-INSTRUCTIONS.md
# or if they had CLAUDE-OLD.md from installer backup:
mv .claude/CLAUDE-OLD.md .claude/PROJECT-INSTRUCTIONS.md
# or rename any other instruction files:
mv .claude/[their-instructions-file] .claude/PROJECT-INSTRUCTIONS.md

# The framework CLAUDE.md is already installed correctly
```

**Then add a reference at the END of framework CLAUDE.md:**
```markdown
---

# Project-Specific Instructions

See [PROJECT-INSTRUCTIONS.md](PROJECT-INSTRUCTIONS.md) for additional project-specific guidance.
```

**Explain to user:**
"The framework CLAUDE.md is required for the framework to function. I've preserved your existing instructions in PROJECT-INSTRUCTIONS.md and added a reference to it in the framework file. You can review both files and manually integrate any project-specific requirements you want Claude to follow."

### Step 4: Show Migration Plan

Present a clear plan:

```markdown
## 📋 File Organization Plan

### Files to Move

**Standards → `your-stack/coding-standards/`:**
- `react-patterns.md`
- `typescript-guide.md`

**Architecture → `your-stack/architecture/`:**
- `file-structure.md`

**Config → `config/`:**
- `environment-setup.md`

### ⚠️ Custom Instructions (Framework CLAUDE.md MUST Stay)

Your existing instructions in:
- `.claude/main-instructions.md` (150 lines)

**Action Required:**
- Rename to `PROJECT-INSTRUCTIONS.md`
- Add reference at end of framework `CLAUDE.md`
- Framework CLAUDE.md remains as primary (REQUIRED)

### Files to Archive

Old/duplicate files:
- `.claude/backup-old/` → Move to project root as `.claude-archive/`

---

**Proceed with this plan? (yes/no/adjust)**
```

### Step 5: Execute Migration

**Only after user approval:**

```bash
# Example moves
mv .claude/react-patterns.md .claude/your-stack/coding-standards/
mv .claude/file-structure.md .claude/your-stack/architecture/
```

**Handle user's old instructions:**
```bash
# Rename user's old instructions
mv .claude/main-instructions.md .claude/PROJECT-INSTRUCTIONS.md

# Add reference at END of framework CLAUDE.md
echo "" >> .claude/CLAUDE.md
echo "---" >> .claude/CLAUDE.md
echo "" >> .claude/CLAUDE.md
echo "# Project-Specific Instructions" >> .claude/CLAUDE.md
echo "" >> .claude/CLAUDE.md
echo "See [PROJECT-INSTRUCTIONS.md](PROJECT-INSTRUCTIONS.md) for additional project-specific guidance." >> .claude/CLAUDE.md
```

**IMPORTANT**: Do NOT append the full content. Just add a reference link.

**Archive old files:**
```bash
mkdir -p .claude-archive
mv .claude/backup-old .claude-archive/
```

### Step 6: Verify Structure

After migration, verify:

```bash
# Run validation
./scripts/validate-setup.sh
```

**Check:**
- All framework directories present
- User's standards in `your-stack/`
- Custom instructions preserved
- No loose files in root

### Step 7: Clean Up

```bash
# Remove this migration guide (no longer needed)
rm .claude/MIGRATION-GUIDE.md
```

---

## Important Principles

### Always Safe
- **Never delete user files** without explicit permission
- **Show plan before executing** any file moves
- **Create backups** if destructive operations needed
- **Make everything reversible**

### User Control
- **Ask for preferences** (append vs separate file)
- **Show what you're doing** at each step
- **Wait for approval** before executing
- **Let them adjust the plan**

### Be Helpful
- **Explain why** files should go in certain locations
- **Suggest best practices** but don't force them
- **Handle edge cases** gracefully
- **Verify success** after migration

---

## Example Conversation

**User**: "I just installed the framework, help me organize my files"

**Claude**:
"I see you have an existing `.claude/` directory. Let me analyze the structure and help you organize it into the framework layout.

Reading your current structure...

I found:
- 12 loose files in `.claude/` root
- Existing custom instructions in `CLAUDE-old.md`
- Several standards files not in proper directories

Let me create an organization plan for you..."

[Show plan, get approval, execute, verify]

---

## This is a one-time migration

Once files are organized:
1. Delete this guide: `rm .claude/MIGRATION-GUIDE.md`
2. User continues with normal framework workflow
3. Future updates use `/update-framework` (preserves their files)

---

**Remember**: You're helping them transition from a messy setup to the clean framework structure. Be patient, clear, and safe.
