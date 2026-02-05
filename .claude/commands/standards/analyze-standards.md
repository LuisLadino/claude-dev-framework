# /analyze-standards

Analyze your codebase or documentation to discover and create coding standards.

---

## Two Analysis Modes

**Option 1: Analyze Documentation** - Read company handbooks, PDFs, wikis. Extract and convert to framework standards format.

**Option 2: Analyze Codebase** - Scan actual code to identify patterns in use, compare to existing standards, create new standards files, and discover undocumented conventions. Analyzes everything: components, language conventions, styling, testing, file organization, API design, state management, error handling, data fetching, hooks/composables, utilities, configuration, and build setup.

---

## Usage

- `/analyze-standards` - Interactive, asks which option
- `/analyze-standards docs "Engineering Standards"` - Jump to documentation analysis
- `/analyze-standards codebase` - Jump to codebase analysis

---

## Option 1: Analyze Documentation

### Step 1: Source Selection

Ask where company standards are located:
1. Google Drive (via MCP)
2. Confluence (via MCP)
3. Notion (via MCP)
4. Local files (markdown, text)
5. Upload files (PDF, Word, etc.)
6. Multiple sources

### Step 2: Finding Documents

Search the selected source for standards documents. Present found documents and let the user select which to import.

### Step 3: Analysis and Import

Read each document, extract coding conventions, file naming patterns, testing requirements, and architecture guidelines. Create standards files and update stack-config.yaml.

See full Option 1 workflow at end of document.

---

## Option 2: Analyze Codebase

### Step 1: Scope Selection

Ask the user what to analyze:
1. Entire codebase (recommended)
2. Specific directory
3. Specific file types
4. Custom pattern

### Step 2: Comprehensive Analysis

Perform deep analysis across all pattern categories:

- **Component patterns** - structure, props, exports, naming, folder organization
- **Language patterns** - strict mode, type definitions, interface vs type usage, null handling, imports
- **Styling patterns** - CSS approach, class composition, responsive strategy, theming
- **Testing patterns** - framework, file location, naming, structure, assertions, mocking
- **State management** - global state, server state, form state, local state
- **Data fetching** - client-side, server-side, error handling, loading states, caching
- **File organization** - directory structure, naming conventions, colocation patterns
- **Error handling** - async errors, component errors, API errors, validation, user feedback
- **Hooks and utilities** - custom hooks, utility functions, naming, test coverage
- **API design** - framework, structure, validation, error format, auth
- **Additional** - import aliases, const naming, enum usage, comments, package manager, deployment

For each category, report the patterns found and their consistency (e.g., "143/156 components use forwardRef").

### Step 3: Standards Comparison

**If existing standards exist:** Compare discovered patterns against them. Report three categories:

1. **Matches** - Patterns that align with existing standards
2. **Differences** - Where codebase practice diverges from documented standards. For each difference, show what the standard says vs what the codebase actually does, with consistency metrics. Ask the user whether to update the standard to match practice.
3. **Undocumented patterns** - Consistent patterns not covered by any standard. Offer to create new standards files for each.

**If no existing standards:** Create comprehensive standards from scratch based on all discovered patterns, generating one file per category (e.g., react-standards.md, typescript-standards.md, styling-standards.md, testing-standards.md, etc.).

### Step 4: Interactive Decisions

For each difference or new pattern, present the user with options:

**For differences (standard vs codebase mismatch):**
1. Update standard to match codebase
2. Keep current standard
3. Show more examples from codebase
4. Skip for now

Show the current standard text, the discovered pattern with consistency metrics, and real code examples from the codebase.

**For undocumented patterns:**
1. Create new standard file
2. Show proposed content first
3. Add to existing file instead
4. Skip for now

Show the pattern summary with real code examples from the codebase.

### Step 5: Batch Operations

After reviewing individual changes, present a summary of all updates and new files. Ask the user to confirm before applying.

### Step 6: Registration and Validation

Apply all approved changes:
1. Update existing standards files
2. Create new standards files in `.claude/your-stack/`
3. Register new standards in `stack-config.yaml`
4. Create a discovery log at `.claude/your-stack/discovery-log.md`

### Step 7: Verification

Run `/verify` against the codebase to confirm standards match. Report summary: files analyzed, patterns discovered, standards updated, standards created. Suggest next steps: review files, commit to git, share with team.

---

## Pattern Recognition Behavior

- If 90%+ of files use a pattern, treat it as a standard
- If usage is split roughly 50/50, show both options and let the user decide
- Highlight outliers/inconsistencies for the user to address
- Suggest updating standards when codebase is more consistent than docs
- Suggest deprecating patterns no longer in use


---

## Option 1 Full Workflow (From Documentation)

### Sources Supported

- **Google Drive** (via MCP) - Google Docs, PDFs, text files
- **Confluence** (via MCP) - Pages and attachments
- **Notion** (via MCP) - Pages, databases, nested pages
- **Local files** - Markdown, text, PDF, Word from disk
- **File upload** - PDF, Word, Markdown, HTML, Text

### Import Process

1. Find documents from chosen source
2. Read and parse content
3. Extract standards (coding, architecture, testing, etc.)
4. Resolve conflicts with existing standards (if any)
5. Convert to framework format (markdown)
6. Create standards files in `.claude/your-stack/`
7. Register in stack-config.yaml
8. Verify everything works

### Conflict Resolution

When imported docs conflict with existing standards, present options:
1. Use imported value
2. Keep existing value
3. Merge both (explain when each applies)
4. Skip for now

---

## Best Practices

- Always review generated standards before accepting
- Re-analyze periodically as the codebase evolves
- If codebase is inconsistent, pick one pattern and standardize
- Commit standards to version control
- Remove secrets from docs before importing
- Check generated files for sensitive info

---

## Related Commands

- `/research-stack` - Generate standards from official docs
- `/add-standard` - Add a new custom standard
- `/verify` - Check code against standards
- `/start-task` - Use standards when coding
