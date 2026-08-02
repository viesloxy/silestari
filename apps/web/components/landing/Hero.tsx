import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollRotate } from "@/components/motion/ScrollRotate";

export function Hero() {
  return (
    <section
      className="relative -mt-16 overflow-hidden pt-32 pb-16 md:pt-36 md:pb-20"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_minmax(0,540px)_1fr] md:gap-4">
          {/* Mascot kiri: mulai miring KANAN (+8), scroll ke miring KIRI dramatis (-25). Swing 33°. */}
          <div className="hidden animate-fade-in-left justify-end md:flex">
            <ScrollRotate
              initialRotate={8}
              finalRotate={-50}
              initialY={0}
              finalY={-20}
            >
              <Image
                src="/brand/mascot.png"
                alt="Ilustrasi Lestari, gadis dengan pakaian batik"
                width={280}
                height={280}
                priority
                className="h-auto w-[190px] drop-shadow-2xl lg:w-[240px]"
              />
            </ScrollRotate>
          </div>

          {/* Konten center */}
          <div className="text-center">
            <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Kamus Kolaboratif Bahasa Daerah
            </p>

            <h1
              id="hero-heading"
              className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-sl-ink-900 sm:text-5xl md:text-[3.25rem]"
            >
              <span className="inline-block animate-fade-in-up">
                Kata dari kampung,
              </span>
              <br />
              <span
                className="inline-block bg-gradient-to-r from-sl-kilau-500 via-sl-kilau-600 to-sl-batik-500 bg-clip-text text-transparent opacity-0"
                style={{
                  animation:
                    "fade-in-up 0.8s ease-out 0.3s forwards, pulse-slow 3s ease-in-out 1.1s infinite",
                }}
              >
                hidup di layar kita.
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-sl-ink-500 opacity-0 md:text-base"
              style={{ animation: "fade-in-up 0.8s ease-out 0.5s forwards" }}
            >
              Simpan kosakata daerah bersama ribuan penutur. Diperiksa AI,
              dikukuhkan komunitas, bisa dipakai selamanya.
            </p>

            <div
              className="mt-8 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row"
              style={{ animation: "fade-in-up 0.8s ease-out 0.7s forwards" }}
            >
              <Link
                href="/tambah"
                className="btn-pill btn-pill-lg btn-pill-primary w-full sm:w-auto"
              >
                Sumbang Kata Pertamamu
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jelajahi"
                className="btn-pill btn-pill-lg btn-pill-outline w-full sm:w-auto"
              >
                Jelajahi Kamus
              </Link>
            </div>

            <div
              className="mt-8 flex items-center justify-center gap-4 text-xs text-sl-ink-500 opacity-0"
              style={{ animation: "fade-in-up 0.8s ease-out 0.9s forwards" }}
            >
              <span>1 240 kata terdaftar</span>
              <span aria-hidden className="text-sl-ink-300">
                &middot;
              </span>
              <span>24 daerah</span>
              <span aria-hidden className="text-sl-ink-300">
                &middot;
              </span>
              <span>340 kontributor</span>
            </div>
          </div>

          {/* Mascot kanan (flip mirror): mulai miring KIRI visual (-8),
              scroll ke miring KANAN dramatis (+25 visual). Swing 33°.
              rotate positif dengan flip = CW visual dari user POV. */}
          <div
            className="hidden animate-fade-in-right justify-start md:flex"
            style={{ animationDelay: "0.15s" }}
          >
            <ScrollRotate
              initialRotate={-8}
              finalRotate={50}
              initialY={0}
              finalY={-20}
              flip
            >
              <Image
                src="/brand/mascot.png"
                alt=""
                aria-hidden
                width={280}
                height={280}
                priority
                className="h-auto w-[190px] drop-shadow-2xl lg:w-[240px]"
              />
            </ScrollRotate>
          </div>

          {/* Mascot tunggal di mobile */}
          <div className="mt-8 flex justify-center md:hidden">
            <Image
              src="/brand/mascot.png"
              alt="Ilustrasi Lestari, gadis dengan pakaian batik"
              width={200}
              height={200}
              priority
              className="h-auto w-44 drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
