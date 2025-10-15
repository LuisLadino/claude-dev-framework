# /add-standard

**Add a new custom standard to your project**

This command helps you extend the framework with your own standards files - whether for design systems, animations, accessibility, performance, or any other domain-specific patterns.

---

## Purpose

Quickly add custom standards to your project:
- Creates the file in the correct location
- Registers it in `stack-config.yaml`
- Optionally generates content using `/research-stack`
- Ensures everything works together

**Use when:**
- You need standards for a specific domain (design, animation, performance)
- Your project has unique requirements
- You want to enforce team conventions
- You're adding new technologies to your stack

---

## Usage

### Basic Usage

```bash
/add-standard
```

Claude will guide you through an interactive process.

### Quick Usage

```bash
/add-standard design-standards
```

Provide the standard name upfront to skip initial questions.

---

## Interactive Flow

### Step 1: Standard Type

**Claude asks:**
```
What type of standard would you like to add?

1. Coding Standard
   → Goes in: .claude/your-stack/coding-standards/
   → Examples: design-standards, animation-standards, accessibility-standards
   → Registered in: stack-config.yaml > standards_active

2. Architecture Pattern
   → Goes in: .claude/your-stack/architecture/
   → Examples: design-system-patterns, api-patterns, state-management-patterns
   → Registered in: stack-config.yaml > architecture_patterns

3. Documentation Standard
   → Goes in: .claude/your-stack/documentation-standards/
   → Examples: api-docs, design-docs, architecture-docs
   → Registered in: stack-config.yaml > documentation_standards

Which type? [1-3]:
```

**You choose:** `1` (for example)

---

### Step 2: Standard Name

**Claude asks:**
```
What should this standard be called?

Examples:
- design-standards
- animation-standards
- accessibility-standards
- performance-standards
- seo-standards

Use kebab-case (lowercase with hyphens).

Name:
```

**You provide:** `design-standards`

---

### Step 3: Confirm Details

**Claude shows:**
```
📋 Standard Configuration

Type:     Coding Standard
Name:     design-standards
File:     .claude/your-stack/coding-standards/design-standards.md
Registry: stack-config.yaml > standards_active

This will:
✓ Create design-standards.md with template structure
✓ Add "design-standards" to stack-config.yaml
✓ Validate the configuration

Proceed? (y/n):
```

**You confirm:** `y`

---

### Step 4: Create File

**Claude creates the file:**

`.claude/your-stack/coding-standards/design-standards.md`:
```markdown
# Design Standards

> **Created:** [Date]
> **Last Updated:** [Date]

---

## Overview

[Describe what this standard covers]

## Patterns

### Pattern 1

[Your pattern here]

```typescript
// Example code
```

### Pattern 2

[Your pattern here]

## Best Practices

1. [Best practice 1]
2. [Best practice 2]
3. [Best practice 3]

## Examples

### Example 1: [Title]

```typescript
// Example implementation
```

## Anti-Patterns

### ❌ Don't Do This

```typescript
// Bad example
```

### ✅ Do This Instead

```typescript
// Good example
```

---

## References

- [Official docs]
- [Community best practices]
- [Your team's conventions]
```

**Output:**
```
✓ Created: .claude/your-stack/coding-standards/design-standards.md
```

---

### Step 5: Update stack-config.yaml

**Claude updates the config:**

Before:
```yaml
standards_active:
  - react-standards
  - typescript-standards
  - styling-standards
  - testing-standards
```

After:
```yaml
standards_active:
  - react-standards
  - typescript-standards
  - styling-standards
  - testing-standards
  - design-standards       # ← ADDED
```

**Output:**
```
✓ Updated: .claude/your-stack/stack-config.yaml
✓ Registered: design-standards in standards_active
```

---

### Step 6: Generate Content (Optional)

**Claude asks:**
```
📝 Content Generation

The file has a basic template structure.

Would you like to generate detailed content using /research-stack?

Options:

1. Yes - Research and generate detailed standards
   → Claude researches best practices
   → Generates comprehensive, current standards
   → Overwrites template with researched content

2. No - I'll write it manually
   → Keep the template structure
   → You customize it yourself

3. Partial - Research specific topics only
   → Tell Claude what to research
   → Adds to template without full overwrite

Choose [1/2/3]:
```

**If you choose 1 (Research):**

**Claude asks:**
```
What should I research for your design standards?

Examples:
- "Design tokens and theming best practices"
- "Component library design patterns"
- "Tailwind CSS design system setup"
- "Material Design 3 principles"
- "Your company design system" (provide docs)

What to research:
```

**You provide:** `"Design tokens, component variants, and responsive design patterns for Tailwind CSS"`

