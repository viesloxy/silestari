"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

type Props = {
  onReset: () => void;
};

export function ChatHeader({ onReset }: Props) {
  return (
    <header className="sticky top-16 z-20 border-b border-sl-ink-100 bg-sl-cream-100/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-sl-kilau-200">
          <Image
            src="/brand/mascot.png"
            alt="Ilustrasi Lestari, pemandu bahasa daerah"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-sl-ink-900">Si Lestari</p>
          <p className="truncate text-xs text-sl-ink-500">
            Pemandu bahasa daerah kamu
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="btn-pill btn-pill-sm btn-pill-ghost ml-auto"
          title="Mulai ulang percakapan"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Mulai Ulang</span>
        </button>
      </div>
    </header>
  );
}
