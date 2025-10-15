# Company Standards Management

**How to centrally manage and distribute team/company standards using the framework**

---

## Overview

The framework provides a complete system for companies to:
- Centrally maintain coding standards
- Distribute updates to all developers
- Allow developers to review and approve changes
- Track which version each project uses
- Maintain consistency across teams

**Key benefit:** Developers get standard updates through the same `/update-framework` command they use for framework updates.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Setup for Companies](#setup-for-companies)
- [Setup for Developers](#setup-for-developers)
- [Publishing Standards Updates](#publishing-standards-updates)
- [Receiving Standards Updates](#receiving-standards-updates)
- [Best Practices](#best-practices)
- [Example Workflow](#example-workflow)

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│  Company Standards Repository           │
│  github.com/company/engineering-standards│
│                                         │
│  ├── coding-standards/                  │
│  │   ├── react-standards.md            │
│  │   ├── typescript-standards.md       │
│  │   └── api-design.md                 │
│  ├── architecture/                      │
│  │   ├── microservices.md              │
│  │   └── database-patterns.md          │
│  ├── documentation-standards/           │
│  └── CHANGELOG.md                       │
└─────────────────────────────────────────┘
                    ↓
            (git clone/pull)
                    ↓
┌─────────────────────────────────────────┐
│  Developer's Project                    │
│                                         │
│  .claude/your-stack/                    │
│  ├── coding-standards/                  │
│  │   ├── react-standards.md   ← synced │
│  │   ├── typescript-standards.md       │
│  │   └── custom-project.md    ← local  │
│  ├── architecture/                      │
│  └── stack-config.yaml                  │
│      standards_source:                  │
│        url: company/standards           │
└─────────────────────────────────────────┘
```

### Update Flow

1. **Company publishes update** to standards repo
2. **Developer runs** `/update-framework`
3. **Framework checks** both:
   - Framework updates (GitHub)
   - Company standards updates (configured source)
4. **Developer sees** what's available from both
5. **Developer reviews** changes with diffs
6. **Developer approves** which updates to apply
7. **Updates applied** to `your-stack/` with backups

---

## Setup for Companies

### Step 1: Create Standards Repository

Create a repository structure:

```bash
company-engineering-standards/
├── README.md
├── CHANGELOG.md
├── VERSION
├── coding-standards/
│   ├── react-standards.md
│   ├── typescript-standards.md
│   ├── python-standards.md
│   ├── api-design.md
│   └── code-review.md
├── architecture/
│   ├── microservices-architecture.md
│   ├── database-patterns.md
│   ├── event-driven.md
│   └── api-gateway.md
├── documentation-standards/
│   ├── api-documentation.md
│   ├── readme-template.md
│   └── code-comments.md
└── config/
    ├── deployment.md
    └── environment-setup.md
```

### Step 2: Version Your Standards

Use semantic versioning:

**VERSION file:**
```
1.0.0
```

**CHANGELOG.md:**
```markdown
# Changelog

## [1.1.0] - 2024-10-15

### Added
- Testing standards (80% coverage requirement)
- API versioning guidelines

### Changed
- React: Deprecated class components
- TypeScript: Stricter any usage policy

### Fixed
- Clarified microservices communication patterns

## [1.0.0] - 2024-09-01
- Initial release
```

### Step 3: Use Git Tags

Tag each release:

```bash
git tag -a v1.1.0 -m "Release 1.1.0: Testing standards and React updates"
git push origin v1.1.0
```

### Step 4: Setup GitHub Repository

Make it accessible to your team:

**Option A: Private Repo (Recommended)**
```bash
# Developers need access token or SSH key
https://github.com/company/engineering-standards.git
```

**Option B: Internal GitHub Enterprise**
```bash
https://github.company.com/engineering/standards.git
```

**Option C: Public Repo**
```bash
# If standards are public
https://github.com/company-oss/standards.git
```

### Step 5: Document Configuration for Developers

Create a `README.md` in your standards repo:

```markdown
# Company Engineering Standards

## For Developers

To use these standards with the Claude Development Framework:

### 1. Install Framework (if not already)
```bash
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash
```

### 2. Configure Standards Source

Add to `.claude/your-stack/stack-config.yaml`:

```yaml
standards_source:
  type: "git"
  url: "https://github.com/company/engineering-standards.git"
  branch: "main"
  path: ""
```

### 3. Import Initial Standards

```bash
# In Claude Code
/import-standards
```

### 4. Update Standards Regularly

```bash
# In Claude Code
/update-framework
```

This checks for both framework AND company standards updates.
```

---

## Setup for Developers

### Step 1: Install Framework

If not already installed:

```bash
cd your-project
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash
```

### Step 2: Configure Company Standards Source

Edit `.claude/your-stack/stack-config.yaml`:

```yaml
# Your project stack
framework: "next.js"
language: "typescript"

# Company standards source
standards_source:
  type: "git"
  url: "https://github.com/company/engineering-standards.git"
  branch: "main"
  path: ""  # Empty if standards are in root, or "standards/" if nested

# Optional: Authentication for private repos
# Will use your git credentials automatically
```

### Step 3: Import Initial Standards

In Claude Code:

```
/import-standards
```

This will:
- Clone company standards repo
- Copy standards to `.claude/your-stack/`
- Preserve any existing project-specific standards

### Step 4: Verify Setup

```bash
ls -la .claude/your-stack/coding-standards/
# Should show company standards files
```

---

## Publishing Standards Updates

### Step 1: Make Changes

Edit standards files in your repo:

```bash
# Edit file
vim coding-standards/react-standards.md

# Update version
echo "1.1.0" > VERSION

# Update changelog
vim CHANGELOG.md
```

### Step 2: Commit and Tag

```bash
git add .
git commit -m "feat(react): deprecate class components, add server components"
git tag -a v1.1.0 -m "Release 1.1.0"
git push origin main
git push origin v1.1.0
```

### Step 3: Announce to Team

Send notification:

```
📢 Engineering Standards Updated: v1.1.0

Changes:
- React: Class components deprecated
- Testing: 80% coverage requirement
- API: New versioning guidelines

To update:
1. Run /update-framework in Claude Code
2. Review changes
3. Apply updates

Full changelog: https://github.com/company/standards/blob/main/CHANGELOG.md
```

---

## Receiving Standards Updates

### For Developers

#### Step 1: Check for Updates

In Claude Code:

```
/update-framework
```

#### Step 2: Review Available Updates

Framework shows:

```markdown
## 🔍 Checking for Updates...

Connected to:
• Framework: github.com/LuisLadino/claude-dev-framework
• Standards: github.com/company/engineering-standards

---

## 📦 Framework Updates Available

[Framework updates shown here]

---

## 📚 Company Standards Updates Available (3 changes)

Source: github.com/company/engineering-standards
Version: 1.0.0 → 1.1.0

**Updates:**
• react-standards.md - Deprecated class components, added server components
• api-design.md - New versioning guidelines

**New Files:**
• testing-standards.md - 80% coverage requirement

---

What would you like to update?
1. Framework only
2. Standards only
3. Both
4. Review changes
5. Cancel

Your choice:
```

#### Step 3: Review Changes (Optional)

Choose "4. Review changes":

```markdown
## 📚 Standards Changes

### react-standards.md (UPDATED)

**What changed:**
```diff
@@ Lines 45-48 @@
- ## Component Types
- Use class components for complex state
- Use functional components for presentational components

+ ## Component Types (Updated 2024-10-15)
+ Use functional components with hooks for ALL components
+ Class components are deprecated - migrate to hooks
+ Reference: React team recommendation 2024
```

**Impact:**
- Need to migrate existing class components
- New components must use hooks
- Update code review checklist

**Apply this update?**
[Y/N/D/P]
```

#### Step 4: Apply Selected Updates

Choose option and approve changes:

```
Your choice: Y

✅ Applying update to react-standards.md...
   Backed up to: .claude/your-stack/.backups/react-standards.md.backup-20241015
   Applied changes
```

#### Step 5: Update Code

After applying standards:

1. Review what changed
2. Update existing code gradually
3. Use new standards for new code
4. Update team documentation

---

## Best Practices

### For Standards Maintainers

**DO:**
- ✅ Use semantic versioning
- ✅ Maintain detailed CHANGELOG
- ✅ Document breaking changes clearly
- ✅ Test standards with real projects
- ✅ Get team feedback before major changes
- ✅ Announce updates to team
- ✅ Provide migration guides for breaking changes

**DON'T:**
- ❌ Make breaking changes frequently
- ❌ Update without changelog
- ❌ Surprise team with mandatory updates
- ❌ Skip version numbers
- ❌ Change standards without discussion

### For Developers

**DO:**
- ✅ Check for updates monthly
- ✅ Review changes before applying
- ✅ Understand why standards changed
- ✅ Apply new standards to existing code gradually
- ✅ Ask questions if unclear
- ✅ Provide feedback to standards team

**DON'T:**
- ❌ Blindly apply all updates
- ❌ Skip reading changelogs
- ❌ Ignore breaking changes
- ❌ Apply updates right before deadlines
- ❌ Override standards without discussion

---

## Example Workflow

### Company: Publishing React Standards Update

```bash
# 1. Update standards
cd engineering-standards
vim coding-standards/react-standards.md
# Add: "Use server components by default in Next.js 14+"

# 2. Update version and changelog
echo "1.2.0" > VERSION
cat >> CHANGELOG.md <<EOF
## [1.2.0] - 2024-10-20
### Added
- React: Server components guidelines for Next.js 14+
EOF

# 3. Commit and tag
git add .
git commit -m "feat(react): add server components guidelines"
git tag -a v1.2.0 -m "React server components update"
git push origin main v1.2.0

# 4. Announce
# Send Slack message with changelog
```

### Developer: Receiving Update

```bash
# 1. In project, run update
# In Claude Code: /update-framework

# 2. See update available
# Framework shows:
# - react-standards.md updated
# - New server components section

# 3. Review changes
# Choose "Review changes"
# Read diff

# 4. Apply update
# Choose "Standards only"
# Approve react-standards.md

# 5. Update code
# Create task: "Migrate to server components"
# Apply to new features first
# Gradually update existing code
```

---

## Standards Source Types

### Git Repository (Recommended)

**Best for:**
- Companies with GitHub/GitLab
- Version control required
- Multiple contributors
- Change history tracking

**Configuration:**
```yaml
standards_source:
  type: "git"
  url: "https://github.com/company/standards.git"
  branch: "main"
  path: ""
```

### Direct URL

**Best for:**
- Standards served via API
- Dynamic content
- Company portal integration

**Configuration:**
```yaml
standards_source:
  type: "url"
  url: "https://company.com/api/standards/"
```

### Local Directory

**Best for:**
- Testing
- Shared network drives
- Monorepo setups

**Configuration:**
```yaml
standards_source:
  type: "local"
  path: "/shared/company/standards/"
```

---

## Advanced Topics

### Multiple Standards Sources

For large companies with multiple teams:

```yaml
standards_source:
  - name: "company"
    type: "git"
    url: "github.com/company/standards"
    path: "global/"

  - name: "frontend-team"
    type: "git"
    url: "github.com/company/frontend-standards"
    path: ""
```

Developer runs `/update-framework` and sees updates from both sources.

### Standards Inheritance

**Company-wide standards:**
```
company/global-standards/
├── code-review.md (applies to all)
└── security.md (applies to all)
```

**Team-specific standards:**
```
company/frontend-standards/
├── react-standards.md (frontend only)
└── accessibility.md (frontend only)
```

Developers configure both sources and get updates from each.

### Custom Approval Workflow

For enterprises requiring approval:

1. Standards team publishes to `staging` branch
2. Tech leads review and test
3. Once approved, merge to `main`
4. Developers pull from `main`

```yaml
standards_source:
  type: "git"
  url: "github.com/company/standards"
  branch: "main"  # Only approved changes
```

---

## Troubleshooting

### "Cannot connect to standards source"

**Check:**
- Network access to repository
- Git credentials configured
- Repository URL correct
- Branch name correct

**Solution:**
```bash
# Test manually
git clone https://github.com/company/standards.git test-clone
# If this fails, fix credentials/access first
```

### "No updates detected but I know there are updates"

**Check:**
- Correct branch configured
- Latest commit pulled
- File paths match

**Solution:**
```bash
# Check configured source
cat .claude/your-stack/stack-config.yaml | grep -A 5 standards_source

# Verify latest version
git ls-remote https://github.com/company/standards.git HEAD
```

### "Update conflicts with my customizations"

**Solution:**
- Choose "Review changes"
- See diff between company version and yours
- Manually merge
- Keep both company updates and your customizations

---

## Migration Guide

### Moving from Manual Standards to Framework

**Before:** Standards in Confluence/Notion, manually copy-pasted

**After:** Standards in git repo, automatically synced

**Steps:**

1. **Export current standards**
   ```bash
   # Copy from Confluence to markdown files
   ```

2. **Create standards repo**
   ```bash
   mkdir company-standards
   cd company-standards
   git init
   # Add markdown files
   git add .
   git commit -m "Initial standards import"
   ```

3. **Configure all projects**
   ```yaml
   # Each project adds to stack-config.yaml
   standards_source:
     type: "git"
     url: "github.com/company/standards"
   ```

4. **Announce to team**
   ```
   We've moved standards to git!

   To sync: Run /update-framework in Claude Code

   Benefits:
   - Automatic updates
   - Version history
   - Review changes before applying
   ```

---

## Related Documentation

- [Getting Started](getting-started.md) - Framework setup
- [Update System](../README.md#updating) - How updates work
- [Import Standards](../commands/import-standards.md) - Initial import

---

## Summary

The framework provides a complete standards management system:

**For Companies:**
- ✅ Central repository for standards
- ✅ Version control with git
- ✅ Easy distribution to developers
- ✅ Track what version each project uses

**For Developers:**
- ✅ One command to check for updates
- ✅ Review changes before applying
- ✅ Preserve custom modifications
- ✅ Automatic backups

**Result:**
- Consistent standards across company
- Developers stay up to date
- Changes are transparent
- Full control maintained

**Get started:**
1. Company: Create standards repo
2. Developers: Configure source
3. Everyone: Run `/update-framework` monthly
