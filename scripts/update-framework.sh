#!/bin/bash

# update-framework.sh
# Update the Claude Development Framework while preserving customizations
# Works in any project repo - doesn't require framework to be a git repo

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRAMEWORK_REPO="https://github.com/LuisLadino/claude-dev-framework"
TEMP_DIR=".claude-update-temp"
BACKUP_DIR=".claude-backup-update-$(date +%Y%m%d-%H%M%S)"

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Claude Development Framework - Update${NC}"
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

# Check prerequisites
check_prerequisites() {
    # Check if we're in the framework repo itself
    if [ -f "scripts/install.sh" ] && [ -f ".claude/CLAUDE.md" ] && [ -d ".git" ]; then
        if git remote -v | grep -q "claude-dev-framework"; then
            print_error "This is the framework development repo!"
            echo ""
            echo "The update script is for projects that USE the framework,"
            echo "not for the framework repo itself."
            echo ""
            echo "You're in: $(basename $(pwd))"
            echo ""
            echo "To test updates:"
            echo "  1. Navigate to a project that has the framework installed"
            echo "  2. Run: /update-framework"
            echo ""
            echo "To develop the framework:"
            echo "  1. Make changes here"
            echo "  2. Commit and push"
            echo "  3. Users will get updates when they run /update-framework"
            exit 1
        fi
    fi

    if [ ! -d ".claude" ]; then
        print_error "No .claude directory found!"
        echo "This script must be run from a project with the framework installed."
        echo ""
        echo "To install the framework:"
        echo "  curl -fsSL https://raw.githubusercontent.com/LuisLadino/claude-dev-framework/main/scripts/install.sh | bash"
        exit 1
    fi

    if [ ! -f ".claude/CLAUDE.md" ]; then
        print_error "Framework CLAUDE.md not found!"
        echo "Your .claude directory doesn't appear to have the framework installed."
        exit 1
    fi
}

# Download latest framework
download_framework() {
    print_info "Downloading latest framework..."

    # Clean temp directory
    rm -rf "$TEMP_DIR"
    mkdir -p "$TEMP_DIR"

    # Download framework as tarball (works without git clone)
    if curl -fsSL "${FRAMEWORK_REPO}/archive/refs/heads/main.tar.gz" | tar -xz -C "$TEMP_DIR" --strip-components=1; then
        print_success "Downloaded latest framework"
        return 0
    else
        print_error "Failed to download framework"
        echo "Repository: $FRAMEWORK_REPO"
        echo ""
        echo "Please check:"
        echo "  1. You have internet access"
        echo "  2. GitHub is accessible"
        echo "  3. Repository URL is correct"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
}

# Backup current framework files
backup_framework() {
    print_info "Creating backup..."

    mkdir -p "$BACKUP_DIR"

    # Backup framework files (NOT your-stack)
    cp -r .claude/commands "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .claude/workflows "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .claude/tools "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .claude/config "$BACKUP_DIR/" 2>/dev/null || true
    cp .claude/CLAUDE.md "$BACKUP_DIR/" 2>/dev/null || true
    cp .claude/MIGRATION-GUIDE.md "$BACKUP_DIR/" 2>/dev/null || true

    print_success "Backup created: $BACKUP_DIR"
}

