# MCP Server Setup Guide

Model Context Protocol (MCP) servers extend Claude's capabilities by connecting to external data sources and tools. This guide shows you how to configure MCP servers to supercharge the framework.

---

## Table of Contents

- [What is MCP?](#what-is-mcp)
- [Why Use MCP with This Framework?](#why-use-mcp-with-this-framework)
- [Quick Setup](#quick-setup)
- [Recommended MCP Servers](#recommended-mcp-servers)
- [Configuration](#configuration)
- [Use Cases](#use-cases)
- [Troubleshooting](#troubleshooting)

---

## What is MCP?

**Model Context Protocol (MCP)** is a standard for connecting AI assistants to external data sources.

Think of MCP servers as **plugins** that give Claude access to:
- File systems
- Databases
- APIs
- Cloud services
- Custom tools

**Example:**
```
Without MCP: Claude can't read your company wiki
With MCP:    Claude reads wiki and applies those standards
```

---

## Why Use MCP with This Framework?

### MCP-Aware Workflow

**The framework now includes MCP awareness in the Standards Check:**

When starting any task, Claude will check:
- Are MCP servers available for this task?
- Should context7 be used for documentation research?
- Are there specialized MCPs that would help?

This ensures Claude always uses the best tools available, not just defaults like web_search.

### Enhanced Capabilities

**1. Better Documentation Research with context7**
```
/research-stack

Claude (with context7 MCP):
- Fetches official documentation directly
- Gets complete, accurate docs (not summaries)
- Faster and more reliable than web_search
- Works with Next.js, React, Vue, TypeScript, etc.

Claude (without context7):
- Falls back to web_search (less accurate)
- Gets summarized/incomplete information
```

**2. Import Company Standards**
```
/import-standards

Claude (with MCP):
- Connects to company Confluence/Notion
- Reads existing documentation
- Converts to framework format
- Saves to .claude/your-stack/
```

**3. Learn From Existing Code**
```
/learn "our authentication pattern"

Claude (with MCP):
- Searches entire codebase
- Finds all auth implementations
- Identifies common patterns
- Documents as standard
```

**4. Access Project Resources**
```
/start-task "Update API docs"

Claude (with MCP):
- Reads current API documentation
- Checks actual implementation
- Updates docs with accuracy
- Ensures consistency
```

### Not Required, But Powerful

The framework works great without MCP. But with MCP:
- ✅ Better documentation research (context7 vs web_search)
- ✅ Import existing company docs automatically
- ✅ Search entire codebase for patterns
- ✅ Access cloud resources
- ✅ Connect to databases
- ✅ Integrate with APIs

---

## Quick Setup

### Step 1: Install Claude Desktop App

MCP servers currently work with Claude Desktop.

1. Download [Claude Desktop](https://claude.ai/download)
2. Sign in with your account

### Step 2: Choose MCP Servers

**For this framework, most useful servers:**

1. **Filesystem** - Read local files
2. **GitHub** - Access repositories
3. **Google Drive** - Read company docs
4. **PostgreSQL** - Query databases (if applicable)

### Step 3: Configure MCP

Edit Claude Desktop configuration:

**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Basic config:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/project"]
    }
  }
}
```

### Step 4: Restart Claude Desktop

Changes take effect after restart.

### Step 5: Verify

In Claude Desktop:
```
Can you list the MCP servers you have access to?
```

Claude will show available servers.

---

## Recommended MCP Servers

### 1. context7 (⭐ HIGHLY RECOMMENDED)

**Purpose:** Fetch official documentation directly

**Why it matters:** The framework's `/research-stack` command uses context7 to get complete, accurate documentation instead of web search summaries. This significantly improves the quality of generated standards.

**Setup:**
```bash
# Install context7
npm install -g @context7/mcp-server

# Or use npx (no install needed)
```

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

**Use cases:**
- `/research-stack` - Research tech stack documentation
- Documentation lookups - Get official docs for any framework/library
- API reference - Fetch complete API documentation
- Best practices - Get authoritative guidance

**With framework:**
```
/research-stack

Claude (checking):
✅ context7 available - Using for documentation research
→ Fetching official Next.js docs...
→ Fetching React 18 docs...
→ Getting TypeScript handbook...

Result: Complete, accurate standards based on official docs
```

**Without context7:**
```
/research-stack

Claude (checking):
❌ context7 NOT available - Falling back to web_search
⚠️  Warning: Results may be less accurate

Result: Standards based on web search summaries
```

**Installation guide:** [context7 on npm](https://www.npmjs.com/package/@context7/mcp-server)

---

### 2. Filesystem Server

**Purpose:** Read local files

**Setup:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/project",
        "/path/to/company/docs"
      ]
    }
  }
}
```

**Use cases:**
- Read existing code
- Import company documentation
- Analyze project structure
- Learn code patterns

**With framework:**
```
/import-standards

Claude:
- Where are your company standards?

You: 
/Users/company/docs/development-standards/

Claude:
- Reading files via filesystem MCP...
- Converting to framework format...
- ✅ Imported 5 standards files
```

### 2. GitHub Server

**Purpose:** Access GitHub repositories

**Setup:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    }
  }
}
```

**Getting a token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Copy token to config

**Use cases:**
- Import standards from company repos
- Learn patterns from open-source projects
- Reference framework examples
- Check latest versions

**With framework:**
```
/research-stack

Claude (with GitHub MCP):
- Searches official framework repos
- Reads example implementations
- Finds latest best practices
- Generates accurate standards
```

### 3. Google Drive Server

**Purpose:** Access Google Docs/Sheets

**Setup:**
```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "your-client-id",
        "GDRIVE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

**OAuth setup required** - see [MCP Google Drive docs](https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive)

**Use cases:**
- Import company style guides
- Read design specs
- Access team documentation
- Import standards from shared docs

**With framework:**
```
/import-standards

You: Our standards are in Google Drive at "Engineering Standards" folder

Claude:
- Connecting to Google Drive via MCP...
- Reading documents...
- Converting to markdown...
- ✅ Imported standards from 8 documents
```

### 4. PostgreSQL Server

**Purpose:** Query databases

**Setup:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/dbname"
      }
    }
  }
}
```

**Use cases:**
- Learn database schema
- Generate model types
- Create API based on schema
- Document data structures

**With framework:**
```
/start-task "Create User API endpoints"

