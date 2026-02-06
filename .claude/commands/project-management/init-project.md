# /init-project

**Define what you're building before you build it.**

Optional. Use for complex projects where you need to document the product before coding.

For simple projects, skip this and run `/sync-stack` directly.

---

## What This Creates

- `specs/init/product-brief.md` - What you're building and why
- `specs/init/project-guidelines.md` - Quality requirements
- `specs/design/design-tokens.json` - Colors, spacing, typography
- `README.md` - Project overview

---

## Questions

### 1. What problem are you solving?

### 2. Who is this for?
- General public
- Specific professional group
- Internal tool
- Other

### 3. What type of solution?
- Website / web app
- Mobile app
- Desktop app
- CLI tool
- API / backend service
- Library

### 4. What's the main thing users will do?

### 5. How will you know it's successful?

### 6. Project name?

---

## Quality Approach

Choose one:

1. **Speed First** - MVP, prototype. Basic testing.
2. **Balanced** - Production app. Good test coverage, WCAG AA.
3. **Quality First** - Enterprise/regulated. High coverage, WCAG AAA.

---

## Design Foundation

What's the primary feel?
1. Professional & Corporate
2. Creative & Vibrant
3. Minimal & Modern
4. Warm & Friendly
5. Technical

Generates design tokens and basic design system file.

---

## After This

Run `/sync-stack` to set up your tech stack and coding specs.
