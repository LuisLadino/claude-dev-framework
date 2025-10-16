# Claude Development Framework

**AI-Powered Development Assistant That Adapts to YOUR Stack**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](CHANGELOG.md)
[![Framework](https://img.shields.io/badge/Claude-Compatible-purple.svg)](https://claude.ai)
[![Maintenance](https://img.shields.io/badge/Maintained-Yes-green.svg)](https://github.com/LuisLadino/claude-dev-framework)

> Transform Claude into your intelligent development partner with automated stack research, company standards import, and enforced quality patterns.

---

## 🎯 What Is This?

The **Claude Development Framework** is an intelligent project structure that guides Claude to be a consistent, high-quality development partner. Instead of repeating yourself or getting inconsistent results, this framework:

- **Learns your tech stack** automatically
- **Enforces your coding standards** on every task
- **Imports company documentation** seamlessly
- **Adapts to any technology stack** via AI research
- **Maintains quality** through automated verification

**Current focus:** Frontend/JavaScript (React, Vue, Svelte, Next.js, TypeScript)
**Works with:** Any stack via `/research-stack` command (Python, Rust, Go, C#, Ruby, PHP, etc.)

**Think of it as Claude's "operating system" for your project.**

---

## ⚡ Quick Start

> **Already using Claude Code?** See [Migration Guide](docs/getting-started.md#migrating-from-existing-setup) to adopt without losing your setup.

### Installation (2 minutes)

**Option A: One-Line Install (Recommended)**

```bash
# Install directly into your existing project
curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash
```

This installs ONLY the framework files you need:
- ✅ Core framework (`.claude/CLAUDE.md`, commands, workflows)
- ✅ Your-stack structure (empty, ready for `/research-stack`)
- ✅ Helper scripts (optional)
- ❌ No templates, docs, examples, or GitHub bloat

**Option B: Manual Install**

```bash
# Clone to temporary directory
git clone https://github.com/LuisLadino/claude-dev-framework.git .claude-temp

# Run installer (handles merge if you have existing .claude/)
cd .claude-temp && ./scripts/install.sh

# Cleanup
cd .. && rm -rf .claude-temp
```

**Option C: Fork Repository (For Contributing)**

```bash
# Only if you want to contribute back or customize heavily
git clone https://github.com/LuisLadino/claude-dev-framework.git my-project
cd my-project
```

> **What's the difference?** Option A/B installs a clean framework. Option C gives you the full repo (docs, templates, examples) for development.

### Setup Your Stack (2 minutes)

After installation, generate standards for YOUR stack:

```bash
# In Claude Code, run:
/research-stack
```

**What this does:**
- 🔍 Researches your stack's official docs
- 🔍 Finds current best practices (2024-2025)
- 📝 Generates detailed, accurate standards
- ✅ Creates patterns specific to YOUR stack version

**Recommended:** Install [context7 MCP](https://github.com/context7/mcp-server) for best results
- Fetches official documentation directly (more accurate than web search)
- See [MCP Setup Guide](docs/mcp-setup.md) for installation

**Works with ANY stack:**
- Frontend: React, Vue, Svelte, Next.js, Angular, etc.
- Backend: FastAPI, Django, Express, Rails, Laravel, etc.
- Systems: Rust, Go, C++, etc.
- Mobile: React Native, Flutter, Swift, Kotlin, etc.

### Start Building

```bash
/start-task
"Add a responsive navigation bar"

# Claude now uses YOUR researched standards:
# ✓ Current best practices for your stack
# ✓ Latest patterns and conventions
# ✓ Stack-version-specific code
# ✓ Automatic quality verification
```

---

## 🚀 Why Even Senior Engineers Use This

### The Reality of AI-Assisted Development

**Even with 10+ years of experience, you face these issues with Claude:**

**Context Loss:**
- ❌ Every new chat loses your architecture decisions
- ❌ Claude forgets your naming conventions between sessions
- ❌ You repeat "we use X pattern, not Y" constantly
- ❌ No memory of your codebase's specific constraints

**Inconsistency:**
- ❌ Claude suggests patterns you've already decided against
- ❌ Generated code doesn't match your existing style
- ❌ Junior team members get different answers than you
- ❌ Code reviews become "fixing Claude's output"

**Tribal Knowledge:**
- ❌ Your hard-won architectural decisions aren't captured
- ❌ Team conventions live in your head, not in code
- ❌ Onboarding new devs means weeks of context transfer
- ❌ When you're on vacation, the team guesses

**Scale Problems:**
- ❌ Works for solo projects, breaks for teams
- ❌ Great for prototypes, questionable for production
- ❌ Fast initially, technical debt accumulates
- ❌ No way to enforce company security/compliance requirements

---

### What Senior Engineers Get

**1. Architectural Memory**
```yaml
# Your decisions, enforced automatically
architecture_patterns:
  - "Event-driven microservices with CQRS"
  - "Hexagonal architecture for domain isolation"
  - "Repository pattern for data access"
  - "No circular dependencies (enforced)"
```
Claude remembers WHY you made these choices, not just WHAT they are.

**2. Context Persistence**
```bash
# Once, not every conversation
/import-standards analyze codebase

# Now Claude knows:
# - Your error handling strategy
# - Your logging conventions
# - Your testing philosophy
# - Your deployment pipeline
# - Every pattern you've established
```

**3. Team Consistency**
```bash
# Senior dev sets standards once
git commit .claude/

# Junior devs get:
# - Same quality as senior
# - Instant feedback on PRs
# - No guessing about patterns
# - Automatic compliance checks
```

**4. Production-Grade Output**
```bash
/start-task "Add payment processing"

# Claude generates:
# ✅ Error handling per your standards
# ✅ Logging with your format
# ✅ Tests matching your patterns
# ✅ Security checks per your policy
# ✅ Documentation in your style
# ✅ Deployment config for your pipeline
```

**5. Cross-Stack Intelligence**
```bash
# Frontend
/research-stack React + TypeScript
# Backend
/research-stack Go + gRPC
# Mobile
/research-stack Swift + SwiftUI

# Claude adapts to each, consistently
# Your monorepo stays coherent
```

---

### The Multiplier Effect

**Solo:** You move faster without repeating yourself
**Team:** Everyone codes at senior level
**Company:** Standards enforced automatically across all projects

**Real Impact:**
- **Code Reviews:** 70% reduction in style/pattern feedback
- **Onboarding:** New devs productive in days, not weeks
- **Technical Debt:** Prevented, not accumulated
- **Security:** Compliance enforced at generation time
- **Velocity:** Senior devs focus on architecture, not fixing inconsistencies

---

### Built for Scale

**✅ Solo Developer:** Your personal senior engineer
**✅ Small Team (2-10):** Consistent standards without meetings
**✅ Startup (10-50):** Scale quality as you scale headcount
**✅ Enterprise (50+):** Enforce company standards across divisions

**Not just a "helper" - it's infrastructure for code quality.**

---

## ✨ Features

### 🧠 Intelligent Stack Understanding

The framework works with **any** technology stack through AI-powered research:

**Frontend Examples:**
```yaml
# React + TypeScript
stack:
  framework: "React"
  language: "TypeScript"
  styling: "Tailwind CSS"
  testing: "Vitest"
```

**Backend Examples:**
```yaml
# Python FastAPI
stack:
  framework: "FastAPI"
  language: "Python"
  database: "PostgreSQL with SQLAlchemy"
  testing: "pytest"

# Rust Actix
stack:
  framework: "Actix Web"
  language: "Rust"
  database: "Diesel ORM"
  testing: "cargo test"

# C# ASP.NET
stack:
  framework: "ASP.NET Core"
  language: "C#"
  database: "Entity Framework"
  testing: "xUnit"
```

Claude automatically adapts to your stack using `/research-stack`

### 📚 11 Powerful Commands

| Command              | Purpose                                  | When to Use             |
| -------------------- | ---------------------------------------- | ----------------------- |
| `/start-task`        | Begin any task with standards check      | Every coding task       |
| `/research-stack`    | Generate AI-researched standards         | Initial setup           |
| `/learn`             | Explain concepts in your stack's context | Learning new patterns   |
| `/standards`         | Emergency brake when standards skipped   | Quality control         |
| `/verify`            | Check existing code against standards    | Before commits          |
| `/add-standard`      | Add custom domain-specific standards     | Extending the framework |
| `/import-standards`  | Import existing docs/handbooks           | Company adoption        |
| `/create-prd`        | Generate detailed feature spec           | Big features (2+ hrs)   |
| `/generate-tasks`    | Convert PRD → task list                  | After PRD creation      |
| `/process-tasks`     | Execute tasks one by one                 | Implementing PRDs       |
| `/update-framework`  | Update framework & company standards     | Framework/standards updates |

### 🔄 Automated Workflows

**Simple Task** (5-30 minutes):

```bash
/start-task → Implement → Verify → Done
```

**Complex Feature** (2+ hours):

```bash
/create-prd → /generate-tasks → /process-tasks → Done
```

Each step enforces quality and maintains consistency.

### 📥 Company Standards Import

**Two powerful ways to establish standards:**

**Option 1: Import from Documentation**
```bash
# From Google Drive, Confluence, PDFs, etc.
/import-standards from Google Drive "Engineering Standards"

# Or use shell script for local files:
./scripts/import-company-standards.sh
```

**Option 2: Discover from Codebase** ⭐ **NEW!**
```bash
# Analyze your entire codebase and learn the patterns
/import-standards analyze codebase

# Claude will:
# - Analyze ALL code files (no scope limits)
# - Discover actual patterns in use
# - Compare to existing standards
# - Suggest updates or create new standards
# - Perfect for: joining new projects, open source, outdated docs
```

**No documentation? No problem!** Let Claude analyze your code and generate standards automatically.

### 🔍 Quality Verification

45+ checks ensure every task meets standards:

```bash
./scripts/validate-setup.sh

# Checks:
# ✓ Directory structure
# ✓ Core files present
# ✓ Stack configuration valid
# ✓ Standards files exist
# ✓ Commands available
# ✓ Git configuration
# ... and 39 more
```

### 🔄 Easy Updates

Framework AND company standards get better over time:

```bash
# In Claude Code:
/update-framework

# Shows updates from:
# ✓ Framework (new features, commands, improvements)
# ✓ Company standards (if configured)
# ✓ Interactive review with diffs
# ✓ Choose what to update
# ✓ Automatic backups
# ✓ Preserves YOUR customizations
```

**For companies:** Configure `standards_source` in `stack-config.yaml` to centrally manage team standards. See [Company Standards Management](docs/company-standards-management.md).

---

## 📖 Documentation

### Getting Started

- [📘 Getting Started Guide](docs/getting-started.md) - Comprehensive setup
- [🎨 Customization Guide](docs/customization-guide.md) - Make it yours
- [🧰 MCP Setup](docs/mcp-setup.md) - Advanced integrations
- [💭 Philosophy](docs/philosophy.md) - How it works
- [❓ FAQ](docs/faq.md) - Common questions

### Command Reference

- [📋 All Commands](/.claude/commands/COMMANDS-README.md) - Complete command documentation
- [🔧 Scripts Guide](scripts/README.md) - Helper scripts explained
- [⚡ Quick Reference](scripts/QUICKREF.md) - One-page cheat sheet

### Examples

See the framework configured for real stacks:

- [🎨 Astro + React Example](docs/examples/astro-react/) - SSG with islands
- [⚛️ Next.js 15 Example](docs/examples/nextjs/) - App Router + RSC
- [💚 Vue 3 Example](docs/examples/vue/) - Composition API + Pinia

---

## 🎯 Use Cases

### 1. Personal Projects (Any Stack!)

**Frontend Project:**
```bash
./scripts/init-stack.sh
# Select: Next.js, TypeScript, Tailwind, Vitest

/research-stack  # Generates React/Next.js standards
/start-task "Create blog post listing page"
```

**Backend API:**
```bash
./scripts/init-stack.sh
# Select: FastAPI, Python, PostgreSQL, pytest

/research-stack  # Generates Python/FastAPI standards
/start-task "Create user authentication endpoint"
```

**Systems Programming:**
```bash
./scripts/init-stack.sh
# Select: Rust, Tokio, cargo test

/research-stack  # Generates Rust standards
/start-task "Build async TCP server"
```

**Benefit:** Professional quality patterns from day one, **any language**.

---

### 2. Joining a New Company

**Scenario:** First day at new job, need to learn standards

```bash
git clone <framework> company-project
cd company-project
./scripts/init-stack.sh
# Select company's stack

./scripts/import-company-standards.sh
# Point to company docs folder

# Now Claude knows company standards
/start-task
"Implement feature X"
# Claude follows company patterns automatically
```

**Benefit:** Ramp up 10x faster, ship company-standard code immediately.

---

### 3. Team Standardization

**Scenario:** Want entire team to code consistently

```bash
# Lead dev sets up once
./scripts/init-stack.sh
# Configure team's stack and standards

# Commit framework (not .claude/your-stack/)
git add .claude/commands/ .claude/workflows/
git commit -m "Add development framework"

# Team members clone and go
# Everyone gets same standards, same patterns
```

**Benefit:** Consistent code quality across entire team.

---

### 4. Open Source Projects

**Scenario:** Contributors need to follow project patterns

```bash
# Add framework to your OSS project
# Contributors see clear standards
# Claude helps them follow patterns

# In CONTRIBUTING.md:
"This project uses Claude Development Framework.
 Run ./scripts/validate-setup.sh before submitting PRs."
```

**Benefit:** Higher quality contributions, less review burden.

---

## 🛠️ How It Works

### Architecture

```
your-project/
├── .claude/                      # Framework core
│   ├── commands/                 # 11 AI commands
│   ├── workflows/                # Process guides
│   ├── templates/                # Stack templates
│   ├── tools/                    # MCP integration
│   └── your-stack/               # YOUR customizations
│       ├── stack-config.yaml     # Your stack definition
│       ├── coding-standards/     # Your standards
│       └── architecture/         # Your patterns
│
├── scripts/                      # Helper automation
│   ├── init-stack.sh             # Initialize
│   ├── import-company-standards.sh
│   └── validate-setup.sh
│
└── docs/                         # Documentation
    ├── getting-started.md
    └── examples/                 # Real configurations
```

### The Magic

1. **Stack Config** - Single YAML defines your technology
2. **Tool Integration** - Uses Claude's built-in tools (web_search, project_knowledge_search)
3. **Standards Loading** - Automatically loads relevant standards per task
4. **Quality Enforcement** - Checks quality at every step
5. **Adaptation** - Works with React, Vue, Svelte, Next.js, SvelteKit, Astro, etc.

---

## 🌟 What Makes This Special?

### Stack-Agnostic Design

Most AI coding assistants assume React or generic advice. This framework:

- ✅ Knows the difference between React hooks and Vue refs
- ✅ Understands Svelte's reactivity vs Vue's Composition API
- ✅ Adapts TypeScript patterns to your strict mode settings
- ✅ Follows your specific testing framework patterns

**One framework, infinite stacks.**

### Company-Ready

Import existing documentation:

- ✅ Coding standards
- ✅ Architecture patterns
- ✅ API conventions
- ✅ Testing requirements
- ✅ Review checklists

**Your docs + this framework = AI that codes like your team.**

### Continuous Improvement

The framework gets better:

- Update with one command
- Your customizations preserved
- New features automatically available
- Rollback support if needed

**Set it up once, benefit forever.**

---

## 📊 Framework vs. Raw Claude

### For Senior/Staff Engineers

| What You Care About | Raw Claude                                     | With Framework                                   |
| ------------------- | ---------------------------------------------- | ------------------------------------------------ |
| **Context**         | Re-explain architecture every chat             | Architectural decisions persisted & enforced     |
| **Consistency**     | Each dev gets different suggestions            | Entire team gets your standards                  |
| **Quality**         | Review every line Claude generates             | Pre-validated against your patterns              |
| **Tribal Knowledge**| Lives in your head / Slack threads             | Codified, enforced, teachable                    |
| **Onboarding**      | Weeks of context transfer                      | Days - framework teaches your patterns           |
| **Scale**           | Works solo, breaks at team scale               | Designed for teams 1-1000+                       |
| **Security**        | Hope Claude remembers your policies            | Policies enforced at generation time             |
| **Tech Debt**       | Accumulates fast with AI generation            | Prevented - patterns enforced from start         |
| **Code Review**     | 50% of comments = style/pattern issues         | 10% - framework catches those automatically      |
| **Production Ready**| Prototype quality, needs refactoring           | Production quality from first generation         |
| **Cross-Stack**     | Re-learn patterns per stack                    | Consistent across frontend/backend/mobile/infra  |
| **Updates**         | N/A                                            | `/update-framework` - get improvements           |

### The Reality

**Without Framework:**
- Senior dev skill: 9/10
- Claude-assisted code: 6/10 (needs heavy review)
- Junior dev with Claude: 4/10 (doesn't know what good looks like)

**With Framework:**
- Senior dev skill: 9/10
- Claude-assisted code: 8/10 (matches senior patterns)
- Junior dev with Claude: 7/10 (framework teaches them)

**The framework makes Claude code at YOUR level, not Claude's default level.**

---

## 🏗️ Production-Grade AI Development

### Why This Isn't Just "Nice to Have"

**The AI Productivity Paradox:**
- AI makes you 10x faster at writing code
- But creates 5x more technical debt if unguided
- Net result: You go fast, then slow WAY down

**This framework breaks the cycle:**

#### **1. Capture Architectural Intent**
```yaml
# In your-stack/architecture/decisions.md
Decision: Microservices communicate via events only

Rationale:
- Prevents tight coupling
- Enables independent deployment
- Supports eventual consistency model

Enforcement:
- No direct service-to-service HTTP calls
- All state changes publish events
- Services consume events, not APIs
```

Claude now PREVENTS the anti-pattern, doesn't just warn about it.

#### **2. Security by Default**
```yaml
# In your-stack/coding-standards/security-standards.md
- Input validation: Zod schemas on all endpoints
- Authentication: JWT with 15min expiry
- Authorization: RBAC checked before business logic
- Secrets: Never hardcoded, always from env
- SQL: Parameterized queries only, no string concat
- CORS: Whitelist only, never wildcard in production
```

Junior dev asks Claude to add an endpoint → Claude enforces these automatically.

#### **3. Observability from Day One**
```yaml
# In your-stack/coding-standards/logging-standards.md
Every service operation must log:
- Request ID (for tracing)
- User ID (if authenticated)
- Operation name
- Duration
- Outcome (success/error)
- Error details (if failed)

Format: Structured JSON
Level: Info for success, Error for failure
```

Claude generates code with observability built in, not added later.

#### **4. Testing That Actually Matters**
```yaml
# In your-stack/testing-standards/test-strategy.md
Required tests:
- Unit: Business logic, pure functions
- Integration: Database queries, external APIs
- E2E: Critical user paths only

Coverage: 80% minimum, but quality over quantity
Focus: Test behavior, not implementation
```

Claude writes tests that catch bugs, not tests that just hit 80% coverage.

---

### For Technical Leaders

**The Team Scaling Problem:**

You're a senior/staff engineer. Your code is great. But:
- Team grows from 3 to 10 to 30
- Can't review every PR deeply
- Junior devs shipping code you'd never write
- "We'll refactor later" becomes "We'll never refactor"

**Traditional Solution:** Hire more seniors (expensive, slow)

**Framework Solution:** Codify your expertise, scale it to everyone

```bash
# Once
/import-standards analyze codebase  # Learn from YOUR code
git commit .claude/

# Forever
# Every dev on team gets:
# - Your patterns
# - Your standards
# - Your architectural decisions
# - Your quality bar

# Result:
# Junior dev with framework = Mid-level output
# Mid-level dev with framework = Senior output
# Senior dev with framework = Staff-level velocity
```

**ROI:**
- **Setup:** 2 hours
- **Maintenance:** 30 min/month
- **Savings:** 10-20 hours/week in code review
- **Quality:** Consistent across team
- **Velocity:** Linear with headcount (not logarithmic)

---

### This Isn't a Tutorial Framework

**NOT for:**
- ❌ Learning to code
- ❌ Following generic "best practices"
- ❌ Getting AI to do your thinking

**IS for:**
- ✅ Capturing YOUR architectural decisions
- ✅ Enforcing YOUR team's conventions
- ✅ Scaling YOUR expertise to your team
- ✅ Maintaining YOUR quality bar at AI speed

**You're not adopting a framework's opinions. You're encoding your own.**

---

## 🗑️ Uninstalling

Need to remove the framework? We've got you covered:

```bash
./scripts/uninstall.sh
```

**Options:**
1. **Backup and remove** - Saves your custom standards to `.claude-standards-backup-[date]`, removes everything
2. **Keep standards, remove framework** - Preserves `.claude/your-stack/`, removes framework files
3. **Remove everything** - Complete cleanup (asks for confirmation)

**No lock-in** - Your standards are just markdown files. Keep them, migrate them, or remove them anytime.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- How to report bugs
- How to suggest features
- How to submit pull requests
- Development setup
- Testing requirements

**Key areas for contribution:**

- New stack templates (Angular, Solid, etc.)
- Additional helper scripts
- Documentation improvements
- Example configurations
- Bug fixes and enhancements

---

## 📜 License

**MIT License** - See [LICENSE](LICENSE) for details.

**TL;DR:** Use it however you want. Commercially, personally, modify it, share it. Just keep the license notice.

---

## 🙏 Acknowledgments

**Built with:**

- [Claude](https://claude.ai) by Anthropic - The AI powering this framework
- [Model Context Protocol](https://modelcontextprotocol.io/) - For tool integration
- Community feedback and contributions

**Inspired by:**

- Modern development workflows
- Team collaboration challenges
- The need for consistent AI assistance

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/LuisLadino/claude-dev-framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/LuisLadino/claude-dev-framework/discussions)
- **Documentation**: [Full Docs](docs/)
- **Examples**: [Example Configs](docs/examples/)

---

## 🚀 Ready to Get Started?

```bash
# 1. Clone
git clone https://github.com/LuisLadino/claude-dev-framework.git my-project

# 2. Initialize
cd my-project
./scripts/init-stack.sh

# 3. Validate
./scripts/validate-setup.sh

# 4. Start coding with Claude!
```

**Questions?** Check the [FAQ](docs/faq.md) or [Getting Started Guide](docs/getting-started.md).

---

<div align="center">

**⭐ Star this repo if it helps you code better with Claude!**

Made with ❤️ for developers who want AI assistance that actually understands their stack.

[Report Bug](https://github.com/LuisLadino/claude-dev-framework/issues) · [Request Feature](https://github.com/LuisLadino/claude-dev-framework/issues) · [Documentation](docs/)

</div>
