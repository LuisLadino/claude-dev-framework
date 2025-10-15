# MCP Integration Guide

**Model Context Protocol (MCP)** enables Claude to interact with external tools and data sources, making this framework truly powerful and context-aware.

---

## What is MCP?

Model Context Protocol is a standardized way for AI assistants to connect to external tools, databases, APIs, and systems. Think of it as giving Claude superpowers to access information beyond its training data.

### Why MCP Matters for This Framework

- **Read company documentation** from Google Drive, Confluence, or local files
- **Execute commands** to scaffold projects or run tests
- **Query databases** for real-time project information
- **Access APIs** to fetch current best practices or libraries
- **Interact with your dev environment** directly

---

## Useful MCP Servers

### 1. **filesystem** (Essential)

**Purpose:** Read and write files in your project

**Use Cases:**
- Claude can read your existing code to understand patterns
- Create new files based on your standards
- Update configuration files
- Read documentation you've written

**Setup:**
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

**Framework Use:**
```
Claude can read .claude/your-stack/ to understand your specific setup
Claude can create files that match your existing code style
Claude can update stack-config.yaml based on project changes
```

### 2. **context7** (Recommended)

**Purpose:** Search and retrieve content from various sources

**Use Cases:**
- Search Google Drive for company standards
- Find relevant Slack conversations
- Access Notion documentation
- Query Confluence wikis

**Setup:**
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

**Framework Use:**
```
/import-standards command uses this to read company docs
Claude searches your knowledge base for existing patterns
Finds similar problems your team has solved before
```

### 3. **github** (Highly Recommended)

**Purpose:** Interact with GitHub repositories

**Use Cases:**
- Search issues for similar problems
- Review PRs for code style patterns
- Check repository README files
- Access repository wikis

**Setup:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    }
  }
}
```

**Framework Use:**
```
Research common patterns in popular repos
Check how libraries are typically configured
Find examples of testing setups
Verify current best practices
```

### 4. **postgres/mysql** (Optional)

**Purpose:** Query databases directly

**Use Cases:**
- Understand your data schema
- Generate type definitions from database
- Create migrations based on schema
- Write queries that match your data

**Framework Use:**
```
Generate TypeScript types from your database
Create API endpoints that match your schema
Suggest database optimizations
```

---

## How the Framework Uses MCP

### During Initial Setup

When you run `/research-stack`, the framework can:
1. Use **filesystem** to scan your existing project structure
2. Use **github** to research best practices for your stack
3. Use **web_search** (built-in) to find authoritative documentation
4. Create standards files based on what it discovers

### During Development

When you run `/start-task`, Claude can:
1. Use **project_knowledge_search** to find your custom standards
2. Use **filesystem** to read similar components you've built
3. Reference your stack-config.yaml for style preferences
4. Generate code that matches your existing patterns

### When Importing Standards

When you run `/import-standards`, Claude can:
1. Use **context7** to search Google Drive for company docs
2. Use **filesystem** to read local markdown files
3. Parse and convert documentation to framework format
4. Save to `.claude/your-stack/` for future reference

---

## Configuration

### Claude Desktop App

Edit your Claude configuration file:

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    },
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

### Web/API Version

MCP servers are not available in the web version of Claude. You'll need to:
- Use Claude Desktop app for full framework functionality
- Or rely on file uploads and web_search only

---

## Practical Examples

### Example 1: Reading Company Standards

**Without MCP:**
```
You: "Here's a PDF of our coding standards..."
[Upload file]
Claude: [Processes the single file]
```

**With MCP (context7):**
```
You: /import-standards
Claude: [Searches all of Google Drive]
Claude: "I found these relevant documents:
- Frontend Standards v2.3
- API Design Guide
- Testing Best Practices
- TypeScript Style Guide"
Claude: [Imports and merges all of them]
```

### Example 2: Understanding Your Codebase

**Without MCP:**
```
You: "Make this component..."
Claude: [Creates generic component]
```

**With MCP (filesystem):**
```
You: /start-task "Create user profile component"
Claude: [Reads your existing components]
Claude: "I see you're using this pattern for layouts:
- Tailwind for styling
- Lucide icons
- Separated logic/view files
I'll match that style..."
```

### Example 3: Researching a Stack

**Without MCP:**
```
Claude: [Uses only built-in knowledge from 2024]
```

**With MCP (github + web_search):**
```
You: /research-stack "SvelteKit with Supabase"
Claude: [Searches GitHub for popular examples]
Claude: [Reads official documentation]
Claude: [Finds recent best practices]
Claude: "Here's what I found:
- Latest SvelteKit patterns from top repos
- Supabase integration examples with 1000+ stars
- Current recommended folder structure
- Testing approaches that are actually used"
```

---

## Troubleshooting

### MCP Server Not Working

**Check Claude logs:**
- Mac: `~/Library/Logs/Claude/`
- Windows: `%APPDATA%\Claude\logs\`

**Common issues:**
1. **Invalid path:** Check your file paths are absolute, not relative
2. **Missing token:** GitHub requires a personal access token
3. **Server not installed:** Run `npx -y @modelcontextprotocol/server-filesystem` manually to test
4. **Restart required:** Close and reopen Claude after config changes

### Filesystem Access Denied

Make sure Claude has permission to access the directory:
- Use absolute paths
- Check folder permissions
- Don't use system directories

### GitHub Token Issues

Create a Personal Access Token with these scopes:
- `repo` - Full control of private repositories
- `read:org` - Read org and team membership

---

## Security Considerations

### What Claude Can Access

With filesystem MCP, Claude can:
- ✅ Read any file in the configured directory
- ✅ Create new files
- ✅ Modify existing files
- ❌ Cannot access outside configured paths
- ❌ Cannot execute arbitrary commands (unless you enable it)

### Best Practices

1. **Limit scope:** Only give access to specific project directories
2. **Use read-only when possible:** Configure MCP in read-only mode if you just need Claude to learn
3. **Review before executing:** Always review what Claude plans to change
4. **Use version control:** Git lets you revert any unwanted changes
5. **Keep tokens secure:** Never commit MCP config files with tokens to git

---

## Next Steps

1. **Start simple:** Enable filesystem MCP for one project
2. **Test it:** Ask Claude to read a file and summarize it
3. **Add more servers:** Enable github and context7 when comfortable
4. **Use framework commands:** Try `/research-stack` to see MCP in action

---

## References

- [MCP Official Documentation](https://modelcontextprotocol.io/)
- [Available MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Claude Desktop MCP Setup Guide](https://docs.anthropic.com/claude/docs/mcp)

---

**Remember:** MCP is powerful but optional. The framework works without it, but becomes much more intelligent with it enabled.