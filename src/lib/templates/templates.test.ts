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
