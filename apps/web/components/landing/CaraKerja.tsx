import { PenLine, Sparkles, ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const langkah = [
  {
    n: "01",
    icon: PenLine,
    judul: "Sumbang satu kata",
    isi: "Ketik kata daerahmu, arti dalam Bahasa Indonesia, dan asal daerahnya. Tidak perlu ahli linguistik.",
    color: "bg-sl-kilau-50 text-sl-kilau-700",
  },
  {
    n: "02",
    icon: Sparkles,
    judul: "AI merapikan sekejap",
    isi: "Si Lestari memeriksa keaslian, mengklasifikasi jenis kata, dan menyarankan contoh kalimat natural.",
    color: "bg-sl-batik-50 text-sl-batik-700",
  },
  {
    n: "03",
    icon: ThumbsUp,
    judul: "Komunitas mengukuhkan",
    isi: "Penutur lain memberi suara pada entri yang tepat. Kata itu kini tercatat dan bisa dicari siapa saja.",
    color: "bg-sl-daun-50 text-sl-daun-700",
  },
];

export function CaraKerja() {
  return (
    <section className="relative bg-sl-cream-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
            Cara Kerja
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
            Tiga langkah, katamu masuk kamus.
          </h2>
          <p className="mt-4 max-w-xl text-base text-sl-ink-500">
            Prosesnya ringan. Kamu ketik, AI membantu, komunitas mengesahkan.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {langkah.map((l, i) => (
            <Card
              key={l.n}
              className="group relative cursor-default border-0 bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${i * 100}ms forwards`,
                opacity: 0,
              }}
            >
              <CardHeader className="pb-4">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-5xl font-bold leading-none tracking-tight text-sl-kilau-500">
                    {l.n}
                  </span>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${l.color} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}
                  >
                    <l.icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold leading-tight text-sl-ink-900 transition-colors duration-300 group-hover:text-sl-kilau-700">
                  {l.judul}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed text-sl-ink-500 transition-colors duration-200 group-hover:text-sl-ink-700">
                  {l.isi}
                </p>
              </CardContent>

              {/* Connector line, hanya di antara card md-screen */}
              {i < langkah.length - 1 && (
                <div
                  aria-hidden
                  className="absolute -right-4 top-16 hidden h-px w-8 bg-gradient-to-r from-sl-ink-200 to-transparent md:block"
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