Claude (with PostgreSQL MCP):
- Queries database for User table schema
- Generates TypeScript types matching schema
- Creates CRUD endpoints with correct types
- Ensures type safety end-to-end
```

### 5. Brave Search Server

**Purpose:** Web search

**Setup:**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Note:** Claude already has web_search built-in. This provides an alternative.

---

## Configuration

### Full Configuration Example

**`claude_desktop_config.json`:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/projects/your-project",
        "/Users/you/Documents/company-docs"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

### Framework Integration

After configuring MCP servers, update `.claude/your-stack/stack-config.yaml`:

```yaml
tools:
  mcp_servers:
    - name: "filesystem"
      enabled: true
      purpose: "Read local files and company docs"
    - name: "github"
      enabled: true
      purpose: "Access repos and examples"
    - name: "postgres"
      enabled: true
      purpose: "Query database schema"
```

This helps Claude know what tools are available.

---

## Use Cases

### 1. Import Company Standards

**Before MCP:**
```
You: Manually copy-paste company docs
Claude: Converts format
You: Save files manually
```

**With MCP:**
```
You: /import-standards

Claude:
- Connects to Google Drive/Confluence
- Reads all standards docs
- Converts automatically
- Saves to .claude/your-stack/
- Updates configuration
```

### 2. Learn Codebase Patterns

**Before MCP:**
```
You: "We handle errors with toast notifications"
Claude: "Ok" [might not apply consistently]
```

**With MCP:**
```
You: /learn "error handling"

Claude:
- Searches codebase via filesystem MCP
- Finds all error handling code
- Identifies common pattern:
  ```typescript
  try {
    await api.call();
    toast.success('Done!');
  } catch (error) {
    toast.error(error.message);
  }
  ```
- Documents as standard
- Applies everywhere going forward
```

### 3. Generate Types from Database

**Before MCP:**
```
You: Manually define types matching DB schema
Claude: Uses your types
You: Keep types in sync with DB changes manually
```

**With MCP:**
```
You: /start-task "Create User CRUD API"

Claude:
- Queries database via PostgreSQL MCP
- Generates TypeScript types:
  ```typescript
  interface User {
    id: string;
    email: string;
    name: string;
    created_at: Date;
  }
  ```
