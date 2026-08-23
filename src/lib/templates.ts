/* ------------------------------------------------------------------
 * blueprint · embedded templates — as-built, v0.1.0
 * Ported verbatim from the shipped blueprint.py: every template lives
 * in one file and renders with $variable substitution. Zero deps.
 * ------------------------------------------------------------------ */

export type LicenseId = "MIT" | "Apache-2.0" | "none";

export interface ProjectConfig {
  name: string;
  description: string;
  author: string;
  license: LicenseId;
}

export interface GeneratedFile {
  path: string;
  lang: Lang;
  content: string;
  bytes: number;
}

export type Lang = "toml" | "markdown" | "yaml" | "python" | "json" | "text";

export const LICENSES: { id: LicenseId; label: string }[] = [
  { id: "MIT", label: "MIT" },
  { id: "Apache-2.0", label: "Apache-2.0" },
  { id: "none", label: "none" },
];

/* ---------------- naming helpers (mirror blueprint.py) ---------------- */

/** keep the raw project name, like the CLI does */
export function projectName(raw: string): string {
  return raw.trim() || "my-project";
}

/** normalize_package_name() from blueprint.py */
export function normalizePackage(raw: string): string {
  let name = projectName(raw).replace(/-/g, "_");
  name = name.replace(/[^\w]/g, "");
  if (name && !/^[A-Za-z_]/.test(name)) name = "_" + name;
  return name.toLowerCase();
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

const enc = new TextEncoder();
const size = (s: string) => enc.encode(s).length;

const TOKENS =
  /\$(project_name|package_name|description|author|license_spdx|license_name)/g;

function substitute(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(TOKENS, (_, k: string) => vars[k] ?? "");
}

/* ---------------- the 16 templates ---------------- */

const T_PYPROJECT = `
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

const T_README = `
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

const T_LICENSE_MIT = `
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

const T_LICENSE_APACHE = `
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

const T_GITIGNORE = `
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

const T_PRECOMMIT = `
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

const T_CI = `
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

const T_PUBLISH = `
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

const T_INIT = `
"""$project_name - $description"""

__version__ = "0.1.0"
`;

const T_MAIN = `
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

const T_TEST = `
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

const T_BB_JSON = `
{
  "name": "$project_name",
  "version": "0.1.0",
  "description": "$description",
  "author": "$author",
  "license": "$license_spdx"
}
`;

const T_CTXIGNORE = `
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

const T_POLICY = `
{
  "version": "1.0",
  "rules": []
}
`;

const T_ROUTES = `
{
  "version": "1.0",
  "routes": []
}
`;

const T_COMMITLOG = `
{
  "version": "1.0",
  "entries": []
}
`;

/* ---------------- renderer ---------------- */

function licenseInfo(id: LicenseId): { spdx: string; name: string } {
  if (id === "MIT") return { spdx: "MIT", name: "MIT License" };
  if (id === "Apache-2.0")
    return { spdx: "Apache-2.0", name: "Apache License 2.0" };
  return { spdx: "NONE", name: "No License" };
}

export function renderProject(cfg: ProjectConfig): GeneratedFile[] {
  const pName = projectName(cfg.name);
  const pkg = normalizePackage(cfg.name);
  const { spdx, name: licName } = licenseInfo(cfg.license);

  const vars: Record<string, string> = {
    project_name: pName,
    package_name: pkg,
    description: cfg.description,
    author: cfg.author || "Unknown",
    license_spdx: spdx,
    license_name: licName,
  };

  const mk = (path: string, lang: Lang, tpl: string): GeneratedFile => {
    const content = substitute(tpl, vars).replace(/^\n/, "");
    return { path, lang, content, bytes: size(content) };
  };

  const files: GeneratedFile[] = [
    mk("pyproject.toml", "toml", T_PYPROJECT),
    mk("README.md", "markdown", T_README),
    mk(".gitignore", "text", T_GITIGNORE),
    mk(".pre-commit-config.yaml", "yaml", T_PRECOMMIT),
    mk(".github/workflows/ci.yml", "yaml", T_CI),
    mk(".github/workflows/publish.yml", "yaml", T_PUBLISH),
    mk(`src/${pkg}/__init__.py`, "python", T_INIT),
    mk(`src/${pkg}/main.py`, "python", T_MAIN),
    mk("tests/test_main.py", "python", T_TEST),
    mk("bb.json", "json", T_BB_JSON),
    mk(".ctxignore", "text", T_CTXIGNORE),
    mk("policy.json", "json", T_POLICY),
    mk("routes.json", "json", T_ROUTES),
    mk("commitlog.json", "json", T_COMMITLOG),
  ];

  if (cfg.license === "MIT") files.push(mk("LICENSE", "text", T_LICENSE_MIT));
  if (cfg.license === "Apache-2.0")
    files.push(mk("LICENSE", "text", T_LICENSE_APACHE));

  return files;
}

export const DEFAULT_CONFIG: ProjectConfig = {
  name: "local-drift",
  description: "Local config drift detector",
  author: "Billy Box",
  license: "MIT",
};

/* notes shown in the file viewer */
export const FILE_NOTES: Record<string, string> = {
  "pyproject.toml": "setuptools ≥ 61 · script entry point · PyPI metadata",
  "README.md": "install · usage · dev loop · license",
  LICENSE: "full text embedded — MIT or Apache-2.0",
  ".gitignore": "python + packaging + venv + IDE + OS",
  ".pre-commit-config.yaml": "ruff + mypy + housekeeping hooks",
  "ci.yml": "matrix 3.9 → 3.12 · ruff · mypy · pytest",
  "publish.yml": "tag-vs-version guard · OIDC id-token: write",
  "__init__.py": "docstring + __version__, single source of truth",
  "main.py": "argparse entry point wired via [project.scripts]",
  "test_main.py": "version + main() smoke tests, passing on day one",
  "bb.json": "project identity for the whole suite",
  ".ctxignore": "keeps ctxpack context lean",
  "policy.json": "policy-runner seed — empty ruleset, version 1.0",
  "routes.json": "mockroute seed — empty route table",
  "commitlog.json": "commitlog seed — empty ledger",
};

/* ---------------- as-built facts ---------------- */

export const TEST_SUITES: { name: string; note?: string; tests: string[] }[] = [
  {
    name: "TestNormalizePackageName",
    tests: [
      "test_hyphen_to_underscore",
      "test_multiple_hyphens",
      "test_already_valid",
      "test_uppercase_to_lowercase",
      "test_special_characters_removed",
      "test_starts_with_number",
    ],
  },
  {
    name: "TestRenderTemplate",
    tests: [
      "test_simple_substitution",
      "test_multiple_variables",
      "test_missing_variable_safe",
    ],
  },
  {
    name: "TestGenerateProject",
    tests: [
      "test_generate_creates_files",
      "test_generate_no_license",
      "test_generate_dry_run",
      "test_generate_force_overwrite",
      "test_generate_existing_no_force_fails",
      "test_generated_pyproject_content",
      "test_generated_readme_content",
    ],
  },
  {
    name: "TestCollectNonInteractiveInput",
    tests: [
      "test_all_args_provided",
      "test_minimal_args",
      "test_missing_project_name_fails",
    ],
  },
  {
    name: "TestCLIIntegration",
    note: "subprocess · end-to-end",
    tests: ["test_cli_new_command", "test_cli_dry_run", "test_cli_version"],
  },
];

export const ANATOMY: { section: string; rows: [string, string][] }[] = [
  {
    section: "TEMPLATES",
    rows: [
      ["16 constants", "pyproject.toml → commitlog.json, embedded verbatim"],
      ["3 license states", "MIT · Apache-2.0 · none (LICENSE dropped)"],
    ],
  },
  {
    section: "CORE LOGIC",
    rows: [
      ["normalize_package_name()", "my-project → my_project, leading-digit guard"],
      ["get_license_info()", "id → template + SPDX + display name"],
      ["collect_interactive_input()", "prompt-driven, with defaults"],
      ["collect_non_interactive_input()", "flags only, fails on missing name"],
      ["render_template()", "string.Template.safe_substitute"],
      ["generate_project()", "mkdir tree · --dry-run · --force"],
    ],
  },
  {
    section: "CLI",
    rows: [["argparse", "verb new + 8 flags, --version included"]],
  },
];

export const IMPORTS = ["argparse", "json", "os", "re", "sys", "pathlib", "string.Template"];

export const MANIFEST = [
  { name: "blueprint.py", note: "the whole tool — 16 templates embedded" },
  { name: "pyproject.toml", note: "entry point: blueprint = blueprint:main" },
  { name: "README.md" },
  { name: "LICENSE" },
  { name: ".gitignore" },
  { name: ".pre-commit-config.yaml" },
  { name: "tests/test_blueprint.py", note: "22 tests · 5 suites" },
  { name: ".github/workflows/ci.yml", note: "eats its own dogfood" },
];
