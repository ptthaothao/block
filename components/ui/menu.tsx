"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Either a link (`href`) or an action (`onSelect`). */
export type MenuItem = { id: string; label: string; icon?: ReactNode } & ({ href: string } | { onSelect: () => void });

type MenuProps = {
  /** Accessible name of the trigger, e.g. "Tuỳ chọn cho bài …". */
  label: string;
  items: MenuItem[];
  /** Trigger content; a "⋯" icon by default. */
  trigger?: ReactNode;
  triggerClassName?: string;
  className?: string;
};

const ITEM_CLASS =
  "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-muted transition hover:bg-surface-hover hover:text-text focus-visible:bg-surface-hover focus-visible:text-text focus-visible:outline-none";
const TRIGGER_CLASS =
  "grid size-8 place-items-center rounded-md text-faint transition hover:bg-surface-hover hover:text-text aria-expanded:bg-surface-hover aria-expanded:text-text";

/**
 * A small "⋯" menu: opens below the trigger, closes on outside click, Esc or
 * selection, and supports arrow keys. Focus goes back to the trigger on close.
 */
export function Menu({ label, items, trigger, triggerClassName, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const buttons = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      buttons[(index + step + buttons.length) % buttons.length]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={triggerClassName ?? TRIGGER_CLASS}
      >
        {trigger ?? <MoreHorizontal aria-hidden className="size-4" />}
      </button>
      {open && (
        <ul
          ref={listRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="absolute right-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-lg border border-border-strong bg-surface py-1 shadow-xl"
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              {"href" in item ? (
                <Link href={item.href} role="menuitem" onClick={() => setOpen(false)} className={ITEM_CLASS}>
                  <MenuItemContent item={item} />
                </Link>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  className={ITEM_CLASS}
                >
                  <MenuItemContent item={item} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MenuItemContent({ item }: { item: MenuItem }) {
  return (
    <>
      {item.icon && <span className="shrink-0 text-faint">{item.icon}</span>}
      {item.label}
    </>
  );
}
