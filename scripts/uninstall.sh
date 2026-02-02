#!/bin/bash

# Claude Development Framework - Uninstall Script
#
# Safely removes the framework from your project while preserving your custom standards.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  Claude Development Framework - Uninstall${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
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

main() {
    print_header

    if [ ! -d ".claude" ]; then
        print_error "No .claude directory found"
        exit 1
    fi

    echo "This will remove the Claude Development Framework from this project."
    echo ""
    echo -e "${YELLOW}What would you like to do with your custom standards?${NC}"
    echo ""
    echo "  1) Backup standards and remove everything"
    echo "  2) Keep standards, remove framework only"
    echo "  3) Remove everything (no backup)"
    echo "  4) Cancel"
    echo ""
    read -p "Choice [1-4]: " choice

    case $choice in
        1)
            # Backup and remove
            backup_dir=".claude-standards-backup-$(date +%Y%m%d-%H%M%S)"

            if [ -d ".claude/your-stack" ]; then
                mkdir -p "$backup_dir"
                cp -r .claude/your-stack "$backup_dir/"
                print_success "Backed up standards to $backup_dir/your-stack"
            fi

            rm -rf .claude
            print_success "Removed .claude directory"

            echo ""
            print_success "Framework uninstalled"
            print_info "Your standards are backed up in: $backup_dir"
            ;;

        2)
            # Keep standards
            if [ -d ".claude/your-stack" ]; then
                temp_standards=".temp-your-stack"
                mv .claude/your-stack "$temp_standards"
                print_success "Preserved your-stack directory"
            fi

            rm -rf .claude
            mkdir -p .claude

            if [ -d "$temp_standards" ]; then
                mv "$temp_standards" .claude/your-stack
                print_success "Restored your-stack directory"
            fi

            echo ""
            print_success "Framework removed, standards preserved"
            print_info "Your standards are still in: .claude/your-stack"
            ;;

        3)
            # Remove everything
            print_warning "This will permanently delete all framework files and your custom standards!"
            read -p "Are you sure? Type 'yes' to confirm: " confirm

            if [ "$confirm" != "yes" ]; then
                print_info "Cancelled"
                exit 0
            fi

            rm -rf .claude
            print_success "Removed .claude directory"

            echo ""
            print_success "Framework completely removed"
            ;;

        4)
            print_info "Uninstall cancelled"
            exit 0
            ;;

        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${BLUE}Uninstall complete.${NC}"
    echo ""
}

main
