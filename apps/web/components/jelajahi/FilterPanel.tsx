"use client";

import { daerahList, kategoriList } from "@/lib/daerah";

export type Filters = {
  daerah: string; // slug, empty = semua
  kategori: string[]; // multiple
  status: string[]; // "verified" atau "pending"
};

export const emptyFilters: Filters = {
  daerah: "",
  kategori: [],
  status: [],
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  /** Jumlah kata nyata per daerah (nama daerah -> jumlah), dari /api/stats. */
  counts?: Record<string, number>;
};

export function FilterPanel({ filters, onChange, onReset, counts }: Props) {
  const setDaerah = (slug: string) => onChange({ ...filters, daerah: slug });

  const toggleKategori = (k: string) => {
    const list = filters.kategori.includes(k)
      ? filters.kategori.filter((x) => x !== k)
      : [...filters.kategori, k];
    onChange({ ...filters, kategori: list });
  };

  const toggleStatus = (s: string) => {
    const list = filters.status.includes(s)
      ? filters.status.filter((x) => x !== s)
      : [...filters.status, s];
    onChange({ ...filters, status: list });
  };

  const activeCount =
    (filters.daerah ? 1 : 0) +
    filters.kategori.length +
    filters.status.length;

  return (
    <aside
      aria-label="Filter kata"
      className="space-y-6 rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm"
    >
      {/* Daerah */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-700">
          Daerah
        </h3>
        <div className="space-y-2">
          <label className="group flex cursor-pointer items-center gap-2.5">
            <input
              type="radio"
              name="daerah"
              value=""
              checked={filters.daerah === ""}
              onChange={() => setDaerah("")}
              className="h-4 w-4 cursor-pointer accent-sl-kilau-500"
            />
            <span className="text-sm text-sl-ink-700 transition-colors group-hover:text-sl-kilau-700">
              Semua daerah
            </span>
          </label>
          {daerahList.map((d) => (
            <label
              key={d.slug}
              className="group flex cursor-pointer items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="daerah"
                  value={d.slug}
                  checked={filters.daerah === d.slug}
                  onChange={() => setDaerah(d.slug)}
                  className="h-4 w-4 cursor-pointer accent-sl-kilau-500"
                />
                <span className="text-sm text-sl-ink-700 transition-colors group-hover:text-sl-kilau-700">
                  {d.nama}
                </span>
              </div>
              <span className="text-xs text-sl-ink-500">
                {counts?.[d.nama] ?? ""}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Kategori */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-700">
          Kategori
        </h3>
        <div className="space-y-2">
          {kategoriList.map((k) => (
            <label
              key={k}
              className="group flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="checkbox"
                checked={filters.kategori.includes(k)}
                onChange={() => toggleKategori(k)}
                className="h-4 w-4 cursor-pointer rounded accent-sl-kilau-500"
              />
              <span className="text-sm capitalize text-sl-ink-700 transition-colors group-hover:text-sl-kilau-700">
                {k}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Status */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-700">
          Status
        </h3>
        <div className="space-y-2">
          <label className="group flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.status.includes("verified")}
              onChange={() => toggleStatus("verified")}
              className="h-4 w-4 cursor-pointer rounded accent-sl-kilau-500"
            />
            <span className="text-sm text-sl-ink-700 transition-colors group-hover:text-sl-kilau-700">
              Terverifikasi AI
            </span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.status.includes("pending")}
              onChange={() => toggleStatus("pending")}
              className="h-4 w-4 cursor-pointer rounded accent-sl-kilau-500"
            />
            <span className="text-sm text-sl-ink-700 transition-colors group-hover:text-sl-kilau-700">
              Menunggu verifikasi
            </span>
          </label>
        </div>
      </section>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="btn-pill btn-pill-sm btn-pill-ghost w-full"
        >
          Reset {activeCount} filter
        </button>
      )}
    </aside>
  );
}
