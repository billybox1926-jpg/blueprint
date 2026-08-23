import { useMemo, useState } from "react";
import {
  DEFAULT_CONFIG,
  FILE_NOTES,
  LICENSES,
  formatBytes,
  normalizePackage,
  projectName,
  renderProject,
  type LicenseId,
  type ProjectConfig,
} from "../lib/templates";
import { CodeViewer, CopyButton, FileIcon, FolderIcon, SectionHeading } from "./ui";

/* ---------------- form ---------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-line bg-ink px-3 py-2 font-mono text-[13px] text-chalk placeholder:text-faint/70 outline-none transition-colors focus:border-bp/70 focus:bg-panel";

function ConfigForm({
  cfg,
  onChange,
  fileCount,
  totalBytes,
  renderMs,
}: {
  cfg: ProjectConfig;
  onChange: (c: ProjectConfig) => void;
  fileCount: number;
  totalBytes: number;
  renderMs: number;
}) {
  const name = projectName(cfg.name);
  const module = normalizePackage(cfg.name);
  const set = (patch: Partial<ProjectConfig>) => onChange({ ...cfg, ...patch });

  return (
    <div className="draft-corner border border-line bg-panel/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold tracking-wide text-chalk uppercase">
          Draft a project
        </h3>
        <span className="border border-bp/40 bg-bp/10 px-2 py-0.5 font-mono text-[10px] text-bp">
          live
        </span>
      </div>

      <div className="space-y-4">
        <Field label="project name">
          <input
            className={inputCls}
            value={cfg.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="my-project"
            spellCheck={false}
          />
        </Field>

        <div className="flex flex-wrap gap-2 font-mono text-[11px]">
          <span className="border border-line bg-ink px-2 py-1 text-mist">
            project <span className="text-bp">{name}</span>
          </span>
          <span className="border border-line bg-ink px-2 py-1 text-mist">
            module <span className="text-bp">{module}</span>
          </span>
        </div>

        <Field label="description">
          <input
            className={inputCls}
            value={cfg.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Local config drift detector"
            spellCheck={false}
          />
        </Field>

        <Field label="author">
          <input
            className={inputCls}
            value={cfg.author}
            onChange={(e) => set({ author: e.target.value })}
            placeholder="Billy Box"
            spellCheck={false}
          />
        </Field>

        <Field label="license">
          <div className="grid grid-cols-3 gap-1.5">
            {LICENSES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => set({ license: l.id as LicenseId })}
                className={`border px-2 py-1.5 font-mono text-[11px] transition-all active:scale-[0.97] ${
                  cfg.license === l.id
                    ? "border-bp/70 bg-bp/15 text-bp"
                    : "border-line bg-ink text-mist hover:border-line2 hover:text-chalk"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div
        key={`${name}-${cfg.license}`}
        className="status-flash mt-5 flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] text-mist"
      >
        <span>
          <span className="text-chalk tabular">{fileCount}</span> files ·{" "}
          <span className="text-chalk tabular">{formatBytes(totalBytes)}</span>
        </span>
        <span className="text-faint tabular">rendered in {renderMs.toFixed(2)} ms</span>
      </div>
      <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-faint">
        Same substitution engine as the CLI — string templates, zero dependencies. Pick{" "}
        <span className="text-mist">none</span> and watch LICENSE drop out of the tree.
      </p>
    </div>
  );
}

/* ---------------- file tree ---------------- */

