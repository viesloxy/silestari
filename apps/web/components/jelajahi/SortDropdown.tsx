"use client";

import { ChevronDown } from "lucide-react";

export const sortOptions = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlama", label: "Terlama" },
  { value: "upvotes", label: "Paling didukung" },
  { value: "alfabet", label: "Alfabetis A ke Z" },
];

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Urutkan hasil"
        className="cursor-pointer appearance-none rounded-full border border-sl-ink-200 bg-white py-2 pl-4 pr-9 text-sm font-medium text-sl-ink-700 shadow-sm transition-all duration-200 hover:border-sl-kilau-300 hover:text-sl-kilau-700 focus:border-sl-kilau-400 focus:outline-none focus:ring-2 focus:ring-sl-kilau-200"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            Urutkan: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sl-ink-500"
      />
    </div>
  );
}
