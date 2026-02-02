# Contributing to Claude Development Framework

Thank you for your interest in contributing.

---

## Ways to Contribute

### Report Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/LuisLadino/claude-dev-framework/issues).

Include:
- Clear description of the problem
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (OS, Claude version, etc.)

### Suggest Features

Open an issue with:
- **Use case** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternatives** - What other approaches did you consider?

### Improve Commands

Commands live in `.claude/commands/` organized by category:
- `coding-framework/` - Development workflow commands
- `standards-management/` - Standards enforcement commands
- `utilities/` - Helper commands

### Improve Documentation

- Fix typos or unclear explanations
- Add examples
- Improve existing docs

---

## Getting Started

### 1. Fork the Repository

Click "Fork" on [GitHub](https://github.com/LuisLadino/claude-dev-framework).

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/claude-dev-framework.git
cd claude-dev-framework
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes

### 4. Make Changes

See [Development Process](#development-process) for guidelines.

### 5. Test Your Changes

- Walk through the complete flow
- Check edge cases
- Verify error handling
- Proofread for typos

---

## Development Process

### Understanding the Structure

```
claude-dev-framework/
├── .claude/
│   ├── CLAUDE.md                          # Framework instructions
│   ├── framework-source.txt               # Update source URL
│   ├── commands/
│   │   ├── coding-framework/              # Development commands
│   │   ├── standards-management/          # Standards commands
│   │   └── utilities/                     # Helper commands
│   ├── config/                            # Operational config
│   └── your-stack/                        # User customizations
├── scripts/
│   ├── install.sh                         # Installation script
│   └── uninstall.sh                       # Removal script
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

### Editing Commands

Commands are in `.claude/commands/<category>/*.md`.

**Command file structure:**
- Clear purpose statement
- Step-by-step workflow
- User interaction points
- Error handling
- Examples

**Keep commands:**
- Stack-agnostic (use placeholders)
- User-friendly (clear instructions)
- Robust (handle edge cases)

---

## Submitting Changes

### Before Submitting

- [ ] Test your changes work
- [ ] Documentation is updated
- [ ] No typos
- [ ] Follows the standards above
- [ ] Commit messages are clear

### Commit Messages

Format: `type(scope): description`

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `refactor` - Code refactor
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(commands): add new utility command"
git commit -m "fix(install): handle missing git directory"
git commit -m "docs(readme): update command list"
```

### Create a Pull Request

1. Push your branch:
```bash
git push origin feature/your-feature-name
```

2. Create a Pull Request on GitHub with:
   - What changed
   - Why it changed
   - How to test it

---

## Questions?

- **General questions**: [Open a discussion](https://github.com/LuisLadino/claude-dev-framework/discussions)
- **Bug reports**: [Open an issue](https://github.com/LuisLadino/claude-dev-framework/issues)

---

## Code of Conduct

### Our Standards

**Expected behavior:**
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

**Unacceptable behavior:**
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks

Report issues to: [Open an issue with "Code of Conduct" label]
