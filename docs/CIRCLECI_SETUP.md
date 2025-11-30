# CircleCI Setup Guide

This guide walks you through setting up CircleCI for automated releases with Python Semantic Release.

## Quick Setup

### 1. Connect Repository to CircleCI

1. Go to [CircleCI](https://circleci.com/)
2. Sign up / Log in with your GitHub account
3. Click "Projects" in the sidebar
4. Find `TilesetAnalyzer` and click "Set Up Project"
5. CircleCI will detect the `.circleci/config.yml` automatically
6. Click "Start Building"

### 2. Configure Environment Variables

#### Required Secrets

You need to configure the following environment variables in CircleCI:

**For Semantic Release (Context: `semantic-release`):**

1. Go to CircleCI → Organization Settings → Contexts
2. Create a new context named `semantic-release`
3. Add environment variables:
   - `GITHUB_TOKEN` - Personal Access Token with repo permissions
     - Generate at: https://github.com/settings/tokens
     - Scopes needed: `repo`, `write:packages`

**For PyPI Publishing (Context: `pypi-publish`):**

1. Create another context named `pypi-publish`
2. Add environment variables:
   - `PYPI_API_TOKEN` - PyPI API token
     - Generate at: https://pypi.org/manage/account/token/

#### Alternative: Project Environment Variables

Instead of contexts, you can use project-level environment variables:

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `GITHUB_TOKEN`
   - `PYPI_API_TOKEN`

If using project variables, remove the `context:` sections from `.circleci/config.yml`.

### 3. Grant CircleCI GitHub Permissions

For semantic-release to push tags and create releases:

1. Go to CircleCI → Project Settings → Advanced
2. Enable "Only build pull requests"
3. Enable "Auto-cancel redundant workflows"
4. Ensure "GitHub Status updates" is enabled

### 4. Configure GitHub Personal Access Token

The `GITHUB_TOKEN` needs these permissions:

- ✅ `repo` - Full control of private repositories
- ✅ `write:packages` - Upload packages to GitHub Package Registry
- ✅ `workflow` - Update GitHub Actions workflows (optional)

**Create token:**
```bash
# Or via GitHub CLI
gh auth token

# Or manually at:
# https://github.com/settings/tokens/new
```

### 5. Test the Pipeline

Push a commit to trigger the pipeline:

```bash
git commit --allow-empty -m "ci: trigger CircleCI pipeline"
git push origin main
```

Monitor at: https://app.circleci.com/pipelines/github/geoyogesh/TilesetAnalyzer

## CircleCI Workflow Overview

### Jobs

1. **build-and-test**
   - Runs on all branches
   - Installs Python and Node.js dependencies
   - Builds frontend React app
   - Runs tests (if configured)
   - Caches dependencies for faster builds

2. **semantic-release** (main branch only)
   - Analyzes commits using conventional commits
   - Determines version bump
   - Updates version in code
   - Generates CHANGELOG.md
   - Creates git tag and GitHub release
   - Builds Python package

3. **publish-pypi** (main branch only)
   - Uploads built package to PyPI
   - Only runs after semantic-release succeeds

### Workflow Diagram

```
main branch:
  build-and-test → semantic-release → publish-pypi

other branches:
  build-and-test (test only, no release)
```

## Configuration File

The `.circleci/config.yml` is configured with:

```yaml
executors:
  python-node: Python 3.9 + Node.js

jobs:
  - build-and-test: Build and test
  - semantic-release: Version and release
  - publish-pypi: Publish to PyPI

workflows:
  - build-test-release: Main pipeline (main branch)
  - test-all-branches: Test other branches
```

## Environment Variables Reference

| Variable | Required | Where Used | Description |
|----------|----------|------------|-------------|
| `GITHUB_TOKEN` | Yes | semantic-release | GitHub PAT for creating releases |
| `PYPI_API_TOKEN` | Yes | publish-pypi | PyPI token for package upload |
| `GIT_COMMIT_AUTHOR` | No | semantic-release | Override commit author (optional) |

## Caching Strategy

CircleCI caches the following to speed up builds:

- **Python dependencies**: `venv/` directory
  - Key: `v1-dependencies-{{ checksum "requirements.txt" }}`
- **Node.js dependencies**: `node_modules/`
  - Key: `v1-npm-{{ checksum "package-lock.json" }}`

To clear cache:
```bash
# Manually via CircleCI UI
# Project Settings → Advanced → Clear Cache
```

## Contexts vs Environment Variables

### Contexts (Recommended)

**Pros:**
- Shared across multiple projects
- Better security and access control
- Can be restricted to specific teams
- Easier to rotate secrets

**Cons:**
- Requires organization-level access
- More setup steps

### Project Environment Variables

**Pros:**
- Simpler setup
- No context management needed
- Project-specific

**Cons:**
- Must be configured per project
- Less reusable

## Customization

### Add Tests

Edit `.circleci/config.yml` and update the test step:

```yaml
- run:
    name: Run tests
    command: |
      . venv/bin/activate
      pip install pytest pytest-cov
      pytest tests/ --cov=tileset_analyzer
```

### Add Linting

```yaml
- run:
    name: Lint code
    command: |
      . venv/bin/activate
      pip install flake8 black mypy
      black --check .
      flake8 .
      mypy tileset_analyzer/
```

### Add Code Coverage

```yaml
- run:
    name: Upload coverage to Codecov
    command: |
      . venv/bin/activate
      pip install codecov
      codecov
```

Add `CODECOV_TOKEN` to environment variables.

### Parallel Workflows

Run tests and linting in parallel:

```yaml
workflows:
  build-test-release:
    jobs:
      - build-frontend
      - run-tests
      - run-linting
      - semantic-release:
          requires:
            - build-frontend
            - run-tests
            - run-linting
```

## Monitoring and Badges

### Add CircleCI Badge to README

```markdown
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/geoyogesh/TilesetAnalyzer/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/geoyogesh/TilesetAnalyzer/tree/main)
```

### View Build Status

- **Dashboard**: https://app.circleci.com/pipelines/github/geoyogesh/TilesetAnalyzer
- **Insights**: https://app.circleci.com/insights/github/geoyogesh/TilesetAnalyzer/workflows

### Slack Notifications

Add Slack integration:

1. CircleCI → Project Settings → Slack Integration
2. Connect Slack workspace
3. Configure notification preferences

Or use CircleCI orb:

```yaml
orbs:
  slack: circleci/slack@4.12.0

jobs:
  notify-slack:
    steps:
      - slack/notify:
          event: fail
          channel: deployments
```

## Troubleshooting

### Build Fails on semantic-release

**Issue**: `No commits found since last release`

**Solution**: Ensure you're using conventional commits:
```bash
git commit -m "feat: add new feature"  # ✓ Correct
git commit -m "add new feature"        # ✗ Wrong
```

### Permission Denied on GitHub Push

**Issue**: Semantic release can't push tags

**Solution**:
1. Check `GITHUB_TOKEN` has `repo` scope
2. Ensure token isn't expired
3. Verify CircleCI has GitHub permissions

```bash
# Test token locally
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### PyPI Upload Fails

**Issue**: `403 Forbidden` or `Invalid credentials`

**Solution**:
1. Verify `PYPI_API_TOKEN` is correct
2. Check token hasn't been revoked
3. Ensure package name is available

```bash
# Test token locally
twine upload --repository testpypi dist/* --username __token__ --password $PYPI_API_TOKEN
```

### Workspace Attachment Fails

**Issue**: `dist/` directory not found in publish-pypi

**Solution**: Ensure `persist_to_workspace` and `attach_workspace` are correctly configured:

```yaml
# In semantic-release job
- persist_to_workspace:
    root: ~/repo
    paths:
      - dist

# In publish-pypi job
- attach_workspace:
    at: ~/repo
```

### Cache Issues

**Issue**: Old dependencies being used

**Solution**:
1. Update cache key version in config.yml
2. Or clear cache manually in CircleCI UI

```yaml
# Change v1 to v2
- save_cache:
    key: v2-dependencies-{{ checksum "requirements.txt" }}
```

## Migration from GitHub Actions

If migrating from GitHub Actions:

1. ✅ CircleCI config created (`.circleci/config.yml`)
2. ✅ Transfer secrets from GitHub to CircleCI
3. ⚠️ GitHub Actions workflows still exist but won't run
4. Optional: Archive or delete `.github/workflows/` files

**Keep GitHub Actions?** You can run both simultaneously:
- CircleCI: Main CI/CD pipeline
- GitHub Actions: PR checks, additional workflows

## Best Practices

1. **Use contexts** for shared secrets across projects
2. **Cache dependencies** to speed up builds
3. **Run tests in parallel** when possible
4. **Use semantic versioning** with conventional commits
5. **Monitor build times** and optimize slow steps
6. **Set up notifications** for failed builds
7. **Use environment-specific configs** for staging/production

## Additional Resources

- [CircleCI Documentation](https://circleci.com/docs/)
- [Python Semantic Release](https://python-semantic-release.readthedocs.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [CircleCI Orbs Registry](https://circleci.com/developer/orbs)

## Quick Commands

```bash
# Validate CircleCI config locally
circleci config validate

# Process config (expand orbs)
circleci config process .circleci/config.yml

# Run job locally (requires Docker)
circleci local execute --job build-and-test

# Trigger pipeline via API
curl -X POST https://circleci.com/api/v2/project/gh/geoyogesh/TilesetAnalyzer/pipeline \
  -H "Circle-Token: $CIRCLECI_TOKEN" \
  -H "Content-Type: application/json"
```

## Next Steps

After setup is complete:

1. ✅ Push conventional commits to `main`
2. ✅ Watch CircleCI automatically release
3. ✅ Verify GitHub releases are created
4. ✅ Confirm PyPI package is published
5. 📊 Monitor build performance
6. 🔔 Set up notifications
7. 📝 Update team documentation
