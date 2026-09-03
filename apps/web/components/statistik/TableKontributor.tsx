import Link from "next/link";
import type { SafeStats } from "@/lib/stats";

type KontributorRow = SafeStats["topKontributor"][number];

type Props = { items: KontributorRow[] };

const rankColors = [
  "bg-sl-kilau-50 text-sl-kilau-700",
  "bg-sl-batik-50 text-sl-batik-700",
  "bg-sl-daun-50 text-sl-daun-700",
];

export function TableKontributor({ items }: Props) {
  return (
    <div
      className="rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm md:p-8"
      style={{
        animation: "fade-in-up 0.8s ease-out 0.6s forwards",
        opacity: 0,
      }}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-sl-ink-500">
            Papan Kontributor
          </p>
          <h3 className="mt-1 text-xl font-bold text-sl-ink-900">
            Kontributor Teratas
          </h3>
        </div>
        <Link
          href="/tambah"
          className="text-sm font-semibold text-sl-kilau-700 transition-colors hover:text-sl-kilau-600"
        >
          Ikut menyumbang
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-sl-ink-500">
          Belum ada kontributor tercatat. Jadilah yang pertama lewat halaman
          Sumbang Kata.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="sr-only">
              Daftar kontributor teratas Si Lestari beserta jumlah kata dan tingkat verifikasi
            </caption>
            <thead>
              <tr className="border-b border-sl-ink-100 text-left text-xs font-semibold tracking-wider text-sl-ink-500">
                <th className="w-16 py-3 pr-4">Rank</th>
                <th className="py-3 pr-4">Kontributor</th>
                <th className="py-3 pr-4 text-right">Kata</th>
                <th className="py-3 pr-4 text-right">Terverifikasi</th>
                <th className="py-3 text-right">Daerah Fokus</th>
              </tr>
            </thead>
            <tbody>
              {items.map((k, i) => (
                <tr
                  key={k.nama}
                  className="border-b border-sl-ink-100 last:border-0 transition-colors hover:bg-sl-cream-50"
                >
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        i < 3 ? rankColors[i] : "bg-sl-ink-50 text-sl-ink-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-semibold text-sl-ink-900">
                    {k.nama}
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-sl-ink-900">
                    {k.jumlah_kata}
                  </td>
                  <td className="py-4 pr-4 text-right text-sl-ink-700">
                    {k.verified_pct}%
                  </td>
                  <td className="py-4 text-right text-sl-ink-500">{k.daerah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
