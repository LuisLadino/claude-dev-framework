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

## STEP 3: Documentation Check

Before committing, verify all relevant documentation is still accurate.

### Required Steps (do not skip)

For each changed file:

1. **Find all .md files** in the same directory and parent directories up to repo root
2. **Read each .md file found**
3. **State your determination** using this exact format:
   ```
   Checked [filepath]: [still accurate / needs update: reason]
   ```

Also check:
- `./CHANGELOG.md` (if exists) for features or fixes
- `./README.md` for structural or feature changes

### What NOT to Update

- `CLAUDE.md` (system instructions) — only the user should edit this
- Documentation for unchanged code
- Files outside the current repo

### Verification Required

**Do not proceed to STEP 4 until you have:**
1. Listed every .md file found near changed files
2. Read each one (use the Read tool)
3. Shown your determination for each file

If you skip this step, you are lying about having verified documentation.

---

## STEP 4: Stage and Commit

```bash
git add -A
git commit -m "generated message"
```

Show result.
