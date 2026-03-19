---
name: tools
description: >
  Reference for all Claude Code tools: file operations (Read, Write, Edit, Glob, Grep), execution (Bash), web (WebFetch, WebSearch), task management (Task, Skill), and user interaction (AskUserQuestion).
applies_to:
  - ".claude/commands/**/*.md"
category: claude-code
---

# Claude Code Tools Reference

Tools are how Claude Code interacts with the system. This spec documents available tools and their parameters.

---

## File Operations

### Read
Read file contents from the filesystem.

```yaml
parameters:
  file_path: string (required) # Absolute path
  offset: number (optional)    # Line to start from
  limit: number (optional)     # Number of lines to read
```

- Returns file contents with line numbers
- Can read images, PDFs, Jupyter notebooks
- Use for understanding code before modifying

### Write
Create or overwrite a file.

```yaml
parameters:
  file_path: string (required) # Absolute path
  content: string (required)   # File content
```

- Overwrites existing files
- MUST Read file first before Write to existing files
- Use Edit for targeted changes instead

### Edit
Make targeted replacements in files.

```yaml
parameters:
  file_path: string (required)   # Absolute path
  old_string: string (required)  # Text to find
  new_string: string (required)  # Replacement text
  replace_all: boolean (optional) # Replace all occurrences
```

- `old_string` must be unique in file (or use replace_all)
- MUST Read file first
- Preserves file structure, only changes targeted content

### Glob
Find files by pattern.

```yaml
parameters:
  pattern: string (required) # Glob pattern (e.g., "**/*.ts")
  path: string (optional)    # Directory to search
```

- Use for finding files by name/extension
- Returns paths sorted by modification time

### Grep
Search file contents.

```yaml
parameters:
  pattern: string (required)     # Regex pattern
  path: string (optional)        # Directory to search
  glob: string (optional)        # Filter by file pattern
  type: string (optional)        # File type (js, py, etc.)
  output_mode: string (optional) # "content", "files_with_matches", "count"
```

- Use ripgrep syntax (not grep)
- `output_mode: "content"` shows matching lines
- Supports context lines with -A, -B, -C

---

## Execution

### Bash
Execute shell commands.

```yaml
parameters:
  command: string (required)         # Command to run
  description: string (optional)     # What this does
  timeout: number (optional)         # Milliseconds (max 600000)
  run_in_background: boolean         # Run async
```

**Avoid using for file operations.** Use dedicated tools instead:
- Don't: `cat file.txt` - Use: Read
- Don't: `echo "x" > file` - Use: Write
- Don't: `sed -i` - Use: Edit
- Don't: `find .` - Use: Glob
- Don't: `grep pattern` - Use: Grep

---

## Web

### WebFetch
Fetch and process web content.

```yaml
parameters:
  url: string (required)    # URL to fetch
  prompt: string (required) # What to extract
```

- FAILS for authenticated URLs (Google Docs, Jira, etc.)
- Use ToolSearch first to find authenticated alternatives

### WebSearch
Search the web.

```yaml
parameters:
  query: string (required)
  allowed_domains: array (optional)
  blocked_domains: array (optional)
```

- Include year in queries for current info
- MUST include Sources section in response

---

## Task Management

### Task
Launch specialized subagents.

```yaml
parameters:
  prompt: string (required)         # Task description
  description: string (required)    # 3-5 word summary
  subagent_type: string (required)  # Agent type
  model: string (optional)          # "sonnet", "opus", "haiku"
  run_in_background: boolean        # Async execution
```

Subagent types:
- `Bash` - Command execution
- `Explore` - Codebase exploration (quick/medium/very thorough)
- `Plan` - Implementation planning
- `general-purpose` - Multi-step research

### Skill
Invoke a registered skill.

```yaml
parameters:
  skill: string (required) # Skill name
  args: string (optional)  # Arguments
```

---

## User Interaction

### AskUserQuestion
Ask the user for input.

```yaml
parameters:
  questions: array (required) # 1-4 questions
    - question: string        # The question
      header: string          # Short label (max 12 chars)
      options: array          # 2-4 choices
      multiSelect: boolean    # Allow multiple
```

### EnterPlanMode
Transition to planning mode for complex tasks.

```yaml
parameters: {} # No parameters
```

Use when task requires:
- Multiple valid approaches
- Architectural decisions
- Multi-file changes
- Unclear requirements

---

## Important Notes

1. **Read before Edit/Write** - Tools will fail if you haven't read the file
2. **Absolute paths** - All file paths must be absolute
3. **Prefer Edit over Write** - Edit preserves structure
4. **Avoid Bash for file ops** - Use dedicated tools
5. **Parallel calls** - Independent operations can run simultaneously
