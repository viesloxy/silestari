import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Cerita = {
  gambar: string;
  daerah: string;
  judul: string;
  ringkas: string;
  href: string;
};

/**
 * Foto dari Unsplash (bebas dipakai, lisensi Unsplash).
 * Ganti photo ID jika ingin ganti gambar.
 */
const cerita: Cerita[] = [
  {
    gambar:
      "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=1200&auto=format&fit=crop&q=80",
    daerah: "Yogyakarta",
    judul: "Menjaga aksara Jawa lewat kata sehari-hari",
    ringkas:
      "Komunitas penulis muda di Kota Gudeg mengumpulkan kosakata halus yang jarang muncul di kamus resmi.",
    href: "#",
  },
  {
    gambar:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&auto=format&fit=crop&q=80",
    daerah: "Bali",
    judul: "Kata pura yang tidak diajarkan di sekolah",
    ringkas:
      "Tetua Ubud membagikan istilah upacara yang selama ini diwariskan lewat lisan, kini tersimpan permanen.",
    href: "#",
  },
  {
    gambar:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&auto=format&fit=crop&q=80",
    daerah: "Minangkabau",
    judul: "Peribahasa dari nagari yang mulai terlupa",
    ringkas:
      "Perantau Minang di kota besar mencatat pepatah nenek moyang sebelum generasi berikutnya kehilangan konteks.",
    href: "#",
  },
];

export function CeritaKampung() {
  return (
    <section className="relative bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Cerita dari Kampung
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
              Suara dari akar rumput.
            </h2>
            <p className="mt-4 max-w-xl text-base text-sl-ink-500">
              Sepenggal kisah dari kontributor yang menjadikan Si Lestari
              sebagai wadah gotong royong bahasa daerah.
            </p>
          </div>
          <Link
            href="/cerita"
            className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-sl-kilau-700 transition-all duration-300 hover:translate-x-1 hover:text-sl-kilau-600"
          >
            Lihat semua cerita
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cerita.map((c, i) => (
            <Link
              key={c.judul}
              href={c.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sl-ink-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${i * 120}ms forwards`,
                opacity: 0,
              }}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={c.gambar}
                  alt={`Ilustrasi cerita ${c.daerah}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-sl-ink-700 shadow-sm">
                  {c.daerah}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold leading-tight text-sl-ink-900 transition-colors duration-300 group-hover:text-sl-kilau-700">
                  {c.judul}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-sl-ink-500">
                  {c.ringkas}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sl-kilau-700">
                  Baca cerita
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
