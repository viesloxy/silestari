import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AjakanTutup() {
  return (
    <section className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600 opacity-0"
          style={{ animation: "fade-in-up 0.8s ease-out forwards" }}
        >
          Giliranmu
        </p>

        <h2
          className="text-4xl font-bold leading-tight tracking-tight text-sl-ink-900 opacity-0 md:text-5xl"
          style={{ animation: "fade-in-up 0.8s ease-out 0.15s forwards" }}
        >
          Satu kata dari kamu,
          <br />
          <span className="bg-gradient-to-r from-sl-kilau-500 to-sl-batik-500 bg-clip-text text-transparent">
            satu warisan tidak jadi hilang.
          </span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-sl-ink-500 opacity-0 md:text-lg"
          style={{ animation: "fade-in-up 0.8s ease-out 0.3s forwards" }}
        >
          Tidak perlu daftar, tidak perlu ribet. Cukup ketik, kami rapikan
          bersama komunitas.
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row"
          style={{ animation: "fade-in-up 0.8s ease-out 0.45s forwards" }}
        >
          <Link
            href="/tambah"
            className="btn-pill btn-pill-lg btn-pill-primary w-full sm:w-auto"
          >
            Tambah Kata Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/tanya"
            className="btn-pill btn-pill-lg btn-pill-outline w-full sm:w-auto"
          >
            Coba Tanya Si Lestari
          </Link>
        </div>
      </div>
    </section>
  );
}
