import Image from "next/image";

type Ceritakan = {
  kutipan: string;
  nama: string;
  peran: string;
  foto: string;
};

const testimoni: Ceritakan[] = [
  {
    kutipan:
      "Nenek saya kalau bicara pakai bahasa Sunda halus, saya tidak pernah paham semua. Sekarang setiap kata baru yang saya dengar, langsung saya cari atau tambah di Si Lestari.",
    nama: "Rina Maulida",
    peran: "Mahasiswa, Bandung",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  },
  {
    kutipan:
      "Saya sudah puluhan tahun ingin merapikan kosakata bahasa daerah kami. Alat seperti ini yang saya tunggu. Prosesnya ringan, tidak seperti mengisi formulir birokrasi.",
    nama: "Pak Hasbi Anwar",
    peran: "Pegiat Bahasa Aceh",
    foto: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&auto=format&fit=crop&q=80",
  },
  {
    kutipan:
      "AI-nya membantu buat contoh kalimat, tapi keputusan akhir tetap di komunitas. Ini keseimbangan yang jarang saya lihat di aplikasi kamus lain.",
    nama: "Dr. Wayan Sudirta",
    peran: "Peneliti Linguistik Universitas Udayana",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  },
];

export function Testimoni() {
  return (
    <section className="relative bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
            Suara Kontributor
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
            Kenapa mereka mau menyumbang kata.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimoni.map((t, i) => (
            <figure
              key={t.nama}
              className="group relative flex h-full cursor-default flex-col overflow-hidden rounded-2xl border border-sl-ink-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${i * 120}ms forwards`,
                opacity: 0,
              }}
            >
              {/* Quote svg dekoratif */}
              <svg
                aria-hidden
                className="absolute right-6 top-6 h-16 w-16 text-sl-kilau-100 transition-colors duration-300 group-hover:text-sl-kilau-200"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 7H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v1c0 1.1-.9 2-2 2H4v2h1c2.21 0 4-1.79 4-4V9c0-1.1-.9-2-2-2zm12 0h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v1c0 1.1-.9 2-2 2h-1v2h1c2.21 0 4-1.79 4-4V9c0-1.1-.9-2-2-2z" />
              </svg>

              <blockquote className="relative flex-1 text-[15px] leading-relaxed text-sl-ink-700">
                {t.kutipan}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-4 border-t border-sl-ink-100 pt-6">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-sl-kilau-200 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={t.foto}
                    alt={`Foto ${t.nama}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-sl-ink-900">
                    {t.nama}
                  </p>
                  <p className="text-xs text-sl-ink-500">{t.peran}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
