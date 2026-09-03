import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createPB, type Entry } from "@/lib/pocketbase";

type Kata = {
  daerah: string;
  kategori: string;
  kata: string;
  arti: string;
  contoh: string;
  kontributor: string;
  gambar: string;
};

// Foto per daerah (aset lokal) supaya visual kartu sesuai asal katanya.
const GAMBAR_DAERAH: Record<string, string> = {
  Jawa: "/daerah/jawa2.jpeg",
  Minang: "/daerah/minangkabau.jpeg",
  Bali: "/daerah/bali.jpeg",
  Batak: "/daerah/batak.jpeg",
};

// Fallback untuk daerah yang belum punya foto lokal (dirotar per kartu).
const GAMBAR_POOL = [
  "https://images.unsplash.com/photo-1552083375-1447ce886485?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&auto=format&fit=crop&q=80",
];

function gambarUntuk(daerah: string, index: number): string {
  return GAMBAR_DAERAH[daerah] ?? GAMBAR_POOL[index % GAMBAR_POOL.length];
}

// Fallback tampilan kalau backend tidak reachable, supaya landing tetap utuh.
const FALLBACK: Kata[] = [
  {
    daerah: "Jawa",
    kategori: "Ekspresi",
    kata: "Matur Nuwun",
    arti:
      "Ungkapan terima kasih yang disampaikan dengan hormat, sering diiringi anggukan halus.",
    contoh: "Matur nuwun sampun rawuh ing griya kula.",
    kontributor: "Aditya P.",
    gambar: "/daerah/jawa2.jpeg",
  },
  {
    daerah: "Minang",
    kategori: "Peribahasa",
    kata: "Alam Takambang Jadi Guru",
    arti:
      "Alam yang terbentang menjadi guru. Belajar dari kejadian di sekitar, bukan hanya dari buku.",
    contoh: "Kok indak dapek di buku, cubo caliak alam.",
    kontributor: "Rina M.",
    gambar: "/daerah/minangkabau.jpeg",
  },
  {
    daerah: "Bali",
    kategori: "Kata Benda",
    kata: "Canang",
    arti:
      "Wadah kecil dari daun kelapa berisi bunga dan dupa, untuk persembahyangan harian.",
    contoh: "Ibu meletakkan canang di depan pintu setiap pagi.",
    kontributor: "Wayan S.",
    gambar: "/daerah/bali.jpeg",
  },
];

async function fetchKataPilihan(): Promise<Kata[]> {
  try {
    const pb = createPB();
    const result = await pb.collection("entries").getList(1, 12, {
      filter: "ai_validated = true",
      sort: "-upvotes",
    });
    if (result.items.length === 0) return FALLBACK;
    const entries = pilihTigaBedaDaerah(result.items as unknown as Entry[]);
    return entries.map((e, i) => ({
      daerah: e.daerah,
      kategori: titleCase(e.ai_kategori ?? "lainnya"),
      kata: e.kata,
      arti: e.arti,
      contoh:
        e.contoh_kalimat ||
        `Contoh pemakaian kata "${e.kata}" dalam percakapan sehari-hari.`,
      kontributor: e.kontributor || "Anonim",
      gambar: gambarUntuk(e.daerah, i),
    }));
  } catch {
    return FALLBACK;
  }
}

/** Ambil 3 entri teratas dengan daerah berbeda, supaya kartu bervariasi. */
function pilihTigaBedaDaerah(entries: Entry[]): Entry[] {
  const seen = new Set<string>();
  const unik: Entry[] = [];
  for (const e of entries) {
    if (!seen.has(e.daerah)) {
      seen.add(e.daerah);
      unik.push(e);
    }
    if (unik.length === 3) return unik;
  }
  for (const e of entries) {
    if (unik.length >= 3) break;
    if (!unik.includes(e)) unik.push(e);
  }
  return unik.slice(0, 3);
}

function titleCase(s: string): string {
  return s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

export async function KataPilihan() {
  const kataPilihan = await fetchKataPilihan();

  return (
    <section className="relative bg-sl-cream-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end md:text-left">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
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
              key={`${k.kata}-${i}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sl-ink-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${i * 150}ms forwards`,
                opacity: 0,
              }}
            >
              {/* Foto daerah sebagai latar, kata sebagai fokus utama */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={k.gambar}
                  alt={`Suasana ${k.daerah} untuk kata ${k.kata}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <span className="text-center text-3xl font-normal leading-snug text-white drop-shadow-md md:text-4xl">
                    {k.kata}
                  </span>
                </div>
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
