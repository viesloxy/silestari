"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CloudOff, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Entry } from "@/lib/pocketbase";
import {
  FilterPanel,
  emptyFilters,
  type Filters,
} from "@/components/jelajahi/FilterPanel";
import { FilterPanelMobile } from "@/components/jelajahi/FilterPanelMobile";
import { KataCard } from "@/components/jelajahi/KataCard";
import { EmptyState } from "@/components/jelajahi/EmptyState";
import { SearchBarSticky } from "@/components/jelajahi/SearchBarSticky";
import { SortDropdown } from "@/components/jelajahi/SortDropdown";

const PAGE_SIZE = 12;

function JelajahiInner() {
  const router = useRouter();
  const params = useSearchParams();

  // Derive state from URL
  const initialFilters: Filters = {
    daerah: params.get("daerah") ?? "",
    kategori: params.get("kategori")
      ? params.get("kategori")!.split(",").filter(Boolean)
      : [],
    status: params.get("status")
      ? params.get("status")!.split(",").filter(Boolean)
      : [],
  };
  const initialSearch = params.get("q") ?? "";
  const initialSort = params.get("sort") ?? "terbaru";

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Data dari API (sebelumnya mockEntries, di-wiring di Fase 4)
  const [entries, setEntries] = useState<Entry[]>([]);
  const [totalSemua, setTotalSemua] = useState<number | null>(null);
  const [jumlahDaerah, setJumlahDaerah] = useState<number | null>(null);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state back to URL when they change (shallow)
  useEffect(() => {
    const q = new URLSearchParams();
    if (filters.daerah) q.set("daerah", filters.daerah);
    if (filters.kategori.length) q.set("kategori", filters.kategori.join(","));
    if (filters.status.length) q.set("status", filters.status.join(","));
    if (appliedSearch) q.set("q", appliedSearch);
    if (sort !== "terbaru") q.set("sort", sort);
    const qs = q.toString();
    const url = qs ? `/jelajahi?${qs}` : "/jelajahi";
    router.replace(url, { scroll: false });
  }, [filters, appliedSearch, sort, router]);

  // Fetch dari API setiap filter/search/sort berubah
  useEffect(() => {
    const controller = new AbortController();

    const q = new URLSearchParams();
    if (filters.daerah) q.set("daerah", filters.daerah);
    if (filters.kategori.length) q.set("kategori", filters.kategori.join(","));
    if (filters.status.length) q.set("status", filters.status.join(","));
    if (appliedSearch) q.set("q", appliedSearch);
    q.set("sort", sort);
    q.set("perPage", "500"); // ambil semua hasil filter, slicing di client

    setIsLoading(true);
    fetch(`/api/entries?${q.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEntries(data.items ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Gagal memuat kata:", err);
          setEntries([]);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, appliedSearch, sort]);

  // Total koleksi + jumlah per daerah untuk subtitle & filter (diambil sekali)
  useEffect(() => {
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((stats) => {
        if (stats) {
          setTotalSemua(stats.totalKata);
          setJumlahDaerah(stats.jumlahDaerahAktif);
          setCounts(
            Object.fromEntries(
              (
                stats.perDaerah as { daerah: string; jumlah_kata: number }[]
              ).map((p) => [p.daerah, p.jumlah_kata]),
            ),
          );
        }
      })
      .catch(() => {});
  }, []);

  const visible = entries.slice(0, visibleCount);
  const hasMore = visible.length < entries.length;

  // Reset visibleCount when filter/search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, appliedSearch, sort]);

  const handleResetFilter = () => setFilters(emptyFilters);

  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-24 pb-8 md:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Jelajahi Kamus
            </p>
            <h1 className="animate-fade-in-up mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
              Cari kata di seluruh Nusantara.
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed text-sl-ink-500 opacity-0 md:text-base"
              style={{
                animation: "fade-in-up 0.8s ease-out 0.1s forwards",
              }}
            >
              {totalSemua !== null
                ? `${totalSemua.toLocaleString("id-ID")} kata dari ${jumlahDaerah ?? "beberapa"} daerah, terus bertambah setiap hari.`
                : "Koleksi kata dari seluruh Nusantara, terus bertambah setiap hari."}{" "}
              Filter berdasarkan daerah, kategori, atau cari langsung.
            </p>
          </div>
        </section>

        {/* Search sticky */}
        <SearchBarSticky
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={() => setAppliedSearch(searchInput.trim())}
        />

        {/* Content grid */}
        <section className="py-8 md:py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-[260px_1fr] lg:px-8">
            {/* Filter desktop */}
            <div className="hidden md:block md:sticky md:top-40 md:self-start md:max-h-[calc(100vh-10rem)] md:overflow-y-auto">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilter}
                counts={counts ?? undefined}
              />
            </div>

            {/* Grid + controls */}
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FilterPanelMobile
                    filters={filters}
                    onChange={setFilters}
                    onReset={handleResetFilter}
                    counts={counts ?? undefined}
                  />
                  <p className="text-sm text-sl-ink-500">
                    <span className="font-semibold text-sl-ink-900">
                      {isLoading ? "..." : entries.length}
                    </span>{" "}
                    kata cocok
                  </p>
                </div>
                <SortDropdown value={sort} onChange={setSort} />
              </div>

              {isLoading ? (
                <GridSkeleton />
              ) : visible.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((entry, i) => (
                      <KataCard
                        key={entry.id}
                        entry={entry}
                        index={i % PAGE_SIZE}
                      />
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    {hasMore ? (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="btn-pill btn-pill-md btn-pill-outline"
                      >
                        Muat {Math.min(PAGE_SIZE, entries.length - visible.length)} kata lagi
                      </button>
                    ) : (
                      entries.length > PAGE_SIZE && (
                        <p className="text-sm text-sl-ink-500">
                          Semua {entries.length} kata sudah ditampilkan.
                        </p>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-sl-ink-100 bg-white px-6 py-16 text-center shadow-sm"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sl-batik-50 text-sl-batik-700">
        <CloudOff className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-sl-ink-900">
        Kamus tidak bisa dimuat
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-sl-ink-500">
        Koneksi ke server kamus terganggu. Periksa internetmu atau coba lagi
        sebentar.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-pill btn-pill-md btn-pill-primary mt-6"
      >
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </button>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Memuat kata"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse-slow rounded-2xl border border-sl-ink-100 bg-white p-6"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="h-3 w-24 rounded bg-sl-ink-100" />
          <div className="mt-4 h-7 w-3/4 rounded bg-sl-ink-100" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-sl-ink-50" />
            <div className="h-3 w-5/6 rounded bg-sl-ink-50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JelajahiPage() {
  return (
    <Suspense fallback={<div />}>
      <JelajahiInner />
    </Suspense>
  );
}
