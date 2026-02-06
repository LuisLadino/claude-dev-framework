# /commit

Commit changes following your version-control specs.

---

## STEP 1: Load Specs

Read `.claude/specs/config/version-control.md` for commit format and conventions.

If not found, use conventional commits format: `type(scope): description`

---

## STEP 2: Check Status

```bash
git status
git diff --staged
git diff
```

Show user:
- Staged changes
- Unstaged changes
- Untracked files

If nothing to commit, say so and stop.

---

## STEP 3: Stage Files

If there are unstaged changes, ask:

```
Stage all changes? (yes / select / cancel)
```

- **yes** - Stage all modified and new files
- **select** - Let user specify which files
- **cancel** - Stop

---

## STEP 4: Generate Message

Based on the diff, generate a commit message following the spec format.

Show the message and ask:

```
Commit message:
[generated message]

Proceed? (yes / edit / cancel)
```

- **yes** - Commit with this message
- **edit** - Let user modify the message
- **cancel** - Stop (changes stay staged)

---

## STEP 5: Commit

```bash
git commit -m "message"
```

Show result. Ask if user wants to push.

---

## STEP 6: Push (Optional)

If user wants to push:

```bash
git push
```

If no upstream, ask before setting one.
