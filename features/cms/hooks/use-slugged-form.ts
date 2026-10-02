"use client";

import { useRef, useState } from "react";

import { slugify } from "@/lib/slug/slugify";

type Slugged = { id: number | null; slug: string };

/**
 * Form state whose slug follows `sourceKey` (a name or title) until the slug
 * is edited by hand. Existing items keep their slug unless `autoSlug` is used.
 */
export function useSluggedForm<T extends Slugged>(initial: T, sourceKey: keyof T & string) {
  const [form, setForm] = useState(initial);
  const slugTouched = useRef(initial.id !== null);

  const set = <K extends keyof T>(key: K, value: T[K]) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "slug") slugTouched.current = true;
      if (key === sourceKey && !slugTouched.current) next.slug = slugify(String(value));
      return next;
    });

  /** Regenerate the slug from the source field and follow it again. */
  const autoSlug = () => {
    slugTouched.current = false;
    setForm((prev) => ({ ...prev, slug: slugify(String(prev[sourceKey] ?? "")) }));
  };

  return { form, set, autoSlug };
}
