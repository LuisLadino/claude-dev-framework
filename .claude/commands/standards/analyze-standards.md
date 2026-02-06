# /analyze-standards - Import Standards from Documentation

Import coding standards from external documentation into the framework format.

**Use this when:** Your team has existing standards docs (wiki, handbook, PDF) that you want to convert to `.claude/your-stack/` files.

**Don't use this when:** You want to discover patterns from code → use `/sync-stack` instead (it analyzes code patterns automatically).

---

## Usage

```
/analyze-standards                    # Interactive
/analyze-standards [url]              # Import from URL
/analyze-standards [file-path]        # Import from local file
```

---

## How It Works

### Step 1: Source

Ask where the standards documentation is:
1. **URL** - Fetch with WebFetch
2. **Local file** - Read markdown, text, or other docs
3. **Paste** - User pastes content directly

### Step 2: Extract

Read the document and extract:
- Coding conventions
- Naming patterns
- File organization rules
- Testing requirements
- Architecture guidelines

### Step 3: Convert

Convert extracted rules to framework format:
- Create standards files in `.claude/your-stack/`
- Use consistent markdown structure
- Add to `standards_active` in stack-config.yaml

### Step 4: Resolve Conflicts

If imported rules conflict with existing standards:
1. Show the conflict (existing vs imported)
2. Ask: Use imported / Keep existing / Skip

### Step 5: Confirm

Show summary of created/updated files. Ask user to review before saving.

---

## Output

Creates or updates files in `.claude/your-stack/`:
- `coding-standards/[name]-standards.md`
- `architecture/[name].md`
- Updates `stack-config.yaml`

---

## Tips

- Review generated files before committing
- Edit to match your actual practices
- Remove any sensitive info from source docs before importing
