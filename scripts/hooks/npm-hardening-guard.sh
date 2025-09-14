#!/usr/bin/env bash

# NPM Security Hardening Guard
# Prevents installation of compromised packages and validates security
# Usage: ./npm-hardening-guard.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# High-risk packages to monitor (as of Sept 2025)
HIGH_RISK_PACKAGES=(
    "chalk"
    "debug"
    "ansi-styles"
    "supports-color"
    "strip-ansi"
    "color-convert"
    "color-name"
)

check_package_integrity() {
    local package="$1"

    # Check if package is in high-risk list
    for risk_pkg in "${HIGH_RISK_PACKAGES[@]}"; do
        if [[ "$package" == *"$risk_pkg"* ]]; then
            log_warn "High-risk package detected: $package"
            return 1
        fi
    done

    return 0
}

audit_dependencies() {
    log_info "Running npm security audit..."

    cd "$PROJECT_ROOT"

    # Get audit output
    local audit_output
    audit_output=$(npm audit --json 2>/dev/null || true)

    # Check for high/critical vulnerabilities only
    local high_vulns
    high_vulns=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")
    local critical_vulns
    critical_vulns=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")

    if [[ "$high_vulns" -gt 0 || "$critical_vulns" -gt 0 ]]; then
        log_error "High/Critical vulnerabilities detected: High($high_vulns) Critical($critical_vulns)"
        npm audit --audit-level=high
        return 1
    fi

    # For moderate vulnerabilities, show warning but don't fail
    local moderate_vulns
    moderate_vulns=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.moderate // 0' 2>/dev/null || echo "0")
    if [[ "$moderate_vulns" -gt 0 ]]; then
        log_warn "Moderate vulnerabilities detected ($moderate_vulns) - consider running 'npm audit fix'"
        npm audit --audit-level=moderate
    fi

    log_info "npm audit passed (no high/critical vulnerabilities)"
    return 0
}

check_package_lock() {
    if [[ ! -f "$PROJECT_ROOT/package-lock.json" ]]; then
        log_warn "package-lock.json not found - recommend running 'npm install'"
        return 1
    fi

    # Check for suspicious modifications
    if git status --porcelain "$PROJECT_ROOT/package-lock.json" | grep -q "M"; then
        log_warn "package-lock.json has been modified"
    fi

    return 0
}

main() {
    log_info "NPM Security Hardening Guard - Starting validation"

    local exit_code=0

    # Check package lock
    if ! check_package_lock; then
        exit_code=1
    fi

    # Run security audit
    if ! audit_dependencies; then
        exit_code=1
    fi

    # Check for high-risk packages in package.json
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        while IFS= read -r line; do
            for risk_pkg in "${HIGH_RISK_PACKAGES[@]}"; do
                if echo "$line" | grep -q "\"$risk_pkg\""; then
                    log_warn "High-risk package found in package.json: $risk_pkg"
                    exit_code=1
                fi
            done
        done < "$PROJECT_ROOT/package.json"
    fi

    if [[ $exit_code -eq 0 ]]; then
        log_info "NPM security validation completed successfully"
    else
        log_error "NPM security validation failed"
    fi

    return $exit_code
}

# Allow script to be sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi