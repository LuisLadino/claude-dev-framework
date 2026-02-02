# /analyze-standards

**Analyze your codebase or documentation to discover and create coding standards**

---

## Purpose

Two powerful ways to discover and establish standards:

**Option 1:** Analyze existing documentation (Google Drive, PDFs, company handbooks)
**Option 2:** Analyze codebase and discover patterns automatically (no docs needed!)

**Use when:**
- Joining a new company or project
- Contributing to open source
- Inheriting a codebase
- Company has docs but they're outdated
- No documentation exists at all
- Want to understand "the way things are done here"

**Time:** 10-30 minutes depending on codebase size

---

## How It Works

### Option 1: Analyze Documentation
- Read company handbooks, PDFs, wikis
- Extract coding standards and patterns
- Convert to framework standards format
- Merge with or replace existing standards

### Option 2: Analyze Codebase (⭐ Intelligent Discovery)
- Analyze your entire codebase
- Identify actual patterns in use
- Compare to existing standards (suggest edits)
- Create new standards files if needed
- Discover undocumented conventions

**No scope limits** - analyzes everything:
- Component patterns
- TypeScript/JavaScript conventions
- Styling approaches
- Testing patterns
- File organization
- API design
- State management
- Error handling
- Data fetching
- Hooks/composables
- Utilities
- Configuration
- Build setup
- And more...

---

## Usage

### Basic Usage

```
/analyze-standards
```

Claude will ask which option you want.

### Quick Option 1 (From Docs)

```
/analyze-standards docs "Engineering Standards"
```

### Quick Option 2 (From Codebase)

```
/analyze-standards codebase
```

---

## Option 1: Analyze Documentation

### Step 1: Source Selection

**Claude asks:**
```
Where are your company standards located?

Options:
1. Google Drive (via context7 MCP)
2. Confluence (via context7 MCP)
3. Notion (via context7 MCP)
4. Local files (markdown, text)
5. Upload files (PDF, Word, etc.)
6. Multiple sources

Select option [1-6]:
```

### Step 2: Finding Documents

**With MCP:**
```
Searching Google Drive...

Found:
1. Engineering Standards v3.2 (2 weeks ago)
2. React Guidelines (1 month ago)
3. Testing Requirements (1 week ago)

Which documents? [1,2,3 or 'all']:
```

**With Upload:**
```
Upload your standards documents.

Supported: PDF, Word, Markdown, Text, HTML
[Drag and drop files]
```

### Step 3: Analysis & Import

```
📄 Reading "Engineering Standards v3.2"...
   ✓ Coding conventions (15 rules)
   ✓ File naming (8 patterns)
   ✓ Testing requirements (6 rules)
   ✓ Architecture guidelines (10 patterns)

Creating standards files...
✓ company-conventions.md
✓ company-testing.md
✓ company-architecture.md

Updated stack-config.yaml
```

**See full Option 1 workflow at end of document**

---

## Option 2: Analyze Codebase (⭐ Intelligent Discovery)

### Step 1: Scope Selection

**Claude asks:**
```
What should I analyze?

1. Entire codebase (recommended)
2. Specific directory (e.g., src/components)
3. Specific file types (e.g., *.tsx, *.ts)
4. Custom pattern

Select scope [1-4]:
```

**You choose:** Usually "1" (entire codebase)

### Step 2: Comprehensive Analysis

**Claude performs deep analysis:**

