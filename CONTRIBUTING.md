# Contributing to Claude Development Framework

Thank you for your interest in contributing! This framework gets better with community input.

---

## Table of Contents

1. [Ways to Contribute](#ways-to-contribute)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Standards for the Framework](#standards-for-the-framework)
5. [Submitting Changes](#submitting-changes)
6. [Adding Stack Templates](#adding-stack-templates)
7. [Questions](#questions)

---

## Ways to Contribute

### Report Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/LuisLadino/claude-dev-framework/issues).

**Good issues include:**
- Clear description of the problem
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (OS, Claude version, etc.)

### Suggest Features

Have an idea for improvement? We'd love to hear it!

Open an issue with:
- **Use case** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternatives** - What other approaches did you consider?

### Improve Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples
- Write guides for new use cases
- Improve existing docs

### Add Stack Templates

Know a stack well? Contribute templates:
- Framework-specific best practices
- Coding standards
- Architecture patterns
- Testing strategies

See [Adding Stack Templates](#adding-stack-templates) below.

### Improve Workflows

Make the framework smarter:
- Better research workflows
- Improved command flows
- New quality checks
- Tool integrations

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
- `template/stack-name` - New stack templates

### 4. Make Changes

Edit the files as needed. See [Development Process](#development-process) for guidelines.

### 5. Test Your Changes

For templates:
- Test with a real project
- Verify standards are clear
- Ensure examples work

For workflows:
- Walk through the complete flow
- Check edge cases
- Verify error handling

For docs:
- Proofread for typos
- Check all links work
- Verify code examples are accurate

---

## Development Process

### Understanding the Structure

```
claude-dev-framework/
├── .claude/                    # Core framework
│   ├── commands/               # Slash commands
│   ├── templates/              # Stack templates
│   ├── workflows/              # Intelligent workflows
│   └── tools/                  # Tool integration docs
├── docs/                       # User documentation
├── scripts/                    # Helper scripts
└── [tracking files]            # Project management
```

### Editing Commands

Commands are in `.claude/commands/*.md`.

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

### Editing Templates

Templates are in `.claude/templates/`.

**Template requirements:**
- Prefix with `_` (e.g., `_react-standards.md`)
- Include placeholder markers: `[YOUR_STACK]`, `[PROJECT_NAME]`
- Provide customization instructions
- Show real examples
- Explain the "why" behind standards

### Editing Documentation

Docs are in `docs/`.

**Documentation standards:**
- Use clear, simple language
- Provide practical examples
- Include code snippets
- Link to related docs
- Test all commands/code

---

## Standards for the Framework

When contributing code or documentation to the framework itself:

### Writing Style

**Do:**
- Be direct and practical
- Use "you" to address users
- Provide real examples
- Explain the "why"
- Be encouraging

**Don't:**
- Use buzzwords or jargon without explanation
- Make assumptions about user skill level
- Skip error cases
- Be condescending
- Use "enterprise" language

### Markdown Formatting

```markdown
# H1 for main title only
## H2 for major sections
### H3 for subsections

Use **bold** for emphasis, not _italics_.

Code blocks should specify language:
\`\`\`bash
command here
\`\`\`

Lists use `-` for bullets, not `*`.
```

### Code Examples

All code examples must:
- Work as shown (tested)
- Include comments explaining purpose
- Show realistic scenarios
- Demonstrate best practices

### File Organization

New files should:
- Have a clear, descriptive name
- Include a purpose statement at the top
- Be placed in the logical directory
- Be referenced in relevant docs

---

## Submitting Changes

### Before Submitting

- [ ] Test your changes work
- [ ] Documentation is updated
- [ ] Links all work
- [ ] No typos
- [ ] Follows the standards above
- [ ] Commit messages are clear

### Commit Messages

Format: `type(scope): description`

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `template` - Stack template addition/update
- `refactor` - Code refactor
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(commands): add research-stack command"
git commit -m "docs(getting-started): add Next.js example"
git commit -m "template(vue): add Vue 3 composition API template"
git commit -m "fix(verify): handle missing config gracefully"
```

### Create a Pull Request

1. Push your branch:
```bash
git push origin feature/your-feature-name
```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template:
   - What changed
   - Why it changed
   - How to test it
   - Screenshots (if applicable)

### PR Review Process

**What we look for:**
- Clear value proposition
- Follows framework standards
- Documentation included
- Works as described
- No breaking changes (or clearly documented)

**Timeline:**
- Initial review: Within 1 week
- Follow-up: 2-3 days between rounds
- Merge: When all feedback addressed

---

## Adding Stack Templates

Stack templates are highly valuable contributions!

### Template Structure

```
.claude/templates/coding-standards/_[framework]-standards.md
```

Example: `_vue-standards.md`

### What to Include

**1. Component Patterns**
```markdown
## Component Structure

Components should use Composition API:

\`\`\`vue
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
\`\`\`

Why: Composition API provides better TypeScript support and is more flexible.
```

**2. File Organization**
```markdown
## File Structure

src/
├── components/
│   └── [feature]/
│       ├── ComponentName.vue
│       └── ComponentName.spec.ts
```

**3. Naming Conventions**
```markdown
## Naming

- Components: PascalCase (UserProfile.vue)
- Composables: camelCase with 'use' prefix (useUserData.ts)
- Types: PascalCase (UserProfile)
```

**4. Best Practices**
```markdown
## State Management

Use Pinia for global state:

\`\`\`typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // setup composition API style
})
\`\`\`

Why: Pinia is Vue 3's official state manager and has excellent TypeScript support.
```

**5. Testing Patterns**
```markdown
## Testing

Test behavior, not implementation:

\`\`\`typescript
it('should display user name when loaded', async () => {
  // Test goes here
})
\`\`\`
```

### Template Checklist

- [ ] Uses framework-specific best practices (not generic)
- [ ] Explains the "why" behind patterns
- [ ] Includes realistic code examples
- [ ] Covers file structure
- [ ] Addresses state management
- [ ] Shows testing patterns
- [ ] Has clear headings
- [ ] References official docs where relevant

### Submitting a Template

1. Create the template in `.claude/templates/coding-standards/`
2. Add examples to `docs/examples/[framework]/`
3. Update `docs/getting-started.md` to mention the framework
4. Submit PR with description of the stack and why this template is valuable

---

## Questions?

- **General questions**: [Open a discussion](https://github.com/LuisLadino/claude-dev-framework/discussions)
- **Bug reports**: [Open an issue](https://github.com/LuisLadino/claude-dev-framework/issues)
- **Security concerns**: [Create a security advisory](https://github.com/LuisLadino/claude-dev-framework/security/advisories)

---

## Recognition

Contributors will be:
- Listed in CHANGELOG.md for their contributions
- Mentioned in release notes
- Credited in relevant documentation

Significant contributions may result in becoming a maintainer!

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
- Publishing others' private information

### Enforcement

Violations will result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: [Open an issue with "Code of Conduct" label]

---

## Thank You!

Every contribution makes this framework better for everyone. Whether it's a typo fix, a new template, or a major feature—thank you for being part of this project! 🙏

---

**Happy contributing!** 🚀