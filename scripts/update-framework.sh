#!/bin/bash

# update-framework.sh
# Update the Claude Development Framework while preserving customizations
# Version: 1.0.0

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
FRAMEWORK_REPO="https://github.com/LuisLadino/claude-dev-framework.git"
TEMP_DIR=".claude/.update-temp"
BACKUP_DIR=".claude/backups/update_$(date +%Y%m%d_%H%M%S)"

# Helper functions
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Claude Development Framework - Update${NC}"
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

print_version() {
    echo -e "${MAGENTA}$1${NC}"
}

# Check prerequisites
check_prerequisites() {
    if [ ! -d ".claude" ]; then
        print_error "No .claude directory found!"
        echo "This script must be run from a project with the framework installed."
        exit 1
    fi

    # Check for git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed!"
        echo "Please install git to update the framework."
        exit 1
    fi

    # Check internet connection
    if ! ping -c 1 8.8.8.8 &> /dev/null; then
        print_warning "No internet connection detected"
        echo "This script requires internet access to check for updates."
        read -p "Continue anyway? (y/n) [n]: " continue_offline
        if [ "$continue_offline" != "y" ] && [ "$continue_offline" != "Y" ]; then
            exit 1
        fi
    fi
}

# Get current version
get_current_version() {
    if [ -f ".claude/your-stack/stack-config.yaml" ]; then
        version=$(grep "framework_version:" .claude/your-stack/stack-config.yaml | cut -d'"' -f2)
        if [ -z "$version" ]; then
            version="unknown"
        fi
    else
        version="unknown"
    fi
    echo "$version"
}

# Backup current setup
backup_current() {
    print_info "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup your-stack (customizations)
    if [ -d ".claude/your-stack" ]; then
        cp -r .claude/your-stack "$BACKUP_DIR/"
        print_success "Backed up customizations"
    fi
    
    # Backup framework files
    cp -r .claude/commands "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .claude/workflows "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .claude/templates "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .claude/tools "$BACKUP_DIR/" 2>/dev/null || true
    cp .claude/CLAUDE.md "$BACKUP_DIR/" 2>/dev/null || true
    cp .claude/README.md "$BACKUP_DIR/" 2>/dev/null || true
    
    print_success "Backup created at: $BACKUP_DIR"
}

# Fetch latest version
fetch_latest() {
    print_info "Fetching latest framework version..."
    
    # Clean temp directory
    rm -rf "$TEMP_DIR"
    mkdir -p "$TEMP_DIR"
    
    # Clone latest version
    if git clone --depth 1 "$FRAMEWORK_REPO" "$TEMP_DIR" 2>/dev/null; then
        print_success "Downloaded latest framework"
        
        # Get version from downloaded framework
        if [ -f "$TEMP_DIR/.claude/VERSION" ]; then
            latest_version=$(cat "$TEMP_DIR/.claude/VERSION")
        else
            latest_version="latest"
        fi
        
        echo "$latest_version"
    else
        print_error "Failed to download framework updates"
        echo "Repository: $FRAMEWORK_REPO"
        echo ""
        echo "Please check:"
        echo "  1. Repository URL is correct"
        echo "  2. You have internet access"
        echo "  3. Repository is accessible"
        exit 1
    fi
}

# Compare versions
compare_versions() {
    local current=$1
    local latest=$2
    
    echo ""
    print_info "Version Information:"
    echo "  Current: $(print_version "$current")"
    echo "  Latest:  $(print_version "$latest")"
    echo ""
    
    if [ "$current" = "$latest" ]; then
        return 1  # Same version
    else
        return 0  # Different version
    fi
}

# Update framework files
update_framework_files() {
    print_info "Updating framework files..."
    
    local updated_count=0
    
    # Update commands
    if [ -d "$TEMP_DIR/.claude/commands" ]; then
        cp -r "$TEMP_DIR/.claude/commands" .claude/
        print_success "Updated commands"
        ((updated_count++))
    fi
    
    # Update workflows
    if [ -d "$TEMP_DIR/.claude/workflows" ]; then
        cp -r "$TEMP_DIR/.claude/workflows" .claude/
        print_success "Updated workflows"
        ((updated_count++))
    fi
    
    # Update templates
    if [ -d "$TEMP_DIR/.claude/templates" ]; then
        cp -r "$TEMP_DIR/.claude/templates" .claude/
        print_success "Updated templates"
        ((updated_count++))
    fi
    
    # Update tools
    if [ -d "$TEMP_DIR/.claude/tools" ]; then
        cp -r "$TEMP_DIR/.claude/tools" .claude/
        print_success "Updated tools"
        ((updated_count++))
    fi
    
    # Update core files
    if [ -f "$TEMP_DIR/.claude/CLAUDE.md" ]; then
        cp "$TEMP_DIR/.claude/CLAUDE.md" .claude/
        print_success "Updated CLAUDE.md"
        ((updated_count++))
    fi
    
    if [ -f "$TEMP_DIR/.claude/README.md" ]; then
        cp "$TEMP_DIR/.claude/README.md" .claude/
        print_success "Updated README.md"
        ((updated_count++))
    fi
    
    # Update scripts
    if [ -d "$TEMP_DIR/scripts" ]; then
        cp -r "$TEMP_DIR/scripts" .
        chmod +x scripts/*.sh
        print_success "Updated helper scripts"
        ((updated_count++))
    fi
    
    echo ""
    print_success "Updated $updated_count component(s)"
}

# Preserve customizations
preserve_customizations() {
    print_info "Preserving your customizations..."
    
    # Your-stack directory is never touched during updates
    # But we verify it's still there
    if [ -d ".claude/your-stack" ]; then
        print_success "Your customizations are preserved"
    else
        print_warning "No customizations directory found"
        echo "This is normal for first-time updates."
    fi
}

# Update version in config
update_version() {
    local new_version=$1
    
    if [ -f ".claude/your-stack/stack-config.yaml" ]; then
        # Update framework version
        if grep -q "framework_version:" .claude/your-stack/stack-config.yaml; then
            sed -i.bak "s/framework_version: .*/framework_version: \"$new_version\"/" .claude/your-stack/stack-config.yaml
        else
            echo "framework_version: \"$new_version\"" >> .claude/your-stack/stack-config.yaml
        fi
        
        # Update last_updated
        if grep -q "last_updated:" .claude/your-stack/stack-config.yaml; then
            sed -i.bak "s/last_updated: .*/last_updated: \"$(date +%Y-%m-%d)\"/" .claude/your-stack/stack-config.yaml
        else
            echo "last_updated: \"$(date +%Y-%m-%d)\"" >> .claude/your-stack/stack-config.yaml
        fi
        
        rm -f .claude/your-stack/stack-config.yaml.bak
        print_success "Updated version information"
    fi
}

