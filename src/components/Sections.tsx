import { ANATOMY, IMPORTS, MANIFEST, TEST_SUITES } from "../lib/templates";
import {
  ArrowIcon,
  CheckIcon,
  CopyButton,
  CrossIcon,
  FileIcon,
  FolderIcon,
  Reveal,
  SectionHeading,
  StatusDot,
} from "./ui";

/* ================= LIFECYCLE ================= */

interface Stage {
  idx: string;
  name: string;
  cmd: string;
  tools: string[];
  highlight?: boolean;
  tag?: string;
}

const STAGES: Stage[] = [
  {
    idx: "01",
    name: "Start",
    cmd: "blueprint new",
    tools: ["pyproject", "ci + publish", "bb wiring"],
    highlight: true,
    tag: "this tool",
  },
  { idx: "02", name: "Configure", cmd: "bb init", tools: ["bb.json", "policy.json", "routes.json"] },
  {
    idx: "03",
    name: "Develop",
    cmd: "daily work",
    tools: ["ctxpack", "mockroute", "config-drift", "policy-runner"],
  },
  { idx: "04", name: "Validate", cmd: "bb preflight", tools: ["ruff", "mypy", "pytest", "pre-commit"] },
  { idx: "05", name: "Release", cmd: "bb release", tools: ["commitlog", "publish.yml", "OIDC"] },
];

