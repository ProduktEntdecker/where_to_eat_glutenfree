# Development Guide

This document outlines the development standards, security practices, and workflows for this project.

## Quick Setup

```bash
# Enable project-specific git configuration
git config --local include.path ../.gitconfig

# Install dependencies with security validation
npm install

# Run security audit
./scripts/hooks/npm-hardening-guard.sh

# Start development
npm run dev
```

## Security Framework

### NPM Security
- **Automatic security audits** before commits
- **High-risk package monitoring** (chalk, debug, ansi-styles, etc.)
- **Dependency validation** with npm audit

### Git Security
- **Secret detection** in commits
- **File permission validation**
- **Large file prevention** (>10MB blocked)

### Security Scripts
- `scripts/hooks/npm-hardening-guard.sh` - NPM security validation
- `scripts/hooks/pre-commit` - Pre-commit security checks
- `scripts/sanitize-docs.sh` - Documentation cleanup

## Development Workflow

### Git Workflow
1. **Create feature branch**: `git checkout -b feature/description`
2. **Make changes** with frequent commits
3. **Run security checks**: `git audit`
4. **Clean documentation**: `git clean-docs`
5. **Secure commit**: `git secure-commit -m "message"`
6. **Push and create PR**: Standard GitHub flow

### Commit Standards
- Use the provided commit message template (`.gitmessage`)
- Include clear what/why explanations
- Reference related issues/PRs
- Include Co-authored-by for collaboration

### Code Quality
- **TypeScript strict mode** enabled
- **ESLint** for code style
- **Security-first** development approach
- **Documentation** for all public APIs

## Error Prevention

### Common Issues Fixed
1. **ANSI escape codes in docs** → Auto-sanitization
2. **Missing security scripts** → Complete security framework
3. **Git workflow conflicts** → Standardized configuration
4. **Unsafe package installations** → Hardening guards

### Best Practices
- Always run `npm audit` before installing packages
- Use `git secure-commit` for sensitive changes
- Run `./scripts/sanitize-docs.sh` before documentation PRs
- Test locally before pushing

## Security Monitoring

### High-Risk Packages
The following packages are monitored for security issues:
- chalk, debug, ansi-styles, supports-color, strip-ansi
- color-convert, color-name

### Secret Patterns Detected
- AWS Access Keys, Google API Keys, OpenAI Keys
- GitHub Personal Access Tokens
- Database connection strings
- Private keys (PEM format)

## Troubleshooting

### Security Script Failures
```bash
# Make scripts executable
chmod +x scripts/hooks/*.sh scripts/*.sh

# Run individual checks
./scripts/hooks/npm-hardening-guard.sh
./scripts/hooks/pre-commit
```

### Git Configuration Issues
```bash
# Reset git configuration
git config --local --unset include.path
git config --local include.path ../.gitconfig
```

### Documentation Issues
```bash
# Clean all documentation
./scripts/sanitize-docs.sh

# Manual ANSI code removal
sed -i 's/\x1b\[[0-9;]*m//g' filename.md
```

## Contributing

1. Follow the security framework guidelines
2. Use the standardized git workflow
3. Include comprehensive commit messages
4. Run all security checks before submitting PRs
5. Ensure documentation is clean and properly formatted

## Resources

- [Project Security Policy](../SECURITY.md)
- [Git Commit Guidelines](../.gitmessage)
- [NPM Security Best Practices](<https://docs.npmjs.com/security-best-practices)>