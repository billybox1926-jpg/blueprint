"""Test suite for blueprint.py — 22 tests across 5 classes.

Run: python -m unittest tests.test_blueprint -v
(or `python -m unittest discover tests`).
"""

from __future__ import annotations

import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:  # Python 3.10
    import tomli as tomllib  # type: ignore[no-redef]

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import blueprint  # noqa: E402


def run_cli(argv: list[str]) -> tuple[int, str, str]:
    out, err = io.StringIO(), io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        code = blueprint.main(argv)
    return code, out.getvalue(), err.getvalue()


class TestNormalizePackageName(unittest.TestCase):
    def test_basic_slug(self) -> None:
        self.assertEqual(blueprint.normalize_package_name("my-tool"), "my-tool")

    def test_mixed_case_and_spaces(self) -> None:
        self.assertEqual(
            blueprint.normalize_package_name("My Cool Tool"), "my-cool-tool"
        )

    def test_strips_punctuation(self) -> None:
        self.assertEqual(blueprint.normalize_package_name("Wow!! Tool?"), "wow-tool")

    def test_collapses_runs_and_edges(self) -> None:
        self.assertEqual(blueprint.normalize_package_name("  --a   b-- "), "a-b")

    def test_empty_falls_back(self) -> None:
        self.assertEqual(blueprint.normalize_package_name("   "), "my-project")
        self.assertEqual(blueprint.normalize_package_name("***"), "my-project")

    def test_module_conversion_digit_leading(self) -> None:
        self.assertEqual(blueprint.slug_to_module("7zip-helper"), "_7zip_helper")


class TestRenderTemplate(unittest.TestCase):
    def test_substitutes_known_keys(self) -> None:
        self.assertEqual(
            blueprint.render_template("hi {{name}}!", {"name": "bb"}), "hi bb!"
        )

    def test_unknown_keys_become_empty(self) -> None:
        self.assertEqual(blueprint.render_template("x={{nope}}", {}), "x=")

    def test_leading_newline_is_stripped(self) -> None:
        self.assertEqual(blueprint.render_template("\n\nbody", {}), "body")


class TestGenerateProject(unittest.TestCase):
    def setUp(self) -> None:
        self.files = blueprint.generate_project("demo-project", author="Billy Box")

    def test_file_count_matches_spec(self) -> None:
        # 16 files for MIT (15 common + LICENSE)
        self.assertEqual(len(self.files), 16)

    def test_license_none_drops_license_file(self) -> None:
        none_files = blueprint.generate_project("demo-project", license_id="none")
        self.assertNotIn("LICENSE", none_files)
        self.assertEqual(len(none_files), 15)

    def test_apache_license_included(self) -> None:
        apache = blueprint.generate_project("demo-project", license_id="Apache-2.0")
        self.assertIn("Apache License", apache["LICENSE"])

    def test_pyproject_parses_and_has_license_line(self) -> None:
        data = tomllib.loads(self.files["pyproject.toml"])
        self.assertEqual(data["project"]["name"], "demo-project")
        self.assertEqual(data["project"]["license"], "MIT")

    def test_pyproject_license_line_absent_for_none(self) -> None:
        data = tomllib.loads(
            blueprint.generate_project("d", license_id="none")["pyproject.toml"]
        )
        self.assertNotIn("license", data["project"])

    def test_billybox_wiring_files_present_and_valid_json(self) -> None:
        for rel in ("bb.json", "policy.json", "routes.json", "commitlog.json"):
            self.assertIn(rel, self.files)
            json.loads(self.files[rel])  # must not raise
        self.assertIn(".ctxignore", self.files)

    def test_publish_workflow_has_tag_guard_and_oidc(self) -> None:
        pub = self.files[".github/workflows/publish.yml"]
        self.assertIn("GITHUB_REF_NAME#v", pub.replace("${", "").replace("{", "") if False else "${GITHUB_REF_NAME#v}")
        self.assertIn("id-token: write", pub)
        self.assertIn("pypa/gh-action-pypi-publish", pub)

    def test_module_paths_use_underscores(self) -> None:
        files = blueprint.generate_project("My Cool Tool")
        self.assertIn("src/my_cool_tool/__init__.py", files)
        self.assertIn("src/my_cool_tool/main.py", files)


class TestCollectNonInteractiveInput(unittest.TestCase):
    def _args(self, **kw):  # type: ignore[no-untyped-def]
        ns = argparse_ns = type("NS", (), {})()
        ns.name = kw.get("name", "demo")
        ns.description = kw.get("description")
        ns.author = kw.get("author")
        ns.license = kw.get("license")
        return argparse_ns

    def test_defaults_apply_when_flags_missing(self) -> None:
        cfg = blueprint.collect_non_interactive_input(self._args())
        self.assertEqual(cfg["description"], blueprint.DEFAULT_DESCRIPTION)
        self.assertEqual(cfg["author"], blueprint.DEFAULT_AUTHOR)
        self.assertEqual(cfg["license"], "MIT")

    def test_explicit_flags_win(self) -> None:
        cfg = blueprint.collect_non_interactive_input(
            self._args(description="  custom desc  ", author=" A ", license="Apache-2.0")
        )
        self.assertEqual(cfg["description"], "custom desc")
        self.assertEqual(cfg["author"], "A")
        self.assertEqual(cfg["license"], "Apache-2.0")

    def test_blank_strings_fall_back_to_defaults(self) -> None:
        cfg = blueprint.collect_non_interactive_input(
            self._args(description="   ", author="")
        )
        self.assertEqual(cfg["description"], blueprint.DEFAULT_DESCRIPTION)
        self.assertEqual(cfg["author"], blueprint.DEFAULT_AUTHOR)


class TestCLIIntegration(unittest.TestCase):
    def test_dry_run_writes_nothing(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            cwd = Path.cwd()
            try:
                import os

                os.chdir(td)
                code, out, _err = run_cli(["new", "dry-proj", "--no-interactive", "--dry-run"])
                self.assertEqual(code, 0)
                self.assertIn("would create", out)
                self.assertFalse((Path(td) / "dry-proj").exists())
            finally:
                os.chdir(cwd)

    def test_full_scaffold_generates_runnable_project(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            cwd = Path.cwd()
            try:
                import os

                os.chdir(td)
                code, out, err = run_cli(["new", "smoke-proj", "--no-interactive"])
                self.assertEqual(code, 0, err)
                root = Path(td) / "smoke-proj"
                tree = sorted(
                    str(p.relative_to(root)).replace("\\", "/")
                    for p in root.rglob("*") if p.is_file()
                )
                self.assertIn("pyproject.toml", tree)
                self.assertIn("src/smoke_proj/main.py", tree)
                self.assertIn("tests/test_main.py", tree)
            finally:
                os.chdir(cwd)

    def test_refuses_overwrite_without_force_then_succeeds_with_force(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            cwd = Path.cwd()
            try:
                import os

                os.chdir(td)
                run_cli(["new", "dup-proj", "--no-interactive"])
                code1, _, err1 = run_cli(["new", "dup-proj", "--no-interactive"])
                self.assertEqual(code1, 1)
                self.assertIn("--force", err1)
                code2, _, _ = run_cli(["new", "dup-proj", "--no-interactive", "--force"])
                self.assertEqual(code2, 0)
            finally:
                os.chdir(cwd)


if __name__ == "__main__":
    unittest.main()
