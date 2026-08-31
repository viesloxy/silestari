import { createPB, type Stats } from "./pocketbase";
import { daerahList } from "./daerah";

/** Alias untuk pemakaian di server component (nilai JSON-safe). */
export type SafeStats = Stats;

const SLUG_BY_NAMA = new Map(daerahList.map((d) => [d.nama, d.slug]));

/**
 * Agregasi statistik komunitas dari PocketBase.
 * Dipakai oleh /api/stats, landing (AngkaKomunitas), dan halaman Statistik.
 * PocketBase belum punya GROUP BY, jadi fetch ringan + reduce di JS
 * (cukup untuk skala MVP, docs/DATABASE.md §8.5).
 */
export async function getStats(): Promise<Stats> {
  const pb = createPB();
  const all = await pb.collection("entries").getFullList({
    fields: "id,daerah,ai_validated,ai_is_dialect,kontributor",
  });

  const totalKata = all.length;
  const totalVerified = all.filter((e) => e.ai_validated).length;
  const totalDiragukan = all.filter((e) => e.ai_is_dialect === false).length;

  const persen = (n: number) =>
    totalKata === 0 ? 0 : Math.round((n / totalKata) * 100);

  // Per daerah
  const byDaerah = new Map<
    string,
    { jumlah_kata: number; kontributor: Set<string>; verified: number }
  >();
  for (const e of all) {
    const key = e.daerah || "Lainnya";
    const row = byDaerah.get(key) ?? {
      jumlah_kata: 0,
      kontributor: new Set<string>(),
      verified: 0,
    };
    row.jumlah_kata++;
    if (e.ai_validated) row.verified++;
    if (e.kontributor) row.kontributor.add(e.kontributor);
    byDaerah.set(key, row);
  }

  const perDaerah = [...byDaerah.entries()]
    .map(([daerah, row]) => ({
      daerah,
      slug: SLUG_BY_NAMA.get(daerah) ?? daerah.toLowerCase(),
      jumlah_kata: row.jumlah_kata,
      jumlah_kontributor: row.kontributor.size,
      persen_terverifikasi: persen(row.verified),
    }))
    .sort((a, b) => b.jumlah_kata - a.jumlah_kata);

  // Kontributor unik global + papan teratas
  const byKontributor = new Map<
    string,
    { jumlah_kata: number; verified: number; daerahCount: Map<string, number> }
  >();
  for (const e of all) {
    const nama = e.kontributor?.trim();
    if (!nama) continue;
    const row =
      byKontributor.get(nama) ??
      { jumlah_kata: 0, verified: 0, daerahCount: new Map<string, number>() };
    row.jumlah_kata++;
    if (e.ai_validated) row.verified++;
    row.daerahCount.set(
      e.daerah || "Lainnya",
      (row.daerahCount.get(e.daerah || "Lainnya") ?? 0) + 1,
    );
    byKontributor.set(nama, row);
  }

  const topKontributor = [...byKontributor.entries()]
    .map(([nama, row]) => {
      const daerahFokus = [...row.daerahCount.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0][0];
      return {
        nama,
        jumlah_kata: row.jumlah_kata,
        verified_pct: persen(row.verified),
        daerah: daerahFokus,
      };
    })
    .sort((a, b) => b.jumlah_kata - a.jumlah_kata)
    .slice(0, 7);

  // Donut status (persen, dibulatkan; slice terakhir menjamin total 100)
  const statusValues = [
    {
      name: "Terverifikasi",
      value: persen(totalVerified),
      color: "#4A9E5A",
    },
    {
      name: "Diragukan",
      value: persen(totalDiragukan),
      color: "#E5484D",
    },
  ];
  const menungguValue = Math.max(
    0,
    100 - statusValues.reduce((sum, s) => sum + s.value, 0),
  );
  const status = [
    ...statusValues.slice(0, 1),
    { name: "Menunggu", value: menungguValue, color: "#B08039" },
    ...statusValues.slice(1),
  ];

  return {
    totalKata,
    totalKontributor: byKontributor.size,
    jumlahDaerahAktif: perDaerah.length,
    persenVerified: persen(totalVerified),
    perDaerah,
    status,
    topKontributor,
  };
}