```
🔍 Analyzing codebase...

📁 Scanning project structure...
   ✓ Found 1,247 files
   ✓ Identified 15 directories
   ✓ Detected stack: React + TypeScript + Tailwind

📊 Analyzing patterns...

1️⃣ Component Patterns (analyzing 156 components...)
   ✓ Structure: Functional components, named exports
   ✓ Props: Interface naming pattern I[Component]Props
   ✓ Prop destructuring: Always in function signature
   ✓ Export style: Named exports only (no defaults)
   ✓ File naming: PascalCase (Button.tsx, UserProfile.tsx)
   ✓ Folder structure: Flat in src/components/
   ✓ Index files: No barrel exports detected

   Common patterns found:
   - 143/156 use forwardRef for interactive components
   - 128/156 destructure props in signature
   - 156/156 use named exports
   - 89/156 have co-located test files

2️⃣ TypeScript Patterns (analyzing 843 .ts/.tsx files...)
   ✓ Mode: Strict mode enabled
   ✓ Type definitions: Explicit return types required
   ✓ Interface vs Type: Interfaces for props, types for unions
   ✓ Any usage: None found (strict enforcement)
   ✓ Null handling: Optional chaining preferred
   ✓ Type imports: Using "import type" syntax

   Common patterns:
   - 100% explicit return types on functions
   - 95% use interface for object shapes
   - Type aliases for unions/intersections
   - Const assertions for string literals

3️⃣ Styling Patterns (analyzing 234 styled files...)
   ✓ Primary: Tailwind CSS utility classes
   ✓ Custom CSS: Minimal, only in globals.css
   ✓ Class composition: Using cn() utility
   ✓ Responsive: Mobile-first breakpoints
   ✓ Dark mode: Using class strategy
   ✓ Colors: Semantic tokens from theme

   Common patterns:
   - 198/234 use cn() for conditional classes
   - No inline styles found
   - Consistent spacing scale (4px base)
   - Color usage: Only theme variables

4️⃣ Testing Patterns (analyzing 89 test files...)
   ✓ Framework: Vitest + React Testing Library
   ✓ File location: Co-located with components
   ✓ Naming: [ComponentName].test.tsx
   ✓ Structure: describe > it blocks
   ✓ Assertions: expect from @testing-library/jest-dom
   ✓ Mocks: MSW for API mocking

   Common patterns:
   - Test user interactions, not implementation
   - Accessibility queries preferred (getByRole)
   - 78/89 test files have >80% coverage
   - Integration tests over unit tests

5️⃣ State Management (analyzing state patterns...)
   ✓ Global: Zustand stores
   ✓ Server: TanStack Query
   ✓ Forms: React Hook Form
   ✓ URL state: Next.js searchParams
   ✓ Local: useState for simple state

   Common patterns:
   - Zustand for shared client state
   - TanStack Query for all server data
   - No Redux detected
   - Custom hooks for reusable logic

6️⃣ Data Fetching (analyzing API patterns...)
   ✓ Client: TanStack Query (useQuery/useMutation)
   ✓ Server: Next.js Server Components
   ✓ Error handling: Error boundaries
   ✓ Loading: Suspense boundaries
   ✓ Caching: TanStack Query defaults

   Common patterns:
   - Fetch on server when possible
   - TanStack Query for client-side
   - Optimistic updates with useMutation
   - Consistent error handling structure

7️⃣ File Organization (analyzing structure...)
   ✓ Structure: Feature-based folders
   ✓ Components: src/components/ (flat)
   ✓ Hooks: src/hooks/
   ✓ Utils: src/lib/
   ✓ Types: src/types/
   ✓ Tests: Co-located with source

   Common patterns:
   - No deep nesting (max 2 levels)
   - Related files stay together
   - Shared utils in lib/
   - App-specific in features/

8️⃣ Error Handling (analyzing error patterns...)
   ✓ Async errors: try/catch with typed errors
   ✓ Component errors: Error boundaries
   ✓ API errors: Standardized error responses
   ✓ Validation: Zod schemas
   ✓ User feedback: Toast notifications

   Common patterns:
   - Custom error classes
   - Error boundaries at route level
   - Zod for runtime validation
   - Consistent error message format

9️⃣ Hooks & Utilities (analyzing reusable code...)
   ✓ Custom hooks: 34 found in src/hooks/
   ✓ Naming: use[Function] convention
   ✓ Utilities: 67 functions in src/lib/
   ✓ Naming: camelCase, descriptive
   ✓ Tests: 89% have tests

   Common patterns:
   - Hooks extract reusable logic
   - Utils are pure functions
   - Single responsibility
   - Well-typed with generics

🔟 API Design (analyzing API routes...)
   ✓ Framework: Next.js API routes
   ✓ Structure: RESTful endpoints
   ✓ Validation: Zod schemas
   ✓ Error handling: Standard format
   ✓ Auth: Middleware-based

   Common patterns:
   - Consistent response format
   - Proper HTTP status codes
   - Request validation required
   - Type-safe with tRPC

📋 Additional Discoveries:
   - Import aliases: @ for src/
   - Const naming: SCREAMING_SNAKE_CASE
   - Enum usage: Avoided, use const objects
   - Comments: JSDoc for public APIs only
   - README: Present in complex features
   - Environment: .env.local for secrets
   - Package manager: pnpm
   - Deployment: Vercel
```

### Step 3: Standards Comparison

**If you have existing standards:**

