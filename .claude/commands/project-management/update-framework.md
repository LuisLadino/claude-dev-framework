# /update-framework

**Check for and apply updates from your framework source**

---

## Purpose

Check the framework repository (yours or a fork) for updates and selectively apply changes.

**Use when:** Monthly maintenance, new features available, bug fixes released.

---

## How It Works

Fully interactive, LLM-driven command:

1. Detect framework source (from git remote or config)
2. Fetch latest version from GitHub
3. Compare with current installation
4. Show what's new or changed
5. User chooses what to update
6. Apply updates with backups

---

## STEP 1: Detect Framework Source

**First, find where this framework came from:**

Use the `Bash` tool to read the framework source file:

```bash
cat .claude/framework-source.txt 2>/dev/null || echo "No source file"
```

**Parse the output:**

- **If `.claude/framework-source.txt` exists:** Use the URL from this file (this is the authoritative source)
- **If no source file:** Check git remote as fallback (`git remote -v`)
- **If neither:** Ask user for the source repo URL and save it to `.claude/framework-source.txt`

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

**Only check these command directories:**
- `development/`
- `project-management/`
- `standards/`
- `utilities/`

**Skip these directories** (project-specific, added by user):
- Any custom command directories the user has added

Use `Bash` to compare:

```bash
# Directories to update
update_dirs="development project-management standards utilities"

# List new commands (only in update directories)
for dir in $update_dirs; do
  if [ -d "$temp_dir/.claude/commands/$dir" ]; then
    echo "=== Checking $dir ==="
    comm -13 <(ls .claude/commands/$dir/*.md 2>/dev/null | xargs -n1 basename | sort) \
             <(ls "$temp_dir/.claude/commands/$dir/"*.md 2>/dev/null | xargs -n1 basename | sort)
  fi
done

# List modified commands (only in update directories)
for dir in $update_dirs; do
  if [ -d ".claude/commands/$dir" ] && [ -d "$temp_dir/.claude/commands/$dir" ]; then
    for file in .claude/commands/$dir/*.md; do
      filename=$(basename "$file")
      if [ -f "$temp_dir/.claude/commands/$dir/$filename" ]; then
        if ! diff -q "$file" "$temp_dir/.claude/commands/$dir/$filename" > /dev/null 2>&1; then
          echo "$dir/$filename"
        fi
      fi
    done
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

If the source repo includes `your-stack/` (company fork), compare coding-standards, architecture, documentation-standards, and stack-config.yaml using `diff -q`/`diff -qr`. Track new and changed files.

For individuals (no `your-stack/` in source), this step is skipped.

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

Show the user a report with:
- **Source URL and version comparison** (your version age vs latest)
- **New commands** available (from framework-managed directories only)
- **Updated files** (CLAUDE.md changes, updated commands, tools)
- **Company/team standards updates** (if source repo includes your-stack/)
- **Preserved customizations** (tasks, your-stack if local-only, skills, custom command dirs)

Clarify which directories are framework-managed (development/, project-management/, standards/, utilities/) and which are never touched. Note: if source repo includes your-stack/, those are managed standards that can be updated.

Ask user to choose:
1. **Show me details** - See specific changes in each file
2. **Update all** - Apply all updates and new features
3. **Choose what to update** - Pick specific items
4. **Cancel** - Don't update anything

**Wait for user response.**

---

## STEP 5: Handle User Choice

### If "Show me details"
For each changed file, use `Bash` to show diff. Present changes in readable format with what changed and impact assessment. After showing details, return to choice menu.

### If "Update all"
Show confirmation listing: backup location, what will be updated, what will be preserved. Wait for "yes" before proceeding to STEP 6.

### If "Choose what to update"
Show selectable list of new commands, updated commands, core files, and company/team standards. Mark recommended items. Note that custom command directories are never listed. Wait for user selections, then proceed to STEP 6 with selected items.

### If "Cancel"
Inform user no changes were made. Clean up temp directory and exit.

---

## STEP 6: Apply Updates

**Create backup first:**

```bash
timestamp=$(date +%Y%m%d-%H%M%S)
cp -r .claude ".claude-backup-$timestamp"
```

For each selected item, copy from `$temp_dir` to `.claude/`:

- **New commands:** Copy `.md` files from update directories (development, project-management, standards, utilities) only
- **Updated files:** Backup old version with timestamp suffix, then copy new version
- **Updated directories:** Backup directory, remove old, copy new
- **Company/team standards:** Copy updated/new standards from `$temp_dir/.claude/your-stack/` if source includes managed standards

### Preserve Custom Modifications

- If `your-stack/` came from source: it's company-managed, update it
- If `your-stack/` is local only (not in source): restore from backup after update
- Always restore `.claude/tasks/` from backup (always local)

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

Show a completion summary:
- List of new commands added, updated files, and updated standards
- What was preserved (tasks, local your-stack, skills, custom command dirs)
- Backup location
- Brief description of notable new features
- Next steps: try new commands, review updated files
- Revert instructions: `rm -rf .claude && cp -r .claude-backup-[timestamp] .claude`
- Reminder to run again in 30 days

---

## STEP 9: Cleanup

```bash
# Remove temp download directory
rm -rf "$temp_dir"
```

---

## Edge Cases

- **No updates available:** Inform user they're up to date. Show source URL, last checked time, installed counts. Suggest checking again in 30 days.
- **Cannot reach source:** Show error with possible causes (no internet, repo moved/deleted, GitHub down, private repo). Suggest solutions including updating remote URL. Note current framework still works.
- **Download fails:** Show error (timeout, corruption, disk space). Suggest retry. Note framework is unchanged.
- **Framework source unknown:** Ask user for GitHub repo URL. Store in `.claude/framework-source.txt` for future updates. Then proceed with provided URL.

---

## Configuration

The framework source URL is stored in `.claude/framework-source.txt`. This file is the authoritative source for updates and should always be checked first.

**For forked frameworks:** Updates come from the URL in `framework-source.txt`. If you fork the framework, update this file to point to your fork.

---

## Related Commands

- `/research-stack` - Generate new standards for a different stack
- `/analyze-standards` - Discover patterns from existing code or docs
- `/verify` - Verify framework installation
