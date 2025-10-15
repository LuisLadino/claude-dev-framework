#!/bin/bash

# import-company-standards.sh
# Import existing company documentation into the Claude Development Framework
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
    echo -e "${BLUE}  Claude Development Framework - Import Standards${NC}"
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

# Check prerequisites
check_prerequisites() {
    if [ ! -d ".claude" ]; then
        print_error "No .claude directory found!"
        echo "Please run init-stack.sh first to set up the framework."
        exit 1
    fi

    if [ ! -f ".claude/your-stack/stack-config.yaml" ]; then
        print_error "No stack configuration found!"
        echo "Please run init-stack.sh first to set up the framework."
        exit 1
    fi

    # Create backup directory
    mkdir -p .claude/backups
}

# Backup existing standards
backup_standards() {
    local backup_dir=".claude/backups/$(date +%Y%m%d_%H%M%S)"
    
    if [ -d ".claude/your-stack" ]; then
        print_info "Creating backup..."
        mkdir -p "$backup_dir"
        cp -r .claude/your-stack "$backup_dir/"
        print_success "Backup created at: $backup_dir"
        echo "$backup_dir"
    fi
}

# Process a single file
process_file() {
    local source_file=$1
    local doc_type=$2
    local target_dir=$3
    
    if [ ! -f "$source_file" ]; then
        print_warning "File not found: $source_file"
        return 1
    fi
    
    local filename=$(basename "$source_file")
    local target_file="$target_dir/$filename"
    
    # Check if file already exists
    if [ -f "$target_file" ]; then
        echo ""
        print_warning "File already exists: $target_file"
        read -p "Overwrite? (y/n/merge) [merge]: " overwrite
        overwrite=${overwrite:-merge}
        
        case $overwrite in
            y|Y)
                cp "$source_file" "$target_file"
                print_success "Overwrote: $filename"
                ;;
            n|N)
                print_info "Skipped: $filename"
                return 0
                ;;
            merge|m|M)
                # Create merged file
                {
                    echo "# Merged Standards"
                    echo ""
                    echo "## From Company Documentation"
                    echo ""
                    cat "$source_file"
                    echo ""
                    echo "---"
                    echo ""
                    echo "## From Framework Template"
                    echo ""
                    cat "$target_file"
                } > "${target_file}.merged"
                mv "${target_file}.merged" "$target_file"
                print_success "Merged: $filename"
                ;;
            *)
                print_info "Skipped: $filename"
                return 0
                ;;
        esac
    else
        cp "$source_file" "$target_file"
        print_success "Imported: $filename"
    fi
    
    return 0
}

