"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";

import { FILTER_COPY } from "../../constants";
import { countActiveFilters } from "../../utils/post-filters";
import { PostFilterPanel, type PostFilterPanelProps } from "./post-filter-panel";

/** "Lọc (n)" button that opens the filter panel in a bottom sheet, below the lg breakpoint. */
export function MobileFilters({ total, ...panel }: Omit<PostFilterPanelProps, "onSelect"> & { total: number }) {
  const [open, setOpen] = useState(false);
  const active = countActiveFilters(panel.filters);

  return (
    <div className="lg:hidden">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} aria-haspopup="dialog" className="min-h-11">
        <SlidersHorizontal className="size-4" aria-hidden />
        {FILTER_COPY.openFilters(active)}
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={FILTER_COPY.sheetTitle}
        footer={
          <Button fullWidth onClick={() => setOpen(false)} className="min-h-11">
            {FILTER_COPY.showResults(total)}
          </Button>
        }
      >
        {/* Options apply right away (results update behind the sheet); the footer just closes it. */}
        <PostFilterPanel {...panel} />
      </Sheet>
    </div>
  );
}
