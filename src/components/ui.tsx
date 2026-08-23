import type { ReactNode } from "react";
import { useCopy, useInView } from "../lib/hooks";
import type { Lang } from "../lib/templates";

/* ---------------- Reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHeading({
  sheet,
  kicker,
  title,
  note,
}: {
  sheet: string;
  kicker: string;
  title: string;
  note?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="mb-10 md:mb-14">
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-faint uppercase">
        <span className="inline-block h-px w-8 bg-bp/60" />
        <span>
          {sheet} · {kicker}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h2 className={`mask-line ${inView ? "in" : ""}`}>
          <span className="mask-inner font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95] font-bold tracking-wide text-chalk uppercase">
            {title}
          </span>
        </h2>
        {note ? (
          <p className="max-w-xs pb-2 font-mono text-xs leading-relaxed text-mist">{note}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Copy button ---------------- */

export function CopyButton({
  text,
  label = "copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, copy] = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`group inline-flex items-center gap-1.5 border border-line bg-panel px-2.5 py-1 font-mono text-[11px] text-mist transition-colors hover:border-bp/60 hover:text-chalk ${className}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? <CheckIcon className="h-3 w-3 text-ok" /> : <CopyIcon className="h-3 w-3" />}
      <span className={copied ? "text-ok" : ""}>{copied ? "copied" : label}</span>
    </button>
  );
}

/* ---------------- Icons (hand-drawn, 1.5px stroke) ---------------- */

function base(props: { className?: string }) {
  return {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: props.className ?? "h-4 w-4",
    "aria-hidden": true,
  };
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <path d="M2.5 8.5 6 12l7.5-8" />
    </svg>
  );
}

export function CrossIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <rect x="5.5" y="5.5" width="8" height="8" />
      <path d="M10.5 5.5v-3h-8v8h3" />
    </svg>
  );
}

export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <path d="M1.5 4.5v8h13v-7H7l-1.8-2H1.5z" />
    </svg>
  );
}

export function FileIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <path d="M3.5 1.5h6l3 3v10h-9z" />
      <path d="M9.5 1.5v3h3" />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <path d="M2 8h11M9.5 4.5 13 8l-3.5 3.5" />
    </svg>
  );
}

export function ReplayIcon({ className }: { className?: string }) {
  return (
    <svg {...base({ className })}>
      <path d="M3 8a5 5 0 1 0 1.5-3.6M4.5 1.5v3h3" />
    </svg>
  );
}

export function BlueprintMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 12h17M12 3.5v17" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="19" cy="5" r="2.4" fill="var(--color-warn)" stroke="none" />
    </svg>
  );
}

/* ---------------- Code viewer ---------------- */

const LANG_LABEL: Record<Lang, string> = {
  toml: "TOML",
  markdown: "MD",
  yaml: "YAML",
  python: "PY",
  json: "JSON",
  text: "TXT",
};

/**
 * Minimal, intentionally line-oriented highlighter for the code viewer.
 *
 * KNOWN LIMITATIONS (accepted, by design): this is not a real parser — it
 * does not handle nested structures, multi-line strings, or escaped quotes
 * inside strings. The viewer only renders the short, well-behaved templates
 * from lib/templates/bodies.ts, where line-level tinting is sufficient.
 * If templates ever grow complex syntax, swap this for Prism.js or Shiki.
 */
function tintLine(line: string, lang: Lang): ReactNode {
  const t = line.trim();
  if (t.startsWith("#")) {
    return <span className="text-faint italic">{line}</span>;
  }
  if ((lang === "toml" || lang === "text") && /^\[.+\]$/.test(t)) {
    return <span className="text-bp">{line}</span>;
  }
  if (lang === "yaml") {
    const m = line.match(/^(\s*)([\w.-]+)(:)(.*)$/);
    if (m) {
      return (
        <>
          {m[1]}
          <span className="text-bp">{m[2]}</span>
          <span className="text-faint">{m[3]}</span>
          <span>{m[4]}</span>
        </>
      );
    }
  }
  if (lang === "json") {
    const parts = line.split(/("(?:[^"\\]|\\.)*")(\s*:)/g);
    if (parts.length > 1) {
      return (
        <>
          {parts.map((p, i) =>
            i % 3 === 0 ? (
              <span key={i}>{p}</span>
            ) : i % 3 === 1 ? (
              <span key={i} className="text-bp">
                {p}
              </span>
            ) : (
              <span key={i} className="text-faint">
                {p}
              </span>
            ),
          )}
        </>
      );
    }
  }
  if (lang === "python" && /^(from|import|def|class|if|return)\b/.test(t)) {
    const kw = t.match(/^(from|import|def|class|if|return)\b/)?.[0] ?? "";
    const rest = line.slice(line.indexOf(kw) + kw.length);
    return (
      <>
        {line.slice(0, line.indexOf(kw))}
        <span className="text-warn">{kw}</span>
        <span>{rest}</span>
      </>
    );
  }
  if (lang === "markdown" && /^#{1,3} /.test(t)) {
    return <span className="font-semibold text-bp">{line}</span>;
  }
  if (lang === "markdown" && t.startsWith(">")) {
    return <span className="text-mist italic">{line}</span>;
  }
  return <span>{line}</span>;
}

export function CodeViewer({
  path,
  lang,
  content,
  bytes,
  note,
}: {
  path: string;
  lang: Lang;
  content: string;
  bytes: number;
  note?: string;
}) {
  const lines = content.replace(/\n$/, "").split("\n");
  return (
    <div className="flex h-full min-h-0 flex-col border border-line bg-ink">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line bg-panel px-4 py-2.5">
        <FileIcon className="h-3.5 w-3.5 shrink-0 text-bp" />
        <span className="truncate font-mono text-xs text-chalk">{path}</span>
        <span className="border border-line px-1.5 py-px font-mono text-[10px] tracking-widest text-mist">
          {LANG_LABEL[lang]}
        </span>
        <span className="ml-auto font-mono text-[10px] text-faint tabular">
          {lines.length} lines · {bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`}
        </span>
        <CopyButton text={content} label="copy" />
      </div>
      {note ? (
        <div className="border-b border-line/60 bg-panel/50 px-4 py-1.5 font-mono text-[11px] text-mist">
          <span className="text-bp">↳</span> {note}
        </div>
      ) : null}
      <div className="code-scroll min-h-0 flex-1 overflow-auto">
        <pre className="min-w-max px-0 py-3 font-mono text-[12.5px] leading-[1.65]">
          {lines.map((ln, i) => (
            <div key={i} className="flex px-4 hover:bg-bp/[0.04]">
              <span className="w-8 shrink-0 pr-4 text-right text-faint/60 select-none tabular">
                {i + 1}
              </span>
              <span className="whitespace-pre text-chalk/90">{tintLine(ln, lang)}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ---------------- misc ---------------- */

export function StatusDot({ tone, pulse }: { tone: "ok" | "warn" | "bp"; pulse?: boolean }) {
  const c = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-bp";
  const p = pulse ? (tone === "warn" ? "pulse-dot" : tone === "bp" ? "pulse-ring" : "") : "";
  return <span className={`inline-block h-2 w-2 rounded-full ${c} ${p}`} />;
}
