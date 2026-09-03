import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Apakah saya perlu ahli bahasa daerah untuk menyumbang?",
    a: "Tidak. Cukup ketik kata yang kamu tahu beserta artinya. AI akan membantu merapikan, dan penutur lain akan mengukuhkan hasilnya. Semua orang yang tumbuh dengan bahasa daerah adalah ahli untuk konteks itu.",
  },
  {
    q: "Apakah datanya bisa diunduh untuk penelitian?",
    a: "Ekspor CSV atau JSON masuk dalam rencana pengembangan lanjutan. Untuk kebutuhan akademis mendesak, hubungi tim kami dan kami akan menyiapkan potongan dataset sesuai bahasa yang diminta.",
  },
  {
    q: "Bagaimana AI memastikan kata yang saya kirim benar?",
    a: "AI memeriksa keaslian secara linguistik, menyarankan contoh kalimat, dan menandai entri yang mencurigakan. Tapi keputusan final selalu di tangan komunitas melalui sistem verifikasi suara.",
  },
  {
    q: "Bahasa daerah saya belum ada di daftar. Bisa saya tambahkan?",
    a: "Bisa. Saat menambah kata, tulis nama bahasa atau dialek pada kolom Daerah. Kalau belum terdaftar, sistem akan membuat kategori baru secara otomatis.",
  },
  {
    q: "Apakah Si Lestari gratis selamanya?",
    a: "Ya. Si Lestari dibangun di atas layanan open source dan tier gratis. Kami berkomitmen menjaga akses tanpa biaya untuk kontributor dan pembelajar.",
  },
  {
    q: "Bagaimana saya bisa membantu selain menyumbang kata?",
    a: "Kamu bisa memberi suara pada entri yang sudah ada, menandai kata yang keliru, atau membagikan Si Lestari ke keluarga dan komunitas bahasamu. Setiap dukungan penting.",
  },
];

export function FAQ() {
  return (
    <section className="relative bg-sl-cream-50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div
            className="opacity-0"
            style={{ animation: "fade-in-left 0.8s ease-out forwards" }}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sl-kilau-100 text-sl-kilau-700 shadow-md">
              <HelpCircle className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
              Pertanyaan Umum
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
              Yang sering kami dengar.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-sl-ink-500">
              Belum ketemu jawabannya? Tanyakan langsung ke Si Lestari, atau
              hubungi tim lewat kolom kontak di footer.
            </p>
            <Link
              href="/tanya"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sl-kilau-700 transition-all duration-300 hover:text-sl-kilau-600 hover:translate-x-1"
            >
              Tanya langsung ke Si Lestari
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div
            className="opacity-0"
            style={{
              animation: "fade-in-right 0.8s ease-out 0.15s forwards",
            }}
          >
            <Accordion type="single" collapsible className="w-full">
              {items.map((it, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border-b border-sl-ink-100 last:border-0"
                >
                  <AccordionTrigger className="cursor-pointer py-5 text-left text-base font-semibold text-sl-ink-900 transition-colors duration-200 hover:text-sl-kilau-700 hover:no-underline">
                    {it.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[15px] leading-relaxed text-sl-ink-500">
                    {it.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
