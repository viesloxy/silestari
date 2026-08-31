/**
 * Setup PocketBase Si Lestari (Fase B)
 *
 * Membuat collection `entries` + `chat_logs` sesuai docs/DATABASE.md,
 * lengkap dengan index dan API rules. Idempotent: collection yang sudah
 * ada akan dilewati, jadi aman dijalankan berulang.
 *
 * Pemakaian (dari apps/web):
 *   node --env-file=.env.local scripts/setup-pocketbase.mjs
 *
 * Bekerja untuk backend lokal maupun remote (PocketHost/Fly.io/VM):
 * cukup ganti NEXT_PUBLIC_POCKETBASE_URL + kredensial superuser di .env.local.
 */
import PocketBase from "pocketbase";

const url = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const email = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!url || !email || !password) {
  console.error(
    "✗ Env belum lengkap. Butuh NEXT_PUBLIC_POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD di .env.local",
  );
  process.exit(1);
}

const pb = new PocketBase(url);

// ── 1. Autentikasi superuser ──────────────────────────────────────────────
try {
  await pb.collection("_superusers").authWithPassword(email, password);
  console.log(`✓ Superuser terautentikasi (${email}) @ ${url}`);
} catch (err) {
  console.error("✗ Gagal login superuser:", err.response?.data ?? err.message);
  process.exit(1);
}

// ── 2. Definisi collection sesuai docs/DATABASE.md ────────────────────────
const entriesDef = {
  name: "entries",
  type: "base",
  // "" = publik, null = superuser only
  listRule: "",
  viewRule: "",
  createRule: "", // MVP: publik boleh submit (anti-spam via rate limit Fase 5)
  updateRule: null, // superuser only (naik ke role moderator di v1.2)
  deleteRule: null,
  fields: [
    { name: "kata", type: "text", required: true, min: 1, max: 100 },
    { name: "arti", type: "text", required: true, min: 5, max: 500 },
    { name: "daerah", type: "text", required: true, min: 1, max: 50 },
    { name: "contoh_kalimat", type: "text", max: 500 },
    { name: "audio", type: "file", maxSelect: 1, maxSize: 5242880 }, // 5 MB
    { name: "kontributor", type: "text", max: 50 },
    { name: "ai_validated", type: "bool" },
    { name: "ai_is_dialect", type: "bool" },
    {
      name: "ai_kategori",
      type: "select",
      maxSelect: 1,
      values: ["kata benda", "kata kerja", "ekspresi", "peribahasa", "lainnya"],
    },
    { name: "ai_catatan", type: "text", max: 500 },
    { name: "upvotes", type: "number", min: 0, onlyInt: true },
    // PB v0.23+: timestamp otomatis harus dideklarasikan eksplisit
    { name: "created", type: "autodate", onCreate: true },
    { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
  ],
  indexes: [
    "CREATE INDEX `idx_daerah` ON `entries` (`daerah`)",
    "CREATE INDEX `idx_kategori` ON `entries` (`ai_kategori`)",
    "CREATE INDEX `idx_upvotes` ON `entries` (`upvotes` DESC)",
    "CREATE INDEX `idx_created` ON `entries` (`created` DESC)",
  ],
};

const chatLogsDef = {
  name: "chat_logs",
  type: "base",
  listRule: null, // semua operasi admin-only; dibuat via API route server-side
  viewRule: null,
  createRule: null,
  updateRule: null,
  deleteRule: null,
  fields: [
    { name: "pertanyaan", type: "text", required: true, max: 500 },
    { name: "jawaban", type: "text", required: true, max: 5000 },
    { name: "entri_dipakai", type: "json" }, // array of entry ids
    { name: "session_id", type: "text", max: 50 },
    { name: "latency_ms", type: "number", min: 0, onlyInt: true },
    { name: "created", type: "autodate", onCreate: true },
  ],
  indexes: [
    "CREATE INDEX `idx_session` ON `chat_logs` (`session_id`)",
    "CREATE INDEX `idx_chat_created` ON `chat_logs` (`created` DESC)",
  ],
};

async function ensureCollection(def) {
  try {
    await pb.collections.getOne(def.name);
    console.log(`= Collection "${def.name}" sudah ada, dilewati`);
    return;
  } catch (err) {
    if (err.status !== 404) throw err;
  }
  await pb.collections.create(def);
  console.log(`✓ Collection "${def.name}" dibuat (${def.fields.length} field + ${def.indexes.length} index)`);
}

// ── 3. Buat collection ────────────────────────────────────────────────────
try {
  await ensureCollection(entriesDef);
  await ensureCollection(chatLogsDef);
} catch (err) {
  console.error("✗ Gagal membuat collection:", err.response?.data ?? err.message);
  process.exit(1);
}

// ── 4. Health check + smoke test rules ────────────────────────────────────
const health = await pb.health.check();
console.log(`✓ Health check: ${health.message}`);

const pbPublic = new PocketBase(url); // client tanpa auth, untuk uji rule publik

try {
  const rec = await pbPublic.collection("entries").create({
    kata: "__smoke_test__",
    arti: "Entri uji coba otomatis, akan dihapus kembali",
    daerah: "Jawa",
  });
  console.log("✓ Rule create publik berfungsi (anonim bisa submit)");

  let updateBlocked = false;
  try {
    await pbPublic.collection("entries").update(rec.id, { upvotes: 999 });
  } catch {
    updateBlocked = true;
  }
  console.log(
    updateBlocked
      ? "✓ Rule update terkunci (hanya superuser) — sesuai desain"
      : "✗ PERINGATAN: update publik berhasil padahal seharusnya terkunci!",
  );

  await pb.collection("entries").delete(rec.id);
  console.log("✓ Record uji berhasil dihapus");

  const list = await pb.collection("entries").getList(1, 1);
  console.log(`✓ GET /entries OK (totalItems: ${list.totalItems})`);
} catch (err) {
  console.error("✗ Smoke test gagal:", err.response?.data ?? err.message);
  process.exit(1);
}

console.log("\n🎉 Fase B selesai — backend siap untuk Fase C (wiring data real).");
