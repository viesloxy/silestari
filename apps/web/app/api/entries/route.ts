import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminPB, createPB, escapeFilter } from "@/lib/pocketbase";

// ── GET: daftar entri dengan filter + search + sort ──────────────────────
// Query: ?daerah=&kategori=a,b&status=verified|pending&q=&sort=&page=&perPage=

const SORT_MAP: Record<string, string> = {
  terbaru: "-created",
  terlama: "created",
  upvotes: "-upvotes",
  alfabet: "kata",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const daerah = searchParams.get("daerah")?.trim();
  const kategori = searchParams.get("kategori")?.trim();
  const status = searchParams.get("status")?.trim();
  const q = searchParams.get("q")?.trim();
  const sort = SORT_MAP[searchParams.get("sort") ?? "terbaru"] ?? "-created";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const perPage = Math.min(
    500,
    Math.max(1, parseInt(searchParams.get("perPage") ?? "20") || 20),
  );

  const filters: string[] = [];
  if (daerah) filters.push(`daerah ~ "${escapeFilter(daerah)}"`);
  if (kategori) {
    const cats = kategori
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => `ai_kategori = "${escapeFilter(c)}"`)
      .join(" || ");
    if (cats) filters.push(`(${cats})`);
  }
  if (status === "verified") filters.push("ai_validated = true");
  if (status === "pending") filters.push("ai_validated = false");
  if (q) {
    const kw = escapeFilter(q);
    filters.push(`(kata ~ "${kw}" || arti ~ "${kw}" || daerah ~ "${kw}")`);
  }

  const pb = createPB();
  try {
    const result = await pb.collection("entries").getList(page, perPage, {
      filter: filters.join(" && ") || undefined,
      sort,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/entries:", err);
    return NextResponse.json(
      { error: "Gagal memuat daftar kata" },
      { status: 502 },
    );
  }
}

// ── POST: buat entri baru + trigger validasi AI (fire-and-forget) ────────

const createSchema = z.object({
  kata: z.string().min(1).max(100),
  arti: z.string().min(5).max(500),
  daerah: z.string().min(1).max(50),
  contoh_kalimat: z.string().max(500).optional(),
  kontributor: z.string().max(50).optional(),
  // TODO(Fase 5): audio via multipart, MVP skip
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON valid" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", detail: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const pb = await createAdminPB();
  try {
    const record = await pb.collection("entries").create({
      ...parsed.data,
      contoh_kalimat: parsed.data.contoh_kalimat ?? "",
      kontributor: parsed.data.kontributor ?? "",
      ai_validated: false,
      upvotes: 0,
    });

    // Fire-and-forget validasi AI (aktif otomatis saat GEMINI_API_KEY diisi, Fase 5).
    // Tidak meng-block respons supaya submit tetap cepat (PRD §6 performa).
    if (process.env.GEMINI_API_KEY) {
      const validateUrl = new URL("/api/validate", req.url).toString();
      fetch(validateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id, ...parsed.data }),
      }).catch((err) => console.error("AI validate trigger:", err));
    }

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error("POST /api/entries:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan kata" },
      { status: 502 },
    );
  }
}
