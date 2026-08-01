import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

const suggestions = [
  "Matur Nuwun",
  "Peribahasa Minang",
  "Kata Sunda halus",
  "Bahasa Bali",
  "Ekspresi Aceh",
];

export function CariKamus() {
  return (
    <section className="relative border-t border-sl-ink-100 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h3
          className="text-2xl font-bold text-sl-ink-900 opacity-0 md:text-3xl"
          style={{ animation: "fade-in-up 0.8s ease-out forwards" }}
        >
          Cari kata langsung dari sini.
        </h3>
        <p
          className="mt-3 text-sm text-sl-ink-500 opacity-0 md:text-base"
          style={{ animation: "fade-in-up 0.8s ease-out 0.1s forwards" }}
        >
          Ketik kata, arti, atau nama daerah. Kami cari di seluruh kamus.
        </p>

        <form
          action="/jelajahi"
          method="get"
          className="mx-auto mt-8 max-w-xl opacity-0"
          style={{ animation: "fade-in-up 0.8s ease-out 0.2s forwards" }}
          role="search"
          aria-label="Cari di kamus Si Lestari"
        >
          <div className="group flex overflow-hidden rounded-full border border-sl-ink-200 bg-white shadow-md transition-all duration-300 focus-within:border-sl-kilau-400 focus-within:shadow-lg hover:border-sl-kilau-300 hover:shadow-lg">
            <div className="flex items-center pl-5 text-sl-ink-300 transition-colors duration-300 group-focus-within:text-sl-kilau-500">
              <Search className="h-5 w-5" strokeWidth={2} />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Cari kata, arti, atau daerah..."
              aria-label="Kata pencarian"
              className="flex-1 cursor-text bg-transparent px-3 py-4 text-sm text-sl-ink-900 placeholder:text-sl-ink-300 focus:outline-none md:text-base"
            />
            <button
              type="submit"
              className="btn-pill btn-pill-md btn-pill-primary my-1.5 mr-1.5"
            >
              Cari
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-sl-ink-500">
              Coba:
            </span>
            {suggestions.map((s) => (
              <Link
                key={s}
                href={`/jelajahi?q=${encodeURIComponent(s)}`}
                className="cursor-pointer rounded-full border border-sl-ink-100 bg-sl-ink-50 px-3 py-1.5 text-xs font-medium text-sl-ink-700 transition-all duration-200 hover:border-sl-kilau-200 hover:bg-sl-kilau-50 hover:text-sl-kilau-700"
              >
                {s}
              </Link>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
