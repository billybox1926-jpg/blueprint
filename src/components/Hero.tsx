import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScramble } from "../lib/hooks";
import { ReplayIcon } from "./ui";
import { CANONICAL_VERSION } from "../lib/templates";

/* ---------------- terminal script — replays the shipped CLI ---------------- */

type TermKind = "cmd" | "info" | "ok" | "gap" | "done" | "hint";
interface TermLine {
  kind: TermKind;
  a: string;
  b?: string;
}

const SCRIPT: TermLine[] = [
  { kind: "cmd", a: "blueprint --version" },
  { kind: "info", a: "blueprint 0.1.0" },
  { kind: "gap", a: "" },
  { kind: "cmd", a: "blueprint new local-drift" },
  { kind: "info", a: "BillyBox Project Scaffolder" },
  { kind: "info", a: "==================================================" },
  { kind: "gap", a: "" },
  { kind: "ok", a: "package name", b: "local_drift" },
  { kind: "ok", a: "description", b: "Local config drift detector" },
  { kind: "ok", a: "author", b: "Billy Box" },
  { kind: "gap", a: "" },
  { kind: "info", a: "Available licenses:" },
  { kind: "info", a: "  1. MIT" },
  { kind: "info", a: "  2. Apache-2.0" },
  { kind: "info", a: "  3. None" },
  { kind: "ok", a: "choose license [1]", b: "1" },
  { kind: "gap", a: "" },
  { kind: "done", a: "Created project 'local-drift' in local-drift" },
  { kind: "info", a: "  15 files generated" },
  { kind: "gap", a: "" },
  { kind: "info", a: "Next steps:" },
  { kind: "info", a: "  cd local-drift" },
  { kind: "info", a: "  git init" },
  { kind: "info", a: "  pip install -e ." },
  { kind: "info", a: "  pre-commit install" },
  { kind: "hint", a: "then hand off to the suite → bb init" },
];

const KIND_MS: Record<TermKind, number> = {
  cmd: 520,
  info: 118,
  ok: 215,
  gap: 235,
  done: 430,
  hint: 300,
};

