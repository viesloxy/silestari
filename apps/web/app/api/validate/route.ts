import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminPB } from "@/lib/pocketbase";
import { kategoriList } from "@/lib/daerah";
import { buildValidatePrompt } from "@/lib/prompts";
import { callGemini, parseJsonFromLlm } from "@/lib/gemini";

/**
 * Validasi & enrichment entri via Gemini (PRD F-02, §9.1).
 * Dipanggil fire-and-forget dari POST /api/entries, jadi kegagalan di sini
 * tidak mempengaruhi submit user; entri tetap tersimpan dengan ai_validated=false.
 */

const schema = z.object({
  id: z.string().min(1),
  kata: z.string().min(1),
  arti: z.string().min(1),
  daerah: z.string().min(1),
  contoh_kalimat: z.string().optional(),
});

type AiVerdict = {
  is_dialect?: unknown;
  kategori?: unknown;
  contoh_kalimat?: unknown;
  catatan?: unknown;
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON valid" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", detail: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }
  const { id, kata, arti, daerah, contoh_kalimat } = parsed.data;

  const pb = await createAdminPB();

  // Ambil record asli (jangan percai contoh dari client) supaya aturan
  // "contoh sudah ada -> jangan ditimpa" akurat (PRD §9.1).
  let record: { contoh_kalimat?: string };
  try {
    record = await pb.collection("entries").getOne(id);
  } catch {
    return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
  }

  try {
    const text = await callGemini(
      buildValidatePrompt({ kata, arti, daerah, contoh_kalimat }),
    );
    const ai = parseJsonFromLlm<AiVerdict>(text);

    // Guard ketat: kategori harus anggota select PocketBase, kalau tidak -> "lainnya"
    const kategori = kategoriList.find((k) => k === ai.kategori) ?? "lainnya";

    const update: Record<string, unknown> = {
      ai_validated: true,
      ai_is_dialect: Boolean(ai.is_dialect),
      ai_kategori: kategori,
      ai_catatan: String(ai.catatan ?? "").slice(0, 500),
    };
    // Isi contoh hanya jika belum ada; jika sudah, AI dikontrak mengembalikan apa adanya
    if (!record.contoh_kalimat?.trim() && typeof ai.contoh_kalimat === "string") {
      update.contoh_kalimat = ai.contoh_kalimat.slice(0, 500);
    }

    const updated = await pb.collection("entries").update(id, update);
    return NextResponse.json({
      ok: true,
      ai_validated: updated.ai_validated,
      ai_is_dialect: updated.ai_is_dialect,
      ai_kategori: updated.ai_kategori,
      ai_catatan: updated.ai_catatan,
      contoh_kalimat: updated.contoh_kalimat,
    });
  } catch (err) {
    // Entri tetap tersimpan (ai_validated=false); komunitas/moderator bisa tinjau manual
    console.error(`POST /api/validate (${id}):`, err);
    return NextResponse.json({ error: "Validasi AI gagal" }, { status: 502 });
  }
}
