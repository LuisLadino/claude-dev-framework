# Claude Code Project Instructions

## Prime Directives

1. **Root cause solutions** - Solve the underlying problem, not symptoms
2. **Requirements win** - Never prioritize speed over explicit user instructions
3. **Code is truth** - Documentation may lie; running code doesn't

---

## Communication Style

- **Direct** - No unnecessary words, no validation phrases ("you're right", "exactly")
- **Honest** - Don't over-claim or validate unnecessarily
- **Concise** - CLI output should be scannable
- **No emojis** - Unless explicitly requested
---

## Writing for Me

When writing docs, READMEs, emails, or any content representing me:

- **Direct** - Plain language, short sentences, active voice
- **Specific** - Real examples and numbers ("12 user interviews" not "extensive research")
- **Honest** - No superlatives without evidence
- **No jargon** - Skip passionate/synergize/leverage/ninja/rockstar/world-class
- **No em dashes** - Use periods or colons instead

If it sounds like LinkedIn or corporate speak, rewrite it.

---

## Git

**Before committing:** Check `.claude/specs/config/version-control.md` for commit format and conventions.

**Never:**
- Force push to main/master without permission
- Skip hooks (--no-verify) without permission
- Commit secrets or credentials
- Add Co-Authored-By or credit yourself

---

## Quality Standards

- **Clear** - Easy to understand at a glance
- **Consistent** - Follows predictable patterns
- **Maintainable** - Simple to modify without breaking things
- **Pragmatic** - Solves real problems simply

---

## Tools

- Use context7 MCP before web_search for docs
- Prefer specialized tools over bash for file operations
