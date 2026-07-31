import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex-1">
      {/* ============= NAV ============= */}
      <header className="border-b border-sl-ink-100 bg-sl-ink-0/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Logo Si Lestari"
              width={36}
              height={36}
              priority
            />
            <span className="text-lg font-bold tracking-tight text-sl-ink-900">
              Si Lestari
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-sl-ink-700 md:flex">
            <Link href="#" className="hover:text-sl-primary-600">
              Beranda
            </Link>
            <Link href="#" className="hover:text-sl-primary-600">
              Jelajahi
            </Link>
            <Link href="#" className="hover:text-sl-primary-600">
              Tambah
            </Link>
            <Link href="#" className="hover:text-sl-primary-600">
              Tanya
            </Link>
          </nav>
          <Button size="sm">Tambah Kata</Button>
        </div>
      </header>

      {/* ============= HERO ============= */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr] md:px-8 md:py-24">
        <div className="space-y-6">
          <Badge className="bg-sl-daun-50 text-sl-daun-700 hover:bg-sl-daun-50">
            🌱 Kamus Hidup Nusantara
          </Badge>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-6xl">
            Bahasa daerah kita, <br />
            <span className="text-sl-primary-500">dijaga bersama.</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-sl-ink-500">
            Sumbang kata, cari makna, dan ngobrol dengan{" "}
            <span className="font-medium text-sl-ink-700">Si Lestari</span> —
            teman belajarmu yang tumbuh bersama komunitas.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg">Mulai Menyumbang</Button>
            <Button size="lg" variant="outline">
              Jelajahi Kosakata
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-8 rounded-full bg-sl-primary-100/50 blur-3xl" />
          <Image
            src="/brand/mascot.png"
            alt="Ilustrasi Lestari, maskot Si Lestari"
            width={320}
            height={320}
            priority
            className="relative drop-shadow-xl"
          />
        </div>
      </section>

      {/* ============= DESIGN SYSTEM PROOF ============= */}
      <section className="border-t border-sl-ink-100 bg-sl-ink-0">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-sl-primary-600">
              Design System · Verifikasi Aktif
            </p>
            <h2 className="mt-2 text-3xl font-bold text-sl-ink-900">
              Palet, Tipografi, Komponen
            </h2>
            <p className="mt-2 max-w-xl text-sl-ink-500">
              Halaman ini membuktikan bahwa font Plus Jakarta Display, token
              warna, dan komponen shadcn/ui sudah tertaut dengan benar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Palet Warna</CardTitle>
                <CardDescription>
                  Diturunkan dari logo &amp; maskot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Swatch label="Primary 500 (Logo)" color="bg-sl-primary-500" />
                  <Swatch label="Batik 500 (Rok)" color="bg-sl-batik-500" />
                  <Swatch label="Daun 500 (Rambut)" color="bg-sl-daun-500" />
                  <Swatch label="Biru 500 (Vest)" color="bg-sl-biru-500" />
                  <Swatch label="Ink 900 (Teks)" color="bg-sl-ink-900" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipografi</CardTitle>
                <CardDescription>Plus Jakarta Display (lokal).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-4xl font-bold text-sl-ink-900">
                  Matur Nuwun
                </p>
                <p className="text-xl font-medium text-sl-ink-700">
                  Terima kasih dalam Bahasa Jawa
                </p>
                <p className="text-sm text-sl-ink-500">
                  Regular · Medium · Bold sudah termuat.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Komponen</CardTitle>
                <CardDescription>Button variants + badge.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Primary</Button>
                  <Button size="sm" variant="secondary">
                    Secondary
                  </Button>
                  <Button size="sm" variant="outline">
                    Outline
                  </Button>
                  <Button size="sm" variant="ghost">
                    Ghost
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className="bg-sl-batik-50 text-sl-batik-700 hover:bg-sl-batik-50">
                    Jawa
                  </Badge>
                  <Badge className="bg-sl-biru-50 text-sl-biru-700 hover:bg-sl-biru-50">
                    kata benda
                  </Badge>
                  <Badge className="bg-sl-daun-50 text-sl-daun-700 hover:bg-sl-daun-50">
                    ✓ Terverifikasi AI
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <h3 className="mb-4 text-xl font-bold text-sl-ink-900">
              Pratinjau Kartu Kata
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <WordCard
                kata="Melati"
                arti="Bunga putih harum yang sering muncul dalam upacara adat."
                contoh="Melati mekar di pekarangan setiap pagi."
                daerah="Umum"
                kategori="kata benda"
                verified
                upvotes={12}
              />
              <WordCard
                kata="Gotong Royong"
                arti="Bekerja sama secara sukarela untuk kepentingan bersama."
                contoh="Warga desa bergotong royong membersihkan sungai."
                daerah="Indonesia"
                kategori="ekspresi"
                verified
                upvotes={48}
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-sl-ink-100 bg-sl-ink-50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-sl-ink-500 md:px-8">
          Si Lestari · Platform Kolaboratif Pelestarian Bahasa Daerah · IT
          CONVERT 2026
        </div>
      </footer>
    </main>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${color} h-8 w-8 rounded-md border border-sl-ink-100 shadow-[var(--shadow-sl-soft)]`}
      />
      <span className="text-sm text-sl-ink-700">{label}</span>
    </div>
  );
}

function WordCard(props: {
  kata: string;
  arti: string;
  contoh: string;
  daerah: string;
  kategori: string;
  verified?: boolean;
  upvotes: number;
}) {
  return (
    <div className="group rounded-lg border border-sl-ink-100 bg-sl-ink-0 p-6 shadow-[var(--shadow-sl-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sl-lift)]">
      <div className="flex items-start justify-between">
        <h4 className="text-2xl font-bold tracking-tight text-sl-ink-900 group-hover:text-sl-primary-700">
          {props.kata}
        </h4>
        <Badge className="bg-sl-batik-50 text-sl-batik-700 hover:bg-sl-batik-50">
          {props.daerah}
        </Badge>
      </div>
      <p className="mt-2 text-sl-ink-700">{props.arti}</p>
      <p className="mt-2 text-sm italic text-sl-ink-500">
        &ldquo;{props.contoh}&rdquo;
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className="bg-sl-biru-50 text-sl-biru-700 hover:bg-sl-biru-50">
          {props.kategori}
        </Badge>
        {props.verified && (
          <Badge className="bg-sl-daun-50 text-sl-daun-700 hover:bg-sl-daun-50">
            ✓ Terverifikasi AI
          </Badge>
        )}
        <span className="ml-auto text-xs font-medium text-sl-ink-500">
          ⬆ {props.upvotes}
        </span>
      </div>
    </div>
  );
}
