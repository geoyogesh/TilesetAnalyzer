.PHONY: help install install-build install-hooks commit format lint check verify build publish clean

help:
	@echo "Available commands:"
	@echo "  make install        Install dev dependencies (Python + React)"
	@echo "  make install-build  Install build dependencies (for releases)"
	@echo "  make install-hooks  Install pre-commit hooks (run once)"
	@echo "  make commit         Create a commit with guided conventional format"
	@echo "  make format         Format Python code with Black"
	@echo "  make lint           Run Ruff linter on Python code"
	@echo "  make check          Format and lint ALL code (makes changes)"
	@echo "  make verify         Verify code quality (CI/CD - fails on issues)"
	@echo "  make build          Build distribution packages"
	@echo "  make publish        Publish to PyPI"
	@echo "  make clean          Clean up cache and build files"

install:
	@echo "📦 Installing Python dependencies (from pyproject.toml)..."
	@pip install -e ".[dev]"
	@echo "📦 Installing React dependencies..."
	@cd webapp/tileset-analyzer-app && npm install
	@echo "✅ All dependencies installed!"

install-build:
	@echo "📦 Installing build dependencies..."
	@pip install -e ".[build]"

install-hooks:
	@echo "🪝 Installing pre-commit hooks..."
	@pre-commit install
	@pre-commit install --hook-type commit-msg
	@echo "✅ Pre-commit hooks installed!"
	@echo ""
	@echo "Hooks will now run automatically on 'git commit'"
	@echo "To run manually: pre-commit run --all-files"
	@echo ""
	@echo "💡 Tip: Use 'make commit' for guided commit message creation"

commit:
	@echo "📝 Creating a conventional commit..."
	@echo ""
	@echo "See .commit-message-format.md for format guidelines"
	@echo ""
	@cz commit

format:
	black tileset_analyzer/

lint:
	ruff check tileset_analyzer/

check:
	@echo "🔧 Formatting and linting Python code..."
	@black tileset_analyzer/
	@ruff check --fix tileset_analyzer/ || true
	@echo ""
	@echo "🔧 Formatting and linting React code..."
	@cd webapp/tileset-analyzer-app && npm run check || true
	@echo ""
	@echo "✅ All code (Python + React) formatted and linted!"

verify:
	@echo "🔍 Verifying code quality (Python + React)..."
	@black --check tileset_analyzer/
	@ruff check tileset_analyzer/
	@cd webapp/tileset-analyzer-app && npm run verify
	@echo "✅ Code quality verification passed!"

build: clean
	python3 -m pip install --upgrade --quiet setuptools wheel twine
	python3 setup.py --quiet sdist bdist_wheel

publish: build
	python3 -m twine check dist/*
	python3 -m twine upload dist/*

clean:
	rm -r build dist *.egg-info || true
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
