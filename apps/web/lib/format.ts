const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Format tanggal ISO ke Indonesian, server-safe (tidak pakai toLocaleDateString
 * yang bisa berbeda antara Node dan browser locale).
 * Contoh: "2026-07-20T10:00:00Z" → "20 Juli 2026"
 */
export function formatTanggalIndonesia(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
