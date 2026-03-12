---
description: Commit changes using project specs. Loads version-control.md, updates docs to reflect changes, then commits.
---

# /commit

Commit all changes following your version-control specs.

---

## STEP 1: Load Specs

Read `.claude/specs/config/version-control.md` for commit format.

If not found, use conventional commits: `type(scope): description`

---

## STEP 2: Check Status

```bash
git status
git diff --staged
git diff
```

If nothing to commit, say so and stop.

---

## STEP 3: Update Documentation

Before committing, update all relevant documentation to reflect the changes.

### Required Steps (do not skip)

For each changed file:

1. **Find all .md files** in the same directory and parent directories up to repo root
2. **Read each .md file found**
3. **Update any that need it** (CHANGELOG, README, etc.)
4. **Report what you did** using this format:
   ```
   [filepath]: [still accurate / updated: what changed]
   ```

Also check:
- `./CHANGELOG.md` (if exists) - add entries for features or fixes
- `./README.md` - update if structure or features changed

### What NOT to Update

- `CLAUDE.md` (system instructions) - only the user should edit this
- Documentation for unchanged code
- Files outside the current repo

### Before Proceeding

**Do not proceed to STEP 4 until you have:**
1. Listed every .md file found near changed files
2. Read each one
3. Updated any that needed it
4. Reported what you did (so the user knows)

---

## STEP 4: Stage and Commit

```bash
git add -A
git commit -m "generated message"
```

Show result.
