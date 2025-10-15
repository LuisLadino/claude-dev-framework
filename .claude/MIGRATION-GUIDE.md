# Migration Guide - For Claude

**Purpose**: This file helps Claude Code assist users in organizing their existing `.claude/` files into the framework structure after a merge installation.

**When you see this file**: The user just installed the framework over an existing `.claude/` directory. Help them organize their files.

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

### Step 3: Handle Custom Instructions

If the user has an existing `CLAUDE.md` or similar:

**Option A: Append to framework CLAUDE.md**
```markdown
# Add separator at end of framework CLAUDE.md
---

# Project-Specific Instructions

[User's custom content here]
```

**Option B: Create separate file**
- Move user's instructions to `CLAUDE-PROJECT.md`
- Reference it from main `CLAUDE.md`

**Ask user which they prefer.**

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

### Custom Instructions

Your existing instructions in:
- `.claude/old-instructions.md` (150 lines)

**Recommendation**: Append to framework `CLAUDE.md` or create `CLAUDE-PROJECT.md`?

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

**Handle instructions merge:**
```bash
# If appending to CLAUDE.md
echo "\n---\n\n# Project-Specific Instructions\n" >> .claude/CLAUDE.md
cat .claude/old-instructions.md >> .claude/CLAUDE.md
```

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
