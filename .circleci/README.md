# CircleCI Configuration

This directory contains the CircleCI configuration for automated testing and releases.

## Quick Links

- **CircleCI Dashboard**: https://app.circleci.com/pipelines/github/geoyogesh/TilesetAnalyzer
- **Setup Guide**: [../docs/CIRCLECI_SETUP.md](../docs/CIRCLECI_SETUP.md)
- **Release Process**: [../docs/RELEASE.md](../docs/RELEASE.md)

## Status Badge

Add this badge to your README.md:

```markdown
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/geoyogesh/TilesetAnalyzer/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/geoyogesh/TilesetAnalyzer/tree/main)
```

Preview:
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/geoyogesh/TilesetAnalyzer/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/geoyogesh/TilesetAnalyzer/tree/main)

## Configuration Overview

The `config.yml` defines four main jobs with **code quality as the gatekeeper**:

1. **code-quality** (GATEKEEPER): Runs `make verify` - fails build if code doesn't meet standards
2. **build-and-test**: Install dependencies, build frontend, verify artifacts, run tests
3. **semantic-release**: Analyze commits, bump version, create release (main branch only)
4. **publish-pypi**: Upload package to PyPI (main branch only)

### Workflow

```
Every Branch/PR:
    Push to any branch
        ↓
    code-quality (GATEKEEPER) ← make verify
        ├── Black: Python formatting check
        ├── Ruff: Python linting
        └── ESLint/Prettier: React code quality
        ❌ FAILS if code doesn't meet standards
        ↓ (only if quality passes)
    build-and-test
        ├── Build Python package
        ├── Build React application
        ├── Verify build artifacts
        └── Run tests
        ❌ FAILS if build or tests fail

Main Branch Only:
        ↓ (only on main branch)
    semantic-release
        ├── Determine version from commits
        ├── Update CHANGELOG.md
        ├── Create git tag
        └── Create GitHub release
        ↓
    publish-pypi
        └── Upload to PyPI
```

### Code Quality Gatekeeper

The **code-quality** job enforces standards on **every branch**:

- **Python**: `black --check` + `ruff check`
- **React**: `prettier --check` + `eslint`
- **Failure**: ❌ Entire pipeline stops immediately

Run locally before pushing:
```bash
make verify  # Check code quality (fails if issues)
make check   # Auto-fix formatting/linting issues
```

## Python Version

This project requires Python 3.10 or higher. The CircleCI configuration uses Python 3.11.

## Environment Variables

Required environment variables (configured in CircleCI project settings):

| Variable         | Purpose                              |
| ---------------- | ------------------------------------ |
| `GITHUB_TOKEN`   | Create GitHub releases and push tags |
| `PYPI_API_TOKEN` | Upload packages to PyPI              |

**Setup**: Project Settings → Environment Variables → Add Environment Variable

## Local Testing

Validate configuration:

```bash
# Install CircleCI CLI
brew install circleci

# Validate config
circleci config validate

# Process config (expand orbs)
circleci config process .circleci/config.yml

# Run job locally (requires Docker)
circleci local execute --job build-and-test
```

## Customization

Edit `config.yml` to:

- Add test commands
- Configure linting
- Add code coverage
- Set up notifications
- Adjust caching strategy

See [CIRCLECI_SETUP.md](../docs/CIRCLECI_SETUP.md#customization) for examples.

## Troubleshooting

Common issues:

1. **Build fails**: Check CircleCI logs
2. **Secrets not found**: Verify context configuration
3. **Cache issues**: Clear cache in CircleCI UI
4. **Permission errors**: Check GITHUB_TOKEN scopes

See [CIRCLECI_SETUP.md](../docs/CIRCLECI_SETUP.md#troubleshooting) for detailed troubleshooting.

## Support

- [CircleCI Documentation](https://circleci.com/docs/)
- [CircleCI Support](https://support.circleci.com/)
- [Project Setup Guide](../docs/CIRCLECI_SETUP.md)
