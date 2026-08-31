/**
 * Client minim untuk Google Gemini API (server-side ONLY).
 * API key tidak boleh pernah sampai ke browser (PRD §6 keamanan).
 *
 * Kuota free tier 2026 dihitung PER MODEL per hari (mis. gemini-3.6-flash = 20
 * req/hari), jadi callGemini memakai rantai model: model utama dulu, kalau 429
 * pindah otomatis ke daftar fallback. Model chat bisa dipisah lewat env
 * GEMINI_MODEL_CHAT agar kuota model utama tidak tergerus percakapan.
 */

const DEFAULT_MODEL = "gemini-3.6-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

/** Rantai model: override > env utama > default, lalu fallbacks (unik, berurutan). */
function modelChain(override?: string): string[] {
  const chain = [
    override ?? getGeminiModel(),
    ...(process.env.GEMINI_MODEL_FALLBACKS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ];
  return [...new Set(chain)];
}

/** Error kuota (429): tidak ada gunanya retry model yang sama di hari yang sama. */
class QuotaError extends Error {}

async function callModel(
  model: string,
  prompt: string,
  key: string,
  timeoutMs: number,
): Promise<string> {
  const res = await fetch(
    `${ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: AbortSignal.timeout(timeoutMs),
    },
  );

  if (res.status === 429) throw new QuotaError(`Gemini 429: kuota ${model} habis`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API ${model} ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((p) => (typeof p.text === "string" ? p.text : ""))
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini ${model} tidak mengembalikan teks`);
  return text;
}

/**
 * Panggil Gemini dengan satu prompt teks.
 * Per model: 1x retry utk error transient (timeout/5xx). Saat 429: lompat ke
 * model berikutnya di rantai. Latency model thinking normal 2-8 detik,
 * outlier bisa >25 detik.
 */
export async function callGemini(
  prompt: string,
  { timeoutMs = 40000, model }: { timeoutMs?: number; model?: string } = {},
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY belum diisi di .env.local");

  const chain = modelChain(model);
  let lastErr: unknown;

  for (const m of chain) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await callModel(m, prompt, key, timeoutMs);
      } catch (err) {
        lastErr = err;
        if (err instanceof QuotaError) break; // kuota model ini habis, next model
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
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
