"use client";

import { useCallback, useRef, type PointerEvent } from "react";

/**
 * Tap runs `onTap`, holding for `delayMs` runs `onLongPress` instead. Returns
 * pointer handlers to spread on a button; keyboard activation (Enter/Space)
 * still fires onClick, which counts as a tap.
 */
export function useLongPress({ onTap, onLongPress, delayMs }: { onTap: () => void; onLongPress: () => void; delayMs: number }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  return {
    onPointerDown: (event: PointerEvent) => {
      if (event.button !== 0) return;
      fired.current = false;
      clear();
      timer.current = setTimeout(() => {
        fired.current = true;
        onLongPress();
      }, delayMs);
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (event: { preventDefault: () => void }) => event.preventDefault(),
    onClick: () => {
      if (fired.current) {
        fired.current = false;
        return;
      }
      onTap();
    },
  };
}
