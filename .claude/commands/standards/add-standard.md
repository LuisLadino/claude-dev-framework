# /add-standard

Add a new custom standard to your project. Creates the file in the correct location, registers it in `stack-config.yaml`, and optionally generates content using `/research-stack`.

---

## Interactive Flow

### Step 1: Standard Type

Ask the user which type of standard to add:

1. **Coding Standard** - Goes in `.claude/your-stack/coding-standards/`
2. **Architecture Pattern** - Goes in `.claude/your-stack/architecture/`
3. **Documentation Standard** - Goes in `.claude/your-stack/documentation-standards/`
4. **Design Standard** - Goes in `.claude/your-stack/design-standards/`
5. **Config** - Goes in `.claude/your-stack/config/`

If the user provided a name as an argument (e.g., `/add-standard api-standards`), skip to Step 2.

### Step 2: Standard Name

Ask for the standard name. Require kebab-case (lowercase with hyphens).

### Step 3: Confirm Details

Show the user a summary: type, name, file path, and which config section it will be registered in. Ask for confirmation before proceeding.

### Step 4: Create File

Create the standards file using a template with these sections: Overview, Patterns (with code examples), Best Practices, Examples, Anti-Patterns (bad vs good), and References.

### Step 5: Update stack-config.yaml

Add the new standard name to the appropriate list in `stack-config.yaml` (`standards_active`, `architecture_patterns`, or `documentation_standards`).

### Step 6: Generate Content (Optional)

Ask the user if they want to:
1. **Research** - Use `/research-stack` to generate detailed content
2. **Manual** - Keep the template structure for manual editing
3. **Partial** - Research specific topics only

If they choose research, ask what topics to research, then run `/research-stack` to generate content.

### Step 7: Validation

Validate the result:
- File exists and is readable
- Registered in stack-config.yaml
- YAML syntax is valid
- No duplicate entries

### Step 8: Next Steps

Inform the user the standard was added successfully. Mention they can review the file, customize it, test it with `/start-task`, and commit to version control.

---

## File Locations

| Type | Directory |
|------|-----------|
| Coding Standard | `.claude/your-stack/coding-standards/` |
| Architecture Pattern | `.claude/your-stack/architecture/` |
| Documentation Standard | `.claude/your-stack/documentation-standards/` |
| Design Standard | `.claude/your-stack/design-standards/` |
| Config | `.claude/your-stack/config/` |


---

## Troubleshooting

- **"File already exists"** - Choose a different name, delete/rename the existing file, or use `/research-stack` to update it
- **"Can't update stack-config.yaml"** - Check file permissions and YAML syntax; manually add the entry if needed
- **"Commands don't read new standard"** - Verify the standard is registered in stack-config.yaml, the file is in the correct directory, and is readable via the Read tool

---

## Tips

- Use descriptive kebab-case names (e.g., `design-standards`, not `standards` or `designStandards`)
- One domain per file -- keep standards focused
- Use `/research-stack` to generate content for unfamiliar domains

---

## Related Commands

- `/research-stack` - Generate/update standard content
- `/analyze-standards` - Discover patterns from existing code or docs
- `/verify` - Check code against all standards
- `/start-task` - Build with standards enforcement