**Claude then:**
```
🔍 Researching design patterns...
   ✓ Design tokens and CSS variables
   ✓ Component variant patterns
   ✓ Responsive design with Tailwind
   ✓ Best practices 2024-2025

📝 Generating standards...

✓ Updated: design-standards.md with researched content
✓ Includes:
  - Design token structure
  - Component variant patterns
  - Responsive breakpoint strategy
  - Color and typography systems
  - Spacing and layout patterns
```

---

## Step 7: Validation

**Claude validates:**
```
🔍 Validating configuration...

✓ File exists: .claude/your-stack/coding-standards/design-standards.md
✓ Registered in: stack-config.yaml
✓ File is readable
✓ YAML syntax valid
✓ No duplicate entries

✅ Standard successfully added!
```

---

## Step 8: Next Steps

**Claude shows:**
```
✅ Success! design-standards added to your project.

Next steps:

1. Review the file:
   cat .claude/your-stack/coding-standards/design-standards.md

2. Customize as needed:
   nano .claude/your-stack/coding-standards/design-standards.md

3. Test it works:
   /start-task "Build something that uses design standards"
   → Claude will now read and apply design-standards.md

4. Commit to version control:
   git add .claude/your-stack/
   git commit -m "feat: add design standards"

Your /start-task, /verify, and other commands will now automatically
read and enforce design-standards.md!
```

---

## Examples

### Example 1: Adding Animation Standards

```bash
/add-standard

Type: 1 (Coding Standard)
Name: animation-standards

# Creates:
.claude/your-stack/coding-standards/animation-standards.md

# Registers in stack-config.yaml:
standards_active:
  - animation-standards

# Then research:
Research: "Framer Motion best practices and animation principles"
```

**Result:** Complete animation standards file with Framer Motion patterns

---

### Example 2: Adding Performance Standards

```bash
/add-standard performance-standards

Type: 1 (Coding Standard)
Generate: Yes
Research: "Web performance optimization, Core Web Vitals, React performance"
```

**Result:** Standards file with:
- Core Web Vitals guidelines
- React rendering optimization
- Bundle size management
- Image optimization patterns

---

### Example 3: Adding Design System Architecture

```bash
/add-standard

Type: 2 (Architecture Pattern)
Name: design-system-patterns

# Creates:
.claude/your-stack/architecture/design-system-patterns.md

# Registers in:
architecture_patterns:
  - design-system-patterns
```

**Result:** Architecture document for design system organization

---

## What Gets Created

### File Structure

**Coding Standard:**
```
.claude/your-stack/
└── coding-standards/
    └── [name]-standards.md    # ← New file
```

**Architecture Pattern:**
```
.claude/your-stack/
└── architecture/
    └── [name]-patterns.md     # ← New file
```

**Documentation Standard:**
```
.claude/your-stack/
└── documentation-standards/
    └── [name]-standards.md    # ← New file
```

### Config Updates

**stack-config.yaml** updated with:
```yaml
standards_active:        # For coding standards
  - [your-standard-name]

architecture_patterns:   # For architecture patterns
  - [your-pattern-name]

documentation_standards: # For doc standards
  - [your-doc-standard]
```

---

## Template Structure

### Coding Standard Template

```markdown
# [Name] Standards

> **Created:** [Date]
> **Last Updated:** [Date]

---

## Overview

[What this standard covers]

## Patterns

### Pattern Name

[Description]

[Code example]

## Best Practices

1. [Practice 1]
2. [Practice 2]

## Examples

[Real examples]

## Anti-Patterns

### ❌ Avoid

[Bad example]

### ✅ Prefer

[Good example]

---

## References

[Links to docs, articles, etc.]
```

### Architecture Pattern Template

```markdown
# [Name] Architecture

> **Created:** [Date]
> **Last Updated:** [Date]

---

## Overview

[Architecture description]

## Structure

[Directory/file organization]

## Patterns

### Pattern 1

[Pattern details]

## Integration

[How it fits with other patterns]

## Examples

[Real project examples]

---

## References

[Links to docs]
```

---

## Advanced Usage

### Add Multiple Standards at Once

```bash
# Add several related standards
/add-standard design-standards
/add-standard animation-standards
/add-standard accessibility-standards

# Then research all together
/research-stack
"Update design, animation, and accessibility standards"
```

### Add Standard with Custom Content

```bash
/add-standard api-standards

# Choose: "No" for research
# Then manually write your API conventions:

nano .claude/your-stack/coding-standards/api-standards.md
```

### Add Standard from Company Docs

```bash
/add-standard company-design-standards

# Choose: "Yes" for research
# Provide company design docs
Research: "Our company design system from [link to docs]"
```

---

## Validation Checks

When adding a standard, Claude validates:

1. **File Creation**
   - ✓ Directory exists
   - ✓ File is writable
   - ✓ No filename conflicts

2. **Config Update**
   - ✓ YAML syntax is valid
   - ✓ No duplicate entries
   - ✓ Correct section (standards_active, architecture_patterns, etc.)

