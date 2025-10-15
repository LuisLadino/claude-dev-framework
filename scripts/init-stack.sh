#!/bin/bash

# init-stack.sh
# Initialize the Claude Development Framework for a new project
# Version: 1.0.0

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Claude Development Framework - Stack Initialization${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if .claude directory exists
check_claude_dir() {
    if [ ! -d ".claude" ]; then
        print_error "No .claude directory found!"
        echo "Please run this script from a directory where you've cloned the framework."
        echo ""
        echo "Setup instructions:"
        echo "  1. Clone the framework: git clone <framework-repo> my-project"
        echo "  2. cd my-project"
        echo "  3. Run: ./scripts/init-stack.sh"
        exit 1
    fi
}

# Main initialization
main() {
    print_header
    check_claude_dir

    echo "This script will set up the framework for your specific tech stack."
    echo ""
    
    # Get project name
    read -p "Project name: " project_name
    if [ -z "$project_name" ]; then
        project_name="My Project"
    fi

    # Get stack type
    echo ""
    echo "What type of project is this?"
    echo "  1) Frontend (React, Vue, Svelte, etc.)"
    echo "  2) Backend API (FastAPI, Express, Rails, etc.)"
    echo "  3) Full-Stack (Next.js, SvelteKit, etc.)"
    echo "  4) Systems/CLI (Rust, Go, C++, etc.)"
    echo "  5) Mobile (React Native, Flutter, Swift, etc.)"
    echo "  6) Other"
    read -p "Choice [1-6]: " stack_type

    case $stack_type in
        1)
            # Frontend
            echo ""
            echo "Select your frontend framework:"
            echo "  1) React"
            echo "  2) Vue"
            echo "  3) Svelte"
            echo "  4) Angular"
            echo "  5) Solid"
            echo "  6) Preact"
            echo "  7) Other"
            read -p "Choice [1-7]: " framework_choice

            case $framework_choice in
                1) framework="React" ;;
                2) framework="Vue" ;;
                3) framework="Svelte" ;;
                4) framework="Angular" ;;
                5) framework="Solid" ;;
                6) framework="Preact" ;;
                7) read -p "Enter framework name: " framework ;;
                *) framework="React" ;;
            esac

            echo ""
            read -p "Language (TypeScript/JavaScript) [TypeScript]: " language
            language=${language:-TypeScript}
            ;;

        2)
            # Backend API
            echo ""
            echo "Select your backend framework:"
            echo "  1) FastAPI (Python)"
            echo "  2) Django (Python)"
            echo "  3) Flask (Python)"
            echo "  4) Express (Node.js)"
            echo "  5) NestJS (Node.js)"
            echo "  6) Actix Web (Rust)"
            echo "  7) Axum (Rust)"
            echo "  8) Gin (Go)"
            echo "  9) Echo (Go)"
            echo "  10) ASP.NET Core (C#)"
            echo "  11) Spring Boot (Java)"
            echo "  12) Rails (Ruby)"
            echo "  13) Laravel (PHP)"
            echo "  14) Other"
            read -p "Choice [1-14]: " framework_choice

            case $framework_choice in
                1) framework="FastAPI"; language="Python" ;;
                2) framework="Django"; language="Python" ;;
                3) framework="Flask"; language="Python" ;;
                4) framework="Express"; language="TypeScript" ;;
                5) framework="NestJS"; language="TypeScript" ;;
                6) framework="Actix Web"; language="Rust" ;;
                7) framework="Axum"; language="Rust" ;;
                8) framework="Gin"; language="Go" ;;
                9) framework="Echo"; language="Go" ;;
                10) framework="ASP.NET Core"; language="C#" ;;
                11) framework="Spring Boot"; language="Java" ;;
                12) framework="Rails"; language="Ruby" ;;
                13) framework="Laravel"; language="PHP" ;;
                14)
                    read -p "Enter framework name: " framework
                    read -p "Enter language: " language
                    ;;
                *) framework="FastAPI"; language="Python" ;;
            esac
            ;;

        3)
            # Full-Stack
            echo ""
            echo "Select your full-stack framework:"
            echo "  1) Next.js (React)"
            echo "  2) Nuxt (Vue)"
            echo "  3) SvelteKit (Svelte)"
            echo "  4) Remix (React)"
            echo "  5) Astro"
            echo "  6) Other"
            read -p "Choice [1-6]: " framework_choice

            case $framework_choice in
                1) framework="Next.js"; language="TypeScript" ;;
                2) framework="Nuxt"; language="TypeScript" ;;
                3) framework="SvelteKit"; language="TypeScript" ;;
                4) framework="Remix"; language="TypeScript" ;;
                5) framework="Astro"; language="TypeScript" ;;
                6)
                    read -p "Enter framework name: " framework
                    read -p "Language (TypeScript/JavaScript) [TypeScript]: " language
                    language=${language:-TypeScript}
                    ;;
                *) framework="Next.js"; language="TypeScript" ;;
            esac
            ;;

        4)
            # Systems/CLI
            echo ""
            echo "Select your language:"
            echo "  1) Rust"
            echo "  2) Go"
            echo "  3) C++"
            echo "  4) C"
            echo "  5) Zig"
            echo "  6) Other"
            read -p "Choice [1-6]: " lang_choice

            case $lang_choice in
                1) language="Rust"; framework="Rust CLI" ;;
                2) language="Go"; framework="Go CLI" ;;
                3) language="C++"; framework="C++ Application" ;;
                4) language="C"; framework="C Application" ;;
                5) language="Zig"; framework="Zig Application" ;;
                6)
                    read -p "Enter language: " language
                    framework="$language Application"
                    ;;
                *) language="Rust"; framework="Rust CLI" ;;
            esac
            ;;

        5)
            # Mobile
            echo ""
            echo "Select your mobile framework:"
            echo "  1) React Native"
            echo "  2) Flutter (Dart)"
            echo "  3) Swift (iOS)"
            echo "  4) Kotlin (Android)"
            echo "  5) SwiftUI (iOS)"
            echo "  6) Jetpack Compose (Android)"
            echo "  7) Other"
            read -p "Choice [1-7]: " framework_choice

            case $framework_choice in
                1) framework="React Native"; language="TypeScript" ;;
                2) framework="Flutter"; language="Dart" ;;
                3) framework="Swift"; language="Swift" ;;
                4) framework="Kotlin"; language="Kotlin" ;;
                5) framework="SwiftUI"; language="Swift" ;;
                6) framework="Jetpack Compose"; language="Kotlin" ;;
                7)
                    read -p "Enter framework name: " framework
                    read -p "Enter language: " language
                    ;;
                *) framework="React Native"; language="TypeScript" ;;
            esac
            ;;

        6)
            # Other
            read -p "Enter your framework/stack name: " framework
            read -p "Enter your language: " language
            ;;

        *)
            print_warning "Invalid choice. Defaulting to React + TypeScript."
            framework="React"
            language="TypeScript"
            ;;
    esac

    # Get styling solution (only for frontend/fullstack)
    styling="N/A"
    if [ "$stack_type" = "1" ] || [ "$stack_type" = "3" ] || [ "$stack_type" = "5" ]; then
        echo ""
        echo "Select your styling solution:"
        echo "  1) Tailwind CSS"
        echo "  2) CSS Modules"
        echo "  3) styled-components"
        echo "  4) emotion"
        echo "  5) Plain CSS"
        echo "  6) Sass/SCSS"
        echo "  7) Other"
        echo "  8) N/A"
        read -p "Choice [1-8]: " styling_choice

        case $styling_choice in
            1) styling="Tailwind CSS" ;;
            2) styling="CSS Modules" ;;
            3) styling="styled-components" ;;
            4) styling="emotion" ;;
            5) styling="Plain CSS" ;;
            6) styling="Sass/SCSS" ;;
            7) read -p "Enter styling solution: " styling ;;
            8) styling="N/A" ;;
            *) styling="Tailwind CSS" ;;
        esac
    fi

    # Get testing framework (universal, but options vary by stack)
    echo ""

    if [ "$stack_type" = "2" ]; then
        # Backend testing
        echo "Select your testing framework:"
        echo "  1) pytest (Python)"
        echo "  2) unittest (Python)"
        echo "  3) Jest (Node.js)"
        echo "  4) Vitest (Node.js)"
        echo "  5) cargo test (Rust)"
        echo "  6) Go testing"
        echo "  7) xUnit (C#)"
        echo "  8) JUnit (Java)"
        echo "  9) RSpec (Ruby)"
        echo "  10) PHPUnit (PHP)"
        echo "  11) Other"
        read -p "Choice [1-11]: " testing_choice

        case $testing_choice in
            1) testing="pytest" ;;
            2) testing="unittest" ;;
            3) testing="Jest" ;;
            4) testing="Vitest" ;;
            5) testing="cargo test" ;;
            6) testing="Go testing" ;;
            7) testing="xUnit" ;;
            8) testing="JUnit" ;;
            9) testing="RSpec" ;;
            10) testing="PHPUnit" ;;
            11) read -p "Enter testing framework: " testing ;;
            *) testing="pytest" ;;
        esac
    elif [ "$stack_type" = "4" ]; then
        # Systems/CLI testing
        echo "Select your testing framework:"
        echo "  1) cargo test (Rust)"
        echo "  2) Go testing"
        echo "  3) Google Test (C++)"
        echo "  4) Catch2 (C++)"
        echo "  5) Other"
        read -p "Choice [1-5]: " testing_choice

        case $testing_choice in
            1) testing="cargo test" ;;
            2) testing="Go testing" ;;
            3) testing="Google Test" ;;
            4) testing="Catch2" ;;
            5) read -p "Enter testing framework: " testing ;;
            *) testing="cargo test" ;;
        esac
    else
        # Frontend/Fullstack/Mobile testing
        echo "Select your testing framework:"
        echo "  1) Vitest"
        echo "  2) Jest"
        echo "  3) Playwright"
        echo "  4) Cypress"
        echo "  5) Testing Library"
        echo "  6) None"
        echo "  7) Other"
        read -p "Choice [1-7]: " testing_choice

        case $testing_choice in
            1) testing="Vitest" ;;
            2) testing="Jest" ;;
            3) testing="Playwright" ;;
            4) testing="Cypress" ;;
            5) testing="Testing Library" ;;
            6) testing="None" ;;
            7) read -p "Enter testing framework: " testing ;;
            *) testing="Vitest" ;;
        esac
    fi

    # Get package manager
    echo ""
    read -p "Package manager (npm/pnpm/yarn/bun) [npm]: " package_manager
    package_manager=${package_manager:-npm}

    # Get import alias
    echo ""
    read -p "Import alias (e.g., @/, ~/) [@/]: " import_alias
    import_alias=${import_alias:-@/}

    # Get component directory
    echo ""
    read -p "Components directory [src/components]: " components_dir
    components_dir=${components_dir:-src/components}

    # Confirm configuration
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Configuration Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "  Project Name:     $project_name"
    echo "  Framework:        $framework"
    echo "  Language:         $language"
    echo "  Styling:          $styling"
    echo "  Testing:          $testing"
    echo "  Package Manager:  $package_manager"
    echo "  Import Alias:     $import_alias"
    echo "  Components Dir:   $components_dir"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    read -p "Continue with this configuration? (y/n) [y]: " confirm
    confirm=${confirm:-y}

    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_warning "Setup cancelled."
        exit 0
    fi

    # Create .claude/your-stack directory
    echo ""
    print_info "Creating stack configuration..."
    mkdir -p .claude/your-stack/coding-standards
    mkdir -p .claude/your-stack/documentation-standards
    mkdir -p .claude/your-stack/architecture

    # Generate stack-config.yaml
    cat > .claude/your-stack/stack-config.yaml << EOF
