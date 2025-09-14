# Security Policy

## Overview

This project implements a comprehensive security framework to prevent common vulnerabilities and maintain code quality.

## Security Framework Components

### 1. NPM Security (`scripts/hooks/npm-hardening-guard.sh`)
- **Automatic dependency auditing** with `npm audit`
- **High-risk package monitoring** for compromised packages
- **Package integrity validation** before installation
- **Vulnerability reporting** with recommended fixes

**High-risk packages monitored:**
- chalk, debug, ansi-styles, supports-color, strip-ansi
- color-convert, color-name

### 2. Pre-commit Security (`scripts/hooks/pre-commit`)
- **Secret detection** for API keys, tokens, and credentials
- **File permission validation** and auto-correction
- **Large file prevention** (>10MB blocked)
- **Security pattern matching** for common vulnerabilities

**Secret patterns detected:**
- AWS Access Keys (`AKIA[0-9A-Z]{16}`)
- OpenAI API Keys (`sk-[a-zA-Z0-9]{24,}`)
- Google API Keys (`AIza[0-9A-Za-z\\-_]{35}`)
- GitHub Personal Access Tokens (`ghp_[A-Za-z0-9_]{36}`)
- Database connection strings
- Private keys (PEM format)

### 3. Documentation Security (`scripts/sanitize-docs.sh`)
- **ANSI escape code removal** from generated documentation
- **Markdown formatting validation** and correction
- **Sensitive information filtering** from project structure listings
- **URL sanitization** and proper formatting

## Current Security Status

### Known Vulnerabilities
⚠️ **Moderate severity vulnerabilities detected:**
- `esbuild <=0.24.2` - Development server request vulnerability
- `vite <=6.1.6` - Depends on vulnerable esbuild version

**Recommended action:** Run `npm audit fix --force` after testing breaking changes.

### Security Measures Active
✅ **NPM hardening guard** - Monitors package installations
✅ **Pre-commit security hooks** - Prevents unsafe commits
✅ **Documentation sanitization** - Removes sensitive data
✅ **Git workflow standardization** - Prevents configuration conflicts

## Using the Security Framework

### Daily Development
```bash
# Install dependencies securely
npm install && ./scripts/hooks/npm-hardening-guard.sh

# Make secure commits
git add .
git secure-commit -m "Your commit message"

# Clean documentation before PRs
git clean-docs
```

### Security Validation
```bash
# Run full security audit
./scripts/hooks/npm-hardening-guard.sh

# Check for secrets in staged files
./scripts/hooks/pre-commit

# Sanitize all documentation
./scripts/sanitize-docs.sh
```

### Git Aliases Available
- `git audit` - Run npm security validation
- `git secure-commit` - Commit with security checks
- `git clean-docs` - Sanitize documentation

## Vulnerability Reporting

### For Security Issues
If you discover a security vulnerability, please:

1. **DO NOT** create a public GitHub issue
2. Email security details to the maintainers
3. Include steps to reproduce the vulnerability
4. Allow reasonable time for fixing before disclosure

### For False Positives
If the security scripts incorrectly flag legitimate code:

1. Create a GitHub issue with the "security" label
2. Include the exact error message and context
3. Suggest improvements to the detection patterns

## Security Best Practices

### For Developers
- Always run `git audit` before installing new packages
- Use `git secure-commit` for commits containing sensitive changes
- Keep dependencies updated with regular `npm audit` checks
- Follow the standardized git workflow in `.gitconfig`

### For CI/CD
- Run security validation in all pipeline stages
- Block deployments on security failures
- Maintain separate security testing environments
- Regular dependency vulnerability scanning

### For Deployment
- Never commit real API keys or credentials
- Use environment variables for sensitive configuration
- Enable additional security headers in production
- Monitor for supply chain attacks

## Maintenance

### Regular Tasks
- **Weekly:** Review npm audit results and update dependencies
- **Monthly:** Update high-risk package monitoring list
- **Quarterly:** Review and update secret detection patterns

### Emergency Response
1. **Immediate:** Stop using compromised packages
2. **Short-term:** Implement workarounds or patches
3. **Long-term:** Update to secure versions and audit impact

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NPM Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [GitHub Security Features](https://github.com/features/security)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)

---

**Last Updated:** 2025-09-15
**Security Framework Version:** 1.0
**Contact:** See repository maintainers for security reports