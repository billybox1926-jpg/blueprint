/* ------------------------------------------------------------------
 * blueprint · template types + naming helpers (mirror blueprint.py)
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

