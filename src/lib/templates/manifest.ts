/* ------------------------------------------------------------------
 * blueprint · manifest — defaults, viewer notes, as-built test facts
 * ------------------------------------------------------------------ */

import type { ProjectConfig } from "./types";

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
