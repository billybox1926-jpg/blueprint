# blueprint

> BillyBox Project Scaffolder — one command turns a blank directory into a production-ready BillyBox-standard repo.

This repository contains two things:

1. **`blueprint.py`** — the real CLI: a single-file, stdlib-only Python scaffolder (shipped as v0.1.0).
2. **`src/`** — a marketing/demo site (Vite + React + Tailwind) that previews exactly what the CLI generates, using the same substitution engine.

## The CLI

```bash
python blueprint.py new my-project --author "Billy Box" --license MIT --no-interactive
```

| Flag | Purpose |
| --- | --- |
| `-d, --description` | project description |
| `-a, --author` | author name |
| `-l, --license` | `MIT`, `Apache-2.0`, or `none` |
| `--no-interactive` | never prompt; flags/defaults only |
| `--dry-run` | print the tree, write nothing |
| `-f, --force` | overwrite existing files |

Generated projects include: `pyproject.toml` (setuptools), README with badges, `.pre-commit-config.yaml`, CI (pytest matrix 3.9→3.12), OIDC `publish.yml` with tag-vs-version guard, `src/<pkg>/__init__.py` + `main.py` argparse entry point, passing tests, and full BillyBox wiring (`bb.json`, `.ctxignore`, `policy.json`, `routes.json`, `commitlog.json`).

## Development (site)

```bash
npm install
npm run dev        # vite dev server on localhost:3000
npm run build      # production build to dist/
npm run typecheck  # tsc --noEmit
```

## Architecture

```
blueprint.py            single-file CLI: templates + renderer + writer + argparse
tests/                  23-test unittest suite for the CLI
src/
  main.tsx              entry — mounts <App /> inside an ErrorBoundary
  App.tsx               component composition
  components/           Chrome (top bar/footer), Hero, ScaffoldLab, Sections, ui
  lib/hooks.ts          useInView / useCopy / useScramble
  lib/templates/        split template engine:
    types.ts            ProjectConfig/Lang types + naming helpers
    bodies.ts           the 16 embedded file templates
    renderer.ts         $var substitution → GeneratedFile[]
    manifest.ts         defaults, viewer notes, as-built test facts
    index.ts            barrel (public API unchanged)
.github/workflows/      repo-level ci.yml (unittest matrix) + publish.yml (OIDC)
```

## License

MIT — see [LICENSE](./LICENSE).