export function Lifecycle() {
  return (
    <section id="lifecycle" className="relative z-10 scroll-mt-20 border-y border-line/60 bg-ink/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 02"
          kicker="where it sits"
          title="The BillyBox lifecycle"
          note="Nine tools cover configure → release. blueprint adds the missing sheet zero: start."
        />

        <div className="relative">
          {/* connector line (desktop) */}
          <div className="absolute top-7 right-[8%] left-[8%] hidden h-px bg-line lg:block" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {STAGES.map((s, i) => (
              <Reveal key={s.idx} delay={i * 90}>
                <div
                  className={`group relative h-full border p-4 transition-all duration-300 hover:-translate-y-1 ${
                    s.highlight
                      ? "border-bp/70 bg-bp/[0.07] shadow-[0_0_40px_-12px_rgba(87,174,255,0.45)]"
                      : "border-line bg-panel/60 hover:border-line2"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-display text-3xl font-bold ${s.highlight ? "text-bp" : "text-faint"} transition-colors group-hover:text-bp`}
                    >
                      {s.idx}
                    </span>
                    {s.tag ? (
                      <span className="border border-bp/50 bg-bp/10 px-1.5 py-px font-mono text-[9px] tracking-[0.16em] text-bp uppercase">
                        {s.tag}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-wide text-chalk uppercase">
                    {s.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11.5px] text-mist">
                    <span className="text-bp select-none">$ </span>
                    {s.cmd}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {s.tools.map((t) => (
                      <li
                        key={t}
                        className="border border-line/80 bg-ink px-1.5 py-0.5 font-mono text-[10px] text-mist"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center gap-3 border border-line bg-panel/60 px-4 py-3 font-mono text-[12px] text-mist">
            <ArrowIcon className="h-4 w-4 text-bp" />
            <span>
              with <span className="text-chalk">bb init</span> for existing repos,{" "}
              <span className="text-bp">blueprint</span> completes the lifecycle — nothing starts
              half-wired anymore.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= PROOF OF BUILD ================= */

const TOTAL_TESTS = TEST_SUITES.reduce((s, g) => s + g.tests.length, 0);

export function Proof() {
  return (
    <section id="proof" className="relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 03"
          kicker="proof of build"
          title="One file. Seventeen templates. Twenty-five tests."
          note="The as-built implementation — everything below is what landed, not a promise."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* left: anatomy + audit + manifest */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="border border-line bg-panel/70">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <h3 className="font-display text-xl font-bold tracking-wide text-chalk uppercase">
                    blueprint.py — anatomy
                  </h3>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                    single file
                  </span>
                </div>
                <div>
                  {ANATOMY.map((g) => (
                    <div key={g.section} className="border-b border-line/50 px-5 py-4 last:border-0">
                      <p className="mb-2.5 font-mono text-[10px] tracking-[0.24em] text-bp uppercase">
                        {g.section}
                      </p>
                      <ul className="space-y-2">
                        {g.rows.map(([fn, desc]) => (
                          <li key={fn} className="group flex flex-wrap items-baseline gap-x-3">
                            <code className="font-mono text-[12.5px] font-medium text-chalk transition-colors group-hover:text-bp">
                              {fn}
                            </code>
                            <span className="text-[12px] text-faint">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="draft-corner border border-line bg-ink p-5">
                <p className="font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                  import audit — stdlib only
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {IMPORTS.map((m) => (
                    <span
                      key={m}
                      className="border border-line bg-panel px-2 py-1 font-mono text-[11.5px] text-chalk transition-colors hover:border-bp/60 hover:text-bp"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[11px] text-faint">
                  …the entire bill of materials. <span className="text-mist">pip install</span>{" "}
                  footprint: zero.
                </p>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="border border-line bg-ink/90 p-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                  what shipped
                </p>
                <ul className="font-mono text-[12.5px]">
                  {MANIFEST.map((m) => (
                    <li
                      key={m.name}
                      className="flex items-center gap-2 py-[3px] transition-colors hover:text-bp"
                    >
                      <FileIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
                      <span className="text-chalk/90">{m.name}</span>
                      {m.note ? (
                        <span className="ml-auto text-right text-[10px] text-faint">{m.note}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* right: the test run */}
          <Reveal delay={100}>
            <div className="flex h-full flex-col border border-ok/30 bg-panel/70">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <h3 className="font-display text-xl font-bold tracking-wide text-chalk uppercase">
                  The test run
                </h3>
                <code className="font-mono text-[11px] text-faint">pytest tests/ -v</code>
              </div>
              <div className="flex-1 space-y-5 overflow-hidden px-5 py-4">
                {TEST_SUITES.map((suite, si) => (
                  <div key={suite.name}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <span className="font-mono text-[12px] font-medium text-chalk">
                        {suite.name}
                      </span>
                      {suite.note ? (
                        <span className="border border-line bg-ink px-1.5 py-px font-mono text-[9px] tracking-wider text-mist uppercase">
                          {suite.note}
                        </span>
                      ) : null}
                      <span className="ml-auto border border-ok/40 bg-ok/10 px-1.5 py-px font-mono text-[10px] text-ok tabular">
                        {suite.tests.length} ✓
                      </span>
                    </div>
                    <ul className="grid gap-x-4 sm:grid-cols-2">
                      {suite.tests.map((t, ti) => (
                        <li
                          key={t}
                          className="row-in flex items-center gap-2 py-[3px] font-mono text-[11px]"
                          style={{ animationDelay: `${(si * 7 + ti) * 45}ms` }}
                        >
                          <StatusDot tone="ok" />
                          <span className="truncate text-mist">{t}</span>
                          <span className="ml-auto shrink-0 text-[9px] tracking-wider text-ok/80 uppercase">
                            passed
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ok/30 bg-ok/[0.06] px-5 py-3 font-mono text-[12px]">
                <span className="text-ok">
                  <span className="tabular">{TOTAL_TESTS}</span> passed ·{" "}
                  <span className="tabular">{TEST_SUITES.length}</span> suites · 0 failed
                </span>
                <span className="text-faint">exit 0 · green on the first run</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= SCOPE ================= */

const IN_SCOPE = [
  ["Generate a new project in a target directory", "the whole tree, one shot"],
  ["Interactive + non-interactive modes", "--no-interactive fails on missing values"],
  ["Template variables", "name · module · description · author · license"],
  ["License choice", "MIT default · Apache-2.0 · none"],
  ["Python-only initial templates", "src-layout package, tests, suite wiring"],
  ["Zero runtime dependencies", "stdlib only — argparse · pathlib · string.Template"],
  ["Single-file CLI", "blueprint.py, embeds every template"],
  ["Safety flags", "--dry-run · --force · --output PATH"],
];

const OUT_SCOPE = [
  ["Multiple language templates", "after the python templates settle"],
  ["Git repo initialization", "an optional --init flag, later"],
  ["Remote template fetching", "v0.1.0 stays offline by design"],
  ["Post-generation hooks", "no shell surprises on day one"],
];

export function Scope() {
  return (
    <section id="scope" className="relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 04"
          kicker="v0.1.0 scope"
          title="In the box / out of it"
          note="Small on purpose. A scaffolder that can't be read in one sitting isn't a scaffolder."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full border border-ok/30 bg-panel/60">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <h3 className="font-display text-xl font-bold tracking-wide text-ok uppercase">
                  In v0.1.0
                </h3>
                <span className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                  must have
                </span>
              </div>
              <ul>
                {IN_SCOPE.map(([title, sub], i) => (
                  <li
                    key={title}
                    className="group flex gap-3 border-b border-line/50 px-5 py-3.5 transition-colors last:border-0 hover:bg-ok/[0.05]"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-ok/50 text-ok">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-chalk">{title}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-faint">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-6">
              <div className="border border-line bg-panel/60">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <h3 className="font-display text-xl font-bold tracking-wide text-mist uppercase">
                    After v0.1.0
                  </h3>
                  <span className="border border-dashed border-line2 px-2 py-px font-mono text-[10px] tracking-[0.2em] text-mist uppercase">
                    later
                  </span>
                </div>
                <ul>
                  {OUT_SCOPE.map(([title, sub]) => (
                    <li
                      key={title}
                      className="flex gap-3 border-b border-line/50 px-5 py-3.5 transition-colors last:border-0 hover:bg-bp/[0.04]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-line2 text-mist">
                        <CrossIcon className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-[14px] font-medium text-chalk/85">{title}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-faint">{sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="draft-corner border border-line bg-ink p-5">
                <p className="font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                  full dependency audit
                </p>
                <p className="mt-3 font-mono text-[13px] leading-relaxed text-chalk">
                  <span className="text-bp">import</span> argparse, json, sys
                  <br />
                  <span className="text-bp">from</span> datetime{" "}
                  <span className="text-bp">import</span> datetime, timezone ·{" "}
                  <span className="text-bp">from</span> pathlib{" "}
                  <span className="text-bp">import</span> Path
                </p>
                <p className="mt-2 font-mono text-[11px] text-faint">
                  …that's the entire bill of materials. Everything else is str.replace().
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= CLI ================= */

const EXAMPLES = [
  "python blueprint.py new my-project",
  'python blueprint.py new my-project --description "Local config drift detector"',
  'python blueprint.py new my-project --author "Billy Box" --license mit --no-interactive',
  "python blueprint.py new my-project --dry-run",
  "python blueprint.py --help",
  "python blueprint.py --version",
];

const FLAGS: [string, string, string][] = [
  ["--description", "TEXT", "one-line project description"],
  ["--author", "TEXT", "author for pyproject + LICENSE"],
  ["--license", "mit | apache-2.0 | none", "MIT when omitted"],
  ["--no-interactive", "flag", "fail instead of prompting for missing values"],
  ["--force", "flag", "overwrite an existing target directory"],
  ["--dry-run", "flag", "print the file list, write nothing"],
  ["--output", "PATH", "target directory · default ./<project-name>"],
];

const REPO_TREE = [
  { d: true, name: "blueprint/" },
  { d: false, name: "blueprint.py", note: "the whole tool — templates embedded" },
  { d: false, name: "README.md" },
  { d: false, name: "LICENSE" },
  { d: false, name: ".gitignore" },
  { d: false, name: ".pre-commit-config.yaml" },
  { d: false, name: "pyproject.toml" },
  { d: true, name: "tests/" },
  { d: false, name: "test_blueprint.py", note: "render, diff, repeat", deep: true },
  { d: true, name: ".github/workflows/" },
  { d: false, name: "ci.yml", note: "eats its own dogfood", deep: true },
];

export function Cli() {
  return (
    <section id="cli" className="relative z-10 scroll-mt-20 border-y border-line/60 bg-ink/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 05"
          kicker="cli reference"
          title="Flags & usage"
          note="One verb — new — plus the housekeeping flags. No subcommand maze."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="border border-line bg-panel/70">
              <div className="border-b border-line px-5 py-3">
                <h3 className="font-display text-xl font-bold tracking-wide text-chalk uppercase">
                  Usage
                </h3>
              </div>
              <div className="px-5 py-3 font-mono text-[13px] text-chalk">
                <span className="text-bp">$</span> python blueprint.py{" "}
                <span className="text-warn">new</span>{" "}
                <span className="text-mist">&lt;project&gt; [flags]</span>
              </div>
              <ul className="border-t border-line">
                {EXAMPLES.map((ex) => (
                  <li
                    key={ex}
                    className="group flex items-center gap-3 border-b border-line/50 px-5 py-2.5 transition-colors last:border-0 hover:bg-bp/[0.05]"
                  >
                    <span className="text-bp select-none">$</span>
                    <code className="code-scroll min-w-0 flex-1 overflow-x-auto font-mono text-[11.5px] whitespace-pre text-chalk/85">
                      {ex}
                    </code>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      <CopyButton text={ex} label="" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-line bg-panel/70">
              <div className="border-b border-line px-5 py-3">
                <h3 className="font-display text-xl font-bold tracking-wide text-chalk uppercase">
                  Flags
                </h3>
              </div>
              <ul>
                {FLAGS.map(([flag, arg, desc]) => (
                  <li
                    key={flag}
                    className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-0.5 border-b border-line/50 px-5 py-3 transition-colors last:border-0 hover:bg-bp/[0.05] sm:grid-cols-[170px_190px_1fr]"
                  >
                    <code className="font-mono text-[12px] font-medium text-bp">{flag}</code>
                    <code className="font-mono text-[11px] text-warn/90">{arg}</code>
                    <span className="col-span-2 text-[12.5px] text-mist sm:col-span-1">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="border border-line bg-ink/90 p-5">
              <p className="mb-3 font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                the blueprint repo itself
              </p>
              <ul className="font-mono text-[12.5px]">
                {REPO_TREE.map((r, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 py-[3px] ${r.deep ? "pl-7" : r.d ? "" : "pl-7"}`}
                  >
                    {r.d ? (
                      <FolderIcon className="h-3.5 w-3.5 text-bp" />
                    ) : (
                      <FileIcon className="h-3.5 w-3.5 text-faint" />
                    )}
                    <span className={r.d ? "text-chalk" : "text-chalk/85"}>{r.name}</span>
                    {r.note ? <span className="ml-auto text-[10px] text-faint">{r.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-4 border border-dashed border-line2 bg-panel/40 p-6">
              <p className="font-display text-2xl font-bold tracking-wide text-chalk uppercase">
                Built the way it builds
              </p>
              <p className="text-[14px] leading-relaxed text-mist">
                blueprint's own repository is a blueprint output — same pyproject, same CI, same
                pre-commit standard. The scaffolder scaffolds itself, which is the only honest way
                to ship a scaffolder.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="border border-line bg-ink px-2 py-1 text-mist">1 verb</span>
                <span className="border border-line bg-ink px-2 py-1 text-mist">7 flags</span>
                <span className="border border-line bg-ink px-2 py-1 text-mist">17 templates</span>
                <span className="border border-line bg-ink px-2 py-1 text-mist">0 dependencies</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= QUEUE ================= */

/** fixed stamp year — the stamp marks the v0.1.0 as-built release, not today */
export const STAMP_YEAR = 2026;

function Stamp() {
  // CSS-only entrance (animation on .stamp-in) — no IntersectionObserver
  // needed for a single element; the keyframes run when the section mounts.
  return (
    <div className="flex items-center justify-center py-6">
      <div
        className="stamp-in relative border-[3px] border-ok/85 px-10 py-6 text-center"
        style={{ boxShadow: "inset 0 0 0 2px rgba(8,24,43,0.9), inset 0 0 0 3.5px rgba(63,214,143,0.5)" }}
      >
        <div className="font-display text-6xl leading-none font-bold tracking-[0.14em] text-ok uppercase">
          Shipped
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.26em] text-ok/90 uppercase">
          <span className="inline-block h-px w-6 bg-ok/60" />
          v0.1.0 · as-built
          <span className="inline-block h-px w-6 bg-ok/60" />
        </div>
        <div className="mt-1.5 font-mono text-[10px] tracking-[0.2em] text-ok/70 uppercase">
          billybox · rev b · {STAMP_YEAR}
        </div>
      </div>
    </div>
  );
}

const TIMELINE: {
  name: string;
  sub: string;
  status: string;
  tone: "ok" | "warn" | "bp";
}[] = [
  {
    name: "PyPI publishing",
    sub: "publish.yml · tag-vs-wheel guard · OIDC trusted publishing",
    status: "in progress",
    tone: "warn",
  },
  {
    name: "bb install",
    sub: "suite toolchain bootstrap from one command",
    status: "in progress",
    tone: "warn",
  },
  {
    name: "blueprint v0.1.0",
    sub: "single file · 17 templates · 25 tests green on the first run",
    status: "complete",
    tone: "ok",
  },
  {
    name: "publish blueprint to PyPI",
    sub: "tag v0.1.0 → guard passes → OIDC upload",
    status: "next",
    tone: "bp",
  },
];

const DELIVERED: [string, string][] = [
  ["done", "blueprint.py — single file, 17 templates embedded"],
  ["done", "tests/test_blueprint.py — 25 tests across 6 suites, green"],
  ["done", ".github/workflows/ci.yml — ruff + mypy + pytest matrix"],
  ["done", "pyproject.toml — hatchling, blueprint entry point, PyPI metadata"],
  ["todo", "publish to PyPI once the pipeline goes live"],
];

export function Queue() {
  return (
    <section id="queue" className="relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 06"
          kicker="the decision — executed"
          title="Queue → shipped"
          note="The acceptance sheet became a delivery note."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.95] font-bold text-chalk uppercase">
                Yes — <span className="text-ok">and built.</span>
              </p>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-mist">
                Queued as the official next project, then implemented in one pass: the
                single-file CLI, the full test suite, CI, and packaging landed together. One
                command now turns a blank directory into a repo that already passes{" "}
                <span className="font-mono text-[13px] text-chalk">bb preflight</span> — all
                that's left is the PyPI upload.
              </p>

              <ol className="mt-8 space-y-0">
                {TIMELINE.map((t, i) => (
                  <li key={t.name} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < TIMELINE.length - 1 ? (
                      <span className="absolute top-4 left-[5px] h-full w-px bg-line" />
                    ) : null}
                    <span className="relative mt-1.5 shrink-0">
                      <StatusDot tone={t.tone} pulse />
                    </span>
                    <div>
                      <p className="font-mono text-[13px] font-medium text-chalk">{t.name}</p>
                      <p className="mt-0.5 text-[12.5px] text-faint">{t.sub}</p>
                    </div>
                    <span
                      className={`ml-auto shrink-0 self-center border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${
                        t.tone === "warn"
                          ? "border-warn/40 bg-warn/10 text-warn"
                          : t.tone === "ok"
                            ? "border-ok/40 bg-ok/10 text-ok"
                            : "border-bp/50 bg-bp/10 text-bp"
                      }`}
                    >
                      {t.status}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="border border-line bg-panel/70">
              <div className="border-b border-line px-5 py-3">
                <h3 className="font-display text-xl font-bold tracking-wide text-chalk uppercase">
                  Delivery note
                </h3>
              </div>
              <Stamp />
              <ul className="border-t border-line">
                {DELIVERED.map(([state, c]) => (
                  <li
                    key={c}
                    className={`flex items-center gap-3 border-b border-line/50 px-5 py-3 font-mono text-[12px] transition-colors last:border-0 ${
                      state === "done"
                        ? "text-mist hover:bg-ok/[0.05] hover:text-chalk"
                        : "text-faint hover:bg-bp/[0.05]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                        state === "done" ? "border-ok/60 text-ok" : "border-dashed border-line2"
                      }`}
                    >
                      {state === "done" ? <CheckIcon className="h-2.5 w-2.5" /> : null}
                    </span>
                    <span className={state === "todo" ? "italic" : ""}>{c}</span>
                    {state === "todo" ? (
                      <span className="ml-auto shrink-0 border border-bp/40 bg-bp/10 px-1.5 py-px font-mono text-[9px] tracking-wider text-bp uppercase">
                        waiting on pipeline
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                <span>checker: bb</span>
                <span>date: rev b · {STAMP_YEAR}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
