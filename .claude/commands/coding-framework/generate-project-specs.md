# /generate-project-specs

**Generate comprehensive enterprise-level project specifications**

---

## Purpose

Create a complete `project-specs/` directory with all documentation needed to build an enterprise-quality product.

**This is Step 2** in the product development workflow:
1. **Initialize project** (`/init-project`) - Define product + choose tech stack → creates `stack-config.yaml`
2. **Generate project specs** ← You are here - Creates comprehensive documentation using tech stack from config
3. Generate coding standards (`/research-stack`) - Creates standards for chosen stack
4. Build

---

## Prerequisites

**REQUIRED:** You must run `/init-project` first to create `stack-config.yaml`.

This command READS the tech stack from `stack-config.yaml` and generates specifications based on those choices. It does NOT make tech stack decisions - those come from init-project.

---

## Usage

```bash
/generate-project-specs [opportunity-name]
```

Or with research report:
```bash
/generate-project-specs [opportunity-name] [research-report-path]
```

**Examples:**
```bash
# From research report (after running /init-project)
/generate-project-specs "Design system manager" .claude/research/opportunity-figma-plugins-2025-01-20.md

# From description (after running /init-project)
/generate-project-specs "Collaborative design system manager for mid-size teams"
```

**What if stack-config.yaml doesn't exist?**

The command will error and tell you to run `/init-project` first.

---

## What This Does

**Generates Complete Project Specifications (120-150 min):**

Creates `project-specs/` directory with:

### Product Documentation
- Product Requirements Document (PRD)
- User stories and acceptance criteria
- Competitive analysis
- Go-to-market strategy
- Success metrics

### Design Specifications
- Design system requirements
- User flows and journey maps
- Information architecture
- Accessibility requirements

### Technical Architecture
- System architecture design
- Tech stack documentation (from stack-config.yaml)
- Database schema (with ER diagrams)
- API specification (RESTful/GraphQL)
- Data flow diagrams
- Security requirements

### Implementation Specs
- Frontend component specifications
- Backend API endpoints
- File structure (frontend + backend)
- State management architecture
- Middleware and background jobs

### Operations & Quality
- Deployment strategy
- Testing strategy
- Monitoring and observability
- Quality gates
- Code review standards
- Compliance requirements

**Total:** 25+ specification documents

---

## Workflow

### Step 1: Verify Prerequisites

**Check for stack-config.yaml:**

```bash
# Agent checks
if (!exists('.claude/your-stack/stack-config.yaml')) {
  error("❌ stack-config.yaml not found\n\nPlease run /init-project first to:\n1. Define your product\n2. Choose your tech stack\n3. Set up design system\n\nThen come back and run /generate-project-specs")
}
```

**Load tech stack from config:**

```bash
stack = readYAML('.claude/your-stack/stack-config.yaml')
```

### Step 2: Agent Initialization

```
📝 PROJECT SPECIFICATIONS GENERATOR

Opportunity: [opportunity-name]
Research Report: [path or "none"]

✓ Loaded tech stack from stack-config.yaml:
  - Framework: [stack.framework]
  - Language: [stack.language]
  - Database: [stack.database]
  - [other key tech choices]

I'm going to generate comprehensive project specifications using this stack.

This will take approximately 120-150 minutes and includes:
✓ Product definition (PRD, user stories)
✓ Design specifications (flows, IA, accessibility)
✓ Technical architecture (system, database, API) - USING YOUR CHOSEN STACK
✓ Frontend specifications (components, state, routing)
✓ Backend specifications (endpoints, logic, structure)
✓ Infrastructure planning (deployment, monitoring)
✓ Quality standards (testing, gates, compliance)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to start? (yes/no)
```

### Step 3: Specification Generation

Agent follows the project-specs-generator.md process:

**Phase 1: Foundation Loading (5 min)**
```
Loading foundations and context...
✓ Tech stack from stack-config.yaml
✓ Product discovery frameworks
✓ Feature definition standards
✓ Research report (if provided)
```

**Phase 2: Product Definition (20 min)**
```
Creating product documentation...
✓ PRD with problem statement, solution, personas
✓ User stories with acceptance criteria
✓ Competitive analysis
✓ Go-to-market strategy
✓ Success metrics
```

**Phase 3: Design Specifications (15 min)**
```
Defining design requirements...
✓ Design system specifications
✓ User flows and journeys
✓ Information architecture
✓ Accessibility requirements (WCAG AA)
```

**Phase 4: Technical Architecture (25 min)**
```
Designing system architecture...
✓ Architecture diagrams (Mermaid) - using [framework] + [database]
✓ Tech stack documentation (from stack-config.yaml)
✓ Database schema with ER diagram - using [database]
✓ API specification (RESTful) - using [framework] patterns
✓ Data flow diagrams
✓ Security architecture

Note: All architecture decisions respect the tech stack chosen in /init-project.
No tech decisions made here - only architectural design using chosen stack.
```

**Phase 5: Frontend Specifications (15 min)**
```
Planning frontend implementation...
✓ Component hierarchy and specs
✓ State management architecture
✓ Routing structure
✓ File organization
✓ Performance requirements
```

**Phase 6: Backend Specifications (15 min)**
```
Planning backend implementation...
✓ API endpoint specifications
✓ Business logic definition
✓ File structure
✓ Middleware requirements
✓ Background job architecture
```

**Phase 7: Infrastructure (15 min)**
```
Planning operations and deployment...
✓ Deployment strategy
✓ Environment configuration
✓ Monitoring and observability
✓ Scalability plan
✓ Disaster recovery
```

**Phase 8: Quality & Compliance (10 min)**
```
Defining quality standards...
✓ Testing strategy (unit, integration, E2E)
✓ Test plan and scenarios
✓ Quality gates (coverage, linting)
✓ Code review standards
✓ Compliance requirements
```

