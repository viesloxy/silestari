/**
 * Seed kamus dari scripts/seed-data.json ke PocketBase.
 *
 * Idempotent-additive: entri dengan kata yang sudah ada (case-insensitive)
 * dilewati, jadi aman dijalankan berulang dan hanya menambah yang baru.
 *
 * Pemakaian (dari apps/web):  npm run seed
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import PocketBase from "pocketbase";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const email = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!url || !email || !password) {
  console.error("✗ Env belum lengkap. Jalankan dari apps/web dengan --env-file=.env.local");
  process.exit(1);
}

const seedData = JSON.parse(
  readFileSync(join(__dirname, "seed-data.json"), "utf8"),
);

const pb = new PocketBase(url);
await pb.collection("_superusers").authWithPassword(email, password);
console.log(`✓ Superuser terautentikasi @ ${url}`);

// Kata yang sudah ada di database (lowercase) -> dilewati agar tidak duplikat
const existing = await pb.collection("entries").getFullList({
  fields: "kata",
  filter: "ai_validated = true || ai_validated = false",
});
const existingKata = new Set(
  existing.map((e) => e.kata.trim().toLowerCase()),
);

const baru = seedData.filter(
  (e) => !existingKata.has(String(e.kata).trim().toLowerCase()),
);
console.log(
  `Database berisi ${existing.length} entri. Dari ${seedData.length} data seed, ${baru.length} entri baru akan ditambah.`,
);

if (baru.length === 0) {
  console.log("✓ Tidak ada entri baru untuk di-seed.");
  process.exit(0);
}

let ok = 0;
let gagal = 0;
for (const entry of baru) {
  const { id: _id, created: _created, ...data } = entry;
  try {
    await pb.collection("entries").create({
      ...data,
      ai_validated: data.ai_validated ?? false,
      upvotes: data.upvotes ?? 0,
      contoh_kalimat: data.contoh_kalimat ?? "",
    });
    ok++;
    console.log(`  ✓ ${entry.kata} (${entry.daerah})`);
  } catch (err) {
    gagal++;
    console.error(`  ✗ ${entry.kata}:`, err.response?.data ?? err.message);
  }
}

console.log(`\nSelesai: ${ok} masuk, ${gagal} gagal. Total entri di database sekarang: ${existing.length + ok}.`);
