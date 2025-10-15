# Framework Self-Update Workflow

**Last Updated:** 2025-01-09

This workflow explains how to keep your Claude Development Framework up-to-date while preserving your customizations.

---

## Overview

The framework is designed to update itself easily:

- **Framework files** get updated from the repository
- **Your customizations** stay untouched in `.claude/your-stack/`
- **Automatic backups** created before every update
- **Rollback support** if something goes wrong

---

## When to Update

### Check for Updates

**Recommended Schedule:**

- **Monthly**: Check for updates and review changelog
- **Quarterly**: Major version updates (new features)
- **Immediately**: Critical security fixes

**How to check:**

```bash
# Option 1: Manual check
git fetch origin main
git log HEAD..origin/main --oneline

# Option 2: GitHub releases
# Visit: https://github.com/LuisLadino/claude-dev-framework/releases

# Option 3: Update script (shows version)
./scripts/update-framework.sh
# Will show current vs latest version
```

---

## Update Process

### Step 1: Before Updating

#### Review What's Changed

```bash
# See what's new
git log HEAD..origin/main

# View specific changes
git diff HEAD..origin/main

# Or check CHANGELOG.md on GitHub
```

#### Check Current State

```bash
# Verify you have no uncommitted changes
git status

# Should show:
# "nothing to commit, working tree clean"

# If you have changes, commit them first:
git add .
git commit -m "chore: save work before framework update"
```

#### Backup Your Customizations

```bash
# Script creates automatic backup, but you can do manual backup too:
cp -r .claude/your-stack .claude/your-stack.backup-$(date +%Y%m%d)
```

---

### Step 2: Run Update

#### Using Update Script (Recommended)

```bash
./scripts/update-framework.sh
```

**The script will:**

1. Check your current version
2. Fetch latest version from GitHub
3. Show what will be updated
4. Create automatic backup
5. Update framework files
6. Preserve your customizations
7. Update version in your stack config
8. Show summary of changes

**Interactive prompts:**

```
Current version: 1.0.0
Latest version: 1.1.0

Continue with update? (y/n) [y]:
```

**What gets updated:**

- ✅ `.claude/commands/` - AI commands
- ✅ `.claude/workflows/` - Workflow guides
- ✅ `.claude/templates/` - Stack templates
- ✅ `.claude/tools/` - Tool integration docs
- ✅ `.claude/config/` - Generic operational standards
- ✅ `.claude/documentation-standards/` - Generic doc standards
- ✅ `scripts/` - Helper scripts
- ✅ `docs/` - Framework documentation

**What stays the same:**

- ✅ `.claude/your-stack/` - Your customizations
- ✅ Your project files
- ✅ Your git history

---

#### Manual Update (Advanced)

```bash
# 1. Backup
cp -r .claude/your-stack .claude-backup/

# 2. Fetch latest
git fetch origin main

# 3. Merge framework updates
git merge origin/main

# 4. Resolve any conflicts (rare)
# Your-stack is gitignored so shouldn't conflict

# 5. Update scripts permissions
chmod +x scripts/*.sh

# 6. Verify
./scripts/validate-setup.sh
```

---

### Step 3: After Updating

#### Review Changes

```bash
# See what was updated
git log --oneline -10

# Read the changelog
cat CHANGELOG.md

# Check for breaking changes
# Look for version bumps: 1.x → 2.0 means breaking changes
```

#### Test the Update

```bash
# 1. Validate setup
./scripts/validate-setup.sh

# Should show:
# ✓ All checks passing
# Health Score: 95%+

# 2. Test in Claude
# Open Claude and run a simple task:
# /start-task
# "Test update - create a simple component"

# 3. Verify standards load
# Ask Claude: "What coding standards should I follow?"
# Should load from .claude/your-stack/
```

#### Update Your Project (if needed)

Some updates might require changes to your project:

```bash
# Check if package.json needs updates
npm install

# Run any migration scripts (if provided)
# Migration instructions would be in CHANGELOG.md

# Update your stack config if new features available
nano .claude/your-stack/stack-config.yaml
```

---

### Step 4: Commit the Update

```bash
# Stage framework updates
git add .claude/commands/ .claude/workflows/ .claude/templates/
git add scripts/ docs/
git add CHANGELOG.md

# Commit with version
git commit -m "chore: update framework to v1.1.0

- Updated commands
- Updated workflows
- Updated templates
- See CHANGELOG.md for full details"

# Push to your repo
git push origin main
```

---

## Version Types

### Understanding Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH` (e.g., 2.3.1)

#### Patch Updates (1.0.0 → 1.0.1)

**What:** Bug fixes, typos, small improvements  
**Breaking:** No  
**Update:** Always safe to update immediately

**Example changes:**

- Fix typo in documentation
- Improve error message
- Fix script bug
- Update dependencies (non-breaking)

