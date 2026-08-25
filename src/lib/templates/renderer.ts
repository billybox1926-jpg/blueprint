/* ------------------------------------------------------------------
 * blueprint · renderer — substitutes $vars into the embedded bodies
 * ------------------------------------------------------------------ */

import type { GeneratedFile, Lang, LicenseId, ProjectConfig } from "./types";
import { normalizePackageName, slugToModule } from "./types";
import {
  T_BB_JSON,
  T_CI,
  T_COMMITLOG,
  T_CTXIGNORE,
  T_DOCS_INDEX,
  T_GITIGNORE,
  T_INIT,
  T_LICENSE_APACHE,
  T_LICENSE_MIT,
  T_MAIN,
  T_POLICY,
  T_PRECOMMIT,
  T_PUBLISH,
  T_PYPROJECT,
  T_README,
  T_ROUTES,
  T_TEST,
} from "./bodies";

const TOKENS =
  /\$(project_name|package_name|description|author|license_spdx|license_name|year|iso|licenseLine|licenseBadge|version)/g;

function substitute(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(TOKENS, (_, k: string) => vars[k] ?? "");
}

const enc = new TextEncoder();
const size = (s: string) => enc.encode(s).length;

function licenseInfo(id: LicenseId): { spdx: string; name: string } {
  if (id === "MIT") return { spdx: "MIT", name: "MIT License" };
  if (id === "Apache-2.0")
    return { spdx: "Apache-2.0", name: "Apache License 2.0" };
  return { spdx: "NONE", name: "No License" };
}

export const CANONICAL_VERSION = "0.1.0";

export function renderProject(cfg: ProjectConfig): GeneratedFile[] {
  // The CLI's generate_project() uses the kebab-case slug as the display
  // name everywhere ({{slug}} in pyproject.toml, README title, badges) —
  // never the raw user input. Mirror that: project_name is the slug.
  const pName = normalizePackageName(cfg.name);
  const pkg = slugToModule(pName);
  const { spdx, name: licName } = licenseInfo(cfg.license);

  const year = new Date().getFullYear().toString();
  const iso = `${year}-01-01T00:00:00Z`;

  const licenseLine = cfg.license === "none" ? "" : `license = "${cfg.license}"\n`;
  const licenseBadge = cfg.license === "none" ? "" : `[![license](https://img.shields.io/pypi/l/${pName})](./LICENSE)\n`;

  const vars: Record<string, string> = {
    project_name: pName,
    package_name: pkg,
    description: cfg.description,
    author: cfg.author || "Unknown",
    license_spdx: spdx,
    license_name: licName,
    year,
    iso,
    licenseLine,
    licenseBadge,
    version: CANONICAL_VERSION,
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
    mk("docs/index.md", "markdown", T_DOCS_INDEX),
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