```
📊 Comparing discovered patterns to existing standards...

✅ Matches (32 patterns):
   - Component file naming (PascalCase) ✓
   - Named exports ✓
   - TypeScript strict mode ✓
   - Tailwind for styling ✓
   - Vitest for testing ✓
   [... 27 more]

⚠️  Differences Found (8 patterns):

1. Props Interface Naming
   Current standards say: "Use [Component]Props"
   Codebase actually uses: "I[Component]Props" (156/156 files)

   Suggestion: Update standard to match actual practice?
   [Y]es, [N]o, [E]xplain more

2. Export Style
   Current standards say: "Default exports for components"
   Codebase actually uses: "Named exports only" (156/156 files)

   Suggestion: Update standard to match actual practice?
   [Y]es, [N]o, [E]xplain more

3. Test File Naming
   Current standards say: "[name].spec.tsx"
   Codebase actually uses: "[name].test.tsx" (89/89 files)

   Suggestion: Update standard to match actual practice?
   [Y]es, [N]o, [E]xplain more

🆕 Not in Standards (15 patterns):

1. Error Handling Pattern
   Not documented in standards, but consistently used:
   - Custom error classes
   - Error boundaries at route level
   - Zod for validation
   - Standard error response format

   Suggestion: Create new "error-handling-standards.md"?
   [Y]es, [N]o, [S]how example first

2. Data Fetching Pattern
   Not documented in standards, but consistently used:
   - TanStack Query for client-side
   - Server Components for server-side
   - Optimistic updates pattern
   - Consistent loading states

   Suggestion: Create new "data-fetching-standards.md"?
   [Y]es, [N]o, [S]how example first

3. Form Handling Pattern
   Not documented in standards, but consistently used:
   - React Hook Form
   - Zod validation
   - Consistent error display
   - Optimistic updates

   Suggestion: Create new "form-standards.md"?
   [Y]es, [N]o, [S]how example first

[... 12 more patterns]
```

**If you have NO existing standards:**

```
📊 No existing standards found. I'll create comprehensive standards from scratch!

Creating standards for:
✓ Component patterns (react-standards.md)
✓ TypeScript conventions (typescript-standards.md)
✓ Styling approach (styling-standards.md)
✓ Testing patterns (testing-standards.md)
✓ File organization (file-structure.md)
✓ State management (state-management-standards.md)
✓ Data fetching (data-fetching-standards.md)
✓ Error handling (error-handling-standards.md)
✓ Form handling (form-standards.md)
✓ API design (api-standards.md)

All standards based on your actual codebase!
```

### Step 4: Interactive Decisions

**For each difference/new pattern:**

**Example 1: Update existing standard**
```
⚠️  Props Interface Naming Mismatch

Current Standard (typescript-standards.md, line 45):
---
Props interfaces should be named [ComponentName]Props

Example:
interface ButtonProps {
  label: string;
}
---

Discovered Pattern (156/156 components):
---
Props interfaces are named I[ComponentName]Props

Examples found:
- IButtonProps (src/components/Button.tsx)
- IUserProfileProps (src/components/UserProfile.tsx)
- ICardProps (src/components/Card.tsx)
... and 153 more
---

The codebase is 100% consistent with the "I" prefix pattern.

Options:
1. Update standard to match codebase (I[Component]Props)
2. Keep current standard ([Component]Props)
3. Show me more examples
4. Skip for now

Your choice [1-4]:
```

**You choose 1:**
```
✓ Updating typescript-standards.md...

Changed:
- Line 45: "Props interfaces should be named [ComponentName]Props"
+ Line 45: "Props interfaces should be named I[ComponentName]Props"

Added rationale:
"This pattern provides clear visual distinction between interfaces
and other types, and is consistently used across the codebase."

Added examples from actual codebase.
```

**Example 2: Create new standard**
```
🆕 Error Handling Pattern Not Documented

Discovered consistent pattern across 234 files:

Pattern Summary:
- Custom error classes extending Error
- Error boundaries at route level
- Zod for input validation
- Standard error response: { error: string, details?: unknown }
- Toast notifications for user feedback

Example from codebase (src/lib/errors.ts):
---
export class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
---

Usage found in 89 API routes, 67 client functions.

Create "error-handling-standards.md" with this pattern?

Options:
1. Yes, create new standard
2. Show me full proposed content first
3. Add to existing file instead (which file?)
4. Skip for now

Your choice [1-4]:
```

**You choose 2:**
```
📄 Proposed error-handling-standards.md:

---
# Error Handling Standards

**Discovered from codebase analysis**
**Last updated:** 2025-10-14

## Overview

This project uses a consistent error handling strategy across
client and server code.

## Custom Error Classes

**Location:** src/lib/errors.ts

Define custom error classes for different scenarios:

[... full proposed content shown ...]

---

Create this file? [Y/n]:
```

