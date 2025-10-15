# /update-framework

**Update the Claude Dev Framework while preserving your customizations**

---

## Purpose

This command safely updates the framework to the latest version, pulling improvements and new features while keeping all your custom standards, configurations, and preferences intact.

**Use when:**
- New framework version is available
- Want new features or improvements
- Bug fixes are released
- Best practices are updated
- Quarterly maintenance check

**Time:** 5-10 minutes

---

## How It Works

The framework separates generic files from your customizations:

**Framework files (updated):**
- `.claude/commands/` - Command definitions
- `.claude/workflows/` - Generic workflows
- `.claude/templates/` - Stack templates
- `.claude/tools/` - Tool documentation

**Your files (preserved):**
- `.claude/your-stack/` - Your custom standards
- `stack-config.yaml` - Your stack configuration
- All customized standards files

---

## Usage

### Check for Updates

```
/update-framework --check
```

Shows what's new without updating anything.

### Update Everything

```
/update-framework
```

Updates framework files, preserves your customizations.

### Selective Update

```
/update-framework --only commands,workflows
```

Updates specific parts only.

---

## Interactive Flow

### Step 1: Check for Updates

**Command:**
```
/update-framework --check
```

**Claude reports:**
```
🔍 Checking for framework updates...

Connected to: https://github.com/LuisLadino/claude-dev-framework

Current version: v0.3.0
Latest version: v0.4.0

📦 Updates Available:

New Features:
✨ /collaborate command for team workflows
✨ Enhanced /verify with auto-fix suggestions
✨ New React 19 templates
✨ Performance optimization patterns

Improvements:
🔧 Better error messages in /start-task
🔧 Faster web research in /research-stack
🔧 Improved testing standards templates

Bug Fixes:
🐛 Fixed import path issues in generated code
🐛 Resolved conflict detection in /import-standards
🐛 Corrected TypeScript strict mode defaults

Documentation:
📚 Added troubleshooting guides
📚 New example projects
📚 Updated MCP setup instructions

Would you like to:
1. Update now
2. See detailed changelog
3. Cancel
```

### Step 2: Pre-Update Check

**Claude analyzes your setup:**
```
📊 Analyzing your configuration...

Your Setup:
✓ Stack: Next.js 14 with Prisma
✓ Custom standards: 8 files
✓ Company standards imported: Yes
✓ MCP servers: filesystem, github
✓ Last updated: 2 months ago

Safety Checks:
✓ No conflicts detected
✓ All customizations in .claude/your-stack/
✓ Git repository clean
✓ Backup available

Ready to update safely!
```

### Step 3: Update Process

**Claude updates:**
```
⬇️ Downloading framework v0.4.0...

Updating framework files:
✓ Updated .claude/commands/ (12 files)
✓ Updated .claude/workflows/ (6 files)
✓ Updated .claude/templates/ (8 files)
✓ Updated .claude/tools/ (4 files)

Preserving your customizations:
✓ Kept .claude/your-stack/ (unchanged)
✓ Kept stack-config.yaml (unchanged)
✓ Kept import-log.md (unchanged)

New files added:
+ .claude/commands/collaborate.md
+ .claude/templates/react-19/
+ .claude/workflows/team-sync.md
```

### Step 4: Review Changes

**Claude shows summary:**
```
✅ Update Complete!

Framework updated: v0.3.0 → v0.4.0

New Commands Available:
- /collaborate - Team workflow coordination
- /optimize - Performance analysis

Enhanced Commands:
- /verify - Now includes auto-fix suggestions
- /start-task - Better error messages
- /research-stack - 30% faster

Your Customizations: ✓ Preserved
- All 8 custom standards files intact
- Company standards unchanged
- Stack config preserved

What's Next:
1. Try the new /collaborate command
2. Check updated documentation
3. Review changelog for breaking changes
4. Test /verify auto-fix feature

Would you like me to show what's new in detail?
```

---

## Update Strategy

### What Gets Updated

**Always Updated:**
```
.claude/
├── commands/          ← Framework commands
├── workflows/         ← Generic workflows
├── templates/         ← Stack templates
└── tools/            ← Tool documentation
```

**Never Touched:**
```
.claude/your-stack/    ← Your customizations
├── coding-standards/
├── architecture/
├── testing-standards.md
└── stack-config.yaml
```

**Merged Intelligently:**
```
.claude/CLAUDE.md      ← Core instructions
```

### Version Compatibility

**Semantic Versioning:**
- **Major (v1.0.0 → v2.0.0)** - Breaking changes, review required
- **Minor (v0.3.0 → v0.4.0)** - New features, safe to update
- **Patch (v0.3.0 → v0.3.1)** - Bug fixes, always safe

