"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Sticky footer, e.g. the primary action. */
  footer?: ReactNode;
  /** "bottom" slides up from the bottom (mobile); "full" covers the whole screen (composer on mobile). */
  variant?: "bottom" | "full";
  closeLabel?: string;
};

const VARIANTS = {
  bottom: "mt-auto max-h-[85dvh] rounded-t-xl",
  full: "h-dvh max-h-dvh",
} as const;

/**
 * Modal sheet built on <dialog>: the browser traps focus, closes on Esc,
 * makes the page behind inert and returns focus to the opener. Tapping the
 * backdrop also closes it; the page behind does not scroll while it is open
 * (see `body:has(dialog[open])` in globals.css).
 */
export function Sheet({ open, onClose, title, children, footer, variant = "bottom", closeLabel = "Đóng" }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-0 w-full max-w-none flex-col border border-border bg-surface p-0 text-text shadow-popover backdrop:bg-canvas/70 backdrop:backdrop-blur-sm open:flex motion-safe:open:animate-[sheet-in_200ms_ease-out]",
        VARIANTS[variant],
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="grid size-11 place-items-center rounded-md text-muted transition hover:bg-surface-hover hover:text-text"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">{children}</div>
      {footer && <div className="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
    </dialog>
  );
}
