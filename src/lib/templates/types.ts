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

/** normalize_package_name() from blueprint.py — kebab-case slug */
export function normalizePackageName(raw: string): string {
  const s = (raw.trim() || "my-project").toLowerCase();
  let out = "";
  let prevDash = false;
  for (const ch of s) {
    if (/[a-z0-9]/.test(ch)) {
      out += ch;
      prevDash = false;
    } else if (!prevDash && out) {
      out += "-";
      prevDash = true;
    }
  }
  out = out.replace(/^-+|-+$/g, "");
  return out || "my-project";
}

/** slug_to_module() from blueprint.py — kebab-case → snake_case */
export function slugToModule(slug: string): string {
  let m = slug.replace(/-/g, "_");
  if (m && /^\d/.test(m)) {
    m = "_" + m;
  }
  return m || "my_project";
}

/** normalizePackage() — full pipeline: raw name → snake_case module */
export function normalizePackage(raw: string): string {
  return slugToModule(normalizePackageName(raw));
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