**Check compatibility:**
```
/update-framework --compatibility
```

Shows if your stack config is compatible with new version.

---

## Update Modes

### 1. Full Update (Default)

```
/update-framework
```

**Updates:**
- All framework files
- Documentation
- Templates
- Command definitions

**Preserves:**
- All your customizations
- Stack configuration
- Company standards

### 2. Check Only

```
/update-framework --check
```

**Shows:**
- Available updates
- New features
- Bug fixes
- Breaking changes

**Does NOT:**
- Download anything
- Modify any files
- Change configuration

### 3. Selective Update

```
/update-framework --only commands
```

**Options:**
- `commands` - Update commands only
- `workflows` - Update workflows only
- `templates` - Update templates only
- `tools` - Update tool docs only
- `docs` - Update documentation only

### 4. Dry Run

```
/update-framework --dry-run
```

**Shows:**
- What would be updated
- What would be preserved
- Potential conflicts
- New features available

**Does NOT:**
- Actually update anything
- Modify files
- Download updates

---

## Handling Breaking Changes

### When Major Version Changes

**Example: v1.0.0 → v2.0.0**

**Claude warns:**
```
⚠️  Major Version Update

This update includes breaking changes:

1. Command Syntax Changes
   Old: /start-task [description]
   New: /start [task] [description]
   
   Impact: Muscle memory, documentation
   Migration: Aliases provided for 6 months

2. Config File Format
   Old: stack-config.yaml
   New: stack-config.json (YAML still supported)
   
   Impact: None if you keep YAML
   Migration: Optional migration script included

3. Standards Structure
   Old: Flat file structure
   New: Nested by category
   
   Impact: File organization
   Migration: Automatic migration available

Would you like to:
1. See full migration guide
2. Migrate automatically
3. Stay on v1.x
4. Cancel update
```

### Migration Process

**Automatic migration:**
```
/update-framework --migrate

Claude will:
1. Backup current setup
2. Update framework files
3. Migrate your customizations
4. Test compatibility
5. Provide rollback option
```

**Manual migration:**
```
1. Claude provides detailed migration guide
2. You update at your own pace
3. Claude helps with each step
4. Verify at each stage
```

---

## Rollback

### If Something Goes Wrong

**Automatic rollback:**
```
/update-framework --rollback
```

Reverts to previous version, restores all files.

**Rollback process:**
```
🔄 Rolling back to v0.3.0...

Restoring framework files:
✓ Restored .claude/commands/
✓ Restored .claude/workflows/
✓ Restored .claude/templates/

Your customizations:
✓ Unchanged (never modified during update)

Status: Back to v0.3.0
```

### What Gets Rolled Back

**Reverted:**
- Framework files to previous version
- Documentation to previous version
- Command definitions to previous version

**Kept:**
- Your customizations (never changed)
- Any new files you created
- Your stack configuration

---

## Advanced Options

### Update from Specific Version

```
/update-framework --to v0.4.2
```

Update to specific version (downgrade or upgrade).

### Force Update

```
/update-framework --force
```

Override safety checks, force update even with conflicts.

### Compare Versions

```
/update-framework --compare v0.3.0 v0.4.0
```

See detailed diff between versions.

### Subscribe to Updates

```
/update-framework --subscribe
```

Claude will notify you when new versions are available.

---

## Update Schedule

### Recommended

**Check monthly:**
```
Set reminder: 1st of each month
Run: /update-framework --check
```

**Update quarterly:**
```
Q1, Q2, Q3, Q4
Run: /update-framework (after testing)
```

**Immediate updates for:**
- Critical security fixes
- Major bug fixes
- Features you need now

### When NOT to Update

**Avoid updating:**
- During active development of critical features
- Right before important deadlines
- Without testing first
- When unstable (wait for .1 patch)

**Wait 1-2 weeks after major versions:**
- Let early adopters find issues
- Wait for x.0.1 patch release
- Read community feedback

---

## Version History & Changelog

### View Changelog

```
/update-framework --changelog
```

**Shows:**
```
# Changelog

## v0.4.0 (2025-10-14)

### Features
- Added /collaborate command for team workflows
- Enhanced /verify with auto-fix suggestions
- New React 19 templates with server components
- Performance optimization pattern templates

### Improvements
- 30% faster research in /research-stack
- Better error messages in /start-task
- Improved MCP server detection

### Bug Fixes
- Fixed import path issues in generated code
- Resolved conflict detection edge cases
- Corrected TypeScript strict mode defaults

### Documentation
- Added troubleshooting section
- New example projects
- Updated MCP setup guide
- Video tutorials added

## v0.3.1 (2025-09-28)
[Previous versions...]
```

