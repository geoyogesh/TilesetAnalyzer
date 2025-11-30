#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to display usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS] [BUMP_TYPE]

Create a new release for TilesetAnalyzer

BUMP_TYPE:
    patch   Bump patch version (0.1.0 -> 0.1.1) [default]
    minor   Bump minor version (0.1.0 -> 0.2.0)
    major   Bump major version (0.1.0 -> 1.0.0)

OPTIONS:
    -h, --help      Show this help message
    -d, --dry-run   Show what would be done without making changes
    -g, --github    Trigger GitHub Actions workflow instead of local release

EXAMPLES:
    $0                  # Create a patch release locally
    $0 minor            # Create a minor release locally
    $0 --github major   # Trigger major release via GitHub Actions
    $0 --dry-run minor  # Preview what a minor release would do

REQUIREMENTS:
    - gh CLI tool (GitHub CLI)
    - git
    - Clean working directory (no uncommitted changes)

EOF
    exit 0
}

# Parse arguments
BUMP_TYPE="patch"
DRY_RUN=false
USE_GITHUB=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -g|--github)
            USE_GITHUB=true
            shift
            ;;
        patch|minor|major)
            BUMP_TYPE=$1
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo ""
            usage
            ;;
    esac
done

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if working directory is clean (unless using GitHub Actions)
if [ "$USE_GITHUB" = false ] && [ "$DRY_RUN" = false ]; then
    if ! git diff-index --quiet HEAD --; then
        print_error "Working directory is not clean. Please commit or stash your changes first."
        git status --short
        exit 1
    fi
fi

# Get current version
print_info "Fetching current version..."
CURRENT_VERSION=$(gh release view --json tagName -q .tagName 2>/dev/null || echo "none")

if [ "$CURRENT_VERSION" = "none" ]; then
    print_warning "No releases found. Will create version 0.0.1"
    CURRENT_VERSION="0.0.0"
fi

# Calculate new version
IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"

case $BUMP_TYPE in
    major)
        NEW_VERSION="$((major + 1)).0.0"
        ;;
    minor)
        NEW_VERSION="$major.$((minor + 1)).0"
        ;;
    patch)
        NEW_VERSION="$major.$minor.$((patch + 1))"
        ;;
esac

# Display release info
echo ""
print_info "Release Information:"
echo "  Current Version: $CURRENT_VERSION"
echo "  Bump Type:       $BUMP_TYPE"
echo "  New Version:     $NEW_VERSION"
echo ""

# If using GitHub Actions, trigger workflow
if [ "$USE_GITHUB" = true ]; then
    print_info "Triggering GitHub Actions workflow..."
    if [ "$DRY_RUN" = false ]; then
        gh workflow run release.yml -f bump_type=$BUMP_TYPE
        print_success "GitHub Actions workflow triggered!"
        echo ""
        print_info "Monitor progress at:"
        echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
    else
        print_info "[DRY RUN] Would trigger: gh workflow run release.yml -f bump_type=$BUMP_TYPE"
    fi
    exit 0
fi

# Local release process
print_info "Starting local release process..."
echo ""

if [ "$DRY_RUN" = true ]; then
    print_warning "DRY RUN MODE - No changes will be made"
    echo ""
    print_info "Would perform the following steps:"
    echo "  1. Update setup.py to version $NEW_VERSION"
    echo "  2. Commit: 'chore: bump version to $NEW_VERSION'"
    echo "  3. Push to remote repository"
    echo "  4. Create GitHub release: $NEW_VERSION"
    echo "  5. Trigger PyPI publication via GitHub Actions"
    exit 0
fi

# Confirm before proceeding
read -p "Proceed with $BUMP_TYPE release ($NEW_VERSION)? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Release cancelled"
    exit 0
fi

# Run the Python release script
print_info "Executing release script..."
python3 .github/scripts/release.py $BUMP_TYPE

echo ""
print_success "Release $NEW_VERSION created successfully!"
echo ""
print_info "Next steps:"
echo "  1. Check GitHub Actions for PyPI publication status"
echo "  2. Verify release at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$NEW_VERSION"
echo "  3. Monitor PyPI: https://pypi.org/project/tileset-analyzer/"
