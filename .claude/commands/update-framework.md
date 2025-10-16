# /update-framework

**Update framework and/or company standards**

---

## Quick Non-Interactive Update

**When Claude Code runs this command (no manual input needed):**

```bash
bash scripts/update-framework.sh -y
```

The `-y` flag auto-confirms the update without requiring interactive input.

**For manual terminal use:**

```bash
bash scripts/update-framework.sh
```

This will prompt you to confirm before updating.

---

## Purpose

Check for and apply updates to:
- Framework files (commands, workflows, tools, config)
- Company/team standards (your-stack/ from configured source)

**Use when:**
- Monthly maintenance check
- Company publishes standard updates
- New framework features are available
- Bug fixes are released

**Time:** 5-15 minutes

---

## How It Works

This command:
1. Checks for framework updates (from GitHub)
2. Checks for standards updates (from your configured source)
3. Shows you what's available
4. You choose what to update
5. Reviews changes before applying
6. Updates are applied with backups

---

## Execution

When user runs `/update-framework`:

### Step 1: Check for Framework Updates

```bash
# Download latest framework to temp location
temp_framework=".claude-framework-check-temp"
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/archive/refs/heads/main.tar.gz | tar -xz -C "$temp_framework" --strip-components=1
```

Compare with current installation to find what changed:

```bash
# Check each component
framework_updates=()

# Check commands
if ! diff -qr .claude/commands "$temp_framework/.claude/commands" > /dev/null 2>&1; then
    framework_updates+=("commands")
fi

# Check workflows
if ! diff -qr .claude/workflows "$temp_framework/.claude/workflows" > /dev/null 2>&1; then
    framework_updates+=("workflows")
fi

# Check tools, config, scripts, CLAUDE.md, etc.
```

### Step 2: Check for Standards Updates

```bash
# Read standards source from config
standards_source=$(grep -A 5 "standards_source:" .claude/your-stack/stack-config.yaml)
```

If standards source is configured, fetch and compare:

```bash
# Example for git source
temp_standards=".claude-standards-check-temp"
git clone --depth 1 [standards_url] "$temp_standards"

# Compare with current your-stack
standards_updates=()

for file in .claude/your-stack/coding-standards/*.md; do
    filename=$(basename "$file")
    if [ -f "$temp_standards/$filename" ]; then
        if ! diff -q "$file" "$temp_standards/$filename" > /dev/null 2>&1; then
            standards_updates+=("$filename")
        fi
    fi
done
```

### Step 3: Show Available Updates

Present a clear summary:

```markdown
## 🔍 Checking for Updates...

Connected to:
• Framework: github.com/LuisLadino/claude-dev-framework
• Standards: github.com/your-company/standards (if configured)

---

## 📦 Framework Updates Available (3 changes)

**New Features:**
• commands/create-agent.md - NEW command for creating custom agents
• workflows/team-collaboration.md - NEW team workflow

**Updates:**
• CLAUDE.md - Added MCP tool usage checks (IMPORTANT)
• commands/research-stack.md - Improved context7 integration
• scripts/update-framework.sh - Enhanced update logic (you're using it!)

**Bug Fixes:**
• Fixed installer merge mode
• Improved migration guide

---

## 📚 Company Standards Updates Available (2 changes)

Source: github.com/your-company/engineering-standards

**Updates:**
• react-standards.md - Deprecated class components, added server components
• typescript-standards.md - Stricter any usage policy

**New Files:**
• testing-standards.md - New testing requirements (80% coverage)

---

## What would you like to update?

1. **Framework only** - Get latest framework features
2. **Standards only** - Get company standard updates
3. **Both** - Update framework and standards
4. **Review changes** - See diffs before deciding
5. **Cancel** - Don't update anything

Your choice (1-5):
```

### Step 4: Handle User Choice

**If user chooses "4. Review changes":**

Show detailed diffs for each change:

```markdown
## 📝 Framework Changes

### CLAUDE.md (UPDATED)

**What changed:**
```diff
@@ Line 126 @@
+ **MCP Tool Usage:**
+ - [ ] Checked if MCP servers are available and needed for this task
+ - [ ] Using context7 for documentation research (if available)
+ - [ ] Using appropriate MCP tools for external data/APIs (if needed)
```

**Why this matters:** Framework now checks for MCP servers before tasks, ensuring better tool usage.

---

### commands/create-agent.md (NEW)

**What it does:** New command to create custom agent workflows for specialized tasks.

**Preview:**
```markdown
# /create-agent

Create a specialized agent for specific workflows...
[First 20 lines shown]
```

---

## 📚 Standards Changes

### react-standards.md (UPDATED)

**What changed:**
```diff
@@ Lines 45-48 @@
- Use class components for complex state
+ Use functional components with hooks for ALL components
+ Class components are deprecated

@@ Lines 102+ @@
+ ## Server Components
+ - Use React Server Components by default
+ - Mark client components with 'use client'
```

**Impact:** You'll need to migrate class components to hooks.

---

After showing all changes, ask again:

```
Now that you've reviewed the changes, what would you like to update?

1. Framework only
2. Standards only
3. Both
4. Cancel

