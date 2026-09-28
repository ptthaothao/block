"use client";

import { useEffect, useState } from "react";

/** Ignore scroll jitter smaller than this many pixels. */
const SCROLL_THRESHOLD_PX = 8;

/**
 * "up" after the reader scrolls up, "down" after they scroll down, null near
 * the top of the page. Used to show a bottom bar only when it won't cover
 * what they are reading.
 */
export function useScrollDirection(topOffsetPx: number): "up" | "down" | null {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < topOffsetPx) setDirection(null);
        else if (Math.abs(y - last) >= SCROLL_THRESHOLD_PX) setDirection(y > last ? "down" : "up");
        else return;
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [topOffsetPx]);

  return direction;
}
