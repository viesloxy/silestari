import { NextResponse } from "next/server";
import { createAdminPB, createPB, escapeFilter } from "@/lib/pocketbase";
import { buildChatPrompt } from "@/lib/prompts";
import { callGemini } from "@/lib/gemini";
import { rateLimit } from "@/lib/ratelimit";

/**
 * Chatbot RAG Si Lestari (PRD F-05).
 * Alur: retrieval dari PocketBase -> generation via Gemini (§9.2) -> logging.
 * Kalau Gemini gagal/timeout, jawaban jatuh ke builder deterministik
 * berbasis entri yang sama supaya chat tetap berguna (PRD §14 mitigasi).
 */

type RetrievedEntry = {
  id: string;
  kata: string;
  arti: string;
  daerah: string;
  contoh_kalimat?: string;
};

export async function POST(req: Request) {
  // Lindungi kuota Gemini (PRD §14): 10 pertanyaan/menit per IP
  const rl = rateLimit(req, { limit: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Kamu bertanya terlalu cepat. Tarik napas dulu, coba lagi sebentar." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: { question?: unknown; session_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON valid" }, { status: 400 });
  }

  const question =
    typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
  const sessionId =
    typeof body.session_id === "string" ? body.session_id.slice(0, 50) : "";

  if (!question) {
    return NextResponse.json(
      { error: "Pertanyaan tidak boleh kosong" },
      { status: 400 },
    );
  }

  const start = performance.now();

  // 1. Retrieval: token sederhana, cari di kata/arti/daerah (limit 5)
  const pb = createPB();
  const tokens = [
    ...new Set(
      question
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2),
    ),
  ].slice(0, 8);

  let retrieved: RetrievedEntry[] = [];
  try {
    if (tokens.length > 0) {
      const filter = tokens
        .map(
          (t) =>
            `kata ~ "${escapeFilter(t)}" || arti ~ "${escapeFilter(t)}" || daerah ~ "${escapeFilter(t)}"`,
        )
        .join(" || ");
      const result = await pb.collection("entries").getList(1, 5, {
        filter,
        sort: "-upvotes",
      });
      retrieved = result.items as unknown as RetrievedEntry[];
    }
  } catch (err) {
    console.error("GET /api/chat retrieval:", err);
  }

  // 2. Generation via Gemini; fallback deterministik kalau AI gagal
  let answer: string;
  try {
    answer = await callGemini(buildChatPrompt(question, retrieved));
  } catch (err) {
    console.error("GET /api/chat generation:", err);
    answer = buildPlaceholderAnswer(question, retrieved);
  }

  const latency_ms = Math.round(performance.now() - start);

  // 3. Logging untuk audit (admin-only collection, best-effort)
  try {
    const admin = await createAdminPB();
    await admin.collection("chat_logs").create({
      pertanyaan: question,
      jawaban: answer,
      entri_dipakai: retrieved.map((e) => e.id),
      session_id: sessionId,
      latency_ms,
    });
  } catch (err) {
    console.error("GET /api/chat logging:", err);
  }

  return NextResponse.json({ answer, sources: retrieved, latency_ms });
}

function buildPlaceholderAnswer(
  question: string,
  entries: RetrievedEntry[],
): string {
  if (entries.length === 0) {
    return [
      "Wah, aku belum menemukan kata yang cocok di kamus untuk pertanyaan itu.",
      "Kamus ini hidup dari sumbangan warga. Kalau kamu tahu jawabannya, yuk tambahkan lewat halaman Sumbang Kata,",
      "supaya penanya berikutnya terbantu.",
    ].join(" ");
  }

  const lines = entries.slice(0, 3).map(
    (e) =>
      `"${e.kata}" (Bahasa ${e.daerah}) artinya ${e.arti}` +
      (e.contoh_kalimat ? ` Contohnya: "${e.contoh_kalimat}".` : ""),
  );

  return [
    `Tentang "${question}", ini yang kutemukan di kamus:`,
    "",
    ...lines.map((l) => `- ${l}`),
    "",
    "Sumber lengkapnya ada di bawah. Kalau tahu versi lain dari daerahmu, sumbangkan ya.",
  ].join("\n");
}
