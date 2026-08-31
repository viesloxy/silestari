/**
 * Seed kamus dari scripts/seed-data.json ke PocketBase.
 *
 * Pemakaian (dari apps/web):
 *   npm run seed            # skip kalau sudah ada entri
 *   npm run seed -- --force # tetap seed walau sudah ada
 *
 * Aman dijalankan ulang ke instance mana pun (lokal/PocketHost/Fly.io):
 * cukup ganti env di .env.local lalu jalankan lagi.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import PocketBase from "pocketbase";

const __dirname = dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes("--force");

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

const existing = await pb.collection("entries").getList(1, 1);
if (existing.totalItems > 0 && !force) {
  console.log(
    `= Collection entries sudah berisi ${existing.totalItems} record, seed dilewati. Gunakan --force untuk tetap menambah.`,
  );
  process.exit(0);
}

let ok = 0;
let gagal = 0;
for (const entry of seedData) {
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

console.log(`\nSelesai: ${ok} masuk, ${gagal} gagal (target seed ≥ 50 sesuai PRD, saat ini ${seedData.length}).`);
