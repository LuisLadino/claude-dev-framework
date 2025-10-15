#!/bin/bash

# validate-setup.sh
# Validate Claude Development Framework setup
# Version: 1.0.0

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Claude Development Framework - Setup Validation${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_section() {
    echo ""
    echo -e "${BLUE}━━━ $1 ━━━${NC}"
}

print_check() {
    echo -n "  $1 ... "
}

print_pass() {
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}"
    if [ -n "$1" ]; then
        echo -e "    ${RED}→${NC} $1"
    fi
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_warn() {
    echo -e "${YELLOW}⚠ WARNING${NC}"
    if [ -n "$1" ]; then
        echo -e "    ${YELLOW}→${NC} $1"
    fi
    ((WARNING_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_info() {
    echo -e "    ${BLUE}ℹ${NC} $1"
}

# Validation functions
validate_directory_structure() {
    print_section "Directory Structure"
    
    # Check .claude directory
    print_check "Main .claude directory exists"
    if [ -d ".claude" ]; then
        print_pass
    else
        print_fail "Missing .claude directory - run init-stack.sh"
        return
    fi
    
    # Check core directories
    print_check "Commands directory exists"
    if [ -d ".claude/commands" ]; then
        print_pass
    else
        print_fail "Missing .claude/commands"
    fi
    
    print_check "Workflows directory exists"
    if [ -d ".claude/workflows" ]; then
        print_pass
    else
        print_fail "Missing .claude/workflows"
    fi
    
    print_check "Templates directory exists"
    if [ -d ".claude/templates" ]; then
        print_pass
    else
        print_warn "Missing .claude/templates - optional but recommended"
    fi
    
    print_check "Tools directory exists"
    if [ -d ".claude/tools" ]; then
        print_pass
    else
        print_warn "Missing .claude/tools - optional but recommended"
    fi
    
    print_check "Your-stack directory exists"
    if [ -d ".claude/your-stack" ]; then
        print_pass
    else
        print_fail "Missing .claude/your-stack - run init-stack.sh"
    fi
}

validate_core_files() {
    print_section "Core Files"
    
    print_check "CLAUDE.md exists"
    if [ -f ".claude/CLAUDE.md" ]; then
        print_pass
        
        # Check file size
        size=$(wc -c < ".claude/CLAUDE.md")
        if [ $size -lt 1000 ]; then
            print_warn "CLAUDE.md seems too small ($size bytes)"
        fi
    else
        print_fail "Missing .claude/CLAUDE.md"
    fi
    
    print_check ".claude/README.md exists"
    if [ -f ".claude/README.md" ]; then
        print_pass
    else
        print_warn "Missing .claude/README.md - recommended"
    fi
    
    print_check "Stack configuration exists"
    if [ -f ".claude/your-stack/stack-config.yaml" ]; then
        print_pass
    else
        print_fail "Missing stack-config.yaml - run init-stack.sh"
    fi
}

validate_commands() {
    print_section "Command Files"
    
    local required_commands=(
        "start-task.md"
        "learn.md"
        "standards.md"
        "verify.md"
        "create-prd.md"
        "generate-tasks.md"
        "process-tasks.md"
    )
    
    for cmd in "${required_commands[@]}"; do
        print_check "/$cmd command exists"
        if [ -f ".claude/commands/$cmd" ]; then
            print_pass
        else
            print_fail "Missing .claude/commands/$cmd"
        fi
    done
    
    print_check "Commands README exists"
    if [ -f ".claude/commands/COMMANDS-README.md" ]; then
        print_pass
    else
        print_warn "Missing COMMANDS-README.md"
    fi
}

validate_stack_config() {
    print_section "Stack Configuration"
    
    local config_file=".claude/your-stack/stack-config.yaml"
    
    if [ ! -f "$config_file" ]; then
        print_fail "Stack configuration not found"
        return
    fi
    
    print_check "Project name configured"
    if grep -q "^name:" "$config_file"; then
        name=$(grep "^name:" "$config_file" | cut -d'"' -f2)
        print_pass
        print_info "Project: $name"
    else
        print_warn "No project name set"
    fi
    
    print_check "Framework configured"
    if grep -q "framework:" "$config_file"; then
        framework=$(grep "framework:" "$config_file" | head -1 | cut -d'"' -f2)
        print_pass
        print_info "Framework: $framework"
    else
        print_fail "No framework configured"
    fi
    
    print_check "Language configured"
    if grep -q "language:" "$config_file"; then
        language=$(grep "language:" "$config_file" | head -1 | cut -d'"' -f2)
        print_pass
        print_info "Language: $language"
    else
        print_fail "No language configured"
    fi
    
    print_check "Styling solution configured"
    if grep -q "styling:" "$config_file"; then
        styling=$(grep "styling:" "$config_file" | head -1 | cut -d'"' -f2)
        print_pass
        print_info "Styling: $styling"
    else
        print_warn "No styling solution configured"
    fi
    
    print_check "Testing framework configured"
    if grep -q "testing:" "$config_file"; then
        testing=$(grep "testing:" "$config_file" | head -1 | cut -d'"' -f2)
        print_pass
        print_info "Testing: $testing"
    else
        print_warn "No testing framework configured"
    fi
}

validate_standards() {
    print_section "Standards Files"
    
    print_check "Coding standards directory exists"
    if [ -d ".claude/your-stack/coding-standards" ]; then
        print_pass
        
        # Count files
        count=$(find .claude/your-stack/coding-standards -type f -name "*.md" | wc -l)
        print_info "Found $count standards file(s)"
        
        if [ $count -eq 0 ]; then
            print_warn "No standards files found - run /research-stack in Claude"
        fi
    else
        print_fail "Missing coding-standards directory"
    fi
    
    print_check "Architecture directory exists"
    if [ -d ".claude/your-stack/architecture" ]; then
        print_pass
        
        count=$(find .claude/your-stack/architecture -type f -name "*.md" | wc -l)
        print_info "Found $count architecture file(s)"
    else
        print_warn "Missing architecture directory - optional"
    fi
    
    print_check "Documentation standards directory exists"
    if [ -d ".claude/your-stack/documentation-standards" ]; then
        print_pass
        
        count=$(find .claude/your-stack/documentation-standards -type f -name "*.md" | wc -l)
        print_info "Found $count documentation file(s)"
    else
        print_warn "Missing documentation-standards directory - optional"
    fi
}

validate_workflows() {
    print_section "Workflow Files"
    
    local recommended_workflows=(
        "initial-setup.md"
        "stack-research.md"
    )
    
    for workflow in "${recommended_workflows[@]}"; do
        print_check "$workflow exists"
        if [ -f ".claude/workflows/$workflow" ]; then
            print_pass
        else
            print_warn "Missing .claude/workflows/$workflow - recommended"
        fi
    done
}

validate_tools() {
    print_section "Tool Integration"
    
    print_check "Tool catalog exists"
    if [ -f ".claude/tools/tool-catalog.md" ]; then
        print_pass
    else
        print_warn "Missing tool-catalog.md - recommended for tool usage"
    fi
    
    print_check "Web research guide exists"
    if [ -f ".claude/tools/web-research.md" ]; then
        print_pass
    else
        print_warn "Missing web-research.md - recommended"
    fi
    
    print_check "MCP integration guide exists"
    if [ -f ".claude/tools/mcp-integration.md" ]; then
        print_pass
    else
        print_warn "Missing mcp-integration.md - optional"
    fi
}

validate_scripts() {
    print_section "Helper Scripts"
    
    local scripts=(
        "init-stack.sh"
        "import-company-standards.sh"
        "update-framework.sh"
        "validate-setup.sh"
    )
    
    for script in "${scripts[@]}"; do
        print_check "$script exists"
        if [ -f "scripts/$script" ]; then
            if [ -x "scripts/$script" ]; then
                print_pass
            else
                print_warn "scripts/$script is not executable - run: chmod +x scripts/$script"
            fi
        else
            print_warn "Missing scripts/$script"
        fi
    done
}

validate_gitignore() {
    print_section "Git Configuration"
    
    print_check ".gitignore exists"
    if [ -f ".gitignore" ]; then
        print_pass
        
        print_check "Your-stack is NOT in .gitignore (should be committed)"
        if grep -q ".claude/your-stack" .gitignore; then
            print_fail ".claude/your-stack/ is in .gitignore but should be committed!"
            print_info "Remove from .gitignore - customizations should be part of your project"
        else
            print_pass
            print_info "Customizations will be committed to your project (correct!)"
        fi
    else
        print_warn "No .gitignore found"
    fi
    
    print_check "Git repository initialized"
    if [ -d ".git" ]; then
        print_pass
    else
        print_warn "Not a git repository - run: git init"
    fi
}

validate_permissions() {
    print_section "File Permissions"
    
    print_check "Scripts are executable"
    if [ -d "scripts" ]; then
        non_executable=$(find scripts -name "*.sh" ! -executable | wc -l)
        if [ $non_executable -eq 0 ]; then
            print_pass
        else
            print_warn "$non_executable script(s) not executable"
            print_info "Run: chmod +x scripts/*.sh"
        fi
    else
        print_warn "No scripts directory found"
    fi
}

check_for_issues() {
    print_section "Common Issues"
    
    # Check for old structure
    print_check "No legacy .claude-instructions"
    if [ -d ".claude-instructions" ] || [ -d ".github/claude" ]; then
        print_warn "Found old framework structure - consider migrating"
        print_info "Old .claude-instructions or .github/claude directories detected"
    else
        print_pass
    fi
    
    # Check for conflicting files
    print_check "No conflicting CLAUDE.md files"
    claude_files=$(find . -name "CLAUDE.md" -not -path "./.claude/*" | wc -l)
    if [ $claude_files -eq 0 ]; then
        print_pass
    else
        print_warn "Found $claude_files CLAUDE.md file(s) outside .claude/"
        print_info "May cause confusion - consider removing or moving them"
    fi
    
    # Check stack-config syntax
    print_check "Stack config YAML is valid"
    if [ -f ".claude/your-stack/stack-config.yaml" ]; then
        if command -v yamllint &> /dev/null; then
            if yamllint -d relaxed .claude/your-stack/stack-config.yaml &> /dev/null; then
                print_pass
            else
                print_fail "YAML syntax errors in stack-config.yaml"
            fi
        else
            print_warn "yamllint not installed - cannot validate YAML syntax"
            print_info "Install with: pip install yamllint"
        fi
    fi
}

suggest_next_steps() {
    print_section "Recommended Next Steps"
    
    echo ""
    
    if [ $FAILED_CHECKS -gt 0 ]; then
        echo "  Critical issues found. Recommended actions:"
        echo ""
        
        if [ ! -f ".claude/your-stack/stack-config.yaml" ]; then
            echo "  1. Run initialization script:"
            echo "     ./scripts/init-stack.sh"
            echo ""
        fi
        
        if [ ! -d ".claude/commands" ] || [ $FAILED_CHECKS -gt 3 ]; then
            echo "  2. Re-clone framework or run update:"
            echo "     ./scripts/update-framework.sh"
            echo ""
        fi
    fi
    
    if [ $WARNING_CHECKS -gt 0 ]; then
        echo "  Improvements suggested:"
        echo ""
        
        if [ ! -d ".claude/your-stack/coding-standards" ] || [ $(find .claude/your-stack/coding-standards -type f 2>/dev/null | wc -l) -eq 0 ]; then
            echo "  • Generate standards for your stack:"
            echo "    Use /research-stack command in Claude"
            echo ""
        fi
        
        if grep -q ".claude/your-stack" .gitignore 2>/dev/null; then
            echo "  • Remove your-stack from .gitignore (it should be committed):"
            echo "    sed -i.bak '/\.claude\/your-stack\//d' .gitignore"
            echo ""
        fi
        
        if [ -d "scripts" ] && [ $(find scripts -name "*.sh" ! -executable | wc -l) -gt 0 ]; then
            echo "  • Make scripts executable:"
            echo "    chmod +x scripts/*.sh"
            echo ""
        fi
    fi
    
    if [ $FAILED_CHECKS -eq 0 ] && [ $WARNING_CHECKS -eq 0 ]; then
        echo "  Your setup looks great! You're ready to:"
        echo ""
        echo "  1. Start a new task:"
        echo "     Use /start-task command in Claude"
        echo ""
        echo "  2. Learn about your framework:"
        echo "     Use /learn command in Claude"
        echo ""
        echo "  3. Generate a PRD:"
        echo "     Use /create-prd command in Claude"
        echo ""
    fi
}

# Main validation
main() {
    print_header
    
    echo "Validating your Claude Development Framework setup..."
    
    # Run all validations
    validate_directory_structure
    validate_core_files
    validate_commands
    validate_stack_config
    validate_standards
    validate_workflows
    validate_tools
    validate_scripts
    validate_gitignore
    validate_permissions
    check_for_issues
    
    # Print summary
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Validation Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  Total Checks:    $TOTAL_CHECKS"
    echo -e "  ${GREEN}Passed:${NC}          $PASSED_CHECKS"
    if [ $WARNING_CHECKS -gt 0 ]; then
        echo -e "  ${YELLOW}Warnings:${NC}        $WARNING_CHECKS"
    fi
    if [ $FAILED_CHECKS -gt 0 ]; then
        echo -e "  ${RED}Failed:${NC}          $FAILED_CHECKS"
    fi
    echo ""
    
    # Calculate percentage
    if [ $TOTAL_CHECKS -gt 0 ]; then
        percentage=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
        echo "  Health Score:    $percentage%"
        echo ""
        
        if [ $percentage -ge 90 ]; then
            echo -e "  ${GREEN}✓ Excellent! Your setup is in great shape.${NC}"
        elif [ $percentage -ge 70 ]; then
            echo -e "  ${YELLOW}⚠ Good, but some improvements recommended.${NC}"
        else
            echo -e "  ${RED}✗ Issues detected. Please review and fix.${NC}"
        fi
    fi
    
    # Suggest next steps
    suggest_next_steps
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Exit code based on failures
    if [ $FAILED_CHECKS -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main
