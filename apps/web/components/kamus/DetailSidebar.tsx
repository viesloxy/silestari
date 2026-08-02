import { Sparkles, Info } from "lucide-react";
import type { Entry } from "@/lib/mock-data";
import { formatTanggalIndonesia } from "@/lib/format";

type Props = { entry: Entry };

export function DetailSidebar({ entry }: Props) {
  if (!entry.ai_validated) {
    return (
      <aside
        className="rounded-2xl border border-dashed border-sl-ink-200 bg-sl-cream-50 p-6 opacity-0"
        style={{ animation: "fade-in-right 0.8s ease-out 0.2s forwards" }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sl-batik-50 text-sl-batik-700">
          <Info className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-sl-ink-700">
          Menunggu Verifikasi
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-sl-ink-500">
          Kata ini sedang menunggu diperiksa AI dan dikukuhkan komunitas.
          Ikut beri dukungan supaya cepat naik ke atas.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm opacity-0"
      style={{ animation: "fade-in-right 0.8s ease-out 0.2s forwards" }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sl-kilau-50 text-sl-kilau-700">
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-sl-ink-700">
        Analisis AI
      </h3>

      <dl className="mt-5 space-y-4 text-sm">
        {entry.ai_kategori && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-sl-ink-500">
              Kategori
            </dt>
            <dd className="mt-1 inline-flex rounded-full bg-sl-kilau-50 px-3 py-0.5 text-xs font-semibold capitalize text-sl-kilau-700">
              {entry.ai_kategori}
            </dd>
          </div>
        )}

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-sl-ink-500">
            Keaslian Dialek
          </dt>
          <dd className="mt-1 text-sl-ink-900">
            {entry.ai_is_dialect === false
              ? "Bukan dialek asli"
              : "Kosakata daerah asli"}
          </dd>
        </div>

        {entry.ai_catatan && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-sl-ink-500">
              Catatan
            </dt>
            <dd className="mt-1 leading-relaxed text-sl-ink-700">
              {entry.ai_catatan}
            </dd>
          </div>
        )}

        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-sl-ink-500">
            Diperiksa
          </dt>
          <dd className="mt-1 text-sl-ink-700">
            {formatTanggalIndonesia(entry.created)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
