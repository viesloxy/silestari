import PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";
import type { Kategori } from "./daerah";

const POCKETBASE_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

/**
 * Client publik untuk operasi tanpa privilege (baca entries, dll).
 * Aman dipakai di server component maupun API route.
 * Operasi tulis sensitif tetap lewat createAdminPB().
 */
export function createPB(): PocketBase {
  return new PocketBase(POCKETBASE_URL);
}

/**
 * Client superuser untuk API route server-side saja.
 * JANGAN pernah dipanggil dari client component.
 */
export async function createAdminPB(): Promise<PocketBase> {
  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection("_superusers").authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL ?? "",
    process.env.POCKETBASE_ADMIN_PASSWORD ?? "",
  );
  return pb;
}

/** Entri kosakata, structurally-match dengan schema PocketBase (docs/DATABASE.md §2). */
export type Entry = RecordModel & {
  kata: string;
  arti: string;
  daerah: string;
  contoh_kalimat?: string;
  audio?: string;
  kontributor?: string;
  ai_validated?: boolean;
  ai_is_dialect?: boolean;
  ai_kategori?: Kategori;
  ai_catatan?: string;
  upvotes?: number;
  created: string;
  updated: string;
};

export type ChatLogRecord = RecordModel & {
  pertanyaan: string;
  jawaban: string;
  entri_dipakai?: string[];
  session_id?: string;
  latency_ms?: number;
};

/** Statistik agregat untuk halaman Statistik + landing (lihat lib/stats.ts). */
export type Stats = {
  totalKata: number;
  totalKontributor: number;
  jumlahDaerahAktif: number;
  persenVerified: number;
  perDaerah: {
    daerah: string;
    slug: string;
    jumlah_kata: number;
    jumlah_kontributor: number;
    persen_terverifikasi: number;
  }[];
  status: { name: string; value: number; color: string }[];
  topKontributor: {
    nama: string;
    jumlah_kata: number;
    verified_pct: number;
    daerah: string;
  }[];
};

/** Escape nilai string untuk filter PocketBase, cegah injection ke expression. */
export function escapeFilter(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