function Terminal() {
  const reduced = useReducedMotion();
  const script = SCRIPT;
  const [replay, setReplay] = useState(0);
  const [shown, setShown] = useState(reduced ? script.length : 0);
  const [typed, setTyped] = useState(reduced ? script[0].a.length : 0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  useEffect(() => {
    if (reduced) {
      setShown(script.length);
      setTyped(script[0].a.length);
      return;
    }
    setShown(0);
    setTyped(0);
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );

    const cmd = script[0].a;
    for (let i = 1; i <= cmd.length; i += 1) {
      at(450 + i * 34, () => setTyped(i));
    }
    let t = 450 + cmd.length * 34 + 380;
    for (let i = 1; i < script.length; i += 1) {
      t += KIND_MS[script[i].kind];
      const idx = i;
      at(t, () => setShown(idx + 1));
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [replay, reduced, script]);

  const done = shown >= script.length;

  return (
    <div className="relative">
      <div className="relative border border-line bg-ink/95 shadow-[0_24px_80px_-20px_rgba(4,14,28,0.9),0_0_70px_-10px_rgba(87,174,255,0.12)]">
        <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2.5">
          <span className="h-2.5 w-2.5 bg-err/80" />
          <span className="h-2.5 w-2.5 bg-warn/80" />
          <span className="h-2.5 w-2.5 bg-ok/80" />
          <span className="ml-3 truncate font-mono text-[11px] text-faint">
            billybox@bb — ~/work · blueprint v{CANONICAL_VERSION}
          </span>
          <span className="ml-auto border border-ok/40 bg-ok/10 px-1.5 py-px font-mono text-[10px] text-ok">
            shipped
          </span>
        </div>
        <div
          ref={scrollRef}
          className="code-scroll max-h-[430px] min-h-[380px] overflow-auto px-4 py-4 font-mono text-[12.5px] leading-[1.8] sm:px-5"
          aria-live="polite"
        >
          {script.slice(0, Math.max(shown, 1)).map((ln, i) => {
            if (ln.kind === "cmd") {
              const isTyping = i === 0 && !done && shown < 2;
              return (
                <div key={i} className="flex">
                  <span className="mr-2 text-bp select-none">$</span>
                  <span className={isTyping ? "term-caret text-chalk" : "text-chalk"}>
                    {ln.a.slice(0, i === 0 ? typed : ln.a.length)}
                  </span>
                </div>
              );
            }
            if (shown <= i) return null;
            if (ln.kind === "gap")
              return <div key={i} className="h-2.5" aria-hidden />;
            if (ln.kind === "info")
              return (
                <div key={i} className="line-in whitespace-pre text-faint">
                  {ln.a}
                </div>
              );
            if (ln.kind === "ok")
              return (
                <div key={i} className="line-in flex gap-2">
                  <span className="text-ok select-none">✔</span>
                  <span className="w-36 shrink-0 text-faint">{ln.a}</span>
                  <span className="text-chalk">{ln.b}</span>
                </div>
              );
            if (ln.kind === "done")
              return (
                <div key={i} className="line-in pt-1 font-medium text-ok">
                  ✔ {ln.a}
                </div>
              );
            return (
              <div key={i} className="line-in pt-1 text-mist">
                <span className="text-bp select-none">›</span> {ln.a}
              </div>
            );
          })}
          {done && !reduced ? (
            <div className="mt-1 flex">
              <span className="mr-2 text-bp select-none">$</span>
              <span className="term-caret text-chalk/60">&nbsp;</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setReplay((r) => r + 1)}
          className="inline-flex items-center gap-2 border border-line bg-panel px-3 py-1.5 font-mono text-[11px] text-mist transition-all hover:border-bp/60 hover:text-chalk active:scale-[0.97]"
        >
          <ReplayIcon className="h-3.5 w-3.5" />
          replay run
        </button>
        <p className="font-mono text-[11px] text-faint">
          that's the shipped v{CANONICAL_VERSION} flow — the lab below renders its{" "}
          <span className="text-mist">actual templates</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------- hero ---------------- */

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(id);
  }, []);
  const title = useScramble("BLUEPRINT", mounted);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* drafting décor */}
      <svg
        className="spin-slow pointer-events-none absolute top-16 -right-24 h-[420px] w-[420px] text-bp/25 md:-right-16"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
      >
        <circle cx="100" cy="100" r="88" stroke="currentColor" strokeDasharray="6 8" />
        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M100 2v24M100 174v24M2 100h24M174 100h24" stroke="currentColor" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-14 pb-16 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-20">
        {/* title block */}
        <div className="relative lg:col-span-5">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-faint uppercase">
            <span className="inline-block h-px w-8 bg-bp/60" />
            <span>BillyBox suite · tool Nº 10 · the entry point</span>
          </div>

          <div className="relative mt-4">
            <h1
              className="font-display text-[clamp(4.2rem,10.5vw,7.6rem)] leading-[0.85] font-bold tracking-[0.01em] text-chalk uppercase"
              aria-label="BLUEPRINT"
            >
              {title || "\u00A0"}
            </h1>
            {/* shipped stamp */}
            <div
              className={`stamp-in absolute -top-3 right-0 rotate-[-8deg] border-2 border-ok/80 px-3 py-1.5 text-center sm:-right-2 ${mounted ? "" : "opacity-0"}`}
              style={{ animationDelay: "1s" }}
            >
              <div className="font-display text-lg leading-none font-bold tracking-[0.18em] text-ok uppercase">
                Shipped
              </div>
              <div className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-ok/80 uppercase">
                v{CANONICAL_VERSION} · as-built
              </div>
            </div>
          </div>

          {/* dimension line */}
          <div className="mt-5 flex items-center gap-2 text-bp/70">
            <span className="h-2.5 w-px bg-bp/60" />
            <span className="h-px flex-1 bg-bp/40" />
            <span className="font-mono text-[10px] tracking-[0.18em] text-bp/90 uppercase">
              1 command → 15 files
            </span>
            <span className="h-px flex-1 bg-bp/40" />
            <span className="h-2.5 w-px bg-bp/60" />
          </div>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">
            Every BillyBox repo starts the same way: pyproject, publish pipeline with the
            tag-vs-version guard, CI matrix, pre-commit, suite wiring.{" "}
            <span className="text-chalk">blueprint</span> stamps out the whole standard in one
            command — v{CANONICAL_VERSION} has landed, tested, and ready for its PyPI tag.
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {[
              "v0.1.0 · landed",
              "stdlib only · 0 deps",
              "single file: blueprint.py",
              "python ≥ 3.9",
              "22 tests · all green",
            ].map((c) => (
              <li
                key={c}
                className="border border-line bg-panel/70 px-2.5 py-1 font-mono text-[11px] text-mist transition-colors hover:border-bp/50 hover:text-chalk"
              >
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#scaffold"
              className="group inline-flex items-center gap-2.5 border border-bp/70 bg-bp/10 px-5 py-2.5 font-mono text-xs tracking-wider text-bp uppercase transition-all hover:bg-bp/20 hover:shadow-[0_0_30px_-6px_rgba(87,174,255,0.5)]"
            >
              try the templates
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#proof"
              className="inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-xs tracking-wider text-mist uppercase transition-colors hover:border-line2 hover:text-chalk"
            >
              proof of build
            </a>
          </div>
        </div>

        {/* terminal */}
        <div className="lg:col-span-7 lg:pt-8">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
