"use client";

import { Search, ArrowRight, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export function SearchBarSticky({ value, onChange, onSubmit }: Props) {
  return (
    <div className="sticky top-16 z-30 border-b border-sl-ink-100 bg-sl-cream-100/95 py-4 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          role="search"
          aria-label="Cari di kamus"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex items-center overflow-hidden rounded-full border border-sl-ink-200 bg-white shadow-md transition-all duration-300 focus-within:border-sl-kilau-400 focus-within:shadow-lg hover:border-sl-kilau-300"
        >
          <Search
            aria-hidden
            className="ml-5 h-5 w-5 shrink-0 text-sl-ink-300"
            strokeWidth={2}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cari kata, arti, atau daerah..."
            aria-label="Kata pencarian"
            className="h-14 flex-1 cursor-text bg-transparent px-4 text-sm text-sl-ink-900 placeholder:text-sl-ink-300 focus:outline-none md:text-base"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                onSubmit();
              }}
              aria-label="Bersihkan pencarian"
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-sl-ink-500 transition-colors hover:bg-sl-ink-50 hover:text-sl-ink-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="btn-pill btn-pill-md btn-pill-primary my-1.5 mr-1.5"
          >
            Cari
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
