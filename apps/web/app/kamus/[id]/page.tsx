import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { mockEntries } from "@/lib/mock-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DetailHeader } from "@/components/kamus/DetailHeader";
import { DetailBody } from "@/components/kamus/DetailBody";
import { KataTerkait } from "@/components/kamus/KataTerkait";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  return mockEntries.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const entry = mockEntries.find((e) => e.id === id);
  if (!entry) return { title: "Kata Tidak Ditemukan" };
  return {
    title: `${entry.kata}, arti Bahasa ${entry.daerah} · Si Lestari`,
    description: entry.arti,
  };
}

export default async function KamusDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const entry = mockEntries.find((e) => e.id === id);
  if (!entry) notFound();

  const terkait = mockEntries
    .filter((e) => e.daerah === entry.daerah && e.id !== entry.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main>
        <DetailHeader entry={entry} />
        <DetailBody entry={entry} />
        <KataTerkait items={terkait} daerah={entry.daerah} />

        {/* CTA closing */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
              Punya versi lain?
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-3xl">
              Ada varian di daerahmu yang belum tercatat?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sl-ink-500">
              Setiap kampung punya cara sendiri. Bagikan varianmu supaya
              kamus ini makin kaya.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tambah"
                className="btn-pill btn-pill-lg btn-pill-primary"
              >
                Sumbang Kata Baru
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jelajahi"
                className="btn-pill btn-pill-lg btn-pill-outline"
              >
                Kembali ke Jelajahi
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
