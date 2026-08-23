import { useEffect, useRef, useState } from "react";

/* Detect prefers-reduced-motion and keep it live. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* One-shot intersection observer. */
export function useInView<T extends HTMLElement>(
  rootMargin = "0px 0px -12% 0px",
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return [ref, inView];
}

/* Scramble-decode a string once `active` flips true. */
export function useScramble(text: string, active: boolean): string {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setOut(text);
      return;
    }
    const glyphs = "▓▒░<>/\\#*+=";
    let frame = 0;
    let locked = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame % 2 === 0) locked += 1;
      if (locked >= text.length) {
        setOut(text);
        window.clearInterval(id);
        return;
      }
      let s = text.slice(0, locked);
      for (let i = locked; i < text.length; i += 1) {
        s += text[i] === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setOut(s);
    }, 42);
    return () => window.clearInterval(id);
  }, [text, active, reduced]);
  return out;
}

/* Clipboard with graceful fallback; reports a transient "copied" state. */
export function useCopy(timeout = 1600): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = (text: string) => {
    const done = () => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch {
        done();
      }
    }
  };
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return [copied, copy];
}
