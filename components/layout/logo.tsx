import Link from "next/link";

import { ROUTES } from "@/config/routes";

export function Logo() {
  return (
    <Link href={ROUTES.home} className="group flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-md bg-accent/15 font-mono text-sm text-accent ring-1 ring-accent/30 transition group-hover:bg-accent/25"
      >
        {"</>"}
      </span>
      {/* On the narrowest phones the mark alone keeps the nav and sign-in button on one line. */}
      <span className="max-[359px]:sr-only">
        code<span className="text-accent">log</span>
      </span>
    </Link>
  );
}
