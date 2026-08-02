import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Entry } from "@/lib/mock-data";

type Props = { entry: Entry };

export function DetailHeader({ entry }: Props) {
  return (
    <section className="pt-24 pb-6 md:pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-sl-ink-500"
        >
          <Link
            href="/"
            className="transition-colors hover:text-sl-kilau-700"
          >
            Beranda
          </Link>
          <span aria-hidden>›</span>
          <Link
            href="/jelajahi"
            className="transition-colors hover:text-sl-kilau-700"
          >
            Jelajahi
          </Link>
          <span aria-hidden>›</span>
          <Link
            href={`/jelajahi?daerah=${entry.daerah.toLowerCase()}`}
            className="transition-colors hover:text-sl-kilau-700"
          >
            {entry.daerah}
          </Link>
          <span aria-hidden>›</span>
          <span className="font-semibold text-sl-ink-900">{entry.kata}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sl-ink-500">
          <span>{entry.daerah}</span>
          {entry.ai_kategori && (
            <>
              <span aria-hidden className="text-sl-ink-300">
                &middot;
              </span>
              <span>{entry.ai_kategori}</span>
            </>
          )}
          {entry.ai_validated && (
            <>
              <span aria-hidden className="text-sl-ink-300">
                &middot;
              </span>
              <span className="inline-flex items-center gap-1 text-sl-daun-700">
                <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                Terverifikasi AI
              </span>
            </>
          )}
        </div>

        <h1
          className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight text-sl-ink-900 md:text-6xl lg:text-7xl opacity-0"
          style={{ animation: "fade-in-up 0.8s ease-out 0.1s forwards" }}
        >
          {entry.kata}
        </h1>
      </div>
    </section>
  );
}
