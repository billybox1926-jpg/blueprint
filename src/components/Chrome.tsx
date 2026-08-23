import { BlueprintMark } from "./ui";

/* ---------------- ambient background ---------------- */

export function Background() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-blueprint-grid absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 600px at 78% -10%, rgba(87,174,255,0.10), transparent 62%), radial-gradient(900px 700px at -10% 105%, rgba(47,127,203,0.10), transparent 60%), linear-gradient(rgba(8,24,43,0.4), rgba(8,24,43,0.9))",
          }}
        />
      </div>
      <div className="noise-layer pointer-events-none fixed inset-0 z-[60]" aria-hidden />
    </>
  );
}

/* ---------------- top bar ---------------- */

const NAV = [
  { href: "#scaffold", label: "Scaffold" },
  { href: "#lifecycle", label: "Lifecycle" },
  { href: "#scope", label: "Scope" },
  { href: "#cli", label: "CLI" },
  { href: "#queue", label: "Queue" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-deep/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 md:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <BlueprintMark className="h-6 w-6 text-bp transition-transform duration-300 group-hover:rotate-90" />
          <span className="font-display text-xl font-bold tracking-[0.08em] text-chalk uppercase">
            blueprint
          </span>
          <span className="hidden border border-line px-1.5 py-px font-mono text-[10px] text-mist sm:inline">
            BB·TOOL Nº10
          </span>
        </a>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 font-mono text-xs text-mist transition-colors hover:bg-bp/10 hover:text-chalk"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <span className="hidden items-center gap-1.5 border border-warn/40 bg-warn/10 px-2 py-1 font-mono text-[10px] tracking-wider text-warn sm:flex">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-warn" />
            QUEUED
          </span>
          <span className="border border-line bg-panel px-2 py-1 font-mono text-[10px] text-mist">
            v0.1.0
          </span>
        </div>
      </div>
    </header>
  );
}

/* ---------------- footer title block ---------------- */

function Cell({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={`border-line px-3 py-2.5 ${wide ? "col-span-2 md:col-span-2" : ""}`}>
      <div className="font-mono text-[9px] tracking-[0.2em] text-faint uppercase">{k}</div>
      <div className="mt-0.5 font-mono text-xs text-chalk">{v}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="grid grid-cols-2 gap-px border border-line bg-line/40 md:grid-cols-6">
          <Cell k="Title" v="blueprint" />
          <Cell k="Suite" v="BillyBox" />
          <Cell k="Sheet" v="01 of 01" />
          <Cell k="Rev" v="A" />
          <Cell k="Scale" v="1 : 0.1.0" />
          <Cell k="Drawn" v="BB · 2026" />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-faint">
            © 2026 BillyBox suite · one command, one repo, zero dependencies
          </p>
          <nav className="flex gap-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-mono text-[11px] text-mist transition-colors hover:text-bp"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