**Action:** Update immediately

---

#### Minor Updates (1.0.0 → 1.1.0)

**What:** New features, new templates, new commands  
**Breaking:** No (backward compatible)  
**Update:** Safe, but review changelog

**Example changes:**

- Add new framework template (Angular, Solid)
- Add new helper script
- Add new command feature
- Improve existing functionality
- Add new workflow guide

**Action:** Update when convenient, review changelog

---

#### Major Updates (1.0.0 → 2.0.0)

**What:** Breaking changes, major overhauls  
**Breaking:** Yes  
**Update:** Carefully, with testing

**Example changes:**

- Change command structure
- Change file organization
- Remove deprecated features
- Change how customizations work
- Require manual migration

**Action:** Read changelog carefully, test thoroughly, have rollback plan

---

## Update Strategies

### Conservative (Recommended for Production)

```bash
# Only update on patch releases
# Wait for minor releases to be proven
# Major releases: wait for X.Y.1 (first patch)

# Check version
./scripts/update-framework.sh
# See: 1.0.0 → 1.0.1 (patch)

# Update immediately
# Say "yes" to update

# See: 1.0.0 → 1.1.0 (minor)
# Review changelog first
# Update if changes are valuable

# See: 1.0.0 → 2.0.0 (major)
# Wait for 2.0.1
# Read migration guide
# Test in separate branch first
```

---

### Balanced (Most Users)

```bash
# Update monthly
# Review changelog
# Test after update

# Schedule:
# 1st of each month: Check for updates
./scripts/update-framework.sh

# If update available:
# - Read CHANGELOG.md
# - Backup important work
# - Run update
# - Test with validate-setup.sh
# - Use framework for a day
# - Commit if all good
```

---

### Aggressive (Early Adopters)

```bash
# Update immediately when available
# Help find bugs
# Provide feedback

# Daily check:
git fetch origin main
git log HEAD..origin/main

# If updates:
./scripts/update-framework.sh
# Always say yes
# Report issues on GitHub
```

---

## Rollback Procedure

### If Update Causes Issues

#### Option 1: Script Rollback (Easiest)

```bash
# Find backup directory
ls -la .claude/backups/

# You'll see:
# update_20250109_120000/

# Rollback to that backup
./scripts/update-framework.sh --rollback .claude/backups/update_20250109_120000

# This restores:
# - All framework files
# - Your customizations (from backup)
```

---

#### Option 2: Git Rollback

```bash
# See recent commits
git log --oneline -5

# Find the update commit
# Something like: "chore: update framework to v1.1.0"

# Revert that commit
git revert <commit-hash>

# Or reset to before update
git reset --hard HEAD~1

# Restore your customizations if needed
cp -r .claude-backup/your-stack .claude/
```

---

#### Option 3: Manual Restore

```bash
# Delete updated framework files
rm -rf .claude/commands .claude/workflows .claude/templates

# Restore from backup
cp -r .claude/backups/update_20250109_120000/commands .claude/
cp -r .claude/backups/update_20250109_120000/workflows .claude/
cp -r .claude/backups/update_20250109_120000/templates .claude/

# Verify
./scripts/validate-setup.sh
```

---

## Merge Conflicts (Rare)

### If Git Shows Conflicts

This is rare because `.claude/your-stack/` is gitignored, but if it happens:

```bash
# During update, you see:
CONFLICT (content): Merge conflict in .claude/commands/start-task.md

# 1. View conflict
cat .claude/commands/start-task.md

# Look for markers:
<<<<<<< HEAD
// Your version
=======
// New version
>>>>>>> origin/main

# 2. Decide what to keep
# Usually: keep new version (framework update)
# But: if you modified framework file, merge carefully

# 3. Edit file to resolve
nano .claude/commands/start-task.md

# 4. Remove conflict markers
# Keep the code you want

# 5. Stage resolved file
git add .claude/commands/start-task.md

# 6. Complete merge
git commit -m "chore: merge framework update v1.1.0"
```

**Prevention:**
Never modify files in:

- `.claude/commands/`
- `.claude/workflows/`
- `.claude/templates/`

Only customize files in:

- `.claude/your-stack/`

---

## Best Practices

### 1. Read Changelogs

Always read `CHANGELOG.md` before updating:

```bash
# On GitHub
https://github.com/LuisLadino/claude-dev-framework/blob/main/CHANGELOG.md

# Or after fetching
git fetch origin main
git show origin/main:CHANGELOG.md
```

Look for:

- **Breaking changes** (red flag for major versions)
- **New features** you might want to use
- **Bug fixes** that affect you
- **Migration instructions**

---

### 2. Update in Safe Environment

```bash
# Option A: Update in separate branch
git checkout -b update-framework
./scripts/update-framework.sh
# Test everything
git checkout main
git merge update-framework

# Option B: Update staging first
# If you have staging environment
# Update there, test, then update production
```

