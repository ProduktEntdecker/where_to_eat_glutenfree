#!/usr/bin/env bash

# Documentation Sanitizer
# Removes ANSI escape codes and cleans up generated documentation
# Usage: ./sanitize-docs.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}📝 $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

sanitize_ansi_codes() {
    local file="$1"

    # Remove ANSI escape codes using sed
    # Matches: \033[...m or \e[...m or [0;32m etc.
    sed -i.bak 's/\x1b\[[0-9;]*m//g' "$file"
    sed -i.bak 's/\[0;[0-9]*m//g' "$file"
    sed -i.bak 's/\[1;[0-9]*m//g' "$file"
    sed -i.bak 's/\[[0-9]*m//g' "$file"

    # Remove the backup file
    rm -f "${file}.bak"

    log_info "Sanitized ANSI codes from $file"
}

fix_markdown_formatting() {
    local file="$1"

    # Fix common markdown issues
    # Add blank lines before horizontal rules
    sed -i.bak 's/^---$/\n---/' "$file"

    # Wrap bare URLs in angle brackets
    sed -i.bak 's|^\(.*\)https://\([^[:space:]]*\)\(.*\)$|\1<https://\2>\3|g' "$file"

    # Remove italic formatting from timestamp lines
    sed -i.bak 's/\*Last Updated: \([^*]*\)\*/Last updated: \1/' "$file"

    # Remove the backup file
    rm -f "${file}.bak"

    log_info "Fixed markdown formatting in $file"
}

clean_project_structure() {
    local file="$1"

    # Remove volatile entries from project structure listings
    if grep -q "node_modules" "$file"; then
        log_warn "Removing node_modules entries from $file"
        sed -i.bak '/node_modules/d' "$file"
        sed -i.bak '/dist\//d' "$file"
        rm -f "${file}.bak"
    fi
}

main() {
    log_info "Starting documentation sanitization"

    # Find all markdown files
    local md_files
    md_files=$(find "$PROJECT_ROOT" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*")

    if [[ -z "$md_files" ]]; then
        log_warn "No markdown files found"
        return 0
    fi

    while IFS= read -r file; do
        log_info "Processing $file"

        # Create backup
        cp "$file" "${file}.original"

        # Apply sanitization
        sanitize_ansi_codes "$file"
        fix_markdown_formatting "$file"
        clean_project_structure "$file"

        # Check if file changed
        if ! cmp -s "$file" "${file}.original"; then
            log_info "✅ Sanitized $file"
        else
            log_info "✅ No changes needed for $file"
        fi

        # Remove backup
        rm -f "${file}.original"

    done <<< "$md_files"

    log_info "Documentation sanitization completed"
}

# Allow script to be sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi