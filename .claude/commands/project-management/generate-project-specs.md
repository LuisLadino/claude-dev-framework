# /generate-project-specs

**Generate detailed project documentation.**

Use when you need comprehensive specs before development (enterprise, teams, complex projects).

Requires: `stack-config.yaml` exists. Run `/sync-stack` first.

---

## What This Creates

Creates a `project-specs/` directory with:

```
project-specs/
├── prd.md                    # Product requirements
├── user-stories.md           # User stories with acceptance criteria
├── architecture.md           # System architecture + diagrams
├── api-spec.md              # API endpoints and contracts
├── database-schema.md       # ER diagrams, schema design
└── README.md                # Navigation
```

---

## How It Works

1. Load stack from `stack-config.yaml`
2. Load product brief from `specs/init/` if exists
3. Ask clarifying questions about scope
4. Research architecture patterns for your stack
5. Generate docs using Mermaid for diagrams
6. Create `project-specs/` directory

---

## When to Use

- Enterprise projects with multiple developers
- Projects requiring sign-off before development
- Complex systems needing architecture planning
- API-first development

**Skip for:** Solo projects, MVPs, prototypes. Just use `/start-task`.

---

## After Generation

1. Review `prd.md` - Does it match your vision?
2. Check `architecture.md` - Validate the approach
3. Review `api-spec.md` - Confirm API design
4. Start building with `/start-task`
