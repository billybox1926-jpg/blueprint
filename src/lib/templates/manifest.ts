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
  "pyproject.toml": "hatchling · script entry point · PyPI metadata · ruff + mypy + pytest tooling",
  "README.md": "install · usage · dev loop · license",
  LICENSE: "full text embedded — MIT or Apache-2.0",
  ".gitignore": "python + packaging + venv + IDE + OS",
  ".pre-commit-config.yaml": "ruff + mypy + housekeeping hooks",
  "ci.yml": "matrix 3.10 → 3.13 · quality job (ruff + mypy) · test job (pytest whole tree)",
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
      "test_basic_slug",
      "test_mixed_case_and_spaces",
      "test_strips_punctuation",
      "test_collapses_runs_and_edges",
      "test_empty_falls_back",
      "test_module_conversion_digit_leading",
    ],
  },
  {
    name: "TestRenderTemplate",
    tests: [
      "test_substitutes_known_keys",
      "test_unknown_keys_become_empty",
      "test_leading_newline_is_stripped",
    ],
  },
  {
    name: "TestGenerateProject",
    tests: [
      "test_file_count_matches_spec",
      "test_license_none_drops_license_file",
      "test_apache_license_included",
      "test_pyproject_parses_and_has_license_line",
      "test_pyproject_license_line_absent_for_none",
      "test_billybox_wiring_files_present_and_valid_json",
      "test_publish_workflow_has_tag_guard_and_oidc",
      "test_module_paths_use_underscores",
    ],
  },
  {
    name: "TestCollectNonInteractiveInput",
    tests: [
      "test_defaults_apply_when_flags_missing",
      "test_explicit_flags_win",
      "test_blank_strings_fall_back_to_defaults",
    ],
  },
  {
    name: "TestCLIIntegration",
    note: "subprocess · end-to-end",
    tests: [
      "test_dry_run_writes_nothing",
      "test_full_scaffold_generates_runnable_project",
      "test_refuses_overwrite_without_force_then_succeeds_with_force",
    ],
  },
  {
    name: "TestTemplateEngineParity",
    note: "#42 — Actions ${{…}} preserved · main.py fully substituted",
    tests: [
      "test_actions_expression_survives_render",
      "test_main_py_fully_substituted",
    ],
  },
];

export const ANATOMY: { section: string; rows: [string, string][] }[] = [
  {
    section: "TEMPLATES",
    rows: [
      ["17 constants", "pyproject.toml → commitlog.json, embedded verbatim"],
      ["3 license states", "MIT · Apache-2.0 · none (LICENSE dropped)"],
    ],
  },
  {
    section: "CORE LOGIC",
    rows: [
      ["normalize_package_name()", "my-project → my_project, leading-digit guard"],
      ["slug_to_module()", "kebab-case slug → importable module name"],
      ["get_license_info()", "id → template + SPDX + display name"],
      ["collect_interactive_input()", "prompt-driven, with defaults"],
      ["collect_non_interactive_input()", "flags only, fails on missing name"],
      ["render_template()", "{{var}} substitution · ${{…}} (Actions) preserved"],
      ["generate_project()", "mkdir tree · --dry-run · --force"],
    ],
  },
  {
    section: "CLI",
    rows: [["argparse", "verb new + 8 flags, --version included"]],
  },
];

export const IMPORTS = ["argparse", "json", "sys", "datetime", "pathlib"];

export const MANIFEST = [
  { name: "blueprint.py", note: "the whole tool — 17 templates embedded" },
  { name: "pyproject.toml", note: "entry point: blueprint = blueprint:main" },
  { name: "README.md" },
  { name: "LICENSE" },
  { name: ".gitignore" },
  { name: ".pre-commit-config.yaml" },
  { name: "tests/test_blueprint.py", note: "25 tests · 6 suites" },
  { name: ".github/workflows/ci.yml", note: "eats its own dogfood" },
];
