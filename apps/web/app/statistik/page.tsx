import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { KpiRow } from "@/components/statistik/KpiRow";
import { ChartSebaran } from "@/components/statistik/ChartSebaran";
import { ChartStatus } from "@/components/statistik/ChartStatus";
import { TableKontributor } from "@/components/statistik/TableKontributor";
import { getStats, type SafeStats } from "@/lib/stats";

// Angka diambil live dari PocketBase setiap request (MVP; ISR menyusul kalau perlu).
export const dynamic = "force-dynamic";

export default async function StatistikPage() {
  let stats: SafeStats;
  try {
    stats = await getStats();
  } catch (err) {
    console.error("Gagal memuat statistik:", err);
    stats = {
      totalKata: 0,
      totalKontributor: 0,
      jumlahDaerahAktif: 0,
      persenVerified: 0,
      perDaerah: [],
      status: [
        { name: "Terverifikasi", value: 0, color: "#4A9E5A" },
        { name: "Menunggu", value: 0, color: "#B08039" },
        { name: "Diragukan", value: 0, color: "#E5484D" },
      ],
      topKontributor: [],
    };
  }

  const chartSebaran = stats.perDaerah
    .map((s) => ({ nama: s.daerah, kata: s.jumlah_kata }))
    .sort((a, b) => b.kata - a.kata);

  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-24 pb-8 md:pt-28 md:pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Denyut Komunitas
            </p>
            <h1
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 opacity-0 md:text-4xl"
              style={{ animation: "fade-in-up 0.8s ease-out 0.1s forwards" }}
            >
              Angka yang tumbuh setiap hari.
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed text-sl-ink-500 opacity-0 md:text-base"
              style={{ animation: "fade-in-up 0.8s ease-out 0.2s forwards" }}
            >
              Data live dari kontributor seluruh Nusantara. Lihat sebaran per
              daerah, status verifikasi, dan siapa yang paling aktif menjaga.
            </p>
          </div>
        </section>

        {/* KPI cards */}
        <section className="pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <KpiRow stats={stats} />
          </div>
        </section>

        {/* Charts row */}
        <section className="pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
              <ChartSebaran
                data={chartSebaran}
                jumlahDaerah={stats.jumlahDaerahAktif}
              />
              <ChartStatus data={stats.status} />
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TableKontributor items={stats.topKontributor} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