# Show changelog
show_changelog() {
    if [ -f "$TEMP_DIR/CHANGELOG.md" ]; then
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Latest Changes${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        head -n 30 "$TEMP_DIR/CHANGELOG.md"
        echo ""
        echo "See full changelog: CHANGELOG.md"
    fi
}

# Cleanup
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}

# Rollback function
rollback() {
    if [ -z "$1" ]; then
        print_error "No backup directory specified"
        return 1
    fi
    
    local backup_dir=$1
    
    if [ ! -d "$backup_dir" ]; then
        print_error "Backup directory not found: $backup_dir"
        return 1
    fi
    
    print_info "Rolling back to backup..."
    
    # Restore files
    cp -r "$backup_dir/commands" .claude/ 2>/dev/null || true
    cp -r "$backup_dir/workflows" .claude/ 2>/dev/null || true
    cp -r "$backup_dir/templates" .claude/ 2>/dev/null || true
    cp -r "$backup_dir/tools" .claude/ 2>/dev/null || true
    cp "$backup_dir/CLAUDE.md" .claude/ 2>/dev/null || true
    cp "$backup_dir/README.md" .claude/ 2>/dev/null || true
    
    # Restore your-stack
    if [ -d "$backup_dir/your-stack" ]; then
        rm -rf .claude/your-stack
        cp -r "$backup_dir/your-stack" .claude/
    fi
    
    print_success "Rollback complete"
}

# Main update process
main() {
    print_header
    check_prerequisites
    
    echo "This script updates the framework to the latest version."
    echo "Your customizations in .claude/your-stack/ will be preserved."
    echo ""
    
    # Get current version
    current_version=$(get_current_version)
    print_info "Current version: $current_version"
    
    # Check for updates
    echo ""
    read -p "Check for updates? (y/n) [y]: " check_updates
    check_updates=${check_updates:-y}
    
    if [ "$check_updates" != "y" ] && [ "$check_updates" != "Y" ]; then
        print_info "Update cancelled"
        exit 0
    fi
    
    # Fetch latest version
    latest_version=$(fetch_latest)
    
    # Compare versions
    if ! compare_versions "$current_version" "$latest_version"; then
        echo ""
        print_success "You're already on the latest version!"
        echo ""
        read -p "Force update anyway? (y/n) [n]: " force_update
        force_update=${force_update:-n}
        
        if [ "$force_update" != "y" ] && [ "$force_update" != "Y" ]; then
            cleanup
            exit 0
        fi
    fi
    
    # Show changelog
    show_changelog
    
    # Confirm update
    echo ""
    print_warning "This will update framework files but preserve your customizations."
    read -p "Continue with update? (y/n) [y]: " confirm
    confirm=${confirm:-y}
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_info "Update cancelled"
        cleanup
        exit 0
    fi
    
    # Backup current setup
    backup_current
    
    # Update framework files
    echo ""
    update_framework_files
    
    # Preserve customizations (verify)
    preserve_customizations
    
    # Update version
    update_version "$latest_version"
    
    # Cleanup
    cleanup
    
    # Final summary
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Update Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Updated from $(print_version "$current_version") to $(print_version "$latest_version")"
    echo ""
    echo "Backup created at: $BACKUP_DIR"
    echo ""
    echo "What changed:"
    echo "  ✓ Framework commands"
    echo "  ✓ Workflow files"
    echo "  ✓ Template files"
    echo "  ✓ Tool integrations"
    echo "  ✓ Core documentation"
    echo "  ✓ Helper scripts"
    echo ""
    echo "Preserved:"
    echo "  ✓ Your stack configuration"
    echo "  ✓ Your customized standards"
    echo "  ✓ Your documentation"
    echo "  ✓ Your project-specific settings"
    echo ""
    echo "Next steps:"
    echo ""
    echo "  1. Review changes:"
    echo "     cat CHANGELOG.md"
    echo ""
    echo "  2. Test the update:"
    echo "     Use /start-task command in Claude"
    echo ""
    echo "  3. Validate setup:"
    echo "     ./scripts/validate-setup.sh"
    echo ""
    echo "  4. If issues occur, rollback:"
    echo "     Run: ./scripts/update-framework.sh --rollback $BACKUP_DIR"
    echo ""
    print_info "Update successful! 🚀"
    echo ""
}

# Handle rollback flag
if [ "$1" = "--rollback" ]; then
    if [ -z "$2" ]; then
        echo "Usage: $0 --rollback <backup_directory>"
        echo ""
        echo "Available backups:"
        ls -dt .claude/backups/update_* 2>/dev/null || echo "  No backups found"
        exit 1
    fi
    rollback "$2"
    exit 0
fi

# Run main function
main
