# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- `package.json`: added `engines.node >= 20` floor (#45) — the lowest version satisfying every installed dependency's own requirement (vitest 4 needs ^20/^22/>=24; @vitejs/plugin-react 5 needs ^20.19/>=22.12).
- All dependencies pinned to exact versions instead of `^` caret ranges (#45) — `npm ci` now reproduces the maintainer's tree and `npm install` cannot silently bump transitive drift into the lockfile's declared surface.
- `lint:deps` script runs the pinned local `depcheck` (added as a devDependency) instead of `npx depcheck`, which fetched the latest registry version on every run, bypassing the lockfile (#45).

### Docs
- README + CONTRIBUTING now instruct contributors to use `npm ci` (not `npm install`) so the committed lockfile stays authoritative (#45).

### Added
- Comprehensive README with badge bar, quick start, usage, directory tree, and architecture diagram.
- `CHANGELOG.md` for tracking breaking changes in template schemas and CLI flags.
- `CONTRIBUTING.md` with extension guide for adding new template flavors.
- Expanded `.gitignore` with Python, OS, and IDE artifact patterns.

## [0.1.0] - 2026-01-23

### Added
- Single-file, stdlib-only Python CLI (`blueprint.py`) — 16 embedded templates rendered with `{{variable}}` substitution.
- `new` subcommand with `--no-interactive`, `--dry-run`, `--force`, and `--version` flags.
- License support: `MIT`, `Apache-2.0`, or `none`.
- Generated projects include: `pyproject.toml` (hatchling), README with badges, `.pre-commit-config.yaml`, CI (pytest matrix 3.10→3.13), OIDC `publish.yml` with tag-vs-version guard, `src/<pkg>/__init__.py` + `main.py` argparse entry point, passing tests, and full BillyBox wiring (`bb.json`, `.ctxignore`, `policy.json`, `routes.json`, `commitlog.json`).
- 23-test unittest suite covering naming, rendering, generation, input collection, and CLI integration.
- Vite + React + Tailwind marketing site at `src/` using the same substitution engine.
- GitHub Actions CI (unittest matrix on ubuntu + windows) and OIDC trusted publishing workflow.
