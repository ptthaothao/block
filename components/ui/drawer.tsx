"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Small line under the title, e.g. an id. */
  subtitle?: ReactNode;
  children: ReactNode;
  /** Sticky footer, e.g. the form's actions. */
  footer?: ReactNode;
  closeLabel?: string;
  className?: string;
};

/**
 * Full-height panel on the right, built on <dialog> like Sheet: focus is
 * trapped, Esc and the backdrop close it, and the page behind is inert.
 * Full width on phones.
 */
export function Drawer({ open, onClose, title, subtitle, children, footer, closeLabel = "Đóng", className }: DrawerProps) {
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
        "m-0 ml-auto h-dvh max-h-dvh w-full max-w-none flex-col border-0 border-l border-border bg-surface-sunken p-0 text-text shadow-popover backdrop:bg-canvas/70 backdrop:backdrop-blur-sm open:flex sm:w-[420px] motion-safe:open:animate-[drawer-in_200ms_ease-out]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {subtitle && <div className="mt-1 truncate font-mono text-xs text-muted">{subtitle}</div>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="grid size-9 shrink-0 place-items-center rounded-md text-muted transition hover:bg-surface-hover hover:text-text"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
      {footer && (
        <div className="border-t border-border px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
      )}
    </dialog>
  );
}