Your choice (1-4):
```

### Step 5: Apply Updates

**If "1. Framework only" or "3. Both":**

```bash
# Run the update script for framework (non-interactive)
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/update-framework.sh | bash -s -- -y
```

Or if script is already local:

```bash
bash scripts/update-framework.sh -y
```

**If "2. Standards only" or "3. Both":**

For each changed standards file, show interactive approval:

```markdown
## Updating Standards...

### 1/2: react-standards.md

**Changes:**
```diff
- Use class components for complex state
+ Use functional components with hooks
```

**Apply this update?**
- [Y]es - Update this file
- [N]o - Keep current version
- [D]iff - Show full diff
- [P]review - Show final file

Your choice (Y/N/D/P):
```

Process each file based on user response:

```bash
# If yes
cp "$temp_standards/react-standards.md" .claude/your-stack/coding-standards/
# Create backup first
cp .claude/your-stack/coding-standards/react-standards.md .claude/your-stack/.backups/react-standards.md.backup-$(date +%Y%m%d-%H%M%S)
```

### Step 6: Summary

```markdown
## ✅ Update Complete!

**Framework:**
✅ Updated commands/ (2 new, 1 updated)
✅ Updated CLAUDE.md (MCP tool usage checks)
✅ Updated scripts/ (all framework scripts)

**Standards:**
✅ Applied: react-standards.md
⏭️  Skipped: typescript-standards.md (kept your version)
✅ Added: testing-standards.md (new file)

**Backups created:**
• Framework: .claude-backup-update-[timestamp]/
• Standards: .claude/your-stack/.backups/

**What's new:**
🔧 MCP tool usage checks in workflow
🔧 context7 automatic detection
🎯 New /create-agent command
📋 Company testing requirements (80% coverage)

**Next steps:**
1. Review updated standards
2. Test new features (/create-agent)
3. Apply new standards to code
4. Share updates with team

**To revert:**
Framework: cp -r .claude-backup-update-[timestamp]/* .claude/
Standards: cp .claude/your-stack/.backups/[file].backup-[timestamp] .claude/your-stack/coding-standards/[file]
```

---

## If No Standards Source Configured

If user doesn't have `standards_source` in stack-config.yaml:

```markdown
## 📦 Framework Updates Available (3 changes)

[Show framework updates as above]

---

## 📚 Company Standards

⚠️  No standards source configured

To get company/team standard updates, configure the source in:
.claude/your-stack/stack-config.yaml

Example:
```yaml
standards_source:
  type: "git"
  url: "https://github.com/your-company/standards.git"
  branch: "main"
  path: "standards/"
```

Or run: /import-standards to set up company standards

For now, you can update framework only.

---

What would you like to update?
1. Framework only (no standards source configured)
2. Cancel

Your choice:
```

---

## Configuration

### For Company Standards Updates

Add to `.claude/your-stack/stack-config.yaml`:

```yaml
standards_source:
  type: "git"  # or "url", "local"
  url: "https://github.com/company/engineering-standards.git"
  branch: "main"
  path: "standards/"  # Path within repo
```

### Supported Source Types

**Git Repository:**
```yaml
standards_source:
  type: "git"
  url: "https://github.com/company/standards.git"
  branch: "main"
```

**Direct URL:**
```yaml
standards_source:
  type: "url"
  url: "https://company.com/standards/"
```

**Local Path:**
```yaml
standards_source:
  type: "local"
  path: "/shared/company-standards/"
```

---

## Update Types

### Framework Updates

**What gets updated:**
- commands/ - All slash commands
- workflows/ - Multi-step workflows
- tools/ - Tool integrations
- config/ - Framework configs
- CLAUDE.md - Core instructions (if not customized)
- scripts/ - All framework scripts
- README.md - Framework documentation

**What's preserved:**
- your-stack/ - All custom standards
- PROJECT-INSTRUCTIONS.md - Custom instructions
- tasks/ - PRDs and task lists

### Standards Updates

**What gets updated:**
- your-stack/coding-standards/
- your-stack/architecture/
- your-stack/documentation-standards/
- Any other standards from company source

**What's preserved:**
- Custom modifications (you review each change)
- Files not in company standards
- Your project-specific additions

---

## Best Practices

**Before updating:**
- Commit your current code
- Check what's changing
- Read changelogs

**During update:**
- Review each change carefully
- Understand why standards changed
- Consider impact on your code

**After update:**
- Verify setup: `./scripts/validate-setup.sh`
- Test new features
- Apply new standards gradually
- Share updates with team

---

## Troubleshooting

### "Cannot connect to standards source"

- Check network access
- Verify URL in stack-config.yaml
- Ensure authentication (if required)

### "No updates available"

You're already up to date!

### "Framework update failed"

Restore from backup:
```bash
cp -r .claude-backup-update-[timestamp]/* .claude/
```

---

## Related

- `/import-standards` - Initial standards import
- `/research-stack` - Generate new standards
- Validation: `./scripts/validate-setup.sh`

---

**Note:** This single command handles both framework and standards updates. You control what gets updated and can review all changes before applying.
