import PocketBase from "pocketbase";

const url = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

export const pb = new PocketBase(url);

export type EntryRecord = {
  id: string;
  kata: string;
  arti: string;
  daerah: string;
  contoh_kalimat?: string;
  audio?: string;
  kontributor?: string;
  ai_validated?: boolean;
  ai_is_dialect?: boolean;
  ai_kategori?: "kata benda" | "kata kerja" | "ekspresi" | "peribahasa" | "lainnya";
  ai_catatan?: string;
  upvotes?: number;
  created: string;
  updated: string;
};

export type ChatLogRecord = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  entri_dipakai?: string[];
  created: string;
};
