"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Becomes true (and stays true) once the element comes within `rootMargin`
 * of the viewport. Used to load below-the-fold widgets lazily.
 */
export function useInView<T extends Element>(rootMargin: string) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, inView]);

  // Without IntersectionObserver (very old browsers), just load right away.
  return [ref, inView || typeof IntersectionObserver === "undefined"] as const;
}
