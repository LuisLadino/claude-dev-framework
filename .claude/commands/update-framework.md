# /update-framework

**Check for and apply updates from your framework source**

---

## Purpose

Claude Code checks the framework repository (yours or a fork) for updates and helps you selectively apply changes.

**Use when:**
- Monthly maintenance check
- New framework features are available
- Bug fixes are released
- You see update notifications

**Time:** 5-15 minutes

---

## How It Works (LLM-Driven)

This is a **fully interactive command** - no bash scripts, Claude Code handles everything:

1. **Detects your framework source** (from git remote or config)
2. **Fetches latest version** from GitHub
3. **Compares with your current installation**
4. **Shows you what's new or changed**
5. **You choose what to update**
6. **Claude applies updates with backups**

---

## STEP 1: Detect Framework Source

**First, find where this framework came from:**

Use the `Bash` tool to check git remote:

```bash
cd .claude
git remote -v 2>/dev/null || echo "No git remote"
```

**Parse the output:**

- **If git remote exists:** Extract repo URL (e.g., `https://github.com/LuisLadino/claude-dev-framework.git`)
- **If no git remote:** Check if `.claude/framework-source.txt` exists
- **If neither:** Ask user for the source repo URL

**Store the framework source URL for this session.**

---

## STEP 2: Fetch Latest Framework

**Download the latest version from the source repository:**

Use `Bash` tool:

```bash
# Create temp directory
temp_dir=".claude-update-check-$(date +%s)"
mkdir -p "$temp_dir"

# Download and extract latest framework
curl -fsSL https://github.com/[USER]/[REPO]/archive/refs/heads/main.tar.gz | tar -xz -C "$temp_dir" --strip-components=1
```

**Replace `[USER]/[REPO]` with the actual source repo.**

**Verify download:**
```bash
ls -la "$temp_dir/.claude/"
```

If successful, you should see framework structure.

---

## STEP 3: Compare Versions

**Compare current installation with latest version:**

### Check Commands

Use `Bash` to compare:

```bash
# List new commands
comm -13 <(ls .claude/commands/*.md 2>/dev/null | xargs -n1 basename | sort) \
         <(ls "$temp_dir/.claude/commands/"*.md 2>/dev/null | xargs -n1 basename | sort)

# List modified commands
for file in .claude/commands/*.md; do
  filename=$(basename "$file")
  if [ -f "$temp_dir/.claude/commands/$filename" ]; then
    if ! diff -q "$file" "$temp_dir/.claude/commands/$filename" > /dev/null 2>&1; then
      echo "$filename"
    fi
  fi
done
```

### Check Core Files

Compare important files:

```bash
# Check if CLAUDE.md changed
diff -q .claude/CLAUDE.md "$temp_dir/.claude/CLAUDE.md" || echo "CLAUDE.md updated"

# Check workflows
diff -qr .claude/workflows "$temp_dir/.claude/workflows" 2>/dev/null || echo "workflows updated"

# Check tools
diff -qr .claude/tools "$temp_dir/.claude/tools" 2>/dev/null || echo "tools updated"

# Check config templates
diff -qr .claude/config "$temp_dir/.claude/config" 2>/dev/null || echo "config updated"
```

### Check Company/Team Standards (Your Stack)

**Important:** If the source repo includes managed `your-stack/` (company fork), check for updates:

```bash
# Check if source has your-stack directory
if [ -d "$temp_dir/.claude/your-stack" ]; then
  echo "Source includes managed standards in your-stack/"

  # Compare standards files
  if [ -d ".claude/your-stack/coding-standards" ]; then
    for file in "$temp_dir/.claude/your-stack/coding-standards/"*.md; do
      filename=$(basename "$file")
      if [ -f ".claude/your-stack/coding-standards/$filename" ]; then
        if ! diff -q ".claude/your-stack/coding-standards/$filename" "$file" > /dev/null 2>&1; then
          echo "Standards updated: $filename"
        fi
      else
        echo "New standard: $filename"
      fi
    done
  fi

  # Check architecture patterns
  if [ -d "$temp_dir/.claude/your-stack/architecture" ]; then
    diff -qr .claude/your-stack/architecture "$temp_dir/.claude/your-stack/architecture" 2>/dev/null || echo "architecture updated"
  fi

  # Check documentation standards
  if [ -d "$temp_dir/.claude/your-stack/documentation-standards" ]; then
    diff -qr .claude/your-stack/documentation-standards "$temp_dir/.claude/your-stack/documentation-standards" 2>/dev/null || echo "documentation standards updated"
  fi

  # Check stack config
  if [ -f "$temp_dir/.claude/your-stack/stack-config.yaml" ]; then
    diff -q .claude/your-stack/stack-config.yaml "$temp_dir/.claude/your-stack/stack-config.yaml" || echo "stack-config.yaml updated"
  fi
fi
```

