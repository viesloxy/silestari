import { mockEntries, type Entry } from "@/lib/mock-data";

export type AnswerBundle = {
  answer: string;
  sources: Entry[];
};

/**
 * Mock keyword-based response. Fase 5 diganti dengan RAG lewat Gemini.
 * Cari entri yang match keyword pertanyaan, susun jawaban naratif dari data.
 */
export function generateMockAnswer(question: string): AnswerBundle {
  const q = question.trim().toLowerCase();

  // Cari entri yang kata, arti, atau daerahnya mengandung keyword pertanyaan
  const tokens = q
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .filter((t) => !STOPWORDS.has(t));

  const scored = mockEntries.map((entry) => {
    let score = 0;
    const kata = entry.kata.toLowerCase();
    const arti = entry.arti.toLowerCase();
    const daerah = entry.daerah.toLowerCase();

    for (const token of tokens) {
      if (kata.includes(token)) score += 5;
      if (arti.includes(token)) score += 3;
      if (daerah.includes(token)) score += 2;
      if (entry.ai_kategori?.includes(token)) score += 2;
    }

    return { entry, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.entry);

  if (matched.length === 0) {
    return {
      answer:
        "Aku belum punya info soal itu di kamus. Kalau kamu tahu jawabannya, boleh dong sumbang ke halaman Tambah Kata. Nanti aku bisa jawab pertanyaan serupa untuk yang lain.",
      sources: [],
    };
  }

  const top = matched[0];
  const answer = buildNarrativeAnswer(question, top, matched);

  return { answer, sources: matched };
}

function buildNarrativeAnswer(
  _question: string,
  top: Entry,
  all: Entry[],
): string {
  const others = all.slice(1);

  let text = `Dalam Bahasa ${top.daerah}, "${top.kata}" berarti ${lowerFirst(top.arti)}`;

  if (top.contoh_kalimat) {
    text += ` Contoh pemakaian: "${top.contoh_kalimat}"`;
  }

  if (others.length > 0) {
    const list = others.map((e) => `"${e.kata}"`).join(" dan ");
    text += ` Ada juga kata terkait yang mungkin membantu: ${list}.`;
  }

  return text;
}

function lowerFirst(s: string): string {
  return s.length > 0 ? s[0].toLowerCase() + s.slice(1) : s;
}

const STOPWORDS = new Set([
  "apa",
  "yang",
  "dari",
  "untuk",
  "dengan",
  "adalah",
  "ini",
  "itu",
  "dan",
  "atau",
  "tapi",
  "juga",
  "saya",
  "kamu",
  "kita",
  "aku",
  "kau",
  "bagaimana",
  "berapa",
  "kenapa",
  "mengapa",
  "kapan",
  "dimana",
  "di",
  "ke",
  "dari",
  "pada",
  "dalam",
  "bahasa",
  "kata",
  "arti",
  "artinya",
  "the",
]);
