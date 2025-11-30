#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys


def get_last_version() -> str:
    """Return the version number of the last release."""
    json_string = (
        subprocess.run(
            ["gh", "release", "view", "--json", "tagName"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        .stdout.decode("utf8")
        .strip()
    )

    return json.loads(json_string)["tagName"]


def bump_version(version_number: str, bump_type: str) -> str:
    """Return a copy of `version_number` with the specified version component incremented."""
    major, minor, patch = version_number.split(".")

    if bump_type == "major":
        return f"{int(major) + 1}.0.0"
    elif bump_type == "minor":
        return f"{major}.{int(minor) + 1}.0"
    elif bump_type == "patch":
        return f"{major}.{minor}.{int(patch) + 1}"
    else:
        raise ValueError(f"Invalid bump type: {bump_type}. Use 'major', 'minor', or 'patch'.")


def update_setup_py(new_version: str):
    """Update the version in setup.py file."""
    setup_file = "setup.py"

    with open(setup_file, "r") as f:
        content = f.read()

    # Replace version string
    updated_content = re.sub(
        r"version='[\d.]+',",
        f"version='{new_version}',",
        content
    )

    with open(setup_file, "w") as f:
        f.write(updated_content)

    print(f"Updated {setup_file} to version {new_version}")


def commit_and_push(version: str):
    """Commit version change and push to GitHub."""
    subprocess.run(["git", "add", "setup.py"], check=True)
    subprocess.run(
        ["git", "commit", "-m", f"chore: bump version to {version}"],
        check=True
    )
    subprocess.run(["git", "push"], check=True)
    print(f"Committed and pushed version {version}")


def create_release(bump_type: str = "patch"):
    """Create a new release on GitHub."""
    try:
        last_version_number = get_last_version()
    except subprocess.CalledProcessError as err:
        if err.stderr.decode("utf8").startswith("HTTP 404:"):
            # The project doesn't have any releases yet.
            new_version_number = "0.0.1"
        else:
            raise
    else:
        new_version_number = bump_version(last_version_number, bump_type)

    print(f"Creating {bump_type} release: {last_version_number} → {new_version_number}")

    # Update setup.py
    update_setup_py(new_version_number)

    # Commit and push
    commit_and_push(new_version_number)

    # Create GitHub release
    subprocess.run(
        ["gh", "release", "create", "--generate-notes", new_version_number],
        check=True,
    )

    print(f"✓ Release {new_version_number} created successfully!")
    print(f"  PyPI publication will start automatically via GitHub Actions")


if __name__ == "__main__":
    # Get bump type from environment variable or command line argument
    bump_type = os.environ.get("BUMP_TYPE", "patch")

    if len(sys.argv) > 1:
        bump_type = sys.argv[1]

    if bump_type not in ["major", "minor", "patch"]:
        print(f"Error: Invalid bump type '{bump_type}'")
        print("Usage: release.py [major|minor|patch]")
        sys.exit(1)

    create_release(bump_type)
