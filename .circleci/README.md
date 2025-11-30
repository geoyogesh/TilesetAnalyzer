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

The `config.yml` defines three main jobs:

1. **build-and-test**: Install dependencies, build frontend, run tests
2. **semantic-release**: Analyze commits, bump version, create release
3. **publish-pypi**: Upload package to PyPI

### Workflow

```
Push to main
    ↓
build-and-test
    ↓
semantic-release (determines version from commits)
    ↓
publish-pypi (uploads to PyPI)
```

## Environment Variables

Required environment variables (configured in CircleCI contexts):

| Variable | Context | Purpose |
|----------|---------|---------|
| `GITHUB_TOKEN` | semantic-release | Create GitHub releases |
| `PYPI_API_TOKEN` | pypi-publish | Upload to PyPI |

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
