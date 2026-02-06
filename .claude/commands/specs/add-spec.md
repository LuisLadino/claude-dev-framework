# /add-spec

Add a new spec to your project. Creates the file in the correct location and registers it in `stack-config.yaml`.

---

## Interactive Flow

### Step 1: Spec Type

Ask the user which type of spec to add:

1. **Coding Spec** - Goes in `.claude/specs/coding/`
2. **Architecture Spec** - Goes in `.claude/specs/architecture/`
3. **Documentation Spec** - Goes in `.claude/specs/documentation/`
4. **Design Spec** - Goes in `.claude/specs/design/`
5. **Config** - Goes in `.claude/specs/config/`

If the user provided a name as an argument (e.g., `/add-spec api`), skip to Step 2.

### Step 2: Spec Name

Ask for the spec name. Use kebab-case (lowercase with hyphens).

### Step 3: Confirm

Show summary: type, name, file path. Ask for confirmation.

### Step 4: Create File

Create the spec file with a template: Overview, Patterns (with examples), Best Practices, Anti-Patterns.

### Step 5: Update stack-config.yaml

Add to the appropriate list in `stack-config.yaml`.

### Step 6: Generate Content (Optional)

Ask if they want to:
1. **Research** - Generate content from official docs
2. **Manual** - Keep template for manual editing

### Step 7: Done

Confirm the spec was created. Suggest reviewing the file and testing with `/start-task`.

---

## File Locations

| Type | Directory |
|------|-----------|
| Coding | `.claude/specs/coding/` |
| Architecture | `.claude/specs/architecture/` |
| Documentation | `.claude/specs/documentation/` |
| Design | `.claude/specs/design/` |
| Config | `.claude/specs/config/` |

---

## Related Commands

- `/sync-stack` - Detect stack, research docs, generate specs
- `/verify` - Check code against specs
