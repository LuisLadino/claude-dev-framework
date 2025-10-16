# Development Guidelines

**Stack:** Loaded from `.claude/your-stack/stack-config.yaml`

---

## Tool Integration

Before any coding task, you have access to:

- **`project_knowledge_search`** - Search this project's standards and documentation
- **`web_search`** - Research best practices, documentation, and current information
- **MCP servers** (if configured) - Access external resources like company docs
- **File system access** - Read and write project files

**IMPORTANT: Check for MCP servers before starting tasks**

MCP servers provide specialized capabilities. Always check if relevant MCP tools are available:

- **context7** - For documentation research (better than web_search for official docs)
- **Company-specific MCPs** - Internal documentation, APIs, databases
- **Specialized MCPs** - GitHub, Slack, Jira, etc.

**Before using web_search for documentation, check if context7 is available.**

Use these tools to:

- Research unfamiliar patterns before implementing
- Find authoritative documentation (prefer context7 over web_search when available)
- Verify standards match current best practices
- Import external standards when needed
- Access company-specific resources via configured MCPs

---

## Prime Directive

**Focus on root cause solutions, not temporary fixes.**

**Never prioritize speed/efficiency over following explicit user instructions—when requirements conflict with efficiency, requirements always win.**

Build code that is:

- **Clear** - Easy to understand at a glance
- **Consistent** - Follows predictable patterns
- **Maintainable** - Simple to modify without breaking things
- **Well-Documented** - Explains _why_, not _what_ (code shows what)
- **Pragmatic** - Solves real problems simply

---

## Required Reading

Before writing ANY code, read the standards from `.claude/your-stack/`:

### Coding Standards

Read all files in `.claude/your-stack/coding-standards/`:

- Framework-specific patterns (React, Vue, etc.)
- Language standards (TypeScript, JavaScript, etc.)
- Styling conventions
- Any stack-specific patterns

### Documentation Standards

Read files in `.claude/your-stack/documentation-standards/`:

- How to comment code
- Component documentation requirements

### Architecture

Read files in `.claude/your-stack/architecture/`:

- File structure and organization
- Component patterns and composition
- Testing strategies

### Operational Standards

**CRITICAL: Read operational standards BEFORE performing the corresponding action:**

**Before committing code:**
- `.claude/config/version-control.md` - Git workflow and commit message format
- Use `project_knowledge_search` to read this file before EVERY commit

**Before deploying:**
- `.claude/config/deployment.md` - Deployment process and checklist
- Use `project_knowledge_search` to read this file before any deployment

**Before environment setup:**
- `.claude/config/environment.md` - Development environment requirements
- Use `project_knowledge_search` to read this file when setting up or troubleshooting environment

**If a standards file doesn't exist:** Note that it's missing and proceed using framework best practices, then inform the user.

**Use `project_knowledge_search` to find and read these files BEFORE taking the corresponding action.**

---

## Task-to-Standards Mapping

**This framework's power comes from reading the right standards for each action.**

**For EVERY task, identify what you're about to do, then load the corresponding standards:**

| Action You're Taking | Standards Files to Read |
|---------------------|-------------------------|
| **Writing code** | framework-standards.md, language-standards.md, styling-standards.md |
| **Committing changes** | version-control.md (commit format, pre-commit checks) |
| **Running tests** | testing-standards.md |
| **Adding documentation** | documentation-standards/ (code-comments.md, component-docs.md) |
| **Organizing files** | architecture/file-structure.md |
| **Setting up environment** | environment.md |
| **Deploying** | deployment.md |
| **API work** | api-standards.md (if exists) |
| **Database work** | database-standards.md (if exists) |

**Pattern to follow:**
1. Identify the action: "I'm about to [commit/test/deploy/code]"
2. Find corresponding standards file from table above
3. Use `project_knowledge_search` to read it
4. Apply the standards from that file
5. Show user what you read in Standards Check

**If standards file doesn't exist:** Inform user and proceed with framework best practices.

---

## MANDATORY Workflow

**BEFORE any coding task, you MUST:**

### 1. Understand the Stack

