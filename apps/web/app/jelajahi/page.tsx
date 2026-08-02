"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { mockEntries } from "@/lib/mock-data";
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

  // Filter + sort
  const filtered = useMemo(() => {
    let list = mockEntries;

    if (filters.daerah) {
      list = list.filter((e) => e.daerah.toLowerCase() === filters.daerah);
    }
    if (filters.kategori.length) {
      list = list.filter(
        (e) => e.ai_kategori && filters.kategori.includes(e.ai_kategori),
      );
    }
    if (filters.status.length) {
      list = list.filter((e) => {
        if (filters.status.includes("verified") && e.ai_validated) return true;
        if (filters.status.includes("pending") && !e.ai_validated) return true;
        return false;
      });
    }
    if (appliedSearch.trim()) {
      const q = appliedSearch.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.kata.toLowerCase().includes(q) ||
          e.arti.toLowerCase().includes(q) ||
          e.daerah.toLowerCase().includes(q),
      );
    }

    const sorted = [...list];
    if (sort === "terbaru")
      sorted.sort((a, b) => b.created.localeCompare(a.created));
    else if (sort === "terlama")
      sorted.sort((a, b) => a.created.localeCompare(b.created));
    else if (sort === "upvotes") sorted.sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "alfabet")
      sorted.sort((a, b) => a.kata.localeCompare(b.kata));

    return sorted;
  }, [filters, appliedSearch, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

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
              1 240 kata dari 24 daerah, terus bertambah setiap hari. Filter
              berdasarkan daerah, kategori, atau cari langsung.
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
                  />
                  <p className="text-sm text-sl-ink-500">
                    <span className="font-semibold text-sl-ink-900">
                      {filtered.length}
                    </span>{" "}
                    kata cocok
                  </p>
                </div>
                <SortDropdown value={sort} onChange={setSort} />
              </div>

              {visible.length === 0 ? (
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
                        Muat {Math.min(PAGE_SIZE, filtered.length - visible.length)} kata lagi
                      </button>
                    ) : (
                      filtered.length > PAGE_SIZE && (
                        <p className="text-sm text-sl-ink-500">
                          Semua {filtered.length} kata sudah ditampilkan.
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

export default function JelajahiPage() {
  return (
    <Suspense fallback={<div />}>
      <JelajahiInner />
    </Suspense>
  );
}