### Step 5: Batch Operations

**After reviewing individually:**

```
📊 Summary of Changes

Updates to Existing Standards (8):
✓ typescript-standards.md (3 updates)
✓ react-standards.md (2 updates)
✓ testing-standards.md (2 updates)
✓ styling-standards.md (1 update)

New Standards Files (7):
✓ error-handling-standards.md
✓ data-fetching-standards.md
✓ form-standards.md
✓ state-management-standards.md
✓ api-standards.md
✓ hooks-standards.md
✓ utility-standards.md

Apply all changes? [Y/n/review]:
```

### Step 6: Registration & Validation

```
✅ Applying changes...

Updated files:
✓ .claude/your-stack/coding-standards/typescript-standards.md
✓ .claude/your-stack/coding-standards/react-standards.md
✓ .claude/your-stack/testing-standards/testing-standards.md
✓ .claude/your-stack/coding-standards/styling-standards.md

Created files:
✓ .claude/your-stack/coding-standards/error-handling-standards.md
✓ .claude/your-stack/coding-standards/data-fetching-standards.md
✓ .claude/your-stack/coding-standards/form-standards.md
✓ .claude/your-stack/coding-standards/state-management-standards.md
✓ .claude/your-stack/architecture/api-standards.md
✓ .claude/your-stack/coding-standards/hooks-standards.md
✓ .claude/your-stack/coding-standards/utility-standards.md

Registering in stack-config.yaml...
✓ Added new standards to standards_active list
✓ Updated discovery metadata

Creating analysis log...
✓ .claude/your-stack/discovery-log.md

All changes applied!
```

### Step 7: Verification

```
🔍 Verifying changes...

Running /verify against codebase...

✅ All checks pass!

Your standards now match your actual codebase patterns.

Summary:
- 247 files analyzed
- 52 patterns discovered
- 8 standards updated
- 7 standards created
- 100% consistency with codebase

Next steps:
1. Review generated files
2. Commit changes to git
3. Share with team
4. Use /start-task with new standards
```

---

## What Gets Analyzed (No Limits!)

### Code Patterns
- Component structure and patterns
- Function/class patterns
- Import/export styles
- Type definitions
- Naming conventions

### Architecture
- File organization
- Directory structure
- Module boundaries
- Feature organization
- Code colocation

### Technology Usage
- Framework patterns (React, Vue, Svelte, etc.)
- Language conventions (TypeScript, JavaScript)
- Styling approach (Tailwind, CSS Modules, etc.)
- State management (Zustand, Redux, Pinia, etc.)
- Data fetching (TanStack Query, SWR, etc.)
- Form handling (React Hook Form, Formik, etc.)
- Testing (Vitest, Jest, Playwright, etc.)
- Build tools (Vite, Webpack, etc.)

### Best Practices
- Error handling
- Loading states
- Validation
- Authentication patterns
- Authorization patterns
- Security practices
- Performance optimizations
- Accessibility patterns

### Documentation
- Comment styles
- README structure
- Type documentation
- API documentation
- Inline documentation

### Undocumented Patterns
- **Anything** Claude finds that's consistent
- Custom utilities
- Helper functions
- Shared patterns
- Team conventions
- Project-specific approaches

---

## Smart Features

