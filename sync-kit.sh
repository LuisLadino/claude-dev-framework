#!/bin/bash
set -euo pipefail

# ============================================
# sync-kit.sh — Sync claude-kit to projects
# ============================================
#
# Usage:
#   ./sync-kit.sh                          # Sync to all downstream projects
#   ./sync-kit.sh /path/to/project         # Sync to one project (update or fresh install)
#   ./sync-kit.sh --dry-run                # Show what would change
#   ./sync-kit.sh --dry-run /path/to/project
#
# What it syncs (kit-owned):
#   .claude/CLAUDE.md
#   .claude/hooks/
#   .claude/skills/
#   .claude/commands/
#   .claude/agents/
#
# What it NEVER touches (project-specific):
#   .claude/specs/
#   .claude/docs/
#   .claude/research/
#   .claude/session-state.json
#   .claude/current-context.json
#   .claude/settings.local.json
#   .claude/last-evaluated-commit
#   Any files in kit-owned dirs that weren't synced by this script
#
# Deletion safety:
#   Uses .kit-manifest to track what was synced. Only deletes files
#   that were previously synced but no longer exist in the kit source.
#   Project-created files in hooks/, skills/, commands/, agents/ are safe.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_DIR="$SCRIPT_DIR/.claude"

# Kit-owned directories (synced)
KIT_DIRS=(
  "hooks"
  "skills"
  "commands"
  "agents"
)

# Kit-owned files (synced individually)
KIT_FILES=(
  "CLAUDE.md"
)

# Manifest file name (written to each project's .claude/)
MANIFEST_NAME=".kit-manifest"

# Protected file patterns — NEVER deleted or synced, even if asked
# Covers credentials, secrets, env files, MCP keys, local config
PROTECTED_PATTERNS=(
  "*.credentials"
  "*.credentials.*"
  "*.secret"
  "*.secrets"
  "*.keys"
  "*.key"
  "*.pem"
  "*.env"
  "*.env.*"
  "*.local.json"
  "mcp-*"
  "*.token"
  "*.tokens"
)

