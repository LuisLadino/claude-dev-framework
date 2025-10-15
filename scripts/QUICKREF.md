# Helper Scripts - Quick Reference

**Version:** 1.0.0

Quick reference for Claude Development Framework helper scripts.

---

## Commands

### Initialize New Project
```bash
./scripts/init-stack.sh
```
Sets up framework for your tech stack. Interactive prompts for framework, language, styling, testing.

**Use when:** Starting new project, first-time setup

---

### Import Company Standards
```bash
./scripts/import-company-standards.sh
```
Import existing documentation into framework format. Handles single files, directories, or multiple files.

**Use when:** Joining new company, migrating docs

---

### Update Framework
```bash
./scripts/update-framework.sh
```
Update to latest framework version. Preserves your customizations, creates backups.

**Use when:** New version available, monthly maintenance

---

### Validate Setup
```bash
./scripts/validate-setup.sh
```
Check that everything is configured correctly. 45+ checks, health score, recommendations.

**Use when:** After setup, before starting work, troubleshooting

---

## Common Workflows

### Starting Fresh
```bash
./scripts/init-stack.sh          # Configure
./scripts/validate-setup.sh       # Verify
# Use /start-task in Claude
```

### Company Onboarding
```bash
./scripts/init-stack.sh                              # Configure
./scripts/import-company-standards.sh                # Import docs
./scripts/validate-setup.sh                          # Verify
```

### Maintenance
```bash
./scripts/update-framework.sh    # Update
./scripts/validate-setup.sh       # Verify
```

### Troubleshooting
```bash
./scripts/validate-setup.sh       # Diagnose
# Fix issues per output
./scripts/validate-setup.sh       # Re-verify
```

---

## File Locations

**Scripts:** `scripts/*.sh`

**Your Customizations:** `.claude/your-stack/`
- `stack-config.yaml` - Your configuration
- `coding-standards/` - Your standards
- `architecture/` - Your patterns
- `documentation-standards/` - Your docs

**Framework Files:** `.claude/commands/`, `.claude/workflows/`, etc.

**Backups:** `.claude/backups/`

---

## Important Notes

✅ **Customizations are preserved** - Your `.claude/your-stack/` is never touched by updates

✅ **Backups are automatic** - Created before any changes

✅ **Rollback is simple** - Instructions provided after operations

✅ **Validation is safe** - Read-only, makes no changes

---

## Exit Codes

| Code | Meaning | Scripts |
|------|---------|---------|
| 0 | Success | All |
| 1 | Failed/Error | All |

**Use in scripts:**
```bash
./scripts/validate-setup.sh || exit 1
```

---

## Requirements

- Bash 4.0+
- Git (for update script)
- Optional: yamllint (for YAML validation)

**Make executable:**
```bash
chmod +x scripts/*.sh
```

---

## Getting Help

**Detailed docs:** See `scripts/README.md`

**Framework docs:** See main `README.md`

**Validation:** Run `./scripts/validate-setup.sh`

---

## Quick Tips

💡 **Always validate after changes**
```bash
./scripts/validate-setup.sh
```

💡 **Keep backups** - Scripts do this automatically, but you can also:
```bash
cp -r .claude/your-stack .claude/your-stack.backup
```

💡 **Update regularly** - Monthly or quarterly
```bash
./scripts/update-framework.sh
```

💡 **Check health score** - Should be 90%+
```bash
./scripts/validate-setup.sh
# Look for "Health Score: XX%"
```

---

**Need more details?** See `scripts/README.md`

**Print this card** for quick reference while working!
