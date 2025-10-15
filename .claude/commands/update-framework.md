# /update-framework

**Update the Claude Dev Framework while preserving your customizations**

---

## Purpose

Update the framework to the latest version safely, preserving all your custom standards and configurations.

**Use when:**
- Want latest framework features and bug fixes
- New commands or workflows are available
- Framework improvements released
- Monthly maintenance check

**Time:** 2-3 minutes

---

## How It Works

The update script:
1. Downloads latest framework from GitHub
2. Backs up current framework files
3. Updates framework files (commands, workflows, tools, config)
4. Preserves ALL your customizations (your-stack/, PROJECT-INSTRUCTIONS.md, tasks/)
5. Smart CLAUDE.md handling (only updates if not customized)

**What gets updated:**
- `.claude/commands/` - Framework commands
- `.claude/workflows/` - Workflows
- `.claude/tools/` - Tool documentation
- `.claude/config/` - Framework operational configs
- `scripts/` - Helper scripts
- `.claude/CLAUDE.md` - Only if not customized

**What's preserved:**
- `.claude/your-stack/` - Your custom standards
- `.claude/PROJECT-INSTRUCTIONS.md` - Your custom instructions
- `.claude/CLAUDE-OLD.md` - Your old instructions
- `.claude/tasks/` - Your PRDs and task lists
- All user customizations

---

## Execution

When user runs `/update-framework`:

**DO NOT analyze their setup or give explanations. Just execute these commands:**

### Step 1: Download and run the update

```bash
# Download latest update script and run it
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/update-framework.sh | bash
```

That's it. The script handles everything:
- Downloads latest framework
- Creates backup automatically
- Updates framework files
- Preserves all user customizations
- Shows summary when complete

### Step 2: After script completes

If the script ran successfully, tell the user:

```
✅ Framework updated!

The update script has:
• Downloaded latest framework files
• Backed up your current framework
• Updated commands, workflows, tools, and config
• Preserved all your customizations in your-stack/

Backup location shown in script output above.

Next: Continue working - all your customizations are preserved.
```

**That's all. Don't overthink it. Just run the curl command and let the script do its job.**

---

## If Update Script Fails

If the update script is not found or fails:

**Fallback method - direct update:**

```bash
# Download and run update directly
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/update-framework.sh | bash
```

This always uses the latest update script from GitHub, ensuring any bug fixes are included.

---

## Troubleshooting

### "Script not found"

If `scripts/update-framework.sh` doesn't exist:

```bash
mkdir -p scripts
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/update-framework.sh -o scripts/update-framework.sh
chmod +x scripts/update-framework.sh
./scripts/update-framework.sh
```

### "Permission denied"

Make script executable:

```bash
chmod +x scripts/update-framework.sh
./scripts/update-framework.sh
```

### "Download failed"

Check internet connection and GitHub accessibility. If GitHub is down, wait and try again later.

### "My CLAUDE.md was customized and wasn't updated"

This is intentional! If you have custom instructions:
- Framework skips updating CLAUDE.md to preserve your customizations
- You can manually merge changes if needed
- Or move your customizations to PROJECT-INSTRUCTIONS.md and update will work

---

## Best Practices

**DO:**
- ✅ Check for updates monthly
- ✅ Review what changed after updating
- ✅ Test that everything works
- ✅ Keep git history clean (commit before updating)

**DON'T:**
- ❌ Update during critical development
- ❌ Skip reading the update summary
- ❌ Delete the backup immediately

---

## Update Schedule

**Recommended:**
- Check monthly: 1st of each month
- Update quarterly: Q1, Q2, Q3, Q4
- Immediate updates for critical bug fixes

**When NOT to update:**
- Right before important deadlines
- During active feature development
- Without testing first

---

## Related

- `/start-task` - Use framework after updating
- `/research-stack` - Regenerate standards if needed
- Validation script: `./scripts/validate-setup.sh`

---

**Note:** The update script downloads the framework as a tarball, so it works in any project repo without git conflicts. Your project's git history is not affected.
