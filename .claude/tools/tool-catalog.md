# Tool Catalog

Complete reference of tools available to the Claude Dev Framework and when to use each one.

---

## Quick Reference

| Tool | Purpose | When to Use | Requires |
|------|---------|-------------|----------|
| `project_knowledge_search` | Search project docs | Finding custom standards | Project Knowledge |
| `web_search` | Search the internet | Research new stacks | Built-in |
| `web_fetch` | Fetch web pages | Read full documentation | Built-in |
| `filesystem` | Read/write files | Access project code | MCP Server |
| `github` | GitHub API access | Research repos | MCP Server |
| `context7` | Company docs search | Import standards | MCP Server |

---

## Built-In Tools (Always Available)

### 1. project_knowledge_search

**What it does:** Searches the Project Knowledge base for information

**When to use:**
- Finding user's custom standards (`.claude/your-stack/`)
- Looking up saved templates
- Checking existing configuration
- Reading user's notes and preferences

**How the framework uses it:**
```
User: /start-task "Create form component"
Claude: [Searches project knowledge]
Claude: "Found your form standards:
- Use React Hook Form
- Zod validation
- Custom FormInput component"
```

**Example queries:**
```
"form validation standards"
"component structure guidelines"
"TypeScript configurations"
"testing requirements"
```

**Priority:** 🔥 **USE FIRST** - Always check project knowledge before web search

---

### 2. web_search

**What it does:** Searches the internet via search engines

**When to use:**
- Researching unfamiliar stacks
- Finding current best practices (2025+)
- Discovering new libraries or tools
- Checking for recent updates or changes
- Finding authoritative documentation

**When NOT to use:**
- User already has standards defined (use `project_knowledge_search` instead)
- Basic programming concepts (use built-in knowledge)
- User's company-specific information (use `context7` MCP)

**Example queries:**
```
"SvelteKit 2025 best practices"
"Drizzle ORM TypeScript setup"
"Vitest React Testing Library config"
"Tailwind CSS v4 features"
```

**Framework commands that use it:**
- `/research-stack` - Primary research tool
- `/learn` - Finding learning resources
- `/verify` - Checking against current standards

**See also:** [web-research.md](./web-research.md) for detailed methodology

---

### 3. web_fetch

**What it does:** Fetches and reads complete web pages

**When to use:**
- Reading full documentation after finding it with web_search
- Accessing specific URLs the user provides
- Getting detailed information from authoritative sources
- Reading blog posts or tutorials completely

**Common use cases:**
```
1. User provides URL: "Read this article: https://..."
2. After web_search finds results: Fetch the most relevant URLs
3. Reading official docs: "Check the Astro docs for islands"
```

**How it works with web_search:**
```
Step 1: web_search "Vite TypeScript configuration"
Step 2: web_fetch https://vitejs.dev/guide/features.html#typescript
Step 3: Extract detailed configuration information
```

**Limitations:**
- Cannot access pages behind authentication
- Cannot read PDFs or binary files
- May fail on JavaScript-heavy SPAs
- Rate limited to prevent abuse

---

## MCP Tools (Require Setup)

### 4. filesystem

**MCP Server:** `@modelcontextprotocol/server-filesystem`

**What it does:** Read and write files in your project directory

**When to use:**
- Reading existing code to understand patterns
- Creating new files based on standards
- Modifying configuration files
- Understanding project structure
- Checking for existing components

**Configuration:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

**Example uses:**
```
Read: "What components do I already have?"
Create: "Generate a new Button component"
Update: "Add TypeScript to vite.config.js"
Scan: "What's my current folder structure?"
```

**Framework commands that use it:**
- `/start-task` - Reads similar components
- `/verify` - Checks project structure
- All commands that generate code

**Security:** Only accesses configured directories

**See also:** [mcp-integration.md](./mcp-integration.md)

---

### 5. github

**MCP Server:** `@modelcontextprotocol/server-github`

**What it does:** Search and read GitHub repositories

**When to use:**
- Finding real-world examples of patterns
- Researching how popular projects structure code
- Checking library usage in production apps
- Reading repository documentation
- Finding issues or discussions about patterns

**Configuration:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Example uses:**
```
"How do popular Next.js apps structure their folders?"
"Find examples of shadcn/ui usage"
"What testing patterns are used in React projects?"
"How is Drizzle ORM configured in production apps?"
```

**What you can search:**
- Public repositories
- Repository files and structure
- Issues and pull requests
- README files and documentation
- Popular code patterns

**Framework commands that use it:**
- `/research-stack` - Finding patterns
- `/learn` - Discovering examples
- `/verify` - Checking against production code

**Requires:** GitHub Personal Access Token

---

### 6. context7

**MCP Server:** `@context7/mcp-server`

**What it does:** Search company documentation across platforms

**When to use:**
- Importing company coding standards
- Finding existing team documentation
- Accessing internal style guides
- Reading previous project decisions
- Discovering team conventions

**Supported sources:**
- Google Drive
- Slack
- Notion
- Confluence
- Linear
- Jira

**Configuration:**
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

**Example uses:**
```
"Find our React component standards"
"Search for API design guidelines"
"What are our testing requirements?"
"Read the onboarding documentation"
```

**Framework commands that use it:**
- `/import-standards` - Main use case
- `/learn` - Finding internal resources
- Initial setup - Understanding company patterns

**Privacy:** Only accesses what you authorize

---

