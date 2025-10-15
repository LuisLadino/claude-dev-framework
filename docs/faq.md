# Frequently Asked Questions (FAQ)

Common questions about the Claude Development Framework, answered.

---

## General Questions

### What is this framework?

The Claude Development Framework is a structured system that helps Claude maintain consistent code quality across conversations. It's like giving Claude a memory of your project's standards, architecture patterns, and quality requirements.

Instead of repeating yourself every conversation, Claude automatically follows your documented standards.

### Do I need to pay for anything?

No! The framework is:
- ✅ Free and open source (MIT License)
- ✅ Works with free Claude.ai tier
- ✅ No external services required
- ✅ No subscription fees

Optional paid features:
- Claude Pro (faster responses, more usage)
- MCP server hosting (if you use cloud MCP servers)

### What's the difference between this and GitHub Copilot?

**Different tools, different purposes:**

**GitHub Copilot:**
- IDE autocomplete
- Suggests code as you type
- Works within your editor
- Line-by-line assistance

**This Framework:**
- Full conversational AI
- Enforces project standards
- Works across entire codebase
- Architecture-level guidance
- Can use both tools together!

**Use both:** Copilot for quick completions, Claude + Framework for architecture and complex tasks.

### Does this work with other AI assistants?

Currently designed for Claude specifically. The framework leverages Claude's ability to read project knowledge and follow detailed instructions.

Could be adapted for:
- ChatGPT with custom instructions
- GitHub Copilot Chat
- Other AI coding assistants

But would require modifications to work optimally.

---

## Setup & Configuration

### Where do I put the framework?

In your project root:
```
your-project/
├── .claude/              # ← Framework goes here
├── src/
├── package.json
└── ...
```

Commit `.claude/` to git so your team uses the same standards.

### Can I use this with multiple projects?

Yes! Each project gets its own `.claude/` directory:

```
~/projects/
├── project-a/
│   └── .claude/          # Next.js standards
├── project-b/
│   └── .claude/          # Vue standards
└── project-c/
    └── .claude/          # Svelte standards
```

Each project can have completely different standards.

### Do I need MCP servers?

MCP is optional, but **highly recommended for `/research-stack`**:

**Without MCP (context7):**
- ✅ All commands work
- ✅ Standards enforcement works
- ✅ Quality checks work
- ⚠️ `/research-stack` uses web search only (less accurate)
- ❌ Can't auto-import company docs
- ❌ Can't search entire codebase

**With MCP (context7):**
- ✅ Everything above
- ✅ `/research-stack` fetches official docs directly (highly accurate)
- ✅ Auto-import company docs
- ✅ Search codebase for patterns
- ✅ Connect to databases
- ✅ Access cloud resources

**Recommended setup:** Install context7 for best `/research-stack` results
- See [MCP Setup Guide](./mcp-setup.md)

Start without MCP, add later if needed.

### What if I don't have context7 for `/research-stack`?

**Option 1: Continue with web search (limited)**
- `/research-stack` will use web search as fallback
- Results will be generic summaries, not full official docs
- May be less accurate for framework-specific details
- Good enough for getting started

**Option 2: Install context7 (recommended)**
```bash
# See docs/mcp-setup.md for full instructions
# Quick setup:
1. Install context7: npm install -g @context7/mcp-server
2. Configure Claude Desktop MCP settings
3. Restart Claude
4. Run /research-stack again
```

**Option 3: Use `/import-standards` instead**
- Manually download framework docs
- Use `/import-standards` to convert to framework format
- More work, but doesn't require MCP

**Which should you choose?**
- Just testing? → Continue with web search
- Serious project? → Install context7 (5 minutes)
- Company standards? → Use `/import-standards`

### How do I update the framework?

Use the `/update-framework` command:

```
/update-framework
```

Claude will:
1. Check for latest version on GitHub
2. Download updates to `.claude/commands/`, `.claude/workflows/`, `.claude/templates/`
3. Preserve your `.claude/your-stack/` customizations
4. Show what changed

**Manually:**
```bash
cd your-project
git pull https://github.com/LuisLadino/claude-dev-framework.git main:.claude
```

---

## Usage Questions

### How do I tell Claude to use the framework?

Just mention it once per conversation:

```
I'm using the Claude Development Framework. 
Please read .claude/CLAUDE.md
```

Claude will load the framework and start following your standards.

For subsequent tasks in the same conversation, just use commands:
```
/start-task "Create login form"
```

### What if Claude forgets the standards?