3. **Discoverability**
   - ✓ `project_knowledge_search` can find it
   - ✓ File follows naming convention
   - ✓ Registered correctly

4. **Accessibility**
   - ✓ Commands can read it
   - ✓ Listed in correct YAML section
   - ✓ File permissions correct

---

## Common Use Cases

### Use Case 1: Design System

**Need:** Enforce design token usage

```bash
/add-standard design-standards
Research: "Design tokens, Tailwind CSS theming, component variants"
```

**Creates standards for:**
- Color tokens
- Typography scale
- Spacing system
- Component variants

---

### Use Case 2: Performance

**Need:** Enforce performance best practices

```bash
/add-standard performance-standards
Research: "React performance, Core Web Vitals, bundle optimization"
```

**Creates standards for:**
- Component optimization
- Code splitting
- Image optimization
- Loading strategies

---

### Use Case 3: Accessibility

**Need:** Enforce WCAG compliance

```bash
/add-standard accessibility-standards
Research: "WCAG 2.2 AA compliance, ARIA patterns, keyboard navigation"
```

**Creates standards for:**
- Semantic HTML
- ARIA usage
- Keyboard navigation
- Color contrast

---

### Use Case 4: SEO

**Need:** SEO best practices

```bash
/add-standard seo-standards
Research: "Technical SEO for React, meta tags, structured data"
```

**Creates standards for:**
- Meta tags
- Structured data
- Open Graph
- Performance metrics

---

## Troubleshooting

### "File already exists"

**Error:**
```
✗ design-standards.md already exists
```

**Solution:**
1. Choose a different name, OR
2. Delete/rename the existing file, OR
3. Use `/research-stack` to update the existing file

---

### "Can't update stack-config.yaml"

**Error:**
```
✗ Failed to update stack-config.yaml
```

**Solution:**
1. Check file permissions
2. Ensure YAML syntax is valid
3. Manually add the entry:
   ```yaml
   standards_active:
     - your-standard-name
   ```

---

### "Commands don't read new standard"

**Issue:** `/start-task` doesn't use your new standard

**Solutions:**

1. **Check registration:**
   ```bash
   cat .claude/your-stack/stack-config.yaml | grep your-standard-name
   ```

2. **Verify file location:**
   ```bash
   ls .claude/your-stack/coding-standards/your-standard-name.md
   ```

3. **Test discoverability:**
   ```bash
   # In Claude:
   Use project_knowledge_search to find "your-standard-name"
   ```

4. **Restart Claude session** (sometimes needed for config reload)

---

## Tips

### 1. Use Descriptive Names

✅ Good:
- `design-standards`
- `animation-standards`
- `api-security-standards`

❌ Avoid:
- `standards` (too generic)
- `designStandards` (use kebab-case)
- `my_standards` (use hyphens not underscores)

### 2. One Domain Per File

Keep standards focused:
- ✅ Separate: `design-standards.md` + `animation-standards.md`
- ❌ Combined: `design-and-animation-standards.md`

### 3. Research When Possible

Let AI generate detailed content:
- ✅ Use research for unfamiliar domains
- ✅ Gets current best practices (2024-2025)
- ✅ Includes real examples

### 4. Keep Templates When Learning

If you're learning, keep the template structure:
- Start with template
- Add your learnings over time
- Eventually replace with researched content

---

## Integration with Other Commands

### Works with `/start-task`

```bash
/add-standard design-standards
# Register it...

/start-task "Build a hero section"
# ✓ Automatically reads design-standards.md
# ✓ Applies your design tokens
# ✓ Follows your patterns
```

### Works with `/verify`

```bash
/verify
# ✓ Checks code against ALL standards
# ✓ Includes your custom standards
# ✓ Reports violations
```

### Works with `/research-stack`

```bash
/add-standard animation-standards
# Creates file with template...

/research-stack "Update animation standards"
# ✓ Researches Framer Motion patterns
# ✓ Overwrites template with detailed content
# ✓ Keeps registration in config
```

---

## Summary

`/add-standard` makes it easy to extend the framework:

1. **Creates** the file in the right place
2. **Registers** it in `stack-config.yaml`
3. **Optionally researches** and generates content
4. **Validates** everything works
5. **Works immediately** with all commands

**Use it whenever you need domain-specific standards beyond the defaults!**

---

## Related Commands

- `/research-stack` - Generate/update standard content
- `/import-standards` - Import from company docs
- `/verify` - Check code against all standards
- `/start-task` - Build with standards enforcement

---

**Quick Reference:**

```bash
# Add new standard (interactive)
/add-standard

# Add with name (faster)
/add-standard design-standards

# Add and research immediately
/add-standard performance-standards
→ Choose: "Yes - Research"
→ Provide: Research topic
```
