# /generate-project-specs

**Generate comprehensive enterprise-level project specifications**

---

## Purpose

Create a complete `project-specs/` directory with all documentation needed to build an enterprise-quality product.

**Step 2** in the product development workflow:
1. `/init-project` - Define product + choose tech stack
2. `/generate-project-specs` (this command) - Create comprehensive documentation using stack from config
3. `/research-stack` - Create coding standards
4. Build

---

## Prerequisites

**REQUIRED:** `stack-config.yaml` must exist (run `/init-project` first). This command reads the tech stack from config and generates specs based on those choices. It does NOT make tech stack decisions.

---

## Usage

```bash
/generate-project-specs [opportunity-name]
/generate-project-specs [opportunity-name] [research-report-path]
```

If stack-config.yaml doesn't exist, error and tell user to run `/init-project` first.

---

## What This Creates

A `project-specs/` directory with 25+ specification documents across these areas:

- **Product:** PRD, user stories, competitive analysis, go-to-market, success metrics
- **Design:** Design system requirements, user flows, information architecture, accessibility
- **Technical Architecture:** System architecture, tech stack docs (from config), database schema (ER diagrams), API spec, data flow, security
- **Implementation:** Frontend components, backend endpoints, file structures, state management, middleware, background jobs
- **Operations & Quality:** Deployment, testing strategy, monitoring, quality gates, code review, compliance

---

## Workflow

### Step 1: Verify Prerequisites

Check for `.claude/your-stack/stack-config.yaml`. If missing, error with instructions to run `/init-project` first. Load the tech stack from config.

### Step 2: Agent Initialization

Show the user: opportunity name, loaded tech stack summary, and what will be generated. Confirm all technical specs will use the stack from config. Ask if ready to start.

### Step 3: Specification Generation

Follow this 9-phase process:

1. **Foundation Loading** - Load stack config, product discovery frameworks, research report (if provided)
2. **Product Definition** - PRD, user stories with acceptance criteria, competitive analysis, go-to-market, success metrics
3. **Design Specifications** - Design system specs, user flows/journeys, information architecture, accessibility requirements
4. **Technical Architecture** - Architecture diagrams (Mermaid), tech stack docs from config, database schema with ER diagrams, API spec, data flow, security. All decisions respect the chosen stack.
5. **Frontend Specifications** - Component hierarchy, state management, routing, file organization, performance requirements
6. **Backend Specifications** - API endpoints, business logic, file structure, middleware, background jobs
7. **Infrastructure** - Deployment strategy, environment config, monitoring, scalability, disaster recovery
8. **Quality & Compliance** - Testing strategy, test plan, quality gates, code review standards, compliance
9. **Directory Creation** - Write all files, generate cross-references, create README navigation

### Step 4: Completion

Show summary of created directory structure with file counts per section. Offer to display the README. Suggest next step: `/research-stack`.

---

## Directory Structure

```
project-specs/
├── 01-product/
│   ├── prd.md                          # Product Requirements Document
│   ├── user-stories.md                 # User stories with acceptance criteria
│   ├── competitive-analysis.md         # Competition mapping
│   ├── go-to-market.md                 # Launch strategy
│   └── success-metrics.md              # KPIs and measurement
│
├── 02-design/
│   ├── design-system.md                # Design tokens, components
│   ├── user-flows.md                   # User journey maps
│   ├── information-architecture.md     # IA, sitemap, navigation
│   └── accessibility-requirements.md   # WCAG compliance plan
│
├── 03-technical/
│   ├── architecture.md                 # System architecture + diagrams
│   ├── tech-stack.md                   # Technology choices + rationale
│   ├── database-schema.md              # ER diagrams, schema
│   ├── api-specification.md            # REST/GraphQL API contracts
│   ├── data-flow.md                    # Data flow diagrams
│   ├── integration-points.md           # Third-party integrations
│   └── security-requirements.md        # Auth, encryption, compliance
│
├── 04-frontend/
│   ├── component-specifications.md     # Component hierarchy + props
│   ├── state-management.md             # State architecture (Redux/Zustand/etc)
│   ├── routing.md                      # Route definitions
│   ├── file-structure.md               # Frontend directory structure
│   └── performance-requirements.md     # Load times, bundle size
│
├── 05-backend/
│   ├── api-endpoints.md                # REST/GraphQL endpoint specs
│   ├── business-logic.md               # Core business rules
│   ├── file-structure.md               # Backend directory structure
│   ├── middleware.md                   # Auth, validation, logging
│   └── background-jobs.md              # Async tasks, queues
│
├── 06-infrastructure/
│   ├── deployment.md                   # Hosting, CI/CD pipeline
│   ├── environment-setup.md            # Dev, staging, prod configs
│   ├── monitoring.md                   # Logging, alerts, observability
│   ├── scalability.md                  # Load balancing, caching
│   └── disaster-recovery.md            # Backups, incident response
│
├── 07-quality/
│   ├── testing-strategy.md             # Unit, integration, E2E tests
│   ├── test-plan.md                    # Test cases + scenarios
│   ├── quality-gates.md                # Definition of Done
│   └── code-review-standards.md        # PR guidelines
│
├── 08-operations/
│   ├── runbook.md                      # Operational procedures
│   ├── troubleshooting.md              # Common issues + fixes
│   └── maintenance.md                  # Update procedures
│
├── 09-compliance/
│   ├── data-privacy.md                 # GDPR, CCPA compliance
│   └── legal-requirements.md           # Terms, privacy policy
│
└── README.md                           # Project overview + navigation
```

---

## Agent Instructions

**When this command is invoked:**

1. Check for stack-config.yaml (error if missing, tell user to run /init-project)
2. Load tech stack from `.claude/your-stack/stack-config.yaml`
3. Extract opportunity name and optional research report path
4. If research report provided, read and extract context
5. Use loaded tech stack for all technical specifications
6. Follow the 9-phase generation process
7. Create `./project-specs/` directory with all files
8. Ensure cross-references are valid
9. Create README.md with navigation
10. Display summary with next steps

**Quality standards:**
- All specs must be actionable (no vague placeholders)
- Tech stack specs must document choices from stack-config.yaml (NOT make new choices)
- Database schema must include ER diagrams (Mermaid)
- API spec must include all CRUD endpoints
- File structures must be realistic and complete
- All architectural decisions must respect the tech stack from config

**Research to conduct:** Best practices, architecture patterns, security, performance, testing strategies, and deployment approaches for the chosen stack.

**Diagrams:** Use Mermaid syntax for architecture, ER, and sequence diagrams.

---

## After Generation

**Review in this order:**
1. `project-specs/README.md` - Overview
2. `01-product/prd.md` - Matches your vision?
3. `03-technical/architecture.md` - Validate approach
4. `03-technical/tech-stack.md` - Matches stack-config.yaml?
5. `03-technical/database-schema.md` - Verify data model
6. `03-technical/api-specification.md` - Confirm API design

All specs are editable markdown. If you change tech stack in specs, update stack-config.yaml to match.

**When satisfied:** Run `/research-stack` to generate coding standards.

---

## Notes

- MUST run /init-project first to create stack-config.yaml
- All specs are interlinked and consistent
- Tech stack loaded from stack-config.yaml (no new tech decisions made)
- Architectural decisions based on best practices for chosen stack
- Specs serve as source of truth throughout development
- Can regenerate or modify individual files as needed
