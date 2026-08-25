# Contributing to blueprint

## Local setup

```bash
npm install
npm run dev        # vite dev server on http://localhost:3000
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | dev server (localhost:3000) |
| `npm run build` | production build to `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | vitest unit tests |
| `npx vitest` | vitest watch mode |
| `python -m unittest discover tests` | CLI test suite (stdlib only) |

## Project structure

See [README](./README.md#architecture). In short: `blueprint.py` is the shipped CLI; `src/` is the demo site whose template engine mirrors it.

## Error handling conventions (#34)

One pattern, three layers:

1. **Render errors** → the top-level `<ErrorBoundary>` (`src/components/ErrorBoundary.tsx`) catches anything thrown during render and shows a styled "Draft torn" fallback. Never wrap components in local try/catch for render errors.
2. **Async / user-action failures** (clipboard, network, storage) → catch locally, degrade gracefully, and surface state through the hook's own signal (e.g. `useCopy` resets its copied flag either way). No unhandled promise rejections, no alerts.
3. **Programmer errors** (bad props, invariant violations) → let them throw. Do not swallow: they should trip the ErrorBoundary during development.

Checklist for a new component:
- [ ] No silent `catch {}` without a comment explaining why silence is correct
- [ ] Async failures reflected in UI state, not just console
- [ ] No try/catch around JSX rendering

## Tests

Unit tests live next to the code as `*.test.ts` and run under `vitest`
(`src/lib/templates/templates.test.ts` covers the pure template functions).
The Python CLI suite is stdlib-only unittest — keep it that way.

## How to Add a New Template Flavor

A "template flavor" is a new set of files that `blueprint.py` can generate. Here's how to add one:

1. **Add the template constant** in `blueprint.py` following the existing pattern:
   ```python
   T_NEW_FILE = """\
   content with {{slug}} and {{module}} placeholders
   """
   ```

2. **Register it in the `TEMPLATES` dict** (around line 587):
   ```python
   TEMPLATES: dict[str, str] = {
       ...
       "new-file.txt": T_NEW_FILE,
   }
   ```

3. **Add it to `generate_project()`** (around line 654) so it's included in the output files dict.

4. **Mirror the template in `src/lib/templates.ts`** so the marketing site preview stays in sync.

5. **Add tests** in `tests/test_blueprint.py` covering:
   - The new file is present in generated output.
   - Placeholders are correctly substituted.
   - Edge cases (empty name, special characters, etc.).

6. **Update the README** directory tree and this guide if the new flavor changes the generated project structure.

## Code Style

- Python: ruff + mypy --strict (enforced by pre-commit).
- TypeScript: tsc --noEmit (enforced by `npm run typecheck`).
- All templates use `{{variable}}` substitution — no f-strings, no `.format()`.

## Pull Request Process

1. Fork the repo and create a feature branch.
2. Make your changes and add tests.
3. Run the full test suite and confirm all tests pass.
4. Update `CHANGELOG.md` under `[Unreleased]`.
5. Submit a PR with a clear description of what changed and why.

## Code of Conduct

Be respectful, constructive, and direct. This is a solo-builder project — contributions should keep the tool lightweight and dependency-free.
