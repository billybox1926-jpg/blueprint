#!/usr/bin/env python3
"""blueprint · BillyBox Project Scaffolder

Single-file, stdlib-only project scaffolder. Every template lives in this
file and is rendered with plain ``str`` substitution — zero dependencies,
same substitution engine as the web mockup (src/lib/templates.ts).

Usage:
    python blueprint.py new <name> [options]
    python blueprint.py --help

Options:
    -d, --description TEXT   project description (default: "A BillyBox tool.")
    -a, --author TEXT        author name (default: "Billy Box")
    -l, --license ID         MIT | Apache-2.0 | none   (default: MIT)
        --no-interactive     never prompt; take everything from flags/defaults
        --dry-run            print the tree instead of writing anything
    -f, --force              overwrite existing files
    -V, --version            print version and exit
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

__version__ = "0.1.0"

BLUEPRINT_VERSION = __version__

# --------------------------------------------------------------------------
# naming helpers (mirror templates.ts slugify/toModule)
# --------------------------------------------------------------------------


def normalize_package_name(raw: str) -> str:
    """Free-form name -> kebab-case slug ('My Cool Tool!' -> 'my-cool-tool')."""
    s = raw.strip().lower()
    out: list[str] = []
    prev_dash = False
    for ch in s:
        if ch.isalnum() and ch.isascii():
            out.append(ch)
            prev_dash = False
        elif not prev_dash and out:
            out.append("-")
            prev_dash = True
    slug = "".join(out).strip("-")
    return slug or "my-project"


def slug_to_module(slug: str) -> str:
    """Slug -> importable module name ('my-cool-tool' -> 'my_cool_tool')."""
    m = slug.replace("-", "_")
    if m and m[0].isdigit():
        m = "_" + m
    return m or "my_project"


# Back-compat aliases used by earlier drafts of the docs.
slugify = normalize_package_name
to_module = slug_to_module


# --------------------------------------------------------------------------
# template engine
# --------------------------------------------------------------------------


def render_template(tpl: str, ctx: dict[str, str]) -> str:
    """Replace {{name}} placeholders; unknown keys become empty strings."""
    out = tpl
    for key, value in ctx.items():
        out = out.replace("{{" + key + "}}", value)
    # any leftover placeholders resolve to "" — same as the web renderer.
    # Skip ${{ ... }}: those are literal GitHub Actions expressions, not
    # template placeholders.
    while "{{" in out:
        start = out.index("{{")
        if start > 0 and out[start - 1] == "$":
            nxt = out.find("{{", start + 2)
            if nxt == -1:
                break
            start = nxt
        end = out.find("}}", start)
        if end == -1:
            break
        out = out[:start] + out[end + 2 :]
    return out.lstrip("\n")


# --------------------------------------------------------------------------
# embedded templates (ported verbatim from src/lib/templates.ts)
# --------------------------------------------------------------------------

T_PYPROJECT = """\
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "{{slug}}"
version = "0.1.0"
description = "{{description}}"
readme = "README.md"
authors = [{ name = "{{author}}" }]
requires-python = ">=3.10"
{{licenseLine}}keywords = ["billybox", "{{slug}}"]
classifiers = [
  "Development Status :: 3 - Alpha",
  "Intended Audience :: Developers",
  "Operating System :: OS Independent",
  "Programming Language :: Python :: 3.10",
  "Programming Language :: Python :: 3.11",
  "Programming Language :: Python :: 3.12",
  "Programming Language :: Python :: 3.13",
  "Topic :: Software Development :: Build Tools",
]

[project.scripts]
{{module}} = "{{module}}.main:main"

[project.urls]
Homepage = "https://github.com/billybox/{{slug}}"
Issues = "https://github.com/billybox/{{slug}}/issues"

[tool.hatch.build.targets.wheel]
packages = ["src/{{module}}"]

[tool.ruff]
line-length = 100
target-version = "py310"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]

[tool.mypy]
strict = true
python_version = "3.10"

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q"
"""

T_README = """\
# {{slug}}

> {{description}}

