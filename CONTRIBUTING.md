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
