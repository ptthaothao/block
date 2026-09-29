import type { Embedded } from "@/lib/supabase/embedded";

export type InterestRow = {
  weight: number;
  category: Embedded<{ slug: string; name: string; color: string | null }>;
  tag: Embedded<{ slug: string; name: string }>;
  author: Embedded<{ username: string; display_name: string; avatar_url: string | null }>;
};
