import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Entry } from "@/lib/mock-data";
import { KataCard } from "@/components/jelajahi/KataCard";

type Props = {
  items: Entry[];
  daerah: string;
};

export function KataTerkait({ items, daerah }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-sl-ink-100 bg-sl-cream-50 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Kata Terkait
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-3xl">
              Lainnya dari Bahasa {daerah}
            </h2>
          </div>
          <Link
            href={`/jelajahi?daerah=${daerah.toLowerCase()}`}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sl-kilau-700 transition-all duration-300 hover:translate-x-1 hover:text-sl-kilau-600"
          >
            Lihat semua {daerah}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((e, i) => (
            <KataCard key={e.id} entry={e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
