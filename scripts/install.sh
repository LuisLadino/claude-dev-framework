#!/bin/bash

# Claude Development Framework - Clean Installation Script
#
# This script installs ONLY the functional framework files into your project's .claude directory.
# It excludes documentation, templates, examples, and other GitHub-specific files.
#
# What gets installed:
#   - Core framework files (CLAUDE.md, workflows, tools, config)
#   - Command system (/commands)
#   - Empty your-stack/ structure (you'll populate via /research-stack)
#
# What stays in GitHub repo only:
#   - Templates (you generate actual standards via /research-stack)
#   - Documentation (README, CHANGELOG, docs/)
#   - Examples
#   - This installer script itself

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRAMEWORK_REPO="https://github.com/luisladino/claude-dev-framework.git"
TEMP_DIR=".claude-framework-temp"

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Claude Development Framework - Installation${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
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

# Check if .claude directory already exists
check_existing_installation() {
    if [ -d ".claude" ]; then
        echo ""
        print_warning "Existing .claude directory found!"
        echo ""
        echo "What would you like to do?"
        echo "  1) Backup existing and install fresh"
        echo "  2) Merge with existing (keeps your files)"
        echo "  3) Cancel installation"
        echo ""
        read -p "Choice [1-3]: " choice </dev/tty

        case $choice in
            1)
                backup_dir=".claude-backup-$(date +%Y%m%d-%H%M%S)"
                mv .claude "$backup_dir"
                print_success "Backed up to $backup_dir"
                return 0
                ;;
            2)
                return 1  # Merge mode
                ;;
            3)
                print_info "Installation cancelled"
                exit 0
                ;;
            *)
                print_error "Invalid choice"
                exit 1
                ;;
        esac
    fi
    return 0  # Fresh install
}

# Clone repository to temporary directory
clone_repository() {
    print_info "Downloading framework..."

    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi

    git clone --quiet "$FRAMEWORK_REPO" "$TEMP_DIR" 2>/dev/null || {
        print_error "Failed to clone repository"
        exit 1
    }

    print_success "Framework downloaded"
}

