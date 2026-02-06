# Version Control Standards

**Template Version:** 1.0.0  
**Last Updated:** 2025-01-09

> **Note:** This is a template file. Running `/research-stack` generates a customized version in `.claude/your-stack/`.

---

## Git Setup

### Initial Repository Setup

```bash
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin [your-repo-url]
git push -u origin main
```

---

## .gitignore Template

Every project needs a proper `.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnpm-store/
.npm/
.yarn/
bower_components/

# Build outputs
dist/
build/
.next/
.nuxt/
.output/
out/
.astro/
.svelte-kit/
.vercel/
.netlify/

# Environment variables
.env
.env.local
.env.development
.env.test
.env.production
.env.*.local

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
*~

# IDE and editors
.vscode/
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~
.project
.classpath
.c9/
*.launch
.settings/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Testing
coverage/
.nyc_output/
*.lcov
.cache/

# Temporary files
*.tmp
.temp/
temp/

# Framework customizations (not committed to framework repo)
.claude/your-stack/
```

---

## Commit Message Format

### Convention: `type(scope): message`

**Types:**

- `feat` - New feature for the user
- `fix` - Bug fix
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `style` - Changes that don't affect code meaning (formatting, whitespace)
- `docs` - Documentation only changes
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (dependencies, config, build tools)
- `perf` - Performance improvement
- `ci` - CI/CD configuration changes
- `build` - Changes to build system or dependencies
- `revert` - Reverts a previous commit

**Scope** (optional): Component, feature, or area affected

**Examples:**

```bash
feat(auth): add password reset functionality
fix(button): correct hover state in dark mode
refactor(api): simplify error handling logic
style(header): format code with prettier
docs(readme): update installation instructions
test(login): add integration tests
chore(deps): update dependencies
perf(images): lazy load below-fold images
ci(actions): add automated deployment
build(webpack): optimize bundle size
revert: feat(auth): add password reset functionality
```

### Message Guidelines

**DO:**

- ✅ Use present tense ("add" not "added")
- ✅ Use imperative mood ("move" not "moves")
- ✅ Start with lowercase (except proper nouns)
- ✅ Keep first line under 72 characters
- ✅ Be specific and descriptive
- ✅ Reference issue numbers if applicable (`fixes #123`)

**DON'T:**

- ❌ End with a period
- ❌ Be vague ("update stuff", "fix bug", "changes")
- ❌ Include implementation details in subject
- ❌ Commit unrelated changes together
- ❌ Mention "Claude", "Claude Code", or AI tools in commit messages
- ❌ Include Co-Authored-By: Claude or similar AI attribution

### Detailed Messages

For complex commits, add detail in body:

```bash
git commit -m "feat(gallery): add image filtering by category" \
  -m "" \
  -m "Allows users to filter gallery images by selecting categories." \
  -m "Includes URL parameter sync and accessibility improvements." \
  -m "" \
  -m "Related to #45"
```

---

## Branch Strategy

### Branch Types

**main**

- Production-ready code only
- Always deployable
- Protected branch (requires PR review)
- Automatically deploys to production

**develop** (optional for teams)

- Integration branch for features
- Pre-production testing
- Merges into main for release

**feature/[name]**

- New features or enhancements
- Branch from `main` (or `develop` if using)
- Merge back via pull request
- Delete after merge

**fix/[name]**

- Bug fixes
- Branch from `main` (or branch with bug)
- Merge back via pull request

**hotfix/[name]**

- Critical production fixes
- Branch from `main`
- Merge to `main` immediately after fix

**refactor/[name]**

- Code improvements without behavior changes
- Branch from `main`
- Merge back via pull request

**docs/[name]**

- Documentation updates
- Branch from `main`
- Can merge directly (low risk)

### Naming Conventions

**Good branch names:**

```
feature/user-authentication
feature/image-gallery
fix/header-overflow
fix/login-validation-error
hotfix/payment-gateway-timeout
refactor/database-queries
docs/api-documentation
```

**Bad branch names:**

```
new-stuff
john-work
fixes
test
temp
wip
```

---

## Workflow

### Starting New Work

```bash
# Update local main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/user-profile

# Make changes, commit frequently
git add src/components/UserProfile.tsx
git commit -m "feat(profile): add user profile component"

# Continue working
git add src/components/ProfileAvatar.tsx
git commit -m "feat(profile): add avatar upload"

# Push to remote
git push -u origin feature/user-profile
```

### Creating Pull Request

1. Push your branch to remote
2. Open pull request on GitHub/GitLab
3. Write clear PR description:
   - What was changed
   - Why it was changed
   - How to test it
4. Request review from team member (if applicable)
5. Address review comments
6. Merge after approval

### Merging to Main

```bash
# Update feature branch with latest main
git checkout main
git pull origin main
git checkout feature/user-profile
git merge main

# Resolve any conflicts
# Run tests to ensure everything works

# Merge feature into main
git checkout main
git merge feature/user-profile

# Push to remote (triggers deployment)
git push origin main

# Delete feature branch
git branch -d feature/user-profile
git push origin --delete feature/user-profile
```

---

## Pre-Commit Checklist

Before every commit, verify:

- [ ] Code is formatted (`npm run format` or equivalent)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compiles with no errors (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] No `console.log()` or debug statements
- [ ] No commented-out code blocks
- [ ] No temporary files included
- [ ] Commit message follows convention
- [ ] Only related changes in commit

