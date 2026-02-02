#!/bin/bash

# Claude Development Framework - Installation Script
#
# Installs the framework into your project's .claude directory.
#
# Usage:
#   bash install.sh              # Interactive mode (prompts for choice)
#   bash install.sh --fresh      # Fresh install (error if .claude exists)
#   bash install.sh --backup     # Backup existing .claude and install fresh
#   bash install.sh --merge      # Merge with existing .claude (keep your files)
#
# What gets installed:
#   - Core framework files (CLAUDE.md, config)
#   - Command system (commands/ with organized categories)
#   - Empty your-stack/ structure (you'll populate via /research-stack)
#   - framework-source.txt (for /update-framework)
#
# What stays in GitHub repo only:
#   - Documentation (README, CHANGELOG, docs/)
#   - Helper scripts (scripts/)
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
FRAMEWORK_REPO="https://github.com/LuisLadino/claude-dev-framework.git"
TEMP_DIR=".claude-framework-temp"

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Claude Development Framework v2.0 - Installation${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}+${NC} $1"
}

print_error() {
    echo -e "${RED}x${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_info() {
    echo -e "${BLUE}>${NC} $1"
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

    # Core framework files - CLAUDE.md
    if [ "$merge_mode" -eq 1 ]; then
        if [ -f ".claude/CLAUDE.md" ]; then
            mv .claude/CLAUDE.md .claude/CLAUDE-OLD.md
            print_info "Backed up your CLAUDE.md to CLAUDE-OLD.md"
        fi
        cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
        print_success "Installed framework CLAUDE.md"
    else
        cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
        print_success "Installed CLAUDE.md"
    fi

    # Framework source reference
    cp "$TEMP_DIR/.claude/framework-source.txt" .claude/
    print_success "Installed framework-source.txt"

    # Commands (organized in categories)
    if [ "$merge_mode" -eq 1 ] && [ -d ".claude/commands" ]; then
        # Merge: copy category directories without overwriting
        cp -rn "$TEMP_DIR/.claude/commands/coding-framework" .claude/commands/ 2>/dev/null || true
        cp -rn "$TEMP_DIR/.claude/commands/standards-management" .claude/commands/ 2>/dev/null || true
        cp -rn "$TEMP_DIR/.claude/commands/utilities" .claude/commands/ 2>/dev/null || true
        print_success "Added framework commands (kept yours)"
    else
        mkdir -p .claude/commands
        cp -r "$TEMP_DIR/.claude/commands/coding-framework" .claude/commands/
        cp -r "$TEMP_DIR/.claude/commands/standards-management" .claude/commands/
        cp -r "$TEMP_DIR/.claude/commands/utilities" .claude/commands/
        print_success "Installed commands (coding-framework, standards-management, utilities)"
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
        mkdir -p .claude/your-stack/{coding-standards,architecture,design-standards,documentation-standards}
        cp "$TEMP_DIR/.claude/your-stack/stack-config.yaml" .claude/your-stack/ 2>/dev/null || true
        cp "$TEMP_DIR/.claude/your-stack/README.md" .claude/your-stack/ 2>/dev/null || true
        touch .claude/your-stack/coding-standards/.gitkeep
        touch .claude/your-stack/architecture/.gitkeep
        touch .claude/your-stack/design-standards/.gitkeep
        touch .claude/your-stack/documentation-standards/.gitkeep
        print_success "Created your-stack directory structure"
    else
        print_info "Keeping existing your-stack directory"
        if [ ! -f ".claude/your-stack/stack-config.yaml" ]; then
            cp "$TEMP_DIR/.claude/your-stack/stack-config.yaml" .claude/your-stack/ 2>/dev/null || true
            print_success "Added missing stack-config.yaml"
        fi
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

    echo -e "${BLUE}Installed:${NC}"
    echo "   .claude/CLAUDE.md                          - Framework instructions"
    echo "   .claude/commands/coding-framework/         - Development commands"
    echo "   .claude/commands/standards-management/     - Standards commands"
    echo "   .claude/commands/utilities/                - Utility commands"
    echo "   .claude/config/                            - Operational config"
    echo "   .claude/your-stack/                        - Your custom standards (empty)"
    echo "   .claude/framework-source.txt               - Framework update source"
    echo ""

    if [ "$merge_mode" -eq 1 ]; then
        echo -e "${YELLOW}Merged with existing .claude/ directory.${NC}"
        echo "   Your files were NOT overwritten."
        if [ -f ".claude/CLAUDE-OLD.md" ]; then
            echo "   Your previous CLAUDE.md saved as CLAUDE-OLD.md."
        fi
        echo ""
    fi

    echo -e "${BLUE}Next Steps (in Claude Code):${NC}"
    echo ""
    echo "1. Set up your stack standards:"
    echo -e "   ${YELLOW}/research-stack${NC}"
    echo ""
    echo "2. Start coding with the framework:"
    echo -e "   ${YELLOW}/start-task${NC}"
    echo ""
    echo "3. Update framework later:"
    echo -e "   ${YELLOW}/update-framework${NC}"
    echo ""
    echo -e "${BLUE}Available Command Categories:${NC}"
    echo "   coding-framework/    - init-project, start-task, research-stack, etc."
    echo "   standards-management/ - standards, add-standard, analyze-standards, update-framework"
    echo "   utilities/           - learn, verify, contribute-to-opensource"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "   https://github.com/LuisLadino/claude-dev-framework"
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
