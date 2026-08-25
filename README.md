# blueprint

[![ci](https://github.com/billybox1926-jpg/blueprint/actions/workflows/ci.yml/badge.svg)](https://github.com/billybox1926-jpg/blueprint/actions/workflows/ci.yml)
[![python](https://img.shields.io/badge/python-3.10%2B-57aeff)](https://www.python.org/)
[![license](https://img.shields.io/badge/license-MIT-57aeff)](./LICENSE)

> BillyBox Project Scaffolder — one command turns a blank directory into a production-ready BillyBox-standard repo.

This repository contains two things:

1. **`blueprint.py`** — the real CLI: a single-file, stdlib-only Python scaffolder (shipped as v0.1.0).
2. **`src/`** — a marketing/demo site (Vite + React + Tailwind) that previews exactly what the CLI generates, using the same substitution engine.

## Quick Start

```bash
git clone https://github.com/billybox1926-jpg/blueprint.git
cd blueprint

# scaffold a new project (fully non-interactive)
python blueprint.py new my-project --author "Billy Box" --license MIT --no-interactive

# or dry-run to preview what would be written
python blueprint.py new my-project --no-interactive --dry-run
```

## The CLI

```
python blueprint.py new <name> [options]
python blueprint.py --help
```

| Flag | Purpose |
| --- | --- |
| `-d, --description TEXT` | project description (default: "A BillyBox tool.") |
| `-a, --author TEXT` | author name (default: "Billy Box") |
| `-l, --license ID` | `MIT` \| `Apache-2.0` \| `none` (default: MIT) |
| `--no-interactive` | never prompt; take everything from flags/defaults |
| `--dry-run` | print the tree instead of writing anything |
| `-f, --force` | overwrite existing files |
| `-V, --version` | print version and exit |

Generated projects include: `pyproject.toml` (hatchling), README with badges, `.pre-commit-config.yaml`, CI (pytest matrix 3.10→3.13), OIDC `publish.yml` with tag-vs-version guard, `src/<pkg>/__init__.py` + `main.py` argparse entry point, passing tests, and full BillyBox wiring (`bb.json`, `.ctxignore`, `policy.json`, `routes.json`, `commitlog.json`).

## Generated Project Structure

```
my-project/
├── .github/
│   └── workflows/
│       ├── ci.yml              # pytest matrix 3.10→3.13
│       └── publish.yml         # OIDC trusted publishing + tag guard
├── docs/
│   └── index.md                # documentation skeleton
├── src/
│   └── my_project/
│       ├── __init__.py         # __version__ = "0.1.0"
│       └── main.py             # argparse entry point
├── tests/
│   └── test_main.py            # passing version + main tests
├── .ctxignore                  # keep ctxpack context lean
├── .gitignore                  # Python + OS + IDE artifacts
├── .pre-commit-config.yaml     # ruff + mypy + pre-commit-hooks
├── bb.json                     # project identity + suite defaults
├── commitlog.json              # release notes consumed by commitlog
├── LICENSE                     # MIT / Apache-2.0 / none
├── policy.json                 # policies checked by policy-runner
├── pyproject.toml              # hatchling build, ruff, mypy, pytest
├── README.md                   # badges + install + quickstart
└── routes.json                 # fixtures served by mockroute
```

## Architecture

```
[Blueprint Templates] ──► [BillyBox Scaffolder Engine] ──► [Initialized Project Workspace]
      (16 embedded               (blueprint.py:                    (16 files, zero deps,
       str templates)            render → write)                    BillyBox-standard)
```

### Template Engine

Every template lives in `blueprint.py` as a plain `str` constant. Rendering is plain `{{variable}}` substitution — zero dependencies, same engine as the web mockup at `src/lib/templates.ts`. Unknown placeholders resolve to empty strings.

### Naming

- `normalize_package_name("My Cool Tool!")` → `"my-cool-tool"` (kebab-case slug)
- `slug_to_module("my-cool-tool")` → `"my_cool_tool"` (importable module)
- Leading digits get an underscore prefix: `"7zip"` → `"_7zip"`

## Development (site)

The `src/` directory is a Vite + React + Tailwind demo site that previews exactly what the CLI generates, using the same substitution engine.

```bash
npm install
npm run dev        # vite dev server on localhost:3000
npm run build      # production build to dist/
npm run typecheck  # tsc --noEmit
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add new template flavors, run tests, and submit changes.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for breaking changes in template schemas or CLI flags.

## License

MIT — see [LICENSE](./LICENSE).