**Phase 9: Directory Creation (5 min)**
```
Creating project-specs/ directory...
✓ Writing all specification files
✓ Generating cross-references
✓ Creating README navigation
```

### Step 4: Completion

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PROJECT SPECIFICATIONS COMPLETE

Created: ./project-specs/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 DIRECTORY STRUCTURE

project-specs/
├── 01-product/        (5 files)  - PRD, user stories, metrics
├── 02-design/         (4 files)  - Design system, flows, IA
├── 03-technical/      (7 files)  - Architecture, DB, API
├── 04-frontend/       (5 files)  - Components, state, routing
├── 05-backend/        (5 files)  - Endpoints, logic, jobs
├── 06-infrastructure/ (5 files)  - Deployment, monitoring
├── 07-quality/        (4 files)  - Testing, gates, reviews
├── 08-operations/     (3 files)  - Runbook, maintenance
├── 09-compliance/     (2 files)  - Privacy, legal
└── README.md

Total: 40+ specification files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 WHAT'S INCLUDED

✓ Complete PRD with user personas and journeys
✓ Database schema with ER diagrams (using [database from config])
✓ API specification with all endpoints (using [framework from config])
✓ System architecture diagrams (Mermaid)
✓ Frontend component specifications (using [framework from config])
✓ Backend business logic definition
✓ Testing strategy and test plans (using [testing from config])
✓ Deployment and infrastructure plan
✓ Security and compliance requirements

All specs use the tech stack from .claude/your-stack/stack-config.yaml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

1. Review the specifications in project-specs/
2. Modify any specs as needed
3. Run: /research-stack

This will generate coding standards for your chosen tech stack.

Open project-specs/README.md now? (yes/no)
```

If user says yes, display the README.

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

## Example Usage

**Full workflow example:**

```bash
# Step 1: Initialize project (product + tech stack)
/init-project
# → Asks 6 product questions
# → Helps choose tech stack with research
# → Sets up design system
# → Creates stack-config.yaml, design-tokens.json, product-brief.md

# Step 2: Generate comprehensive specs (uses tech from step 1)
/generate-project-specs "Design system manager"
# → Reads tech stack from stack-config.yaml
# → Creates complete project-specs/ directory with 40+ files
# → All specs use your chosen tech stack

# Step 3: Generate coding standards
/research-stack
# → Reads stack-config.yaml
# → Generates framework-specific coding standards
# → Creates architecture patterns for your stack

# Step 4: Start building
# Use project-specs/ as source of truth
# Follow standards from .claude/your-stack/coding-standards/
```

---

## Agent Instructions

**When this command is invoked:**

1. **FIRST: Check for stack-config.yaml**
   - If missing, error with message to run /init-project first
   - Load tech stack from `.claude/your-stack/stack-config.yaml`

2. Extract opportunity name and optional research report path
3. If research report provided, read and extract context
4. **Use loaded tech stack for all technical specifications**
5. Follow the 9-phase generation process described above
6. Create `./project-specs/` directory structure
7. Generate all specification files
8. Ensure all cross-references are valid
9. Create README.md with navigation
10. Display summary with next steps

**Quality standards:**
- All specs must be actionable (no vague placeholders)
- **Tech stack specs must document choices from stack-config.yaml (NOT make new choices)**
- Database schema must include ER diagrams (Mermaid) using database from config
- API spec must include all CRUD endpoints using framework from config
- File structures must be realistic and complete
- All architectural decisions must respect the tech stack from config

**Research to conduct:**
- Best practices for the chosen tech stack (from config)
- Industry-standard architecture patterns for the framework (from config)
- Security best practices for the stack (from config)
- Performance optimization techniques for the framework (from config)
- Testing strategies for the testing framework (from config)
- Deployment approaches for the hosting choice (from config if specified)

**For diagrams:**
- Use Mermaid syntax for all diagrams
- Include architecture diagrams
- Include ER diagrams for database
- Include sequence diagrams for complex flows

---

## When to Use

✅ **Use this when:**
- You've already run /init-project (stack-config.yaml exists)
- You've selected an opportunity to pursue
- You want enterprise-level documentation
- You need complete technical specifications
- You're building a serious product (not a prototype)

❌ **Don't use when:**
- Haven't run /init-project yet (no stack-config.yaml)
- Just prototyping or experimenting
- Building a simple script or tool
- Already have comprehensive specs
- Want to start coding immediately without planning

---

## After Generation

**Review the specifications:**
1. Read `project-specs/README.md` for overview
2. Review `01-product/prd.md` - ensure it matches your vision
3. Check `03-technical/architecture.md` - validate architectural approach
4. Review `03-technical/tech-stack.md` - verify it matches stack-config.yaml
5. Check `03-technical/database-schema.md` - verify data model
6. Review `03-technical/api-specification.md` - confirm API design

**Modify as needed:**
- All specs are editable markdown files
- Update any architectural decisions you disagree with
- Add missing details
- Refine scope
- **Note:** If you change tech stack in specs, update stack-config.yaml to match

**When satisfied:**
```bash
/research-stack
```

This will generate coding standards for your chosen tech stack, completing the project setup.

---

## Notes

- **MUST run /init-project first** to create stack-config.yaml
- Generation takes 120-150 minutes (comprehensive process)
- All specs are interlinked and consistent
- **Tech stack loaded from stack-config.yaml** (no new tech decisions made)
- Architectural decisions based on best practices for chosen stack
- Security and scalability considered from the start
- All architectural decisions include rationale
- Specs serve as source of truth throughout development
- Can regenerate or modify individual files as needed
- After generation, run /research-stack to create coding standards
