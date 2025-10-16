# Framework Self-Update Workflow

**Last Updated:** 2025-01-16

This workflow explains how to keep your Claude Development Framework up-to-date while preserving your customizations.

---

## Overview

The framework updates using the `/update-framework` slash command:

- **Claude Code handles everything** - fully interactive, no scripts
- **Your customizations stay untouched** - `.claude/your-stack/` preserved
- **Automatic backups** - created before every update
- **Selective updates** - choose what to apply
- **Full transparency** - see exactly what changes

---

## When to Update

### Check for Updates

**Recommended Schedule:**

- **Monthly**: Check for updates and review what's new
- **Quarterly**: Major feature updates
- **Immediately**: Critical fixes or security patches

**How to check:**

Simply run the update command:

```
/update-framework
```

Claude Code will fetch the latest version and show you what's available.

---

## Update Process

### Method 1: Using Claude Code (Recommended)

**In your Claude Code conversation:**

```
/update-framework
```

**Claude Code will:**

1. Detect your framework source (git remote or config)
2. Fetch latest version from repository
3. Compare with your current installation
4. Show you what's new or changed
5. Let you choose what to update
6. Create automatic backups
7. Apply selected updates
8. Verify everything works
9. Show summary

**Interactive workflow:**

```
🔍 UPDATE CHECK COMPLETE

Source: https://github.com/YourUser/your-repo
Your version: ~30 days old
Latest version: 2 days ago

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📦 New Features Available (3)

New Commands:
• /create-prd - Create Product Requirement Documents
• /generate-tasks - Break down PRDs into task lists
• /process-tasks - Execute task lists step-by-step

## 🔄 Updates Available (5)

CLAUDE.md:
- Added Task-to-Standards Mapping table
- Made operational standards explicit

Commands:
• /start-task - Now reads version-control.md before commits
• /verify - Enhanced framework-specific checks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Your Customizations (Preserved)

These will NOT be touched:
✓ .claude/your-stack/ (all your standards)
✓ .claude/tasks/ (your PRDs and task lists)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do?

1. Show me details - See specific changes
2. Update all - Apply everything
3. Choose what to update - Select items
4. Cancel - Don't update

Your choice (1-4):
```

**You choose what happens:**

- **Option 1**: See detailed diffs for each file
- **Option 2**: Update everything automatically
- **Option 3**: Pick specific commands/files to update
- **Option 4**: Cancel and update later

### Method 2: Manual Git Update (Advanced)

If you prefer manual control:

```bash
# 1. Check what's new
cd .claude
git fetch origin main
git log HEAD..origin/main --oneline

# 2. Backup your customizations
cp -r your-stack ../your-stack-backup-$(date +%Y%m%d)

# 3. Pull updates
git pull origin main

# 4. Restore your customizations if needed
cp -r ../your-stack-backup-* your-stack/
```

**Note:** The `/update-framework` command is easier and safer.

---

## What Gets Updated

### Framework Files (Updated)

These are replaced with latest versions:

```
.claude/
├── CLAUDE.md           # Core instructions
├── commands/           # All slash commands
├── workflows/          # Multi-step workflows
├── tools/              # Tool integrations
├── config/             # Template configs
└── templates/          # Standard templates
```

### Your Customizations (Preserved)

These are NEVER touched by updates:

```
.claude/
├── your-stack/               # ← PRESERVED
│   ├── stack-config.yaml
│   ├── coding-standards/
│   ├── architecture/
│   └── documentation-standards/
├── tasks/                    # ← PRESERVED
│   ├── PRDs/
│   └── task-lists/
└── PROJECT-INSTRUCTIONS.md   # ← PRESERVED (if exists)
```

### Scripts (Updated if present)

```
scripts/
├── install.sh          # Updated
├── init-stack.sh       # Updated
├── validate-setup.sh   # Updated
└── uninstall.sh        # Updated
```

---

## After Updating

### Verify the Update

**Claude Code shows verification automatically, but you can also check:**

```bash
# Check critical files exist
ls -la .claude/CLAUDE.md
ls -la .claude/commands/

# Check your customizations are intact
ls -la .claude/your-stack/

# Verify directory structure
tree .claude -L 2
```

### Test New Features

Try the new commands or features mentioned in the update summary:

```
/create-prd
/generate-tasks
/start-task
```

### Review What Changed

Look at the files that were updated:

```bash
# See your backup
ls -la .claude-backup-*/

# Compare if needed
diff .claude/CLAUDE.md .claude-backup-*/CLAUDE.md
```

---

## Rollback (If Needed)

If something doesn't work after updating:

### Using Backup

```bash
# Claude Code creates backups automatically
# Named: .claude-backup-YYYYMMDD-HHMMSS/

# To rollback:
rm -rf .claude
cp -r .claude-backup-[timestamp] .claude

# Example:
rm -rf .claude
cp -r .claude-backup-20250116-143022 .claude
```

### Using Git (if .claude is git repo)

```bash
cd .claude
git log --oneline  # Find the commit before update
git reset --hard [commit-hash]
```

---

## Troubleshooting

### "Cannot reach framework source"

**Problem:** Can't fetch updates from repository

**Solutions:**

1. Check internet connection
2. Verify repository URL:
   ```bash
   cd .claude
   git remote -v
   ```
3. Update remote if repo moved:
   ```bash
   git remote set-url origin [new-url]
   ```

### "Framework source unknown"

**Problem:** Can't determine where framework came from

**Solution:**

Claude Code will ask you for the repository URL. Provide:

```
https://github.com/YourUser/your-repo
```

It will save this for future updates.

### "Download failed"

**Problem:** Update download failed mid-way

**Solutions:**

1. Check disk space: `df -h`
2. Check internet connection
3. Try again: `/update-framework`

### "Your customizations were overwritten"

**Problem:** Lost files in your-stack/

**Solution:**

Your customizations should be preserved, but if not, use backup:

```bash
# Backups are at:
ls -la .claude-backup-*/

# Restore your-stack:
cp -r .claude-backup-[timestamp]/your-stack .claude/
```

---

## Best Practices

### Before Updating

✅ **Commit your work** - `git commit` any uncommitted changes
✅ **Review what's new** - Choose "Show me details" to see changes
✅ **Read the summary** - Understand what's being updated
✅ **Update during downtime** - Not in the middle of critical work

### During Update

✅ **Read the options** - Don't rush through choices
✅ **Use selective updates** - Pick what you need
✅ **Keep backups** - Don't delete .claude-backup-* directories immediately
✅ **Test after updating** - Try a /start-task to ensure it works

### After Updating

✅ **Review the summary** - See what changed
✅ **Test new features** - Try new commands
✅ **Update your team** - Share what's new
✅ **Keep backups for a week** - In case you need to rollback

---

## Update Frequency

### Personal Projects

- **Monthly check** - Run `/update-framework` once a month
- **Update when convenient** - No rush if everything works
- **Update for new features** - When you see something useful

### Team Projects

- **Coordinate updates** - Update together as a team
- **Test first** - Update on one project, test, then roll out
- **Document changes** - Share what's new with team
- **Scheduled updates** - Quarterly team update sessions

### Production Projects

- **Test in development first** - Never update directly in production
- **Review changes carefully** - Use "Show me details"
- **Schedule updates** - During maintenance windows
- **Keep backups longer** - Keep 2-3 backup versions

---

## Framework Version Tracking

The framework doesn't use semantic versioning yet. Instead:

**Check age of your installation:**

```bash
# See when you last updated
ls -lt .claude/commands/ | head -5

# Or check last commit
cd .claude
git log -1 --format="%ai - %s"
```

**Check latest version:**

```bash
# Run update command to see
/update-framework
# It shows: "Your version: ~30 days old" vs "Latest: 2 days ago"
```

---

## For Forked Frameworks

If you forked the framework:

### Checking Your Fork

```
/update-framework
```

Will check YOUR fork for updates.

### Checking Original + Your Fork

Claude Code can check both:

```
📌 USING FORKED FRAMEWORK

Your fork: https://github.com/your-user/your-fork
Original: https://github.com/LuisLadino/claude-dev-framework

You'll get updates from YOUR fork.

To also check original for updates:
I can check both repositories and show you:
- Updates in your fork
- Updates in original (that you might want to merge)

Check both? (yes/no):
```

This helps you:
- Stay updated with your customizations
- See what's new in the original
- Decide what to merge into your fork

---

## Related

- `/verify` - Verify framework installation
- `/research-stack` - Research and generate new standards
- `/import-standards` - Import company standards

---

**Updates are now 100% LLM-driven through Claude Code. No bash scripts needed.**
