import { useInView } from "../lib/hooks";
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

/* ================= SCOPE ================= */

const IN_SCOPE = [
  ["Generate a new project in a target directory", "the whole tree, one shot"],
  ["Interactive + non-interactive modes", "--no-interactive fails on missing values"],
  ["Template variables", "name · module · description · author · license"],
  ["License choice", "MIT default · Apache-2.0 · none"],
  ["Python-only initial templates", "src-layout package, tests, docs"],
  ["Zero runtime dependencies", "stdlib only — argparse, pathlib, string"],
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
          sheet="Sheet 03"
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
                  <span className="text-bp">import</span> argparse, pathlib, string, json,
                  datetime
                </p>
                <p className="mt-2 font-mono text-[11px] text-faint">
                  …that's the entire bill of materials. Everything else is string substitution.
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
  'python blueprint.py new my-project --author "Billy Box" --license MIT --no-interactive',
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
          sheet="Sheet 04"
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
                <span className="border border-line bg-ink px-2 py-1 text-mist">16 templates</span>
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

function Stamp() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="flex items-center justify-center py-6">
      <div
        className={`relative border-[3px] border-ok/85 px-10 py-6 text-center ${inView ? "stamp-in" : "opacity-0"}`}
        style={{ boxShadow: "inset 0 0 0 2px rgba(8,24,43,0.9), inset 0 0 0 3.5px rgba(63,214,143,0.5)" }}
      >
        <div className="font-display text-6xl leading-none font-bold tracking-[0.14em] text-ok uppercase">
          Queued
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.26em] text-ok/90 uppercase">
          <span className="inline-block h-px w-6 bg-ok/60" />
          official next project
          <span className="inline-block h-px w-6 bg-ok/60" />
        </div>
        <div className="mt-1.5 font-mono text-[10px] tracking-[0.2em] text-ok/70 uppercase">
          billybox · rev a · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

const TIMELINE = [
  {
    name: "PyPI publishing",
    sub: "publish.yml · tag-vs-wheel guard · OIDC trusted publishing",
    status: "in progress",
    tone: "warn" as const,
  },
  {
    name: "bb install",
    sub: "suite toolchain bootstrap from one command",
    status: "in progress",
    tone: "warn" as const,
  },
  {
    name: "blueprint v0.1.0",
    sub: "implementation · tests · CI · packaging",
    status: "queued — next",
    tone: "bp" as const,
  },
];

const CHECKLIST = [
  "write blueprint.py — single file, templates embedded",
  "tests/test_blueprint.py — render, assert, diff",
  ".github/workflows/ci.yml — ruff + mypy + pytest matrix",
  "pyproject.toml — hatchling, entry point, PyPI metadata",
];

export function Queue() {
  return (
    <section id="queue" className="relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 05"
          kicker="the decision"
          title="Shall we queue it?"
          note="The spec above is the answer, stamped."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.95] font-bold text-chalk uppercase">
                Yes — <span className="text-bp">queued.</span>
              </p>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-mist">
                Once PyPI publishing and <span className="font-mono text-[13px] text-chalk">bb install</span>{" "}
                land, <span className="font-mono text-[13px] text-chalk">blueprint.py</span> v0.1.0
                goes first: implementation, tests, CI, packaging. One command turns a blank
                directory into a repo that already passes{" "}
                <span className="font-mono text-[13px] text-chalk">bb preflight</span>.
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
                  Acceptance sheet
                </h3>
              </div>
              <Stamp />
              <ul className="border-t border-line">
                {CHECKLIST.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-3 border-b border-line/50 px-5 py-3 font-mono text-[12px] text-mist transition-colors last:border-0 hover:bg-bp/[0.05] hover:text-chalk"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-line2">
                      <span className="sr-only">todo</span>
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                <span>checker: ______</span>
                <span>date: on landing</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