# Process directory
process_directory() {
    local source_dir=$1
    local doc_type=$2
    local target_dir=$3
    
    if [ ! -d "$source_dir" ]; then
        print_warning "Directory not found: $source_dir"
        return 1
    fi
    
    mkdir -p "$target_dir"
    
    local file_count=0
    for file in "$source_dir"/*.{md,txt}; do
        # Check if glob found anything
        [ -e "$file" ] || continue
        
        if process_file "$file" "$doc_type" "$target_dir"; then
            ((file_count++))
        fi
    done
    
    if [ $file_count -eq 0 ]; then
        print_info "No files imported from $source_dir"
    else
        print_success "Imported $file_count file(s) from $source_dir"
    fi
}

# Update stack config with import metadata
update_stack_config() {
    local config_file=".claude/your-stack/stack-config.yaml"
    
    # Add import metadata if not exists
    if ! grep -q "import_metadata:" "$config_file"; then
        cat >> "$config_file" << EOF

# Company Standards Import
import_metadata:
  imported: true
  import_date: "$(date +%Y-%m-%d)"
  import_source: "$1"
  import_method: "script"
EOF
        print_success "Updated stack configuration"
    fi
}

# Main import process
main() {
    print_header
    check_prerequisites
    
    echo "This script imports your company's existing documentation into the framework."
    echo ""
    print_warning "Important: This will modify files in .claude/your-stack/"
    echo ""
    
    # Create backup
    backup_dir=$(backup_standards)
    
    echo ""
    echo "What would you like to import?"
    echo ""
    echo "  1) Single file"
    echo "  2) Directory of files"
    echo "  3) Multiple files (interactive)"
    echo "  4) Cancel"
    echo ""
    read -p "Choice [1-4]: " import_choice
    
    case $import_choice in
        1)
            # Single file import
            echo ""
            read -p "Path to documentation file: " doc_file
            
            if [ ! -f "$doc_file" ]; then
                print_error "File not found: $doc_file"
                exit 1
            fi
            
            echo ""
            echo "What type of documentation is this?"
            echo "  1) Coding standards"
            echo "  2) Architecture/patterns"
            echo "  3) Documentation standards"
            echo "  4) Testing standards"
            read -p "Choice [1-4]: " doc_type_choice
            
            case $doc_type_choice in
                1) target_dir=".claude/your-stack/coding-standards" ;;
                2) target_dir=".claude/your-stack/architecture" ;;
                3) target_dir=".claude/your-stack/documentation-standards" ;;
                4) target_dir=".claude/your-stack/testing-standards" ;;
                *)
                    print_error "Invalid choice"
                    exit 1
                    ;;
            esac
            
            mkdir -p "$target_dir"
            process_file "$doc_file" "single" "$target_dir"
            update_stack_config "$(dirname "$doc_file")"
            ;;
            
        2)
            # Directory import
            echo ""
            read -p "Path to documentation directory: " doc_dir
            
            if [ ! -d "$doc_dir" ]; then
                print_error "Directory not found: $doc_dir"
                exit 1
            fi
            
            echo ""
            print_info "Scanning directory: $doc_dir"
            echo ""
            
            # Look for subdirectories or process all files
            if [ -d "$doc_dir/coding-standards" ] || [ -d "$doc_dir/architecture" ] || [ -d "$doc_dir/documentation" ]; then
                print_info "Found structured documentation directory"
                
                [ -d "$doc_dir/coding-standards" ] && \
                    process_directory "$doc_dir/coding-standards" "coding" ".claude/your-stack/coding-standards"
                
                [ -d "$doc_dir/architecture" ] && \
                    process_directory "$doc_dir/architecture" "architecture" ".claude/your-stack/architecture"
                
                [ -d "$doc_dir/documentation" ] && \
                    process_directory "$doc_dir/documentation" "documentation" ".claude/your-stack/documentation-standards"
                
                [ -d "$doc_dir/testing" ] && \
                    process_directory "$doc_dir/testing" "testing" ".claude/your-stack/testing-standards"
            else
                echo "Where should these files be imported?"
                echo "  1) Coding standards"
                echo "  2) Architecture/patterns"
                echo "  3) Documentation standards"
                echo "  4) Testing standards"
                read -p "Choice [1-4]: " target_choice
                
                case $target_choice in
                    1) target_dir=".claude/your-stack/coding-standards" ;;
                    2) target_dir=".claude/your-stack/architecture" ;;
                    3) target_dir=".claude/your-stack/documentation-standards" ;;
                    4) target_dir=".claude/your-stack/testing-standards" ;;
                    *)
                        print_error "Invalid choice"
                        exit 1
                        ;;
                esac
                
                process_directory "$doc_dir" "batch" "$target_dir"
            fi
            
            update_stack_config "$doc_dir"
            ;;
            
        3)
            # Multiple files interactive
            echo ""
            print_info "Enter file paths one at a time (empty line to finish)"
            echo ""
            
            file_count=0
            while true; do
                read -p "File path (or press Enter to finish): " doc_file
                
                [ -z "$doc_file" ] && break
                
                if [ ! -f "$doc_file" ]; then
                    print_warning "File not found: $doc_file"
                    continue
                fi
                
                echo "Import as:"
                echo "  1) Coding standards"
                echo "  2) Architecture/patterns"
                echo "  3) Documentation standards"
                echo "  4) Testing standards"
                read -p "Choice [1-4]: " doc_type_choice
                
                case $doc_type_choice in
                    1) target_dir=".claude/your-stack/coding-standards" ;;
                    2) target_dir=".claude/your-stack/architecture" ;;
                    3) target_dir=".claude/your-stack/documentation-standards" ;;
                    4) target_dir=".claude/your-stack/testing-standards" ;;
                    *)
                        print_warning "Invalid choice, skipping file"
                        continue
                        ;;
                esac
                
                mkdir -p "$target_dir"
                if process_file "$doc_file" "interactive" "$target_dir"; then
                    ((file_count++))
                fi
                
                echo ""
            done
            
            if [ $file_count -gt 0 ]; then
                update_stack_config "multiple sources"
            else
                print_info "No files were imported"
            fi
            ;;
            
        4)
            print_info "Import cancelled"
            exit 0
            ;;
            
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    # Final summary
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Import Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Imported standards are now available in .claude/your-stack/"
    echo ""
    
    if [ -n "$backup_dir" ]; then
        echo "Backup created at: $backup_dir"
        echo ""
    fi
    
    echo "Next steps:"
    echo ""
    echo "  1. Review imported files:"
    echo "     ls -la .claude/your-stack/*/"
    echo ""
    echo "  2. Edit and customize as needed:"
    echo "     vim .claude/your-stack/coding-standards/*.md"
    echo ""
    echo "  3. Use /import-standards command in Claude to:"
    echo "     - Convert formats if needed"
    echo "     - Merge with templates"
    echo "     - Validate standards"
    echo ""
    echo "  4. Validate your setup:"
    echo "     ./scripts/validate-setup.sh"
    echo ""
    echo "  5. Start using the framework:"
    echo "     Use /start-task command in Claude"
    echo ""
    
    if [ -n "$backup_dir" ]; then
        echo "  Rollback instructions (if needed):"
        echo "     rm -rf .claude/your-stack"
        echo "     cp -r $backup_dir/your-stack .claude/"
        echo ""
    fi
    
    print_info "Import successful! 🎉"
    echo ""
}

# Run main function
main