Read `.claude/your-stack/stack-config.yaml` to understand:

- What framework is being used
- What language standards apply
- Which standards files are active
- Project-specific conventions

### 2. Read Relevant Standards

Use `project_knowledge_search` to read:

- Standards files that apply to this task
- Existing patterns in the codebase
- Project-specific requirements

### 3. Show Standards Check

Display this checklist to the user:

```
📋 **Standards Check**

**Task:** [Describe what you're about to do in detail]

**Stack Configuration:**
- Framework: [from stack-config.yaml]
- Language: [from stack-config.yaml]
- Key Technologies: [from stack-config.yaml]

**Standards Read:**
- [standard file 1]: [key points relevant to this task]
- [standard file 2]: [key points relevant to this task]
- [standard file 3]: [key points relevant to this task]

**Workflow:**
- Read existing code patterns: [✓ or description]
- Verified approach matches standards: [✓ or description]
- Plan validated: [✓ or description]

**MCP Tool Usage:**
- [ ] Checked if MCP servers are available and needed for this task
- [ ] Using context7 for documentation research (if available)
- [ ] Using appropriate MCP tools for external data/APIs (if needed)

**Quality Checklist** (will verify when done):
- [ ] Follows patterns from standards files
- [ ] Matches language conventions (TypeScript strict mode, etc.)
- [ ] Uses established project patterns
- [ ] Comments explain _why_, not _what_
- [ ] Tests included (if applicable)
- [ ] Formatted per project standards
- [ ] No debug code (console.log, etc.)
- [ ] Responsive (if UI work)
- [ ] Accessible (if UI work)

Is this approach correct? Should I proceed?
```

**WAIT for user approval before proceeding.**

### 4. Execute the Task

Follow the standards exactly as documented. If standards conflict or are unclear:

- Ask for clarification
- Use `web_search` to research best practices
- Suggest the best approach and explain reasoning

### 5. Verify Before Completion

Before marking work complete, verify:

- Code follows all applicable standards
- Quality checklist items are met
- All functionality works as requested
- Nothing was changed that shouldn't have been

### 6. Commit Properly

**Before committing, read version control standards:**

Use `project_knowledge_search` to read:
```
Query: "version control standards commit format"
```

From `.claude/config/version-control.md`, extract:
- Commit message format (type, scope, message structure)
- Pre-commit checklist requirements
- What should/shouldn't be committed

**Then apply those standards:**
- Use conventional commit format (from version-control.md)
- Include meaningful commit messages
- Stage only related changes
- Follow pre-commit checklist from standards file

---

## Code Verification Requirements

**Before writing any code, you MUST:**

### Find Working Examples

- Search the codebase for similar patterns
- Verify imports match actual file locations
- Check tsconfig.json (or equivalent) for path aliases
- Test patterns on small scale before large implementation

### Verify Against Reality

- **Code is the source of truth**, not documentation
- Cross-check documentation against actual implementation
- If docs say one thing but code does another, code wins
- Ask user if discrepancies are found

### Detect Anti-Patterns

Watch for these common mistakes:

- ❌ Using non-existent files or imports
- ❌ Using relative imports when aliases exist
- ❌ Missing required directives (client-side hydration, etc.)
- ❌ Hard-coded values when config/tokens exist
- ❌ Copying bad patterns without understanding
- ❌ Implementing only partial functionality
- ❌ Adding features beyond what was requested
- ❌ Changing unrelated code

---

## Enforcement

### If Standards Are Skipped

If you skip the Standards Check or don't wait for approval:

**User will say: "Standards?"**

When this happens:

1. **Stop immediately**
2. Acknowledge what was violated
3. Show the complete Standards Check that should have been shown
4. Wait for approval
5. Restart properly

### Communication Style

- Be direct and clear
- Skip agreement/validation phrases ("you're right", "exactly", "great question", "you're absolutely right")
- Explain decisions when relevant
- Ask questions when unclear
- Never be condescending
- Admit uncertainty when appropriate

---

## Tool Usage Guidelines

### project_knowledge_search

Use to:

- Find standards files in `.claude/your-stack/`
- Search for existing patterns
- Look up configuration details
- Find examples in the codebase

**Example:**

```
project_knowledge_search("react component patterns")
```

### web_search

Use to:

- Research best practices for unfamiliar stack
- Find official documentation
- Verify current best practices
- Look up specific APIs or features

**Example:**

```
web_search("Next.js 15 app router best practices")
```

**Important:** Always cite sources when using web research results.

### MCP Servers (if configured)

- `context7` - Access external documentation
- `filesystem` - Read project files
- Others as configured in stack-config.yaml

Check `.claude/tools/mcp-integration.md` for setup and usage.

---

## Adapting to Different Stacks

This framework works with any stack. The key is `.claude/your-stack/`:

### For React Projects

Standards in your-stack/ should cover:

- Component patterns (functional, hooks)
- Props and TypeScript interfaces
- State management
- File organization

### For Vue Projects

Standards in your-stack/ should cover:

- Composition API vs Options API
- Component structure
- Composables
- File organization

### For Any Framework

Standards in your-stack/ should cover:

- Framework-specific patterns
- Language conventions
- Testing approach
- File structure

**The framework adapts by reading your standards, not by hardcoding assumptions.**

---

## Quality Standards (Universal)

Regardless of stack, all code must:

### Clarity

- Variable names are descriptive
- Logic is simple and straightforward
- One responsibility per function/component
- Self-documenting structure

### Consistency

- Same patterns used throughout
- Consistent naming conventions
- Consistent file organization
- Consistent code style

### Maintainability

- Easy to modify
- Dependencies clear
- No tight coupling
- Well-organized

### Documentation

- Comments explain WHY (code shows WHAT)
- Complex logic is explained
- Non-obvious decisions documented
- Public APIs have clear documentation

### Testing (if applicable)

- Tests verify behavior, not implementation
- Critical paths tested
- Edge cases covered
- Tests are readable

---

## Working with AI Tools

### When Using web_search

1. **Verify the source** - Prefer official documentation
2. **Check recency** - Is this current for your stack version?
3. **Validate against standards** - Does it match your project patterns?
4. **Cite your sources** - Always mention where information came from

### When Uncertain

If you're unsure about:

- **Standards** - Ask the user for clarification
- **Approach** - Propose options and explain trade-offs
- **Patterns** - Search for examples in the codebase
- **Best practices** - Use web_search to research

**Never guess or make assumptions about critical decisions.**

---

## Stack-Specific Behaviors

### Loading Stack Configuration

At the start of any session:

1. Search for `.claude/your-stack/stack-config.yaml`
2. Load the stack configuration
3. Understand which standards are active
4. Note any project-specific settings

### If Configuration is Missing

If stack-config.yaml doesn't exist:

1. Inform the user
2. Suggest running initialization workflow
3. Ask what stack they're using
4. Offer to help set up configuration

---

## Summary

This framework ensures quality by:

1. **Reading standards** before any action (coding, committing, deploying, testing)
2. **Showing your plan** to the user
3. **Getting approval** before executing
4. **Following standards** exactly
5. **Verifying quality** before completion
6. **Committing properly** by reading version-control.md first

The framework adapts to any stack by reading `.claude/your-stack/` configuration and standards.

**The goal: Professional, consistent code regardless of what you're building.**

**Key principle: Every action has a corresponding standards file. Always read it first using `project_knowledge_search`.**

---

## Quick Reference

**Before coding:**

- Read stack-config.yaml
- Search for relevant standards
- Show standards check
- Wait for approval

**During coding:**

- Follow standards exactly
- Search for existing patterns
- Verify imports and paths
- Build incrementally

**Before completion:**

- Run quality checks
- Verify all requested features
- Format and lint
- Test if applicable

**When committing:**

- Read version-control.md first using project_knowledge_search
- Extract commit message format from standards file
- Follow pre-commit checklist from standards
- Stage only related changes
- Write meaningful commit messages per standards

---

**If you violate these instructions, the user will say "Standards?" and you must restart properly.**