Remind Claude:
```
Please re-read .claude/CLAUDE.md and my stack configuration.
```

Or start fresh:
```
/start-task "Continue working on login form"
```

Commands automatically reload standards.

### Can I use this without commands?

Yes! The standards work even without explicit commands:

```
You: Create a React component for user profile

Claude: [Reads .claude/your-stack/react-standards.md automatically]
        [Creates component following your patterns]
```

Commands provide structure, but aren't required.

### What's the difference between `/start-task` and just asking?

**Just asking:**
```
You: Create a button component

Claude: [Creates component]
        [Might miss some standards]
```

**Using `/start-task`:**
```
You: /start-task "Create a button component"

Claude: 
📋 Standards Check:
- React functional components
- TypeScript strict mode
- Named exports
- Accessibility required

[Creates component]
[Runs quality checklist]
[Ensures all standards met]

✅ Ready to commit
```

`/start-task` is more thorough and shows its work.

---

## Customization Questions

### Can I modify the framework files?

**Yes and no:**

**DON'T modify (read-only):**
```
.claude/
├── CLAUDE.md             # ❌ Framework updates override
├── commands/             # ❌ Framework updates override
├── workflows/            # ❌ Framework updates override
└── templates/            # ❌ Framework updates override
```

**DO modify (yours to customize):**
```
.claude/your-stack/
├── stack-config.yaml     # ✅ Your configuration
├── coding-standards/     # ✅ Your standards
├── architecture/         # ✅ Your patterns
└── documentation-standards/  # ✅ Your requirements
```

**Why?** When you update the framework, only read-only files update. Your customizations never get overwritten.

### How do I override a framework standard?

Create a file with the same name in `.claude/your-stack/`:

**Framework default:**
`.claude/templates/coding-standards/_react.md`
```markdown
Use named exports
```

**Your override:**
`.claude/your-stack/coding-standards/react-standards.md`
```markdown
Use default exports (we prefer this)
```

Your file takes precedence!

### What if my team disagrees on standards?

1. **Discuss and document decisions**
   - Create `.claude/your-stack/architecture/decisions/` folder
   - Add Architecture Decision Records (ADRs)

2. **Start with basics everyone agrees on**
   - Add controversial items later
   - Iterate based on code reviews

3. **Vote and commit**
   - Standards in git
   - Changes need PR approval
   - Team review process

4. **Have escape hatches**
   - Document when to break rules
   - Allow `// @framework-ignore` comments for exceptions

### Can I have different standards per folder?

Not directly, but you can:

**Option 1: Comments in standards**
```markdown
# React Standards

## Component Style

Use functional components.

> Exception: Legacy `src/legacy/` folder uses class components
```

**Option 2: Multiple stack configs** (not currently supported, future feature)

**Option 3: Separate projects**
```
monorepo/
├── packages/
│   ├── new-app/
│   │   └── .claude/        # New standards
│   └── legacy-app/
│       └── .claude/        # Legacy standards
```

---

## Technical Questions

### Does this work with [my framework]?

**Officially supported:**
- React (18+)
- Vue (3+)
- Svelte (4+, 5+)
- Next.js (13+, 14+, 15+)
- Nuxt (3+)
- SvelteKit (1+, 2+)
- Astro (3+, 4+, 5+)
- Angular (15+)
- Solid (1+)

**Should work with any framework!**

Use `/research-stack` to generate standards for any stack.

### Does this work with JavaScript (not TypeScript)?

Yes! The framework adapts to your language choice:

**In `stack-config.yaml`:**
```yaml
stack:
  language: "JavaScript"  # or "TypeScript"
```

Claude will use JavaScript patterns instead of TypeScript.

### Can I use this for backend development?

Absolutely! Configure for your backend stack:

```yaml
stack:
  framework: "Express"     # or Fastify, Nest.js, etc.
  language: "TypeScript"
  testing: "Jest"
  database: "PostgreSQL"
  orm: "Prisma"
```

Create backend-specific standards:
- API design patterns
- Database schema conventions
- Error handling
- Authentication flows

### Does this work with monorepos?

Yes! Each package can have its own `.claude/` directory:

```
monorepo/
├── packages/
│   ├── web/
│   │   └── .claude/      # Frontend standards
│   ├── mobile/
│   │   └── .claude/      # Mobile standards
│   └── api/
│       └── .claude/      # Backend standards
└── shared/
    └── .claude/          # Shared standards
```

Or share one `.claude/` at root if all packages use same standards.

### Can I use this with non-web projects?

Yes! The framework is flexible:

**Examples:**
- Python data science projects
- Rust system programming
- Go microservices
- Mobile apps (React Native, Flutter)
- CLI tools
- Game development

Just configure `stack-config.yaml` for your stack and create appropriate standards.

---

## Team & Collaboration

### How do I share this with my team?

1. **Commit to git:**
   ```bash
   git add .claude/
   git commit -m "Add development framework"
   git push
   ```

2. **Team members clone:**
   ```bash
   git clone your-repo
   cd your-repo
   ```

3. **Start using:**
   ```
   Claude, please read .claude/CLAUDE.md
   ```

That's it! Everyone follows the same standards.

### What about code reviews?

**The framework helps code reviews:**

✅ **Before framework:**
- Reviewer: "We use functional components"
- Reviewer: "Add TypeScript types"
- Reviewer: "Follow our naming conventions"
- Many small corrections

✅ **With framework:**
- Code already follows standards
- Reviews focus on logic and architecture
- Fewer style-related comments
- Faster approval process

**PR template suggestion:**
```markdown
## Checklist

- [ ] Ran `/verify` command
- [ ] All quality checks passed
- [ ] Follows project standards
- [ ] Tests included
- [ ] Documentation updated
```

### How do new team members learn the standards?

**Traditional:**
- Read wiki (if up to date)
- Ask senior devs
- Learn through code reviews
- Trial and error

**With framework:**
- Clone repo
- Claude enforces standards automatically
- Standards documented in code
- Immediate feedback via `/verify`
- Consistency from day one

**Onboarding process:**
1. Clone repository
2. Read `.claude/your-stack/README.md`
3. Try `/start-task "Create hello world component"`
4. See standards in action
5. Start contributing immediately

### Can we customize the framework per developer?

Not recommended. The goal is consistency.

**Instead:**
- Agree on team standards
- Document in `.claude/your-stack/`
- Everyone follows same patterns
- Propose changes via PR

**Exception:**
- Personal automation scripts: `.claude/your-stack/scripts/`
- Can be developer-specific
- Don't affect code standards

---

## Troubleshooting

### Claude isn't following my standards

**Checklist:**
1. ✅ Is the standard file in `.claude/your-stack/`?
2. ✅ Is it listed in `stack-config.yaml` under `standards_active`?
3. ✅ Did you tell Claude to read `.claude/CLAUDE.md`?
4. ✅ Are there conflicting standards?
5. ✅ Is the standard clear and has examples?

**Solution:**
```
/standards

Claude will show what's active. If missing:

Please read .claude/your-stack/coding-standards/my-new-standard.md
```

### The framework is too strict

**If standards are too rigid:**

1. **Update the standards**
   - Edit `.claude/your-stack/coding-standards/`
   - Make them more flexible
   - Add "exceptions" section

2. **Add escape hatches**
   ```markdown
   ## When to Break This Rule
   
   - Legacy code maintenance
   - Third-party library integration
   - Performance-critical sections
   ```

3. **Use comments**
   ```typescript
   // @framework-exception: Using class component for legacy compatibility
   class LegacyComponent extends React.Component {
   ```

### Scripts aren't working / init-stack.sh fails

**Problem:** `./scripts/init-stack.sh` errors or doesn't support your stack

**Solutions:**

**Option 1: Skip scripts entirely (Recommended)**
```bash
# Don't use init-stack.sh at all
# Just tell Claude to set it up:

/research-stack

# Claude will:
# 1. Ask what stack you're using
# 2. Research best practices online
# 3. Generate standards automatically
# 4. Create stack-config.yaml
# 5. Everything just works

# No scripts needed!
```

**Option 2: Manual setup**
```bash
# 1. Create the directory structure
mkdir -p .claude/your-stack/{coding-standards,architecture,documentation-standards,config}

# 2. Create stack-config.yaml manually
cat > .claude/your-stack/stack-config.yaml << EOF
name: "My Project"
version: "1.0.0"

stack:
  framework: "Your Framework"
  language: "Your Language"

standards_active: []
EOF

# 3. Use /research-stack to generate standards
```

**Option 3: Fix script permissions**
```bash
chmod +x scripts/*.sh
./scripts/init-stack.sh
```

**Option 4: Report the issue**
```bash
# If your stack should be supported but isn't:
# Open an issue: https://github.com/LuisLadino/claude-dev-framework/issues
```

**Key Insight:** The scripts are just helpers. The real power is `/research-stack` which works with **any** stack.

---

### Commands aren't working

**Problem:** `/start-task` does nothing

