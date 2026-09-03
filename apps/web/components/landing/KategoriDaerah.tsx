import Link from "next/link";
import { MapPin } from "lucide-react";

type Daerah = { nama: string; jumlah: number };

const daerahList: Daerah[] = [
  { nama: "Jawa", jumlah: 328 },
  { nama: "Sunda", jumlah: 214 },
  { nama: "Madura", jumlah: 87 },
  { nama: "Minang", jumlah: 156 },
  { nama: "Batak", jumlah: 102 },
  { nama: "Bugis", jumlah: 74 },
  { nama: "Banjar", jumlah: 61 },
  { nama: "Aceh", jumlah: 58 },
  { nama: "Bali", jumlah: 93 },
  { nama: "Sasak", jumlah: 32 },
  { nama: "Papua", jumlah: 18 },
  { nama: "Dayak", jumlah: 27 },
];

export function KategoriDaerah() {
  return (
    <section className="relative bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
            Bahasa yang Sudah Berhimpun
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
            Dua belas bahasa daerah,{" "}
            <span className="bg-gradient-to-r from-sl-kilau-600 to-sl-batik-500 bg-clip-text text-transparent">
              terus bertambah.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-sl-ink-500">
            Setiap chip adalah pintu ke ratusan kata yang dikumpulkan penutur
            asli. Pilih bahasamu, lihat apa yang sudah tersimpan.
          </p>
        </div>

        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {daerahList.map((d, i) => (
            <li
              key={d.nama}
              style={{
                animation: `fade-in-up 0.5s ease-out ${i * 40}ms forwards`,
                opacity: 0,
              }}
            >
              <Link
                href={`/jelajahi?daerah=${d.nama.toLowerCase()}`}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-sl-ink-100 bg-white px-5 py-3 text-sm font-medium text-sl-ink-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sl-kilau-300 hover:bg-sl-kilau-50 hover:text-sl-kilau-700 hover:shadow-md"
              >
                <MapPin
                  className="h-3.5 w-3.5 text-sl-ink-300 transition-colors duration-300 group-hover:text-sl-kilau-500"
                  strokeWidth={2}
                />
                {d.nama}
                <span className="inline-flex h-5 min-w-[24px] items-center justify-center rounded-full bg-sl-ink-50 px-1.5 text-[11px] font-semibold text-sl-ink-500 transition-colors duration-300 group-hover:bg-sl-kilau-100 group-hover:text-sl-kilau-700">
                  {d.jumlah}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
