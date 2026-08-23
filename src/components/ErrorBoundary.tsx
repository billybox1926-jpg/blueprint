import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level error boundary: a render error anywhere in the tree shows a
 * styled fallback instead of a white screen. Reset by reloading the page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console -- last-resort diagnostics
    console.error("blueprint render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex min-h-screen items-center justify-center bg-deep px-6"
        >
          <div className="max-w-md border border-warn/50 bg-ink p-8">
            <p className="font-display text-3xl font-bold tracking-wide text-warn uppercase">
              Draft torn
            </p>
            <p className="mt-3 font-mono text-[12.5px] leading-relaxed text-mist">
              A rendering error stopped blueprint mid-draw.
            </p>
            <pre className="mt-4 overflow-x-auto border border-line bg-panel p-3 font-mono text-[11px] whitespace-pre-wrap text-faint">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 border border-bp/60 bg-bp/10 px-4 py-2 font-mono text-[12px] tracking-wider text-bp uppercase transition-colors hover:bg-bp/20"
            >
              Redraw the sheet
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
