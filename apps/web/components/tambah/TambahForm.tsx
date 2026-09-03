"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { RefreshCw, Send } from "lucide-react";
import { daerahList } from "@/lib/daerah";
import { PanelAI, type AIResult } from "./PanelAI";

const schema = z.object({
  kata: z.string().min(1, "Kata belum diisi").max(100, "Terlalu panjang, maksimum 100 karakter"),
  arti: z.string().min(5, "Arti minimal 5 karakter").max(500, "Terlalu panjang"),
  daerah: z.string().min(1, "Pilih daerah"),
  contoh_kalimat: z.string().max(500, "Terlalu panjang").optional(),
  kontributor: z.string().max(50, "Nama terlalu panjang").optional(),
});

type FormData = z.infer<typeof schema>;

export function TambahForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "result" | "pending"
  >("idle");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      kata: "",
      arti: "",
      daerah: "",
      contoh_kalimat: "",
      kontributor: "",
    },
  });

  const kataValue = watch("kata");

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    setAiResult(null);

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const record: { id: string } = await res.json();

      toast.success("Katamu masuk kamus", {
        description: "Terima kasih. Komunitas akan meninjau segera.",
      });

      // Panel AI: poll status validasi tiap 2 detik, maksimal 35 detik
      // (gemini-3.6-flash thinking kadang >20 detik, beda dari 2.0-flash versi PRD).
      pollAiResult(record.id, data);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Gagal menyimpan kata", {
        description: "Cek koneksi kamu lalu coba lagi ya.",
      });
    }
  };

  const pollAiResult = (id: string, submitted: FormData) => {
    const start = performance.now();
    const interval = setInterval(async () => {
      if (performance.now() - start > 35000) {
        clearInterval(interval);
        setStatus("pending");
        return;
      }
      try {
        const res = await fetch(`/api/entries/${id}`);
        if (!res.ok) return;
        const rec = await res.json();
        if (rec.ai_validated) {
          clearInterval(interval);
          setAiResult({
            kategori: rec.ai_kategori ?? "lainnya",
            contoh:
              rec.contoh_kalimat ||
              submitted.contoh_kalimat ||
              `Contoh pemakaian kata "${submitted.kata}" dalam percakapan sehari-hari.`,
            catatan:
              rec.ai_catatan ||
              `Kata "${submitted.kata}" tercatat sebagai kosakata daerah ${submitted.daerah}. Komunitas akan meninjau dan memberi suara.`,
            durasi_ms: performance.now() - start,
          });
          setStatus("result");
        }
      } catch {
        // biarkan polling lanjut sampai timeout
      }
    }, 2000);
  };

  const onReset = () => {
    reset();
    setStatus("idle");
    setAiResult(null);
  };

  const inputClass =
    "h-12 w-full rounded-full border border-sl-ink-200 bg-white px-5 text-sm text-sl-ink-900 placeholder:text-sl-ink-300 focus:border-sl-kilau-400 focus:outline-none focus:ring-2 focus:ring-sl-kilau-200 transition-all duration-200 disabled:opacity-50";

  const textareaClass =
    "w-full rounded-2xl border border-sl-ink-200 bg-white px-5 py-4 text-sm text-sl-ink-900 placeholder:text-sl-ink-300 min-h-[100px] resize-y focus:border-sl-kilau-400 focus:outline-none focus:ring-2 focus:ring-sl-kilau-200 transition-all duration-200 disabled:opacity-50";

  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
      {/* Form kiri */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Kata */}
        <FormField
          id="kata"
          label="Kata"
          required
          error={errors.kata?.message}
        >
          <input
            id="kata"
            type="text"
            aria-required="true"
            aria-invalid={!!errors.kata}
            placeholder="misal: Matur Nuwun"
            disabled={isSubmitting}
            className={inputClass}
            {...register("kata")}
          />
        </FormField>

        {/* Arti */}
        <FormField
          id="arti"
          label="Arti dalam Bahasa Indonesia"
          required
          error={errors.arti?.message}
        >
          <textarea
            id="arti"
            rows={3}
            aria-required="true"
            aria-invalid={!!errors.arti}
            placeholder="Ungkapan terima kasih dalam Bahasa Jawa halus, biasa disampaikan dengan hormat..."
            disabled={isSubmitting}
            className={textareaClass}
            {...register("arti")}
          />
        </FormField>

        {/* Daerah */}
        <FormField
          id="daerah"
          label="Bahasa atau Daerah Asal"
          required
          error={errors.daerah?.message}
        >
          <div className="relative">
            <select
              id="daerah"
              aria-required="true"
              aria-invalid={!!errors.daerah}
              disabled={isSubmitting}
              className={`${inputClass} cursor-pointer appearance-none pr-10`}
              {...register("daerah")}
            >
              <option value="">Pilih daerah</option>
              {daerahList.map((d) => (
                <option key={d.slug} value={d.nama}>
                  {d.nama}
                </option>
              ))}
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </FormField>

        {/* Contoh */}
        <FormField
          id="contoh_kalimat"
          label="Contoh Kalimat"
          helper="Opsional, tapi sangat membantu. Kalau kosong, AI akan buatkan otomatis."
          error={errors.contoh_kalimat?.message}
        >
          <textarea
            id="contoh_kalimat"
            rows={3}
            placeholder="misal: Matur nuwun sampun rawuh ing griya kula."
            disabled={isSubmitting}
            className={textareaClass}
            {...register("contoh_kalimat")}
          />
        </FormField>

        {/* Kontributor */}
        <FormField
          id="kontributor"
          label="Namamu"
          helper="Opsional. Boleh anonim, kami hormati."
          error={errors.kontributor?.message}
        >
          <input
            id="kontributor"
            type="text"
            placeholder="Nama atau inisial kamu"
            disabled={isSubmitting}
            className={inputClass}
            {...register("kontributor")}
          />
        </FormField>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-pill btn-pill-lg btn-pill-primary sm:flex-1"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Mengirim..." : "Sumbang Kata Sekarang"}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="btn-pill btn-pill-lg btn-pill-ghost"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </form>

      {/* Panel AI kanan */}
      <PanelAI status={status} kata={kataValue} result={aiResult} />
    </div>
  );
}

/* --------------- helpers --------------- */

function FormField({
  id,
  label,
  required,
  helper,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold tracking-[0.14em] text-sl-ink-700"
      >
        {label}
        {required && <span className="ml-1 text-sl-kilau-500">*</span>}
      </label>
      {children}
      {helper && !error && (
        <p className="mt-1.5 text-xs text-sl-ink-500">{helper}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-sl-alarm-500">{error}</p>}
    </div>
  );
}

