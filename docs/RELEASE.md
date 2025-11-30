# Release Process

TilesetAnalyzer uses [Python Semantic Release](https://python-semantic-release.readthedocs.io/) to automate versioning and releases based on [Conventional Commits](https://www.conventionalcommits.org/).

## Quick Start

### Automatic Release (Recommended)

Releases are **automatically created** when commits are pushed to the `main` branch:

```bash
# Make changes and commit using conventional commits
git add .
git commit -m "feat: add new tile processing algorithm"
git push origin main

# Semantic Release automatically:
# 1. Analyzes commits since last release
# 2. Determines version bump (major/minor/patch)
# 3. Updates version in code
# 4. Generates CHANGELOG
# 5. Creates GitHub release
# 6. Publishes to PyPI
```

### Manual Trigger

You can also manually trigger a release:

```bash
# Via GitHub UI
# Go to: Actions → "Semantic Release" → Run workflow

# Via GitHub CLI
gh workflow run semantic-release.yml
```

## Conventional Commits

Version bumps are determined by commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types and Version Bumps

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `feat:` | **Minor** (0.1.0 → 0.2.0) | `feat: add vector tile compression` |
| `fix:` | **Patch** (0.1.0 → 0.1.1) | `fix: resolve memory leak in tile parser` |
| `perf:` | **Patch** (0.1.0 → 0.1.1) | `perf: optimize tile rendering` |
| `BREAKING CHANGE:` | **Major** (0.1.0 → 1.0.0) | See below |

### Other Commit Types (No Version Bump)

These types don't trigger releases but appear in the changelog:

- `build:` - Build system changes
- `chore:` - Maintenance tasks
- `ci:` - CI configuration changes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests

### Breaking Changes (Major Version Bump)

To trigger a major version bump, include `BREAKING CHANGE:` in the commit footer:

```bash
git commit -m "feat: redesign API interface

BREAKING CHANGE: The analyze() method now returns a dict instead of a list.
Migration guide: Convert list access to dict access using tile IDs as keys."
```

Or use the `!` notation:

```bash
git commit -m "feat!: remove deprecated process_tiles method"
```

## Examples

### Adding a New Feature (Minor Bump)

```bash
git add .
git commit -m "feat(parser): add support for MVT 3.0 format"
git push origin main
# → Version bumps from 0.1.0 to 0.2.0
```

### Fixing a Bug (Patch Bump)

```bash
git add .
git commit -m "fix(compression): handle gzip decompression errors"
git push origin main
# → Version bumps from 0.2.0 to 0.2.1
```

### Breaking Change (Major Bump)

```bash
git add .
git commit -m "feat!: change tile coordinate system to TMS

BREAKING CHANGE: Default coordinate system changed from XYZ to TMS.
Update your code to use --scheme XYZ for backward compatibility."
git push origin main
# → Version bumps from 0.2.1 to 1.0.0
```

### No Release

```bash
git add .
git commit -m "docs: update installation instructions"
git push origin main
# → No version bump, no release
```

## How It Works

### Automated Release Workflow

1. **Commit Analysis**: Scans commits since the last release
2. **Version Calculation**: Determines next version based on commit types:
   - `BREAKING CHANGE:` or `!` → Major bump
   - `feat:` → Minor bump
   - `fix:`, `perf:` → Patch bump
   - Others → No release
3. **Version Update**: Updates version in:
   - `tileset_analyzer/__init__.py`
   - `setup.py` (via dynamic reading)
4. **Changelog Generation**: Updates `CHANGELOG.md` with grouped commits
5. **Git Operations**:
   - Commits version changes
   - Creates git tag (e.g., `v0.2.0`)
   - Pushes to GitHub
6. **GitHub Release**: Creates release with auto-generated notes
7. **PyPI Publication**: Builds and publishes package to PyPI

### Configuration

Python Semantic Release is configured in `pyproject.toml`:

```toml
[tool.semantic_release]
version_variables = ["tileset_analyzer/__init__.py:__version__"]
branch = "main"
upload_to_pypi = false  # Handled separately by GitHub Actions
build_command = "pip install build && python -m build"
```

## Local Development

### Testing Before Release

```bash
# Install semantic-release locally
pip install python-semantic-release

# Preview next version (dry-run)
semantic-release version --print

# Preview changelog
semantic-release changelog --unreleased
```

### Manual Version Bump (Not Recommended)

If needed, you can manually bump the version:

```bash
# Install semantic-release
pip install python-semantic-release

# Bump version manually
semantic-release version --patch  # or --minor, --major

# Or edit directly
echo '__version__ = "0.2.0"' > tileset_analyzer/__init__.py
```

## Monitoring Releases

### Check Release Status

```bash
# View recent releases
gh release list --limit 5

# View latest release
gh release view

# Check workflow runs
gh run list --workflow=semantic-release.yml --limit 5
```

### GitHub Actions Dashboard

Monitor releases at:
- **Workflows**: `https://github.com/geoyogesh/TilesetAnalyzer/actions`
- **Releases**: `https://github.com/geoyogesh/TilesetAnalyzer/releases`
- **PyPI**: `https://pypi.org/project/tileset-analyzer/`

## Legacy Release Scripts

The repository also includes legacy manual release scripts:

### Local Script

```bash
# Still available for manual releases
./scripts/release.sh [patch|minor|major]
./scripts/release.sh --dry-run minor
```

### GitHub Workflow

The old workflow (`.github/workflows/release.yml`) is preserved but **Semantic Release is now preferred**.

## Best Practices

### Commit Message Guidelines

1. **Use imperative mood**: "add feature" not "added feature"
2. **Be specific**: "fix: resolve null pointer in tile parser" not "fix: bug fix"
3. **Include scope when helpful**: `feat(api):`, `fix(ui):`, `perf(core):`
4. **Keep first line under 72 characters**
5. **Use body for detailed explanations**
6. **Reference issues**: `Fixes #123`, `Closes #456`

### Good Examples

```bash
feat(analyzer): add multi-threaded tile processing

Implement parallel processing for tile analysis to improve
performance on large tilesets. Uses ThreadPoolExecutor with
configurable worker count.

Performance: ~3x faster on tilesets with >10k tiles
```

```bash
fix(server): prevent memory leak in long-running sessions

Release tile data after processing to avoid memory buildup.
Adds proper cleanup in the request handler.

Fixes #142
```

### Bad Examples

```bash
# Too vague
git commit -m "fix stuff"

# Missing type
git commit -m "updated the parser"

# Wrong type (should be feat)
git commit -m "docs: add new feature"
```

## Troubleshooting

### No Release Created

**Possible causes:**
1. No commits with `feat:`, `fix:`, or `BREAKING CHANGE:` since last release
2. Only commits with types like `docs:`, `chore:`, `style:`
3. Workflow failed (check GitHub Actions logs)

**Solution:**
```bash
# Check what commits would trigger a release
semantic-release version --print

# View unreleased changes
semantic-release changelog --unreleased
```

### Version Conflict

If manual version edits conflict with semantic-release:

```bash
# Reset to semantic-release version
git fetch --tags
git checkout main
git reset --hard origin/main
```

### PyPI Upload Failure

**Check:**
1. `PYPI_API_TOKEN` secret is valid
2. Version doesn't already exist on PyPI
3. Package builds successfully
4. Frontend build completed

**Debug:**
```bash
# Test build locally
pip install build
python -m build

# Check dist files
ls -la dist/
```

## Migration from Manual Releases

If migrating from manual versioning:

1. ✓ Install `python-semantic-release`
2. ✓ Configure `pyproject.toml`
3. ✓ Update `__init__.py` with current version
4. ✓ Start using conventional commits
5. Push to `main` - semantic-release handles the rest!

## Additional Resources

- [Python Semantic Release Docs](https://python-semantic-release.readthedocs.io/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Workflows](https://docs.github.com/en/actions)

## Quick Reference Card

```bash
# Conventional Commit Types
feat:     → Minor version bump (new feature)
fix:      → Patch version bump (bug fix)
perf:     → Patch version bump (performance)
feat!:    → Major version bump (breaking change)
docs:     → No release (documentation)
chore:    → No release (maintenance)

# Workflow
1. Make changes
2. Commit with conventional format
3. Push to main
4. Automatic release happens
5. Check GitHub releases & PyPI

# Manual trigger
gh workflow run semantic-release.yml
```
