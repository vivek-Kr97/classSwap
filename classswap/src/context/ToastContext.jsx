import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { uid } from "@/utils/helpers";

const ToastContext = createContext(null);

const TONE_STYLES = {
  success: { icon: CheckCircle2, className: "text-success" },
  error: { icon: XCircle, className: "text-destructive" },
  warning: { icon: TriangleAlert, className: "text-warning" },
  info: { icon: Info, className: "text-primary" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, tone = "success", description) => {
      const id = uid("toast");
      setToasts((list) => [...list, { id, message, tone, description }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
        aria-live="polite"
        role="status"
      >
        {toasts.map((t) => {
          const tone = TONE_STYLES[t.tone] ?? TONE_STYLES.info;
          const Icon = tone.icon;
          return (
            <div
              key={t.id}
              className="animate-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-elevated"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.className}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-card-foreground">{t.message}</p>
                {t.description ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
