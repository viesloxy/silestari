import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
          Halaman Tidak Ada
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-5xl">
          Kata ini belum tercatat.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-sl-ink-500">
          Mungkin belum ada yang menyumbang, atau tautannya keliru. Kalau
          kamu tahu katanya, boleh dong tambahkan supaya tersimpan.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tambah"
            className="btn-pill btn-pill-lg btn-pill-primary"
          >
            Sumbang Kata
          </Link>
          <Link
            href="/jelajahi"
            className="btn-pill btn-pill-lg btn-pill-outline"
          >
            Kembali ke Jelajahi
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