function FileTree({
  files,
  selected,
  onSelect,
  treeKey,
}: {
  files: ReturnType<typeof renderProject>;
  selected: string;
  onSelect: (p: string) => void;
  treeKey: string;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, typeof files>();
    for (const f of files) {
      const dir = f.path.includes("/") ? f.path.slice(0, f.path.lastIndexOf("/")) : ".";
      const arr = map.get(dir);
      if (arr) arr.push(f);
      else map.set(dir, [f]);
    }
    return [...map.entries()];
  }, [files]);

  let rowIdx = 0;

  return (
    <div key={treeKey} className="border border-line bg-ink/90 py-2">
      {groups.map(([dir, dirFiles]) => (
        <div key={dir}>
          {dir !== "." ? (
            <div
              className="row-in flex items-center gap-2 px-4 py-1.5 font-mono text-[12px] text-bp"
              style={{ animationDelay: `${rowIdx++ * 26}ms` }}
            >
              <FolderIcon className="h-3.5 w-3.5" />
              <span>{dir}/</span>
              <span className="ml-auto text-[10px] text-faint tabular">{dirFiles.length}</span>
            </div>
          ) : null}
          <ul className={dir !== "." ? "ml-6 border-l border-line/60" : ""}>
            {dirFiles.map((f) => {
              const name = f.path.split("/").pop() ?? f.path;
              const active = selected === f.path;
              const delay = rowIdx++ * 26;
              return (
                <li key={f.path} className="row-in" style={{ animationDelay: `${delay}ms` }}>
                  <button
                    type="button"
                    onClick={() => onSelect(f.path)}
                    className={`flex w-full items-center gap-2 py-[5px] pr-4 text-left font-mono text-[12px] transition-colors ${
                      dir !== "." ? "pl-4" : "px-4"
                    } ${
                      active
                        ? "border-l-2 border-bp bg-bp/10 text-bp"
                        : "border-l-2 border-transparent text-chalk/80 hover:bg-bp/[0.06] hover:text-chalk"
                    }`}
                  >
                    <FileIcon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-bp" : "text-faint"}`} />
                    <span className="truncate">{name}</span>
                    <span className="ml-auto pl-2 text-[10px] text-faint tabular">
                      {formatBytes(f.bytes)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------------- section ---------------- */

export function ScaffoldLab() {
  const [cfg, setCfg] = useState<ProjectConfig>(DEFAULT_CONFIG);

  const { files, ms } = useMemo(() => {
    const t0 = performance.now();
    const out = renderProject(cfg);
    return { files: out, ms: performance.now() - t0 };
  }, [cfg]);

  const [selected, setSelected] = useState("pyproject.toml");
  const current = files.find((f) => f.path === selected) ?? files[0];
  const totalBytes = files.reduce((s, f) => s + f.bytes, 0);
  const name = projectName(cfg.name);
  const lic = cfg.license === "none" ? "none" : cfg.license.toLowerCase();

  const cmd = `python blueprint.py new ${name} --author "${cfg.author.trim() || "Billy Box"}" --license ${lic} --no-interactive`;

  const note =
    FILE_NOTES[current.path] ?? FILE_NOTES[current.path.split("/").pop() ?? current.path];

  return (
    <section id="scaffold" className="relative z-10 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <SectionHeading
          sheet="Sheet 01"
          kicker="the scaffold lab"
          title="One command, whole standard"
          note="Edit the variables — the tree and every file re-render instantly, exactly what the CLI writes to disk."
        />

        {/* command preview */}
        <div className="mb-6 flex flex-wrap items-center gap-3 border border-line bg-ink px-4 py-3">
          <span className="font-mono text-sm text-bp select-none">$</span>
          <code className="code-scroll max-w-full overflow-x-auto font-mono text-[12.5px] whitespace-pre text-chalk/90">
            {cmd}
          </code>
          <span className="ml-auto">
            <CopyButton text={cmd} label="copy cmd" />
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ConfigForm
              cfg={cfg}
              onChange={setCfg}
              fileCount={files.length}
              totalBytes={totalBytes}
              renderMs={ms}
            />
          </div>

          <div className="grid min-w-0 gap-6 xl:grid-cols-[280px_1fr]">
            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                <span>generated tree</span>
                <span className="tabular">{files.length} files</span>
              </div>
              <FileTree
                files={files}
                selected={current.path}
                onSelect={setSelected}
                treeKey={`${name}|${cfg.license}`}
              />
            </div>
            <div className="h-[460px] min-w-0 xl:h-[560px]">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                <span>file preview</span>
                <span>{current.lang}</span>
              </div>
              <div className="h-[calc(100%-24px)]">
                <CodeViewer
                  key={current.path + name + cfg.license + cfg.author + cfg.description}
                  path={current.path}
                  lang={current.lang}
                  content={current.content}
                  bytes={current.bytes}
                  note={note}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
