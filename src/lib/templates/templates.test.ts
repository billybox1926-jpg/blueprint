import { describe, expect, it } from "vitest";
import {
  formatBytes,
  normalizePackage,
  normalizePackageName,
  projectName,
  slugToModule,
} from "./types";
import { renderProject } from "./renderer";

describe("normalizePackageName", () => {
  it("produces a kebab-case slug", () => {
    expect(normalizePackageName("My Cool Tool")).toBe("my-cool-tool");
  });

  it("strips punctuation and collapses runs", () => {
    expect(normalizePackageName("Wow!! Tool?")).toBe("wow-tool");
  });

  it("falls back on empty input", () => {
    expect(normalizePackageName("   ")).toBe("my-project");
    expect(normalizePackageName("***")).toBe("my-project");
  });
});

describe("slugToModule", () => {
  it("converts hyphens to underscores", () => {
    expect(slugToModule("my-cool-tool")).toBe("my_cool_tool");
  });

  it("prefixes an underscore when starting with a digit", () => {
    expect(slugToModule("7zip-helper")).toBe("_7zip_helper");
  });

  it("falls back on empty input", () => {
    expect(slugToModule("")).toBe("my_project");
  });
});

describe("normalizePackage", () => {
  it("matches Python: My Cool Tool → my_cool_tool", () => {
    expect(normalizePackage("My Cool Tool")).toBe("my_cool_tool");
  });

  it("matches Python: local drift detector → local_drift_detector", () => {
    expect(normalizePackage("local drift detector")).toBe("local_drift_detector");
  });

  it("matches Python: my-cool-tool → my_cool_tool", () => {
    expect(normalizePackage("my-cool-tool")).toBe("my_cool_tool");
  });

  it("prefixes an underscore when starting with a digit", () => {
    expect(normalizePackage("7zip-helper")).toBe("_7zip_helper");
  });
});

describe("projectName", () => {
  it("keeps the raw name", () => {
    expect(projectName("  My Tool ")).toBe("My Tool");
  });

  it("falls back on empty input", () => {
    expect(projectName("   ")).toBe("my-project");
  });
});

describe("renderProject matches the Python CLI naming (#41)", () => {
  // blueprint.py generate_project() puts normalize_package_name(name) into
  // every {{slug}} slot and slug_to_module(slug) into every {{module}} slot —
  // never the raw input. The TS renderer must produce identical output.
  const cases = [
    ["My Cool Tool", "my-cool-tool", "my_cool_tool"],
    ["my cool tool", "my-cool-tool", "my_cool_tool"],
    ["My_Tool", "my-tool", "my_tool"],
    ["my__project", "my-project", "my_project"],
    ["7zip helper", "7zip-helper", "_7zip_helper"],
    ["Wow!! Tool?", "wow-tool", "wow_tool"],
    ["local drift detector", "local-drift-detector", "local_drift_detector"],
  ] as const;

  const cfg = (name: string) => ({
    name,
    description: "A test project",
    author: "Billy Box",
    license: "MIT" as const,
  });

  for (const [input, slug, mod] of cases) {
    it(`"${input}" → project_name=${slug}, package_name=${mod}`, () => {
      const files = renderProject(cfg(input));
      const pyproject = files.find((f) => f.path === "pyproject.toml")!.content;
      expect(pyproject).toContain(`name = "${slug}"`);
      expect(pyproject).toContain(`${mod} = "${mod}.main:main"`);
      expect(pyproject).toContain(`packages = ["src/${mod}"]`);
      const readme = files.find((f) => f.path === "README.md")!.content;
      expect(readme).toContain(`# ${slug}`);
      const paths = files.map((f) => f.path);
      expect(paths).toContain(`src/${mod}/__init__.py`);
    });
  }

  it("does not leak raw input casing into any rendered file", () => {
    const files = renderProject(cfg("My Cool Tool"));
    for (const f of files) {
      if (f.path === "LICENSE") continue; // copyright line keeps $author
      expect(f.content).not.toContain("My Cool Tool");
    }
  });
});

describe("formatBytes", () => {
  it("formats bytes under 1 KB", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes with one decimal", () => {
    expect(formatBytes(2048)).toBe("2.0 KB");
  });
});

describe("renderProject", () => {
  const cfg = {
    name: "demo-project",
    description: "A test project",
    author: "Billy Box",
    license: "MIT" as const,
  };

  it("renders 16 files for MIT (15 common + LICENSE)", () => {
    const files = renderProject(cfg);
    expect(files).toHaveLength(16);
  });

  it("omits LICENSE when license is none", () => {
    const files = renderProject({ ...cfg, license: "none" });
    expect(files.some((f) => f.path === "LICENSE")).toBe(false);
  });

  it("substitutes the package name into module paths", () => {
    const files = renderProject(cfg);
    const paths = files.map((f) => f.path);
    expect(paths).toContain("src/demo_project/__init__.py");
    expect(paths).toContain("src/demo_project/main.py");
  });

  it("computes byte sizes from rendered content", () => {
    const files = renderProject(cfg);
    for (const f of files) {
      expect(f.bytes).toBe(new TextEncoder().encode(f.content).length);
    }
  });
});