[![PyPI version](https://img.shields.io/pypi/v/{{slug}}?color=57aeff)](https://pypi.org/project/{{slug}}/)
[![ci](https://github.com/billybox/{{slug}}/actions/workflows/ci.yml/badge.svg)](https://github.com/billybox/{{slug}}/actions/workflows/ci.yml)
[![python](https://img.shields.io/pypi/pyversions/{{slug}})](https://pypi.org/project/{{slug}}/)
[![ruff](https://img.shields.io/badge/lint-ruff-57aeff)](https://docs.astral.sh/ruff/)
{{licenseBadge}}
## Install

```bash
pip install {{slug}}
```

## Quickstart

```bash
{{module}} --version
{{module}} --help
```

## Development

```bash
pip install -e .
pip install ruff mypy pytest
ruff check . && ruff format --check .
mypy src
pytest
```

Pre-commit hooks enforce the BillyBox standard on every commit —
see `.pre-commit-config.yaml`.

## BillyBox wiring

This repo ships pre-wired for the BillyBox suite:

| File              | Purpose                                   |
| ----------------- | ----------------------------------------- |
| `bb.json`         | project identity + suite defaults         |
| `policy.json`     | policies checked by `policy-runner`       |
| `routes.json`     | fixtures served by `mockroute`            |
| `commitlog.json`  | release notes consumed by `commitlog`     |
| `.ctxignore`      | keep `ctxpack` context lean               |

Run `bb preflight` before cutting a release.

---

Part of the [BillyBox suite](https://github.com/billybox) · generated by **blueprint v0.1.0**
"""

T_LICENSE_MIT = """\
MIT License

Copyright (c) {{year}} {{author}}

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
"""

T_LICENSE_APACHE = """\
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      [... Sections 2-9: grant of license, redistribution, notices,
           contributions, trademarks, disclaimer of warranty,
           limitation of liability, accepting warranties, indemnity ...]

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

   Copyright {{year}} {{author}}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
"""

T_GITIGNORE = """\
# --- python ---
__pycache__/
*.py[cod]
*.egg-info/
build/
dist/
wheels/

# --- environments ---
.venv/
venv/
.env
.env.*

# --- tooling caches ---
.mypy_cache/
.pytest_cache/
.ruff_cache/
.coverage
htmlcov/

# --- os / editor ---
.DS_Store
.idea/
.vscode/
"""

T_PRECOMMIT = """\
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-toml
      - id: check-json
      - id: check-added-large-files

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.6
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.14.1
    hooks:
      - id: mypy
        args: [--strict, src]
"""

T_CI = """\
name: ci

on:
  push:
    branches: [main]
  pull_request: {}

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Install
        run: |
          pip install -e .
          pip install ruff mypy
      - name: Lint (ruff)
        run: ruff check . && ruff format --check .
      - name: Types (mypy --strict)
        run: mypy src

  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ["3.10", "3.11", "3.12", "3.13"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install
        run: |
          pip install -e .
          pip install pytest
      - name: Test (pytest)
        run: pytest
"""

T_PUBLISH = """\
name: publish

on:
  push:
    tags: ["v*"]

jobs:
  guard:
    # Tag-vs-wheel guard: refuse to publish when the pushed tag
    # does not match the version baked into pyproject.toml.
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Tag <-> wheel guard
        run: |
          set -euo pipefail
          TAG="${GITHUB_REF_NAME#v}"
          VER="$(python -c "import tomllib;print(tomllib.load(open('pyproject.toml','rb'))['project']['version'])")"
          echo "tag=v$TAG - wheel=$VER"
          test "$TAG" = "$VER" || { echo "::error::v$TAG != $VER - refusing to publish"; exit 1; }

  build:
    needs: guard
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install build
      - run: python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  release:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      id-token: write  # OIDC trusted publishing - no long-lived PyPI tokens
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - uses: pypa/gh-action-pypi-publish@release/v1
"""

T_INIT_PY = '''\
"""{{description}}"""

__version__ = "0.1.0"
'''

T_MAIN_PY = '''\
#!/usr/bin/env python3
"""{{description}}

CLI entry point - wired by blueprint v0.1.0.
"""
from __future__ import annotations

import argparse

from {{module}} import __version__


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="{{module}}",
        description="{{description}}",
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"%(prog)s {__version__}",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    parser.parse_args(argv)
    print("{{slug}} is wired and waiting - implement me.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
'''

T_TEST_MAIN = """\
from {{module}} import __version__
from {{module}}.main import main


def test_version() -> None:
    assert __version__ == "0.1.0"


def test_main_returns_zero() -> None:
    assert main([]) == 0
"""

T_DOCS_INDEX = """\
# {{slug}} - documentation skeleton

Generated by **blueprint v0.1.0**. Fill these in before the first release.

## Contents

1. [Overview](#overview)
2. [Install](#install)
3. [Usage](#usage)
4. [Configuration](#configuration)

## Overview

_TODO - what does {{slug}} do, and why does it exist?_

## Install

```bash
pip install {{slug}}
```

## Usage

```bash
{{module}} --help
```

_TODO - document every flag and exit code._

## Configuration

{{slug}} reads BillyBox wiring from the repo root:
`bb.json`, `policy.json`, `routes.json`, `commitlog.json`.

_TODO - document each knob._
"""

T_BB_JSON = """\
{
  "project": "{{slug}}",
  "suite": "billybox",
  "blueprint": {
    "version": "0.1.0",
    "template": "python-cli",
    "generated_at": "{{iso}}"
  },
  "defaults": {
    "python": ">=3.10",
    "ci": true,
    "publish": "oidc-trusted"
  }
}
"""

T_CTXIGNORE = """\
# keep ctxpack context lean - nothing generated or vendored
.git/
.venv/
dist/
build/
*.egg-info/
__pycache__/
.mypy_cache/
.pytest_cache/
.ruff_cache/
htmlcov/
*.pyc
"""

T_POLICY_JSON = """\
{
  "version": 1,
  "policies": [
    {
      "id": "P-001",
      "name": "no secrets in repo",
      "severity": "block",
      "check": "secrets-scan"
    },
    {
      "id": "P-002",
      "name": "version tag matches wheel",
      "severity": "block",
      "check": "tag-wheel-guard"
    },
    {
      "id": "P-003",
      "name": "release notes present",
      "severity": "warn",
      "check": "commitlog-entry"
    }
  ]
}
"""

T_ROUTES_JSON = """\
{
  "version": 1,
  "routes": [
    {
      "name": "health",
      "method": "GET",
      "path": "/healthz",
      "status": 200,
      "body": { "ok": true, "service": "{{slug}}" }
    }
  ]
}
"""

T_COMMITLOG_JSON = """\
{
  "version": 1,
  "project": "{{slug}}",
  "entries": []
}
"""

TEMPLATES: dict[str, str] = {
    "pyproject.toml": T_PYPROJECT,
    "README.md": T_README,
    "LICENSE-MIT": T_LICENSE_MIT,
    "LICENSE-Apache-2.0": T_LICENSE_APACHE,
    ".gitignore": T_GITIGNORE,
    ".pre-commit-config.yaml": T_PRECOMMIT,
    ".github/workflows/ci.yml": T_CI,
    ".github/workflows/publish.yml": T_PUBLISH,
    "__init__.py": T_INIT_PY,
    "main.py": T_MAIN_PY,
    "test_main.py": T_TEST_MAIN,
    "docs/index.md": T_DOCS_INDEX,
    "bb.json": T_BB_JSON,
    ".ctxignore": T_CTXIGNORE,
    "policy.json": T_POLICY_JSON,
    "routes.json": T_ROUTES_JSON,
    "commitlog.json": T_COMMITLOG_JSON,
}

LICENSE_IDS = ("MIT", "Apache-2.0", "none")
DEFAULT_DESCRIPTION = "A BillyBox tool."
DEFAULT_AUTHOR = "Billy Box"

# --------------------------------------------------------------------------
# project generation
# --------------------------------------------------------------------------


def default_iso_year() -> tuple[str, str]:
    now = datetime.now(timezone.utc)
    year = str(now.year)
    iso = f"{year}-01-01T00:00:00Z"
    return year, iso


def generate_project(
    name: str,
    description: str = DEFAULT_DESCRIPTION,
    author: str = DEFAULT_AUTHOR,
    license_id: str = "MIT",
) -> dict[str, str]:
    """Render every generated file; returns {relative path: content}."""
    if license_id not in LICENSE_IDS:
        raise ValueError(f"unknown license {license_id!r}; expected one of {LICENSE_IDS}")
    slug = normalize_package_name(name)
    module = slug_to_module(slug)
    description = description.strip() or DEFAULT_DESCRIPTION
    author = author.strip() or DEFAULT_AUTHOR
    year, iso = default_iso_year()

    ctx: dict[str, str] = {
        "slug": slug,
        "module": module,
        "description": description,
        "author": author,
        "year": year,
        "iso": iso,
        "licenseLine": "" if license_id == "none" else f'license = "{license_id}"\n',
        "licenseBadge": ""
        if license_id == "none"
        else f"[![license](https://img.shields.io/pypi/l/{slug})](./LICENSE)\n",
    }

    def t(key: str) -> str:
        return render_template(TEMPLATES[key], ctx)

    files: dict[str, str] = {
        "pyproject.toml": t("pyproject.toml"),
        "README.md": t("README.md"),
    }
    if license_id == "MIT":
        files["LICENSE"] = t("LICENSE-MIT")
    elif license_id == "Apache-2.0":
        files["LICENSE"] = t("LICENSE-Apache-2.0")

    files.update(
        {
            ".gitignore": t(".gitignore"),
            ".pre-commit-config.yaml": t(".pre-commit-config.yaml"),
            ".github/workflows/ci.yml": t(".github/workflows/ci.yml"),
            ".github/workflows/publish.yml": t(".github/workflows/publish.yml"),
            f"src/{module}/__init__.py": t("__init__.py"),
            f"src/{module}/main.py": t("main.py"),
            "tests/test_main.py": t("test_main.py"),
            "docs/index.md": t("docs/index.md"),
            "bb.json": t("bb.json"),
            ".ctxignore": t(".ctxignore"),
            "policy.json": t("policy.json"),
            "routes.json": t("routes.json"),
            "commitlog.json": t("commitlog.json"),
        }
    )
    return files


# --------------------------------------------------------------------------
# input collection
# --------------------------------------------------------------------------


def collect_non_interactive_input(args: argparse.Namespace) -> dict[str, str]:
    """Resolve final config values from flags only (no prompts ever)."""
    return {
        "name": args.name,
        "description": (args.description or "").strip() or DEFAULT_DESCRIPTION,
        "author": (args.author or "").strip() or DEFAULT_AUTHOR,
        "license": args.license or "MIT",
    }


def collect_interactive_input(args: argparse.Namespace) -> dict[str, str]:
    """Prompt for anything not supplied as a flag."""
    config = collect_non_interactive_input(args)
    if not args.name:
        config["name"] = prompt_with_default("project name", "")
    if (args.description or "").strip() == "":
        config["description"] = prompt_with_default(
            "description", DEFAULT_DESCRIPTION
        )
    if (args.author or "").strip() == "":
        config["author"] = prompt_with_default("author", DEFAULT_AUTHOR)
    if not args.license:
        config["license"] = prompt_license()
    return config


def prompt_with_default(label: str, default: str) -> str:
    try:
        raw = input(f"{label} [{default}]: ").strip()
    except EOFError:
        raw = ""
    return raw or default


def prompt_license() -> str:
    raw = prompt_with_default("license (MIT/Apache-2.0/none)", "MIT")
    while raw not in LICENSE_IDS:
        print(f"  ? '{raw}' is not one of {', '.join(LICENSE_IDS)}")
        raw = prompt_with_default("license (MIT/Apache-2.0/none)", "MIT")
    return raw


# --------------------------------------------------------------------------
# writer
# --------------------------------------------------------------------------


def write_project(files: dict[str, str], root: Path, force: bool) -> list[str]:
    """Write files under root. Returns paths written. Refuses to overwrite
    existing files unless force=True."""
    written: list[str] = []
    conflicts = [rel for rel in files if (root / rel).exists()]
    if conflicts and not force:
        raise FileExistsError(
            "refusing to overwrite existing file(s): "
            + ", ".join(sorted(conflicts))
            + " — re-run with --force to overwrite"
        )
    for rel, content in sorted(files.items()):
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8", newline="\n")
        written.append(rel)
    return written


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="blueprint",
        description="BillyBox Project Scaffolder — one command, whole standard.",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command")

    p_new = sub.add_parser("new", help="scaffold a new BillyBox project")
    p_new.add_argument("name", nargs="?", help="project name (free-form; normalized to a slug)")
    p_new.add_argument("-d", "--description", help="project description")
    p_new.add_argument("-a", "--author", help="author name")
    p_new.add_argument("-l", "--license", choices=list(LICENSE_IDS), help="license id")
    p_new.add_argument("--no-interactive", action="store_true", help="never prompt")
    p_new.add_argument("--dry-run", action="store_true", help="print the tree, write nothing")
    p_new.add_argument("-f", "--force", action="store_true", help="overwrite existing files")
    return parser


def cmd_new(args: argparse.Namespace) -> int:
    if args.no_interactive and not args.name:
        print("error: --no-interactive requires a project name", file=sys.stderr)
        return 2
    if args.name and args.license:
        # fully specified — behave like --no-interactive even if the flag slipped
        pass
    config = (
        collect_non_interactive_input(args)
        if args.no_interactive
        else collect_interactive_input(args)
    )
    slug = normalize_package_name(config["name"])
    files = generate_project(
        config["name"],
        description=config["description"],
        author=config["author"],
        license_id=config["license"],
    )

    if args.dry_run:
        print(f"dry run — would create {len(files)} files for '{slug}':")
        for rel in sorted(files):
            print(f"  {rel}  ({len(files[rel].encode('utf-8'))} bytes)")
        return 0

    root = Path.cwd() / slug
    try:
        written = write_project(files, root, force=args.force)
    except FileExistsError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    print(f"scaffolded {len(written)} files into {root}/")
    for rel in written:
        print(f"  {rel}")
    print("\nnext steps:")
    print(f"  cd {slug}")
    print("  pip install -e . && pytest")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command == "new":
        return cmd_new(args)
    parser.print_help()
    return 0 if argv is not None else 1


if __name__ == "__main__":
    raise SystemExit(main())
