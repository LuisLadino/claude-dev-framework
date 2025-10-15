# Customization Guide

This guide shows you how to tailor the Claude Development Framework to match your project's unique needs, company standards, and team preferences.

---

## Table of Contents

- [Understanding Customization](#understanding-customization)
  - [The Baseline + Extension Model](#the-baseline--extension-model)
  - [How It Works](#how-it-works)
  - [Everything is Extensible](#everything-is-extensible)
  - [Real-World Example](#real-world-example)
  - [Why Nothing Breaks](#why-nothing-breaks)
- [Quick Start: Adding Custom Standards](#quick-start-adding-custom-standards)
- [Company-Level Customization](#company-level-customization)
  - [Customizing CLAUDE.md](#customizing-claudemd)
  - [Adding Custom Slash Commands](#adding-custom-slash-commands)
  - [Creating Custom Workflows](#creating-custom-workflows)
  - [Adding Stack Templates](#adding-stack-templates)
  - [Setting Up Agents](#setting-up-agents)
- [Individual-Level Customization](#individual-level-customization)
  - [Personal Commands](#personal-commands)
  - [Personal Agents](#personal-agents)
  - [Local Overrides](#local-overrides)
- [Git Strategy for Customizations](#git-strategy-for-customizations)
  - [Flexible Approach](#flexible-approach)
  - [Naming Conventions](#naming-conventions-optional-but-helpful)
  - [Company Update Strategy](#company-update-strategy)
- [Stack Configuration](#stack-configuration)
- [Coding Standards](#coding-standards)
- [Architecture Patterns](#architecture-patterns)
- [Documentation Standards](#documentation-standards)
- [Company Standards Import](#company-standards-import)
- [Team Collaboration](#team-collaboration)
- [Advanced Customization](#advanced-customization)

---

## Understanding Customization

### The Baseline + Extension Model

The framework is **completely flexible** - it works on layers that build on each other:

**Layer 1:** Framework defaults (this repo)
**Layer 2:** Company customizations (optional)
**Layer 3:** Individual extensions (always possible)

Each layer **extends** the previous without breaking it.

---

#### **How It Works**

**1. Start with Base Framework**
```
.claude/
├── CLAUDE.md              # Framework instructions
├── commands/              # Core commands (/start-task, /learn, etc.)
├── workflows/             # Core workflows
├── templates/             # Base templates
└── your-stack/            # Example config
```

**2. Company Extends It** (optional)
```
.claude/
├── CLAUDE.md              # + Company policies appended
├── commands/
│   ├── start-task.md     # (framework default)
│   ├── deploy.md         # ← Company adds
│   └── security-scan.md  # ← Company adds
├── workflows/
│   └── code-review.md    # ← Company adds
├── agents/
│   └── reviewer/         # ← Company adds
└── your-stack/            # ← Company customizes
```

**3. You Extend It Further** (always)
```
.claude/
├── CLAUDE.md              # + Your notes appended
├── commands/
│   ├── start-task.md     # (framework)
│   ├── deploy.md         # (company)
│   └── my-tool.md        # ← You add
├── agents/
│   ├── reviewer/         # (company)
│   └── my-helper/        # ← You add
└── your-stack/            # ← You modify
```

**Your choice what to do with your additions:**
- Keep local (don't commit)
- Commit and share with team
- PR back to company baseline

---

###Everything is Extensible

```
.claude/
├── CLAUDE.md              # ✅ Append sections (doesn't break existing)
├── commands/              # ✅ Add .md files (independent)
├── workflows/             # ✅ Add workflows (independent)
├── templates/             # ✅ Add templates (independent)
├── tools/                 # ✅ Add tool docs (independent)
├── config/                # ✅ Add/modify config files
├── agents/                # ✅ Add agent directories (independent)
└── your-stack/            # ✅ Customize standards
```

**Key insight:** Adding files doesn't break existing ones. Appending to CLAUDE.md doesn't break existing sections.

---

### Real-World Example

**Scenario:** Acme Corp + Developer Jane

#### **Acme Corp Customizes**

```bash
# 1. Acme clones framework
git clone https://github.com/LuisLadino/claude-dev-framework.git acme-dev

# 2. Acme extends CLAUDE.md
# Adds company section at end:
## Acme Corp Standards
- Always reference JIRA tickets
- Security scan before deploy
- 2 approvals required

# 3. Acme adds commands
.claude/commands/deploy-staging.md
.claude/commands/deploy-production.md
.claude/commands/jira-link.md

# 4. Acme adds agents
.claude/agents/code-reviewer/
.claude/agents/security-scanner/

# 5. Acme commits everything
git add .claude/
git commit -m "feat: Acme customizations"
git push to company repo
```

#### **Jane Clones Acme's Version**

```bash
# Jane clones Acme's customized framework
git clone acme-repo my-project

# Jane gets:
✓ Framework defaults (start-task, learn, verify, etc.)
✓ Acme's CLAUDE.md additions (policies)
✓ Acme's commands (deploy, jira-link, etc.)
✓ Acme's agents (code-reviewer, security-scanner)
```

#### **Jane Extends It**

```bash
# Jane adds to CLAUDE.md (at the end):
## Jane's Personal Notes
- Check email at 9am
- Daily standup at 10am
- Update time log at EOD

# Jane adds her own command
.claude/commands/daily-log.md

# Jane adds her own agent
.claude/agents/time-tracker/

# Jane's choices:
# Option A: Keep local (don't commit)
git add .gitignore  # Add her files to gitignore

# Option B: Share with team (commit)
git add .claude/commands/daily-log.md
git commit -m "feat: add daily-log command"
git push

# Option C: Contribute back to Acme baseline (PR)
# Create PR to add daily-log to company standards
```

**Result:**
- Jane has framework ✓
- Jane has Acme's customizations ✓
- Jane has her own additions ✓
- Nothing broke ✓
- Jane controls what's shared ✓

---

### Why Nothing Breaks

**Commands are independent files:**
```
.claude/commands/
├── start-task.md      # Framework
├── deploy.md          # Company
└── my-tool.md         # You
# Each is independent, adding doesn't break others
```

**CLAUDE.md is append-friendly:**
```markdown
# Framework Section
[Framework instructions]

# Company Section
[Company policies]

# Your Section
[Your personal notes]

# All coexist peacefully
```

**Agents are separate directories:**
```
.claude/agents/
├── code-reviewer/     # Company
└── my-helper/         # You
# Each directory is independent
```

**Standards are listed:**
```yaml
standards_active:
  - react-standards      # Framework
  - company-standards    # Company
  - my-standards         # You
# List grows without conflicts
```

---

### Customization Flexibility

**What you can do:**
- ✅ Append to any markdown file
- ✅ Add new command files
- ✅ Add new workflow files
- ✅ Create agent directories
- ✅ Modify stack config
- ✅ Add standards files
- ✅ Customize templates

**What to be careful with:**
- ⚠️ Don't remove framework sections from CLAUDE.md (append instead)
- ⚠️ Don't delete core command files (add your own instead)
- ⚠️ Don't break YAML syntax in config files

**General principle:** Extend, don't replace.

---

### Customization Philosophy

1. **Everything is Extensible:** Framework, company, and you all extend
2. **Flexibility Over Rules:** You decide what to share vs keep local
3. **Non-Breaking Changes:** Extensions don't break existing functionality
4. **Share What's Useful:** Good additions can become company standards
5. **Updates Preserve Your Work:** `./scripts/update-framework.sh` keeps your changes
6. **Adapt to Your Needs:** Framework bends to your workflow, not the other way

---

## Quick Start: Adding Custom Standards

### The `/add-standard` Command ⭐

The **easiest way** to add custom standards is with the `/add-standard` command:

```bash
/add-standard design-standards
```

**What it does:**
1. ✅ Creates the file in the correct location
2. ✅ Registers it in `stack-config.yaml`
3. ✅ Optionally researches and generates content
4. ✅ Validates everything works
5. ✅ Ready to use immediately

### Example: Adding Design Standards

```bash
# In Claude Code:
/add-standard

# Choose:
Type: 1 (Coding Standard)
Name: design-standards
Generate: Yes
Research: "Design tokens and component variants for Tailwind CSS"

# Result:
✓ Created: .claude/your-stack/coding-standards/design-standards.md
✓ Registered in: stack-config.yaml
✓ Generated content with researched patterns
✓ Ready to use with /start-task
```

### Common Custom Standards to Add

**Design & UI:**
```bash
/add-standard design-standards    # Design tokens, spacing, colors
/add-standard animation-standards # Animation patterns, transitions
/add-standard responsive-standards # Responsive design patterns
```

**Performance & Optimization:**
```bash
/add-standard performance-standards # Performance best practices
/add-standard seo-standards        # SEO optimization patterns
/add-standard accessibility-standards # WCAG compliance patterns
```

**Domain-Specific:**
```bash
/add-standard security-standards  # Security patterns
/add-standard api-standards       # API conventions
/add-standard data-standards      # Data handling patterns
```

### How It Works

When you add a standard, Claude:

**1. Creates the file:**
```
.claude/your-stack/coding-standards/design-standards.md
```

**2. Updates `stack-config.yaml`:**
```yaml
standards_active:
  - react-standards
  - typescript-standards
  - design-standards     # ← ADDED
```

**3. Makes it discoverable:**
- All commands (`/start-task`, `/verify`, etc.) can now read it
- `project_knowledge_search` finds it automatically
- Standards are enforced immediately

### Manual Method (Alternative)

If you prefer to create standards manually:

**Step 1: Create the file**
```bash
# Create in the correct directory
touch .claude/your-stack/coding-standards/design-standards.md
```

**Step 2: Register in stack-config.yaml**
```yaml
standards_active:
  - react-standards
  - typescript-standards
  - design-standards     # ← ADD THIS
```

**Step 3: Add content**
```markdown
# Design Standards

## Color System
[Your colors...]

## Typography
[Your typography...]

## Spacing
[Your spacing system...]
```

**Step 4: Verify it works**
```bash
/start-task "Test design standards"
# Claude should now read and apply your design standards
```

---

## Company-Level Customization

This section covers customizations that **companies/teams** make and **commit to the repository** for everyone to use.

### Customizing CLAUDE.md

`CLAUDE.md` is the "prime directive" file that guides Claude's behavior. Companies can extend it with their policies.

**How to customize safely:**

1. **Don't remove existing sections** - The core framework needs them
2. **Add company sections at the end** - Before the final `---`
3. **Use clear headers** - Make it obvious what's company-specific

**Example company additions:**

```markdown
# At the end of .claude/CLAUDE.md, before final ---

## Company-Specific Guidelines

### Security Requirements

Before any code that handles user data:
1. Check authentication
2. Validate inputs
3. Sanitize outputs
4. Log access attempts

### JIRA Integration

Every commit must reference a JIRA ticket:
```bash
git commit -m "PROJ-123: Add feature X"
```

### Code Review Process

1. Run `/verify` before creating PR
2. Ensure all tests pass
3. Get approval from 2 team members
4. Merge only during business hours (9am-5pm EST)

### Deployment Standards

- Staging deploys: Any time
- Production deploys: Tuesdays/Thursdays only, 2pm EST
- Always run `/run-integration-tests` before production deploy

---
```

**Result:** All developers follow company policies automatically.

---

### Adding Custom Slash Commands

Companies can add commands specific to their workflow.

**Command naming convention:**
- **Core commands:** `command-name.md` (e.g., `start-task.md`)
- **Company commands:** `company-command-name.md` (e.g., `deploy-staging.md`)
- **Personal commands:** `_personal-command.md` (underscore prefix, gitignored)

**Example: Adding `/deploy-staging` command**

**Step 1: Create the file**
```bash
touch .claude/commands/deploy-staging.md
```

**Step 2: Write the command**
```markdown
# /deploy-staging

Deploy the current branch to staging environment.

## Purpose

Automate staging deployments with proper checks and rollback support.

## Usage

```bash
/deploy-staging
```

## Flow

### Step 1: Pre-deployment Checks

```
🔍 Running pre-deployment checks...

✓ All tests passing
✓ No TypeScript errors
✓ Branch is up to date with main
✓ Environment variables configured
```

### Step 2: Build

```
📦 Building for staging...

✓ Build completed successfully
✓ Bundle size: 245 KB (within limits)
```

### Step 3: Deploy

```
🚀 Deploying to staging...

✓ Uploaded to staging server
✓ Database migrations applied
✓ Health check passed

🌐 Staging URL: https://staging.company.com
```

### Step 4: Verification

```
✅ Deployment successful!

Next steps:
1. Test at: https://staging.company.com
2. Check logs: ./scripts/staging-logs.sh
3. Rollback if needed: ./scripts/rollback-staging.sh
```

## Example

```bash
/deploy-staging

# Checks, builds, deploys, verifies
# Takes ~3-5 minutes
```
```

**Step 3: Commit for team**
```bash
git add .claude/commands/deploy-staging.md
git commit -m "feat: add /deploy-staging command"
git push
```

**Step 4: Team uses it**
```bash
# Any team member can now:
/deploy-staging
```

**More company command examples:**
- `/deploy-production` - Production deployment
- `/run-security-scan` - Security audit
- `/generate-api-docs` - API documentation
- `/create-migration` - Database migration
- `/run-integration-tests` - Full test suite

---

### Creating Custom Workflows

Workflows guide multi-step processes. Companies add workflows for their specific needs.

**Example: Security Review Workflow**

**Create:** `.claude/workflows/security-review.md`

```markdown
# Security Review Workflow

Guide for performing security reviews on pull requests.

## When to Use

- Before merging any PR that touches:
  - Authentication/authorization
  - User data handling
  - API endpoints
  - Database queries
  - File uploads

## Workflow

### Step 1: Automated Scans

Run security tooling:
```bash
# Run static analysis
npm run security-scan

# Check dependencies
npm audit

# Check for secrets
./scripts/check-secrets.sh
```

### Step 2: Manual Review

Check for common vulnerabilities:

**Authentication:**
- [ ] Proper JWT validation
- [ ] Session management secure
- [ ] Password hashing (bcrypt)
- [ ] Rate limiting on auth endpoints

**Input Validation:**
- [ ] All user inputs validated
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF tokens present

**Data Access:**
- [ ] Authorization checks
- [ ] No data leaks in errors
- [ ] Proper access control
- [ ] Audit logging

### Step 3: Document Findings

```bash
/create-security-report

# Creates: SECURITY_REVIEW_[DATE].md
# With findings and recommendations
```

### Step 4: Approval

- [ ] All critical issues resolved
- [ ] Security team approval
- [ ] Document any accepted risks
```

**Commit for team:**
```bash
git add .claude/workflows/security-review.md
git commit -m "feat: add security review workflow"
```

---

### Adding Stack Templates

Companies can add templates for their specific tech stacks.

**Example: Adding Company's Standard Stack**

**Create:** `.claude/templates/coding-standards/_company-nextjs.md`

```markdown
# Company Next.js Standards

**Framework:** Next.js 15 (App Router)
**Last Updated:** 2025-01-15

## Company-Specific Patterns

### API Routes

All API routes must:
```typescript
// app/api/users/route.ts
import { auth } from '@/lib/auth'
import { logApiAccess } from '@/lib/logging'
import { validateInput } from '@/lib/validation'

export async function POST(request: Request) {
  // 1. Authenticate
  const user = await auth(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Log access
  logApiAccess({ user, endpoint: '/api/users', method: 'POST' })

  // 3. Validate input
  const data = await request.json()
  const validated = validateInput(data, userSchema)

  // 4. Process
  // ... your logic
}
```

### Database Queries

Always use company ORM wrapper:
```typescript
import { db } from '@/lib/company-db'  // ← Company wrapper

// ✅ Correct
const users = await db.users.findMany({
  where: { active: true }
})

// ❌ Wrong - Don't use Prisma directly
import { PrismaClient } from '@prisma/client'
```

### Environment Variables

Use company structure:
```.env
# Company standard naming
COMPANY_API_KEY=...
COMPANY_DB_URL=...
COMPANY_AUTH_SECRET=...
```

## Company Deployment

See `/deploy-staging` and `/deploy-production` commands.
```

**Commit for team:**
```bash
git add .claude/templates/coding-standards/_company-nextjs.md
git commit -m "feat: add company Next.js template"
```

---

### Setting Up Agents

Companies can set up AI agents for specific tasks.

**What are agents?**
- Autonomous AI workflows
- Handle repetitive tasks
- Run in background
- Can be company-wide or personal

**Example: Code Review Agent**

**Step 1: Create agent directory**
```bash
mkdir -p .claude/agents/code-reviewer
```

**Step 2: Create agent config**
```yaml
# .claude/agents/code-reviewer/config.yaml
name: "Code Reviewer"
description: "Automated code review agent"
trigger: "on_pr_created"
permissions:
  - read_code
  - write_comments
  - read_standards

workflow:
  - step: "Load PR diff"
  - step: "Read company standards"
  - step: "Analyze code quality"
  - step: "Check security"
  - step: "Generate review comments"
  - step: "Post review"
```

**Step 3: Create agent instructions**
```markdown
# .claude/agents/code-reviewer/instructions.md

You are the Code Review Agent for [Company].

## Your Job

Review pull requests against company standards automatically.

## Workflow

1. **Load Context**
   - Read PR diff
   - Read `.claude/your-stack/` standards
   - Read `.claude/config/` policies

2. **Review Checklist**
   - [ ] Follows coding standards
   - [ ] Has tests
   - [ ] No security issues
   - [ ] Performance considerations
   - [ ] Documentation updated

3. **Generate Comments**
   ```markdown
   ## Code Review - Automated

   ### ✅ Passes
   - Coding standards followed
   - Tests included

   ### ⚠️ Concerns
   - Missing error handling in `api/users.ts:45`
   - Consider adding index on `users.email`

   ### 📝 Suggestions
   - Could extract validation logic to util
   ```

4. **Post Review**
   - Comment on PR
   - Request changes if critical issues
   - Approve if all checks pass
```

**Step 4: Commit for team**
```bash
git add .claude/agents/code-reviewer/
git commit -m "feat: add code review agent"
```

**Step 5: Team benefits**
- Every PR gets automatic review
- Consistent feedback
- Catches issues early
- Reduces review burden

---

## Individual-Level Customization

This section covers customizations that **individuals** make and **keep local** (not committed).

### Personal Commands

Individuals can add commands for their personal workflow.

**Naming convention:** Prefix with underscore (`_my-command.md`)

**Example: Personal Todo Command**

**Create:** `.claude/commands/_my-todo.md`

```markdown
# /_my-todo

My personal todo list manager.

## Usage

```bash
/_my-todo
```

## What it does

1. Reads `~/.my-todos.md`
2. Shows current todos
3. Lets me add/complete items
4. Saves back to file

## Personal Workflow

This is my daily standup helper.
```

**Add to `.gitignore`:**
```gitignore
# Personal commands (don't commit)
.claude/commands/_*.md
```

**Result:** Personal command, doesn't affect team.

---

### Personal Agents

Individuals can create agents for personal tasks.

**Example: Personal Assistant Agent**

**Create:** `.claude/agents/_my-assistant/`

```bash
mkdir -p .claude/agents/_my-assistant
```

**Config:** `.claude/agents/_my-assistant/config.yaml`
```yaml
name: "My Personal Assistant"
description: "Helps with my daily tasks"
trigger: "manual"
```

**Instructions:** `.claude/agents/_my-assistant/instructions.md`
```markdown
# My Personal Assistant

Help me with:
- Daily standup notes
- Time tracking
- Personal reminders
- Quick notes
```

**Add to `.gitignore`:**
```gitignore
# Personal agents (don't commit)
.claude/agents/_*/
```

---

### Local Overrides

Individuals can override team settings locally for testing.

**Example: Test different stack locally**

```bash
# Copy team config
cp .claude/your-stack/stack-config.yaml .claude/your-stack/stack-config.local.yaml

# Modify local version
# Test with different framework, etc.
```

**Add to `.gitignore`:**
```gitignore
# Local overrides (don't commit)
.claude/your-stack/*.local.*
```

**Result:** Test changes without affecting team.

---

## Git Strategy for Customizations

### Flexible Approach

Since everything is **extensible and additive**, git strategy is **your choice**:

#### **Option 1: Share Everything** (Team Approach)
Commit all your additions so team benefits:

```bash
# Commit all extensions
git add .claude/
git commit -m "feat: add deployment commands and agents"
git push
```

**When to use:**
- Your additions are useful for the whole team
- You want to contribute to company baseline
- Building shared workflows

#### **Option 2: Keep Local** (Personal Approach)
Use .gitignore for personal stuff:

```gitignore
# .gitignore

# Your personal additions (optional pattern: use _ prefix for clarity)
.claude/commands/_*.md
.claude/agents/_*/
.claude/_notes/

# Or be explicit:
.claude/commands/my-daily-log.md
.claude/agents/time-tracker/
```

**When to use:**
- Personal workflow tools
- Experimental additions
- Private notes/reminders

#### **Option 3: Mix** (Recommended)
Share useful stuff, keep personal stuff local:

```bash
# Share useful command with team
git add .claude/commands/quick-deploy.md
git commit -m "feat: add quick-deploy command"

# Keep personal notes local
echo ".claude/_notes/" >> .gitignore
```

**When to use:**
- Most real-world scenarios
- Want flexibility
- Contributing selectively

---

### Naming Conventions (Optional but Helpful)

Use prefixes to make intent clear:

**Underscore = Personal** (by convention)
```
.claude/commands/_my-tool.md        # Personal
.claude/agents/_my-helper/          # Personal
```

**No prefix = Shared** (by convention)
```
.claude/commands/deploy.md          # Shared
.claude/agents/code-reviewer/       # Shared
```

Then gitignore with pattern:
```gitignore
# Ignore personal (underscore prefix)
.claude/commands/_*.md
.claude/agents/_*/
```

**Note:** This is just a helpful convention, not a requirement.

---

### Recommended .gitignore (If Using Personal Items)

```gitignore
# ==================================================
# Claude Framework - Personal Items
# ==================================================

# Personal commands/agents (underscore prefix)
.claude/commands/_*.md
.claude/agents/_*/
.claude/workflows/_*.md

# Personal notes and scratch space
.claude/_notes/
.claude/_scratch/
.claude/_personal/

# Local testing overrides
.claude/your-stack/*.local.*
.claude/your-stack/*.test.*
*.personal.*

# ==================================================
# Everything else IS committed by default:
# - Framework customizations (CLAUDE.md extensions)
# - Shared commands (no underscore)
# - Shared agents (no underscore)
# - Team standards (.claude/your-stack/)
# ==================================================
```

---

### Company Update Strategy

When company pushes updates:

```bash
# Pull company updates
git pull origin main

# Your extensions are preserved (they're just additional files)
# Your CLAUDE.md additions are preserved (appended, not replaced)
# Your local .gitignore'd items unaffected

# Conflicts only if you modified same lines company did
# Usually: no conflicts because you extended, didn't replace
```

**Framework update script handles it:**
```bash
./scripts/update-framework.sh

# Preserves your customizations
# Merges company updates
# Creates backup before changes
```

---

## Stack Configuration

### Basic Configuration

Edit `.claude/your-stack/stack-config.yaml`:

```yaml
name: "My Project"
version: "1.0.0"

stack:
  framework: "React"           # React, Vue, Svelte, Next.js, etc.
  language: "TypeScript"       # TypeScript or JavaScript
  styling: "Tailwind CSS"      # Tailwind, CSS Modules, styled-components
  testing: "Vitest"            # Vitest, Jest, Playwright
  package_manager: "pnpm"      # npm, pnpm, yarn

standards_active:
  - react-standards
  - typescript-standards
  - tailwind-standards
  - testing-standards

tools:
  mcp_servers: []

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  pages_dir: "src/app"
```

### Framework-Specific Examples

#### Next.js Project
```yaml
stack:
  framework: "Next.js"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  pages_dir: "src/app"           # App Router
  api_dir: "src/app/api"
  use_app_router: true
```

#### Vue Project
```yaml
stack:
  framework: "Vue"
  language: "TypeScript"
  styling: "CSS Modules"
  testing: "Vitest"

project_specifics:
  import_alias: "@/"
  components_dir: "src/components"
  pages_dir: "src/pages"
  use_composition_api: true
  use_script_setup: true
```

#### Svelte Project
```yaml
stack:
  framework: "SvelteKit"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"

project_specifics:
  import_alias: "$lib"
  components_dir: "src/lib/components"
  routes_dir: "src/routes"
```

### Adding Custom Fields

Add any project-specific configuration:

```yaml
project_specifics:
  # Standard fields
  import_alias: "@/"
  components_dir: "src/components"
  
  # Your custom fields
  api_base_url: "https://api.myproject.com"
  enable_analytics: true
  feature_flags:
    - new_ui
    - beta_features
  
  # Team conventions
  max_file_lines: 250
  require_jsdoc: true
  git_branch_prefix: "feature/"
```

---

## Coding Standards

### Creating Custom Standards

#### 1. Create a New Standards File

**File:** `.claude/your-stack/coding-standards/api-standards.md`

```markdown
# API Standards

## Fetch Wrapper

Always use our centralized API client:

```typescript
import { api } from '@/lib/api';

// ✅ Correct
const users = await api.get<User[]>('/users');

// ❌ Wrong - don't use fetch directly
const response = await fetch('/api/users');
```

## Error Handling

Use our error boundary and toast system:

```typescript
try {
  await api.post('/users', userData);
  toast.success('User created successfully');
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

## Authentication

Include auth token from our auth context:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { token } = useAuth();
  
  const fetchData = async () => {
    const data = await api.get('/protected', {
      headers: { Authorization: `Bearer ${token}` }
    });
  };
}
```

## Rationale

We centralize API calls to:
- Handle authentication consistently
- Manage error handling in one place
- Support request/response interceptors
- Enable request mocking for tests
```

#### 2. Activate the Standard

Add to `stack-config.yaml`:

```yaml
standards_active:
  - react-standards
  - typescript-standards
  - api-standards          # ← Your new standard
```

#### 3. Test It

```
/start-task "Create user profile API call"
```

Claude will now follow your API patterns automatically!

### Overriding Default Standards

Create a file with the same name to override:

**File:** `.claude/your-stack/coding-standards/react-standards.md`

```markdown
# React Standards (Custom)

> This overrides the default React standards

## Component Structure

We use default exports (different from framework default):

```typescript
// ✅ Our convention
export default function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}

// ❌ Framework default (named exports)
export function Button() { }
```

## Rationale

Our team prefers default exports for easier imports.
```

Your standards always take precedence over framework defaults.

### Common Custom Standards

#### State Management
```markdown
# State Management Standards

## Global State

Use Zustand for global state:

```typescript
import { create } from 'zustand';

export const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## Form State

Use React Hook Form:

```typescript
import { useForm } from 'react-hook-form';

function MyForm() {
  const { register, handleSubmit } = useForm<FormData>();
  // ...
}
```
```

#### Testing Standards
```markdown
# Testing Standards

## Test Organization

One test file per component:

```
Button.tsx
Button.test.tsx
```

## Test Structure

Use Arrange-Act-Assert:

```typescript
it('should increment count on click', () => {
  // Arrange
  render(<Counter initialCount={0} />);
  
  // Act
  fireEvent.click(screen.getByRole('button'));
  
  // Assert
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

## Coverage Requirements

Minimum 80% coverage for:
- All components
- All utils
- All hooks
```

---

## Architecture Patterns

### File Structure Customization

**File:** `.claude/your-stack/architecture/file-structure.md`

```markdown
# File Structure

## Feature-Based Organization

We organize by feature, not file type:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   └── index.ts
│   └── dashboard/
│       └── ...
└── shared/
    ├── components/
    └── utils/
```

## Naming Conventions

- Components: PascalCase (UserProfile.tsx)
- Hooks: camelCase with 'use' prefix (useUser.ts)
- Utils: camelCase (formatDate.ts)
- Types: PascalCase (User.types.ts)

## Barrel Exports

Every feature exports through index.ts:

```typescript
// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export type { User } from './types';
```
```

### Component Patterns

**File:** `.claude/your-stack/architecture/component-patterns.md`

```markdown
# Component Patterns

## Composition Pattern

Build components with composition:

```typescript
// ✅ Good - Composable
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardBody>
    <UserInfo />
  </CardBody>
</Card>

// ❌ Avoid - Monolithic
<UserProfileCard 
  title="User Profile" 
  showHeader={true}
  headerColor="blue"
/>
```

## Container/Presenter Pattern

Separate logic from UI:

```typescript
// UserContainer.tsx - handles logic
export function UserContainer({ id }: { id: string }) {
  const { user, loading } = useUser(id);
  
  if (loading) return <LoadingSpinner />;
  return <UserPresenter user={user} />;
}

// UserPresenter.tsx - pure UI
export function UserPresenter({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

## Custom Hooks for Logic

Extract complex logic to hooks:

```typescript
// hooks/useUserData.ts
export function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
}

// Component stays clean
function UserProfile({ userId }: Props) {
  const { user, loading } = useUserData(userId);
  // ...
}
```
```

---

## Documentation Standards

### Component Documentation

**File:** `.claude/your-stack/documentation-standards/component-docs.md`

```markdown
# Component Documentation

## Public Components

All public components need JSDoc:

```typescript
/**
 * Primary button component for user actions
 * 
 * @param variant - Visual style: 'primary' | 'secondary' | 'danger'
 * @param size - Size variant: 'sm' | 'md' | 'lg'
 * @param disabled - Whether button is disabled
 * @param onClick - Click handler
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 * ```
 */
export function Button({ variant, size, disabled, onClick, children }: ButtonProps) {
  // ...
}
```

## README Requirements

Each feature needs a README:

```markdown
# Auth Feature

## Overview
Handles user authentication and authorization.

## Components
- `LoginForm` - User login
- `SignupForm` - User registration
- `ProtectedRoute` - Route guard

## Usage
\`\`\`typescript
import { LoginForm, useAuth } from '@/features/auth';

function LoginPage() {
  return <LoginForm onSuccess={() => navigate('/dashboard')} />;
}
\`\`\`
```
```

---

## Custom Commands

### Adding Project-Specific Commands

Create custom command workflows:

**File:** `.claude/your-stack/commands/deploy.md`

```markdown
# /deploy Command

## Purpose
Deploy the application through our CI/CD pipeline

## Workflow

1. **Check git status**
   - Ensure all changes committed
   - Ensure on main branch
   - Pull latest changes

2. **Run pre-deploy checks**
   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run build
   ```

3. **Create version tag**
   ```bash
   npm version patch
   git push --tags
   ```

4. **Trigger deployment**
   - Push to main triggers GitHub Actions
   - Actions runs tests
   - Actions deploys to staging
   - Manual approval for production

5. **Verify deployment**
   - Check staging URL
   - Run smoke tests
   - Check error monitoring

## Usage

```
/deploy
```

Claude will guide you through the deployment process.
```

Tell Claude:
```
I've created a custom /deploy command in .claude/your-stack/commands/deploy.md. 
Please add it to your available commands.
```

---

## Company Standards Import

### Importing Existing Documentation

Use the `/import-standards` command to convert company docs:

```
/import-standards
```

Claude will:
1. Ask for your documentation location
2. Read your docs (via file upload or MCP)
3. Convert to framework format
4. Save to `.claude/your-stack/`

### Example Import

**Your company doc (company-react-guide.md):**
```markdown
# React Best Practices

Always use functional components.
Use TypeScript for all components.
Export components as named exports.
```

**After import creates:**
`.claude/your-stack/coding-standards/company-react-standards.md`
```markdown
# Company React Standards

## Component Style
Use functional components only:

```typescript
// ✅ Correct
export function MyComponent() {
  return <div>Hello</div>;
}

// ❌ Wrong - no class components
export class MyComponent extends React.Component { }
```

## TypeScript Required
All components must use TypeScript:

```typescript
interface Props {
  name: string;
}

export function Greeting({ name }: Props) {
  return <h1>Hello {name}</h1>;
}
```

## Named Exports
Use named exports for better IDE support:

```typescript
// ✅ Correct
export function Button() { }

// ❌ Wrong
export default function Button() { }
```
```

---

## Team Collaboration

### Sharing Standards

**1. Commit `.claude/` to Git:**
```bash
git add .claude/
git commit -m "docs: add development framework"
git push
```

**2. Team Members Clone:**
```bash
git clone your-repo
# .claude/ directory is now available
```

**3. Start Using:**
```
Claude, please read .claude/CLAUDE.md
```

### Collaborative Standards

**.claude/your-stack/README.md:**
```markdown
# Our Development Standards

## Contributing

To propose a new standard:
1. Create a PR with new `.md` file
2. Get team review
3. Update `stack-config.yaml` to activate
4. Document in team wiki

## Standards Review

We review standards quarterly:
- What's working?
- What's not?
- What needs updating?

## Contact

Questions about standards? Ask in #dev-standards Slack channel.
```

---

## Advanced Customization

### Environment-Specific Standards

**File:** `.claude/your-stack/coding-standards/deployment-standards.md`

```markdown
# Deployment Standards

## Environment Variables

### Development
```env
NODE_ENV=development
API_URL=http://localhost:3000
DEBUG=true
```

### Production
```env
NODE_ENV=production
API_URL=https://api.production.com
DEBUG=false
SENTRY_DSN=your-sentry-dsn
```

## Build Configuration

### Vite Config
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'esbuild',
  },
});
```
```

### Multi-Stack Projects

If you have multiple sub-projects:

```
project/
├── web-app/
│   └── .claude/
│       └── your-stack/
│           └── stack-config.yaml    # Next.js config
├── mobile-app/
│   └── .claude/
│       └── your-stack/
│           └── stack-config.yaml    # React Native config
└── api/
    └── .claude/
        └── your-stack/
            └── stack-config.yaml    # Node/Express config
```

Each subproject has its own configuration!

### Conditional Standards

Use comments to indicate when standards apply:

```markdown
# API Standards

## REST APIs

> Applies to: backend services only

Use Express.js with TypeScript:

```typescript
app.get('/users', async (req, res) => {
  const users = await db.users.findMany();
  res.json(users);
});
```

## GraphQL APIs

> Applies to: projects using GraphQL

Use Apollo Server:

```typescript
const resolvers = {
  Query: {
    users: () => db.users.findMany(),
  },
};
```
```

---

## Quality Checklist

Before finalizing customizations:

- [ ] Stack configuration is accurate
- [ ] All standards files have examples
- [ ] Standards explain "why" not just "what"
- [ ] No conflicting patterns
- [ ] Standards are realistic (team can follow)
- [ ] Documentation is clear
- [ ] Team has reviewed and approved
- [ ] Committed to version control

---

## Tips for Effective Customization

### 1. Document Decisions

Create Architecture Decision Records (ADRs):

**File:** `.claude/your-stack/architecture/decisions/001-use-zustand.md`
```markdown
# ADR 001: Use Zustand for State Management

## Status
Accepted

## Context
We need global state management for user auth and app settings.

## Decision
Use Zustand instead of Redux or Context API.

## Consequences
+ Simpler API than Redux
+ Better TypeScript support than Context
+ Smaller bundle size
- Less ecosystem than Redux
- Team needs to learn new tool

## Implementation
See state-management-standards.md for patterns.
```

### 2. Start with Examples

Show don't tell:

```markdown
# Component Naming

## Examples

✅ Good names:
- UserProfileCard.tsx
- SettingsPanel.tsx
- LoginForm.tsx

❌ Bad names:
- Card.tsx (too generic)
- Component1.tsx (not descriptive)
- login.tsx (not PascalCase)
```

### 3. Evolve Over Time

Standards aren't static:

- Start minimal
- Add as patterns emerge
- Remove what doesn't work
- Refine based on code reviews

### 4. Make Standards Discoverable

Create an index:

**File:** `.claude/your-stack/README.md`
```markdown
# Our Development Standards

## Quick Links

- [React Patterns](./coding-standards/react-standards.md)
- [API Conventions](./coding-standards/api-standards.md)
- [File Structure](./architecture/file-structure.md)
- [Testing Guide](./coding-standards/testing-standards.md)

## New Team Members

Start here:
1. Read stack-config.yaml
2. Read file-structure.md
3. Read react-standards.md
4. Try /start-task with a simple component
```

---

## Next Steps

- **Read:** [Framework Philosophy](./philosophy.md) - Understand the design principles
- **Setup:** [MCP Integration](./mcp-setup.md) - Connect external tools
- **Explore:** [Examples](./examples/) - See real configurations
- **Ask:** [FAQ](./faq.md) - Common questions answered

---

**Your customizations make this framework truly yours. Happy customizing!** ⚙️
