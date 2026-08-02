"use client";

import { FormEvent } from "react";
import { SendHorizontal } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function InputBar({ value, onChange, onSubmit, disabled }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <footer className="sticky bottom-0 z-20 border-t border-sl-ink-100 bg-sl-cream-100/95 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 overflow-hidden rounded-full border border-sl-ink-200 bg-white shadow-md transition-all duration-300 focus-within:border-sl-kilau-400 focus-within:shadow-lg">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Tanya apa saja tentang bahasa daerah..."
              aria-label="Tanya Si Lestari"
              disabled={disabled}
              className="h-12 flex-1 cursor-text bg-transparent px-5 text-sm text-sl-ink-900 placeholder:text-sl-ink-300 focus:outline-none disabled:opacity-50"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!value.trim() || disabled}
              aria-label="Kirim pesan"
              className="btn-pill btn-pill-md btn-pill-primary mr-1.5 disabled:cursor-not-allowed"
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-sl-ink-500">
            Si Lestari masih belajar. Jawabannya bisa keliru, mohon cek ulang
            di halaman Jelajahi.
          </p>
        </form>
      </div>
    </footer>
  );
}