# Update framework files
update_framework_files() {
    print_info "Updating framework files..."

    local updated=0

    # Update CLAUDE.md (core framework instructions)
    if [ -f "$TEMP_DIR/.claude/CLAUDE.md" ]; then
        # Check if user has PROJECT-INSTRUCTIONS.md (custom instructions)
        if [ -f ".claude/PROJECT-INSTRUCTIONS.md" ]; then
            # User has separated custom instructions - safe to update CLAUDE.md
            cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
            print_success "Updated CLAUDE.md"
            ((updated++))
        else
            # Check if CLAUDE.md has been customized
            if diff -q .claude/CLAUDE.md "$TEMP_DIR/.claude/CLAUDE.md" > /dev/null 2>&1; then
                # Same file, update it
                cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
                print_success "Updated CLAUDE.md"
                ((updated++))
            else
                # Different - user might have customized it
                print_warning "CLAUDE.md appears customized - skipping"
                echo "   To update: manually merge or move customizations to PROJECT-INSTRUCTIONS.md"
            fi
        fi
    fi

    # Update commands
    if [ -d "$TEMP_DIR/.claude/commands" ]; then
        cp -r "$TEMP_DIR/.claude/commands" .claude/
        print_success "Updated commands"
        ((updated++))
    fi

    # Update workflows
    if [ -d "$TEMP_DIR/.claude/workflows" ]; then
        cp -r "$TEMP_DIR/.claude/workflows" .claude/
        print_success "Updated workflows"
        ((updated++))
    fi

    # Update tools
    if [ -d "$TEMP_DIR/.claude/tools" ]; then
        cp -r "$TEMP_DIR/.claude/tools" .claude/
        print_success "Updated tools"
        ((updated++))
    fi

    # Update config (framework operational configs)
    if [ -d "$TEMP_DIR/.claude/config" ]; then
        cp -r "$TEMP_DIR/.claude/config" .claude/
        print_success "Updated config"
        ((updated++))
    fi

    # Update scripts (ALL scripts from framework)
    if [ -d "$TEMP_DIR/scripts" ]; then
        mkdir -p scripts
        # Copy all framework scripts
        for script in "$TEMP_DIR/scripts/"*.sh; do
            if [ -f "$script" ]; then
                script_name=$(basename "$script")
                # Skip install.sh and uninstall.sh (only needed for initial setup)
                if [ "$script_name" != "install.sh" ] && [ "$script_name" != "uninstall.sh" ]; then
                    cp "$script" "scripts/"
                fi
            fi
        done
        chmod +x scripts/*.sh 2>/dev/null || true
        print_success "Updated scripts"
        ((updated++))
    fi

    # Update README if it exists in framework
    if [ -f "$TEMP_DIR/.claude/README.md" ]; then
        cp "$TEMP_DIR/.claude/README.md" .claude/
        print_success "Updated README.md"
        ((updated++))
    fi

    # Remove MIGRATION-GUIDE.md if it exists (only needed for initial merge)
    if [ -f ".claude/MIGRATION-GUIDE.md" ]; then
        rm -f .claude/MIGRATION-GUIDE.md
        print_info "Removed MIGRATION-GUIDE.md (no longer needed)"
    fi

    echo ""
    print_success "Updated $updated component(s)"
}

# Verify customizations preserved
verify_customizations() {
    print_info "Verifying your customizations are preserved..."

    local all_good=true

    # Check your-stack directory
    if [ -d ".claude/your-stack" ]; then
        print_success "your-stack/ directory preserved"
    else
        print_warning "No your-stack/ directory found"
        all_good=false
    fi

    # Check for custom instructions
    if [ -f ".claude/PROJECT-INSTRUCTIONS.md" ]; then
        print_success "PROJECT-INSTRUCTIONS.md preserved"
    fi

    if [ -f ".claude/CLAUDE-OLD.md" ]; then
        print_success "CLAUDE-OLD.md preserved"
    fi

    # Check tasks directory
    if [ -d ".claude/tasks" ]; then
        print_success "tasks/ directory preserved"
    fi

    if [ "$all_good" = true ]; then
        echo ""
        print_success "All customizations preserved"
    fi
}

# Cleanup
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        print_success "Cleaned up temporary files"
    fi
}

# Show what was updated
show_summary() {
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Update Complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}What was updated:${NC}"
    echo "  ✓ Framework commands (.claude/commands/) - All slash commands"
    echo "  ✓ Workflow files (.claude/workflows/) - Multi-step workflows"
    echo "  ✓ Tool integrations (.claude/tools/) - MCP, git hooks, etc."
    echo "  ✓ Config files (.claude/config/) - Framework configs only"
    echo "  ✓ Core CLAUDE.md (if not customized)"
    echo "  ✓ Helper scripts (scripts/) - ALL framework scripts"
    echo "  ✓ README.md (.claude/README.md) - Framework documentation"
    echo ""
    echo -e "${BLUE}What was preserved:${NC}"
    echo "  ✓ Your stack configuration (.claude/your-stack/)"
    echo "  ✓ Your custom standards (coding-standards/, architecture/, etc.)"
    echo "  ✓ Your documentation standards"
    echo "  ✓ Your custom instructions (PROJECT-INSTRUCTIONS.md, CLAUDE-OLD.md)"
    echo "  ✓ Your tasks and PRDs (.claude/tasks/)"
    echo "  ✓ Any custom files you created"
    echo ""
    echo -e "${BLUE}What was NOT installed:${NC}"
    echo "  • templates/ - Framework development files (not for users)"
    echo "  • install.sh/uninstall.sh - Only needed for initial setup"
    echo ""
    echo -e "${BLUE}Backup location:${NC}"
    echo "  $BACKUP_DIR"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo ""
    echo "  1. Verify setup:"
    echo "     ./scripts/validate-setup.sh"
    echo ""
    echo "  2. Test framework:"
    echo "     Use /start-task in Claude Code"
    echo ""
    echo "  3. If issues occur, restore from backup:"
    echo "     cp -r $BACKUP_DIR/* .claude/"
    echo ""
}

# Main update process
main() {
    print_header

    print_info "This script updates the framework while preserving your customizations."
    echo ""

    check_prerequisites

    echo ""
    read -p "Continue with update? (y/n) [y]: " confirm
    confirm=${confirm:-y}

    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "Update cancelled"
        exit 0
    fi

    echo ""
    download_framework
    backup_framework
    echo ""
    update_framework_files
    echo ""
    verify_customizations
    cleanup

    show_summary
}

# Run main function
main
