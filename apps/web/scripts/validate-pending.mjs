/**
 * Backfill validasi AI untuk semua entri yang masih ai_validated=false.
 * Berguna setelah seeding atau kalau ada entri yang gagal divalidasi otomatis.
 *
 * Prasyarat: dev server berjalan (`npm run dev`) karena script memanggil
 * /api/validate agar logika prompt tetap single-source.
 *
 * Pemakaian (dari apps/web):  npm run ai:validate-pending
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const url = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const email = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!url || !email || !password) {
  console.error("✗ Env belum lengkap. Jalankan dari apps/web dengan --env-file=.env.local");
  process.exit(1);
}

const { default: PocketBase } = await import("pocketbase");
const pb = new PocketBase(url);
await pb.collection("_superusers").authWithPassword(email, password);

const pending = await pb.collection("entries").getFullList({
  filter: "ai_validated = false",
  fields: "id,kata,arti,daerah,contoh_kalimat",
});

if (pending.length === 0) {
  console.log("✓ Tidak ada entri yang menunggu validasi.");
  process.exit(0);
}

console.log(`Memvalidasi ${pending.length} entri via ${BASE}/api/validate ...`);

let ok = 0;
let gagal = 0;
for (const e of pending) {
  try {
    const res = await fetch(`${BASE}/api/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`);
    const j = await res.json();
    ok++;
    console.log(`  ✓ ${e.kata} → kategori: ${j.ai_kategori}, dialek: ${j.ai_is_dialect}`);
  } catch (err) {
    gagal++;
    console.error(`  ✗ ${e.kata}:`, err.message);
  }
  await new Promise((r) => setTimeout(r, 1000)); // jaga kuota Gemini
}

console.log(`\nSelesai: ${ok} tervalidasi, ${gagal} gagal.`);
