"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { ToastContext, type ToastOptions } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils/cn";

const DEFAULT_DURATION_MS = 5_000;
/** Newest toasts stay; older ones drop off so the stack never covers the page. */
const MAX_VISIBLE = 3;

type Toast = ToastOptions & { id: number };

const TONES = {
  neutral: "border-border-strong",
  error: "border-danger/60",
  success: "border-emerald/50",
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);
  const show = useCallback((toast: ToastOptions) => {
    const id = ++nextId.current;
    setToasts((all) => [...all, { ...toast, id }].slice(-MAX_VISIBLE));
  }, []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ol
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </ol>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, toast.durationMs ?? DEFAULT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.durationMs]);

  return (
    <li
      role={toast.tone === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border bg-surface px-4 py-3 text-sm shadow-popover motion-safe:animate-[sheet-in_200ms_ease-out]",
        TONES[toast.tone ?? "neutral"],
      )}
    >
      <span className="min-w-0 flex-1">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            onDismiss();
          }}
          className="min-h-9 shrink-0 rounded-md px-2 font-semibold text-accent transition hover:bg-accent/10"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
        className="grid size-9 shrink-0 place-items-center rounded-md text-faint transition hover:text-text"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}