# Install core framework files
install_framework() {
    local merge_mode=$1

    print_info "Installing framework files..."

    # Create .claude directory if it doesn't exist
    mkdir -p .claude

    # Core framework files
    cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
    print_success "Installed CLAUDE.md"

    # Commands (all of them)
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/commands" ]; then
        print_info "Merging commands (keeping your existing files)..."
        cp -n "$TEMP_DIR/.claude/commands/"* .claude/commands/ 2>/dev/null || true
    else
        mkdir -p .claude/commands
        cp -r "$TEMP_DIR/.claude/commands/"* .claude/commands/
    fi
    print_success "Installed commands"

    # Workflows
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/workflows" ]; then
        print_info "Merging workflows (keeping your existing files)..."
        cp -rn "$TEMP_DIR/.claude/workflows/"* .claude/workflows/ 2>/dev/null || true
    else
        mkdir -p .claude/workflows
        cp -r "$TEMP_DIR/.claude/workflows/"* .claude/workflows/
    fi
    print_success "Installed workflows"

    # Tools
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/tools" ]; then
        print_info "Merging tools (keeping your existing files)..."
        cp -rn "$TEMP_DIR/.claude/tools/"* .claude/tools/ 2>/dev/null || true
    else
        mkdir -p .claude/tools
        cp -r "$TEMP_DIR/.claude/tools/"* .claude/tools/
    fi
    print_success "Installed tools"

    # Config
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/config" ]; then
        print_info "Merging config (keeping your existing files)..."
        cp -rn "$TEMP_DIR/.claude/config/"* .claude/config/ 2>/dev/null || true
    else
        mkdir -p .claude/config
        cp -r "$TEMP_DIR/.claude/config/"* .claude/config/
    fi
    print_success "Installed config"

    # Your-stack structure
    if [ ! -d ".claude/your-stack" ]; then
        mkdir -p .claude/your-stack/{coding-standards,architecture,documentation-standards,config}

        # Copy template stack-config.yaml if it doesn't exist
        if [ ! -f ".claude/your-stack/stack-config.yaml" ]; then
            cp "$TEMP_DIR/.claude/your-stack/stack-config.yaml" .claude/your-stack/ 2>/dev/null || true
        fi

        # Copy README
        if [ ! -f ".claude/your-stack/README.md" ]; then
            cp "$TEMP_DIR/.claude/your-stack/README.md" .claude/your-stack/ 2>/dev/null || true
        fi

        # Create empty directories with .gitkeep
        touch .claude/your-stack/coding-standards/.gitkeep
        touch .claude/your-stack/architecture/.gitkeep
        touch .claude/your-stack/documentation-standards/.gitkeep
        touch .claude/your-stack/config/.gitkeep

        print_success "Created your-stack directory structure"
    else
        print_info "Keeping existing your-stack directory"

        # Still copy stack-config.yaml if it's missing
        if [ ! -f ".claude/your-stack/stack-config.yaml" ]; then
            cp "$TEMP_DIR/.claude/your-stack/stack-config.yaml" .claude/your-stack/ 2>/dev/null || true
            print_success "Added missing stack-config.yaml"
        fi
    fi

    # Tasks directory (for PRDs and task lists)
    if [ ! -d ".claude/tasks" ]; then
        mkdir -p .claude/tasks
        touch .claude/tasks/.gitkeep
        print_success "Created tasks directory"
    else
        print_info "Keeping existing tasks directory"
    fi

    # Scripts (optional - users may want these for convenience)
    if [ ! -d "scripts" ]; then
        mkdir -p scripts
        # Copy only the useful scripts, not install.sh/uninstall.sh
        cp "$TEMP_DIR/scripts/init-stack.sh" scripts/ 2>/dev/null || true
        cp "$TEMP_DIR/scripts/validate-setup.sh" scripts/ 2>/dev/null || true
        cp "$TEMP_DIR/scripts/import-company-standards.sh" scripts/ 2>/dev/null || true
        cp "$TEMP_DIR/scripts/update-framework.sh" scripts/ 2>/dev/null || true
        chmod +x scripts/*.sh 2>/dev/null || true
        print_success "Installed helper scripts (optional)"
    else
        print_info "Scripts directory exists, skipping"
    fi
}

# Clean up temporary files
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        print_success "Cleaned up temporary files"
    fi
}

# Show next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Installation Complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}📁 Installed Files:${NC}"
    echo "   .claude/CLAUDE.md              - Main framework instructions"
    echo "   .claude/commands/              - All slash commands"
    echo "   .claude/workflows/             - Multi-step workflows"
    echo "   .claude/tools/                 - Tool configurations"
    echo "   .claude/config/                - Environment configs"
    echo "   .claude/your-stack/            - Your custom standards (empty)"
    echo "   .claude/tasks/                 - Generated PRDs and task lists"
    echo "   scripts/                       - Helper scripts (optional)"
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo ""
    echo -e "${BLUE}In Claude Code (not your terminal):${NC}"
    echo ""
    echo "1. Set up your stack standards:"
    echo -e "   ${YELLOW}/research-stack${NC}"
    echo "   → Automatically generates standards for your stack"
    echo ""
    echo "2. Or import existing company standards:"
    echo -e "   ${YELLOW}/import-standards${NC}"
    echo "   → Import from docs or analyze your codebase"
    echo ""
    echo "3. Start coding with the framework:"
    echo -e "   ${YELLOW}/start-task \"your task description\"${NC}"
    echo "   → Claude will follow your standards automatically"
    echo ""
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "   Getting Started: https://github.com/luisladino/claude-dev-framework#getting-started"
    echo "   Customization:   https://github.com/luisladino/claude-dev-framework/blob/main/docs/customization-guide.md"
    echo ""
    echo -e "${BLUE}💡 Pro Tips:${NC}"
    echo "   • The framework adapts to ANY stack (React, Python, Rust, etc.)"
    echo "   • Slash commands (/research-stack, /start-task) run in Claude chat"
    echo "   • All standards are just markdown files - easy to customize"
    echo "   • Recommended: Install context7 MCP for best /research-stack results"
    echo ""
    echo -e "${BLUE}🔍 Verify Your Setup:${NC}"
    echo "   Run this anytime to check your framework configuration:"
    echo -e "   ${YELLOW}./scripts/validate-setup.sh${NC}"
    echo ""
}

# Main installation flow
main() {
    print_header

    # Check if we're in a git repository (recommended but not required)
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_warning "Not in a git repository"
        echo "   It's recommended to initialize git first: git init"
        echo ""
        read -p "Continue anyway? (y/n): " continue
        if [[ ! $continue =~ ^[Yy]$ ]]; then
            print_info "Installation cancelled"
            exit 0
        fi
    fi

    # Check existing installation
    merge_mode=0
    if ! check_existing_installation; then
        merge_mode=1
    fi

    # Clone repository
    clone_repository

    # Install framework files
    install_framework $merge_mode

    # Clean up
    cleanup

    # Show next steps
    show_next_steps
}

# Run installation
main
