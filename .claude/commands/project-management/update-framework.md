# /update-framework

**Check for and apply updates from your framework source**

---

## Purpose

Check the framework repository (yours or a fork) for updates and selectively apply changes.

**Use when:** Monthly maintenance, new features available, bug fixes released.

---

## Framework Directory Structure

**This is the exact structure. Files MUST go in these locations:**

```
.claude/
├── CLAUDE.md                    # Core instructions (framework-managed)
├── framework-source.txt         # Source URL for updates
├── commands/                    # Slash commands (framework-managed)
│   ├── development/             # /start-task, /add-feature, /process-tasks
│   ├── project-management/      # /init-project, /sync-stack, /generate-project-specs, /update-framework
│   ├── specs/                   # /add-spec, /verify
│   └── utilities/               # /learn
├── skills/                      # Auto-routing skills (framework-managed)
│   ├── dev-workflow/
│   ├── project-sync/
│   ├── specs-sync/
│   ├── custom-commands/
│   └── contribute-to-opensource/
└── specs/                  # Project-specific (user-managed, DO NOT overwrite)
    ├── stack-config.yaml
    ├── README.md
    ├── coding/
    ├── architecture/
    ├── documentation/
    ├── design/
    └── config/                  # version-control.md, deployment.md, environment.md, testing.md
```

**Framework-managed:** CLAUDE.md, commands/, skills/
**User-managed (never overwrite):** specs/, tasks/, any custom command directories

---

## How It Works

Fully interactive, LLM-driven command:

1. Detect framework source (from framework-source.txt)
2. Fetch latest version from GitHub
3. Compare with current installation
4. Show what's new or changed
5. User chooses what to update
6. Apply updates

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
- `specs/`
- `utilities/`

**Skip these directories** (project-specific, added by user):
- Any custom command directories the user has added

Use `Bash` to compare:

```bash
# Directories to update
update_dirs="development project-management specs utilities"

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

# Check skills
diff -qr .claude/skills "$temp_dir/.claude/skills" 2>/dev/null || echo "skills updated"
```

### Check Company/Team Specs

If the source repo includes `specs/` (company fork), compare coding, architecture, documentation, and stack-config.yaml using `diff -q`/`diff -qr`. Track new and changed files.

For individuals (no `specs/` in source), this step is skipped.

### Store Results

Create lists:
- `new_commands[]` - Commands that don't exist locally
- `updated_commands[]` - Commands that changed
- `updated_files[]` - Other files that changed
- `new_files[]` - New files/directories
- `updated_specs[]` - Specs files that changed (specs/)
- `new_specs[]` - New specs files (specs/)

---

## STEP 4: Present Findings

Show the user a report with:
- **Source URL and version comparison** (your version age vs latest)
- **New commands** available (from framework-managed directories only)
- **Updated files** (CLAUDE.md changes, updated commands, tools)
- **Company/team specs updates** (if source repo includes specs/)
- **Preserved customizations** (tasks, specs if local-only, custom command dirs)

Clarify which directories are framework-managed (commands/development/, commands/project-management/, commands/specs/, commands/utilities/, skills/) and which are never touched (specs/ user config). Note: if source repo includes specs/, those are managed specs that can be updated.

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
Show confirmation listing what will be updated and what will be preserved. Wait for "yes" before proceeding to STEP 6.

### If "Choose what to update"
Show selectable list of new commands, updated commands, core files, and company/team specs. Mark recommended items. Note that custom command directories are never listed. Wait for user selections, then proceed to STEP 6 with selected items.

### If "Cancel"
Inform user no changes were made. Clean up temp directory and exit.

---

## STEP 6: Apply Updates

**CRITICAL: Follow exact paths. Do not create new directories or put files in wrong locations.**

For each selected item, copy from `$temp_dir` to `.claude/` using these exact paths:

| Source | Destination |
|--------|-------------|
| `$temp_dir/.claude/CLAUDE.md` | `.claude/CLAUDE.md` |
| `$temp_dir/.claude/commands/development/*.md` | `.claude/commands/development/` |
| `$temp_dir/.claude/commands/project-management/*.md` | `.claude/commands/project-management/` |
| `$temp_dir/.claude/commands/specs/*.md` | `.claude/commands/specs/` |
| `$temp_dir/.claude/commands/utilities/*.md` | `.claude/commands/utilities/` |
| `$temp_dir/.claude/skills/*/SKILL.md` | `.claude/skills/[same-folder]/SKILL.md` |

**NEVER touch these directories:**
- `.claude/specs/` (user's project config)
- `.claude/tasks/` (user's task lists)
- Any directory not listed in the Framework Directory Structure above

**Example copy commands:**
```bash
# Update a command
cp "$temp_dir/.claude/commands/development/start-task.md" ".claude/commands/development/start-task.md"

# Update CLAUDE.md
cp "$temp_dir/.claude/CLAUDE.md" ".claude/CLAUDE.md"

# Update a skill
cp "$temp_dir/.claude/skills/dev-workflow/SKILL.md" ".claude/skills/dev-workflow/SKILL.md"
```

**Note:** Git handles rollback. If something goes wrong, use `git checkout .claude/` to revert.

---

## STEP 7: Verification

**Verify the update worked:**

```bash
# Check critical files exist
ls -la .claude/CLAUDE.md
ls -la .claude/commands/
ls -la .claude/specs/ 2>/dev/null || echo "No specs (OK if new install)"

# Show directory structure
tree .claude -L 2 2>/dev/null || find .claude -maxdepth 2 -type d
```

---

## STEP 8: Summary

Show a completion summary:
- List of new commands added, updated files, and updated specs
- What was preserved (tasks, local specs, custom command dirs)
- Brief description of notable new features
- Next steps: try new commands, review updated files
- Revert instructions: `git checkout .claude/` to undo changes
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

- `/sync-stack` - Detect stack, research docs, generate specs
- `/verify` - Check code against specs
