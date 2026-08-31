/**
 * Template prompt AI Si Lestari.
 * Sumber: PRD_SiLestari.md §9.1 (validasi) dan §9.2 (chatbot RAG).
 * Perubahan hanya boleh menyentuh format, jangan semangat prompt-nya.
 */

type ValidateInput = {
  kata: string;
  arti: string;
  daerah: string;
  contoh_kalimat?: string;
};

/** Validasi & enrichment entri (F-02). Minta JSON murni agar mudah diparse. */
export function buildValidatePrompt({
  kata,
  arti,
  daerah,
  contoh_kalimat,
}: ValidateInput): string {
  return `Kamu asisten linguistik untuk platform pelestarian bahasa daerah Indonesia.
Analisis entri berikut dan balas HANYA dalam JSON valid tanpa teks lain.

Kata      : ${kata}
Arti      : ${arti}
Daerah    : ${daerah}
Contoh    : ${contoh_kalimat?.trim() ? contoh_kalimat : "-"}

Format balasan:
{
  "is_dialect": boolean,
  "kategori": string,
  "contoh_kalimat": string,
  "catatan": string
}

Aturan kolom:
- "is_dialect": true jika ini kosakata daerah/dialek asli, false jika hanya variasi ejaan Bahasa Indonesia standar.
- "kategori": WAJIB salah satu dari: "kata benda", "kata kerja", "ekspresi", "peribahasa", "lainnya".
- "contoh_kalimat": jika Contoh di atas "-", buat 1 kalimat natural memakai kata ini (boleh Bahasa daerah + cukup mudah dipahami). Jika sudah ada, kembalikan apa adanya.
- "catatan": catatan singkat, mis. sinonim yang mirip atau konteks pemakaian. Kosongkan ("") jika tidak ada.`;
}

type RetrievedEntry = {
  id?: string;
  kata: string;
  arti: string;
  daerah: string;
  contoh_kalimat?: string;
};

/** Chatbot RAG (F-05): jawab berbasis data kamus, fallback pengetahuan umum. */
export function buildChatPrompt(
  question: string,
  entries: RetrievedEntry[],
): string {
  const data = entries.length
    ? JSON.stringify(
        entries.map((e) => ({
          kata: e.kata,
          arti: e.arti,
          daerah: e.daerah,
          contoh: e.contoh_kalimat || undefined,
        })),
        null,
        2,
      )
    : "(tidak ada entri relevan di kamus)";

  return `Kamu "Si Lestari", pemandu ramah untuk belajar bahasa daerah Indonesia.
Gunakan DATA berikut bila relevan untuk menjawab. Jika data tidak memuat jawaban,
jawab dari pengetahuan umummu, lalu ajak pengguna menambahkan entri bila ia tahu versi lain.
Selalu sertakan contoh kalimat bila memungkinkan. Jawab singkat, hangat, Bahasa Indonesia.
Jangan gunakan emoji. Jangan gunakan tanda pisah em-dash.

DATA:
${data}

Pertanyaan: ${question}`;
}