### Pattern Recognition
- Identifies consistency (if 90%+ use a pattern, it's standard)
- Detects variations (if 50/50 split, shows both options)
- Finds outliers (highlights inconsistencies for you to fix)

### Intelligent Suggestions
- Updates standards when codebase is more consistent than docs
- Creates new standards for undocumented patterns
- Suggests deprecating unused patterns
- Highlights breaking conventions

### Context-Aware
- Understands framework-specific patterns
- Recognizes ecosystem conventions
- Identifies anti-patterns
- Suggests improvements

---

## Examples

### Example 1: New to Company

**Scenario:** Just joined, no idea what the patterns are

```bash
/import-standards analyze codebase

# Claude analyzes everything
# Discovers all patterns
# Creates comprehensive standards from scratch
# Now you know "the way things are done here"
```

**Result:** Complete standards documentation generated from actual code

### Example 2: Open Source Contribution

**Scenario:** Want to contribute, need to match project style

```bash
/import-standards analyze codebase

# Claude learns project patterns
# Shows you conventions to follow
# Highlights areas where style varies
# Gives you confidence to contribute
```

**Result:** You write code that matches project style perfectly

### Example 3: Docs Out of Sync

**Scenario:** Company has docs but they don't match reality

```bash
/import-standards analyze codebase

# Claude compares docs to actual code
# Shows mismatches (8 found!)
# Suggests updating docs to match code
# Or suggests updating code to match docs
```

**Result:** Standards aligned with actual practices

### Example 4: New Pattern Adopted

**Scenario:** Team started using TanStack Query but no docs exist

```bash
/import-standards analyze codebase

# Claude discovers TanStack Query usage
# Identifies consistent patterns
# Creates data-fetching-standards.md
# Documents what team is already doing
```

**Result:** New pattern officially documented

---

## Advanced Options

### Selective Analysis

**Analyze specific areas:**
```
/import-standards analyze src/components only
/import-standards analyze --type=testing
/import-standards analyze --pattern="*.hook.ts"
```

### Comparison Mode

**Compare to specific standard:**
```
/import-standards analyze --compare-to=typescript-standards.md
```

Shows only differences from that standard.

### Suggestion Mode

**Auto-suggest without asking:**
```
/import-standards analyze --auto-suggest
```

Creates suggested changes, shows you for review, doesn't apply.

### Discovery Only

**Just analyze, don't create files:**
```
/import-standards analyze --report-only
```

Generates analysis report without modifying standards.

---

## Option 1 Full Workflow (From Documentation)

### Sources Supported

**1. Google Drive (via context7 MCP)**
- Searches all docs you have access to
- Supports Google Docs, PDFs, text files
- Finds by title, content, keywords

**2. Confluence (via context7 MCP)**
- Searches all spaces you can access
- Pages and attachments

**3. Notion (via context7 MCP)**
- Searches pages, databases
- Nested pages included

**4. Local Files**
- Markdown, text, PDF, Word
- From project directories or anywhere on disk

**5. File Upload**
- Drag and drop any format
- PDF, Word, Markdown, HTML, Text

### Import Process

1. **Find documents** from chosen source
2. **Read and parse** content
3. **Extract standards** (coding, architecture, testing, etc.)
4. **Resolve conflicts** with existing standards (if any)
5. **Convert to framework format** (markdown)
6. **Create standards files** in `.claude/your-stack/`
7. **Register in stack-config.yaml**
8. **Verify** everything works

### Conflict Resolution

**When imported docs conflict with existing:**

```
⚠️  Conflict: File Naming

Imported standard says: "Use kebab-case"
Existing standard says: "Use PascalCase"

Options:
1. Use imported (kebab-case)
2. Keep existing (PascalCase)
3. Merge both (explain when each applies)
4. Skip for now

Your choice [1-4]:
```

---

## After Import/Analysis

### Review Generated Files

```bash
# Check what was created/updated
ls -la .claude/your-stack/coding-standards/
cat .claude/your-stack/coding-standards/react-standards.md
```

### Test Against Codebase

```bash
# Verify standards match your code
/verify
```

### Commit Changes

```bash
git add .claude/your-stack/
git commit -m "feat: import/discover project standards"
```

### Share with Team

Everyone on team should have same standards:

```bash
git push origin main
# Team members pull to get standards
```

---

## Best Practices

### DO

✅ **Analyze early** - Do this when joining project or setting up
✅ **Review suggestions** - Don't blindly accept all changes
✅ **Update periodically** - Re-analyze as codebase evolves
✅ **Commit standards** - Keep in version control
✅ **Share with team** - Ensure everyone has same standards
✅ **Document decisions** - Note why you chose certain patterns

### DON'T

❌ **Skip review** - Always review what gets generated
❌ **Ignore inconsistencies** - If codebase is inconsistent, pick one pattern
❌ **Never update** - Patterns evolve, keep standards current
❌ **Keep outdated** - Remove deprecated patterns from standards
❌ **Work alone** - Discuss significant changes with team

---

## Related Commands

- `/research-stack` - Generate standards from official docs
- `/add-standard` - Add a new custom standard
- `/verify` - Check code against standards
- `/start-task` - Use standards when coding

---

## Privacy & Security

### What Claude Sees (Option 1 - Documentation)
- Document content
- File names and structure
- Metadata (dates, authors)

### What Claude Sees (Option 2 - Codebase)
- All code files
- File structure
- Patterns and conventions
- No execution, just analysis

### What Claude Doesn't Store
- Documents read once, not stored
- Code analyzed locally
- No data sent to external servers (when using Claude Desktop)

### Best Practices
- Review files before importing
- Remove secrets from docs first
- Check generated files for sensitive info
- Use read-only access when possible

---

**The most powerful way to learn a new codebase: let Claude analyze it and teach you the patterns!** 🚀
