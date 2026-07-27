import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-white dark:bg-neutral-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl shadow-xl space-y-5 text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {this.props.moduleName ? `${this.props.moduleName} Module Encountered an Error` : "Component Rendering Exception"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              An unexpected runtime error occurred while rendering this interface.
            </p>
          </div>
          <div className="text-xs text-rose-700 dark:text-rose-300 font-mono bg-rose-50/50 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-left overflow-x-auto max-h-32">
            {this.state.error?.message || "Unknown rendering exception"}
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload View
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).onNavigate) {
                  (window as any).onNavigate("dashboard");
                } else {
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-neutral-300 dark:border-neutral-700"
            >
              <Home className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