- Creates API with correct types
- Types always match actual schema
```

### 4. Reference Latest Best Practices

**Before MCP:**
```
You: "Use latest Next.js patterns"
Claude: [Uses knowledge cutoff data]
```

**With MCP:**
```
You: /research-stack "Next.js 15"

Claude:
- Searches GitHub via MCP
- Finds official Next.js repo
- Reads latest documentation
- Checks recent changes
- Generates current best practices
```

---

## Security Considerations

### File Access

```json
{
  "filesystem": {
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/specific/project/directory"  // ← Be specific!
    ]
  }
}
```

**Best practices:**
- Only grant access to specific directories
- Don't give access to entire home directory
- Don't include sensitive files (`.env`, credentials)
- Review what Claude is reading

### API Keys

```json
{
  "github": {
    "env": {
      "GITHUB_TOKEN": "use-environment-variable"  // ← Don't hardcode
    }
  }
}
```

**Best practices:**
- Use environment variables
- Create tokens with minimal scopes
- Rotate tokens regularly
- Don't commit config with secrets

### Database Access

```json
{
  "postgres": {
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://readonly_user:pass@localhost/db"
    }
  }
}
```

**Best practices:**
- Use read-only credentials
- Limit to specific schemas
- Don't use production credentials
- Use separate dev database

---

## Troubleshooting

### MCP Server Not Showing

**Problem:** Claude doesn't see MCP servers

**Solutions:**
1. Restart Claude Desktop
2. Check config file path
3. Verify JSON syntax (use JSON validator)
4. Check console for errors (Help → Developer Tools)

### Permission Denied

**Problem:** MCP can't read files

**Solutions:**
1. Check file path is correct
2. Verify file permissions
3. Grant Claude Desktop file access (System Preferences on macOS)

### GitHub Token Issues

**Problem:** GitHub MCP not working

**Solutions:**
1. Verify token has correct scopes
2. Check token hasn't expired
3. Test token with GitHub API directly
4. Generate new token if needed

### Database Connection Failed

**Problem:** PostgreSQL MCP can't connect

**Solutions:**
1. Verify connection string
2. Check database is running
3. Test connection with psql client
4. Check firewall settings

---

## Advanced Configuration

### Custom MCP Servers

You can create custom MCP servers for your specific needs:

```json
{
  "mcpServers": {
    "custom-api": {
      "command": "node",
      "args": ["/path/to/custom-mcp-server.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

See [MCP Server Examples](https://github.com/modelcontextprotocol/servers) for building custom servers.

### Multiple Filesystem Paths

```json
{
  "filesystem": {
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/project1",
      "/project2",
      "/shared/docs"
    ]
  }
}
```

### Environment-Specific Configs

**Development:**
```json
{
  "postgres": {
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://localhost:5432/dev_db"
    }
  }
}
```

**Production (don't do this!):**
```json
{
  "postgres": {
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://localhost:5432/prod_db"
    }
  }
}
```

**Better:** Use separate Claude Desktop profiles or configs per environment.

---

## Performance Tips

### 1. Limit File Access

```json
{
  "filesystem": {
    "args": [
      "/project/src",     // ✅ Specific
      "/project/docs"     // ✅ Specific
      // ❌ Don't: "/entire/drive"
    ]
  }
}
```

### 2. Use Read-Only Database Connections

Faster and safer:
```
postgresql://readonly_user:pass@localhost/db
```

### 3. Cache Large Datasets

For frequently accessed data, consider:
1. Export to JSON
2. Store in project
3. Use filesystem MCP to read

---

## Next Steps

- **Start coding:** [Getting Started Guide](./getting-started.md)
- **Customize:** [Customization Guide](./customization-guide.md)
- **Understand:** [Framework Philosophy](./philosophy.md)
- **Questions:** [FAQ](./faq.md)

---

## Resources

- [MCP Official Docs](https://modelcontextprotocol.io)
- [MCP Server Repository](https://github.com/modelcontextprotocol/servers)
- [Claude Desktop Download](https://claude.ai/download)
- [MCP Community Discord](https://discord.gg/modelcontextprotocol)

---

**MCP servers turn Claude into a connected AI developer with access to your entire development ecosystem.** 🔌
