# CircleCI Setup

## 1. Connect Repository

1. Go to https://circleci.com/
2. Log in with GitHub
3. Click "Projects" → Find `TilesetAnalyzer` → "Set Up Project"
4. Click "Start Building"

## 2. Configure Environment Variables

Go to Project Settings → Environment Variables → Add Environment Variable

### `GITHUB_TOKEN`

Generate fine-grained token at: https://github.com/settings/tokens?type=beta

**Repository access**: Only select repositories → TilesetAnalyzer

**Permissions**:

- **Contents**: Read and write
- **Metadata**: Read (automatic)

### `PYPI_API_TOKEN`

Generate at: https://pypi.org/manage/account/token/

## 3. Test Pipeline

```bash
git commit --allow-empty -m "ci: test CircleCI"
git push origin main
```

Monitor at: https://app.circleci.com/pipelines/github/geoyogesh/TilesetAnalyzer

## Troubleshooting

### Permission Denied

**Check token permissions**:

- Contents: Read and write
- Repository access: TilesetAnalyzer selected
- Token not expired

**Test token**:

```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/geoyogesh/TilesetAnalyzer
```

### No Release Created

Ensure conventional commits:

```bash
git commit -m "feat: add feature"  # ✓ Creates release
git commit -m "add feature"        # ✗ No release
```

### PyPI Upload Fails

- Verify `PYPI_API_TOKEN` is correct
- Check token not revoked
- Test: `twine upload --repository testpypi dist/*`

### Cache Issues

Clear cache: Project Settings → Advanced → Clear Cache
