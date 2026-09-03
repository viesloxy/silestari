import Image from "next/image";
import Link from "next/link";
import { Users, GraduationCap, Microscope, ArrowRight } from "lucide-react";

type Pathway = {
  icon: typeof Users;
  title: string;
  description: string;
  href: string;
  cta: string;
  colorBg: string;
  colorText: string;
  gambar: string;
};

const pathways: Pathway[] = [
  {
    icon: Users,
    title: "Untuk kontributor dan penutur asli",
    description:
      "Buat kamu yang tumbuh dengan bahasa daerah dan ingin mengabadikan kosakata dari kampung sebelum hilang bersama generasi.",
    href: "/tambah",
    cta: "Sumbang Kata",
    colorBg: "bg-sl-kilau-50",
    colorText: "text-sl-kilau-700",
    gambar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&auto=format&fit=crop&q=80",
  },
  {
    icon: GraduationCap,
    title: "Untuk pembelajar dan pelajar",
    description:
      "Buat kamu yang penasaran dengan bahasa nenek moyang atau ingin belajar dialek daerah lain tanpa harus membuka kamus tebal.",
    href: "/jelajahi",
    cta: "Jelajahi Kamus",
    colorBg: "bg-sl-batik-50",
    colorText: "text-sl-batik-700",
    gambar:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
  },
  {
    icon: Microscope,
    title: "Untuk peneliti dan pegiat bahasa",
    description:
      "Buat kamu yang butuh data terstruktur, mencari korpus percakapan, atau memantau vitalitas bahasa daerah secara real-time.",
    href: "/statistik",
    cta: "Lihat Statistik",
    colorBg: "bg-sl-daun-50",
    colorText: "text-sl-daun-700",
    gambar:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&auto=format&fit=crop&q=80",
  },
];

export function UntukSiapa() {
  return (
    <section className="relative bg-sl-cream-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
            Untuk Siapa Si Lestari
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
            Pilih jalanmu di kamus ini.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-sl-ink-500">
            Tidak peduli dari mana asalmu, apa profesimu, semua orang boleh
            ikut menjaga bahasa daerah.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pathways.map((p, index) => (
            <article
              key={p.title}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sl-ink-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${index * 150}ms forwards`,
                opacity: 0,
              }}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={p.gambar}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${p.colorBg} ${p.colorText} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <p.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold leading-tight text-sl-ink-900 transition-colors duration-300 group-hover:text-sl-kilau-700">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-sl-ink-500">
                  {p.description}
                </p>
                <Link
                  href={p.href}
                  className="btn-pill btn-pill-md btn-pill-outline mt-6 w-full"
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