### Compare with Current

```
/update-framework --diff
```

Shows what's different between your version and latest.

---

## Customization Preservation

### How Customizations Are Protected

**Protected directories:**
```
.claude/your-stack/        ← Never touched by updates
├── coding-standards/      ← Your standards
├── architecture/          ← Your patterns
├── *.md                   ← Your docs
└── stack-config.yaml      ← Your config
```

**Protected patterns:**
```
Any file you edited in your-stack/ is yours forever
Framework never overwrites your customizations
Updates only touch framework-owned files
```

### Merge Conflicts

**If conflict occurs:**
```
⚠️  Merge Required

File: .claude/CLAUDE.md

Conflict:
- Framework updated command syntax
- You customized verification rules

Options:
1. Keep your version (lose framework improvements)
2. Use framework version (lose your customizations)
3. Merge both (interactive)
4. See diff and decide later

Recommendation: [3] Merge both
```

**Merge tool:**
```
Claude will show:
- What you changed
- What framework changed
- Suggested merge
- Let you approve
```

---

## Examples

### Example 1: Routine Update

**Command:**
```
/update-framework
```

**Process:**
```
1. Check for updates (v0.3.0 → v0.4.0)
2. Review changes (new features, bug fixes)
3. Update framework files (30 seconds)
4. Preserve customizations (automatic)
5. Test new features (optional)
```

**Result:** Framework updated, customizations intact

### Example 2: Major Version Migration

**Command:**
```
/update-framework
[Detects v1.0.0 → v2.0.0]
```

**Process:**
```
1. Claude warns about breaking changes
2. Shows migration guide
3. Offers automatic migration
4. Creates backup
5. Migrates files
6. Tests compatibility
7. Provides rollback option
```

**Result:** Migrated to v2.0.0 safely

### Example 3: Selective Update

**Command:**
```
/update-framework --only commands,workflows
```

**Process:**
```
1. Update commands/ directory only
2. Update workflows/ directory only
3. Skip templates and tools
4. Preserve everything else
```

**Result:** Specific parts updated only

---

## Troubleshooting

### "Update fails partway through"

**Common causes:**
- Network interruption
- Permission issues
- Disk space

**Solution:**
```
/update-framework --resume
```

Resumes interrupted update.

### "Conflicts detected"

**If framework and your edits conflict:**
```
1. Review conflict details
2. Choose merge strategy
3. Manually edit if needed
4. Commit resolution
```

### "New version breaks something"

**Immediate rollback:**
```
/update-framework --rollback
```

Then report issue at:
https://github.com/LuisLadino/claude-dev-framework/issues

### "Lost customizations after update"

**This shouldn't happen, but if it does:**
```
1. Check git history: git log
2. Restore from backup: .claude/.backup/
3. Report bug with details
```

---

## Best Practices

### DO

✅ **Check for updates monthly** - Stay current
✅ **Read changelogs** - Know what's new
✅ **Test in development** - Before updating production
✅ **Keep git clean** - Commit before updating
✅ **Review changes** - Know what changed
✅ **Update documentation** - Tell team about new features

### DON'T

❌ **Update without reading changelog** - Know what you're getting
❌ **Update right before deadlines** - Give yourself time
❌ **Skip testing** - Verify everything works
❌ **Update without backup** - Always have rollback option
❌ **Ignore breaking changes** - Read migration guides

---

## Integration with Git

### Recommended Workflow

**Before update:**
```bash
# Ensure working directory is clean
git status

# Create update branch
git checkout -b framework-update-v0.4.0
```

**After update:**
```bash
# Review changes
git diff

# Commit update
git add .claude/
git commit -m "chore: update framework to v0.4.0"

# Test thoroughly
npm test

# Merge to main
git checkout main
git merge framework-update-v0.4.0
```

### What Gets Committed

**Should commit:**
- Updated framework files
- Updated documentation
- New templates

**Should NOT commit:**
- Temporary files
- Backup files
- Lock files from update process

---

## Release Channels

### Stable (Default)

```
/update-framework
```

Well-tested releases, recommended for production.

### Beta

```
/update-framework --channel beta
```

New features before stable release, test new functionality.

### Development

```
/update-framework --channel dev
```

Latest changes, may be unstable, for contributors only.

---

## Related

- [Initial Setup](../workflows/initial-setup.md) - First-time setup
- [Company Adoption](../workflows/company-adoption.md) - Team adoption
- [CHANGELOG](../../CHANGELOG.md) - Full version history

---

**Pro Tip:** Set a monthly calendar reminder to check for updates. Staying current means you get bug fixes and new features as soon as they're available!