# Helper Scripts

This directory contains helper scripts to automate common framework tasks.

**Version:** 1.0.0  
**Last Updated:** 2025-01-09

---

## Overview

These bash scripts make it easy to:
- Initialize the framework for a new project
- Import existing company documentation
- Update to the latest framework version
- Validate your setup is correct

All scripts are designed to preserve your customizations in `.claude/your-stack/` while updating framework files.

---

## Scripts

### 1. init-stack.sh

**Purpose:** Initialize the framework for a new project with your specific tech stack.

**When to use:**
- Starting a new project
- First-time framework setup
- Switching to a different stack

**What it does:**
- Asks about your tech stack (framework, language, styling, testing)
- Creates `.claude/your-stack/stack-config.yaml`
- Copies relevant template files
- Sets up initial standards files
- Configures git ignore rules

**Usage:**
```bash
./scripts/init-stack.sh
```

**Interactive prompts:**
- Project name
- Framework (React, Vue, Svelte, Next.js, etc.)
- Language (TypeScript/JavaScript)
- Styling solution (Tailwind, CSS Modules, etc.)
- Testing framework (Vitest, Jest, etc.)
- Package manager (npm, pnpm, yarn, bun)
- Import alias and directories

**Output:**
- `.claude/your-stack/stack-config.yaml` - Your stack configuration
- `.claude/your-stack/coding-standards/` - Initial standards files
- `.claude/your-stack/architecture/` - File structure templates
- `.claude/your-stack/documentation-standards/` - Doc templates

**Example:**
```bash
$ ./scripts/init-stack.sh

Claude Development Framework - Stack Initialization

Project name: My Awesome App
Select your framework:
  1) React
  2) Vue
  ...
Choice [1-11]: 1

Language (TypeScript/JavaScript) [TypeScript]: 
...

✓ Framework Initialized Successfully!
```

---

### 2. import-company-standards.sh

**Purpose:** Import existing company documentation into the framework format.

**When to use:**
- Joining a new company
- Adding company-specific standards to framework
- Migrating from existing docs to framework

**What it does:**
- Backs up current setup
- Imports documentation files
- Handles file conflicts (overwrite/skip/merge)
- Updates stack configuration with import metadata

**Usage:**
```bash
./scripts/import-company-standards.sh
```

**Import modes:**
1. **Single file** - Import one documentation file
2. **Directory** - Import all files from a directory
3. **Multiple files** - Import multiple files interactively

**Supported formats:**
- Markdown (.md)
- Text files (.txt)

**Target locations:**
- Coding standards → `.claude/your-stack/coding-standards/`
- Architecture → `.claude/your-stack/architecture/`
- Documentation standards → `.claude/your-stack/documentation-standards/`
- Testing standards → `.claude/your-stack/testing-standards/`

**Example:**
```bash
$ ./scripts/import-company-standards.sh

What would you like to import?
  1) Single file
  2) Directory of files
  3) Multiple files (interactive)
Choice [1-4]: 1

Path to documentation file: ~/company-docs/react-standards.md
What type of documentation is this?
  1) Coding standards
  ...
Choice [1-4]: 1

✓ Import Complete!
```

**Conflict resolution:**
- **Overwrite**: Replace existing file
- **Skip**: Keep existing file
- **Merge**: Combine both files (recommended)

**Rollback:**
Backups are automatically created in `.claude/backups/`

---

### 3. validate-setup.sh

**Purpose:** Validate that your framework setup is complete and correct.

**When to use:**
- After initial setup
- After importing standards
- After framework update
- Before starting development
- Troubleshooting issues

**What it checks:**

**Directory Structure:**
- Core framework directories exist
- Your-stack directory is present

**Core Files:**
- CLAUDE.md exists and has content
- Stack configuration is present

**Commands:**
- All 7 commands are available
- Command files are not empty

**Stack Configuration:**
- Project name set
- Framework configured
- Language configured
- Styling and testing configured

**Standards Files:**
- Standards directories exist
- Files are present in directories

**Tool Integration:**
- Tool catalog exists
- Integration guides present

**Scripts:**
- All helper scripts exist
- Scripts are executable

**Git Configuration:**
- .gitignore exists
- Your-stack is ignored

**Common Issues:**
- No legacy structures
- No conflicting files
- YAML syntax is valid

**Usage:**
```bash
./scripts/validate-setup.sh
```

