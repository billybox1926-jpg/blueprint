import { describe, expect, it } from "vitest";
import { formatBytes, normalizePackage, projectName } from "./types";
import { renderProject } from "./renderer";

describe("normalizePackage", () => {
  it("converts hyphens to underscores", () => {
    expect(normalizePackage("my-tool")).toBe("my_tool");
  });

  it("lowercases and strips special characters", () => {
    expect(normalizePackage("My Cool Tool!")).toBe("mycooltool");
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

  it("renders 15 files for MIT (14 common + LICENSE)", () => {
    const files = renderProject(cfg);
    expect(files).toHaveLength(15);
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