# Downstream projects (edit this list to add/remove projects)
DOWNSTREAM=(
  "$HOME/Repositories/Personal/my-brain"
  "$HOME/Repositories/Personal/voir"
  "$HOME/Repositories/Personal/airedteaming-site"
  "$HOME/Repositories/Personal/adversarial-design-thinking"
  "$HOME/Repositories/Personal/design/PortfolioSite/site"
  "$HOME/Repositories/Personal/space-names"
  "$HOME/Repositories/Personal/heading-site"
  "$HOME/Repositories/Work/red-team-ops"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DRY_RUN=false

# ============================================
# Functions
# ============================================

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err() { echo -e "${RED}[ERROR]${NC} $1"; }
log_dry() { echo -e "${YELLOW}[DRY RUN]${NC} $1"; }

# Check if a file matches any protected pattern
is_protected() {
  local filename="$(basename "$1")"
  for pattern in "${PROTECTED_PATTERNS[@]}"; do
    # Use bash pattern matching
    if [[ "$filename" == $pattern ]]; then
      return 0
    fi
  done
  return 1
}

# Build list of all kit source files (relative to .claude/)
build_source_manifest() {
  local manifest=()

  for dir in "${KIT_DIRS[@]}"; do
    if [ -d "$KIT_DIR/$dir" ]; then
      while IFS= read -r -d '' file; do
        manifest+=("${file#$KIT_DIR/}")
      done < <(find "$KIT_DIR/$dir" -type f -print0)
    fi
  done

  for file in "${KIT_FILES[@]}"; do
    if [ -f "$KIT_DIR/$file" ]; then
      manifest+=("$file")
    fi
  done

  printf '%s\n' "${manifest[@]}" | sort
}

# Read previous manifest from a project
read_manifest() {
  local manifest_path="$1/$MANIFEST_NAME"
  if [ -f "$manifest_path" ]; then
    sort "$manifest_path"
  fi
}

# Write manifest to a project
write_manifest() {
  local manifest_path="$1/$MANIFEST_NAME"
  local source_manifest="$2"
  if ! $DRY_RUN; then
    echo "$source_manifest" > "$manifest_path"
  fi
}

sync_project() {
  local project_path="$1"
  local project_name="$(basename "$project_path")"
  local target_dir="$project_path/.claude"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if $DRY_RUN; then
    log_info "DRY RUN: $project_name ($project_path)"
  else
    log_info "Syncing: $project_name ($project_path)"
  fi
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Check project exists
  if [ ! -d "$project_path" ]; then
    log_err "Project directory not found: $project_path"
    return 1
  fi

  # Fresh install detection
  if [ ! -d "$target_dir" ]; then
    if $DRY_RUN; then
      log_dry "Fresh install — would create .claude/"
    else
      log_info "Fresh install — creating .claude/"
      mkdir -p "$target_dir"
    fi
  fi

  # Build current source manifest
  local source_manifest
  source_manifest="$(build_source_manifest)"

  # Read previous manifest (what we synced last time)
  local prev_manifest
  prev_manifest="$(read_manifest "$target_dir")"

  # Step 1: Copy all files from source (adds + updates)
  local copied=0
  local updated=0
  while IFS= read -r rel; do
    local src="$KIT_DIR/$rel"
    local dst="$target_dir/$rel"
    local dst_dir="$(dirname "$dst")"

    if [ ! -d "$dst_dir" ]; then
      if $DRY_RUN; then
        log_dry "Would create dir: .claude/$(dirname "$rel")/"
      else
        mkdir -p "$dst_dir"
      fi
    fi

    if [ ! -f "$dst" ]; then
      if $DRY_RUN; then
        log_dry "Would add: .claude/$rel"
      else
        cp "$src" "$dst"
      fi
      ((copied++))
    elif ! diff -q "$src" "$dst" > /dev/null 2>&1; then
      if $DRY_RUN; then
        log_dry "Would update: .claude/$rel"
      else
        cp "$src" "$dst"
      fi
      ((updated++))
    fi
  done <<< "$source_manifest"

  # Step 2: Handle deletions
  local deleted=0
  if [ -n "$prev_manifest" ]; then
    # SUBSEQUENT SYNC: delete files in prev manifest that are no longer in source
    # Project-created files are safe (never in manifest)
    # Protected files are never deleted even if in manifest
    while IFS= read -r rel; do
      if echo "$source_manifest" | grep -qxF "$rel"; then
        continue
      fi
      if is_protected "$rel"; then
        log_warn "Protected, skipping: .claude/$rel"
        continue
      fi

      local dst="$target_dir/$rel"
      if [ -f "$dst" ]; then
        if $DRY_RUN; then
          log_dry "Would delete (removed from kit): .claude/$rel"
        else
          rm "$dst"
        fi
        ((deleted++))
      fi
    done <<< "$prev_manifest"
  else
    # FIRST SYNC: no manifest exists. Note any unknown files but don't
    # block. They're either dead kit files or project customizations.
    # Either way, they're harmless — just not managed by the kit.
    local unknown_count=0
    for dir in "${KIT_DIRS[@]}"; do
      if [ -d "$target_dir/$dir" ]; then
        while IFS= read -r -d '' file; do
          local rel="${file#$target_dir/}"
          if ! echo "$source_manifest" | grep -qxF "$rel"; then
            ((unknown_count++))
          fi
        done < <(find "$target_dir/$dir" -type f -print0)
      fi
    done

    if [ $unknown_count -gt 0 ]; then
      log_info "$unknown_count unmanaged file(s) in kit dirs (use --cleanup to review)"
    fi
  fi

  # Clean up empty directories in kit-owned dirs
  if ! $DRY_RUN; then
    for dir in "${KIT_DIRS[@]}"; do
      if [ -d "$target_dir/$dir" ]; then
        find "$target_dir/$dir" -type d -empty -delete 2>/dev/null || true
      fi
    done
  fi

  # Write new manifest
  write_manifest "$target_dir" "$source_manifest"

  # Summary
  if [ $copied -gt 0 ] || [ $updated -gt 0 ] || [ $deleted -gt 0 ]; then
    local summary="+$copied added, ~$updated updated, -$deleted deleted"
    if $DRY_RUN; then
      log_dry "$summary"
    else
      log_ok "$summary"
    fi
  else
    log_ok "Already up to date"
  fi
}

# ============================================
# Main
# ============================================

# Parse args
TARGETS=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *) TARGETS+=("$arg") ;;
  esac
done

# Verify we're running from the kit repo
if [ ! -f "$KIT_DIR/CLAUDE.md" ]; then
  log_err "Cannot find .claude/CLAUDE.md. Run this script from the claude-kit repo root."
  exit 1
fi

echo "╔══════════════════════════════╗"
echo "║       claude-kit sync        ║"
echo "╚══════════════════════════════╝"

if $DRY_RUN; then
  log_warn "DRY RUN MODE — no files will be changed"
fi

if [ ${#TARGETS[@]} -gt 0 ]; then
  # Sync to specific project(s)
  for target in "${TARGETS[@]}"; do
    # Resolve relative paths
    target="$(cd "$target" 2>/dev/null && pwd || echo "$target")"
    sync_project "$target"
  done
else
  # Sync to all downstream projects
  log_info "Syncing to ${#DOWNSTREAM[@]} downstream projects"
  for project in "${DOWNSTREAM[@]}"; do
    sync_project "$project"
  done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if $DRY_RUN; then
  log_warn "Dry run complete. Run without --dry-run to apply changes."
else
  log_ok "All projects synced."
  echo ""
  echo "Next steps for fresh installs:"
  echo "  1. cd into the project"
  echo "  2. Open Claude Code"
  echo "  3. Run /init-project (define what you're building)"
  echo "  4. Run /sync-stack (detect stack, generate specs)"
fi
