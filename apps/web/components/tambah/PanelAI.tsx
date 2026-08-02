"use client";

import { Wand2, ShieldCheck } from "lucide-react";

export type AIResult = {
  kategori: string;
  contoh: string;
  catatan: string;
  durasi_ms: number;
};

type Props = {
  status: "idle" | "loading" | "result";
  kata: string;
  result: AIResult | null;
};

export function PanelAI({ status, kata, result }: Props) {
  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Panel analisis AI"
      className="rounded-2xl border border-sl-ink-100 bg-white p-7 shadow-sm md:sticky md:top-24 md:self-start"
    >
      {status === "idle" && (
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sl-kilau-50 text-sl-kilau-700">
            <Wand2 className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-sl-ink-900">
            Lestari akan membaca katamu
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-sl-ink-500">
            Setelah kamu klik sumbang, AI akan periksa keaslian, klasifikasi
            jenis kata, dan buat contoh kalimat natural. Kamu tinggal
            konfirmasi.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-sl-ink-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-sl-kilau-500" />
              <span>Cek apakah termasuk kosakata daerah asli</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-sl-kilau-500" />
              <span>Klasifikasi jenis kata (benda, kerja, ekspresi)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-sl-kilau-500" />
              <span>Sarankan contoh kalimat pemakaian</span>
            </li>
          </ul>
        </div>
      )}

      {status === "loading" && (
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sl-kilau-50 text-sl-kilau-700">
            <Wand2 className="h-6 w-6 animate-pulse-slow" strokeWidth={1.75} />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-sl-ink-900">
            Lestari sedang membaca kata ini
          </h3>
          <p className="mt-2 text-sm text-sl-ink-500">
            Sebentar ya, sedang menganalisis <span className="font-semibold text-sl-ink-900">&ldquo;{kata}&rdquo;</span>.
          </p>
          <div className="mt-6 space-y-3">
            <div className="h-3 w-24 animate-pulse-slow rounded bg-sl-ink-100" />
            <div className="h-3 w-full animate-pulse-slow rounded bg-sl-ink-100" />
            <div className="h-3 w-5/6 animate-pulse-slow rounded bg-sl-ink-100" />
            <div className="h-3 w-4/6 animate-pulse-slow rounded bg-sl-ink-100" />
          </div>
        </div>
      )}

      {status === "result" && result && (
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sl-daun-700">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
            <span>Terverifikasi AI</span>
            <span aria-hidden className="text-sl-ink-300">
              &middot;
            </span>
            <span className="normal-case text-sl-ink-500">
              {(result.durasi_ms / 1000).toFixed(1)} detik
            </span>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-500">
                Kategori
              </h4>
              <span className="mt-2 inline-flex items-center rounded-full bg-sl-kilau-50 px-3 py-1 text-xs font-semibold capitalize text-sl-kilau-700">
                {result.kategori}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-500">
                Contoh Kalimat
              </h4>
              <p className="mt-2 border-l-2 border-sl-kilau-200 pl-4 text-sm italic leading-relaxed text-sl-ink-700">
                &ldquo;{result.contoh}&rdquo;
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-500">
                Catatan Lestari
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-sl-ink-700">
                {result.catatan}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