# Stack Configuration
# Generated by init-stack.sh on $(date +%Y-%m-%d)

name: "$project_name"
version: "1.0.0"

stack:
  framework: "$framework"
  language: "$language"
  styling: "$styling"
  testing: "$testing"
  package_manager: "$package_manager"

standards_active:
  - ${framework,,}-standards
  - ${language,,}-standards
  - ${styling,,}-standards
  - ${testing,,}-standards

tools:
  mcp_servers:
    - name: "project_knowledge_search"
      enabled: true
    - name: "web_search"
      enabled: true

project_specifics:
  import_alias: "$import_alias"
  components_dir: "$components_dir"
  strict_mode: true
  
# Custom standards location
custom_standards_dir: ".claude/your-stack"

# Framework updates
framework_version: "1.0.0"
last_updated: "$(date +%Y-%m-%d)"
EOF

    print_success "Created stack-config.yaml"

    # Copy relevant templates to your-stack
    print_info "Setting up standards files..."

    # Determine which templates to copy based on framework
    framework_lower=$(echo "$framework" | tr '[:upper:]' '[:lower:]' | tr -d '.' | tr -d ' ')
    
    # Copy coding standards template if it exists
    if [ -f ".claude/templates/coding-standards/_${framework_lower}.md" ]; then
        cp ".claude/templates/coding-standards/_${framework_lower}.md" \
           ".claude/your-stack/coding-standards/${framework_lower}-standards.md"
        print_success "Copied ${framework} standards template"
    else
        # Create a basic standards file
        cat > ".claude/your-stack/coding-standards/${framework_lower}-standards.md" << 'EOF'