---

### 3. Test After Update

```bash
# 1. Validate setup
./scripts/validate-setup.sh

# 2. Test commands in Claude
/start-task
"Simple test task"

# 3. Run your project
npm run dev
npm run build

# 4. Use framework for real work
# If issues arise, rollback
```

---

### 4. Keep Backups

```bash
# Automatic backups in:
.claude/backups/

# Keep last 3 backups:
ls -t .claude/backups/ | tail -n +4 | xargs -I {} rm -rf .claude/backups/{}

# Or keep all (they're small)
```

---

### 5. Stay Informed

**Watch GitHub repository:**

- Star the repo
- Watch for releases
- Read release notes

**Check for updates regularly:**

- Add to monthly calendar
- Run update script monthly
- Review changelog quarterly

---

## Update Troubleshooting

### Update Script Fails

**Problem:** Script errors during update

**Solution:**

```bash
# Check internet connection
ping github.com

# Check git configuration
git config --list

# Try manual update
git fetch origin main
git merge origin/main

# Check script permissions
chmod +x scripts/update-framework.sh

# Run with verbose output
bash -x scripts/update-framework.sh
```

---

### Validation Fails After Update

**Problem:** `validate-setup.sh` shows errors after update

**Solution:**

```bash
# See specific errors
./scripts/validate-setup.sh

# Common issues:
# - Script permissions: chmod +x scripts/*.sh
# - Missing dependencies: npm install
# - Stale cache: rm -rf node_modules && npm install

# If persistent, rollback:
./scripts/update-framework.sh --rollback .claude/backups/update_YYYYMMDD_HHMMSS
```

---

### Commands Don't Work After Update

**Problem:** `/start-task` or other commands fail in Claude

**Solution:**

```bash
# 1. Check files exist
ls -la .claude/commands/

# 2. Validate structure
./scripts/validate-setup.sh

# 3. Test file reading in Claude
# Ask: "Can you read .claude/commands/start-task.md?"

# 4. Check your-stack is intact
ls -la .claude/your-stack/

# 5. If broken, rollback:
./scripts/update-framework.sh --rollback .claude/backups/update_YYYYMMDD_HHMMSS
```

---

### Lost Customizations

**Problem:** Your customizations seem missing after update

**Solution:**

```bash
# Your customizations are in backups
ls -la .claude/backups/update_*/your-stack/

# Restore them
cp -r .claude/backups/update_YYYYMMDD_HHMMSS/your-stack .claude/

# Verify
ls -la .claude/your-stack/

# Should see:
# - stack-config.yaml
# - coding-standards/
# - architecture/
# - config/
# - documentation-standards/
```

---

## Update Checklist

Before updating:

- [ ] Committed all local changes
- [ ] Read CHANGELOG.md for new version
- [ ] Understand what will change
- [ ] Know how to rollback if needed
- [ ] Have time to test after update

During update:

- [ ] Run `./scripts/update-framework.sh`
- [ ] Review changes before confirming
- [ ] Let script complete fully

After update:

- [ ] Run `./scripts/validate-setup.sh`
- [ ] Test commands in Claude
- [ ] Test your project builds
- [ ] Use framework for real work
- [ ] Commit update to your repo
- [ ] Delete old backups (optional)

---

## Getting Help

If update issues persist:

1. **Check documentation:**

   - `docs/faq.md`
   - `CHANGELOG.md`
   - GitHub Issues

2. **Rollback to known good state:**

   ```bash
   ./scripts/update-framework.sh --rollback [backup-dir]
   ```

3. **Report issue on GitHub:**

   - Include error messages
   - Include framework version
   - Include steps to reproduce

4. **Ask in Discussions:**
   - GitHub Discussions
   - Include context
   - Share what you've tried

---

## Framework Evolution

### Planned Updates

**v1.x (Current):**

- Stable, production-ready
- Bug fixes and minor improvements
- New templates for more frameworks

**v2.0 (Future):**

- Visual setup wizard
- Enhanced automation
- Team collaboration features
- Breaking changes (with migration guide)

**Stay informed:**

- Watch GitHub repository
- Read quarterly roadmap updates
- Participate in discussions

---

## Summary

**The framework updates are designed to be:**

- ✅ Safe (automatic backups)
- ✅ Easy (one command)
- ✅ Reversible (rollback support)
- ✅ Non-destructive (preserves customizations)

**Update regularly to get:**

- 🐛 Bug fixes
- ✨ New features
- 📚 Better documentation
- 🚀 Performance improvements

**When in doubt:**

1. Read the changelog
2. Create backup
3. Test the update
4. Rollback if needed

---

**Keep your framework fresh! 🚀**

Regular updates ensure you have the latest features, fixes, and improvements while keeping your customizations safe.