**Solutions:**
1. Check command spelling (case-sensitive)
2. Ensure `.claude/commands/start-task.md` exists
3. Tell Claude: `Please read the command files in .claude/commands/`
4. Try without `/`: `start-task "my task"`

**Fallback: Skip commands, just ask directly**
```
# Instead of:
/start-task "Add login"

# Just say:
Please add a login feature following the standards in .claude/your-stack/
```

Commands are convenience wrappers. You can always ask Claude directly.

### Framework conflicts with company tools

**Problem:** Company has its own linting/formatting

**Solution: Framework complements, doesn't replace:**

```yaml
# stack-config.yaml
project_specifics:
  eslint_config: "@company/eslint-config"
  prettier_config: "@company/prettier-config"
  
  # Framework adds:
  architecture_patterns: true
  quality_enforcement: true
```

Claude follows your ESLint/Prettier rules + framework patterns.

---

## Advanced Questions

### Can I create custom commands?

Yes! Add to `.claude/your-stack/commands/`:

**Example:** `.claude/your-stack/commands/my-command.md`
```markdown
# /my-command

## Purpose
Does something specific to our project

## Workflow
1. Step 1
2. Step 2
3. Step 3

## Usage
`/my-command [arguments]`
```

Tell Claude:
```
I've added a custom command. Please read .claude/your-stack/commands/my-command.md
```

### Can this replace CI/CD?

No, but it complements it:

**CI/CD:** Automated testing and deployment
**This Framework:** Development standards and code generation

**Use together:**
```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint
- name: Type check
  run: npm run type-check
- name: Test
  run: npm test
- name: Verify framework standards
  run: # Could add framework validation
```

### How do I contribute to the framework?

1. Fork the repository
2. Create a feature branch
3. Make improvements
4. Submit pull request
5. Discuss and iterate

**Good contributions:**
- New templates for popular stacks
- Better documentation
- Bug fixes
- New commands
- Example configurations

### Can I sell customized versions?

MIT License allows commercial use!

You can:
- ✅ Sell consulting services
- ✅ Offer customization as a service
- ✅ Include in commercial products
- ✅ Create proprietary extensions

Must:
- ✅ Include original MIT license
- ✅ Credit original authors

---

## Performance & Limits

### Does this slow down Claude?

No. The framework adds minimal overhead:
- Reading markdown files is fast
- Standards loaded once per conversation
- Commands execute normally

You might notice Claude:
- Shows standards check (transparency)
- Verifies quality before committing
- Asks clarifying questions

This is intentional thoroughness, not slowness.

### How big can standards files be?

**Recommended:**
- Each standard file: < 5,000 words
- Total standards: < 50,000 words
- Keep focused and scannable

**Too large?** Split into multiple files:
```
coding-standards/
├── react-components.md
├── react-hooks.md
├── react-testing.md
└── react-patterns.md
```

### What's the token usage?

Framework uses Claude's context window:
- Loading standards: ~5,000-10,000 tokens
- Commands: ~1,000-2,000 tokens each
- Leaves plenty for actual development

**Pro tier:** More context, better for large codebases

---

## Getting Help

### Where can I get support?

1. **Documentation:** This site
2. **GitHub Issues:** [Report bugs](https://github.com/LuisLadino/claude-dev-framework/issues)
3. **Discussions:** [Ask questions](https://github.com/LuisLadino/claude-dev-framework/discussions)
4. **Examples:** `/docs/examples/` directory

### How do I report a bug?

[Create an issue](https://github.com/LuisLadino/claude-dev-framework/issues/new) with:
- What you expected
- What actually happened
- Your `stack-config.yaml`
- Relevant error messages
- Steps to reproduce

### Can I request a feature?

Yes! [Open a discussion](https://github.com/LuisLadino/claude-dev-framework/discussions/new) describing:
- What you want to accomplish
- Why current framework doesn't support it
- Proposed solution (optional)
- Use cases

### Is there a community?

Growing! Connect with other users:
- GitHub Discussions
- Issues and PRs
- Share your configurations
- Contribute templates

---

## Still Have Questions?

- **Read:** [Getting Started Guide](./getting-started.md)
- **Customize:** [Customization Guide](./customization-guide.md)
- **Understand:** [Framework Philosophy](./philosophy.md)
- **Setup Tools:** [MCP Setup Guide](./mcp-setup.md)
- **Ask:** [GitHub Discussions](https://github.com/LuisLadino/claude-dev-framework/discussions)

---

**Can't find your answer? Open a discussion on GitHub!** 💬
