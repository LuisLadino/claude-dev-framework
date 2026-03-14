---
description: Pull latest framework changes from source repo. Compares files, shows diffs, lets you selectively apply updates.
---

# /update-framework

**Check for and apply updates from your framework source**

---

## Purpose

Check the framework repository for updates using GitHub's API and selectively apply changes.

**Use when:** Monthly maintenance, new features available, bug fixes released.

---

## Framework-Managed Files

**These are the ONLY files this command updates:**

```
.claude/
├── CLAUDE.md
├── commands/
│   ├── development/*.md
│   ├── project-management/*.md
│   ├── specs/*.md
│   └── utilities/*.md
└── skills/
    └── */SKILL.md
```

**Never touched:** `.claude/specs/`, `.claude/tasks/`, custom command directories

---

## STEP 1: Detect Framework Source

Read the source URL:

```bash
cat .claude/framework-source.txt 2>/dev/null
```

**If file exists:** Parse the GitHub URL to extract `{owner}` and `{repo}`.

Example: `https://github.com/owner/repo` → owner=`owner`, repo=`repo`

**If no file:** Ask user for the GitHub repo URL. Save it to `.claude/framework-source.txt`.

---

## STEP 2: Get Remote State

**Get recent commits to show what's changed in the framework:**

```bash
gh api repos/{owner}/{repo}/commits --jq '.[:10] | .[] | "- " + .commit.message' 2>/dev/null
```

**Get the tree of framework files at HEAD:**

```bash
gh api repos/{owner}/{repo}/git/trees/main::.claude --jq '.tree[] | .path' 2>/dev/null
```

Store this info for the summary.

---

## STEP 3: Compare Files

For each framework-managed file, compare local to remote.

**Get list of remote framework files:**

```bash
# Get commands
gh api "repos/{owner}/{repo}/contents/.claude/commands/development" --jq '.[].name' 2>/dev/null
gh api "repos/{owner}/{repo}/contents/.claude/commands/project-management" --jq '.[].name' 2>/dev/null
gh api "repos/{owner}/{repo}/contents/.claude/commands/specs" --jq '.[].name' 2>/dev/null
gh api "repos/{owner}/{repo}/contents/.claude/commands/utilities" --jq '.[].name' 2>/dev/null

# Get skills
gh api "repos/{owner}/{repo}/contents/.claude/skills" --jq '.[].name' 2>/dev/null
```

**For each file, fetch remote content and compare:**

```bash
# Fetch remote file content
curl -fsSL "https://raw.githubusercontent.com/{owner}/{repo}/main/.claude/CLAUDE.md" > /tmp/remote-file.md

# Compare to local
diff -u .claude/CLAUDE.md /tmp/remote-file.md
```

**Categorize results:**

- **New files:** Exist remotely but not locally
- **Modified files:** Exist both places but differ
- **Unchanged:** Identical content

---

## STEP 4: Present Findings

Show a summary:

```
Framework Source: {owner}/{repo}

Recent Changes:
- feat: add new /audit command
- fix: improve error handling in /audit
- docs: update CLAUDE.md reasoning section

Files to Update:
  MODIFIED: CLAUDE.md
  MODIFIED: commands/specs/audit.md
  NEW: commands/specs/audit.md

Unchanged: 12 files
```

**For modified files, show the diff:**

Use the diff output from Step 3. Present key changes (additions, removals, what sections changed).

**Ask user:**
1. Update all
2. Choose specific files
3. Show full diffs
4. Cancel

---

## STEP 5: Apply Updates

For each selected file, download and write:

```bash
# Download file
curl -fsSL "https://raw.githubusercontent.com/{owner}/{repo}/main/.claude/commands/development/start-task.md" -o ".claude/commands/development/start-task.md"
```

**For new directories that don't exist locally:**

```bash
mkdir -p .claude/commands/specs
```

**After all updates, verify:**

```bash
ls -la .claude/CLAUDE.md
ls -la .claude/commands/*/
```

---

## STEP 6: Summary

Report what was updated:

```
Updated:
- CLAUDE.md
- commands/specs/audit.md

Added:
- commands/specs/audit.md

To revert: git checkout .claude/
```

---

## Edge Cases

- **gh not installed:** Tell user to install GitHub CLI (`brew install gh` or https://cli.github.com)
- **Not authenticated:** Run `gh auth login`
- **Repo not found:** Check URL in framework-source.txt
- **Network error:** Retry or check connection
- **No changes:** "You're up to date"

---

## Related Commands

- `/sync-stack` - Detect stack and generate specs
- `/audit` - Check code against specs
