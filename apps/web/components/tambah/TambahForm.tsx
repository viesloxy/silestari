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
  const [status, setStatus] = useState<"idle" | "loading" | "result">("idle");
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

    // Simulate AI processing 1.5s (Fase 5 akan diganti fetch ke /api/validate)
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 1500));
    const durasi_ms = performance.now() - start;

    // Mock hasil AI, keyword-based sederhana untuk Fase 2
    const kategoriGuess = pickKategori(data.kata, data.arti);
    const result: AIResult = {
      kategori: kategoriGuess,
      contoh:
        data.contoh_kalimat && data.contoh_kalimat.trim().length > 0
          ? data.contoh_kalimat
          : buildMockContoh(data.kata, data.daerah),
      catatan: `Kata "${data.kata}" tercatat sebagai kosakata daerah ${data.daerah}. Komunitas akan meninjau dan memberi suara.`,
      durasi_ms,
    };

    setAiResult(result);
    setStatus("result");
    toast.success("Katamu masuk kamus", {
      description: "Terima kasih. Komunitas akan meninjau segera.",
    });

    // Reset form setelah 3 detik, biarkan panel result tetap
    setTimeout(() => reset(), 3000);
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
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-700"
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

function pickKategori(kata: string, arti: string): string {
  const combined = `${kata} ${arti}`.toLowerCase();
  if (combined.includes("makan") || combined.includes("bicara") || combined.includes("belajar"))
    return "kata kerja";
  if (combined.includes("terima kasih") || combined.includes("selamat") || combined.includes("salam"))
    return "ekspresi";
  if (combined.split(" ").length > 3) return "peribahasa";
  return "kata benda";
}

function buildMockContoh(kata: string, daerah: string): string {
  return `Contoh natural memakai kata "${kata}" dalam percakapan sehari-hari di ${daerah}.`;
}