**Why this matters:**

- **For companies:** You maintain team standards in your fork's `your-stack/`
- **For individuals:** Your fork doesn't include `your-stack/`, so this is skipped
- **Updates detected:** New standards, changed rules, updated conventions

### Store Results

Create lists:
- `new_commands[]` - Commands that don't exist locally
- `updated_commands[]` - Commands that changed
- `updated_files[]` - Other files that changed
- `new_files[]` - New files/directories
- `updated_standards[]` - Standards files that changed (your-stack/)
- `new_standards[]` - New standards files (your-stack/)

---

## STEP 4: Present Findings

**Show user what's available:**

```markdown
🔍 **UPDATE CHECK COMPLETE**

**Source:** https://github.com/[USER]/[REPO]
**Your version:** [Your .claude directory, approximate age based on file dates]
**Latest version:** [Latest commit date from GitHub]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📦 New Features Available (3)

**New Commands:**
• /create-prd - Create Product Requirement Documents
• /generate-tasks - Break down PRDs into task lists
• /process-tasks - Execute task lists step-by-step

**What they do:**
These commands add a workflow for building complex features systematically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔄 Updates Available (5)

**CLAUDE.md:**
- Added Task-to-Standards Mapping table
- Made operational standards explicit
- Enhanced commit workflow

**Commands:**
• /start-task - Now reads version-control.md before commits
• /verify - Enhanced framework-specific checks
• /standards - Added universal violation patterns

**Tools:**
• mcp-integration.md - Updated with latest MCP servers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📚 Company/Team Standards Updates (3)

**Updated Standards:**
• react-standards.md - Added new hooks patterns
• typescript-standards.md - Stricter error handling rules

**New Standards:**
• security-standards.md - New security requirements

**What they do:**
Your company/team has updated coding standards. These affect
how code should be written going forward.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Your Customizations (Preserved)

These will NOT be touched:
✓ .claude/tasks/ (your PRDs and task lists)
✓ PROJECT-INSTRUCTIONS.md (if exists)

Note: If source repo includes your-stack/, those are MANAGED
standards from your company. They can be updated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What would you like to do?**

1. **Show me details** - See specific changes in each file
2. **Update all** - Apply all updates and new features
3. **Choose what to update** - Pick specific items
4. **Cancel** - Don't update anything

Your choice (1-4):
```

**⏸️ WAIT FOR USER RESPONSE**

---

## STEP 5: Handle User Choice

### If "1. Show me details"

For each changed file, use `Bash` to show diff:

```bash
diff -u .claude/CLAUDE.md "$temp_dir/.claude/CLAUDE.md" | head -50
```

Show in readable format:

```markdown
### CLAUDE.md Changes

**Added Section: Task-to-Standards Mapping (Line 102)**

```diff
+## Task-to-Standards Mapping
+
+**This framework's power comes from reading the right standards for each action.**
+
+| Action You're Taking | Standards Files to Read |
+|---------------------|-------------------------|
+| **Writing code** | framework-standards.md, language-standards.md |
+| **Committing changes** | version-control.md |
```

**Why this matters:**
Makes it explicit for LLM to read correct standards file before each action.

**Impact:**
Low - Clarifies existing behavior, doesn't change workflow.

---

[Repeat for each changed file]

**After showing details, return to choice menu.**

### If "2. Update all"

**Show confirmation:**

```markdown
⚠️  **CONFIRM UPDATE ALL**

This will:
✓ Backup your current .claude/ to .claude-backup-[timestamp]/
✓ Update all framework files
✓ Preserve .claude/your-stack/
✓ Preserve .claude/tasks/
✓ Add 3 new commands
✓ Update 5 existing files

