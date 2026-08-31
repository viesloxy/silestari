/**
 * Client minim untuk Google Gemini API (server-side ONLY).
 * API key tidak boleh pernah sampai ke browser (PRD §6 keamanan).
 *
 * Model dikontrol lewat env GEMINI_MODEL. Catatan 2026:
 * gemini-2.0-flash sudah retired, default sekarang gemini-3.6-flash.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export function getGeminiModel(): string {
  return GEMINI_MODEL;
}

/** Panggil Gemini dengan satu prompt teks, balas teks gabungan semua part. */
export async function callGemini(
  prompt: string,
  { timeoutMs = 25000 }: { timeoutMs?: number } = {},
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY belum diisi di .env.local");

  const res = await fetch(
    `${ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: AbortSignal.timeout(timeoutMs),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const parts: { text?: string }[] =
    data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((p) => (typeof p.text === "string" ? p.text : ""))
    .join("")
    .trim();

  if (!text) throw new Error("Gemini tidak mengembalikan teks");
  return text;
}

/**
 * Ekstrak objek JSON dari respons LLM: buang fence ```json ... ```,
 * ambil blok { ... } pertama sampai kurung tutup terakhir.
 * PRD §14: jawaban AI JSON tidak selalu valid, jadi selalu try/catch di pemanggil.
 */
export function parseJsonFromLlm<T>(text: string): T {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error("Respons AI tidak memuat objek JSON");
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}