### Quick Pre-Commit Commands

```bash
# Format code
npm run format

# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build

# Test
npm test

# All at once
npm run format && npm run lint && npm run type-check && npm run build && npm test
```

---

## Common Git Operations

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

### Discard Uncommitted Changes

```bash
# Single file
git checkout -- path/to/file

# All files
git reset --hard HEAD
```

### View Changes

```bash
# Unstaged changes
git diff

# Staged changes
git diff --staged

# Between branches
git diff main..feature/my-feature
```

### Stash Changes

```bash
# Save work in progress
git stash

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply and remove stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Amend Last Commit

```bash
# Change commit message
git commit --amend -m "new message"

# Add forgotten files
git add forgotten-file.ts
git commit --amend --no-edit
```

### Cherry Pick Commits

```bash
# Apply specific commit from another branch
git cherry-pick <commit-hash>
```

---

## Handling Merge Conflicts

When merge conflicts occur:

```bash
# 1. Git shows conflict
git merge feature/my-feature
# CONFLICT in src/components/Button.tsx

# 2. Open conflicted files
# Look for conflict markers:
<<<<<<< HEAD
// Current branch code
=======
// Incoming branch code
>>>>>>> feature/my-feature

# 3. Resolve conflicts
# - Keep one version, or
# - Combine both, or
# - Write new solution

# 4. Remove conflict markers

# 5. Stage resolved files
git add src/components/Button.tsx

# 6. Complete merge
git commit -m "merge: resolve conflicts in Button component"
```

---

## Tags and Releases

### Creating Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 <commit-hash> -m "Release version 1.0.0"

# Push tags to remote
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### Semantic Versioning

Follow SemVer: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes (2.0.0)
- `MINOR` - New features, backwards compatible (1.1.0)
- `PATCH` - Bug fixes, backwards compatible (1.0.1)

**Examples:**

- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature added
- `v2.0.0` - Breaking API changes

---

## Git Hooks (Optional)

Automate checks before commit:

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running pre-commit checks..."

# Format check
npm run format:check || {
  echo "❌ Format check failed. Run: npm run format"
  exit 1
}

# Lint
npm run lint || {
  echo "❌ Lint failed. Fix errors before committing."
  exit 1
}

# Type check
npm run type-check || {
  echo "❌ Type check failed. Fix errors before committing."
  exit 1
}

echo "✅ Pre-commit checks passed!"
```

Make executable:

```bash
chmod +x .git/hooks/pre-commit
```

---

## Working with Remotes

### Multiple Remotes

```bash
# Add upstream (original repo)
git remote add upstream https://github.com/original/repo.git

# List remotes
git remote -v

# Fetch from upstream
git fetch upstream

# Merge upstream changes
git merge upstream/main
```

### Contributing to Open Source

```bash
# 1. Fork repository on GitHub
# 2. Clone your fork
git clone https://github.com/yourusername/repo.git

# 3. Add upstream remote
git remote add upstream https://github.com/original/repo.git

# 4. Create feature branch
git checkout -b fix/issue-123

# 5. Make changes and commit
git commit -m "fix: resolve issue #123"

# 6. Push to your fork
git push origin fix/issue-123

# 7. Open pull request on GitHub
```

---

## Best Practices

### Commit Frequently

Small, focused commits are better than large, monolithic ones:

✅ **Good:**

```bash
git commit -m "feat(auth): add login form UI"
git commit -m "feat(auth): implement login validation"
git commit -m "feat(auth): connect to authentication API"
git commit -m "test(auth): add login component tests"
```

❌ **Bad:**

```bash
git commit -m "add entire authentication feature"
```

### Keep Commits Atomic

Each commit should be a single logical change:

✅ One commit = One feature/fix/refactor  
❌ One commit ≠ Multiple unrelated changes

### Write for Future You

Commit messages should explain WHY, not just WHAT:

✅ **Good:**

```bash
feat(cache): add Redis caching for API responses

Reduces API calls by 80% and improves page load time.
Cache expires after 5 minutes to ensure fresh data.
```

❌ **Bad:**

```bash
add caching
```

### Pull Before Push

Always pull latest changes before pushing:

```bash
git pull origin main
git push origin main
```

### Don't Commit Generated Files

Build outputs, dependencies, IDE files → `.gitignore`  
Source code, configuration → commit

### Use Branches

Never commit directly to `main` in production projects.  
Always use feature branches and pull requests.

---

## Troubleshooting

### Accidentally Committed to Wrong Branch

```bash
# 1. Note the commit hash
git log

# 2. Switch to correct branch
git checkout correct-branch

# 3. Cherry-pick the commit
git cherry-pick <commit-hash>

# 4. Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### Pushed Sensitive Data

```bash
# ⚠️ If you accidentally committed secrets:

# 1. Remove from repository
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push (⚠️ destructive!)
git push origin --force --all

# 3. Rotate all exposed secrets immediately!
```

### Large File Accidentally Committed

```bash
# Remove from history
git filter-branch --tree-filter 'rm -f path/to/large-file' HEAD
git push origin --force --all
```

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Book](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**Customize this file for your team's workflow!**

Common customizations:

- Branch naming conventions
- PR requirements
- Commit message format variations
- Pre-commit hook specifics
- Team size (solo vs. team workflows)
