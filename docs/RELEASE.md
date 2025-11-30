# Release Process

This document describes how to create new releases for TilesetAnalyzer.

## Quick Start

### Local Release (Recommended)

```bash
# Patch release (0.1.0 -> 0.1.1)
./scripts/release.sh

# Minor release (0.1.0 -> 0.2.0)
./scripts/release.sh minor

# Major release (0.1.0 -> 1.0.0)
./scripts/release.sh major

# Dry run to preview changes
./scripts/release.sh --dry-run minor
```

### GitHub Actions Release

```bash
# Trigger via CLI
./scripts/release.sh --github minor

# Or manually via GitHub UI
# Go to: Actions → "Create a new release" → Run workflow
# Select version bump type: patch/minor/major
```

## Version Bump Types

- **Patch** (0.1.0 → 0.1.1): Bug fixes, small changes
- **Minor** (0.1.0 → 0.2.0): New features, backwards-compatible changes
- **Major** (0.1.0 → 1.0.0): Breaking changes

## What Happens During a Release

The automated release process performs the following steps:

1. **Fetch Current Version**: Gets the latest release tag from GitHub
2. **Calculate New Version**: Bumps the version based on the selected type
3. **Update setup.py**: Changes the version string in `setup.py`
4. **Commit & Push**: Commits the change with message `chore: bump version to X.Y.Z`
5. **Create GitHub Release**: Creates a new release with auto-generated release notes
6. **Trigger PyPI Publication**: GitHub Actions automatically publishes to PyPI

## Local Release Script

The `scripts/release.sh` script provides a convenient way to create releases:

### Options

```bash
Usage: ./scripts/release.sh [OPTIONS] [BUMP_TYPE]

BUMP_TYPE:
    patch   Bump patch version (0.1.0 -> 0.1.1) [default]
    minor   Bump minor version (0.1.0 -> 0.2.0)
    major   Bump major version (0.1.0 -> 1.0.0)

OPTIONS:
    -h, --help      Show help message
    -d, --dry-run   Preview changes without executing
    -g, --github    Trigger GitHub Actions workflow instead
```

### Examples

```bash
# Create a patch release
./scripts/release.sh

# Create a minor release
./scripts/release.sh minor

# Preview what a major release would do
./scripts/release.sh --dry-run major

# Trigger minor release via GitHub Actions
./scripts/release.sh --github minor
```

## Manual Release (Not Recommended)

If you need to create a release manually:

1. Update version in `setup.py`:
   ```python
   version='0.2.0',
   ```

2. Commit and push:
   ```bash
   git add setup.py
   git commit -m "chore: bump version to 0.2.0"
   git push
   ```

3. Create GitHub release:
   ```bash
   gh release create 0.2.0 --generate-notes
   ```

4. PyPI publication happens automatically via GitHub Actions

## GitHub Actions Workflows

### `.github/workflows/release.yml`

Creates a new release on GitHub. Can be triggered:
- Manually via GitHub UI (Actions tab)
- Via GitHub CLI: `gh workflow run release.yml -f bump_type=minor`
- Via local script: `./scripts/release.sh --github minor`

**Inputs:**
- `bump_type`: Version bump type (patch/minor/major)

### `.github/workflows/publish.yml`

Publishes the package to PyPI. Automatically triggered when a release is published.

**Steps:**
1. Builds the frontend React app
2. Builds the Python package
3. Publishes to PyPI using `PYPI_API_TOKEN` secret

## Prerequisites

### Local Development

- Git
- Python 3.9+
- GitHub CLI (`gh`)
- Clean working directory (no uncommitted changes)

### GitHub Secrets

The following secrets must be configured in repository settings:

- `PERSONAL_ACCESS_TOKEN`: GitHub token for creating releases
- `PYPI_API_TOKEN`: PyPI token for package publication

## Monitoring Releases

After creating a release:

1. **GitHub Release**:
   - View at: `https://github.com/geoyogesh/TilesetAnalyzer/releases`

2. **GitHub Actions**:
   - Monitor workflow: `https://github.com/geoyogesh/TilesetAnalyzer/actions`
   - Check for successful PyPI publication

3. **PyPI Package**:
   - Verify at: `https://pypi.org/project/tileset-analyzer/`

## Troubleshooting

### Release Script Fails

**Working directory not clean:**
```bash
# Stash or commit your changes first
git stash
./scripts/release.sh
```

**GitHub CLI not authenticated:**
```bash
gh auth login
```

### PyPI Publication Fails

Check GitHub Actions logs:
```bash
gh run list --limit 5
gh run view <run-id> --log
```

Common issues:
- Invalid `PYPI_API_TOKEN`
- Frontend build failure (check Node.js version)
- Version already exists on PyPI

### Version Conflicts

If `setup.py` version doesn't match the latest release:
```bash
# Check current versions
gh release view --json tagName
grep "version=" setup.py

# Manually sync if needed
```

## Best Practices

1. **Always use semantic versioning** (major.minor.patch)
2. **Test locally before releasing** with `--dry-run`
3. **Keep CHANGELOG.md updated** with notable changes
4. **Monitor GitHub Actions** after creating a release
5. **Verify PyPI publication** completes successfully
6. **Use descriptive commit messages** for release commits

## Release Checklist

- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Working directory is clean
- [ ] Choose correct version bump type
- [ ] Run release script
- [ ] Monitor GitHub Actions
- [ ] Verify PyPI publication
- [ ] Test installation: `pip install -U tileset-analyzer`
- [ ] Announce release (if applicable)