**Example output:**
```bash
$ ./scripts/validate-setup.sh

Claude Development Framework - Setup Validation

━━━ Directory Structure ━━━
  Main .claude directory exists ... ✓ PASS
  Commands directory exists ... ✓ PASS
  Workflows directory exists ... ✓ PASS
  ...

━━━ Validation Summary ━━━
  Total Checks:    45
  Passed:          42
  Warnings:        3
  Failed:          0

  Health Score:    93%
  ✓ Excellent! Your setup is in great shape.

Recommended Next Steps:
  • Generate standards for your stack:
    Use /research-stack command in Claude
```

**Exit codes:**
- `0` - All checks passed (may have warnings)
- `1` - One or more checks failed

**Use in CI/CD:**
```bash
# Validate setup in CI pipeline
./scripts/validate-setup.sh || exit 1
```

---

## Workflow Examples

### Starting Fresh

```bash
# 1. Clone framework
git clone <framework-repo> my-project
cd my-project

# 2. Initialize for your stack
./scripts/init-stack.sh

# 3. Validate setup
./scripts/validate-setup.sh

# 4. Start coding with Claude
# Use /start-task command
```

### Joining a Company

```bash
# 1. Clone framework
git clone <framework-repo> my-project
cd my-project

# 2. Initialize for company stack
./scripts/init-stack.sh

# 3. Import company docs
./scripts/import-company-standards.sh

# 4. Validate
./scripts/validate-setup.sh

# 5. Start coding with Claude
```

### Keeping Updated

```bash
# Validate setup
./scripts/validate-setup.sh
```

### Troubleshooting

```bash
# Something not working?
./scripts/validate-setup.sh

# Check what's wrong
# Fix issues based on output

# If needed, re-initialize
./scripts/init-stack.sh
```

---

## Requirements

### System Requirements

- **Operating System:** Linux, macOS, or WSL on Windows
- **Shell:** Bash 4.0+
- **Git:** Required for update script

### Optional Tools

- `yamllint` - For YAML validation in validate script
  ```bash
  pip install yamllint
  ```

### Permissions

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

Or make all at once:
```bash
find scripts -name "*.sh" -exec chmod +x {} \;
```

---

## Customization

### Modifying Scripts

Feel free to customize scripts for your needs:

1. **Add custom validations:**
   ```bash
   # In validate-setup.sh
   validate_custom_rules() {
     print_check "Custom rule passes"
     if [ your-condition ]; then
       print_pass
     else
       print_fail "Custom rule failed"
     fi
   }
   ```

3. **Modify prompts:**
   Edit the interactive prompts in any script to match your workflow.

### Adding New Scripts

Follow this structure:
```bash
#!/bin/bash
set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper functions
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

# Main function
main() {
  # Your logic here
}

main
```

---

## Troubleshooting

### Script won't run

**Problem:** Permission denied

**Solution:**
```bash
chmod +x scripts/scriptname.sh
```

### Import fails

**Problem:** File not found or permission issues

**Solution:**
```bash
# Check file path
ls -la path/to/file

# Check permissions
chmod +r path/to/file
```

### Update fails

**Problem:** Git errors or connection issues

**Solution:**
```bash
# Check git configuration
git config --list

# Test network
ping github.com

```

### Validation fails

**Problem:** Missing files or configuration

**Solution:**
```bash
# Re-run initialization
./scripts/init-stack.sh

# Check output for specific issues
./scripts/validate-setup.sh

# Fix issues one by one
```

---

## Best Practices

1. **Always validate after changes:**
   ```bash
   ./scripts/validate-setup.sh
   ```

2. **Keep backups:**
   Scripts automatically create backups, but you can also:
   ```bash
   cp -r .claude/your-stack .claude/your-stack.backup
   ```

3. **Version control:**
   ```bash
   # Track framework files
   git add .claude/commands/ .claude/workflows/
   
   # Ignore customizations (already in .gitignore)
   # .claude/your-stack/ stays local
   ```

4. **Document customizations:**
   ```bash
   # Add notes to your standards files
   vim .claude/your-stack/coding-standards/notes.md
   ```

---

## Support

### Getting Help

1. **Check validation output:**
   ```bash
   ./scripts/validate-setup.sh
   ```

2. **Review framework documentation:**
   - `README.md` - Main framework docs
   - `.claude/README.md` - Framework structure
   - `docs/` - Detailed guides

3. **Check common issues:**
   Each script includes error messages with solutions

### Contributing

Found a bug or have an improvement?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## Changelog

### 1.0.0 (2025-01-09)
- Initial release
- Added init-stack.sh
- Added import-company-standards.sh
- Added update-framework.sh
- Added validate-setup.sh

---

## License

These scripts are part of the Claude Development Framework.

See `LICENSE` file in project root for details.

---

**Happy automating! 🚀**

*These scripts make framework setup and maintenance a breeze.*
