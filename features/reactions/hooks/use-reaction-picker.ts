"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import { REACTION_TIMINGS } from "../constants";

/**
 * Open/close state of a comment's reaction picker: opens after hovering ~500ms
 * (mouse) or a long press (touch), closes ~300ms after the pointer leaves.
 */
export function useReactionPicker() {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const longPressed = useRef(false);

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    clearTimeout(pressTimer.current);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const show = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers]);
  const hide = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (!open) openTimer.current = setTimeout(() => setOpen(true), REACTION_TIMINGS.pickerOpenMs);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), REACTION_TIMINGS.pickerCloseMs);
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    longPressed.current = false;
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      setOpen(true);
    }, REACTION_TIMINGS.longPressMs);
  };
  const cancelPress = () => clearTimeout(pressTimer.current);

  /** True once, right after a long press: the click that follows it must not toggle the reaction. */
  const consumeLongPress = () => {
    const was = longPressed.current;
    longPressed.current = false;
    return was;
  };

  return { open, show, hide, consumeLongPress, handlers: { onPointerEnter, onPointerLeave, onPointerDown, onPointerUp: cancelPress, onPointerCancel: cancelPress } };
}