### 7. postgres / mysql

**MCP Servers:** `@modelcontextprotocol/server-postgres`, `server-mysql`

**What it does:** Query databases directly

**When to use:**
- Understanding your database schema
- Generating TypeScript types from tables
- Creating seed data
- Writing migrations
- Building CRUD operations

**Configuration:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

**Example uses:**
```
"What tables do I have?"
"Generate TypeScript types for my User table"
"Create a migration to add email field"
"What's the relationship between users and posts?"
```

**Framework integration:**
- Generates accurate types
- Creates API endpoints that match your schema
- Suggests optimal queries
- Helps with database design

**Security:** Read-only recommended for safety

---

## Specialized MCP Servers (Advanced)

### 8. brave-search

**Purpose:** Alternative search with different results

**Use when:** web_search isn't finding what you need

### 9. puppeteer

**Purpose:** Browser automation for testing

**Use when:** Need to test actual browser behavior

### 10. Memory

**Purpose:** Long-term information storage across chats

**Use when:** Want Claude to remember preferences

---

## Tool Selection Guide

### Decision Tree

```
Need information about the project?
├─ User's custom standards? → project_knowledge_search
├─ Company documentation? → context7 (MCP)
├─ Existing code? → filesystem (MCP)
└─ General web info? → web_search

Need to create/modify files?
└─ Generate code? → filesystem (MCP)

Need to research best practices?
├─ Official docs? → web_search + web_fetch
├─ Real examples? → github (MCP)
└─ Community patterns? → web_search

Need database info?
└─ Schema/types? → postgres/mysql (MCP)
```

### Priority Order

When multiple tools could work, use this order:

1. **project_knowledge_search** - User's preferences come first
2. **filesystem (MCP)** - Check existing code
3. **context7 (MCP)** - Company standards
4. **github (MCP)** - Real-world examples
5. **web_search** - General best practices
6. **web_fetch** - Deep dive into specific sources

---

## Tool Combinations

### Pattern 1: Complete Stack Research

```
1. web_search - Find official documentation
2. web_fetch - Read complete docs
3. github - Find popular examples
4. web_search - Verify current best practices
5. filesystem - Check user's existing setup
→ Result: Comprehensive understanding
```

### Pattern 2: Generating Component

```
1. project_knowledge_search - Find user's standards
2. filesystem - Read similar components
3. filesystem - Create new component
→ Result: Consistent with project
```

### Pattern 3: Importing Standards

```
1. context7 - Search company docs
2. filesystem - Read local documentation
3. project_knowledge_search - Check existing framework
4. filesystem - Save merged standards
→ Result: Company + framework integration
```

### Pattern 4: Learning New Stack

```
1. web_search - Overview of technology
2. web_fetch - Read official getting started
3. github - Find example projects
4. web_search - Best practices
5. filesystem - Apply to user's project
→ Result: Educated implementation
```

---

## Limitations & Workarounds

### Web Tools

**Limitation:** Cannot access authenticated content
**Workaround:** User uploads files or enables context7 MCP

**Limitation:** Rate limited
**Workaround:** Use web_fetch for fewer, more targeted requests

**Limitation:** Cannot read PDFs
**Workaround:** User copies text or uploads as document

### MCP Tools

**Limitation:** Not available in web Claude
**Workaround:** Use Claude Desktop app

**Limitation:** Requires setup and tokens
**Workaround:** Start with built-in tools, add MCP gradually

**Limitation:** Platform-specific
**Workaround:** Check MCP server documentation for your OS

---

## Best Practices

### DO

✅ Always search project knowledge first
✅ Use web_search for current information
✅ Fetch specific URLs with web_fetch
✅ Check multiple sources when researching
✅ Combine tools for comprehensive understanding
✅ Respect rate limits and use tools efficiently

### DON'T

❌ Use web_search for user's custom standards
❌ Assume old information is current
❌ Rely on single sources
❌ Fetch URLs without searching first
❌ Use MCP without user consent
❌ Execute destructive filesystem operations without review

---

## Testing Your Tool Setup

### Verify Built-in Tools

```
Try: "Search the web for Astro 4.0 features"
Expected: Search results appear
```

### Verify Project Knowledge

```
Try: "Search my project knowledge for form standards"
Expected: Finds your custom standards
```

### Verify Filesystem MCP

```
Try: "List files in my src/components directory"
Expected: Shows your component files
```

### Verify GitHub MCP

```
Try: "Search GitHub for popular Next.js projects"
Expected: Finds repositories
```

---

## Troubleshooting

### Tool Not Working

1. **Check tool is enabled:** MCP tools require configuration
2. **Verify syntax:** Ensure correct tool name
3. **Check permissions:** File access, API tokens, etc.
4. **Review logs:** Claude Desktop logs show MCP issues
5. **Test manually:** Try the MCP server outside Claude

### Getting Poor Results

1. **Refine queries:** Be more specific
2. **Try different tool:** Maybe web_search instead of GitHub
3. **Combine tools:** Use multiple sources
4. **Check recent:** Prefer recent information

---

## Further Reading

- [MCP Integration Guide](./mcp-integration.md) - Detailed MCP setup
- [Web Research Guide](./web-research.md) - Research methodology
- [Stack Research Workflow](../workflows/stack-research.md) - Research process

---

**Pro Tip:** Start with built-in tools (project_knowledge_search, web_search) and add MCP servers as you need more power. The framework works great with just the basics!