/* ------------------------------------------------------------------
 * blueprint · embedded template bodies (as-built, v0.1.0)
 * Ported verbatim from the shipped blueprint.py.
 * ------------------------------------------------------------------ */

export const T_PYPROJECT = `
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "$project_name"
version = "0.1.0"
authors = [
    { name = "$author", email = "author@example.com" },
]
description = "$description"
readme = "README.md"
requires-python = ">=3.9"
license = { text = "$license_spdx" }
classifiers = [
    "Programming Language :: Python :: 3",
    "Operating System :: OS Independent",
]

[project.scripts]
$package_name = "$package_name.main:main"

[project.urls]
"Homepage" = "https://github.com/billybox/$project_name"
"Bug Tracker" = "https://github.com/billybox/$project_name/issues"
`;

export const T_README = `
# $project_name

$description

## Installation

\\\`\\\`\\\`bash
pip install $project_name
\\\`\\\`\\\`

## Usage

\\\`\\\`\\\`bash
$package_name --help
\\\`\\\`\\\`

## Development

\\\`\\\`\\\`bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run linting
ruff check .
mypy .
\\\`\\\`\\\`

## License

$license_name
`;

export const T_LICENSE_MIT = `
MIT License

Copyright (c) 2026 $author

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

export const T_LICENSE_APACHE = `
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   Copyright 2026 $author

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
`;

export const T_GITIGNORE = `
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# PyInstaller
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Translations
*.mo
*.pot

# Environments
.env
.venv
env/
venv/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
`;

export const T_PRECOMMIT = `
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.5.0
    hooks:
      - id: mypy
        additional_dependencies: [types-all]

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
`;

export const T_CI = `
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.9", "3.10", "3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python \${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"

      - name: Lint with ruff
        run: |
          ruff check .

      - name: Type check with mypy
        run: |
          mypy .

      - name: Test with pytest
        run: |
          pytest
`;

export const T_PUBLISH = `
name: Publish to PyPI

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    environment: pypi
    permissions:
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install build dependencies
        run: |
          python -m pip install --upgrade pip
          pip install build

      - name: Build package
        run: |
          python -m build

      - name: Verify tag matches version
        run: |
          TAG_VERSION=\${GITHUB_REF#refs/tags/v}
          PKG_VERSION=$(python -c "import tomllib; print(tomllib.load(open('pyproject.toml', 'rb'))['project']['version'])")
          if [ "$TAG_VERSION" != "$PKG_VERSION" ]; then
            echo "Error: Tag version ($TAG_VERSION) does not match pyproject.toml version ($PKG_VERSION)"
            exit 1
          fi

      - name: Publish to PyPI
        uses: pypa/gh-action-pypi-publish@release/v1
`;

export const T_INIT = `
"""$project_name - $description"""

__version__ = "0.1.0"
`;

export const T_MAIN = `
#!/usr/bin/env python3
"""Main entry point for $project_name."""

import argparse
import sys


def main() -> int:
    """Main function."""
    parser = argparse.ArgumentParser(
        description="$description",
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"%(prog)s {__import__('$package_name').__version__}",
    )

    args = parser.parse_args()

    print(f"$project_name v{__import__('$package_name').__version__}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
`;

export const T_TEST = `
"""Tests for $package_name."""

from $package_name import __version__
from $package_name.main import main


def test_version():
    """Test that version is defined."""
    assert __version__ == "0.1.0"


def test_main(capsys):
    """Test main function."""
    import sys
    sys.argv = ["test"]
    result = main()
    assert result == 0
    captured = capsys.readouterr()
    assert "$project_name" in captured.out
`;

export const T_BB_JSON = `
{
  "name": "$project_name",
  "version": "0.1.0",
  "description": "$description",
  "author": "$author",
  "license": "$license_spdx"
}
`;

export const T_CTXIGNORE = `
# Files to ignore in context
.git/
__pycache__/
*.pyc
.env
.venv/
.pytest_cache/
.mypy_cache/
.ruff_cache/
dist/
build/
*.egg-info/
`;

export const T_POLICY = `
{
  "version": "1.0",
  "rules": []
}
`;

export const T_ROUTES = `
{
  "version": "1.0",
  "routes": []
}
`;

export const T_COMMITLOG = `
{
  "version": "1.0",
  "entries": []
}
`;

