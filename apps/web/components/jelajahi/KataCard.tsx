import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Entry } from "@/lib/pocketbase";

type Props = { entry: Entry; index?: number };

export function KataCard({ entry, index = 0 }: Props) {
  return (
    <Link
      href={`/kamus/${entry.id}`}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        animation: `fade-in-up 0.6s ease-out ${index * 60}ms forwards`,
        opacity: 0,
      }}
    >
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-sl-ink-500">
        <span>{entry.daerah}</span>
        {entry.ai_kategori && (
          <>
            <span aria-hidden className="text-sl-ink-300">
              &middot;
            </span>
            <span>{entry.ai_kategori}</span>
          </>
        )}
        <span aria-hidden className="text-sl-ink-300">
          &middot;
        </span>
        <span>{entry.upvotes} suara</span>
      </div>

      <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-sl-ink-900 transition-colors group-hover:text-sl-kilau-700">
        {entry.kata}
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-sl-ink-700">
        {entry.arti}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-sl-ink-100 pt-4">
        {entry.ai_validated ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sl-daun-700">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Terverifikasi AI
          </span>
        ) : (
          <span className="text-xs text-sl-ink-500">Menunggu verifikasi</span>
        )}
        <span className="text-xs text-sl-ink-500">
          {entry.kontributor ?? "Anonim"}
        </span>
      </div>
    </Link>
  );
}
