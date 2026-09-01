"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterPanel, type Filters } from "./FilterPanel";

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  /** Jumlah kata nyata per daerah, dari /api/stats. */
  counts?: Record<string, number>;
};

export function FilterPanelMobile({ filters, onChange, onReset, counts }: Props) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (filters.daerah ? 1 : 0) +
    filters.kategori.length +
    filters.status.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="btn-pill btn-pill-sm btn-pill-outline md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-sl-kilau-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] overflow-y-auto p-0">
        <SheetHeader className="border-b border-sl-ink-100 px-6 py-4">
          <SheetTitle className="text-base font-bold text-sl-ink-900">
            Filter Kata
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            counts={counts}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