Ready to proceed? (yes/no):
```

**⏸️ WAIT FOR "yes"**

If yes, proceed to STEP 6 with `update_all=true`

### If "3. Choose what to update"

**Show interactive menu:**

```markdown
Select items to update (space to toggle, enter to confirm):

**New Commands:**
[ ] /create-prd
[ ] /generate-tasks
[ ] /process-tasks

**Updated Commands:**
[ ] /start-task
[ ] /verify
[ ] /standards

**Core Files:**
[x] CLAUDE.md (recommended)
[ ] workflows/
[ ] tools/
[ ] config/

**Company/Team Standards:**
[x] react-standards.md (recommended)
[x] typescript-standards.md (recommended)
[ ] security-standards.md (new)

**Select/deselect with:** [command name]
**When done, type:** done
```

Wait for user to select items, then proceed to STEP 6 with selected items.

### If "4. Cancel"

```markdown
Update cancelled. No changes made.

To update later, run /update-framework again.
```

Clean up temp directory and exit.

---

## STEP 6: Apply Updates

**Create backup first:**

```bash
timestamp=$(date +%Y%m%d-%H%M%S)
cp -r .claude ".claude-backup-$timestamp"
```

**For each selected item, apply the update:**

### For New Commands

```bash
cp "$temp_dir/.claude/commands/[command].md" .claude/commands/
```

Show:
```markdown
✓ Added: /create-prd
```

### For Updated Files

Use `Edit` tool or `Bash`:

```bash
# Backup old version
cp .claude/CLAUDE.md ".claude/CLAUDE.md.backup-$timestamp"

# Copy new version
cp "$temp_dir/.claude/CLAUDE.md" .claude/CLAUDE.md
```

Show:
```markdown
✓ Updated: CLAUDE.md
  Backup: .claude/CLAUDE.md.backup-[timestamp]
```

### For Directories

```bash
# Backup
cp -r .claude/workflows ".claude/workflows.backup-$timestamp"

# Update
rm -rf .claude/workflows
cp -r "$temp_dir/.claude/workflows" .claude/workflows
```

### For Company/Team Standards

If source includes managed `your-stack/` and user selected standards to update:

```bash
# Update standards files
cp "$temp_dir/.claude/your-stack/coding-standards/react-standards.md" .claude/your-stack/coding-standards/
cp "$temp_dir/.claude/your-stack/coding-standards/typescript-standards.md" .claude/your-stack/coding-standards/

# Copy new standards
cp "$temp_dir/.claude/your-stack/coding-standards/security-standards.md" .claude/your-stack/coding-standards/
```

Show:
```markdown
✓ Updated: react-standards.md (company managed)
✓ Updated: typescript-standards.md (company managed)
✓ Added: security-standards.md (new company standard)
```

### Preserve Custom Modifications

**Important distinction:**

- **If your-stack/ came from source:** It's managed by company, update it
- **If your-stack/ is local only:** It's your customization, preserve it

```bash
# Only restore if your-stack wasn't in source
if [ ! -d "$temp_dir/.claude/your-stack" ]; then
  # Restore local customizations
  if [ -d ".claude-backup-$timestamp/your-stack" ]; then
    cp -r ".claude-backup-$timestamp/your-stack" .claude/
  fi
fi

# Always restore tasks (always local)
if [ -d ".claude-backup-$timestamp/tasks" ]; then
  cp -r ".claude-backup-$timestamp/tasks" .claude/
fi
```

---

## STEP 7: Verification

**Verify the update worked:**

```bash
# Check critical files exist
ls -la .claude/CLAUDE.md
ls -la .claude/commands/
ls -la .claude/your-stack/ 2>/dev/null || echo "No your-stack (OK if new install)"

# Show directory structure
tree .claude -L 2 2>/dev/null || find .claude -maxdepth 2 -type d
```

---

## STEP 8: Summary

```markdown
✅ **UPDATE COMPLETE!**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What Was Updated:**

✓ New Commands (3):
  - /create-prd
  - /generate-tasks
  - /process-tasks

✓ Updated Files (5):
  - CLAUDE.md (Task-to-Standards Mapping added)
  - commands/start-task.md (Enhanced commit workflow)
  - commands/verify.md (Framework-specific checks)
  - commands/standards.md (Universal patterns)
  - tools/mcp-integration.md (Latest MCP servers)

