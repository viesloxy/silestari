import Image from "next/image";
import Link from "next/link";
import { MailIcon, ArrowRight, Heart } from "lucide-react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const produk = [
  { href: "/jelajahi", label: "Jelajahi Kamus" },
  { href: "/tambah", label: "Tambah Kata" },
  { href: "/tanya", label: "Tanya Si Lestari" },
  { href: "/statistik", label: "Statistik" },
];

const sumber = [
  { href: "#", label: "Panduan Kontributor" },
  { href: "#", label: "API untuk Peneliti" },
  { href: "#", label: "Ekspor Data" },
  { href: "#", label: "Blog Bahasa" },
];

const tim = [
  { href: "#", label: "Tentang Proyek" },
  { href: "#", label: "Tim Pengembang" },
  { href: "#", label: "Kontak" },
  { href: "#", label: "Kode Etik" },
];

const legal = [
  { href: "#", label: "Kebijakan Privasi" },
  { href: "#", label: "Syarat Layanan" },
  { href: "#", label: "Lisensi Data" },
  { href: "#", label: "Status" },
];

function GithubGlyph() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.28-1.67-1.28-1.67-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.8.24 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.41-.56-.22-.96-.48-1.38-.9a3.7 3.7 0 0 1-.9-1.38c-.17-.42-.36-1.05-.41-2.22C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.36 2.22-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}
function XGlyph() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = [
  {
    href: "https://github.com/viesloxy/silestari",
    label: "Github repo Si Lestari",
    Glyph: GithubGlyph,
  },
  { href: "#", label: "Instagram Si Lestari", Glyph: InstagramGlyph },
  { href: "#", label: "X (Twitter) Si Lestari", Glyph: XGlyph },
  {
    href: "mailto:hai@silestari.id",
    label: "Kirim surat elektronik",
    Glyph: MailIcon,
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-sl-ink-100 bg-sl-cream-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-6 md:py-16">
          {/* Brand section (col-span-2 md:col-span-2) */}
          <div className="col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="Si Lestari"
            >
              <Image
                src="/brand/logo.png"
                alt=""
                aria-hidden
                width={40}
                height={40}
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <span className="text-2xl font-bold tracking-tight text-sl-ink-900 transition-colors duration-300 group-hover:text-sl-kilau-600">
                Si Lestari
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sl-ink-500">
              Kamus hidup untuk kosakata bahasa daerah Indonesia. Dibangun
              gotong royong, dijaga komunitas, dilengkapi kecerdasan buatan.
            </p>
            <ul
              aria-label="Media sosial Si Lestari"
              className="mt-6 flex items-center gap-3"
            >
              {socials.map(({ href, label, Glyph }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-sl-ink-100 bg-white text-sl-ink-500 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:border-sl-kilau-200 hover:bg-sl-kilau-50 hover:text-sl-kilau-700 hover:shadow-md"
                  >
                    <Glyph />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Produk */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-sl-ink-900">Produk</h3>
            <ul className="space-y-3">
              {produk.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-sl-ink-500 transition-all duration-300 hover:translate-x-0.5 hover:text-sl-kilau-700"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="ml-0.5 h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sumber */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-sl-ink-900">Sumber</h3>
            <ul className="space-y-3">
              {sumber.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-sl-ink-500 transition-all duration-300 hover:translate-x-0.5 hover:text-sl-kilau-700"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="ml-0.5 h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tim */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-sl-ink-900">Tim</h3>
            <ul className="space-y-3">
              {tim.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-sl-ink-500 transition-all duration-300 hover:translate-x-0.5 hover:text-sl-kilau-700"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="ml-0.5 h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-sl-ink-900">Legal</h3>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-sl-ink-500 transition-all duration-300 hover:translate-x-0.5 hover:text-sl-kilau-700"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="ml-0.5 h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-sl-ink-100 py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-sl-ink-900">
                Dapat kabar kata baru
              </h3>
              <p className="mt-1 text-sm text-sl-ink-500">
                Kirim ke email kamu setiap kata pilihan minggu ini plus
                cerita pendek dari kontributor.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-sl-ink-100 py-6 text-xs text-sl-ink-500 md:flex-row">
          <p className="flex items-center gap-1">
            <span>&copy; 2026 Si Lestari. Dibuat dengan</span>
            <Heart className="h-3.5 w-3.5 fill-sl-kilau-500 text-sl-kilau-500 animate-pulse-slow" />
            <span>untuk warisan Nusantara.</span>
          </p>
          <p>IT CONVERT 2026 &middot; Software Development</p>
        </div>
      </div>
    </footer>
  );
}