# Framework Standards

**Framework:** [Your Framework]
**Last Updated:** [Date]

## Overview

Add your framework-specific standards here.

## Component Patterns

### Component Structure

```typescript
// Add examples
```

## Best Practices

1. Follow framework conventions
2. Use TypeScript for type safety
3. Write tests for components
4. Document complex logic

## Testing

- Test component behavior
- Test edge cases
- Maintain high coverage

---

*Customize this file for your specific needs using /research-stack command*
EOF
        print_success "Created basic standards file"
    fi

    # Copy language template
    lang_lower=$(echo "$language" | tr '[:upper:]' '[:lower:]')
    if [ -f ".claude/templates/coding-standards/_${lang_lower}.md" ]; then
        cp ".claude/templates/coding-standards/_${lang_lower}.md" \
           ".claude/your-stack/coding-standards/${lang_lower}-standards.md"
        print_success "Copied ${language} standards template"
    fi

    # Copy architecture templates
    if [ -f ".claude/templates/architecture/_file-structure.md" ]; then
        cp ".claude/templates/architecture/_file-structure.md" \
           ".claude/your-stack/architecture/file-structure.md"
        print_success "Copied file structure template"
    fi

    if [ -f ".claude/templates/architecture/_component-patterns.md" ]; then
        cp ".claude/templates/architecture/_component-patterns.md" \
           ".claude/your-stack/architecture/component-patterns.md"
        print_success "Copied component patterns template"
    fi

    # Copy documentation standards
    if [ -f ".claude/templates/documentation-standards/code-comments.md" ]; then
        cp ".claude/templates/documentation-standards/code-comments.md" \
           ".claude/your-stack/documentation-standards/"
        print_success "Copied documentation standards"
    fi

    # Ensure .claude/your-stack/ is NOT in .gitignore (it should be committed!)
    if [ -f ".gitignore" ]; then
        if grep -q "\.claude/your-stack/" .gitignore; then
            # Remove it from .gitignore
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' '/\.claude\/your-stack\//d' .gitignore
            else
                # Linux
                sed -i '/\.claude\/your-stack\//d' .gitignore
            fi
            print_success "Removed .claude/your-stack/ from .gitignore (it should be committed!)"
        fi
    fi

    print_info "Your stack configuration will be committed to your project repository"

    # Final summary
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Framework Initialized Successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo ""
    echo -e "  ${YELLOW}⚠ IMPORTANT: Generate real standards!${NC}"
    echo ""
    echo "  The templates copied are basic placeholders."
    echo "  You should generate AI-researched, current standards:"
    echo ""
    echo -e "  ${GREEN}1. Generate researched standards (RECOMMENDED):${NC}"
    echo "     Open Claude Code and run: /research-stack"
    echo "     → Researches official docs for your stack"
    echo "     → Generates current best practices (2024-2025)"
    echo "     → Creates detailed, accurate standards"
    echo ""
    echo "  OR"
    echo ""
    echo -e "  ${BLUE}2. Import company standards:${NC}"
    echo "     ./scripts/import-company-standards.sh"
    echo "     → Converts company docs to framework format"
    echo ""
    echo "  OR"
    echo ""
    echo -e "  ${BLUE}3. Manually edit templates:${NC}"
    echo "     Edit files in .claude/your-stack/"
    echo "     → Customize the generic templates yourself"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  After generating/importing standards:"
    echo ""
    echo "  • Validate setup:"
    echo "    ./scripts/validate-setup.sh"
    echo ""
    echo "  • Start developing:"
    echo "    Use /start-task command in Claude"
    echo ""
    print_info "Don't skip /research-stack - it's where the magic happens! 🚀"
    echo ""
}

# Run main function
main