✓ Company/Team Standards (3):
  - react-standards.md (updated - new hooks patterns)
  - typescript-standards.md (updated - stricter error handling)
  - security-standards.md (new - security requirements)

**Preserved:**
✓ .claude/tasks/ (all your PRDs and tasks)
✓ PROJECT-INSTRUCTIONS.md (if exists)

**Backup Location:**
.claude-backup-[timestamp]/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What's New:**

🎯 **Task-to-Standards Mapping**
   Clear table showing which standards to read for each action.
   Makes LLM behavior more predictable.

🔧 **Enhanced Commit Workflow**
   /start-task now explicitly reads version-control.md before commits.
   No more missing commit standards.

📋 **PRD-to-Tasks Workflow**
   New commands for systematic feature development.
   /create-prd → /generate-tasks → /process-tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**

1. Try new commands: /create-prd, /generate-tasks, /process-tasks
2. Review updated files to see what changed
3. Continue using framework as normal

**To revert (if needed):**
```bash
rm -rf .claude
cp -r .claude-backup-[timestamp] .claude
```

**Framework source:** https://github.com/[USER]/[REPO]
**Next update:** Run /update-framework again in 30 days
```

---

## STEP 9: Cleanup

```bash
# Remove temp download directory
rm -rf "$temp_dir"
```

---

## Edge Cases

### If No Updates Available

```markdown
✅ **YOU'RE UP TO DATE!**

Your framework is current with the source repository.

**Source:** https://github.com/[USER]/[REPO]
**Last checked:** [timestamp]

**What's installed:**
- Commands: [count]
- Workflows: [count]
- Tools: [count]

No updates needed. Check again in 30 days or when you see announcements.
```

### If Cannot Reach Source

```markdown
❌ **CANNOT REACH FRAMEWORK SOURCE**

Unable to fetch updates from:
https://github.com/[USER]/[REPO]

**Possible causes:**
- No internet connection
- Repository moved or deleted
- GitHub is down
- Repository is private (need authentication)

**Solutions:**
- Check your internet connection
- Verify the repository URL is correct
- Try again later
- If repo moved, update your remote:
  ```bash
  cd .claude
  git remote set-url origin [new-url]
  ```

**Your current framework continues to work normally.**
```

### If Download Fails

```markdown
❌ **DOWNLOAD FAILED**

Started downloading but failed during extraction.

**This could be:**
- Network timeout
- Corrupted download
- Insufficient disk space

**To retry:**
Run /update-framework again

**Your framework is unchanged and working.**
```

### If Framework Source Unknown

```markdown
⚠️  **FRAMEWORK SOURCE UNKNOWN**

I couldn't determine where this framework came from.

**Please provide the GitHub repository URL:**

Example: https://github.com/LuisLadino/claude-dev-framework

Or if you forked it: https://github.com/your-username/your-fork

[Wait for user to provide URL]

**I'll remember this for future updates by storing in:**
.claude/framework-source.txt
```

Then proceed with provided URL.

---

## Configuration

### Storing Framework Source

After first update, create `.claude/framework-source.txt`:

```
https://github.com/[USER]/[REPO]
```

This way future updates don't need to detect source.

### For Forked Frameworks

If user forked the framework:

```markdown
📌 **USING FORKED FRAMEWORK**

**Your fork:** https://github.com/your-user/your-fork
**Original:** https://github.com/LuisLadino/claude-dev-framework

You'll get updates from YOUR fork.

**To also check original for updates:**
I can check both repositories and show you:
- Updates in your fork
- Updates in original (that you might want to merge)

Check both? (yes/no):
```

---

## Best Practices

**For Users:**

✅ **Review changes** before applying (use "Show me details")
✅ **Update regularly** (monthly is good)
✅ **Read what's new** in the summary
✅ **Test after updating** (try a /start-task)
✅ **Keep backups** (.claude-backup-* directories)

**For Framework Maintainers:**

✅ **Document changes** in commit messages
✅ **Keep CLAUDE.md backward compatible** when possible
✅ **Test updates** on sample projects before releasing
✅ **Announce major changes** to users

---

## Related Commands

- `/research-stack` - Generate new standards for a different stack
- `/import-standards` - Import company standards
- `/verify` - Verify framework installation

---

**This command is 100% LLM-driven. No bash scripts required. Claude Code handles everything interactively.**
