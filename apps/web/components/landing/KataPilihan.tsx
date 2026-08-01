import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Kata = {
  daerah: string;
  kategori: string;
  kata: string;
  arti: string;
  contoh: string;
  kontributor: string;
  gambar: string;
};

const kataPilihan: Kata[] = [
  {
    daerah: "Jawa",
    kategori: "Ekspresi",
    kata: "Matur Nuwun",
    arti:
      "Ungkapan terima kasih yang disampaikan dengan hormat, sering diiringi anggukan halus.",
    contoh: "Matur nuwun sampun rawuh ing griya kula.",
    kontributor: "Aditya P.",
    gambar:
      "https://images.unsplash.com/photo-1552083375-1447ce886485?w=1200&auto=format&fit=crop&q=80",
  },
  {
    daerah: "Minang",
    kategori: "Peribahasa",
    kata: "Alam Takambang Jadi Guru",
    arti:
      "Alam yang terbentang menjadi guru. Belajar dari kejadian di sekitar, bukan hanya dari buku.",
    contoh: "Kok indak dapek di buku, cubo caliak alam.",
    kontributor: "Rina M.",
    gambar:
      "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=1200&auto=format&fit=crop&q=80",
  },
  {
    daerah: "Bali",
    kategori: "Kata Benda",
    kata: "Canang",
    arti:
      "Wadah kecil dari daun kelapa berisi bunga dan dupa, untuk persembahyangan harian.",
    contoh: "Ibu meletakkan canang di depan pintu setiap pagi.",
    kontributor: "Wayan S.",
    gambar:
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&auto=format&fit=crop&q=80",
  },
];

export function KataPilihan() {
  return (
    <section className="relative bg-sl-cream-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end md:text-left">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Dari Kamus
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
              Kata pilihan minggu ini.
            </h2>
          </div>
          <Link
            href="/jelajahi"
            className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-sl-kilau-700 transition-all duration-300 hover:translate-x-1 hover:text-sl-kilau-600"
          >
            Lihat semua kata
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {kataPilihan.map((k, i) => (
            <article
              key={k.kata}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sl-ink-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${i * 150}ms forwards`,
                opacity: 0,
              }}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={k.gambar}
                  alt={`Ilustrasi budaya ${k.daerah}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-white">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-sl-ink-900">
                    {k.daerah}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                    {k.kategori}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-2xl font-bold leading-tight tracking-tight text-sl-ink-900 transition-colors duration-300 group-hover:text-sl-kilau-700">
                  {k.kata}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-sl-ink-500">
                  {k.arti}
                </p>
                <p className="mt-4 border-l-2 border-sl-kilau-200 pl-4 text-sm italic leading-relaxed text-sl-ink-500">
                  &ldquo;{k.contoh}&rdquo;
                </p>
                <p className="mt-5 border-t border-sl-ink-100 pt-4 text-xs text-sl-ink-500">
                  Kontributor {k.kontributor}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
