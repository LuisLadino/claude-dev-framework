#!/bin/bash

# Claude Development Framework - Clean Installation Script
#
# This script installs ONLY the functional framework files into your project's .claude directory.
# It excludes documentation, templates, examples, and other GitHub-specific files.
#
# Usage:
#   bash install.sh              # Interactive mode (prompts for choice)
#   bash install.sh --fresh      # Fresh install (error if .claude exists)
#   bash install.sh --backup     # Backup existing .claude and install fresh
#   bash install.sh --merge      # Merge with existing .claude (keep your files)
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

# Parse command line arguments
MODE="interactive"  # Default mode
if [ "$1" = "--fresh" ]; then
    MODE="fresh"
elif [ "$1" = "--backup" ]; then
    MODE="backup"
elif [ "$1" = "--merge" ]; then
    MODE="merge"
elif [ -n "$1" ]; then
    echo "Unknown option: $1"
    echo ""
    echo "Usage:"
    echo "  bash install.sh              # Interactive mode"
    echo "  bash install.sh --fresh      # Fresh install"
    echo "  bash install.sh --backup     # Backup existing and install"
    echo "  bash install.sh --merge      # Merge with existing"
    echo ""
    exit 1
fi

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

        # Handle based on MODE
        if [ "$MODE" = "fresh" ]; then
            print_error "Existing .claude directory found!"
            echo "Use --backup or --merge flag, or remove .claude directory first."
            exit 1
        elif [ "$MODE" = "backup" ]; then
            backup_dir=".claude-backup-$(date +%Y%m%d-%H%M%S)"
            echo ""
            print_warning "Existing .claude directory found!"
            print_info "Backing up to $backup_dir..."
            mv .claude "$backup_dir"
            print_success "Backed up to $backup_dir"
            return 0  # Fresh install mode
        elif [ "$MODE" = "merge" ]; then
            echo ""
            print_warning "Existing .claude directory found!"
            print_info "Framework will be added alongside your existing files..."
            print_info "Your files will NOT be overwritten."
            return 1  # Merge mode
        else
            # Interactive mode
            echo ""
            print_warning "Existing .claude directory found!"
            echo ""
            echo "What would you like to do?"
            echo "  1) Backup existing and install fresh"
            echo "  2) Merge with existing (keeps your files)"
            echo "  3) Cancel installation"
            echo ""
            read -p "Choice [1-3]: " choice

            case $choice in
                1)
                    backup_dir=".claude-backup-$(date +%Y%m%d-%H%M%S)"
                    mv .claude "$backup_dir"
                    print_success "Backed up to $backup_dir"
                    return 0
                    ;;
                2)
                    print_info "Framework will be added alongside your existing files..."
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
    if [ "$merge_mode" -eq 1 ]; then
        # Merge mode: Don't overwrite user's CLAUDE.md, but add migration guide
        if [ ! -f ".claude/CLAUDE.md" ]; then
            cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
            print_success "Installed CLAUDE.md"
        else
            print_info "Keeping your existing CLAUDE.md"
        fi
        # Add migration guide in merge mode
        cp "$TEMP_DIR/.claude/MIGRATION-GUIDE.md" .claude/
        print_success "Added MIGRATION-GUIDE.md (for organizing files)"
    else
        # Fresh install: Just copy
        cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
        print_success "Installed CLAUDE.md"
    fi

    # Commands
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/commands" ]; then
        cp -n "$TEMP_DIR/.claude/commands/"* .claude/commands/ 2>/dev/null || true
        print_success "Added framework commands (kept yours)"
    else
        mkdir -p .claude/commands
        cp -r "$TEMP_DIR/.claude/commands/"* .claude/commands/
        print_success "Installed commands"
    fi

    # Workflows
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/workflows" ]; then
        cp -rn "$TEMP_DIR/.claude/workflows/"* .claude/workflows/ 2>/dev/null || true
        print_success "Added framework workflows (kept yours)"
    else
        mkdir -p .claude/workflows
        cp -r "$TEMP_DIR/.claude/workflows/"* .claude/workflows/
        print_success "Installed workflows"
    fi

    # Tools
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/tools" ]; then
        cp -rn "$TEMP_DIR/.claude/tools/"* .claude/tools/ 2>/dev/null || true
        print_success "Added framework tools (kept yours)"
    else
        mkdir -p .claude/tools
        cp -r "$TEMP_DIR/.claude/tools/"* .claude/tools/
        print_success "Installed tools"
    fi

    # Config
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/config" ]; then
        cp -rn "$TEMP_DIR/.claude/config/"* .claude/config/ 2>/dev/null || true
        print_success "Added framework config (kept yours)"
    else
        mkdir -p .claude/config
        cp -r "$TEMP_DIR/.claude/config/"* .claude/config/
        print_success "Installed config"
    fi

    # Your-stack structure
    if [ ! -d ".claude/your-stack" ]; then
        mkdir -p .claude/your-stack/{coding-standards,architecture,documentation-standards,config}
        cp "$TEMP_DIR/.claude/your-stack/stack-config.yaml" .claude/your-stack/ 2>/dev/null || true
        cp "$TEMP_DIR/.claude/your-stack/README.md" .claude/your-stack/ 2>/dev/null || true
        touch .claude/your-stack/coding-standards/.gitkeep
        touch .claude/your-stack/architecture/.gitkeep
        touch .claude/your-stack/documentation-standards/.gitkeep
        touch .claude/your-stack/config/.gitkeep
        print_success "Created your-stack directory structure"
    else
        print_info "Keeping existing your-stack directory"
        # Still copy stack-config.yaml if missing
        if [ ! -f ".claude/your-stack/stack-config.yaml" ]; then
            cp "$TEMP_DIR/.claude/your-stack/stack-config.yaml" .claude/your-stack/ 2>/dev/null || true
            print_success "Added missing stack-config.yaml"
        fi
    fi

    # Tasks directory
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
    local merge_mode=$1

    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Installation Complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""

    if [ "$merge_mode" -eq 1 ]; then
        # Merge mode - show migration instructions
        echo -e "${YELLOW}📦 Merged Installation${NC}"
        echo ""
        echo "   Framework files added alongside your existing files."
        echo "   Your files were NOT overwritten."
        echo ""
        echo -e "${BLUE}🚀 Next Step - Organize Your Files:${NC}"
        echo ""
        echo -e "${BLUE}In Claude Code (not your terminal):${NC}"
        echo ""
        echo "   Tell Claude: \"Help me organize my .claude directory\""
        echo ""
        echo "   Claude will:"
        echo "   • Read MIGRATION-GUIDE.md"
        echo "   • Analyze your existing files"
        echo "   • Suggest where each file should go"
        echo "   • Help you organize into the framework structure"
        echo "   • Preserve all your custom content"
        echo ""
        echo -e "${BLUE}📚 After Organization:${NC}"
        echo ""
        echo "1. Set up your stack standards:"
        echo -e "   ${YELLOW}/research-stack${NC}"
        echo ""
        echo "2. Start coding with the framework:"
        echo -e "   ${YELLOW}/start-task \"your task description\"${NC}"
    else
        # Fresh install - show normal instructions
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
    fi
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
    show_next_steps $merge_mode
}

# Run installation
main
